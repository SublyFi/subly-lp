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

        <p className="mt-8 font-feature text-[28px] leading-[1.2] text-ink md:text-[40px] lg:text-[48px]">
          Privacy protocol for agents.
        </p>

        <p className="mt-8 max-w-3xl font-feature text-[20px] leading-[1.4] text-ink-soft md:text-[24px]">
          Deposit once.{" "}
          <span className="text-subly">Earn yield.</span> Pay for agent API
          calls without revealing who you paid.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5">
          <div
            id="getWaitlistContainer"
            data-waitlist_id="31247"
            data-widget_type="WIDGET_2"
            className="subly-waitlist"
          />
          <a
            href="#demo"
            className="group inline-flex items-center gap-3 border border-subly bg-subly px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-stamp-glow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_var(--subly-deep),12px_12px_0_0_var(--ink)]"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
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
    </section>
  );
}
