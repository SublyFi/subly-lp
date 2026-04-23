import Image from "next/image";

export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative overflow-hidden border-b border-rule bg-ink text-paper"
    >
      <div className="noise absolute inset-0 opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(242,235,220,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,235,220,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-glow">
              § 04 · Declassified
            </div>
            <h2 className="font-display text-[56px] font-semibold leading-[0.92] tracking-[-0.03em] md:text-[88px]">
              Privacy is the{" "}
              <span className="font-serif-it font-normal">feature.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-serif-it text-[26px] leading-[1.35] text-paper md:text-[30px]">
              An onchain statement is a history of every habit, every tool,
              every allegiance. We think you should get to choose what the
              chain remembers about you.
            </p>
            <p className="mt-6 max-w-md font-sans text-[14px] leading-[1.7] text-paper/70">
              Subly&apos;s facilitator signs inside an AWS Nitro Enclave.
              Yield and application logic will move into Arcium&apos;s Mainnet
              Alpha MXE as Confidential SPL lands. You still get an audit
              trail — selectively disclosed, on your terms.
            </p>
          </div>
        </div>

        {/* Redaction comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          <RedactedLedger
            label="Without Subly"
            status="plaintext · indexable · forever"
            statusColor="text-alert"
            rows={[
              { t: "09:12", amt: "$17.99", note: "Streaming · Premium tier" },
              { t: "09:12", amt: "$11.99", note: "Music · Family plan" },
              { t: "09:13", amt: "$22.00", note: "Design SaaS · Annual billing" },
              { t: "09:13", amt: "$20.00", note: "LLM API · research agent" },
              { t: "09:14", amt: "$14.99", note: "Fitness · coaching" },
              { t: "09:14", amt: "$9.99", note: "Cloud storage · 2TB" },
            ]}
          />
          <RedactedLedger
            variant="subly"
            label="With Subly"
            status="encrypted · aggregated · attested"
            statusColor="text-glow"
            rows={[
              { t: "09:14", amt: "$102.96", note: "Settlement · batch #217 · 6 providers" },
            ]}
            footer
          />
        </div>

        {/* Architecture pillars */}
        <div className="mt-20 grid gap-px border border-paper/15 bg-paper/10 md:grid-cols-3">
          <Pillar
            kicker="TEE"
            title="AWS Nitro Enclave"
            body="Vault signer, facilitator API, and batch construction all live in attested memory. PCR0 is verifiable by any client with our SDK in one command."
            logo="/subly-purple.png"
            logoAlt="Nitro vault"
          />
          <Pillar
            kicker="MPC"
            title="Arcium MXE"
            body="Phase 5 moves yield routing and confidential SPL into Arcium's Multi-Party eXecution environment on Solana Mainnet Alpha (live Feb 2026)."
            logo="/arcium-logo.svg"
            logoAlt="Arcium"
            dark
          />
          <Pillar
            kicker="Audit"
            title="Selective disclosure"
            body="Phase 2 adds hierarchical key derivation + ElGamal audit records. Flip a switch and hand one regulator — and only that regulator — a readable view."
          />
        </div>
      </div>
    </section>
  );
}

function RedactedLedger({
  label,
  status,
  statusColor,
  rows,
  variant,
  footer,
}: {
  label: string;
  status: string;
  statusColor: string;
  rows: { t: string; amt: string; note: string }[];
  variant?: "subly";
  footer?: boolean;
}) {
  const isSubly = variant === "subly";
  return (
    <div
      className={`relative border p-6 md:p-8 ${
        isSubly
          ? "border-glow bg-[rgba(217,255,58,0.06)]"
          : "border-paper/25 bg-paper/5"
      }`}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
          {label}
        </div>
        <div
          className={`font-mono text-[10px] uppercase tracking-[0.22em] ${statusColor}`}
        >
          {status}
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-12 items-baseline gap-3 border-b border-paper/15 pb-3 font-mono text-[12px] last:border-0"
          >
            <span className="col-span-2 text-paper/50">{r.t}</span>
            <span className="col-span-3 text-paper">{r.amt}</span>
            <span className={`col-span-7 ${isSubly ? "text-paper" : ""}`}>
              {isSubly ? (
                r.note
              ) : (
                <>
                  <span className="redact">{r.note}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {footer && (
        <div className="mt-6 border-t border-paper/15 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
          <div className="flex items-center justify-between">
            <span>Enclave PCR0</span>
            <span className="text-glow">0xa9c7…3f1e ✓</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Providers paid</span>
            <span className="text-paper">6 · batch atomic</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Observer visibility</span>
            <span className="text-paper">total only</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Pillar({
  kicker,
  title,
  body,
  logo,
  logoAlt,
  dark,
}: {
  kicker: string;
  title: string;
  body: string;
  logo?: string;
  logoAlt?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 p-8 ${dark ? "bg-ink" : "bg-ink"}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-glow">
          {kicker}
        </span>
        {logo && (
          <div className="relative h-6 w-20">
            <Image
              src={logo}
              alt={logoAlt || ""}
              fill
              className="object-contain object-right opacity-80"
            />
          </div>
        )}
      </div>
      <h3 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-paper">
        {title}
      </h3>
      <p className="text-[13px] leading-[1.65] text-paper/70">{body}</p>
    </div>
  );
}
