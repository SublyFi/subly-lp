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
                Live · devnet
              </span>
            </div>
            <p className="mt-6 max-w-md font-feature text-[20px] leading-[1.4] text-paper">
              A privacy-first PayFi protocol for AI agents that would rather
              not wait for a human to top them up.
            </p>
            <p className="mt-6 max-w-md font-sans text-[13px] leading-[1.75] text-paper/60">
              Built for Solana. Assembled inside enclaves. Audited by keys you
              control.{" "}
              <span className="text-subly-glow">Use Now, Pay Never.</span>
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
                ["#privacy", "Privacy"],
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
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50 md:flex-row md:items-center md:justify-between">
          <div>© 2026 SublyFi · All rights reserved</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              Colophon: Fraunces + Instrument Serif + JetBrains Mono + Geist
            </span>
            <span className="text-subly-glow">·</span>
            <span>Built for Colosseum Frontier</span>
          </div>
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
