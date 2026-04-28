const FLOW_STEPS = [
  {
    n: "01",
    tag: "DEPOSIT",
    title: "Deposit once.",
    body: "The agent makes a single USDC transfer into the shared Subly vault. No top-ups, no human supervision after that.",
    ornament: "$",
  },
  {
    n: "02",
    tag: "EARN",
    title: "Earn yield.",
    body: "The vault routes capital into DeFi, targeting 10%+ APY. Principal stays put; only the yield is used to fund payments.",
    ornament: "%",
  },
  {
    n: "03",
    tag: "PAY",
    title: "Pay providers.",
    body: "Buyers call providers via x402-style HTTP. The TEE keeps the per-buyer ledger off-chain and instructs the on-chain shared vault to pay sellers in delayed batches, so observers can't link Buyer to Seller.",
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
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.95] tracking-tight text-ink md:text-[72px]">
              Deposit once.{" "}
              <span className="text-subly">Earn yield.</span>{" "}
              <span className="font-feature">Pay agents privately.</span>
            </h2>
            <p className="mt-8 max-w-xl font-feature text-[20px] leading-[1.4] text-ink md:text-[24px]">
              Turn your yield into AI agent payments without revealing
              anything.
            </p>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
              An agent deposits USDC into Subly once. The vault earns DeFi
              yield, and that yield is what pays for x402 calls — the
              principal never leaves. Settlement flows through an on-chain
              shared vault, with the per-buyer ledger kept inside a TEE that
              schedules the payouts, so the on-chain Buyer → Seller link that
              x402 normally exposes is broken.
            </p>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid gap-0 border-y-2 border-ink md:grid-cols-3">
          <Pillar
            kicker="01 · Capital"
            title="One deposit, ongoing payments."
            body="The agent transfers USDC into the Subly vault once. Principal stays in your custody and can be withdrawn at any time."
            metric="1×"
            metricLabel="Deposit required"
          />
          <Pillar
            mid
            kicker="02 · Yield"
            title="Yield funds the payments."
            body="Deposited capital earns yield in DeFi, with a 10%+ APY target. The yield — not the principal — is what funds your agent's calls."
            metric="10%+"
            metricLabel="APY target"
          />
          <Pillar
            kicker="03 · Privacy"
            title="Buyer ↔ Seller link, broken."
            body="Buyers and sellers still use x402-style HTTP. Payments flow into the on-chain shared vault first; the TEE keeps the per-buyer ledger off-chain and triggers vault payouts in delayed batches, so the direct on-chain link disappears."
            metric="0"
            metricLabel="Buyer↔Seller links"
            accent
          />
        </div>

        {/* Mechanism timeline */}
        <div className="mt-20">
          <div className="mb-10 flex items-baseline justify-between">
            <h3 className="font-display text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">
              How it works.
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
        className={`font-display text-[24px] font-semibold leading-[1.1] tracking-tight ${
          accent ? "text-subly" : "text-ink"
        }`}
      >
        {title}
      </h3>
      <p className="text-[14px] leading-[1.75] text-ink-muted">{body}</p>
      <div className="mt-auto border-t border-rule pt-4">
        <div
          className={`font-display text-[40px] font-semibold leading-none tracking-tight ${
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
      <h4 className="font-display text-[22px] font-semibold tracking-tight text-ink md:text-[26px]">
        {title}
      </h4>
      <p className="mt-4 text-[14px] leading-[1.7] text-ink-muted">{body}</p>
    </li>
  );
}
