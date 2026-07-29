"use client";

import Image from "next/image";
import { SublyLogo } from "./subly-logo";

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/subly_fi",
    icon: "/x.svg",
    size: 22,
  },
  {
    label: "Telegram",
    href: "https://t.me/+hR5mDS-l7bBhNjFl",
    icon: "/telegram.svg",
    size: 22,
  },
  {
    label: "GitHub",
    href: "https://github.com/SublyFi",
    icon: "/github.svg",
    size: 24,
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rule bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, rgba(94,23,235,0.35) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-[1360px] px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <SublyLogo className="h-7 w-7" />
              <span className="font-display text-[24px] font-semibold tracking-tight">
                Subly
              </span>
              <span className="ml-2 inline-flex items-center gap-2 border border-subly-glow/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-subly-glow">
                <span className="h-1 w-1 rounded-full bg-subly-glow blink" />
                Live · Solana mainnet
              </span>
            </div>
            <p className="mt-6 max-w-md font-feature text-[20px] leading-[1.4] text-paper">
              Use now, pay never. Deposit USDC once — your agent pays for
              x402 APIs from vault yield, and principal isn&apos;t spent on
              API calls.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-subly-glow">
              ▌ Navigate
            </div>
            <ul className="space-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
              {[
                ["#problem", "Problem"],
                ["#solution", "Solution"],
                ["#connect", "Connect"],
                ["#market", "Market"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-paper/80 transition-colors hover:text-subly-glow"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-subly-glow">
              ▌ Elsewhere
            </div>
            <div className="flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Subly on ${s.label}`}
                  className="footer-icon inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 hover:scale-110"
                >
                  <Image src={s.icon} alt="" width={s.size} height={s.size} />
                </a>
              ))}
            </div>
            <a
              href="https://www.npmjs.com/package/@subly_fi/pay"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-subly-glow"
            >
              npm · @subly_fi/pay
            </a>
          </div>
        </div>

        <div className="mt-16 space-y-3 border-t border-paper/15 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
          <div className="normal-case tracking-[0.08em]">
            No guarantee of principal or yield. Payments are made at use
            time, and principal is not intentionally spent.
          </div>
          <div>© 2026 SublyFi · All rights reserved</div>
        </div>
      </div>

      <style jsx global>{`
        .footer-icon img {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </footer>
  );
}
