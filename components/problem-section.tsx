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
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[72px]">
              AI agents can pay automatically.
              <br />
              <span className="font-feature text-subly">
                Two things are still missing.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
              x402 lets agents pay providers over HTTP. It still leaves two
              gaps. Durable funding and payment privacy.
            </p>
          </div>
        </div>

        {/* Two issues */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
              01
            </span>
            <h3 className="mt-3 font-display text-[28px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[34px]">
              Funding still depends on a human.
            </h3>
            <p className="mt-4 font-sans text-[15px] leading-[1.7] text-ink-soft">
              An agent's wallet runs out. A human has to top it up. Then it
              runs out again. The autonomy stops the moment the balance hits
              zero, and somebody has to be there to refill it.
            </p>
          </article>

          <article className="relative border border-ink bg-paper p-6 shadow-stamp md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly">
              02
            </span>
            <h3 className="mt-3 font-display text-[28px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[34px]">
              x402 ties the Buyer to the Seller.
            </h3>
            <p className="mt-4 font-sans text-[15px] leading-[1.7] text-ink-soft">
              Every x402 payment settles as a direct transfer from Buyer to
              Seller on-chain. Anyone can see what an agent bought, who it
              paid, and when. That is not privacy-preserving payment
              infrastructure.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
