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
          background: "#F2EBDC",
          color: "#1A0B2E",
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
              "linear-gradient(to right, rgba(26,11,46,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,11,46,0.05) 1px, transparent 1px)",
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
            color: "#6B5589",
            borderBottom: "1px solid #C9B99A",
            paddingBottom: 20,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: "#8C52FF",
                transform: "rotate(45deg)",
                display: "flex",
              }}
            />
            <span style={{ color: "#1A0B2E", fontWeight: 600 }}>Subly</span>
            <span>· Vol. 01 · Edition α · 2026</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#FF5A4C",
                display: "flex",
              }}
            />
            <span>Devnet live · Phase 4 / 6</span>
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
              color: "#6B5589",
              marginBottom: 20,
              display: "flex",
            }}
          >
            § The privacy protocol for agents
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 140,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontWeight: 900,
              color: "#1A0B2E",
            }}
          >
            <span style={{ display: "flex" }}>Use Now,</span>
            <span
              style={{
                display: "flex",
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#8C52FF",
                letterSpacing: "-0.02em",
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
              color: "#3F2960",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Agents deposit once. Yield settles every x402 call inside a
            TEE vault.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 17,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#1A0B2E",
            borderTop: "1px solid #C9B99A",
            paddingTop: 20,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span>Solana</span>
            <span style={{ color: "#C9B99A" }}>·</span>
            <span>Nitro Enclave</span>
            <span style={{ color: "#C9B99A" }}>·</span>
            <span>Arcium MPC</span>
            <span style={{ color: "#C9B99A" }}>·</span>
            <span>x402</span>
          </div>
          <div style={{ color: "#6B5589", display: "flex" }}>
            subly.fi · @subly_fi
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
    },
  );
}
