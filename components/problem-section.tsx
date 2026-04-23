const STACK = [
  { name: "Video", cost: 17.99, color: "bg-ink" },
  { name: "Music", cost: 11.99, color: "bg-subly" },
  { name: "Cloud", cost: 9.99, color: "bg-ink-soft" },
  { name: "Design", cost: 22.99, color: "bg-ink" },
  { name: "Fitness", cost: 14.99, color: "bg-subly-deep" },
  { name: "News", cost: 6.99, color: "bg-ink-soft" },
  { name: "AI (Pro)", cost: 20.0, color: "bg-ink" },
  { name: "Writing", cost: 8.0, color: "bg-subly" },
];

const YEARLY = STACK.reduce((s, i) => s + i.cost * 12, 0);

export function ProblemSection() {
  return (
    <section className="relative border-b border-rule bg-paper-deep">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-5">
          <div className="eyebrow mb-4">§ 02 · The Bill</div>
          <h2 className="font-display text-[52px] font-semibold leading-[0.95] tracking-[-0.03em] text-ink md:text-[68px]">
            The modern user is
            <br />
            <span className="font-serif-it font-normal">
              nickel-and-dimed
            </span>{" "}
            to death.
          </h2>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-[1.7] text-ink-soft">
            Every SaaS product you love wants its own monthly tithe. Every AI
            agent you deploy needs its wallet topped up. The damage isn&apos;t
            the <em className="font-serif-it">price</em> — it&apos;s the
            death-by-a-thousand-debits that never ends.
          </p>
          <p className="mt-5 max-w-md font-sans text-[15px] leading-[1.7] text-ink-soft">
            Nobody subscribed to a &ldquo;subscription economy.&rdquo; You
            subscribed to the products. We owe you a way out that doesn&apos;t
            require you to quit any of them.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="relative border border-ink bg-paper p-6 md:p-8 shadow-[6px_6px_0_0_var(--ink)]">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                Monthly statement · Alex, a normal-ish user
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-alert">
                Auto-debit · Recurring
              </div>
            </div>

            <ul className="divide-y divide-rule">
              {STACK.map((item) => {
                const width = (item.cost / 25) * 100;
                return (
                  <li
                    key={item.name}
                    className="grid grid-cols-12 items-center gap-4 py-3 font-mono text-[12px]"
                  >
                    <span className="col-span-4 uppercase tracking-[0.12em] text-ink">
                      {item.name}
                    </span>
                    <div className="col-span-6 flex items-center gap-3">
                      <span
                        className={`h-2 ${item.color}`}
                        style={{ width: `${width}%` }}
                      />
                      <span className="text-ink-muted">
                        ${item.cost.toFixed(2)}/mo
                      </span>
                    </div>
                    <span className="col-span-2 text-right tabular-nums text-ink">
                      ${(item.cost * 12).toFixed(0)}/yr
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t-2 border-ink pt-4">
              <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-ink-muted">Net annual outflow</span>
                <span className="font-display text-[48px] font-semibold tracking-[-0.02em] text-ink">
                  ${YEARLY.toFixed(0)}
                  <span className="font-mono text-[12px] text-ink-muted">
                    {" "}
                    / yr
                  </span>
                </span>
              </div>
              <div className="mt-2 font-mono text-[11px] text-ink-muted">
                Earned on idle balance: <span className="text-alert">$0.00</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-rule pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              <Stat label="Services" value="8" />
              <Stat label="Renewals / mo" value="8" />
              <Stat label="Times forgotten" value="∞" />
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
      <div className="mt-1 font-display text-[22px] font-semibold normal-case tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}
