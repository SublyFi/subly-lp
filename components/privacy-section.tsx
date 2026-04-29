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
              What Subly{" "}
              <span className="font-feature text-subly-glow">keeps private.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[15px] leading-[1.75] text-paper/85 md:text-[16px]">
              Subly&apos;s on-chain programs, including the Shared Vault, are
              encrypted by Arcium. The per-buyer ledger lives inside a TEE.
              Once Solana&apos;s Confidential SPL transfers reach mainnet,
              Subly plans to integrate them so vault transfer amounts can
              also stay private.
            </p>
          </div>
        </div>

        {/* Privacy pillars */}
        <div className="grid gap-px border border-paper/15 bg-paper/10 md:grid-cols-3">
          <Pillar
            kicker="On-chain privacy"
            logo="/ArciumWhite.svg"
            logoAlt="Arcium"
            logoAsTitle
            body="Subly's on-chain programs, including the Shared Vault that holds user funds, are encrypted by Arcium. The on-chain data stays encrypted end to end, and computation runs directly over the ciphertext without ever decrypting it."
          />
          <Pillar
            kicker="Off-chain ledger"
            title="AWS Nitro Enclave"
            body="The per-buyer accounting that tracks who spent what is kept off-chain inside a TEE instead of on Solana. The ledger can still be opened to a regulator or auditor on the buyer's terms."
          />
          <Pillar
            kicker="Coming next"
            title="Confidential SPL"
            body="Solana's upcoming Confidential SPL transfers will keep transfer amounts hidden on-chain. Once they ship to mainnet, Subly plans to integrate them so the amounts moving through the Shared Vault can also be kept private."
          />
        </div>
      </div>
    </section>
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
