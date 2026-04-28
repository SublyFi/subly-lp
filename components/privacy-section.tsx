import Image from "next/image";

export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative overflow-hidden border-b border-rule bg-ink text-paper"
    >
      <div className="noise absolute inset-0 opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200,179,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,179,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 80% 0%, rgba(94,23,235,0.45) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(94,23,235,0.25) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
              ▌ Privacy
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.95] tracking-tight md:text-[72px]">
              How the Buyer ↔ Seller{" "}
              <span className="font-feature text-subly-glow">link breaks.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[15px] leading-[1.75] text-paper/85 md:text-[16px]">
              Subly settles payments through a shared user vault. Buyers
              deposit into the vault; sellers are paid out from the vault on
              its own schedule. The on-chain ledger sees Buyer → Vault and
              Vault → Seller separately, so the direct Buyer → Seller link
              that x402 normally exposes is no longer present.
            </p>
            <p className="mt-4 font-sans text-[13px] leading-[1.75] text-paper/65">
              Settlement bookkeeping runs inside a TEE; the on-chain privacy
              layer migrates to Arcium MPC as Confidential SPL ships.
            </p>
          </div>
        </div>

        {/* Redaction comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          <RedactedLedger
            label="Without Subly · Official x402"
            status="plaintext · indexable · forever"
            statusColor="text-alert"
            rows={[
              {
                t: "14:02",
                amt: "$0.40",
                note: "LLM API · competitor pricing analysis",
              },
              {
                t: "14:03",
                amt: "$2.10",
                note: "Vector DB · M&A target shortlist query",
              },
              {
                t: "14:03",
                amt: "$1.25",
                note: "Market data API · microcap alpha feed",
              },
              {
                t: "14:04",
                amt: "$0.90",
                note: "Legal research · patent freedom-to-operate",
              },
              {
                t: "14:05",
                amt: "$3.00",
                note: "Clinical dataset · rare-disease cohort",
              },
              {
                t: "14:05",
                amt: "$0.15",
                note: "Geo API · supplier route reconnaissance",
              },
            ]}
          />
          <RedactedLedger
            variant="subly"
            label="With Subly"
            status="encrypted · aggregated · attested"
            statusColor="text-subly-glow"
            rows={[
              {
                t: "14:06",
                amt: "$7.80",
                note: "Settlement · batch #4217 · 6 providers",
              },
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
            logo="/ArciumWhite.svg"
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
          ? "border-subly bg-subly/10 shadow-[6px_6px_0_0_var(--subly-deep)]"
          : "border-paper/25 bg-paper/5"
      }`}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
          ▌ {label}
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
            <span
              className={`col-span-3 ${
                isSubly ? "text-subly-glow" : "text-paper"
              }`}
            >
              {r.amt}
            </span>
            <span className={`col-span-7 ${isSubly ? "text-paper" : ""}`}>
              {isSubly ? r.note : <span className="redact">{r.note}</span>}
            </span>
          </div>
        ))}
      </div>

      {footer && (
        <div className="mt-6 border-t border-paper/15 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
          <div className="flex items-center justify-between">
            <span>Enclave PCR0</span>
            <span className="text-subly-glow">0xa9c7…3f1e ✓</span>
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
    <div className={`flex flex-col gap-4 p-8 ${dark ? "bg-ink" : "bg-ink"}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly-glow">
          ▌ {kicker}
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
      <h3 className="font-display text-[24px] font-semibold tracking-tight text-paper">
        {title}
      </h3>
      <p className="text-[13px] leading-[1.7] text-paper/70">{body}</p>
    </div>
  );
}
