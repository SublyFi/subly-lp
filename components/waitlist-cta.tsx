"use client";

export function WaitlistCTA() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-b border-rule bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(94,23,235,0.18) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(94,23,235,0.10) 0%, transparent 50%)",
        }}
      />
      <div className="gridlines-purple pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-[1360px] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly">
            ▌ Waitlist
          </div>
          <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.95] tracking-tight md:text-[72px]">
            Join the{" "}
            <span className="font-feature text-subly">waitlist.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-xl font-feature text-[20px] leading-[1.4] text-ink md:text-[24px]">
            Be first in line when Subly opens to AI agent builders.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[600px]">
              <div
                id="getWaitlistContainerBottom"
                data-waitlist_id="31247"
                data-widget_type="WIDGET_2"
                className="subly-waitlist"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
