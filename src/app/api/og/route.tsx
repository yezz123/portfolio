import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Blog Post";
    const author = searchParams.get("author") || "Yasser Tahiri";
    const date = searchParams.get("date") || new Date().toLocaleDateString();

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            backgroundImage:
              "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
              `,
            }}
          />

          {/* Logo */}
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "80px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                marginRight: "20px",
              }}
            >
              YT
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {author}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "1200px",
              padding: "0 80px",
              textAlign: "center",
            }}
          >
            {/* Blog Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                lineHeight: "1.1",
                marginBottom: "40px",
                textAlign: "center",
                background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </div>

            {/* Date */}
            <div
              style={{
                fontSize: "24px",
                color: "#a0a0a0",
                marginBottom: "60px",
                fontWeight: "500",
              }}
            >
              {date}
            </div>

            {/* Tech Stack Tags */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["Software Engineering", "Technology", "Programming"].map(
                (tag) => (
                  <div
                    key={tag}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "25px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                  >
                    {tag}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Bottom Gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
            }}
          />

          {/* Website URL */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              right: "80px",
              fontSize: "20px",
              color: "#a0a0a0",
              fontWeight: "500",
            }}
          >
            yezz.me
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : "Unknown error"}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
