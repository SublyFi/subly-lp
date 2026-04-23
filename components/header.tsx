import Link from "next/link";
import { SublyLogo } from "./subly-logo";

const NAV = [
  { label: "Thesis", href: "#thesis" },
  { label: "How it works", href: "#how" },
  { label: "Privacy", href: "#privacy" },
  { label: "Architecture", href: "#architecture" },
  { label: "Roadmap", href: "#roadmap" },
];

export function Header() {
  return (
    <header className="relative z-20 border-b border-rule">
      <div className="mx-auto flex max-w-[1360px] items-end justify-between gap-8 px-6 py-5 md:px-10">
        <Link href="/" className="flex items-end gap-3">
          <SublyLogo className="h-8 w-8" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[26px] font-semibold tracking-tight">
              Subly
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-muted">
              Vol. 01 · Edition α · 2026
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a
            href="https://x.com/subly_fi"
            target="_blank"
            rel="noreferrer"
            className="hidden text-ink-muted transition-colors hover:text-ink md:inline"
          >
            x.com/subly_fi
          </a>
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 border border-ink bg-ink px-3 py-2 text-paper transition-colors hover:bg-subly hover:border-subly"
          >
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-glow">
              <span className="absolute inset-0 animate-ping rounded-full bg-glow/60" />
            </span>
            Request access
          </a>
        </div>
      </div>
    </header>
  );
}
