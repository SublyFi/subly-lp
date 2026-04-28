"use client";

type Tick = { label: string; value: string; status?: "live" | "ok" | "note" };

const TICKS: Tick[] = [
  { label: "STATUS", value: "LIVE", status: "live" },
  { label: "DEMO", value: "BUTTON-CLICK DEVNET PAYMENT", status: "ok" },
  { label: "TESTNET", value: "SOLANA DEVNET · 58 TESTS PASSING" },
  { label: "RAIL", value: "x402 V2 · HTTP 402" },
  { label: "ARCIUM", value: "MAINNET ALPHA · PHASE 5 Q3 2026", status: "note" },
  { label: "YIELD", value: "VAULT · 8.42% APY (DEVNET SIM)" },
  { label: "TARGET", value: "AUTONOMOUS AI AGENTS" },
  { label: "AUTHOR", value: "SUBLYFI · BUILT FOR COLOSSEUM FRONTIER" },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {TICKS.map((t, i) => (
        <span key={i} className="flex items-center gap-2 px-6">
          {t.status === "live" && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-alert blink" />
          )}
          {t.status === "ok" && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-subly-glow" />
          )}
          {t.status === "note" && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-glow" />
          )}
          <span className="text-subly-glow/70">{t.label}</span>
          <span className="text-paper">{t.value}</span>
          <span className="text-subly-glow/40">§</span>
        </span>
      ))}
    </div>
  );
}

export function TickerBar() {
  return (
    <div className="relative z-30 overflow-hidden border-b border-subly bg-ink text-paper">
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(94,23,235,0.6) 50%, transparent 100%)",
        }}
      />
      <div className="relative flex whitespace-nowrap py-2 font-mono text-[10px] uppercase tracking-[0.18em] marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
