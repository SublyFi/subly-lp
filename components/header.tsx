import Image from "next/image";
import Link from "next/link";
import { SublyLogo } from "./subly-logo";

const NAV = [
  { label: "Demo", href: "#demo" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Privacy", href: "#privacy" },
  { label: "Market", href: "#market" },
  { label: "Architecture", href: "#architecture" },
  { label: "Roadmap", href: "#roadmap" },
];

export function Header() {
  return (
    <header className="relative z-20 border-b border-ink bg-paper">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-6 py-5 md:px-10">
        <Link href="/" className="group flex items-center gap-3">
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

        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a
            href="https://x.com/subly_fi"
            target="_blank"
            rel="noreferrer"
            aria-label="Subly on X"
            className="hidden items-center justify-center transition-transform hover:-translate-y-0.5 hover:scale-110 md:inline-flex"
          >
            <Image
              src="/xicon.svg"
              alt=""
              width={32}
              height={32}
            />
          </a>
          <a
            href="https://t.me/+hR5mDS-l7bBhNjFl"
            target="_blank"
            rel="noreferrer"
            aria-label="Subly Telegram group"
            className="hidden items-center justify-center transition-transform hover:-translate-y-0.5 hover:scale-110 md:inline-flex"
          >
            <Image
              src="/telegram.png"
              alt=""
              width={32}
              height={32}
            />
          </a>
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 border border-subly bg-subly px-3 py-2 text-white transition-colors hover:bg-subly-deep hover:border-subly-deep"
          >
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-glow">
              <span className="absolute inset-0 animate-ping rounded-full bg-glow/60" />
            </span>
            Try demo
          </a>
        </div>
      </div>
    </header>
  );
}
