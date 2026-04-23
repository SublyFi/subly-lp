import { SublyLogo } from "./subly-logo";

export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-ink text-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <SublyLogo className="h-7 w-7" />
              <span className="font-display text-[22px] font-semibold tracking-tight">
                Subly
              </span>
            </div>
            <p className="mt-6 max-w-md font-serif-it text-[20px] leading-[1.35] text-paper/80">
              A privacy-first PayFi protocol for AI agents that would
              rather not wait for a human to top them up.
            </p>
            <p className="mt-6 max-w-md font-sans text-[13px] leading-[1.7] text-paper/60">
              Built for Solana. Assembled inside enclaves. Audited by keys
              you control. Use Now, Pay Never.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
              Navigate
            </div>
            <ul className="space-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
              <li>
                <a href="#thesis" className="text-paper/80 hover:text-glow">
                  Thesis
                </a>
              </li>
              <li>
                <a href="#how" className="text-paper/80 hover:text-glow">
                  How it works
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-paper/80 hover:text-glow">
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="text-paper/80 hover:text-glow"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-paper/80 hover:text-glow">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
              Elsewhere
            </div>
            <ul className="space-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
              <li>
                <a
                  href="https://x.com/subly_fi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-paper/80 hover:text-glow"
                >
                  x.com/subly_fi ↗
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+hR5mDS-l7bBhNjFl"
                  target="_blank"
                  rel="noreferrer"
                  className="text-paper/80 hover:text-glow"
                >
                  telegram group ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SublyFi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-paper/80 hover:text-glow"
                >
                  github.com/SublyFi ↗
                </a>
              </li>
              <li>
                <a
                  href="https://arxiv.org/abs/2603.01179"
                  target="_blank"
                  rel="noreferrer"
                  className="text-paper/80 hover:text-glow"
                >
                  paper · arXiv:2603.01179 ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50 md:flex-row md:items-center md:justify-between">
          <div>© 2026 SublyFi · All rights reserved</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Colophon: Fraunces + Instrument Serif + JetBrains Mono + Geist</span>
            <span>·</span>
            <span>Built for Colosseum Frontier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
