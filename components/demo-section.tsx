"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clipboard,
  Droplets,
  Eye,
  EyeOff,
  ExternalLink,
  Landmark,
  Layers,
  Loader2,
  LockKeyhole,
  Pause,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Store,
  Terminal,
  Wallet,
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

const privacyDemoSteps = [
  {
    n: "01",
    label: "Request",
    phase: "Challenge",
    title: "Buyer asks for the same paid API.",
    body: "Both paths start with a normal HTTP request and a 402 challenge. The privacy difference starts with where the payment is allowed to settle.",
    x402: "The seller's 402 challenge points the buyer at a seller payTo account.",
    subly402:
      "The seller's 402 challenge points the buyer at an attested Subly vault policy.",
    observer:
      "No transfer has settled yet. The observer is waiting for the public payment trail.",
  },
  {
    n: "02",
    label: "Payment",
    phase: "Commit",
    title: "The buyer signs payment.",
    body: "x402 pays the seller directly. Subly402 keeps the x402-style retry flow, but the buyer deposits into the vault after checking attestation.",
    x402: "Buyer signs a direct USDC transfer to the seller.",
    subly402:
      "Buyer signs a vault deposit and a paid request bound to the attested policy.",
    observer:
      "x402 creates a buyer-to-seller edge. Subly402 creates a buyer-to-vault edge.",
  },
  {
    n: "03",
    label: "Public trail",
    phase: "Reveal",
    title: "The chain tells a different story.",
    body: "This is the core point: x402 exposes who paid which seller. Subly402 exposes that the buyer funded a vault, not the seller they called.",
    x402: "Public chain shows Buyer token account -> Seller token account.",
    subly402:
      "Public chain shows Buyer token account -> Subly vault. The direct seller edge is absent.",
    observer:
      "A block explorer can link buyer and seller in x402. With Subly402, that direct link is not visible.",
  },
  {
    n: "04",
    label: "Payout",
    phase: "Resolve",
    title: "Seller still gets paid.",
    body: "Subly402 is not hiding payment from the seller. It changes the public settlement shape so the seller receives a later vault payout instead of a direct buyer transfer.",
    x402: "The request is already publicly linkable to this seller.",
    subly402:
      "Seller receives a batched Vault -> Seller payout, separate from the buyer deposit.",
    observer:
      "The seller payout is public, but it is no longer the same onchain edge as the buyer's API call.",
  },
] as const;

const x402PhaseTrace = [
  {
    n: "01",
    label: "402 challenge",
    edge: "seller payTo exposed",
    tone: "neutral",
  },
  {
    n: "02",
    label: "direct transfer",
    edge: "Buyer -> Seller",
    tone: "risk",
  },
  {
    n: "03",
    label: "public graph",
    edge: "same edge remains readable",
    tone: "risk",
  },
  {
    n: "04",
    label: "seller state",
    edge: "already paid directly",
    tone: "risk",
  },
] as const;

const sublyPhaseTrace = [
  {
    n: "01",
    label: "attested policy",
    edge: "vault, not seller",
    tone: "private",
  },
  {
    n: "02",
    label: "vault deposit",
    edge: "Buyer -> Vault",
    tone: "private",
  },
  {
    n: "03",
    label: "public graph",
    edge: "Buyer -> Seller absent",
    tone: "hidden",
  },
  {
    n: "04",
    label: "demo batch",
    edge: "Vault -> Seller after ~1m",
    tone: "resolve",
  },
] as const;

type PhaseTone = "neutral" | "risk" | "private" | "hidden" | "resolve";
type PhaseTraceItem = {
  n: string;
  label: string;
  edge: string;
  tone: PhaseTone;
};

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

function flowStepForPath(
  variant: "x402" | "subly402",
  activeStep: number,
  runResult: RunResult | null
) {
  if (!runResult || activeStep < 2) {
    return activeStep;
  }
  if (variant === "x402" && runResult.x402.settlementTx) {
    return 3;
  }
  if (variant === "subly402") {
    if (runResult.subly402.settlementStatus?.txSignature) {
      return 3;
    }
    if (runResult.subly402.depositTx) {
      return 2;
    }
  }
  return activeStep;
}

function phaseButtonClass(index: number, selected: boolean, completed: boolean) {
  if (selected) {
    if (index === 1) {
      return "border-subly bg-subly text-paper";
    }
    if (index === 2) {
      return "border-alert bg-alert text-paper";
    }
    if (index === 3) {
      return "border-ok bg-ink text-paper";
    }
    return "border-ink bg-ink text-paper";
  }
  if (completed) {
    if (index === 1) {
      return "bg-subly/10 text-ink";
    }
    if (index === 2) {
      return "bg-alert/10 text-ink";
    }
    if (index === 3) {
      return "bg-ok/10 text-ink";
    }
    return "bg-paper-deep text-ink";
  }
  return "bg-paper text-ink hover:bg-paper-deep";
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
  const [activeStep, setActiveStep] = useState(0);
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
        value:
          "Each paid request can settle as a visible Buyer token account -> Seller token account transfer.",
        tone: "text-alert",
      },
      {
        label: "Subly402",
        value:
          "The buyer's visible transaction is a vault deposit. Seller payout is delayed and batched from the vault.",
        tone: "text-glow",
      },
      {
        label: "Why it matters",
        value:
          "The seller is paid, but public observers do not get the direct Buyer -> Seller edge for the API call.",
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
    setActiveStep(1);
    setRunBusy(true);
    try {
      const result = await postJson<RunResult>("/api/demo/run");
      setRunResult(result);
      setActiveStep(result.subly402.settlementStatus?.txSignature ? 3 : 2);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setRunBusy(false);
    }
  }

  function advancePrivacyStep() {
    setActiveStep((step) => (step + 1) % privacyDemoSteps.length);
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
        subly402: {
          ...runResult.subly402,
          settlementStatus: status,
          chainView: {
            ...runResult.subly402.chainView,
            delayed: runResult.subly402.chainView.delayed?.map(
              (edge, index) =>
                index === 0
                  ? {
                      ...edge,
                      status: status.status || edge.status,
                      tx: status.txSignature || edge.tx,
                    }
                  : edge
            ),
          },
        },
      });
      if (status.txSignature) {
        setActiveStep(3);
      }
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
              § 01 · Privacy flow demo
            </div>
            <h2 className="font-display text-[54px] font-semibold leading-[0.94] text-paper md:text-[78px]">
              Same API call.
              <br />
              Different public
              <br />
              trail.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-serif-it text-[26px] leading-[1.3] text-paper md:text-[32px]">
              Press through the flow. Official x402 makes the Buyer to Seller
              payment edge public. Subly402 keeps the x402-style HTTP flow, but
              changes what the chain reveals.
            </p>
            <p className="mt-6 max-w-xl text-[14px] leading-[1.7] text-paper/70">
              The live proof below calls the same Seller twice: once through
              official x402, once through Subly402. The important difference is
              not the API response. It is the public settlement graph.
            </p>
          </div>
        </div>

        <PrivacyStoryboard
          activeStep={activeStep}
          onStepChange={setActiveStep}
          onNextStep={advancePrivacyStep}
          onRunLive={runLivePayment}
          runBusy={runBusy}
          runResult={runResult}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-paper/20 bg-paper/5 shadow-[6px_6px_0_0_var(--glow)]">
            <div className="flex flex-col gap-4 border-b border-paper/15 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-glow">
                  <Terminal className="h-4 w-4" />
                  Live devnet proof
                </div>
                <div className="mt-2 text-[13px] text-paper/60">
                  Same seller · hosted buyer ·{" "}
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
                Run proof
              </button>
            </div>

            <div className="grid border-b border-paper/15 md:grid-cols-3">
              <StepCell
                n="01"
                label="x402 public edge"
                value={
                  runResult?.x402.settlementTx
                    ? "direct tx settled"
                    : attestation?.routes?.x402
                      ? "seller route ready"
                      : "pending"
                }
                active={runBusy}
                done={Boolean(runResult?.x402.settlementTx)}
              />
              <StepCell
                n="02"
                label="Subly vault edge"
                value={
                  runResult?.subly402.depositTx
                    ? "vault deposit tx"
                    : attestation?.routes?.subly402
                      ? "seller route ready"
                      : "pending"
                }
                active={runBusy}
                done={Boolean(runResult?.subly402.depositTx)}
              />
              <StepCell
                n="03"
                label="Seller payout"
                value={
                  runResult?.subly402.settlementStatus?.status ||
                  sublySettlementId ||
                  "pending"
                }
                active={runBusy}
                done={Boolean(sublySettlementId)}
              />
            </div>

            <div className="border-b border-paper/15 bg-glow/10 p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-glow">
                Demo batch window
              </div>
              <p className="mt-2 max-w-3xl text-[12px] leading-[1.6] text-paper/70">
                This hosted proof targets an approximately 1 minute Subly402
                batch so the Vault -&gt; Seller movement is visible during the
                demo. Public deployments should use longer anonymity windows;
                low-volume 1 minute batches can make participant correlation
                easier.
              </p>
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
                <DataRow
                  label="Faucet"
                  value={attestation?.faucetAmount || "100.000000 USDC"}
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
                    {!settlementReady && (
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
                USDC ATA if needed and sends{" "}
                {attestation?.faucetAmount || "100.000000 USDC"}.
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

        <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-2">
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

function PrivacyStoryboard({
  activeStep,
  onStepChange,
  onNextStep,
  onRunLive,
  runBusy,
  runResult,
}: {
  activeStep: number;
  onStepChange: (step: number) => void;
  onNextStep: () => void;
  onRunLive: () => void;
  runBusy: boolean;
  runResult: RunResult | null;
}) {
  const step = privacyDemoSteps[activeStep] || privacyDemoSteps[0];
  const isLastStep = activeStep === privacyDemoSteps.length - 1;

  return (
    <div className="mb-10 border border-paper/20 bg-paper text-ink shadow-[6px_6px_0_0_var(--glow)]">
      <div className="grid border-b border-ink/10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="border-b border-ink/10 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            <ShieldCheck className="h-4 w-4 text-ok" />
            Press to reveal the settlement graph
          </div>
          <h3 className="mt-4 font-display text-[34px] font-semibold leading-[0.98] text-ink md:text-[46px]">
            {step.title}
          </h3>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.7] text-ink-muted">
            {step.body}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-subly hover:bg-subly"
            >
              {isLastStep ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isLastStep ? "Replay flow" : "Next step"}
            </button>
            <button
              type="button"
              onClick={onRunLive}
              disabled={runBusy}
              className="inline-flex h-11 items-center justify-center gap-2 border border-ink/25 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-subly hover:text-subly disabled:cursor-not-allowed disabled:opacity-60"
            >
              {runBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run live proof
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4">
          {privacyDemoSteps.map((item, index) => {
            const selected = index === activeStep;
            const completed = index < activeStep;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onStepChange(index)}
                className={`min-h-[104px] border-b border-ink/10 p-4 text-left transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${phaseButtonClass(
                  index,
                  selected,
                  completed
                )}`}
              >
                <div
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                    selected ? "text-glow" : "text-ink-muted"
                  }`}
                >
                  {item.n}
                </div>
                <div className="mt-3 font-display text-[24px] font-semibold leading-none">
                  {item.label}
                </div>
                <div
                  className={`mt-2 font-mono text-[9px] uppercase tracking-[0.12em] ${
                    selected ? "text-paper/75" : "text-ink-muted"
                  }`}
                >
                  {item.phase}
                </div>
                <div
                  className={`mt-2 font-mono text-[9px] uppercase tracking-[0.12em] ${
                    selected ? "text-paper/60" : "text-ink-muted"
                  }`}
                >
                  {completed ? "revealed" : selected ? "active" : "tap"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-px bg-ink/10 lg:grid-cols-2">
        <FlowLane
          variant="x402"
          activeStep={activeStep}
          runResult={runResult}
        />
        <FlowLane
          variant="subly402"
          activeStep={activeStep}
          runResult={runResult}
        />
      </div>

      <div className="grid border-t border-ink/10 lg:grid-cols-[1fr_320px]">
        <div className="p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            <Eye className="h-4 w-4" />
            Public observer learns
          </div>
          <p className="mt-3 max-w-4xl font-serif-it text-[23px] leading-[1.25] text-ink md:text-[28px]">
            {step.observer}
          </p>
        </div>
        <div className="border-t border-ink/10 p-5 lg:border-l lg:border-t-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Verdict
          </div>
          <div className="mt-3 grid gap-2">
            <VerdictRow
              icon={Eye}
              label="x402"
              value="Buyer -> Seller is visible"
              tone="risk"
            />
            <VerdictRow
              icon={EyeOff}
              label="Subly402"
              value="Direct buyer-seller edge is not visible"
              tone="private"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowLane({
  variant,
  activeStep,
  runResult,
}: {
  variant: "x402" | "subly402";
  activeStep: number;
  runResult: RunResult | null;
}) {
  const isSubly = variant === "subly402";
  const pathStep = flowStepForPath(variant, activeStep, runResult);
  const step = privacyDemoSteps[pathStep] || privacyDemoSteps[0];
  const paymentActive = pathStep >= 1;
  const publicTrailActive = pathStep >= 2;
  const payoutActive = pathStep >= 3;
  const phaseTrace = isSubly ? sublyPhaseTrace : x402PhaseTrace;

  const visibleValue = isSubly
    ? runResult?.subly402.depositTx
      ? "Vault deposit tx recorded"
      : publicTrailActive
        ? "Buyer ATA -> Subly vault"
        : "Waiting for vault deposit"
    : runResult?.x402.settlementTx
      ? "Direct tx settled"
      : publicTrailActive
        ? "Buyer ATA -> Seller ATA"
        : "Waiting for direct payment";

  const payoutValue = runResult?.subly402.settlementStatus?.txSignature
    ? "Payout tx confirmed"
    : runResult?.subly402.settlementStatus?.status === "SettledOffchain"
      ? "Batch pending"
    : payoutActive
      ? "Vault -> Seller batch"
      : "Not paid out yet";

  return (
    <div className="bg-paper p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              isSubly ? "text-ok" : "text-alert"
            }`}
          >
            {isSubly ? "Subly402 privacy-preserving path" : "Official x402 path"}
          </div>
          <h4 className="mt-2 font-display text-[32px] font-semibold leading-none text-ink">
            {isSubly ? "Vault-mediated" : "Direct settlement"}
          </h4>
        </div>
        <div
          className={`inline-flex w-fit items-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
            isSubly
              ? "border-ok bg-ok/10 text-ink"
              : "border-alert bg-alert/10 text-alert"
          }`}
        >
          {isSubly ? (
            <LockKeyhole className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {isSubly ? "Link reduced" : "Link exposed"}
        </div>
      </div>

      {isSubly ? (
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)_58px_minmax(0,1fr)] md:items-stretch">
          <ActorNode icon={Wallet} label="Buyer wallet" detail="Buyer" />
          <FlowConnector
            active={paymentActive}
            label="deposit"
            tone="private"
          />
          <ActorNode icon={Landmark} label="Attested vault" detail="Vault" />
          <FlowConnector
            active={payoutActive}
            label="batch"
            tone="private"
          />
          <ActorNode icon={Store} label="Seller wallet" detail="Seller" />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] md:items-stretch">
          <ActorNode icon={Wallet} label="Buyer wallet" detail="Buyer" />
          <FlowConnector active={paymentActive} label="direct" tone="risk" />
          <ActorNode icon={Store} label="Seller wallet" detail="Seller" />
        </div>
      )}

      <PathPhaseTrace
        variant={variant}
        activeStep={pathStep}
        items={phaseTrace}
      />

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <EvidenceTile
          icon={isSubly ? ShieldCheck : CircleDollarSign}
          label="What happens"
          value={isSubly ? step.subly402 : step.x402}
          tone={isSubly ? "private" : "risk"}
        />
        <EvidenceTile
          icon={isSubly ? Layers : Server}
          label="Public chain view"
          value={visibleValue}
          tone={isSubly ? "private" : "risk"}
        />
        {isSubly ? (
          <>
            <EvidenceTile
              icon={EyeOff}
              label="Not directly visible"
              value={
                publicTrailActive
                  ? "Buyer ATA -> Seller ATA"
                  : "Direct seller link has not appeared"
              }
              tone="private"
            />
            <EvidenceTile
              icon={Layers}
              label="Seller payout"
              value={payoutValue}
              tone="neutral"
            />
          </>
        ) : (
          <>
            <EvidenceTile
              icon={Eye}
              label="Observer can infer"
              value={
                publicTrailActive
                  ? "Buyer, seller, amount, and timing"
                  : "Nothing until settlement"
              }
              tone="risk"
            />
            <EvidenceTile
              icon={Server}
              label="API privacy"
              value={
                publicTrailActive
                  ? "The paid provider is linkable"
                  : "Payment not broadcast yet"
              }
              tone="neutral"
            />
          </>
        )}
      </div>
    </div>
  );
}

function PathPhaseTrace({
  variant,
  activeStep,
  items,
}: {
  variant: "x402" | "subly402";
  activeStep: number;
  items: readonly PhaseTraceItem[];
}) {
  const isSubly = variant === "subly402";
  return (
    <div className="mt-5 border border-ink/10 bg-white">
      <div className="flex flex-col gap-2 border-b border-ink/10 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          {isSubly ? "Subly402 movement" : "x402 movement"}
        </div>
        <div
          className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
            isSubly ? "text-ok" : "text-alert"
          }`}
        >
          {isSubly ? "split now, settle later" : "single visible edge"}
        </div>
      </div>
      <div className="grid sm:grid-cols-4">
        {items.map((item, index) => {
          const active = index === activeStep;
          const complete = index < activeStep;
          return (
            <div
              key={`${variant}-${item.n}`}
              className={`min-h-[116px] border-b border-ink/10 p-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${phaseTraceClass(
                item.tone,
                active,
                complete
              )}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                  {item.n}
                </span>
                <PhaseTraceIcon tone={item.tone} active={active} complete={complete} />
              </div>
              <div className="mt-3 font-display text-[21px] font-semibold leading-none">
                {item.label}
              </div>
              <div className="mt-3 min-h-[34px] text-[12px] leading-[1.4]">
                {item.edge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function phaseTraceClass(tone: PhaseTone, active: boolean, complete: boolean) {
  if (!active && !complete) {
    return "bg-paper text-ink-muted";
  }
  if (tone === "risk") {
    return active
      ? "bg-alert text-paper"
      : "bg-alert/10 text-ink";
  }
  if (tone === "private") {
    return active
      ? "bg-ok text-paper"
      : "bg-ok/10 text-ink";
  }
  if (tone === "hidden") {
    return active
      ? "bg-ink text-paper"
      : "bg-ink/10 text-ink";
  }
  if (tone === "resolve") {
    return active
      ? "bg-glow text-ink"
      : "bg-glow/20 text-ink";
  }
  return active ? "bg-ink text-paper" : "bg-paper-deep text-ink";
}

function PhaseTraceIcon({
  tone,
  active,
  complete,
}: {
  tone: PhaseTone;
  active: boolean;
  complete: boolean;
}) {
  const className = `h-4 w-4 ${active ? "motion-safe:animate-pulse" : ""}`;
  if (tone === "hidden") {
    return <Pause className={className} />;
  }
  if (tone === "private") {
    return <LockKeyhole className={className} />;
  }
  if (tone === "resolve") {
    return <Layers className={className} />;
  }
  if (tone === "risk") {
    return <Eye className={className} />;
  }
  if (complete) {
    return <CheckCircle2 className={className} />;
  }
  return <ArrowRight className={className} />;
}

function ActorNode({
  icon: Icon,
  label,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
}) {
  return (
    <div className="min-h-[108px] min-w-0 border border-ink/15 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/20 bg-paper-deep text-ink">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            {label}
          </div>
          <div className="mt-2 truncate font-display text-[22px] font-semibold leading-none text-ink">
            {detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowConnector({
  active,
  label,
  tone,
}: {
  active: boolean;
  label: string;
  tone: "risk" | "private";
}) {
  const activeClass =
    tone === "risk"
      ? "border-alert bg-alert/10 text-alert"
      : "border-ok bg-ok/10 text-ink";

  return (
    <div
      className={`flex min-h-[54px] items-center justify-center gap-2 border px-2 text-center transition-colors md:min-h-[108px] md:flex-col ${
        active ? activeClass : "border-ink/15 bg-paper-deep text-ink-muted"
      }`}
    >
      <ArrowRight
        className={`h-4 w-4 rotate-90 md:rotate-0 ${
          active ? "" : "opacity-45"
        }`}
      />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
        {label}
      </span>
    </div>
  );
}

function EvidenceTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "risk" | "private" | "neutral";
}) {
  const toneClass =
    tone === "risk"
      ? "text-alert"
      : tone === "private"
        ? "text-ok"
        : "text-ink-muted";

  return (
    <div className="min-h-[116px] border border-ink/10 bg-white p-4">
      <div
        className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] ${toneClass}`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">{value}</p>
    </div>
  );
}

function VerdictRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "risk" | "private";
}) {
  return (
    <div className="grid grid-cols-[78px_1fr] items-center gap-3 border border-ink/10 bg-white p-3">
      <span
        className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
          tone === "risk" ? "text-alert" : "text-ok"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-[12px] leading-[1.4] text-ink-soft">{value}</span>
    </div>
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
  return (
    <div className="grid grid-cols-[92px_1fr] items-start gap-3 border-b border-paper/10 py-2.5 font-mono text-[11px] last:border-b-0">
      <span className="uppercase tracking-[0.16em] text-paper/45">{label}</span>
      <a
        href={txUrl(signature)}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${label} in Solana Explorer`}
        className="group flex min-w-0 items-start justify-end gap-2 text-right text-paper transition-colors hover:text-glow"
      >
        <span className="min-w-0 break-all text-[10px] leading-[1.45]">
          {signature}
        </span>
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-paper/35 transition-colors group-hover:text-glow" />
      </a>
    </div>
  );
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
  const payoutTx = flow.settlementStatus?.txSignature || delayed?.tx || null;
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
        {delayed && <TxRow label="Payout tx" signature={payoutTx} />}
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
    <div className="min-w-0 border border-paper/20 bg-paper/5">
      <div className="flex items-center justify-between gap-4 border-b border-paper/15 p-4">
        <div className="min-w-0">
          <div className="font-display text-[24px] font-semibold text-paper">
            {title}
          </div>
          <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
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
      <pre className="max-h-[430px] max-w-full overflow-auto p-4 text-[12px] leading-[1.65] text-paper/75">
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
