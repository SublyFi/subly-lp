export function ThesisSection() {
  return (
    <section id="thesis" className="relative border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-4">
          <div className="sticky top-8">
            <div className="eyebrow mb-4">§ 01 · Thesis</div>
            <h2 className="font-display text-[44px] font-semibold leading-[0.95] tracking-normal text-ink md:text-[56px]">
              A quieter economy,
              <br />
              <span className="font-serif-it font-normal">
                powered by yield.
              </span>
            </h2>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              Solana Foundation · Lily Liu · EthCC 2024
            </p>
          </div>
        </div>

        <div className="md:col-span-8">
          <p className="font-display text-[22px] leading-[1.3] tracking-normal text-ink md:text-[26px]">
            <span className="float-left mr-3 font-display-wonk text-[96px] leading-[0.78] text-subly">
              A
            </span>
            I agents can pay automatically. Funding them still cannot. A human
            tops up the wallet, watches the balance, refills before the agent
            stalls. That loop is the last missing piece between
            &ldquo;autonomous&rdquo; and{" "}
            <em className="font-serif-it">actually autonomous</em>.
          </p>

          <p className="mt-8 max-w-2xl font-sans text-[15px] leading-[1.7] text-ink-soft">
            Subly closes it. Lily Liu&apos;s PayFi thesis —{" "}
            <em className="font-serif-it">
              on-chain yield settles consumption in real time so principal never
              leaves the vault
            </em>{" "}
            — is the right primitive for machines. An agent deposits once; the
            vault earns; the <span className="text-ink">x402 facilitator</span>{" "}
            signs payments inside an enclave; providers get paid; observers see
            only an aggregated balance. Privacy is what turns a yield-paying
            agent wallet into something an institution will actually deploy.
          </p>

          <div className="mt-12 grid gap-6 border-y border-rule py-8 md:grid-cols-3">
            <Pillar
              kicker="01"
              title="Deposit once."
              body="Your agent makes a single USDC transfer into the Subly vault. No scheduled top-ups, no cron jobs, no humans woken at 3am."
            />
            <Pillar
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

          <blockquote className="mt-12 max-w-2xl border-l-2 border-subly pl-6 font-serif-it text-[22px] leading-[1.35] text-ink">
            &ldquo;Standards like x402 aim to make AI agents full-fledged
            economic actors, pointing to a future where blockchains quietly
            power applications that do not identify as
            &lsquo;crypto.&rsquo;&rdquo;
            <cite className="mt-4 block font-mono text-[10px] not-italic uppercase tracking-[0.22em] text-ink-muted">
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
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-subly">
        {kicker}
      </span>
      <h3 className="font-display text-[22px] font-semibold tracking-normal text-ink">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.65] text-ink-muted">{body}</p>
    </div>
  );
}
