"use client";

import Script from "next/script";

export function CTASection() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-b border-rule bg-paper"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 48px, var(--ink) 48px 49px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-28 md:px-10 md:py-36">
        <div className="mb-8 flex items-center gap-4">
          <span className="eyebrow">§ 07 · Invitation</span>
          <span className="hair-rule w-24" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            Private devnet · builders first
          </span>
        </div>

        <h2 className="max-w-5xl font-display text-[14vw] font-black leading-[0.84] tracking-normal text-ink md:text-[140px] lg:text-[180px]">
          Stop topping{" "}
          <span className="font-serif-it font-normal text-subly">up.</span>
          <br />
          Start deploying agents{" "}
          <span className="font-serif-it font-normal">
            that pay themselves.
          </span>
        </h2>

        <p className="mt-10 max-w-2xl font-serif-it text-[24px] leading-[1.35] text-ink-soft md:text-[28px]">
          If you ship AI agents to production — research agents, trading agents,
          autonomous DevOps, data-buying pipelines — Subly is the funding layer
          you&apos;ve been manually impersonating.
        </p>

        <div className="mt-12 grid gap-10 border-t border-ink pt-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Request early access
            </div>
            <div
              id="getWaitlistContainer"
              data-waitlist_id="31247"
              data-widget_type="WIDGET_2"
              className="subly-waitlist"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
            />
            <Script
              src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"
              strategy="afterInteractive"
            />
            <p className="mt-4 max-w-md font-sans text-[13px] leading-[1.7] text-ink-muted">
              We&apos;ll reach out with a devnet invite, SDK access, and the
              attestation verifier. Single deposit, zero cron jobs, your agents
              keep running while you sleep.
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Or find us
            </div>
            <ul className="space-y-4">
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
        className="group flex items-baseline justify-between gap-4 border-b border-rule py-3 font-mono text-[13px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-subly"
      >
        <span className="text-ink-muted">{label}</span>
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
