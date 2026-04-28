"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SublyLogo } from "./subly-logo";

const NAV = [
  { label: "Demo", href: "#demo" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Privacy", href: "#privacy" },
  { label: "Market", href: "#market" },
  { label: "Architecture", href: "#architecture" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-30 border-b border-ink bg-paper">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 py-5 md:gap-8 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <SublyLogo className="h-9 w-9 transition-transform group-hover:rotate-6" />
          <span className="font-display text-[26px] font-semibold tracking-tight text-[#8c52ff]">
            Subly
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative transition-colors hover:text-subly"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a
            href="https://x.com/subly_fi"
            target="_blank"
            rel="noreferrer"
            aria-label="Subly on X"
            className="hidden items-center justify-center text-ink transition-transform hover:-translate-y-0.5 hover:scale-110 md:inline-flex"
          >
            <Image src="/x.svg" alt="" width={26} height={26} />
          </a>
          <a
            href="https://t.me/+hR5mDS-l7bBhNjFl"
            target="_blank"
            rel="noreferrer"
            aria-label="Subly Telegram group"
            className="hidden items-center justify-center text-ink transition-transform hover:-translate-y-0.5 hover:scale-110 md:inline-flex"
          >
            <Image src="/telegram.svg" alt="" width={26} height={26} />
          </a>
          <a
            href="#demo"
            className="group hidden items-center gap-2 border border-subly bg-subly px-3 py-2 text-white transition-colors hover:bg-subly-deep hover:border-subly-deep md:inline-flex"
          >
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-glow">
              <span className="absolute inset-0 animate-ping rounded-full bg-glow/60" />
            </span>
            Try demo
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:border-subly hover:text-subly md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          open ? "block" : "hidden"
        } border-t border-ink bg-paper`}
      >
        <nav className="mx-auto flex max-w-[1360px] flex-col px-6 py-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-rule py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:text-subly"
            >
              {item.label}
            </a>
          ))}

          <div className="mt-6 flex items-center gap-6">
            <a
              href="https://x.com/subly_fi"
              target="_blank"
              rel="noreferrer"
              aria-label="Subly on X"
              className="inline-flex items-center justify-center text-ink"
              onClick={() => setOpen(false)}
            >
              <Image src="/x.svg" alt="" width={28} height={28} />
            </a>
            <a
              href="https://t.me/+hR5mDS-l7bBhNjFl"
              target="_blank"
              rel="noreferrer"
              aria-label="Subly Telegram group"
              className="inline-flex items-center justify-center text-ink"
              onClick={() => setOpen(false)}
            >
              <Image src="/telegram.svg" alt="" width={28} height={28} />
            </a>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="ml-auto inline-flex items-center gap-2 border border-subly bg-subly px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white"
            >
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-glow">
                <span className="absolute inset-0 animate-ping rounded-full bg-glow/60" />
              </span>
              Try demo
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
