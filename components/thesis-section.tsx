export function ThesisSection() {
  return (
    <section id="thesis" className="relative border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-4">
          <div className="sticky top-8">
            <div className="eyebrow mb-4">§ 01 · Thesis</div>
            <h2 className="font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] text-ink md:text-[56px]">
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
          <p className="font-display text-[22px] leading-[1.3] tracking-[-0.01em] text-ink md:text-[26px]">
            <span className="float-left mr-3 font-display-wonk text-[96px] leading-[0.78] text-subly">
              P
            </span>
            ayFi is Solana&apos;s native thesis — the idea that on-chain yield,
            settled in real time, can cover real-world consumption so smoothly
            that the principal never leaves its vault. Bitget Wallet, Velo, and
            PolyFlow have all rallied under the same flag: <em className="font-serif-it">Buy Now, Pay Never</em>.
          </p>

          <p className="mt-8 max-w-2xl font-sans text-[15px] leading-[1.7] text-ink-soft">
            Subly takes that thesis one step further. We turn the same
            mechanism into a <span className="text-ink">subscription engine</span>{" "}
            that works for two customers at once — the human who subscribes to
            five SaaS products, and the AI agent that pays per API call.
            Recurring payments are the most honest stress-test for PayFi, and
            privacy is the feature that turns a yield-paying wallet into an
            institutional product.
          </p>

          <div className="mt-12 grid gap-6 border-y border-rule py-8 md:grid-cols-3">
            <Pillar
              kicker="01"
              title="Deposit once."
              body="A single USDC transfer seeds the Subly vault. No scheduled top-ups, no drip-feeds, no monthly babysitting."
            />
            <Pillar
              kicker="02"
              title="Earn quietly."
              body="Capital routes into senior DeFi yield inside a Nitro-sealed vault. The principal is yours the whole time."
            />
            <Pillar
              kicker="03"
              title="Settle invisibly."
              body="Subscriptions batch-settle on-chain via x402. Providers get paid; observers see a single aggregated balance."
            />
          </div>

          <blockquote className="mt-12 max-w-2xl border-l-2 border-subly pl-6 font-serif-it text-[22px] leading-[1.35] text-ink">
            &ldquo;Standards like x402 aim to make AI agents full-fledged
            economic actors, pointing to a future where blockchains quietly
            power applications that do not identify as &lsquo;crypto.&rsquo;&rdquo;
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
      <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.65] text-ink-muted">{body}</p>
    </div>
  );
}
