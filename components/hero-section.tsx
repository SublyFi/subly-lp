"use client";

import Script from "next/script";

const PILLARS = [
  { kicker: "01", word: "Privacy", note: "Sealed inside Nitro · Arcium-bound" },
  { kicker: "02", word: "Payment", note: "x402 · HTTP 402 · USDC rails" },
  { kicker: "03", word: "Finance", note: "Yield pays principal stays" },
  { kicker: "04", word: "AI Agents", note: "Autonomous · key-less · always on" },
];

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

      <div className="relative mx-auto max-w-[1360px] px-6 pt-14 md:px-10 md:pt-20">
        {/* Top meta row — issue + filed-by */}
        <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink/60 pb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink">
            Subly Bulletin
          </span>
          <span className="hair-rule-subly w-20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            Vol. 01 · No. 042
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            Filed · Solana Devnet
          </span>
          <span className="ml-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-subly">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-subly pulse-purple" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-subly" />
            </span>
            Live
          </span>
        </div>

        <div className="grid gap-12 md:grid-cols-12 md:gap-8 md:pb-20">
          {/* Left column — headline */}
          <div className="md:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              <span className="stamp">§ 00 · Manifest</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                A privacy-first PayFi protocol for AI agents
              </span>
            </div>

            <h1 className="font-display font-black leading-[0.82] tracking-tight text-ink">
              <span className="block text-[14vw] md:text-[110px] lg:text-[150px]">
                Use Now,
              </span>
              <span className="relative block text-[14vw] md:text-[110px] lg:text-[150px]">
                <span className="relative inline-block">
                  <span className="relative z-10 text-subly">Pay&nbsp;Never.</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-[8%] z-0 h-[16%] bg-subly/15"
                  />
                </span>
              </span>
              <span className="mt-6 block font-mono text-[12px] font-normal uppercase tracking-[0.32em] text-ink-muted md:text-[13px]">
                Privacy · Payment · Finance · AI Agents — on Solana
              </span>
            </h1>

            {/* Lead — upright serif (not italic) */}
            <p className="mt-10 max-w-2xl font-feature text-[26px] leading-[1.25] text-ink md:text-[32px]">
              Your AI agent deposits once.
              <span className="text-subly"> The yield —</span> not the principal —
              quietly settles every x402 call, inside a vault no provider, relay,
              or indexer can read.
            </p>

            <p className="mt-6 max-w-xl font-sans text-[15px] leading-[1.7] text-ink-soft">
              AI agents can already pay. Funding them is still a human chore.
              Subly ends the top-up loop: a single USDC deposit, routed into
              senior DeFi yield inside an AWS Nitro Enclave, pays for every API
              call your agent makes via{" "}
              <span className="font-mono text-[13px] text-subly">x402</span>.
              Yield routing and application privacy migrate to Arcium MPC as
              Confidential SPL lands in Q3 2026.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
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
              <a
                href="#how"
                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:text-subly"
              >
                <span className="h-px w-10 bg-ink transition-all group-hover:w-14 group-hover:bg-subly" />
                Read the mechanics
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

          {/* Right column — protocol ledger */}
          <aside className="md:col-span-4">
            <div className="ascii-corners relative border border-ink bg-paper p-6 shadow-stamp-subly">
              <div className="absolute -top-3 left-4 bg-paper px-2 font-mono text-[9px] uppercase tracking-[0.24em] text-subly">
                Protocol Ledger · Live
              </div>

              <dl className="space-y-3 font-mono text-[11px]">
                <Row label="Product" value="Subly · v1" />
                <Row label="Target" value="Autonomous AI agents" />
                <Row label="Chain" value="Solana · devnet → mainnet" />
                <Row label="Rail" value="x402 · HTTP 402" />
                <Row label="TEE" value="AWS Nitro · PCR0 attested" />
                <Row label="MPC" value="Arcium MXE (Q3 2026)" highlight />
                <Row label="Buyer" value="No API key · auto-deposit" />
                <Row label="Seller" value="Wallet-only payout" />
                <Row label="Program" value="Anchor · 27 tests passing" />
                <Row label="Enclave" value="Rust/rustls · 25 tests" />
                <Row label="Watchtower" value="6 tests · force-settle ready" />
                <Row label="Batch" value="Up to 20 settlements / tx" />
              </dl>

              <div className="mt-6 border-t border-rule pt-4">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  <span>Vault snapshot</span>
                  <span className="inline-flex items-center gap-1.5 text-subly">
                    <span className="h-1.5 w-1.5 rounded-full bg-subly blink" />
                    T+0
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="font-display text-[44px] font-semibold leading-none tracking-tight text-ink">
                      8.42<span className="text-subly">%</span>
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                      APY · devnet sim
                    </div>
                  </div>
                  <svg
                    viewBox="0 0 96 40"
                    className="h-12 w-28"
                    fill="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#5e17eb" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#5e17eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 32 L12 28 L24 30 L36 22 L48 24 L60 14 L72 16 L84 8 L96 6 L96 40 L0 40 Z"
                      fill="url(#spark)"
                    />
                    <path
                      d="M0 32 L12 28 L24 30 L36 22 L48 24 L60 14 L72 16 L84 8 L96 6"
                      stroke="#5e17eb"
                      strokeWidth="1.75"
                    />
                    <path
                      d="M0 36 L12 34 L24 32 L36 30 L48 28 L60 26 L72 22 L84 20 L96 16"
                      stroke="currentColor"
                      className="text-ink-muted"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="mt-5 font-feature text-[15px] leading-[1.55] text-ink-muted">
              A working protocol, not a deck. Every number above is attested by
              the enclave and reproducible against the published test suite.
            </p>
          </aside>
        </div>

        {/* Concept ribbon — Privacy · Payment · Finance · AI Agents */}
        <div className="relative -mx-6 mt-4 border-y-2 border-ink bg-ink text-paper md:-mx-10">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden>
            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent_0_64px,rgba(255,255,255,0.18)_64px_65px)]" />
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4">
            {PILLARS.map((p, i) => (
              <div
                key={p.word}
                className={`relative flex flex-col gap-2 px-6 py-7 md:px-8 md:py-9 ${
                  i !== 0 ? "md:border-l md:border-paper/15" : ""
                } ${
                  i % 2 === 1
                    ? "border-l border-paper/15 md:border-l"
                    : ""
                } ${i < 2 ? "border-b border-paper/15 md:border-b-0" : ""}`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-subly-glow">
                  · {p.kicker}
                </span>
                <span className="font-display text-[28px] font-semibold leading-none tracking-tight text-paper md:text-[36px]">
                  {p.word}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
                  {p.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .subly-waitlist .waitlist-container,
        .subly-waitlist .waitlist-form,
        .subly-waitlist form,
        .subly-waitlist input,
        .subly-waitlist button {
          border-radius: 2px !important;
          font-family: var(--font-mono) !important;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 11px !important;
        }
        .subly-waitlist input[type="email"] {
          background: var(--paper) !important;
          border: 1px solid var(--ink) !important;
          color: var(--ink) !important;
        }
        .subly-waitlist button {
          background: var(--subly) !important;
          color: #ffffff !important;
          border: 1px solid var(--subly) !important;
        }
        .subly-waitlist button:hover {
          background: var(--subly-deep) !important;
          border-color: var(--subly-deep) !important;
        }
      `}</style>
    </section>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[11px]">
      <dt className="shrink-0 uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </dt>
      <dd
        className={`text-right ${highlight ? "text-subly" : "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}
