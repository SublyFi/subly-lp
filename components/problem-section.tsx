const LOG = [
  { t: "02:14", event: "Agent halted · wallet balance $0.42 < $1.00", tone: "alert" as const },
  { t: "02:14", event: "Paged on-call engineer · Slack · #agents-ops", tone: "note" as const },
  { t: "02:31", event: "Human approved top-up · Ledger signer re-prompted", tone: "note" as const },
  { t: "02:33", event: "USDC +$500 deposited · tx 4Zk…p6A", tone: "ok" as const },
  { t: "02:34", event: "Agent resumed · 14 queued jobs retried", tone: "ok" as const },
  { t: "07:19", event: "Agent halted · wallet balance $0.18 < $1.00", tone: "alert" as const },
  { t: "07:22", event: "Human not available · work backlogs", tone: "alert" as const },
];

export function ProblemSection() {
  return (
    <section className="relative border-b border-rule bg-paper-deep">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-5">
          <div className="eyebrow mb-4">§ 02 · The Top-Up Loop</div>
          <h2 className="font-display text-[52px] font-semibold leading-[0.95] tracking-[-0.03em] text-ink md:text-[68px]">
            Autonomous until
            <br />
            <span className="font-serif-it font-normal">a human</span>
            <br />
            has to pay.
          </h2>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-[1.7] text-ink-soft">
            AI agents can already pay — via x402, via stablecoins, via MPC
            wallets. What they can&apos;t do is{" "}
            <em className="font-serif-it">fund themselves</em>. Every agent
            runtime in production today ends the same way: a low-balance
            alert, a paged engineer, a manual USDC transfer, a restart.
          </p>
          <p className="mt-5 max-w-md font-sans text-[15px] leading-[1.7] text-ink-soft">
            The more useful your agent gets, the more work it creates for
            the human who was supposed to be replaced. That&apos;s not
            autonomy. That&apos;s a pager on a different leash.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="relative border border-ink bg-paper p-6 md:p-8 shadow-[6px_6px_0_0_var(--ink)]">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                Event log · agent #rc-42 · 24h window
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-alert">
                2 halts · 1 human escalation · 14 retries
              </div>
            </div>

            <ul className="divide-y divide-rule font-mono text-[12px]">
              {LOG.map((entry, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 items-baseline gap-3 py-3"
                >
                  <span className="col-span-2 text-ink-muted">{entry.t}</span>
                  <span
                    className={`col-span-1 uppercase tracking-[0.14em] ${
                      entry.tone === "alert"
                        ? "text-alert"
                        : entry.tone === "ok"
                          ? "text-ok"
                          : "text-ink-muted"
                    }`}
                  >
                    {entry.tone === "alert"
                      ? "halt"
                      : entry.tone === "ok"
                        ? "resume"
                        : "note"}
                  </span>
                  <span className="col-span-9 text-ink">{entry.event}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t-2 border-ink pt-4">
              <div className="grid grid-cols-3 gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                <Stat label="Human interrupts / wk" value="~12" />
                <Stat label="Agent downtime / halt" value="17 min" />
                <Stat label="Balance surveillance" value="24/7" />
              </div>
              <p className="mt-5 font-serif-it text-[18px] leading-[1.35] text-ink">
                Every halted agent is a human at a keyboard, topping up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-ink-muted">{label}</div>
      <div className="mt-1 font-display text-[24px] font-semibold normal-case tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}
