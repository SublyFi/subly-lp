import Image, { type StaticImageData } from "next/image";

import humaLogo from "@/styles/img/huma_logo.png";
import jupiterLogo from "@/styles/img/jupiter_logo.jpg";
import kaminoLogo from "@/styles/img/kamino_logo.jpg";
import perenaLogo from "@/styles/img/perena_logo.jpg";

const YIELD_LOGOS: Array<{ name: string; src: StaticImageData }> = [
  { name: "Huma", src: humaLogo },
  { name: "Jupiter", src: jupiterLogo },
  { name: "Kamino", src: kaminoLogo },
  { name: "Perena", src: perenaLogo },
];

const X402_PROVIDERS = [
  "CoinMarketCap",
  "CoinGecko",
  "Birdeye",
  "Nansen",
  "Messari",
  "Zerion",
];

const FLOW_STEPS = [
  {
    n: "01",
    tag: "DEPOSIT",
    title: "Deposit once.",
    body: "The agent makes one USDC transfer into the Subly vault on Kamino. No SOL needed — network fees are sponsored, and the principal stays withdrawable.",
    ornament: "$",
  },
  {
    n: "02",
    tag: "EARN",
    title: "Earn yield.",
    body: "The vault lends deposits in DeFi with a 5-10% APY target. Yield accrues continuously and becomes the agent's spendable payment budget.",
    ornament: "%",
  },
  {
    n: "03",
    tag: "PAY",
    title: "Pay per call.",
    body: "The agent calls x402-enabled APIs — Birdeye at $0.003, CoinGecko or Nansen at $0.01 — and each call settles from yield with an on-chain receipt.",
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
              <span className="font-feature">Pay never.</span>
            </h2>
            <p className="mt-8 max-w-xl font-feature text-[20px] leading-[1.4] text-ink md:text-[24px]">
              Yield keeps paying for paid APIs. Principal isn&apos;t spent on
              API calls.
            </p>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
              An agent deposits USDC into the Subly vault once. The vault
              earns DeFi yield on Kamino, and every x402 API call settles
              from the yield that accrues. The relayer refuses any payment
              beyond spendable yield, so the deposited principal is never
              touched by a payment — and stays withdrawable at any time.
            </p>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid gap-0 border-y-2 border-ink md:grid-cols-3">
          <Pillar
            kicker="01 · Capital"
            title="One deposit, ongoing payments."
            body="The agent transfers USDC into the Subly vault once. Principal stays in your custody and can be withdrawn at any time — a plain withdraw is the exit path."
            metric="1×"
            metricLabel="Deposit required"
          />
          <Pillar
            mid
            kicker="02 · Yield"
            title="Yield funds the payments."
            body="Deposited capital earns yield in DeFi through the Subly vault on Kamino, with a 5-10% APY target. Yield, not principal, funds your agent's calls."
            metric="5-10%"
            metricLabel="APY target"
            logos={YIELD_LOGOS}
          />
          <Pillar
            kicker="03 · Payments"
            title="Principal is never spent."
            body="Payments settle from spendable yield only. The relayer refuses anything the accrued yield cannot cover, so API calls cannot eat into the deposit."
            metric="0"
            metricLabel="Principal spent on calls"
            accent
          />
        </div>

        {/* Mechanism timeline */}
        <div className="mt-20">
          <div className="mb-10">
            <h3 className="font-display text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">
              How it works.
            </h3>
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

        {/* Coverage math */}
        <div className="mt-16 border-2 border-ink bg-paper p-6 shadow-stamp-subly md:p-10">
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
                ▌ Coverage math
              </div>
              <p className="mt-4 font-display text-[30px] font-semibold leading-[1.08] tracking-tight text-ink md:text-[44px]">
                1,000 USDC at 10% APY covers{" "}
                <span className="text-subly">27 API calls a day</span> at
                $0.01 each.
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="font-sans text-[13px] leading-[1.7] text-ink-muted">
                Before fees. Subly charges 10% of yield and 1% of each
                payment — either way, the payment path never draws on
                principal.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-rule pt-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              x402-enabled data providers
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {X402_PROVIDERS.map((name) => (
                  <span
                    key={name}
                    className="border border-rule bg-paper-deep px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                22K seller payout wallets on x402 · last 30 days
              </div>
            </div>
          </div>
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
  logos,
  mid,
  accent,
}: {
  kicker: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  logos?: Array<{ name: string; src: StaticImageData }>;
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
      {logos ? (
        <div className="grid grid-cols-4 gap-3" aria-label="Yield providers">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex aspect-square items-center justify-center border border-rule bg-paper p-2"
            >
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : null}
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
