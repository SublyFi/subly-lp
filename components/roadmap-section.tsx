const PHASES = [
  {
    id: "01",
    label: "Vault + Facilitator",
    window: "Shipped",
    state: "done" as const,
    detail: "Nitro MVP. Batch settlement. 58 tests passing on Solana devnet.",
  },
  {
    id: "02",
    label: "Audit records",
    window: "Shipped",
    state: "done" as const,
    detail: "Hierarchical key derivation + ElGamal selective disclosure.",
  },
  {
    id: "03",
    label: "Atomic service channels",
    window: "Shipped",
    state: "done" as const,
    detail: "Ed25519 adaptor signatures. Provider TEE. Pay-on-delivery.",
  },
  {
    id: "04",
    label: "Force settlement",
    window: "Shipped",
    state: "done" as const,
    detail: "Receipt watchtower + 24h dispute window. Adversary-tolerant.",
  },
  {
    id: "05",
    label: "Arcium MXE",
    window: "Q3 2026",
    state: "next" as const,
    detail: "Confidential yield + application logic on Arcium Mainnet Alpha.",
  },
  {
    id: "06",
    label: "Confidential deposits",
    window: "Q4 2026",
    state: "future" as const,
    detail: "Token-2022 Confidential Transfer + zk-range-proofs on deposit.",
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative border-b border-rule bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[72px]">
              Shipped, shipping,
              <br />
              <span className="font-feature text-subly">and scheduled.</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="font-sans text-[15px] leading-[1.75] text-ink-soft">
              Phases five and six are not vague promises — they are locked to
              external milestones. Arcium Mainnet Alpha went live 2026-02;
              Confidential SPL ships Q1 2026; our Q3 + Q4 are synchronized
              against them. Everything before that already runs.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <RoadStat label="Shipped" value="4" tone="ok" />
              <RoadStat label="In-flight" value="1" tone="next" />
              <RoadStat label="Scheduled" value="1" tone="future" />
            </div>
          </div>
        </div>

        <ol className="relative">
          <span
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-rule via-subly to-rule md:block"
            aria-hidden
          />
          <div className="grid grid-cols-2 md:grid-cols-6">
            {PHASES.map((phase, idx) => (
              <li
                key={phase.id}
                className={`relative flex flex-col gap-4 border-b border-rule px-4 py-8 md:border-b-0 ${
                  idx < 5 ? "md:border-r md:border-rule" : ""
                } ${idx % 2 === 0 ? "border-r border-rule md:border-r-0" : ""} ${
                  phase.state === "next" ? "bg-subly-tint/40" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Dot state={phase.state} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    Phase {phase.id}
                  </span>
                </div>
                <div>
                  <div className="font-display text-[20px] font-semibold tracking-tight text-ink">
                    {phase.label}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[10px] uppercase tracking-[0.22em] ${
                      phase.state === "done"
                        ? "text-ok"
                        : phase.state === "next"
                        ? "text-subly"
                        : "text-ink-muted"
                    }`}
                  >
                    {phase.window}
                  </div>
                </div>
                <p className="text-[12px] leading-[1.6] text-ink-muted">
                  {phase.detail}
                </p>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}

function RoadStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "next" | "future";
}) {
  const color =
    tone === "ok"
      ? "text-ok border-ok/30"
      : tone === "next"
      ? "text-subly border-subly"
      : "text-ink-muted border-rule";
  return (
    <div className={`border-l-2 pl-3 ${color}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-[28px] font-semibold tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}

function Dot({ state }: { state: "done" | "next" | "future" }) {
  if (state === "done") {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center border border-subly bg-subly">
        <svg
          viewBox="0 0 12 12"
          className="h-2 w-2 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 6l3 3 5-6" />
        </svg>
      </span>
    );
  }
  if (state === "next") {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center border border-subly bg-paper">
        <span className="block h-2 w-2 rounded-full bg-subly blink" />
      </span>
    );
  }
  return (
    <span className="relative flex h-4 w-4 items-center justify-center border border-dashed border-ink-muted bg-paper" />
  );
}
