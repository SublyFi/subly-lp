const MARKET = [
  {
    tier: "TAM",
    label: "AI Agent Economy",
    value: "$100B",
    weight: 100,
  },
  {
    tier: "SAM",
    label: "Stablecoin-based Agent Payments",
    value: "$10B",
    weight: 70,
  },
  {
    tier: "SOM",
    label: "API Payments via AI Agents",
    value: "$100M",
    weight: 45,
    accent: true,
  },
];

export function MarketSection() {
  return (
    <section
      id="market"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 64px, var(--subly) 64px 65px)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
              ▌ Market
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[72px]">
              Sizing the{" "}
              <span className="font-feature text-subly">
                agent payment market.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-feature text-[22px] leading-[1.4] text-ink md:text-[24px]">
              Autonomous agents are about to become the largest single
              consumer of paid APIs.
            </p>
            <p className="mt-5 font-sans text-[14px] leading-[1.75] text-ink-soft">
              We start by targeting API Payments via AI Agents — the per-call
              API payments an agent makes via x402-style HTTP 402 — and grow
              into the broader agent economy from there.
            </p>
          </div>
        </div>

        {/* Top-down sizing chart */}
        <div className="relative border-2 border-ink bg-paper p-6 shadow-stamp-subly md:p-10">
          <div className="space-y-4">
            {MARKET.map((m) => (
              <div
                key={m.tier}
                className="relative flex items-stretch"
                style={{ paddingRight: `${100 - m.weight}%` }}
              >
                <div
                  className={`flex w-full flex-wrap items-center justify-between gap-4 border-2 px-5 py-6 md:flex-nowrap md:px-8 md:py-8 ${
                    m.accent
                      ? "border-subly bg-subly text-white shadow-[8px_8px_0_0_var(--subly-deep)]"
                      : "border-ink bg-paper text-ink"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-3 md:gap-5">
                    <span
                      className={`font-mono text-[12px] uppercase tracking-[0.32em] md:text-[14px] ${
                        m.accent ? "text-subly-glow" : "text-subly"
                      }`}
                    >
                      {m.tier}
                    </span>
                    <span
                      className={`font-display text-[20px] font-semibold leading-[1.1] tracking-tight md:text-[28px] ${
                        m.accent ? "text-white" : "text-ink"
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 font-display text-[36px] font-semibold leading-none tracking-tight md:text-[56px] ${
                      m.accent ? "text-white" : "text-ink"
                    }`}
                  >
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
