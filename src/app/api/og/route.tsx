/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Blog Post";
    const author = searchParams.get("author") || "Yasser Tahiri";
    const date = searchParams.get("date") || new Date().toLocaleDateString();

    // Determine title size based on length
    const titleLength = title.length;
    const titleSize = titleLength > 50 ? 48 : titleLength > 30 ? 56 : 64;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient Mesh Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse 80% 50% at 20% -20%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 50%, rgba(78, 68, 206, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 50% at 10% 90%, rgba(255, 99, 132, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 40% 60% at 90% 100%, rgba(64, 224, 208, 0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* Grid Pattern Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
          }}
        />

        {/* Header with Logo and Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "48px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Icon Logo */}
            <img
              src={`${new URL(request.url).origin}/icon.svg`}
              alt="Logo"
              width={56}
              height={56}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                objectFit: "cover",
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                {author}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "500",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Software Engineer
              </span>
            </div>
          </div>

          {/* Date Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: "500",
              }}
            >
              {date}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            paddingBottom: "80px",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: "800",
              color: "white",
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              margin: 0,
              maxWidth: "900px",
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </h1>

          {/* Decorative Line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "4px",
                borderRadius: "2px",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              }}
            />
            <div
              style={{
                width: "32px",
                height: "4px",
                borderRadius: "2px",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "4px",
                borderRadius: "2px",
                background: "rgba(255,255,255,0.1)",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 64px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        >
          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {["Backend", "DevOps", "Python"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Website URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={`${new URL(request.url).origin}/icon.svg`}
              alt="Logo"
              width={28}
              height={28}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.6)",
                fontWeight: "600",
                letterSpacing: "-0.01em",
              }}
            >
              yezz.me
            </span>
          </div>
        </div>

        {/* Corner Accents */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "64px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "64px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
      </div>,
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
