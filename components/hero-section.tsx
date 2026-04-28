"use client";

import Script from "next/script";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      {/* Layered atmosphere */}
      <div className="gridlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="gridlines-purple pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 88% -10%, rgba(94,23,235,0.18) 0%, transparent 55%), radial-gradient(circle at -10% 110%, rgba(94,23,235,0.10) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[32%] md:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(94,23,235,0) 0%, rgba(94,23,235,0.05) 60%, rgba(94,23,235,0.12) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <h1 className="font-display font-black leading-[0.82] tracking-tight text-ink">
          <span className="block text-[14vw] md:text-[140px] lg:text-[180px]">
            Use Now,
          </span>
          <span className="relative block text-[14vw] md:text-[140px] lg:text-[180px]">
            <span className="relative inline-block">
              <span className="relative z-10 text-subly">
                Pay&nbsp;Never.
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[8%] z-0 h-[16%] bg-subly/15"
              />
            </span>
          </span>
        </h1>

        <p className="mt-12 max-w-3xl font-feature text-[26px] leading-[1.25] text-ink md:text-[36px]">
          Your AI agent deposits once.
          <span className="text-subly"> The yield —</span> not the principal —
          quietly settles every x402 call, inside a vault no provider, relay,
          or indexer can read.
        </p>

        <p className="mt-6 max-w-2xl font-sans text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
          AI agents can already pay. Funding them is still a human chore.
          Subly ends the top-up loop: a single USDC deposit, routed into
          senior DeFi yield inside an AWS Nitro Enclave, pays for every API
          call your agent makes via{" "}
          <span className="font-mono text-[13px] text-subly">x402</span>.
          Yield routing and application privacy migrate to Arcium MPC as
          Confidential SPL lands in Q3 2026.
        </p>

        <div className="mt-12 flex flex-col items-stretch gap-5 md:flex-row md:items-stretch md:gap-5">
          <div
            id="getWaitlistContainer"
            data-waitlist_id="31247"
            data-widget_type="WIDGET_2"
            className="subly-waitlist w-full md:max-w-[520px] md:flex-1"
          />
          <a
            href="#demo"
            className="group inline-flex items-center justify-center gap-3 border border-subly bg-subly px-7 py-4 font-mono text-[13px] uppercase tracking-[0.22em] text-white shadow-stamp-glow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_var(--subly-deep),12px_12px_0_0_var(--ink)] md:px-8"
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-glow blink" />
            </span>
            Run the live demo
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <link
          rel="stylesheet"
          type="text/css"
          href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
        />
        <Script
          src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"
          strategy="afterInteractive"
        />
      </div>

      <style jsx global>{`
        .subly-waitlist .waitlist-container,
        .subly-waitlist .waitlist-form {
          width: 100% !important;
          max-width: 100% !important;
        }
        .subly-waitlist form {
          display: flex !important;
          flex-wrap: nowrap !important;
          gap: 10px !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        .subly-waitlist input,
        .subly-waitlist button {
          border-radius: 2px !important;
          font-family: var(--font-mono) !important;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 13px !important;
          line-height: 1 !important;
          box-sizing: border-box !important;
        }
        .subly-waitlist input[type="email"] {
          background: var(--paper) !important;
          border: 1px solid var(--ink) !important;
          color: var(--ink) !important;
          padding: 16px 18px !important;
          height: auto !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          width: auto !important;
          margin: 0 !important;
        }
        .subly-waitlist input[type="email"]::placeholder {
          color: var(--ink-muted) !important;
          letter-spacing: 0.14em;
        }
        .subly-waitlist button {
          background: var(--subly) !important;
          color: #ffffff !important;
          border: 1px solid var(--subly) !important;
          padding: 16px 24px !important;
          height: auto !important;
          font-weight: 600 !important;
          flex: 0 0 auto !important;
          white-space: nowrap !important;
          margin: 0 !important;
        }
        .subly-waitlist button:hover {
          background: var(--subly-deep) !important;
          border-color: var(--subly-deep) !important;
        }
      `}</style>
    </section>
  );
}
