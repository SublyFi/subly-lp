"use client";

import Script from "next/script";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      <div className="gridlines pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #1a0b2e 0%, transparent 40%), radial-gradient(circle at 90% 90%, #8c52ff 0%, transparent 35%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:gap-8 md:px-10 md:py-28 lg:py-32">
        {/* Left column — editorial hero */}
        <div className="md:col-span-8">
          <div className="mb-10 flex items-center gap-4">
            <span className="eyebrow">§ 00 · Manifest</span>
            <span className="hair-rule w-16" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              A PayFi protocol by SublyFi
            </span>
          </div>

          <h1 className="font-display text-[14vw] font-black leading-[0.82] tracking-normal text-ink md:text-[120px] lg:text-[170px]">
            <span className="block">Use Now,</span>
            <span className="block font-serif-it font-normal tracking-normal text-subly">
              Pay Never.
            </span>
            <span className="mt-4 block font-mono text-[12px] font-normal uppercase tracking-[0.3em] text-ink-muted md:text-[13px]">
              Privacy protocol for agents · Solana · USDC · x402
            </span>
          </h1>

          <p className="mt-10 max-w-2xl font-serif-it text-2xl leading-snug text-ink-soft md:text-3xl">
            Your AI agent deposits once.{" "}
            <span className="text-ink">The yield</span> — not the principal —
            silently settles every x402 call it makes, inside a vault that no
            provider, relay, or indexer can read.
          </p>

          <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-ink-muted">
            AI agents can already pay. Funding them is still a human chore.
            Subly ends the top-up loop: a single USDC deposit, routed into
            senior DeFi yield inside an AWS Nitro Enclave, pays for every API
            call your agent makes via <span className="text-ink">x402</span>.
            Yield and application privacy move to{" "}
            <span className="text-ink">Arcium</span> MPC as Confidential SPL
            lands in Q3 2026.
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
              className="inline-flex items-center gap-3 border border-ink bg-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:bg-glow hover:text-ink"
            >
              Run live demo
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

        {/* Right column — protocol status card */}
        <aside className="md:col-span-4">
          <div className="relative border border-ink bg-paper-deep p-6 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[6px_6px_0_0_var(--ink)]">
            <div className="absolute -top-3 left-4 bg-paper-deep px-2 text-[9px] text-ink-muted">
              Protocol Ledger · live
            </div>

            <dl className="space-y-3 normal-case tracking-normal">
              <Row label="Product" value="Subly · v1" />
              <Row label="Target" value="Autonomous AI agents" />
              <Row label="Chain" value="Solana · devnet → mainnet" />
              <Row label="Rail" value="x402-style · HTTP 402" />
              <Row label="TEE" value="AWS Nitro · PCR0 attested" />
              <Row label="MPC" value="Arcium MXE (Q3 2026)" />
              <Row label="Buyer" value="No API key · autoDeposit" />
              <Row label="Seller" value="Wallet-only payout" />
              <Row label="Program" value="Anchor · 27 tests passing" />
              <Row label="Enclave" value="Rust/rustls · 25 tests" />
              <Row label="Watchtower" value="6 tests · force-settle ready" />
              <Row label="Batch" value="Up to 20 settlements / tx" />
            </dl>

            <div className="mt-6 border-t border-rule pt-4">
              <div className="flex items-center justify-between text-[10px] text-ink-muted">
                <span>Vault snapshot</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok blink" />
                  T+0
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="font-display text-[40px] leading-none tracking-tight text-ink">
                    8.42%
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    APY · devnet sim
                  </div>
                </div>
                <svg
                  viewBox="0 0 96 40"
                  className="h-10 w-24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    d="M0 32 L12 28 L24 30 L36 22 L48 24 L60 14 L72 16 L84 8 L96 6"
                    className="text-subly"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 36 L12 34 L24 32 L36 30 L48 28 L60 26 L72 22 L84 20 L96 16"
                    className="text-ink-muted"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p className="mt-5 font-serif-it text-sm leading-relaxed text-ink-muted">
            — A working protocol, not a deck. All numbers attested by the
            enclave and reproducible against the published test suite.
          </p>
        </aside>
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
          background: var(--ink) !important;
          color: var(--paper) !important;
          border: 1px solid var(--ink) !important;
        }
        .subly-waitlist button:hover {
          background: var(--subly) !important;
          border-color: var(--subly) !important;
        }
      `}</style>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[11px]">
      <dt className="shrink-0 uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
