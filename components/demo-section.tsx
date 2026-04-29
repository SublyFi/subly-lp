"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const sellerCodeX402 = `app.use(x402PaymentMiddleware({
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
}, officialX402ResourceServer));`;

const sellerCodeSubly = `const sublyResourceServer = new Subly402ResourceServer(facilitator)
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

const buyerCodeX402 = `const x402Client = new X402Client()
  .register(
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
    new X402ExactSvmScheme(buyer, { rpcUrl })
  );
const x402Fetch = wrapX402FetchWithPayment(fetch, x402Client);
await x402Fetch("http://seller.demo.sublyfi.com/x402/weather");`;

const buyerCodeSubly = `const client = new Subly402Client({
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
      "No transfer has settled yet. The observer is waiting to see which on-chain trail appears.",
  },
  {
    n: "02",
    label: "Payment",
    phase: "Commit",
    title: "The buyer signs payment.",
    body: "Official x402 pays the seller directly. Subly-x402 keeps the same x402-style HTTP retry flow. After verifying enclave attestation, the buyer deposits into the shared user Vault used by Subly buyers.",
    x402: "Buyer signs a direct USDC transfer to the seller.",
    subly402:
      "Buyer signs a vault deposit and a paid request bound to the attested policy.",
    observer:
      "Official x402 puts a direct payment from the buyer to the seller on-chain. Subly-x402 puts a deposit from the buyer into the Vault instead.",
  },
  {
    n: "03",
    label: "On-chain trail",
    phase: "Reveal",
    title: "The on-chain trail is different.",
    body: "This is the core point: official x402 exposes who paid which seller. Subly-x402 only shows that the buyer funded the shared Vault. It does not reveal which seller the buyer actually called.",
    x402: "The explorer shows the buyer paying the seller directly.",
    subly402:
      "The explorer only shows the buyer depositing into the Vault. The buyer's request never produces a direct transfer to the seller.",
    observer:
      "A block explorer can link buyer and seller in x402. With Subly-x402, that direct link is not visible.",
  },
  {
    n: "04",
    label: "Payout",
    phase: "Resolve",
    title: "Seller gets paid.",
    body: "Subly-x402 does not hide the payout from the seller. They get paid in full. What changes is the on-chain shape: the Vault pays sellers in batches, so the payout cannot be tied back to any single buyer's call.",
    x402: "The request is already linkable to this seller.",
    subly402:
      "The seller receives a batched payout from the Vault, separate from the buyer's deposit.",
    observer:
      "The seller payout is visible, but it no longer shares an on-chain trail with the buyer's API call.",
  },
] as const;

type FlowTone = "neutral" | "risk" | "private" | "resolve";
type FlowState = "idle" | "active" | "pending" | "complete";

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
  const settlementPollInFlightRef = useRef(false);
  const latestSettlementIdRef = useRef("");

  const sublySettlementId = useMemo(() => {
    const value = runResult?.subly402.paymentResponse?.settlementId;
    return typeof value === "string" ? value : "";
  }, [runResult]);

  const settlementReady = Boolean(
    runResult?.subly402.settlementStatus?.status === "BatchedOnchain" &&
      runResult?.subly402.settlementStatus?.txSignature
  );
  const demoBusy =
    runBusy || (Boolean(sublySettlementId) && !settlementReady);

  useEffect(() => {
    void refreshAttestation();
  }, []);

  useEffect(() => {
    latestSettlementIdRef.current = sublySettlementId;
  }, [sublySettlementId]);

  const refreshSettlementStatus = useCallback(
    async ({ manual = true }: { manual?: boolean } = {}) => {
      const providerId = runResult?.subly402.providerId;
      if (
        !sublySettlementId ||
        !providerId ||
        settlementPollInFlightRef.current
      ) {
        return;
      }

      if (manual) {
        setError(null);
        setStatusBusy(true);
      }
      settlementPollInFlightRef.current = true;

      try {
        const status = await postJson<SettlementStatus>(
          "/api/demo/settlement-status",
          {
            settlementId: sublySettlementId,
            providerId,
          }
        );

        if (latestSettlementIdRef.current !== sublySettlementId) {
          return;
        }

        setRunResult((current) => {
          const currentSettlementId =
            typeof current?.subly402.paymentResponse?.settlementId === "string"
              ? current.subly402.paymentResponse.settlementId
              : "";
          if (!current || currentSettlementId !== sublySettlementId) {
            return current;
          }

          return {
            ...current,
            subly402: {
              ...current.subly402,
              settlementStatus: status,
              chainView: {
                ...current.subly402.chainView,
                delayed: current.subly402.chainView.delayed?.map(
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
          };
        });

        if (status.txSignature) {
          setActiveStep(3);
        }
      } catch (err) {
        if (manual) {
          setError(err as ApiError);
        }
      } finally {
        settlementPollInFlightRef.current = false;
        if (manual) {
          setStatusBusy(false);
        }
      }
    },
    [runResult?.subly402.providerId, sublySettlementId]
  );

  useEffect(() => {
    if (
      !sublySettlementId ||
      !runResult?.subly402.providerId ||
      settlementReady
    ) {
      return;
    }

    const initialPollId = window.setTimeout(() => {
      void refreshSettlementStatus({ manual: false });
    }, 5000);
    const pollId = window.setInterval(() => {
      void refreshSettlementStatus({ manual: false });
    }, 10000);

    return () => {
      window.clearTimeout(initialPollId);
      window.clearInterval(pollId);
    };
  }, [
    refreshSettlementStatus,
    runResult?.subly402.providerId,
    settlementReady,
    sublySettlementId,
  ]);

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

  return (
    <section
      id="demo"
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
            Live demo · Solana devnet
          </span>
          <span className="hidden h-px flex-1 bg-paper/20 md:block" />
        </div>
        <div className="mb-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display font-black leading-[0.86] tracking-tight text-paper">
              <span className="block text-[14vw] md:text-[120px] lg:text-[160px]">
                Live Demo.
              </span>
              <span className="mt-4 block font-feature text-[28px] font-normal leading-[1.15] text-paper/85 md:text-[40px] lg:text-[52px]">
                Same API call.{" "}
                <span className="text-subly-glow">Different</span> on-chain
                trail.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-feature text-[24px] leading-[1.3] text-paper md:text-[28px]">
              Press through the flow. With official x402, each call settles as
              a direct USDC transfer from the buyer&apos;s wallet to the
              seller, so anyone reading the chain can see exactly which buyer
              paid which seller. Subly-x402 keeps the same HTTP flow, but{" "}
              <span className="text-subly-glow">
                hides the link between buyer and seller on-chain
              </span>{" "}
              by routing settlement through the Private Shared Vault.
            </p>
            <p className="mt-6 max-w-xl text-[14px] leading-[1.7] text-paper/70">
              The live proof below calls the same Seller twice: once through
              official x402, once through Subly-x402. The API response is
              identical. What changes is the visible on-chain trail and
              whether any observer can tell who paid whom.
            </p>
          </div>
        </div>

        <PrivacyStoryboard
          activeStep={activeStep}
          onStepChange={setActiveStep}
          onNextStep={advancePrivacyStep}
          onRunLive={runLivePayment}
          runBusy={demoBusy}
          runResult={runResult}
        />

        <div className="mt-6">
          <div className="border border-paper/20 bg-paper/5 shadow-[6px_6px_0_0_var(--glow)]">
            <div className="flex flex-col gap-4 border-b border-paper/15 p-5 md:flex-row md:items-start md:justify-between">
              <div className="md:flex-1">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-glow">
                  <Terminal className="h-4 w-4" />
                  Live on-chain proof · Solana devnet
                </div>
                <p className="mt-3 max-w-2xl text-[13px] leading-[1.6] text-paper/75">
                  Press <span className="text-glow">Run live demo</span> to
                  fill the flow above with real Solana devnet transactions.
                  Below you can verify the Vault, Signer, and Policy this
                  demo is using, plus the confirmed tx hashes once the run
                  completes.
                </p>
              </div>
              <button
                type="button"
                onClick={runLivePayment}
                disabled={demoBusy}
                className="inline-flex h-11 items-center justify-center gap-2 border border-glow bg-glow px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {demoBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run live demo
              </button>
            </div>

            <div className="border-b border-paper/15 bg-glow/10 p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-glow">
                Demo batch window
              </div>
              <p className="mt-2 max-w-3xl text-[12px] leading-[1.6] text-paper/70">
                This hosted proof targets an approximately 1 minute Subly-x402
                batch so the Vault payout to the seller is visible during the
                demo. Public deployments should use longer anonymity windows.
                Low-volume 1 minute batches can make participant correlation
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
                      subtitle="direct settlement transfer"
                      flow={runResult.x402}
                      onCopy={copy}
                    />
                    <FlowPanel
                      title="Subly-x402"
                      subtitle="vault deposit, batched payout"
                      flow={runResult.subly402}
                      onCopy={copy}
                    />
                    {!settlementReady && sublySettlementId && (
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() =>
                            void refreshSettlementStatus({ manual: true })
                          }
                          disabled={statusBusy}
                          className="inline-flex h-10 items-center gap-2 border border-paper/25 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow disabled:opacity-60"
                        >
                          {statusBusy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Check seller payout
                        </button>
                        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-glow" />
                          Auto-checking every 10s
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-[260px] flex-col justify-between border border-dashed border-paper/20 p-5">
                    <div>
                      <ShieldCheck className="h-8 w-8 text-glow" />
                      <p className="mt-5 max-w-sm font-feature text-[22px] leading-[1.3] text-paper">
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
        </div>

        {/* Test USDC faucet: its own row below the Live proof */}
        <div className="mt-6 border border-paper/20 bg-paper/5 p-5 md:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-glow">
                <Droplets className="h-4 w-4" />
                Test USDC faucet
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-[1.7] text-paper/70">
                Paste a Solana devnet wallet address. The server creates the
                associated USDC token account if needed and sends{" "}
                {attestation?.faucetAmount || "100.000000 USDC"}.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="Devnet wallet address"
              className="h-14 min-w-0 flex-1 border border-paper/25 bg-ink px-4 font-mono text-[14px] text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-glow sm:h-12 sm:text-[13px]"
            />
            <button
              type="button"
              onClick={requestTestUsdc}
              disabled={faucetBusy || recipient.length < 32}
              className="inline-flex h-14 items-center justify-center gap-2 border border-paper/25 px-5 font-mono text-[12px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]"
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

        {/* For developers: install + Seller/Buyer code comparison */}
        <div className="mt-20 border-t border-paper/15 pt-16">
          <div className="mb-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-glow">
                ▌ For developers
              </div>
              <h3 className="mt-3 font-display text-[40px] font-semibold leading-[0.95] tracking-tight text-paper md:text-[64px]">
                Two npm packages.
              </h3>
            </div>
            <div className="md:col-span-5">
              <p className="font-feature text-[20px] leading-[1.4] text-paper md:text-[22px]">
                Subly-x402 ships as two open-source packages — a Buyer SDK
                and Express middleware for Sellers. Drop them into any
                TypeScript project. There is no API key, no gatekeeper.
              </p>
            </div>
          </div>

          {/* Install block */}
          <div className="border border-paper/20 bg-paper/5 p-5 md:p-7">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-glow">
                  <Terminal className="h-4 w-4" />
                  Install
                </div>
                <h4 className="mt-3 font-display text-[24px] font-semibold leading-[1.1] text-paper md:text-[28px]">
                  One{" "}
                  <code className="font-mono text-[18px] text-glow md:text-[22px]">
                    npm install
                  </code>{" "}
                  and you're an x402 buyer or seller.
                </h4>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <a
                  href="https://www.npmjs.com/package/subly402-sdk"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border border-paper/25 bg-paper/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow"
                >
                  <span className="text-glow">npm</span> subly402-sdk
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://www.npmjs.com/package/subly402-express"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border border-paper/25 bg-paper/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow"
                >
                  <span className="text-glow">npm</span> subly402-express
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* Terminal */}
            <div className="mt-6 overflow-hidden border border-paper/15 bg-black">
              <div className="flex items-center justify-between border-b border-paper/10 px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-alert/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-glow/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
                  <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                    zsh: install
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copy(
                      "npm install subly402-sdk subly402-express",
                      "install-cmd",
                    )
                  }
                  className="inline-flex h-7 items-center gap-1.5 border border-paper/20 px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-glow hover:text-glow"
                >
                  {copied === "install-cmd" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clipboard className="h-3.5 w-3.5" />
                  )}
                  {copied === "install-cmd" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-auto p-5 font-mono text-[14px] leading-[1.7] text-paper">
                <code>
                  <span className="text-glow">$</span>{" "}
                  <span className="text-paper">npm install</span>{" "}
                  <span className="text-paper/85">subly402-sdk</span>{" "}
                  <span className="text-paper/85">subly402-express</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Seller and Buyer code comparison: each panel takes full width */}
          <div className="mt-10 space-y-10">
            <ComparePanel
              title="Seller"
              subtitle="One middleware route per path · receiving wallet only"
              blocks={[
                {
                  key: "seller-x402",
                  label: "Official x402",
                  tone: "risk",
                  code: sellerCodeX402,
                },
                {
                  key: "seller-subly",
                  label: "Subly-x402",
                  tone: "private",
                  code: sellerCodeSubly,
                },
              ]}
              copied={copied}
              onCopy={copy}
            />
            <ComparePanel
              title="Buyer"
              subtitle="@solana/kit signer · autoDeposit hook for Subly-x402"
              blocks={[
                {
                  key: "buyer-x402",
                  label: "Official x402",
                  tone: "risk",
                  code: buyerCodeX402,
                },
                {
                  key: "buyer-subly",
                  label: "Subly-x402",
                  tone: "private",
                  code: buyerCodeSubly,
                },
              ]}
              copied={copied}
              onCopy={copy}
            />
          </div>
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
            Press to reveal the on-chain trail
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
              onClick={onRunLive}
              disabled={runBusy}
              className="inline-flex h-11 items-center justify-center gap-2 border border-subly bg-subly px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-subly-deep hover:border-subly-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {runBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run live demo
            </button>
            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex h-11 items-center justify-center gap-2 border border-ink/25 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted transition-colors hover:border-ink hover:text-ink"
            >
              {isLastStep ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isLastStep
                ? "Replay walkthrough"
                : "Walk through the steps"}
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
  const x402Paid = Boolean(runResult?.x402.settlementTx);
  const sublyDeposited = Boolean(runResult?.subly402.depositTx);
  const sublyPayoutTx =
    runResult?.subly402.settlementStatus?.txSignature ||
    runResult?.subly402.chainView.delayed?.[0]?.tx ||
    null;
  const sublyPayoutConfirmed = Boolean(sublyPayoutTx);
  const sublyBatchPending =
    sublyDeposited &&
    !sublyPayoutConfirmed &&
    Boolean(runResult?.subly402.settlementStatus);

  const directState: FlowState =
    x402Paid || (!isSubly && payoutActive)
      ? "complete"
      : paymentActive
        ? "active"
        : "idle";
  const depositState: FlowState =
    sublyDeposited || (isSubly && publicTrailActive)
      ? "complete"
      : paymentActive
        ? "active"
        : "idle";
  const batchState: FlowState = sublyPayoutConfirmed
    ? "complete"
    : sublyBatchPending
      ? "pending"
      : payoutActive
        ? "active"
        : "idle";

  const visibleValue = isSubly
    ? runResult?.subly402.depositTx
      ? "The buyer's deposit into the Vault"
      : publicTrailActive
        ? "The buyer's deposit into the Vault"
        : "Waiting for vault deposit"
    : runResult?.x402.settlementTx
      ? "A direct transfer from the buyer to the seller"
      : publicTrailActive
        ? "A direct transfer from the buyer to the seller"
        : "Waiting for direct payment";

  const payoutValue = runResult?.subly402.settlementStatus?.txSignature
    ? "Payout tx confirmed"
    : runResult?.subly402.settlementStatus?.status === "SettledOffchain"
      ? "Batch pending"
    : payoutActive
      ? "The Vault paying the seller as a batch"
      : "Not paid out yet";

  return (
    <div className="flex h-full flex-col bg-paper p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              isSubly ? "text-ok" : "text-alert"
            }`}
          >
            {isSubly ? "Privacy-preserving x402 path" : "Official x402 path"}
          </div>
          <h4 className="mt-2 font-display text-[32px] font-semibold leading-none text-ink">
            {isSubly ? "Subly-x402" : "Official x402"}
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
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)_96px_minmax(0,1fr)] md:items-stretch">
          <ActorNode
            icon={Wallet}
            label="Buyer wallet"
            detail="Buyer"
            active={depositState !== "idle"}
            tone="private"
          />
          <FlowConnector
            state={depositState}
            label="Buyer -> Vault"
            tone="private"
            status={sublyDeposited ? "deposit complete" : "vault deposit"}
            txSignature={runResult?.subly402.depositTx}
          />
          <ActorNode
            icon={Landmark}
            label="Private Shared Vault"
            detail="Vault"
            active={depositState !== "idle" || batchState !== "idle"}
            tone="private"
          />
          <FlowConnector
            state={batchState}
            label="Vault -> Seller"
            tone="private"
            status={
              sublyPayoutConfirmed
                ? "batch payout"
                : sublyBatchPending
                  ? "batch pending"
                  : "seller payout"
            }
            txSignature={sublyPayoutTx}
          />
          <ActorNode
            icon={Store}
            label="Seller wallet"
            detail="Seller"
            active={batchState === "complete" || batchState === "active"}
            pending={batchState === "pending"}
            tone="private"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)] md:items-stretch">
          <ActorNode
            icon={Wallet}
            label="Buyer wallet"
            detail="Buyer"
            active={directState !== "idle"}
            tone="risk"
          />
          <FlowConnector
            state={directState}
            label="Buyer -> Seller"
            tone="risk"
            status={x402Paid ? "paid now" : "direct tx"}
            txSignature={runResult?.x402.settlementTx}
          />
          <ActorNode
            icon={Store}
            label="Seller wallet"
            detail="Seller"
            active={directState === "complete" || directState === "active"}
            tone="risk"
          />
        </div>
      )}

      <PathFlowSummary
        variant={variant}
        directState={directState}
        depositState={depositState}
        batchState={batchState}
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
          label="Visible on-chain tx"
          value={visibleValue}
          tone={isSubly ? "private" : "risk"}
        />
        {isSubly ? (
          <>
            <EvidenceTile
              icon={EyeOff}
              label="Hidden from observers"
              value={
                publicTrailActive
                  ? "The buyer's tx never sends funds straight to the seller"
                  : "Vault deposit not made yet"
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
              label="What an observer learns"
              value={
                publicTrailActive
                  ? "Buyer, seller, amount, and timing are all public"
                  : "Nothing until settlement"
              }
              tone="risk"
            />
            <EvidenceTile
              icon={Server}
              label="Buyer ↔ Seller link"
              value={
                publicTrailActive
                  ? "Visible to anyone reading the chain"
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

function PathFlowSummary({
  variant,
  directState,
  depositState,
  batchState,
}: {
  variant: "x402" | "subly402";
  directState: FlowState;
  depositState: FlowState;
  batchState: FlowState;
}) {
  const isSubly = variant === "subly402";
  const tone: FlowTone = isSubly
    ? batchState === "complete"
      ? "resolve"
      : "private"
    : "risk";
  const Icon = isSubly ? LockKeyhole : Eye;
  const state = isSubly
    ? batchState === "complete" || batchState === "pending"
      ? batchState
      : depositState
    : directState;

  const title = isSubly
    ? batchState === "complete"
      ? "Vault pays Seller after the batch"
      : depositState === "complete" || batchState === "pending"
        ? "Buyer funds Vault first"
        : "Buyer funds Vault, then Vault pays Seller"
    : "Buyer pays Seller directly";

  const body = isSubly
    ? batchState === "complete"
      ? "The only buyer-facing transfer goes into the Vault. Once the batch succeeds, the Vault pays the seller in a separate transfer."
      : depositState === "complete" || batchState === "pending"
        ? "The visible buyer transaction stops at the Vault. The seller payout stays pending until the batch settles."
        : "The first highlighted step is the buyer depositing into the Vault. The seller payout only lights up once the Subly-x402 batch settles."
    : directState === "complete"
      ? "The highlighted step is the buyer paying the seller directly. That direct transfer is what stays visible onchain."
      : "When the proof runs, the buyer pays the seller directly. That direct transfer is what becomes visible onchain.";

  return (
    <div className="mt-5 border border-ink/10 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div
            className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
              tone === "risk"
                ? "text-alert"
                : tone === "resolve"
                  ? "text-ink"
                  : "text-ok"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            Payment flow
          </div>
          <h5 className="mt-3 font-display text-[24px] font-semibold leading-none text-ink">
            {title}
          </h5>
          <p className="mt-3 max-w-2xl text-[13px] leading-[1.55] text-ink-soft">
            {body}
          </p>
        </div>
        <FlowStateBadge state={state} tone={tone} />
      </div>
    </div>
  );
}

function FlowStateBadge({
  state,
  tone,
}: {
  state: FlowState;
  tone: FlowTone;
}) {
  const label = state === "complete" ? "complete" : state;
  const toneClass =
    state === "idle"
      ? "border-ink/20 bg-paper-deep text-ink-muted"
      : tone === "risk"
        ? "border-alert bg-alert/10 text-alert"
        : tone === "resolve"
          ? "border-glow bg-glow/20 text-ink"
          : "border-ok bg-ok/10 text-ink";

  return (
    <span
      className={`inline-flex w-fit items-center border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] ${toneClass}`}
    >
      {label}
    </span>
  );
}

function ActorNode({
  icon: Icon,
  label,
  detail,
  active = false,
  pending = false,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
  active?: boolean;
  pending?: boolean;
  tone?: FlowTone;
}) {
  const toneClass =
    pending
      ? "border-glow bg-glow/10 text-ink"
      : active && tone === "risk"
        ? "border-alert bg-alert/10 text-alert"
        : active && tone === "private"
          ? "border-ok bg-ok/10 text-ink"
          : active && tone === "resolve"
            ? "border-glow bg-glow/20 text-ink"
            : "border-ink/15 bg-white text-ink";
  const iconClass =
    pending
      ? "border-glow bg-glow/20 text-ink"
      : active && tone === "risk"
        ? "border-alert bg-alert text-paper"
        : active && tone === "private"
          ? "border-ok bg-ok text-paper"
          : active && tone === "resolve"
            ? "border-glow bg-glow text-ink"
            : "border-ink/20 bg-paper-deep text-ink";

  return (
    <div
      className={`flex h-full min-h-[180px] min-w-0 flex-col border p-4 transition-colors md:h-[200px] ${toneClass}`}
    >
      <div className="flex h-full flex-col justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center border transition-colors ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase leading-[1.35] tracking-[0.18em] text-ink-muted">
            {label}
          </div>
          <div className="mt-2 break-words font-display text-[21px] font-semibold leading-none text-ink">
            {detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowConnector({
  state,
  label,
  tone,
  status,
  txSignature,
}: {
  state: FlowState;
  label: string;
  tone: FlowTone;
  status: string;
  txSignature?: string | null;
}) {
  const active = state !== "idle";
  const stateClass =
    state === "idle"
      ? "border-ink/15 bg-paper-deep text-ink-muted"
      : state === "pending"
        ? "border-glow bg-glow/15 text-ink"
        : tone === "risk"
          ? "border-alert bg-alert/10 text-alert"
          : tone === "resolve"
            ? "border-glow bg-glow/20 text-ink"
            : "border-ok bg-ok/10 text-ink";

  return (
    <div
      className={`flex h-full min-h-[80px] items-center justify-center gap-2 border px-2 text-center transition-colors md:h-[200px] md:flex-col ${stateClass}`}
    >
      <ArrowRight
        className={`h-5 w-5 rotate-90 md:rotate-0 ${
          active ? "" : "opacity-45"
        }`}
      />
      <div className="grid min-w-0 gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
          {label}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-70">
          {state === "complete" ? "complete" : status}
        </span>
        {txSignature && (
          <a
            href={txUrl(txSignature)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${label} transaction in Solana Explorer`}
            className="mt-1.5 inline-flex min-w-0 items-center justify-center gap-1 border-t border-current/20 pt-1.5 font-mono text-[10px] font-semibold leading-none transition-colors hover:underline"
          >
            <span className="min-w-0 truncate">{short(txSignature)}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )}
      </div>
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

type CompareBlock = {
  key: string;
  label: string;
  tone: "risk" | "private";
  code: string;
};

function ComparePanel({
  title,
  subtitle,
  blocks,
  copied,
  onCopy,
}: {
  title: string;
  subtitle: string;
  blocks: CompareBlock[];
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="min-w-0 border border-paper/20 bg-paper/5">
      <div className="border-b border-paper/15 p-4">
        <div className="font-display text-[24px] font-semibold text-paper">
          {title}
        </div>
        <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
          {subtitle}
        </div>
      </div>

      <div className="grid divide-y divide-paper/15 md:grid-cols-2 md:divide-x md:divide-y-0">
        {blocks.map((block) => (
          <div key={block.key} className="flex min-w-0 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 p-3">
              <span
                className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] ${
                  block.tone === "risk" ? "text-alert" : "text-ok"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    block.tone === "risk" ? "bg-alert" : "bg-ok"
                  }`}
                />
                {block.label}
              </span>
              <button
                type="button"
                onClick={() => onCopy(block.code, block.key)}
                className="inline-flex h-8 items-center gap-1.5 border border-paper/20 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-glow hover:text-glow"
              >
                {copied === block.key ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Clipboard className="h-3.5 w-3.5" />
                )}
                {copied === block.key ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="max-h-[430px] min-w-0 overflow-auto p-4 text-[12px] leading-[1.65] text-paper/75">
              <code>{block.code}</code>
            </pre>
          </div>
        ))}
      </div>

    </div>
  );
}
