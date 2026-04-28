export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden border-b border-rule bg-paper-deep"
    >
      <div
        aria-hidden
        className="gridlines-purple pointer-events-none absolute inset-0 opacity-50"
      />
      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-[48px] font-semibold leading-[0.92] tracking-tight text-ink md:text-[64px]">
              A <span className="font-feature text-subly">working</span>
              <br />
              protocol —
              <br />
              not a deck.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-sans text-[15px] leading-[1.75] text-ink-soft">
              Six components, four phases shipped, fifty-eight passing tests.
              The on-chain program and the enclave facilitator both run against
              a local Solana validator today. The watchtower writes
              force-settle challenges without human intervention. Phase 5
              (Arcium MXE) and Phase 6 (Token-2022 Confidential Transfer on
              deposit) are scoped and sequenced against the Arcium Mainnet
              Alpha roadmap.
            </p>
          </div>
        </div>

        {/* ASCII-ish architecture diagram */}
        <div className="ascii-corners relative border-2 border-ink bg-paper p-4 shadow-stamp-subly md:p-8">
          <div className="mb-6 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            <span>fig. 01 · Subly protocol topology</span>
            <span className="text-subly">§ funds flow left → right</span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Box
              tier="CLIENT"
              title="Subly SDK"
              notes={["TypeScript", "Attestation verifier", "x402 fetch"]}
              badge="USER / AGENT"
            />
            <div className="flex items-center justify-center font-mono text-[24px] text-subly md:rotate-0">
              ⇄
            </div>
            <Box
              tier="TEE"
              title="Enclave facilitator"
              notes={[
                "/verify /settle /cancel",
                "Batch construction",
                "Ed25519 adaptors",
              ]}
              badge="NITRO · 25 TESTS"
              emphasis
            />
            <Box
              tier="SOLANA"
              title="Subly vault program"
              notes={["Escrow PDA", "Batch settlement", "Force-settle"]}
              badge="ANCHOR · 27 TESTS"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Box
              tier="OPS"
              title="Parent relay"
              notes={["L4 ingress", "KMS proxy", "Encrypted WAL"]}
              badge="UNTRUSTED"
              muted
            />
            <Box
              tier="WATCH"
              title="Receipt watchtower"
              notes={[
                "Stores ParticipantReceipts",
                "Force-settle challenger",
                "24h dispute window",
              ]}
              badge="6 TESTS"
              muted
            />
            <Box
              tier="MPC"
              title="Arcium MXE"
              notes={[
                "Confidential yield routing",
                "Application privacy",
                "Confidential SPL",
              ]}
              badge="PHASE 5 · Q3 2026"
              ghost
            />
            <Box
              tier="DEPOSIT"
              title="Token-2022 CT"
              notes={[
                "Confidential deposits",
                "ElGamal balance",
                "zk-range proofs",
              ]}
              badge="PHASE 6 · Q4 2026"
              ghost
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t-2 border-ink pt-6 font-mono text-[11px] uppercase tracking-[0.18em] md:grid-cols-4">
            <Counter label="Tests passing" value="58" accent />
            <Counter label="Phases shipped" value="4 / 6" />
            <Counter label="On-chain instructions" value="11" />
            <Counter label="Enclave endpoints" value="4" />
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-rule pt-12 md:flex-row md:justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-subly">
            ▌ Stands on the shoulders of
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 font-display text-[20px] text-ink-soft md:text-[24px]">
            <span>Solana</span>
            <Dot />
            <span>Arcium</span>
            <Dot />
            <span>AWS Nitro</span>
            <Dot />
            <span>x402 Foundation</span>
            <Dot />
            <span>USDC · Circle</span>
            <Dot />
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Box({
  tier,
  title,
  notes,
  badge,
  emphasis,
  muted,
  ghost,
}: {
  tier: string;
  title: string;
  notes: string[];
  badge: string;
  emphasis?: boolean;
  muted?: boolean;
  ghost?: boolean;
}) {
  return (
    <div
      className={[
        "relative flex flex-col gap-3 border p-4 font-mono text-[11px]",
        emphasis
          ? "border-subly bg-ink text-paper shadow-[4px_4px_0_0_var(--subly)]"
          : muted
          ? "border-rule bg-paper-deep text-ink"
          : ghost
          ? "border-dashed border-subly/60 bg-paper text-ink-muted"
          : "border-ink bg-paper text-ink",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span
          className={`uppercase tracking-[0.24em] ${
            emphasis ? "text-subly-glow" : "text-subly"
          }`}
        >
          {tier}
        </span>
        <span
          className={`text-[9px] uppercase tracking-[0.2em] ${
            emphasis ? "text-paper/70" : "text-ink-muted"
          }`}
        >
          {badge}
        </span>
      </div>
      <div
        className={`font-display text-[20px] font-semibold normal-case tracking-tight ${
          emphasis ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </div>
      <ul className="space-y-1 normal-case tracking-normal">
        {notes.map((n, i) => (
          <li
            key={i}
            className={`flex gap-2 ${
              emphasis ? "text-paper/75" : "text-ink-muted"
            }`}
          >
            <span className={emphasis ? "text-subly-glow" : "text-subly"}>
              →
            </span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-ink-muted">{label}</div>
      <div
        className={`mt-1 font-display text-[32px] font-semibold normal-case tracking-tight ${
          accent ? "text-subly" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-subly/50" />;
}
