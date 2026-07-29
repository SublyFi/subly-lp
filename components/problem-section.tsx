export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden border-b border-rule bg-paper-deep"
    >
      <div
        aria-hidden
        className="crosshatch pointer-events-none absolute inset-0 opacity-50"
      />
      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
              ▌ Problem
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[72px]">
              Autonomous payments.
              <br />
              <span className="font-feature text-subly">Manual top-ups.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
              x402 lets agents pay for APIs over HTTP, per call. But the money
              behind those payments still comes from a human refilling a
              wallet — and the humans doing their own research keep losing.
            </p>
          </div>
        </div>

        {/* Two issues */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
              01
            </span>
            <h3 className="mt-3 font-display text-[28px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[34px]">
              When the wallet runs dry, the agent stops.
            </h3>
            <p className="mt-4 font-sans text-[15px] leading-[1.7] text-ink-soft">
              An agent&apos;s wallet runs out. A human tops it up. It runs out
              again. Autonomy ends the moment the balance hits zero, and
              somebody has to be there to refill it — every time.
            </p>
            <div className="mt-8 border-t border-rule pt-5">
              <div className="font-display text-[44px] font-semibold leading-none tracking-tight text-ink md:text-[56px]">
                0
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                API calls after the balance hits zero
              </div>
            </div>
          </article>

          <article className="relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
              02
            </span>
            <h3 className="mt-3 font-display text-[28px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[34px]">
              Very few traders can grow their capital.
            </h3>
            <p className="mt-4 font-sans text-[15px] leading-[1.7] text-ink-soft">
              Impulsive, manual trading loses to data-driven decisions — the
              kind an agent armed with paid market data can make around the
              clock. Most people never get that far.
            </p>
            <div className="mt-8 border-t border-rule pt-5">
              <div className="font-display text-[44px] font-semibold leading-none tracking-tight text-subly md:text-[56px]">
                86%
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                of Hyperliquid traders lose money
              </div>
              <a
                href="https://investx.fr/en/crypto-news/why-traders-lose-money-hyperliquid/"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted underline decoration-rule underline-offset-4 transition-colors hover:text-subly focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Source: InvestX ↗
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
