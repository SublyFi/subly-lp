export function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 48px, var(--subly) 48px 49px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 90% 20%, rgba(94,23,235,0.18) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
              ▌ Find us
            </div>
            <h2 className="mt-4 font-display text-[44px] font-semibold leading-[0.95] tracking-tight text-ink md:text-[64px]">
              Stay in
              <br />
              <span className="font-feature text-subly">the loop.</span>
            </h2>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ul className="space-y-2">
              <Social
                label="Follow the build"
                handle="x.com/subly_fi"
                href="https://x.com/subly_fi"
              />
              <Social
                label="Join the group"
                handle="t.me/+hR5mDS-l7bBhNjFl"
                href="https://t.me/+hR5mDS-l7bBhNjFl"
              />
              <Social
                label="Read the code"
                handle="github.com/SublyFi"
                href="https://github.com/SublyFi"
              />
              <Social
                label="Academic foundation"
                handle="Li et al. · arXiv 2603.01179"
                href="https://arxiv.org/abs/2603.01179"
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Social({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-baseline justify-between gap-4 border-b border-rule py-4 font-mono text-[13px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-subly"
      >
        <span className="text-ink-muted transition-colors group-hover:text-subly">
          {label}
        </span>
        <span className="flex items-center gap-3 text-ink transition-colors group-hover:text-subly">
          {handle}
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            ↗
          </span>
        </span>
      </a>
    </li>
  );
}
