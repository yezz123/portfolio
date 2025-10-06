import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const toEmail = process.env.RESEND_TO_EMAIL || "hello@example.com";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
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

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Verify Turnstile
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    // Send email to site owner
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px;">
            <p>This email was sent from your portfolio contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

This email was sent from your portfolio contact form.
Reply directly to this email to respond to ${name}.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    // Send confirmation email to sender
    await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: [email],
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Your Message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="line-height: 1.6; white-space: pre-wrap; background-color: #ffffff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">${message}</p>
          </div>
          
          <p>I typically respond within 24-48 hours. If your message is urgent, feel free to reach out to me directly.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px;">
            <p>Best regards,<br>Yasser Tahiri</p>
            <p>Software Engineer</p>
          </div>
        </div>
      `,
      text: `
Thank You for Your Message!

Hi ${name},

Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible.

Your Message:
Subject: ${subject}

${message}

I typically respond within 24-48 hours. If your message is urgent, feel free to reach out to me directly.

Best regards,
Yasser Tahiri
Software Engineer
      `,
    });

    return NextResponse.json(
      {
        message: "Email sent successfully",
        emailId: data?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
