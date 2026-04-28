const MARKET = [
  {
    tier: "TAM",
    label: "AI Agent Economy",
    value: "$100B",
    note: "The full economic surface autonomous agents will transact across — APIs, data, services, settlement.",
    weight: 100,
  },
  {
    tier: "SAM",
    label: "Stablecoin-based Agent Payments",
    value: "$10B",
    note: "Agent-driven payments routed over stablecoin rails. The fastest-growing segment of crypto-native commerce.",
    weight: 60,
  },
  {
    tier: "SOM",
    label: "API Payments via AI Agents",
    value: "$100M",
    note: "Subly's beachhead — every per-call API payment an AI agent makes via x402-style HTTP 402.",
    weight: 28,
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
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[80px]">
              A market the size of every
              <br />
              <span className="font-feature text-subly">
                API call an agent will make.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-feature text-[22px] leading-[1.4] text-ink md:text-[24px]">
              Autonomous agents are about to become the largest single
              consumer of paid APIs. Subly captures the per-call payment
              layer.
            </p>
            <p className="mt-5 font-sans text-[14px] leading-[1.75] text-ink-soft">
              Below: the agent-payment market sized top-down. The wedge we
              attack first — every per-call API payment an agent makes — is
              already a $100M annual run-rate and compounds with every new
              autonomous workflow shipped.
            </p>
          </div>
        </div>

        {/* Nested market visualization */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="relative border-2 border-ink bg-paper p-6 shadow-stamp-subly md:p-10">
              <div className="space-y-3">
                {MARKET.map((m) => (
                  <div
                    key={m.tier}
                    className="relative flex items-center"
                    style={{ paddingRight: `${100 - m.weight}%` }}
                  >
                    <div
                      className={`flex w-full items-center justify-between border-2 px-4 py-5 md:px-6 md:py-6 ${
                        m.accent
                          ? "border-subly bg-subly text-white shadow-[6px_6px_0_0_var(--subly-deep)]"
                          : "border-ink bg-paper text-ink"
                      }`}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-[11px] uppercase tracking-[0.28em] ${
                            m.accent ? "text-subly-glow" : "text-subly"
                          }`}
                        >
                          {m.tier}
                        </span>
                        <span
                          className={`font-display text-[18px] font-semibold tracking-tight md:text-[22px] ${
                            m.accent ? "text-white" : "text-ink"
                          }`}
                        >
                          {m.label}
                        </span>
                      </div>
                      <span
                        className={`font-display text-[28px] font-semibold leading-none tracking-tight md:text-[40px] ${
                          m.accent ? "text-white" : "text-ink"
                        }`}
                      >
                        {m.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                fig. 03 · top-down sizing · annual run-rate · 2026 estimate
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <ul className="space-y-6">
              {MARKET.map((m) => (
                <li
                  key={m.tier}
                  className={`border-l-2 pl-4 ${
                    m.accent ? "border-subly" : "border-rule"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.28em] ${
                        m.accent ? "text-subly" : "text-ink-muted"
                      }`}
                    >
                      {m.tier}
                    </span>
                    <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
                      {m.value}
                    </span>
                  </div>
                  <div
                    className={`mt-1 font-display text-[18px] font-semibold tracking-tight ${
                      m.accent ? "text-subly" : "text-ink"
                    }`}
                  >
                    {m.label}
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.65] text-ink-muted">
                    {m.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
