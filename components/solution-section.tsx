const FLOW_STEPS = [
  {
    n: "01",
    tag: "DEPOSIT",
    title: "Agent deposits once.",
    body: "A single USDC transfer into the shared Subly vault. No cron jobs, no human surveillance, no second deposit ever required.",
    ornament: "$",
  },
  {
    n: "02",
    tag: "EARN",
    title: "Vault earns yield.",
    body: "Capital routes into senior DeFi positions targeting 10%+ APY. Principal stays yours; only the yield is spent on agent payments.",
    ornament: "%",
  },
  {
    n: "03",
    tag: "PAY",
    title: "TEE pays providers — privately.",
    body: "Buyers pay providers via x402-style HTTP calls. The TEE batches and time-shifts the actual on-chain settlement so observers can't link Buyer to Seller.",
    ornament: "→",
  },
];

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 95% 10%, rgba(94,23,235,0.18) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(94,23,235,0.10) 0%, transparent 50%)",
        }}
      />
      <div className="gridlines-purple pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        {/* Tagline block */}
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
              ▌ Solution
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[80px]">
              Deposit once.
              <br />
              <span className="text-subly">Earn yield.</span>
              <br />
              <span className="font-feature">
                Pay agents — privately.
              </span>
            </h2>
            <p className="mt-8 max-w-xl font-feature text-[22px] leading-[1.35] text-ink md:text-[26px]">
              Turn your yield into AI agent payments without revealing
              anything.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="border border-ink bg-paper p-6 shadow-stamp">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-subly">
                ▌ The Subly answer
              </div>
              <p className="mt-3 font-sans text-[14px] leading-[1.75] text-ink-soft">
                A single deposit funds your agent forever. Capital sits in a
                Solana vault earning DeFi yield. The yield — not the principal
                — settles every x402-style call your agent makes. And because
                a TEE-managed shared vault breaks the Buyer-Seller link, the
                public ledger never sees what your agent bought from whom.
              </p>
            </div>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid gap-0 border-y-2 border-ink md:grid-cols-3">
          <Pillar
            kicker="01 · Capital"
            title="One deposit, forever."
            body="Your agent transfers USDC into the Subly vault once. The Solana program mints a non-transferable receipt bound to its pubkey. Withdrawal is one instruction — principal never leaves your custody."
            metric="1×"
            metricLabel="Deposit required"
          />
          <Pillar
            mid
            kicker="02 · Yield"
            title="DeFi works the night shift."
            body="The vault routes idle capital into whitelisted senior DeFi positions, targeting 10%+ APY. Yield accrues continuously and replenishes the spend bucket without any human action."
            metric="10%+"
            metricLabel="APY target"
          />
          <Pillar
            kicker="03 · Privacy"
            title="The receipt disappears."
            body="Buyers and Sellers still talk over HTTP, just like x402. But payments flow into a shared user vault first; the TEE batches and time-shifts the on-chain settlement, so no observer can link Buyer to Seller."
            metric="0"
            metricLabel="Buyer↔Seller links"
            accent
          />
        </div>

        {/* Mechanism timeline */}
        <div className="mt-20">
          <div className="mb-10 flex items-baseline justify-between">
            <h3 className="font-display text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">
              How the money moves.
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              fig. 02 · capital flow
            </span>
          </div>
          <ol className="relative grid gap-0 md:grid-cols-3">
            <span
              className="absolute left-0 right-0 top-[54px] hidden h-px bg-gradient-to-r from-rule via-subly to-rule md:block"
              aria-hidden
            />
            {FLOW_STEPS.map((step, i) => (
              <Step key={step.n} {...step} mid={i === 1} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  kicker,
  title,
  body,
  metric,
  metricLabel,
  mid,
  accent,
}: {
  kicker: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  mid?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-5 px-6 py-10 md:px-8 ${
        mid ? "md:border-x md:border-rule" : ""
      } ${accent ? "bg-subly-tint/40" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
          {kicker}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <h3
        className={`font-display text-[26px] font-semibold leading-[1.05] tracking-tight ${
          accent ? "text-subly" : "text-ink"
        }`}
      >
        {title}
      </h3>
      <p className="text-[14px] leading-[1.75] text-ink-muted">{body}</p>
      <div className="mt-auto border-t border-rule pt-4">
        <div
          className={`font-display text-[44px] font-semibold leading-none tracking-tight ${
            accent ? "text-subly" : "text-ink"
          }`}
        >
          {metric}
        </div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          {metricLabel}
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  tag,
  title,
  body,
  ornament,
  mid,
}: {
  n: string;
  tag: string;
  title: string;
  body: string;
  ornament: string;
  mid?: boolean;
}) {
  return (
    <li
      className={`relative flex flex-col border-t border-rule px-0 py-10 md:border-t-0 md:px-8 ${
        mid ? "md:border-x md:border-rule" : ""
      }`}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex h-[64px] w-[64px] items-center justify-center border-2 border-ink bg-paper">
          <span className="font-display text-[30px] font-semibold tracking-tight text-subly">
            {ornament}
          </span>
          <span className="absolute -top-2.5 -right-2.5 border border-ink bg-subly px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white">
            {n}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
          ▌{tag}
        </span>
      </div>
      <h4 className="font-display text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">
        {title}
      </h4>
      <p className="mt-4 text-[14px] leading-[1.7] text-ink-muted">{body}</p>
    </li>
  );
}
