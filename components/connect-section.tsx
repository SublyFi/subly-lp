"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Sprout,
  Terminal,
} from "lucide-react";

const CLAUDE_CODE_CMD = "claude mcp add subly -- npx -y @subly_fi/pay mcp";

const CLAUDE_DESKTOP_JSON = `{
  "mcpServers": {
    "subly": {
      "command": "npx",
      "args": ["-y", "@subly_fi/pay", "mcp"],
      "env": {
        "SUBLY_DEMO_AGENT_KEYPAIR_PATH": "/Users/you/.subly/agent.json"
      }
    }
  }
}`;

const OPENCLAW_CMD = "openclaw skills install subly-pay";

const CLI_CMD = 'npx -y @subly_fi/pay fetch "https://seller.example.com/api/premium"';

const MCP_TOOLS = [
  {
    name: "create_subly_setup_link",
    body: "Owner onboarding. One Face ID approves the spending mandate and the first deposit.",
  },
  {
    name: "check_subly_setup",
    body: "Confirms the human owner finished setup before anything moves.",
  },
  {
    name: "deposit_to_subly_vault",
    body: "Moves USDC into the vault on Kamino. Minimum is just over 1 USDC.",
  },
  {
    name: "get_subly_yield_budget",
    body: "Shows how much spendable yield the agent has right now.",
  },
  {
    name: "fetch_with_subly_payment",
    body: "Fetches any x402 URL. The call settles from yield and returns a receipt.",
  },
  {
    name: "withdraw_from_subly_vault",
    body: "The exit path. Principal returns to the agent wallet.",
  },
];

const FIRST_RUN = [
  {
    n: "01",
    title: "Create a keypair.",
    body: "Bring your own Solana key — or a Circle / Privy custody wallet. Subly never holds it.",
    code: "solana-keygen new -o ~/.subly/agent.json",
  },
  {
    n: "02",
    title: "Fund it with USDC.",
    body: "Send USDC on Solana mainnet to the printed address. No SOL needed — network fees are sponsored.",
  },
  {
    n: "03",
    title: "Say “set up Subly.”",
    body: "The agent sends a one-time setup link. The owner reviews the spending limits and approves the mandate plus the first deposit with one Face ID.",
  },
  {
    n: "04",
    title: "Ask for anything paid.",
    body: "Point the agent at any x402 paywall. It pays from vault yield and returns the response plus a Solscan receipt.",
  },
];

const GUARDRAILS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: KeyRound,
    title: "Non-custodial",
    body: "Your key signs locally and never reaches Subly. Circle and Privy custody wallets work too.",
  },
  {
    icon: ShieldCheck,
    title: "Per-payment cap",
    body: "Every call is capped client-side — 0.01 USDC by default. Raising it is a deliberate act.",
  },
  {
    icon: Fingerprint,
    title: "Owner approvals",
    body: "Deposits, and payments above your threshold, pause for a Face ID approval link first.",
  },
  {
    icon: Sprout,
    title: "Yield-only spending",
    body: "The relayer refuses payments beyond spendable yield. No API call can draw on principal.",
  },
];

export function ConnectSection() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return (
    <section
      id="connect"
      className="relative overflow-hidden border-b border-rule bg-ink text-paper"
    >
      <div className="gridlines absolute inset-0 opacity-[0.08]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 90% 0%, rgba(94,23,235,0.40) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(94,23,235,0.20) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-14 flex items-center gap-4">
          <span className="inline-flex items-center gap-2 border border-subly-glow/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-subly-glow blink" />
            </span>
            Live · Solana mainnet
          </span>
          <span className="hidden h-px flex-1 bg-paper/20 md:block" />
        </div>

        <div className="mb-14 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
              ▌ Connect
            </div>
            <h2 className="mt-3 font-display text-[52px] font-semibold leading-[0.92] tracking-tight text-paper md:text-[80px]">
              Plug it into{" "}
              <span className="font-feature text-subly-glow">your agent.</span>
            </h2>
            <p className="mt-8 max-w-2xl font-feature text-[24px] leading-[1.3] text-paper md:text-[28px]">
              One npm package —{" "}
              <span className="text-glow">an MCP server, an agent skill, and
              a CLI.</span>
            </p>
          </div>
          <div className="md:col-span-5">
            <p className="font-sans text-[15px] leading-[1.75] text-paper/80 md:text-[16px]">
              <code className="font-mono text-[14px] text-glow">
                @subly_fi/pay
              </code>{" "}
              ships the whole lifecycle: owner onboarding, deposits, yield
              budget, paid fetches, withdrawals. It runs anywhere MCP runs —
              Claude Code, Claude Desktop, Cursor — and as an OpenClaw skill.
              No API key, no clone, nothing to deploy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.npmjs.com/package/@subly_fi/pay"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 border border-paper/25 bg-paper/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="text-glow">npm</span> @subly_fi/pay
                <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://github.com/SublyFi"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 border border-paper/25 bg-paper/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                GitHub
                <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Install paths */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InstallCard
            kicker="MCP · Claude Code"
            title="One command in the terminal."
            caption="Registers the Subly MCP server for Claude Code. The same npx command works in Cursor and any other MCP client."
            terminalLabel="zsh: claude code"
            code={CLAUDE_CODE_CMD}
            output={[
              { text: '✓ Added stdio MCP server "subly"', tone: "ok" },
              { text: "6 tools · setup, deposit, budget, fetch, withdraw", tone: "dim" },
            ]}
            copyKey="claude-code"
            copied={copied}
            onCopy={copy}
          />
          <InstallCard
            kicker="MCP · Claude Desktop"
            title="One block of config."
            caption="Settings → Developer → Edit Config, paste, restart. GUI apps don't read your shell env, so the keypair path goes in the env block — as an absolute path."
            terminalLabel="claude_desktop_config.json"
            code={CLAUDE_DESKTOP_JSON}
            copyKey="claude-desktop"
            copied={copied}
            onCopy={copy}
          />
          <InstallCard
            kicker="Skill · OpenClaw"
            title="One skill install."
            caption="The subly-pay skill from ClawHub teaches an OpenClaw agent when to pay, how to read receipts, and when to stop. It shells out to the same npx package."
            terminalLabel="zsh: openclaw"
            code={OPENCLAW_CMD}
            output={[
              { text: "✓ subly-pay 0.2.1 installed from ClawHub", tone: "ok" },
            ]}
            copyKey="openclaw"
            copied={copied}
            onCopy={copy}
          />
          <InstallCard
            kicker="CLI · One-shot"
            title="One paid fetch."
            caption="Pays for a single x402 URL from yield and prints a JSON receipt — amount, payee, and a Solscan link. This is also what the skill runs under the hood."
            terminalLabel="zsh: pay"
            code={CLI_CMD}
            output={[
              { text: "✓ paid 0.01 USDC from yield", tone: "ok" },
              { text: "receipt → solscan.io/tx/3xK…9fQ", tone: "dim" },
            ]}
            copyKey="cli"
            copied={copied}
            onCopy={copy}
          />
        </div>

        {/* MCP tools */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <Terminal className="h-4 w-4 text-glow" aria-hidden />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-glow">
              Six MCP tools, full lifecycle
            </h3>
            <span className="hidden h-px flex-1 bg-paper/15 md:block" />
          </div>
          <div className="grid grid-cols-1 gap-px border border-paper/15 bg-paper/15 md:grid-cols-2 lg:grid-cols-3">
            {MCP_TOOLS.map((tool) => (
              <div key={tool.name} className="bg-ink p-5 md:p-6">
                <div className="break-words font-mono text-[13px] font-semibold text-subly-glow">
                  {tool.name}
                </div>
                <p className="mt-3 text-[13px] leading-[1.65] text-paper/70">
                  {tool.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* First run */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
              ▌ First run
            </div>
            <h3 className="mt-3 font-display text-[36px] font-semibold leading-[1.0] tracking-tight text-paper md:text-[48px]">
              From zero to paying agent in four steps.
            </h3>
            <p className="mt-6 text-[14px] leading-[1.7] text-paper/70">
              A human owner stays in charge: setup, spending limits, and
              anything above the approval threshold are confirmed with Face ID
              or a wallet signature. After that, the flow is hands-free.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-px border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:col-span-8">
            {FIRST_RUN.map((step) => (
              <li key={step.n} className="bg-ink p-5 md:p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-glow">
                  {step.n}
                </span>
                <h4 className="mt-3 font-display text-[22px] font-semibold leading-[1.1] tracking-tight text-paper">
                  {step.title}
                </h4>
                <p className="mt-3 text-[13px] leading-[1.65] text-paper/70">
                  {step.body}
                </p>
                {step.code ? (
                  <code className="mt-4 block overflow-x-auto whitespace-nowrap border border-paper/15 bg-black px-3 py-2 font-mono text-[11px] text-paper/85">
                    {step.code}
                  </code>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {/* Guardrails */}
        <div className="mt-20 border-t border-paper/15 pt-14">
          <div className="mb-8 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-subly-glow">
                ▌ Guardrails
              </div>
              <h3 className="mt-3 font-display text-[36px] font-semibold leading-[1.0] tracking-tight text-paper md:text-[48px]">
                Spending is bounded twice.
              </h3>
            </div>
            <div className="md:col-span-5">
              <p className="text-[14px] leading-[1.7] text-paper/70">
                A client-side cap on every call, and a server-side guard that
                refuses to realize anything beyond spendable yield. The
                deposited principal is never touched by a payment.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
            {GUARDRAILS.map((item) => (
              <div key={item.title} className="bg-ink p-5 md:p-6">
                <item.icon className="h-5 w-5 text-glow" aria-hidden />
                <h4 className="mt-4 font-display text-[20px] font-semibold leading-[1.1] tracking-tight text-paper">
                  {item.title}
                </h4>
                <p className="mt-3 text-[13px] leading-[1.65] text-paper/70">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallCard({
  kicker,
  title,
  caption,
  terminalLabel,
  code,
  output,
  copyKey,
  copied,
  onCopy,
}: {
  kicker: string;
  title: string;
  caption: string;
  terminalLabel: string;
  code: string;
  output?: Array<{ text: string; tone: "ok" | "dim" }>;
  copyKey: string;
  copied: string | null;
  onCopy: (value: string, key: string) => void;
}) {
  return (
    <div className="flex flex-col border border-paper/20 bg-paper/5 p-5 md:p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-glow">
        ▌ {kicker}
      </div>
      <h3 className="mt-3 font-display text-[24px] font-semibold leading-[1.1] tracking-tight text-paper md:text-[28px]">
        {title}
      </h3>
      <p className="mt-3 text-[13px] leading-[1.65] text-paper/70">{caption}</p>

      <div className="mt-5 flex flex-1 flex-col overflow-hidden border border-paper/15 bg-black">
        <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-4 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-alert/80" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-glow/70" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ok/80" />
            <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
              {terminalLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCopy(code, copyKey)}
            aria-label={`Copy ${kicker} command`}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-paper/20 px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {copied === copyKey ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clipboard className="h-3.5 w-3.5" />
            )}
            {copied === copyKey ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 pb-0 font-mono text-[13px] leading-[1.7] text-paper">
          <code>{code}</code>
        </pre>
        <div className="flex-1 space-y-1 overflow-x-auto p-4 pt-3 font-mono text-[12px] leading-[1.6]">
          {output?.map((line) => (
            <div
              key={line.text}
              className={`whitespace-nowrap ${
                line.tone === "ok" ? "text-glow" : "text-paper/50"
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
