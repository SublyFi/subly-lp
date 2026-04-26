"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Droplets,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from "lucide-react";

type AttestationState = {
  configured?: boolean;
  missing?: string[];
  facilitatorUrl?: string;
  network?: string;
  x402Network?: string;
  usdcMint?: string;
  vaultConfig?: string;
  vaultTokenAccount?: string;
  attestationPolicyHash?: string;
  sellerBaseUrl?: string;
  sellerTokenAccount?: string;
  paymentAmount?: string;
  faucetAmount?: string;
  buyerMode?: string;
  routes?: {
    x402?: string;
    subly402?: string;
  };
  attestation?: {
    vaultConfig: string;
    vaultSigner: string;
    attestationPolicyHash: string;
    snapshotSeqno?: number;
    issuedAt?: string;
    expiresAt?: string;
  };
  error?: string;
  message?: string;
};

type FaucetResult = {
  ok: boolean;
  recipient: string;
  tokenAccount: string;
  amount: string;
  createAtaTx: string;
  faucetTx: string;
  mint: string;
};

type SettlementStatus = {
  ok: boolean;
  settlementId: string;
  verificationId?: string;
  providerId?: string;
  status?: string;
  batchId?: number | null;
  txSignature?: string | null;
};

type ChainEdge = {
  label: string;
  from: string;
  to: string;
  amount?: string;
  tx?: string | null;
  status?: string | null;
};

type FlowResult = {
  ok: boolean;
  mode: string;
  route: string;
  network: string;
  facilitatorUrl: string;
  amount: string;
  buyer: string;
  buyerTokenAccount: string;
  sellerWallet?: string;
  sellerTokenAccount: string;
  vaultTokenAccount?: string;
  providerId?: string;
  faucetTx: string;
  settlementTx?: string | null;
  depositTx?: string;
  depositAmount?: string;
  paymentResponse?: Record<string, unknown> | null;
  settlementStatus?: SettlementStatus | null;
  attestation?: {
    vaultConfig: string;
    vaultSigner: string;
    attestationPolicyHash: string;
    snapshotSeqno?: number;
    issuedAt?: string;
    expiresAt?: string;
  };
  chainView: {
    visibleNow: ChainEdge[];
    hidden: ChainEdge[];
    delayed?: ChainEdge[];
    summary: string;
  };
};

type RunResult = {
  ok: boolean;
  mode: string;
  buyer: string;
  seller: {
    baseUrl: string;
    metadataUrl: string;
    wallet?: string;
    tokenAccount?: string;
    routes: {
      x402: string;
      subly402: string;
    };
  };
  asset: {
    mint: string;
    symbol: string;
    decimals: number;
  };
  x402: FlowResult;
  subly402: FlowResult;
  comparison: {
    x402: string[];
    subly402: string[];
  };
};

type ApiError = {
  ok: false;
  error: string;
  message: string;
  missing?: string[];
};

const sellerCode = `// Official x402 route
app.use(x402PaymentMiddleware({
  "GET /x402/weather": {
    accepts: [{
      scheme: "exact",
      network: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      payTo: process.env.SELLER_WALLET!,
      price: {
        asset: process.env.SUBLY402_USDC_MINT!,
        amount: "1100000",
      },
    }],
  },
}, officialX402ResourceServer));

// Subly402 route
const sublyResourceServer = new Subly402ResourceServer(facilitator)
  .register("solana:devnet", new Subly402ExactScheme());

app.use(sublyPaymentMiddleware({
  "GET /subly/weather": {
    accepts: [{
      scheme: "exact",
      price: 1100000,
      network: "solana:devnet",
      sellerWallet: process.env.SELLER_WALLET!,
    }],
  },
}, sublyResourceServer));`;

const buyerCode = `// Official x402 Buyer
const x402Client = new X402Client()
  .register(
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
    new X402ExactSvmScheme(buyer, { rpcUrl })
  );
const x402Fetch = wrapX402FetchWithPayment(fetch, x402Client);
await x402Fetch("http://seller.demo.sublyfi.com/x402/weather");

// Subly402 Buyer
const client = new Subly402Client({
  trustedFacilitators: ["https://api.demo.sublyfi.com"],
  autoDeposit: {
    maxDepositPerRequest: "1100000",
    deposit: async ({ amountAtomic, details }) => {
      await depositIntoSublyVault({ amountAtomic, details });
    },
  },
  policy: { maxPaymentPerRequest: "1100000" },
}).register("solana:*", new Subly402ExactScheme(buyer));
const sublyFetch = wrapSublyFetchWithPayment(fetch, client);
await sublyFetch("http://seller.demo.sublyfi.com/subly/weather");`;

function short(value?: string | number | null) {
  const text = String(value || "");
  if (text.length <= 16) {
    return text || "n/a";
  }
  return `${text.slice(0, 6)}...${text.slice(-6)}`;
}

function txUrl(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

function addressUrl(value: string) {
  return `https://explorer.solana.com/address/${value}?cluster=devnet`;
}

async function postJson<T extends object>(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  const data = (await response.json()) as T | ApiError;
  if (!response.ok || ("ok" in data && data.ok === false)) {
    throw data as ApiError;
  }
  return data as T;
}

export function DemoSection() {
  const [attestation, setAttestation] = useState<AttestationState | null>(null);
  const [attestationLoading, setAttestationLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [faucetBusy, setFaucetBusy] = useState(false);
  const [runBusy, setRunBusy] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [faucetResult, setFaucetResult] = useState<FaucetResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const sublySettlementId = useMemo(() => {
    const value = runResult?.subly402.paymentResponse?.settlementId;
    return typeof value === "string" ? value : "";
  }, [runResult]);

  const settlementReady =
    runResult?.subly402.settlementStatus?.status === "BatchedOnchain" &&
    runResult?.subly402.settlementStatus?.txSignature;

  const privacyRows = useMemo(
    () => [
      {
        label: "x402",
        value: "buyer token account -> seller token account is visible on the settlement tx",
        tone: "text-alert",
      },
      {
        label: "Subly402",
        value: "buyer token account -> Subly vault deposit is visible; buyer -> seller is not",
        tone: "text-glow",
      },
      {
        label: "Payout",
        value: "vault -> seller payout appears after batch settlement",
        tone: "text-paper/80",
      },
    ],
    []
  );

  useEffect(() => {
    void refreshAttestation();
  }, []);

  async function refreshAttestation() {
    setAttestationLoading(true);
    try {
      const response = await fetch("/api/demo/attestation", {
        cache: "no-store",
      });
      setAttestation((await response.json()) as AttestationState);
    } finally {
      setAttestationLoading(false);
    }
  }

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  async function requestTestUsdc() {
    setError(null);
    setFaucetBusy(true);
    try {
      setFaucetResult(
        await postJson<FaucetResult>("/api/demo/faucet", { recipient })
      );
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setFaucetBusy(false);
    }
  }

  async function runLivePayment() {
    setError(null);
    setRunBusy(true);
    try {
      setRunResult(await postJson<RunResult>("/api/demo/run"));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setRunBusy(false);
    }
  }

  async function refreshSettlementStatus() {
    if (!sublySettlementId || !runResult?.subly402.providerId) {
      return;
    }
    setError(null);
    setStatusBusy(true);
    try {
      const status = await postJson<SettlementStatus>(
        "/api/demo/settlement-status",
        {
          settlementId: sublySettlementId,
          providerId: runResult.subly402.providerId,
        }
      );
      setRunResult({
        ...runResult,
        subly402: { ...runResult.subly402, settlementStatus: status },
      });
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setStatusBusy(false);
    }
  }

  return (
    <section
      id="demo"
      className="relative overflow-hidden border-b border-rule bg-ink text-paper"
    >
      <div className="gridlines absolute inset-0 opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-glow">
              § 01 · x402 vs Subly402 live demo
            </div>
            <h2 className="font-display text-[54px] font-semibold leading-[0.94] text-paper md:text-[78px]">
              Click once.
              <br />
              Compare two
              <br />
              paid requests.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-serif-it text-[26px] leading-[1.3] text-paper md:text-[32px]">
              The hosted Buyer calls the same Seller host twice: once through
              official x402, once through Subly402.
            </p>
            <p className="mt-6 max-w-xl text-[14px] leading-[1.7] text-paper/70">
              The result shows the public Solana devnet evidence. x402 settles
              as a direct Buyer token account to Seller token account transfer.
              Subly402 shows a Buyer deposit into the vault, with the Seller
              payout delayed into a batch.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-paper/20 bg-paper/5 shadow-[6px_6px_0_0_var(--glow)]">
            <div className="flex flex-col gap-4 border-b border-paper/15 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-glow">
                  <Terminal className="h-4 w-4" />
                  Devnet payment console
                </div>
                <div className="mt-2 text-[13px] text-paper/60">
                  Seller {short(attestation?.sellerBaseUrl)} · hosted buyer ·{" "}
                  {attestation?.network || "solana:devnet"}
                </div>
              </div>
              <button
                type="button"
                onClick={runLivePayment}
                disabled={runBusy}
                className="inline-flex h-11 items-center justify-center gap-2 border border-glow bg-glow px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {runBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run comparison
              </button>
            </div>

            <div className="grid border-b border-paper/15 md:grid-cols-3">
              <StepCell
                n="01"
                label="x402 direct"
                value={
                  runResult?.x402.settlementTx
                    ? short(runResult.x402.settlementTx)
                    : attestation?.routes?.x402
                      ? "seller route ready"
                      : "pending"
                }
                active={runBusy}
                done={Boolean(runResult?.x402.settlementTx)}
              />
              <StepCell
                n="02"
                label="Subly deposit"
                value={
                  runResult?.subly402.depositTx
                    ? short(runResult.subly402.depositTx)
                    : attestation?.routes?.subly402
                      ? "seller route ready"
                      : "pending"
                }
                active={runBusy}
                done={Boolean(runResult?.subly402.depositTx)}
              />
              <StepCell
                n="03"
                label="Batch payout"
                value={
                  runResult?.subly402.settlementStatus?.status ||
                  sublySettlementId ||
                  "pending"
                }
                active={runBusy}
                done={Boolean(sublySettlementId)}
              />
            </div>

            <div className="grid gap-0 lg:grid-cols-2">
              <div className="border-b border-paper/15 p-5 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                    Live attestation
                  </span>
                  <button
                    type="button"
                    onClick={refreshAttestation}
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-glow hover:text-paper"
                  >
                    {attestationLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Refresh
                  </button>
                </div>
                <DataRow
                  label="Vault"
                  value={
                    attestation?.attestation?.vaultConfig ||
                    attestation?.vaultConfig
                  }
                  copyKey="vault"
                  onCopy={copy}
                />
                <DataRow
                  label="Signer"
                  value={attestation?.attestation?.vaultSigner}
                  copyKey="signer"
                  onCopy={copy}
                />
                <DataRow
                  label="Policy"
                  value={
                    attestation?.attestation?.attestationPolicyHash ||
                    attestation?.attestationPolicyHash
                  }
                  copyKey="policy"
                  onCopy={copy}
                />
                <DataRow
                  label="Vault ATA"
                  value={attestation?.vaultTokenAccount}
                  href={
                    attestation?.vaultTokenAccount
                      ? addressUrl(attestation.vaultTokenAccount)
                      : undefined
                  }
                />
                <DataRow label="Buyer" value={attestation?.buyerMode} />
                <DataRow
                  label="Seqno"
                  value={attestation?.attestation?.snapshotSeqno}
                />
                {attestation?.configured === false && (
                  <div className="mt-5 border border-alert/50 bg-alert/10 p-4 text-[12px] leading-[1.6] text-paper/75">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-alert">
                      Demo env missing
                    </div>
                    <p className="mt-2">
                      Live attestation is reachable, but payment execution is
                      disabled until the deployment has the hosted buyer,
                      faucet, seller, and vault env values.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  Result
                </div>
                {runResult ? (
                  <div className="space-y-5">
                    <DataRow
                      label="Buyer"
                      value={runResult.buyer}
                      href={addressUrl(runResult.buyer)}
                    />
                    <DataRow
                      label="Seller"
                      value={runResult.seller.tokenAccount}
                      href={
                        runResult.seller.tokenAccount
                          ? addressUrl(runResult.seller.tokenAccount)
                          : undefined
                      }
                    />
                    <FlowPanel
                      title="Official x402"
                      subtitle="direct settlement edge"
                      flow={runResult.x402}
                      onCopy={copy}
                    />
                    <FlowPanel
                      title="Subly402"
                      subtitle="vault deposit, batched payout"
                      flow={runResult.subly402}
                      onCopy={copy}
                    />
                    {settlementReady ? (
                      <TxRow
                        label="Batch payout"
                        signature={
                          runResult.subly402.settlementStatus!.txSignature!
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={refreshSettlementStatus}
                        disabled={statusBusy}
                        className="mt-2 inline-flex h-10 items-center gap-2 border border-paper/25 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow disabled:opacity-60"
                      >
                        {statusBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Check seller payout
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-[260px] flex-col justify-between border border-dashed border-paper/20 p-5">
                    <div>
                      <ShieldCheck className="h-8 w-8 text-glow" />
                      <p className="mt-5 max-w-sm font-serif-it text-[22px] leading-[1.3] text-paper">
                        A real devnet run returns both Seller route calls,
                        funding txs, the x402 settlement tx, the Subly vault
                        deposit tx, and the Subly settlement id.
                      </p>
                    </div>
                    <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
                      No wallet install required for this hosted demo.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="border-t border-alert/50 bg-alert/10 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-alert">
                  {error.error}
                </div>
                <p className="mt-2 text-[13px] leading-[1.6] text-paper/75">
                  {error.message}
                </p>
                {error.missing && error.missing.length > 0 && (
                  <ul className="mt-3 space-y-1 font-mono text-[10px] text-paper/60">
                    {error.missing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <div className="border border-paper/20 bg-paper/5 p-5">
              <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-glow">
                <Droplets className="h-4 w-4" />
                Test USDC faucet
              </div>
              <p className="text-[13px] leading-[1.7] text-paper/70">
                Paste a Solana devnet wallet address. The server creates the
                USDC ATA if needed and sends a small test amount.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="Devnet wallet address"
                  className="h-11 min-w-0 flex-1 border border-paper/25 bg-ink px-3 font-mono text-[12px] text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-glow"
                />
                <button
                  type="button"
                  onClick={requestTestUsdc}
                  disabled={faucetBusy || recipient.length < 32}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-paper/25 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-glow hover:text-glow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {faucetBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Droplets className="h-4 w-4" />
                  )}
                  Faucet
                </button>
              </div>
              {faucetResult && (
                <div className="mt-5 border-t border-paper/15 pt-4">
                  <DataRow label="Amount" value={faucetResult.amount} />
                  <DataRow
                    label="ATA"
                    value={faucetResult.tokenAccount}
                    href={addressUrl(faucetResult.tokenAccount)}
                  />
                  <TxRow label="Faucet tx" signature={faucetResult.faucetTx} />
                </div>
              )}
            </div>

            <div className="border border-paper/20 bg-paper/5 p-5">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-glow">
                Public chain view
              </div>
              <div className="space-y-3">
                {privacyRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[90px_1fr] gap-4 border-b border-paper/10 pb-3 last:border-b-0"
                  >
                    <span
                      className={`font-mono text-[10px] uppercase ${row.tone}`}
                    >
                      {row.label}
                    </span>
                    <span className="text-[13px] leading-[1.5] text-paper/70">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CodePanel
            title="Seller"
            subtitle="one middleware route, receiving wallet only"
            code={sellerCode}
            copied={copied === "seller-code"}
            onCopy={() => copy(sellerCode, "seller-code")}
          />
          <CodePanel
            title="Buyer"
            subtitle="@solana/kit signer + autoDeposit hook"
            code={buyerCode}
            copied={copied === "buyer-code"}
            onCopy={() => copy(buyerCode, "buyer-code")}
          />
        </div>
      </div>
    </section>
  );
}

function StepCell({
  n,
  label,
  value,
  active,
  done,
}: {
  n: string;
  label: string;
  value?: string | number | null;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="min-h-[116px] border-b border-paper/15 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
          {n}
        </span>
        {done ? (
          <CheckCircle2 className="h-4 w-4 text-glow" />
        ) : active ? (
          <Loader2 className="h-4 w-4 animate-spin text-glow" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-paper/25" />
        )}
      </div>
      <div className="mt-5 font-display text-[24px] font-semibold text-paper">
        {label}
      </div>
      <div className="mt-2 truncate font-mono text-[11px] text-paper/55">
        {value || "ready"}
      </div>
    </div>
  );
}

function DataRow({
  label,
  value,
  href,
  copyKey,
  onCopy,
}: {
  label: string;
  value?: string | number | null;
  href?: string;
  copyKey?: string;
  onCopy?: (value: string, key: string) => void;
}) {
  const text = value == null || value === "" ? "n/a" : String(value);
  const content = (
    <span className="min-w-0 truncate text-right text-paper">
      {short(text)}
    </span>
  );
  return (
    <div className="grid grid-cols-[92px_1fr] items-center gap-3 border-b border-paper/10 py-2.5 font-mono text-[11px] last:border-b-0">
      <span className="uppercase tracking-[0.16em] text-paper/45">{label}</span>
      <div className="flex min-w-0 items-center justify-end gap-2">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 text-paper transition-colors hover:text-glow"
          >
            {content}
          </a>
        ) : (
          content
        )}
        {copyKey && onCopy && text !== "n/a" && (
          <button
            type="button"
            onClick={() => onCopy(text, copyKey)}
            className="text-paper/35 transition-colors hover:text-glow"
            aria-label={`Copy ${label}`}
          >
            <Clipboard className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function TxRow({
  label,
  signature,
}: {
  label: string;
  signature?: string | null;
}) {
  if (!signature) {
    return <DataRow label={label} value="pending" />;
  }
  return <DataRow label={label} value={signature} href={txUrl(signature)} />;
}

function FlowPanel({
  title,
  subtitle,
  flow,
  onCopy,
}: {
  title: string;
  subtitle: string;
  flow: FlowResult;
  onCopy: (value: string, key: string) => void;
}) {
  const delayed = flow.chainView.delayed?.[0];
  return (
    <div className="border border-paper/15 bg-ink/35">
      <div className="flex items-start justify-between gap-3 border-b border-paper/10 p-3">
        <div>
          <div className="font-display text-[22px] font-semibold text-paper">
            {title}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
            {subtitle}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onCopy(flow.route, `${flow.mode}-route`)}
          className="text-paper/35 transition-colors hover:text-glow"
          aria-label={`Copy ${title} route`}
        >
          <Clipboard className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3">
        <DataRow label="Amount" value={flow.amount} />
        <DataRow
          label="Buyer ATA"
          value={flow.buyerTokenAccount}
          href={addressUrl(flow.buyerTokenAccount)}
        />
        <DataRow
          label="Seller ATA"
          value={flow.sellerTokenAccount}
          href={addressUrl(flow.sellerTokenAccount)}
        />
        {flow.vaultTokenAccount && (
          <DataRow
            label="Vault ATA"
            value={flow.vaultTokenAccount}
            href={addressUrl(flow.vaultTokenAccount)}
          />
        )}
        <TxRow label="Fund tx" signature={flow.faucetTx} />
        {flow.settlementTx ? (
          <TxRow label="Settle tx" signature={flow.settlementTx} />
        ) : (
          <TxRow label="Deposit tx" signature={flow.depositTx} />
        )}
        {delayed && (
          <TxRow label="Payout tx" signature={delayed.tx || null} />
        )}
        <div className="mt-3 border-t border-paper/10 pt-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/45">
            Chain excerpt
          </div>
          <div className="mt-2 space-y-2">
            {flow.chainView.visibleNow.map((edge) => (
              <EdgeRow key={`${edge.label}-${edge.tx || edge.to}`} edge={edge} />
            ))}
            {flow.chainView.hidden.map((edge) => (
              <EdgeRow
                key={`${edge.label}-${edge.to}`}
                edge={edge}
                hidden
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EdgeRow({ edge, hidden }: { edge: ChainEdge; hidden?: boolean }) {
  return (
    <div className="text-[12px] leading-[1.5] text-paper/65">
      <span className={hidden ? "text-alert" : "text-glow"}>
        {hidden ? "hidden" : "visible"}
      </span>{" "}
      <span className="font-mono">{short(edge.from)}</span>
      <span className="px-1 text-paper/35">-&gt;</span>
      <span className="font-mono">{short(edge.to)}</span>
      {edge.amount && <span className="ml-2 text-paper/45">{edge.amount}</span>}
    </div>
  );
}

function CodePanel({
  title,
  subtitle,
  code,
  copied,
  onCopy,
}: {
  title: string;
  subtitle: string;
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="border border-paper/20 bg-paper/5">
      <div className="flex items-center justify-between gap-4 border-b border-paper/15 p-4">
        <div>
          <div className="font-display text-[24px] font-semibold text-paper">
            {title}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
            {subtitle}
          </div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-9 items-center gap-2 border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-glow hover:text-glow"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[430px] overflow-auto p-4 text-[12px] leading-[1.65] text-paper/75">
        <code>{code}</code>
      </pre>
      <div className="flex items-center justify-between border-t border-paper/15 p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">
        <span>No Subly API key</span>
        <a
          href="https://docs.x402.org"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-glow"
        >
          x402 style
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
