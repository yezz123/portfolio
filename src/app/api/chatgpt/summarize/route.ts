import { NextResponse } from "next/server";
import { loadConfig } from "@/lib/yaml-loader";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per 15 minutes per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY is not configured");
      return false;
    }

    const response = await fetch(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

interface SummarizeRequest {
  content: string;
  title: string;
  type?: "blog" | "article";
  turnstileToken?: string;
}

export async function POST(request: Request) {
  try {
    const config = await loadConfig();

    // Check if ChatGPT is enabled
    if (!config.features?.chatgptSummarization || !config.chatgpt?.enabled) {
      return NextResponse.json(
        { error: "ChatGPT summarization is not enabled" },
        { status: 403 },
      );
    }

    // Rate limiting check
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          },
        },
      );
    }

    const {
      content,
      title,
      type = "blog",
      turnstileToken,
    }: SummarizeRequest = await request.json();

    if (!content || !title) {
      return NextResponse.json(
        { error: "Content and title are required" },
        { status: 400 },
      );
    }

    // Verify Turnstile token (only if secret key is configured)
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: "Verification required" },
          { status: 400 },
        );
      }

      const isTurnstileValid = await verifyTurnstile(turnstileToken);
      if (!isTurnstileValid) {
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 400 },
        );
      }
    }

    const openaiApiKey = config.chatgpt?.apiKey || process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Create a prompt for summarization
    const prompt = `Please provide a concise summary of the following ${type} post. The summary should be 2-3 sentences and capture the main points and key takeaways. Focus on the most important information that would help someone quickly understand what the post is about.

Title: ${title}

Content: ${content.substring(0, 4000)}`; // Limit content to avoid token limits

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.chatgpt?.model || "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: config.chatgpt?.maxTokens || 150,
        temperature: config.chatgpt?.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      summary,
      model: data.model,
      usage: data.usage,
    });
  } catch (error) {
    console.error("ChatGPT summarization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
