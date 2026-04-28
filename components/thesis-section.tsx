export function ThesisSection() {
  return (
    <section id="thesis" className="relative border-b border-rule bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-subly to-transparent md:block"
      />
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <div className="md:col-span-4">
          <div className="sticky top-8">
            <h2 className="font-display text-[44px] font-semibold leading-[0.95] tracking-tight text-ink md:text-[60px]">
              A quieter economy,
              <br />
              <span className="font-feature text-subly">
                powered by yield.
              </span>
            </h2>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              Solana Foundation · Lily Liu · EthCC 2024
            </p>
            <div className="mt-8 hidden md:block">
              <div className="border-l-2 border-subly pl-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                  Reading time
                </div>
                <div className="mt-1 font-display text-[28px] font-semibold tracking-tight text-ink">
                  3 min
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          <p className="font-display text-[22px] leading-[1.3] tracking-normal text-ink md:text-[26px]">
            <span className="float-left mr-3 font-display-wonk text-[120px] font-black leading-[0.78] text-subly">
              A
            </span>
            I agents can pay automatically. Funding them still cannot. A human
            tops up the wallet, watches the balance, refills before the agent
            stalls. That loop is the last missing piece between
            &ldquo;autonomous&rdquo; and{" "}
            <span className="font-feature text-subly">
              actually autonomous
            </span>
            .
          </p>

          <p className="mt-8 max-w-2xl font-sans text-[15px] leading-[1.75] text-ink-soft">
            Subly closes it. Lily Liu&apos;s PayFi thesis —{" "}
            <span className="font-feature text-ink">
              on-chain yield settles consumption in real time so principal
              never leaves the vault
            </span>{" "}
            — is the right primitive for machines. An agent deposits once; the
            vault earns; the{" "}
            <span className="font-mono text-[13px] text-subly">
              x402 facilitator
            </span>{" "}
            signs payments inside an enclave; providers get paid; observers see
            only an aggregated balance. Privacy is what turns a yield-paying
            agent wallet into something an institution will actually deploy.
          </p>

          <div className="mt-12 grid gap-0 border-y-2 border-ink py-0 md:grid-cols-3">
            <Pillar
              kicker="01"
              title="Deposit once."
              body="Your agent makes a single USDC transfer into the Subly vault. No scheduled top-ups, no cron jobs, no humans woken at 3am."
            />
            <Pillar
              mid
              kicker="02"
              title="Earn quietly."
              body="Capital routes into senior DeFi yield inside a Nitro-sealed vault. Principal stays yours the whole time — withdrawal is one instruction."
            />
            <Pillar
              kicker="03"
              title="Settle invisibly."
              body="x402 calls batch-settle on-chain via Subly's facilitator. Providers get paid; what your agent bought stays between you and the enclave."
            />
          </div>

          <blockquote className="mt-12 max-w-2xl border-l-2 border-subly bg-subly-tint/40 px-6 py-5 font-feature text-[22px] leading-[1.35] text-ink">
            &ldquo;Standards like x402 aim to make AI agents full-fledged
            economic actors, pointing to a future where blockchains quietly
            power applications that do not identify as
            &lsquo;crypto.&rsquo;&rdquo;
            <cite className="mt-4 block font-mono text-[10px] not-italic uppercase tracking-[0.24em] text-subly">
              Galaxy Research · 2026-01-07
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  kicker,
  title,
  body,
  mid,
}: {
  kicker: string;
  title: string;
  body: string;
  mid?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 px-0 py-8 md:px-8 ${
        mid ? "md:border-x md:border-rule" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
          {kicker}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <h3 className="font-display text-[24px] font-semibold tracking-tight text-ink">
        {title}
      </h3>
      <p className="text-[14px] leading-[1.7] text-ink-muted">{body}</p>
    </div>
  );
}
