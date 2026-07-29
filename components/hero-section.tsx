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
        {/* Yield-receipt vignette — decorative, wide screens only */}
        <aside
          aria-hidden
          className="pointer-events-none absolute right-10 top-1/2 hidden w-[360px] -translate-y-1/2 select-none min-[1360px]:block"
        >
          <div className="border-2 border-ink bg-ink text-paper shadow-[8px_8px_0_0_var(--subly)]">
            <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-glow/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                subly · mcp
              </span>
              <span className="relative ml-auto inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-glow blink" />
              </span>
            </div>
            <div className="space-y-1.5 px-4 py-4 font-mono text-[12px] leading-[1.6]">
              <div className="text-paper/55">&gt; fetch_with_subly_payment</div>
              <div className="text-paper">
                GET /defi/price <span className="text-paper/45">· birdeye</span>
              </div>
              <div className="text-alert">402 Payment Required</div>
              <div className="text-paper/55">→ paying from vault yield…</div>
              <div className="text-glow">✓ paid $0.003 — principal untouched</div>
              <div className="text-paper/55">receipt: solscan.io/tx/3xK…9fQ</div>
            </div>
            <div className="flex items-center justify-between border-t border-paper/10 px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-paper/45">
                Yield budget today
              </span>
              <span className="font-mono text-[13px] font-semibold text-glow">
                $0.27
              </span>
            </div>
          </div>
        </aside>

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

        <p className="mt-8 font-feature text-[28px] leading-[1.2] text-ink md:text-[40px] lg:text-[48px]">
          Your yield pays your AI agent&apos;s API bills
        </p>

        <p className="mt-8 max-w-3xl font-feature text-[20px] leading-[1.4] text-ink-soft md:text-[24px]">
          Deposit USDC once. <span className="text-subly">Earn yield.</span>{" "}
          Your agent pays for x402 APIs from that yield — principal isn&apos;t
          spent on API calls.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5">
          <div
            id="getWaitlistContainer"
            data-waitlist_id="31247"
            data-widget_type="WIDGET_2"
            className="subly-waitlist"
          />
          <a
            href="#connect"
            className="group inline-flex items-center gap-3 border border-subly bg-subly px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-stamp-glow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_var(--subly-deep),12px_12px_0_0_var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-glow blink" />
            </span>
            Connect your agent
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
    </section>
  );
}
