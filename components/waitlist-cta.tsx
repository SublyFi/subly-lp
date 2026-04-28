"use client";

export function WaitlistCTA() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-b border-rule bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(94,23,235,0.35) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(94,23,235,0.20) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200,179,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,179,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
              ▌ Waitlist
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.95] tracking-tight md:text-[72px]">
              Join the{" "}
              <span className="font-feature text-subly-glow">waitlist.</span>
            </h2>
            <p className="mt-6 max-w-xl font-feature text-[20px] leading-[1.4] text-paper md:text-[24px]">
              Be first in line when Subly opens to AI agent builders.
            </p>
          </div>

          <div className="md:col-span-5">
            <div
              id="getWaitlistContainerBottom"
              data-waitlist_id="31247"
              data-widget_type="WIDGET_2"
              className="subly-waitlist"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
