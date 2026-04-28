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
              Subly&apos;s on-chain programs — including the Shared Vault — are
              encrypted by Arcium, while the per-buyer ledger lives inside an
              AWS Nitro Enclave. When Solana&apos;s Confidential SPL transfers
              reach mainnet, Subly will adopt them on day one so the amounts
              moved through the vault are also kept private.
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

        {/* Privacy pillars */}
        <div className="mt-20 grid gap-px border border-paper/15 bg-paper/10 md:grid-cols-3">
          <Pillar
            kicker="On-chain privacy"
            logo="/ArciumWhite.svg"
            logoAlt="Arcium"
            logoAsTitle
            body="Subly's on-chain programs — including the Shared Vault that holds user funds — are encrypted by Arcium. Solana executes them and verifies the result, but never sees their internal state in the clear."
          />
          <Pillar
            kicker="Off-chain ledger"
            title="AWS Nitro Enclave"
            body="When a buyer deposits into the Shared Vault, the per-buyer accounting that tracks who spent what is kept inside an AWS Nitro Enclave. Balances live in attested memory, and the host machine only ever sees ciphertext. The same ledger can be opened to a regulator or auditor on the buyer's terms."
          />
          <Pillar
            kicker="Coming next"
            title="Confidential SPL · day one"
            body="Solana's upcoming Confidential SPL transfers will keep transfer amounts hidden on-chain. The moment they ship to mainnet, Subly will integrate them so the amounts moving through the Shared Vault are also kept private."
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
  logoAsTitle,
}: {
  kicker: string;
  title?: string;
  body: string;
  logo?: string;
  logoAlt?: string;
  logoAsTitle?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5 bg-ink p-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-subly-glow">
        ▌ {kicker}
      </span>
      {logoAsTitle && logo ? (
        <div className="relative h-14 w-44 md:h-16 md:w-52">
          <Image
            src={logo}
            alt={logoAlt || ""}
            fill
            className="object-contain object-left"
          />
        </div>
      ) : (
        <h3 className="font-display text-[26px] font-semibold leading-[1.1] tracking-tight text-paper">
          {title}
        </h3>
      )}
      <p className="text-[13px] leading-[1.7] text-paper/70">{body}</p>
    </div>
  );
}
