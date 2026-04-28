import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Subly — Use Now, Pay Never";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(name: string) {
  return await readFile(path.join(process.cwd(), "public", "fonts", name));
}

export default async function Image() {
  const [fraunces, mono, instrument] = await Promise.all([
    loadFont("fraunces.woff"),
    loadFont("jetbrains-mono.woff"),
    loadFont("instrument-serif-italic.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F5F7F2",
          color: "#101522",
          position: "relative",
          padding: "56px 72px",
          fontFamily: "Fraunces",
        }}
      >
        {/* subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(16,21,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,21,34,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* top rule · editorial masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#667085",
            borderBottom: "1px solid #B8C0B8",
            paddingBottom: 20,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: "#7C3AED",
                transform: "rotate(45deg)",
                display: "flex",
              }}
            />
            <span style={{ color: "#101522", fontWeight: 600 }}>Subly</span>
            <span>· Privacy protocol for agents</span>
          </div>
        </div>

        {/* main */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#667085",
              marginBottom: 20,
              display: "flex",
            }}
          >
            § Deposit once · Earn yield · Pay agents privately
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 140,
              lineHeight: 0.9,
              letterSpacing: "0",
              fontWeight: 900,
              color: "#101522",
            }}
          >
            <span style={{ display: "flex" }}>Use Now,</span>
            <span
              style={{
                display: "flex",
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#7C3AED",
                letterSpacing: "0",
              }}
            >
              Pay Never.
            </span>
          </div>

          <div
            style={{
              marginTop: 24,
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 28,
              lineHeight: 1.25,
              color: "#263347",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Turn your yield into AI agent payments — without revealing
            anything.
          </div>
        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 700,
        },
        {
          name: "JetBrains Mono",
          data: mono,
          style: "normal",
          weight: 500,
        },
        {
          name: "Instrument Serif",
          data: instrument,
          style: "italic",
          weight: 400,
        },
      ],
    }
  );
}
