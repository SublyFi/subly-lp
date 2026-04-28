const FUNDING_LOG = [
  { t: "02:14", event: "Agent halted · wallet $0.42 < $1.00", tone: "alert" as const },
  { t: "02:14", event: "Paged on-call engineer · #agents-ops", tone: "note" as const },
  { t: "02:31", event: "Human approved top-up · Ledger re-prompt", tone: "note" as const },
  { t: "02:33", event: "USDC +$500 deposited · tx 4Zk…p6A", tone: "ok" as const },
  { t: "02:34", event: "Agent resumed · 14 queued jobs retried", tone: "ok" as const },
  { t: "07:19", event: "Agent halted · wallet $0.18 < $1.00", tone: "alert" as const },
];

const X402_LEAK = [
  { t: "14:02", buyer: "Agent A", seller: "LLM API", note: "competitor pricing analysis" },
  { t: "14:03", buyer: "Agent A", seller: "Vector DB", note: "M&A target shortlist" },
  { t: "14:04", buyer: "Agent A", seller: "Legal API", note: "freedom-to-operate query" },
  { t: "14:05", buyer: "Agent A", seller: "Clinical DB", note: "rare-disease cohort" },
];

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
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[80px]">
              AI agents can pay.
              <br />
              Two things still{" "}
              <span className="font-feature text-subly">break.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-feature text-[20px] leading-[1.45] text-ink md:text-[22px]">
              x402 gave agents a way to pay providers over HTTP. It did not
              solve who tops up their wallet — and it did not hide what they
              bought.
            </p>
          </div>
        </div>

        {/* Two cracks */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Crack 01 — funding still needs a human */}
          <article className="ascii-corners relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <header className="mb-5 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
                Crack 01
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-alert">
                Funding · human-bound
              </span>
            </header>
            <h3 className="font-display text-[30px] font-semibold leading-[0.95] tracking-tight text-ink md:text-[36px]">
              Agents still wait
              <br />
              for a human to{" "}
              <span className="text-subly">refill</span>.
            </h3>
            <p className="mt-4 max-w-md font-sans text-[14px] leading-[1.7] text-ink-soft">
              Every production agent ends the same way: a low-balance alert, a
              paged engineer, a manual USDC transfer, a restart. The more
              useful the agent gets, the more work it creates for the human it
              was meant to replace.
            </p>

            <ul className="mt-6 divide-y divide-rule font-mono text-[12px]">
              {FUNDING_LOG.map((entry, i) => (
                <li key={i} className="grid grid-cols-12 items-baseline gap-3 py-2.5">
                  <span className="col-span-2 text-ink-muted">{entry.t}</span>
                  <span
                    className={`col-span-2 uppercase tracking-[0.18em] ${
                      entry.tone === "alert"
                        ? "text-alert"
                        : entry.tone === "ok"
                        ? "text-ok"
                        : "text-subly"
                    }`}
                  >
                    ▌
                    {entry.tone === "alert"
                      ? "halt"
                      : entry.tone === "ok"
                      ? "resume"
                      : "note"}
                  </span>
                  <span className="col-span-8 text-ink">{entry.event}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-ink pt-4">
              <Stat label="Interrupts / wk" value="~12" />
              <Stat label="Downtime / halt" value="17m" />
              <Stat label="Surveillance" value="24/7" />
            </div>
          </article>

          {/* Crack 02 — x402 leaks the receipt */}
          <article className="ascii-corners relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <header className="mb-5 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
                Crack 02
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-alert">
                Privacy · plaintext edge
              </span>
            </header>
            <h3 className="font-display text-[30px] font-semibold leading-[0.95] tracking-tight text-ink md:text-[36px]">
              Every x402 call is a{" "}
              <span className="text-subly">confession</span> on-chain.
            </h3>
            <p className="mt-4 max-w-md font-sans text-[14px] leading-[1.7] text-ink-soft">
              Official x402 settles each Buyer → Seller payment as its own
              public transfer. Anyone can read the receipt: which agent paid
              which provider, when, for how much. That is a strategy leak the
              moment your agent does anything interesting.
            </p>

            <div className="mt-6 border border-rule bg-paper-deep">
              <div className="grid grid-cols-12 gap-2 border-b border-rule bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                <span className="col-span-2">Time</span>
                <span className="col-span-3">Buyer</span>
                <span className="col-span-1">→</span>
                <span className="col-span-3">Seller</span>
                <span className="col-span-3">Bought</span>
              </div>
              {X402_LEAK.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-12 items-center gap-2 px-3 py-2.5 font-mono text-[12px] ${
                    i !== X402_LEAK.length - 1
                      ? "border-b border-rule/60"
                      : ""
                  }`}
                >
                  <span className="col-span-2 text-ink-muted">{row.t}</span>
                  <span className="col-span-3 text-ink">{row.buyer}</span>
                  <span className="col-span-1 text-subly">→</span>
                  <span className="col-span-3 text-ink">{row.seller}</span>
                  <span className="col-span-3 text-alert">{row.note}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 border-l-2 border-subly pl-4 font-feature text-[18px] leading-[1.35] text-ink">
              Buyer ↔ Seller links live forever on a public ledger.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-subly pl-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-[26px] font-semibold tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}
