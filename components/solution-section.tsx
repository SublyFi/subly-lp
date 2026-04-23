export function SolutionSection() {
  return (
    <section id="how" className="relative border-b border-rule bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="eyebrow mb-4">§ 03 · Mechanism</div>
            <h2 className="font-display text-[52px] font-semibold leading-[0.95] tracking-[-0.03em] text-ink md:text-[72px]">
              How the
              <br />
              <span className="font-serif-it font-normal">vault</span>
              <br />
              <span>pays you back.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-serif-it text-[26px] leading-[1.3] text-ink md:text-[32px]">
              Three movements. One deposit. A yield curve that keeps your
              agent paid up, call after call, without ever touching
              principal.
            </p>
            <p className="mt-6 font-sans text-[15px] leading-[1.7] text-ink-muted">
              Everything between the agent&apos;s deposit and the provider&apos;s
              settlement happens inside an AWS Nitro Enclave. The parent
              instance sees only ciphertexts; the vault signer lives in
              attested memory. Providers are paid in batches; observers see
              only aggregate totals.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <ol className="relative grid gap-0 md:grid-cols-3">
          <span
            className="hair-rule absolute left-0 right-0 top-[54px] hidden md:block"
            aria-hidden
          />
          <Step
            n="01"
            tag="DEPOSIT"
            title="Seed the agent vault"
            body="Your agent sends USDC into a Subly program-derived vault. The Solana program mints a non-transferable receipt bound to its pubkey. Withdrawal is one instruction — principal never leaves your custody envelope."
            ornament="$"
          />
          <Step
            n="02"
            tag="EARN"
            title="Yield accrues — silently"
            body="The enclave allocates capital to a whitelisted senior DeFi vault (Kormos-class fractional reserve, or a plain Kamino/Marinade position). Ed25519 adaptor signatures keep every move atomic and auditable."
            ornament="↻"
            mid
          />
          <Step
            n="03"
            tag="SETTLE"
            title="Pay per call — invisibly"
            body="Your agent pays providers via x402; Subly's facilitator signs each commitment inside the enclave and batch-settles up to 20 payments in a single Solana transaction. The agent never pauses; the ledger never reveals what it bought."
            ornament="→"
          />
        </ol>

        {/* Numeric ribbon */}
        <div className="mt-20 grid grid-cols-2 gap-0 border-y border-ink md:grid-cols-4">
          <Figure value="1×" label="Deposit required" />
          <Figure value="20" label="Batch size / tx" divider />
          <Figure value="120s" label="Settlement window" divider />
          <Figure value="0" label="Principal spent" divider accent />
        </div>
      </div>
    </section>
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
        <div className="relative flex h-[60px] w-[60px] items-center justify-center border border-ink bg-paper">
          <span className="font-display text-[28px] font-semibold tracking-tight text-ink">
            {ornament}
          </span>
          <span className="absolute -top-2 -right-2 border border-ink bg-paper-deep px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink">
            {n}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-subly">
          {tag}
        </span>
      </div>
      <h3 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink md:text-[30px]">
        {title}
      </h3>
      <p className="mt-4 text-[14px] leading-[1.7] text-ink-muted">{body}</p>
    </li>
  );
}

function Figure({
  value,
  label,
  divider,
  accent,
}: {
  value: string;
  label: string;
  divider?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-start px-4 py-8 md:px-8 ${
        divider ? "md:border-l md:border-rule" : ""
      }`}
    >
      <span
        className={`font-display text-[64px] font-semibold leading-none tracking-[-0.03em] md:text-[88px] ${
          accent ? "text-subly" : "text-ink"
        }`}
      >
        {value}
      </span>
      <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}
