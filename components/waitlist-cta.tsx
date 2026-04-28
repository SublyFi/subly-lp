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
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
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
          <div className="mt-10 w-full">
            <div
              id="getWaitlistContainerBottom"
              data-waitlist_id="31247"
              data-widget_type="WIDGET_2"
              className="subly-waitlist subly-waitlist-cta"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .subly-waitlist-cta .waitlist-container,
        .subly-waitlist-cta .waitlist-form,
        .subly-waitlist-cta form {
          width: 100% !important;
          max-width: 560px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .subly-waitlist-cta input[type="email"] {
          height: 52px !important;
          font-size: 13px !important;
        }
        .subly-waitlist-cta button {
          height: 52px !important;
          padding-left: 24px !important;
          padding-right: 24px !important;
          font-size: 13px !important;
        }
      `}</style>
    </section>
  );
}
