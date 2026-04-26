import { createHash, randomUUID } from "node:crypto";

import { x402Client, x402HTTPClient } from "@x402/core/client";
import type { Network } from "@x402/core/types";
import { wrapFetchWithPayment as wrapX402FetchWithPayment } from "@x402/fetch";
import { ExactSvmScheme as X402BuyerExactSvmScheme } from "@x402/svm/exact/client";
import {
  AccountRole,
  address,
  appendTransactionMessageInstructions,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signBytes,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  fetchToken,
  fetchMint,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getMintToInstruction,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const DEFAULT_FACILITATOR_URL = "https://api.demo.sublyfi.com";
const DEFAULT_NETWORK = "solana:devnet";
const DEFAULT_X402_NETWORK = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
const DEFAULT_X402_FACILITATOR_URL = "https://x402.org/facilitator";
const DEFAULT_SELLER_BASE_URL = "http://seller.demo.sublyfi.com";
const DEFAULT_REMOTE_DEMO_BASE_URL = "https://www.sublyfi.com";
const DEFAULT_REQUEST_ORIGIN = "https://demo.sublyfi.com";
const DEMO_ROUTE_PATH = "/weather";
const X402_ROUTE_PATH = "/x402/weather";
const SUBLY402_ROUTE_PATH = "/subly/weather";
const DEMO_HTTP_METHOD = "GET";
const DEMO_MIME_TYPE = "application/json";
const USDC_DECIMALS = 6;
const CONFIRMATION_ATTEMPTS = 60;
const CONFIRMATION_DELAY_MS = 1000;
const BALANCE_SYNC_ATTEMPTS = 35;
const BALANCE_SYNC_DELAY_MS = 1000;
const SUBLY402_PAYMENT_RETRY_ATTEMPTS = 12;
const SUBLY402_PAYMENT_RETRY_DELAY_MS = 1000;

const DEPOSIT_DISCRIMINATOR = createHash("sha256")
  .update("global:deposit")
  .digest()
  .subarray(0, 8);

type EnvConfig = {
  enabled: boolean;
  rpcUrl: string;
  facilitatorUrl: string;
  network: string;
  x402Network: string;
  x402FacilitatorUrl: string;
  programId: string;
  vaultConfig: string;
  vaultTokenAccount: string;
  attestationPolicyHash: string;
  usdcMint: string;
  sellerTokenAccount: string;
  sellerBaseUrl: string;
  x402SellerUrl: string;
  subly402SellerUrl: string;
  requestOrigin: string;
  paymentAmountAtomic: bigint;
  depositAmountAtomic: bigint;
  faucetAmountAtomic: bigint;
  feePayerSecretJson?: string;
  demoBuyerSecretJson?: string;
  mintAuthoritySecretJson?: string;
  sourceTokenAccount?: string;
  sourceOwnerSecretJson?: string;
};

type Attestation = {
  vaultConfig: string;
  vaultSigner: string;
  attestationPolicyHash: string;
  snapshotSeqno?: number;
  issuedAt?: string;
  expiresAt?: string;
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

type PaymentRequiredResponse = {
  accepts?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

type SellerMetadata = {
  ok?: boolean;
  publicBaseUrl?: string;
  sellerWallet?: string;
  sellerTokenAccount?: string;
  routes?: {
    x402?: string;
    subly402?: string;
  };
  asset?: {
    mint?: string;
    symbol?: string;
    decimals?: number;
  };
  x402?: {
    network?: string;
    facilitatorUrl?: string;
  };
  subly402?: {
    network?: string;
    facilitatorUrl?: string;
    attestation?: Partial<Attestation> & {
      ok?: boolean;
      tlsPublicKeySha256?: string;
    };
  };
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var sublyDemoRateLimit: Map<string, RateLimitEntry> | undefined;
}

function getRateLimitStore() {
  if (!globalThis.sublyDemoRateLimit) {
    globalThis.sublyDemoRateLimit = new Map();
  }
  return globalThis.sublyDemoRateLimit;
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const store = getRateLimitStore();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) {
    throw new DemoError(
      "rate_limited",
      `Try again after ${new Date(current.resetAt).toISOString()}`,
      429
    );
  }
  current.count += 1;
}

export class DemoError extends Error {
  readonly code: string;
  readonly status: number;
  readonly missing?: string[];

  constructor(code: string, message: string, status = 400, missing?: string[]) {
    super(message);
    this.code = code;
    this.status = status;
    this.missing = missing;
  }
}

function env(name: string) {
  return process.env[name]?.trim();
}

function envBigInt(name: string, fallback: bigint) {
  const raw = env(name);
  if (!raw) {
    return fallback;
  }
  const value = BigInt(raw);
  if (value <= BigInt(0)) {
    throw new DemoError("invalid_env", `${name} must be positive`, 500);
  }
  return value;
}

function envBigIntAny(names: string[], fallback: bigint) {
  for (const name of names) {
    const raw = env(name);
    if (raw) {
      return envBigInt(name, fallback);
    }
  }
  return fallback;
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function remoteDemoBaseUrl() {
  if (env("SUBLY402_DEMO_DISABLE_REMOTE_PROXY") === "1") {
    return "";
  }
  if (process.env.VERCEL_ENV === "production") {
    return "";
  }
  if (process.env.NODE_ENV === "production" && process.env.VERCEL === "1") {
    return "";
  }
  return normalizeBaseUrl(
    env("SUBLY402_DEMO_PROXY_URL") || DEFAULT_REMOTE_DEMO_BASE_URL
  );
}

function missingConfig(config: EnvConfig) {
  try {
    requiredConfig(config);
    return [];
  } catch (error) {
    if (error instanceof DemoError) {
      return error.missing || [];
    }
    throw error;
  }
}

async function proxyDemoJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = remoteDemoBaseUrl();
  if (!baseUrl) {
    throw new DemoError(
      "demo_not_configured",
      "Live devnet demo is not configured on this local deployment.",
      503
    );
  }
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const parsed = body as {
      error?: string;
      message?: string;
      missing?: string[];
    };
    throw new DemoError(
      parsed?.error || "remote_demo_error",
      parsed?.message ||
        `Remote demo ${path} failed with ${response.status}: ${text}`,
      response.status,
      parsed?.missing
    );
  }
  return body as T;
}

function readConfig(): EnvConfig {
  const sellerBaseUrl = normalizeBaseUrl(
    env("SUBLY402_DEMO_SELLER_BASE_URL") || DEFAULT_SELLER_BASE_URL
  );
  const defaultPaymentAmount = BigInt(1_100_000);
  return {
    enabled: env("SUBLY402_DEMO_ENABLED") === "1",
    rpcUrl:
      env("SUBLY402_DEMO_RPC_URL") || env("SUBLY402_SOLANA_RPC_URL") || "",
    facilitatorUrl:
      env("SUBLY402_DEMO_FACILITATOR_URL") ||
      env("SUBLY402_PUBLIC_ENCLAVE_URL") ||
      DEFAULT_FACILITATOR_URL,
    network: env("SUBLY402_NETWORK") || DEFAULT_NETWORK,
    x402Network: env("SUBLY402_X402_NETWORK") || DEFAULT_X402_NETWORK,
    x402FacilitatorUrl:
      env("SUBLY402_X402_FACILITATOR_URL") ||
      DEFAULT_X402_FACILITATOR_URL,
    programId: env("SUBLY402_PROGRAM_ID") || "",
    vaultConfig: env("SUBLY402_VAULT_CONFIG") || "",
    vaultTokenAccount: env("SUBLY402_VAULT_TOKEN_ACCOUNT") || "",
    attestationPolicyHash:
      env("SUBLY402_ATTESTATION_POLICY_HASH_HEX") || "",
    usdcMint: env("SUBLY402_USDC_MINT") || "",
    sellerTokenAccount: env("SUBLY402_DEMO_SELLER_TOKEN_ACCOUNT") || "",
    sellerBaseUrl,
    x402SellerUrl:
      env("SUBLY402_X402_SELLER_URL") ||
      `${sellerBaseUrl}${X402_ROUTE_PATH}`,
    subly402SellerUrl:
      env("SUBLY402_SUBLY_SELLER_URL") ||
      `${sellerBaseUrl}${SUBLY402_ROUTE_PATH}`,
    requestOrigin:
      env("SUBLY402_DEMO_REQUEST_ORIGIN") || DEFAULT_REQUEST_ORIGIN,
    paymentAmountAtomic: envBigIntAny(
      [
        "SUBLY402_DEMO_PAYMENT_AMOUNT_ATOMIC",
        "SUBLY402_DEMO_PAYMENT_AMOUNT",
        "SUBLY402_NITRO_E2E_PAYMENT_AMOUNT",
      ],
      defaultPaymentAmount
    ),
    depositAmountAtomic: envBigIntAny(
      [
        "SUBLY402_DEMO_DEPOSIT_AMOUNT_ATOMIC",
        "SUBLY402_DEMO_DEPOSIT_AMOUNT",
        "SUBLY402_NITRO_E2E_DEPOSIT_AMOUNT",
      ],
      defaultPaymentAmount
    ),
    faucetAmountAtomic: envBigIntAny(
      ["SUBLY402_DEMO_FAUCET_AMOUNT_ATOMIC", "SUBLY402_DEMO_FAUCET_AMOUNT"],
      BigInt(100_000_000)
    ),
    feePayerSecretJson:
      env("SUBLY402_DEMO_FEE_PAYER_SECRET_JSON") ||
      env("SUBLY402_DEMO_FAUCET_SECRET_JSON"),
    demoBuyerSecretJson: env("SUBLY402_DEMO_BUYER_SECRET_JSON"),
    mintAuthoritySecretJson: env("SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON"),
    sourceTokenAccount: env("SUBLY402_DEMO_SOURCE_TOKEN_ACCOUNT"),
    sourceOwnerSecretJson: env("SUBLY402_DEMO_SOURCE_OWNER_SECRET_JSON"),
  };
}

function requiredConfig(
  config: EnvConfig,
  options: {
    requireSeller?: boolean;
    requireBuyer?: boolean;
    requireAttestationPolicy?: boolean;
  } = {}
) {
  const {
    requireSeller = true,
    requireBuyer = true,
    requireAttestationPolicy = true,
  } = options;
  const missing: string[] = [];
  if (!config.enabled) {
    missing.push("SUBLY402_DEMO_ENABLED=1");
  }
  if (!config.rpcUrl) {
    missing.push("SUBLY402_DEMO_RPC_URL or SUBLY402_SOLANA_RPC_URL");
  }
  if (!config.programId) {
    missing.push("SUBLY402_PROGRAM_ID");
  }
  if (!config.vaultConfig) {
    missing.push("SUBLY402_VAULT_CONFIG");
  }
  if (!config.vaultTokenAccount) {
    missing.push("SUBLY402_VAULT_TOKEN_ACCOUNT");
  }
  if (requireAttestationPolicy && !config.attestationPolicyHash) {
    missing.push("SUBLY402_ATTESTATION_POLICY_HASH_HEX");
  }
  if (!config.usdcMint) {
    missing.push("SUBLY402_USDC_MINT");
  }
  if (requireSeller && !config.sellerTokenAccount) {
    missing.push("SUBLY402_DEMO_SELLER_TOKEN_ACCOUNT");
  }
  if (!config.feePayerSecretJson) {
    missing.push("SUBLY402_DEMO_FEE_PAYER_SECRET_JSON");
  }
  if (requireBuyer && !config.demoBuyerSecretJson) {
    missing.push("SUBLY402_DEMO_BUYER_SECRET_JSON");
  }
  if (!config.mintAuthoritySecretJson && !config.sourceTokenAccount) {
    missing.push(
      "SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON or SUBLY402_DEMO_SOURCE_TOKEN_ACCOUNT"
    );
  }
  if (config.depositAmountAtomic < config.paymentAmountAtomic) {
    missing.push("SUBLY402_DEMO_DEPOSIT_AMOUNT_ATOMIC >= payment amount");
  }
  if (missing.length > 0) {
    throw new DemoError(
      "demo_not_configured",
      "Live devnet demo is not configured on this deployment.",
      503,
      missing
    );
  }
}

export function getDemoPublicConfig() {
  const config = readConfig();
  const missing: string[] = [];
  try {
    requiredConfig(config);
  } catch (error) {
    if (error instanceof DemoError) {
      missing.push(...(error.missing || []));
    }
  }
  return {
    configured: missing.length === 0,
    missing,
    facilitatorUrl: config.facilitatorUrl,
    network: config.network,
    x402Network: config.x402Network,
    usdcMint: config.usdcMint,
    vaultConfig: config.vaultConfig,
    vaultTokenAccount: config.vaultTokenAccount,
    attestationPolicyHash: config.attestationPolicyHash,
    sellerBaseUrl: config.sellerBaseUrl,
    routes: {
      x402: config.x402SellerUrl,
      subly402: config.subly402SellerUrl,
    },
    sellerTokenAccount: config.sellerTokenAccount,
    paymentAmount: formatUsdcAtomic(config.paymentAmountAtomic),
    faucetAmount: formatUsdcAtomic(config.faucetAmountAtomic),
    buyerMode: config.demoBuyerSecretJson ? "hosted" : "missing",
  };
}

function createRpc(config: EnvConfig) {
  return createSolanaRpc(config.rpcUrl);
}

function parseSecretJson(raw: string, label: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new DemoError("invalid_secret", `${label} must be a JSON array`, 500);
  }
  if (!Array.isArray(parsed) || parsed.length < 64) {
    throw new DemoError(
      "invalid_secret",
      `${label} must be a 64-byte keypair`,
      500
    );
  }
  return Uint8Array.from(parsed.map((value) => Number(value)));
}

async function signerFromSecret(raw: string, label: string) {
  return createKeyPairSignerFromBytes(parseSecretJson(raw, label), true);
}

function optionAddressValue(option: unknown): string | null {
  if (!option || typeof option !== "object") {
    return null;
  }
  const maybeOption = option as { __option?: string; value?: string };
  if (maybeOption.__option === "None") {
    return null;
  }
  if (maybeOption.__option === "Some") {
    return maybeOption.value || null;
  }
  return String(option);
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForSignature(
  rpc: ReturnType<typeof createSolanaRpc>,
  signature: string
) {
  for (let attempt = 0; attempt < CONFIRMATION_ATTEMPTS; attempt += 1) {
    const response = await rpc
      .getSignatureStatuses([signature as never])
      .send();
    const [status] = Array.isArray(response) ? response : response.value;
    if (status?.err) {
      throw new DemoError(
        "transaction_failed",
        `Transaction ${signature} failed: ${JSON.stringify(status.err)}`,
        502
      );
    }
    if (
      status?.confirmationStatus === "confirmed" ||
      status?.confirmationStatus === "finalized"
    ) {
      return;
    }
    await sleep(CONFIRMATION_DELAY_MS);
  }
  throw new DemoError(
    "transaction_timeout",
    `Timed out waiting for transaction ${signature}`,
    504
  );
}

async function sendInstructions(
  rpc: ReturnType<typeof createSolanaRpc>,
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>,
  instructions: unknown[]
) {
  const latestBlockhash = await rpc
    .getLatestBlockhash({ commitment: "confirmed" })
    .send();
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
    (tx) =>
      setTransactionMessageLifetimeUsingBlockhash(latestBlockhash.value, tx),
    (tx) => appendTransactionMessageInstructions(instructions as never, tx)
  );
  const signedTransaction = await signTransactionMessageWithSigners(
    transactionMessage
  );
  const signature =
    (await rpc
      .sendTransaction(getBase64EncodedWireTransaction(signedTransaction), {
        encoding: "base64",
        preflightCommitment: "confirmed",
      })
      .send()) || getSignatureFromTransaction(signedTransaction);
  await waitForSignature(rpc, signature);
  return signature;
}

async function createAssociatedTokenAccount(
  rpc: ReturnType<typeof createSolanaRpc>,
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>,
  owner: string,
  mint: string
) {
  const [ata] = await findAssociatedTokenPda({
    mint: address(mint),
    owner: address(owner),
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const instruction = await getCreateAssociatedTokenIdempotentInstructionAsync({
    payer: feePayer,
    owner: address(owner),
    mint: address(mint),
  });
  const signature = await sendInstructions(rpc, feePayer, [instruction]);
  return { tokenAccount: ata.toString(), signature };
}

async function deriveAssociatedTokenAccount(owner: string, mint: string) {
  const [ata] = await findAssociatedTokenPda({
    mint: address(mint),
    owner: address(owner),
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  return ata.toString();
}

async function fetchTokenAmountOrNull(
  rpc: ReturnType<typeof createSolanaRpc>,
  tokenAccount: string
) {
  try {
    const account = await fetchToken(rpc, address(tokenAccount));
    return account.data.amount;
  } catch {
    return null;
  }
}

async function demoBuyerFromConfig(config: EnvConfig) {
  if (!config.demoBuyerSecretJson) {
    throw new DemoError(
      "demo_not_configured",
      "Hosted comparison demo requires a server-side buyer wallet.",
      503,
      ["SUBLY402_DEMO_BUYER_SECRET_JSON"]
    );
  }
  return signerFromSecret(
    config.demoBuyerSecretJson,
    "SUBLY402_DEMO_BUYER_SECRET_JSON"
  );
}

function decodeJsonHeader<T>(value: string, headerName: string): T {
  const encodings: BufferEncoding[] = ["base64", "base64url"];
  let lastError: unknown;
  for (const encoding of encodings) {
    try {
      return JSON.parse(Buffer.from(value, encoding).toString("utf8")) as T;
    } catch (error) {
      lastError = error;
    }
  }
  const reason =
    lastError instanceof Error ? lastError.message : "invalid encoded JSON";
  throw new DemoError(
    "invalid_payment_header",
    `Invalid ${headerName} header: ${reason}`,
    502
  );
}

async function paymentRequiredFromResponse(
  response: Response
): Promise<PaymentRequiredResponse> {
  const raw =
    response.headers.get("PAYMENT-REQUIRED") ||
    response.headers.get("payment-required");
  const decoded = raw
    ? decodeJsonHeader<PaymentRequiredResponse>(raw, "PAYMENT-REQUIRED")
    : {};

  try {
    const body = (await response.clone().json()) as PaymentRequiredResponse;
    return { ...body, ...decoded };
  } catch {
    return decoded;
  }
}

function paymentResponseFromHeaders(headers: Headers) {
  const raw =
    headers.get("PAYMENT-RESPONSE") || headers.get("payment-response") || "";
  return raw
    ? decodeJsonHeader<Record<string, unknown>>(raw, "PAYMENT-RESPONSE")
    : null;
}

function selectOfficialX402Details(
  paymentRequired: PaymentRequiredResponse,
  network: string
) {
  return paymentRequired.accepts?.find(
    (accept) => accept.scheme === "exact" && accept.network === network
  );
}

function selectSubly402Details(
  paymentRequired: PaymentRequiredResponse,
  network: string
) {
  return paymentRequired.accepts?.find(
    (accept) =>
      accept.scheme === "subly402-svm-v1" && accept.network === network
  );
}

function stringField(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" && field ? field : null;
}

function nestedRecord(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const field = (value as Record<string, unknown>)[key];
  return field && typeof field === "object"
    ? (field as Record<string, unknown>)
    : null;
}

function amountFromDetails(details: Record<string, unknown>) {
  const value = details.amount || details.maxAmountRequired;
  if (typeof value !== "string" && typeof value !== "number") {
    throw new DemoError(
      "invalid_payment_details",
      "Seller payment details did not include an amount.",
      502
    );
  }
  return BigInt(value.toString());
}

function assetMintFromDetails(details: Record<string, unknown>) {
  const asset = details.asset;
  if (typeof asset === "string") {
    return asset;
  }
  if (asset && typeof asset === "object") {
    const mint = (asset as Record<string, unknown>).mint;
    if (typeof mint === "string" && mint) {
      return mint;
    }
  }
  throw new DemoError(
    "invalid_payment_details",
    "Seller payment details did not include an SPL token mint.",
    502
  );
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function fetchSellerMetadata(config: EnvConfig) {
  const response = await fetch(`${config.sellerBaseUrl}/.well-known/subly402.json`, {
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  return (await response.json()) as SellerMetadata;
}

async function resolveFundingSource(
  rpc: ReturnType<typeof createSolanaRpc>,
  config: EnvConfig,
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>
) {
  const mint = await fetchMint(rpc, address(config.usdcMint));
  const mintAuthority = optionAddressValue(mint.data.mintAuthority);

  const loadedMintAuthoritySigner = config.mintAuthoritySecretJson
    ? await signerFromSecret(
        config.mintAuthoritySecretJson,
        "SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON"
      )
    : feePayer;
  const mintAuthoritySigner =
    loadedMintAuthoritySigner.address === feePayer.address
      ? feePayer
      : loadedMintAuthoritySigner;

  if (mintAuthority && mintAuthoritySigner.address === mintAuthority) {
    return { mode: "mint" as const, signer: mintAuthoritySigner };
  }

  if (config.sourceTokenAccount) {
    const loadedSourceOwner = config.sourceOwnerSecretJson
      ? await signerFromSecret(
          config.sourceOwnerSecretJson,
          "SUBLY402_DEMO_SOURCE_OWNER_SECRET_JSON"
        )
      : feePayer;
    const sourceOwner =
      loadedSourceOwner.address === feePayer.address
        ? feePayer
        : loadedSourceOwner;
    return {
      mode: "transfer" as const,
      signer: sourceOwner,
      sourceTokenAccount: config.sourceTokenAccount,
    };
  }

  throw new DemoError(
    "faucet_not_configured",
    "No valid test USDC mint authority or funded source token account is configured.",
    503,
    [
      "SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON matching mint authority, or SUBLY402_DEMO_SOURCE_TOKEN_ACCOUNT",
    ]
  );
}

async function faucetToTokenAccount(args: {
  rpc: ReturnType<typeof createSolanaRpc>;
  config: EnvConfig;
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  destinationTokenAccount: string;
  amountAtomic: bigint;
}) {
  const funding = await resolveFundingSource(
    args.rpc,
    args.config,
    args.feePayer
  );
  if (funding.mode === "mint") {
    return sendInstructions(args.rpc, args.feePayer, [
      getMintToInstruction({
        mint: address(args.config.usdcMint),
        token: address(args.destinationTokenAccount),
        mintAuthority: funding.signer,
        amount: args.amountAtomic,
      }),
    ]);
  }

  return sendInstructions(args.rpc, args.feePayer, [
    getTransferInstruction({
      source: address(funding.sourceTokenAccount),
      destination: address(args.destinationTokenAccount),
      authority: funding.signer,
      amount: args.amountAtomic,
    }),
  ]);
}

function u64Le(value: bigint) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(value);
  return buffer;
}

function buildDepositInstruction(args: {
  programId: string;
  client: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  vaultConfig: string;
  clientTokenAccount: string;
  vaultTokenAccount: string;
  amountAtomic: bigint;
}) {
  return {
    programAddress: address(args.programId),
    accounts: [
      {
        address: args.client.address,
        role: AccountRole.WRITABLE_SIGNER,
        signer: args.client,
      },
      { address: address(args.vaultConfig), role: AccountRole.WRITABLE },
      { address: address(args.clientTokenAccount), role: AccountRole.WRITABLE },
      { address: address(args.vaultTokenAccount), role: AccountRole.WRITABLE },
      { address: TOKEN_PROGRAM_ADDRESS, role: AccountRole.READONLY },
    ],
    data: Buffer.concat([DEPOSIT_DISCRIMINATOR, u64Le(args.amountAtomic)]),
  };
}

async function signText(
  signer: Awaited<ReturnType<typeof generateKeyPairSigner>>,
  message: string
) {
  const signature = await signBytes(
    signer.keyPair.privateKey,
    Buffer.from(message)
  );
  return Buffer.from(signature).toString("base64");
}

async function buildClientRequestAuth(
  signer: Awaited<ReturnType<typeof generateKeyPairSigner>>
) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 300;
  return {
    issuedAt,
    expiresAt,
    clientSig: await signText(
      signer,
      `SUBLY402-CLIENT-BALANCE\n${signer.address}\n${issuedAt}\n${expiresAt}\n`
    ),
  };
}

function sha256hex(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)
    );
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function computePaymentDetailsHash(details: unknown) {
  return sha256hex(canonicalJson(details));
}

function computeRequestHash(
  requestContext: {
    method: string;
    origin: string;
    pathAndQuery: string;
    bodySha256: string;
  },
  paymentDetailsHash: string
) {
  return sha256hex(
    `SUBLY402-SVM-V1-REQ\n${requestContext.method}\n${requestContext.origin}\n${requestContext.pathAndQuery}\n${requestContext.bodySha256}\n${paymentDetailsHash}\n`
  );
}

function deriveOpenProviderId(args: {
  network: string;
  assetMint: string;
  payTo: string;
}) {
  const digest = createHash("sha256")
    .update("SUBLY402-OPEN-PROVIDER-V1\n")
    .update(args.network)
    .update("\n")
    .update(args.assetMint)
    .update("\n")
    .update(args.payTo)
    .update("\n")
    .digest("hex");
  return `payto_${digest.slice(0, 32)}`;
}

async function signPaymentPayload(
  signer: Awaited<ReturnType<typeof generateKeyPairSigner>>,
  fields: Record<string, string | number>
) {
  return signText(
    signer,
    `SUBLY402-SVM-V1-AUTH\n${fields.version}\n${fields.scheme}\n${fields.paymentId}\n${fields.client}\n${fields.vault}\n${fields.providerId}\n${fields.payTo}\n${fields.network}\n${fields.assetMint}\n${fields.amount}\n${fields.requestHash}\n${fields.paymentDetailsHash}\n${fields.expiresAt}\n${fields.nonce}\n`
  );
}

function buildPayment(args: {
  attestation: Attestation;
  clientSigner: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  config: EnvConfig;
  providerId: string;
  nonce: number;
}) {
  const requestContext = {
    method: DEMO_HTTP_METHOD,
    origin: args.config.requestOrigin,
    pathAndQuery: DEMO_ROUTE_PATH,
    bodySha256: sha256hex(""),
  };
  const paymentDetails = {
    scheme: "subly402-svm-v1",
    network: args.config.network,
    amount: args.config.paymentAmountAtomic.toString(),
    asset: {
      kind: "spl-token",
      mint: args.config.usdcMint,
      decimals: USDC_DECIMALS,
      symbol: "USDC",
    },
    payTo: args.config.sellerTokenAccount,
    providerId: args.providerId,
    facilitatorUrl: args.config.facilitatorUrl,
    vault: {
      config: args.config.vaultConfig,
      signer: args.attestation.vaultSigner,
      attestationPolicyHash: args.attestation.attestationPolicyHash,
    },
    paymentDetailsId: `paydet_lp_${args.providerId}_${randomUUID()}`,
    verifyWindowSec: 60,
    maxSettlementDelaySec: 900,
    privacyMode: "vault-batched-v1",
    mimeType: DEMO_MIME_TYPE,
  };
  const paymentDetailsHash = computePaymentDetailsHash(paymentDetails);
  const requestHash = computeRequestHash(requestContext, paymentDetailsHash);
  const unsignedPayload = {
    version: 1,
    scheme: "subly402-svm-v1",
    paymentId: `pay_lp_${randomUUID()}`,
    client: args.clientSigner.address.toString(),
    vault: args.config.vaultConfig,
    providerId: args.providerId,
    payTo: args.config.sellerTokenAccount,
    network: args.config.network,
    assetMint: args.config.usdcMint,
    amount: args.config.paymentAmountAtomic.toString(),
    requestHash,
    paymentDetailsHash,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    nonce: String(args.nonce),
  };

  return { requestContext, paymentDetails, unsignedPayload };
}

function requestContextFromUrl(url: string, method = DEMO_HTTP_METHOD) {
  const parsed = new URL(url);
  return {
    method: method.toUpperCase(),
    origin: parsed.origin,
    pathAndQuery: `${parsed.pathname}${parsed.search}`,
    bodySha256: sha256hex(""),
  };
}

async function buildSublyPaymentPayload(args: {
  url: string;
  details: Record<string, unknown>;
  clientSigner: Awaited<ReturnType<typeof generateKeyPairSigner>>;
}) {
  const vault = nestedRecord(args.details, "vault");
  const providerId = stringField(args.details, "providerId");
  const payTo = stringField(args.details, "payTo");
  const network = stringField(args.details, "network");
  const vaultConfig = stringField(vault, "config");
  if (!providerId || !payTo || !network || !vaultConfig) {
    throw new DemoError(
      "invalid_payment_details",
      "Subly402 payment details are missing providerId, payTo, network, or vault config.",
      502
    );
  }

  const amount = amountFromDetails(args.details).toString();
  const assetMint = assetMintFromDetails(args.details);
  const requestContext = requestContextFromUrl(args.url);
  const paymentDetailsHash = computePaymentDetailsHash(args.details);
  const requestHash = computeRequestHash(requestContext, paymentDetailsHash);
  const unsignedPayload = {
    version: 1,
    scheme: "subly402-svm-v1",
    paymentId: `pay_lp_${randomUUID()}`,
    client: args.clientSigner.address.toString(),
    vault: vaultConfig,
    providerId,
    payTo,
    network,
    assetMint,
    amount,
    requestHash,
    paymentDetailsHash,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    nonce: Date.now().toString(),
  };
  return {
    requestContext,
    paymentDetailsHash,
    paymentPayload: {
      ...unsignedPayload,
      clientSig: await signPaymentPayload(args.clientSigner, unsignedPayload),
    },
  };
}

async function verifySublyAttestationForDetails(
  config: EnvConfig,
  details: Record<string, unknown>
) {
  const attestation = await fetchAttestation(config);
  const vault = nestedRecord(details, "vault");
  const detailsVaultConfig = stringField(vault, "config");
  const detailsVaultSigner = stringField(vault, "signer");
  const detailsPolicyHash = stringField(vault, "attestationPolicyHash");

  if (attestation.vaultConfig !== detailsVaultConfig) {
    throw new DemoError(
      "attestation_mismatch",
      "Live attestation vaultConfig does not match the seller payment details.",
      502
    );
  }
  if (attestation.vaultSigner !== detailsVaultSigner) {
    throw new DemoError(
      "attestation_mismatch",
      "Live attestation vaultSigner does not match the seller payment details.",
      502
    );
  }
  if (
    !detailsPolicyHash ||
    attestation.attestationPolicyHash.toLowerCase() !==
      detailsPolicyHash.toLowerCase()
  ) {
    throw new DemoError(
      "attestation_mismatch",
      "Live attestation policy hash does not match the seller payment details.",
      502
    );
  }
  if (
    config.attestationPolicyHash &&
    attestation.attestationPolicyHash.toLowerCase() !==
      config.attestationPolicyHash.toLowerCase()
  ) {
    throw new DemoError(
      "attestation_mismatch",
      "Live attestation policy hash does not match this LP deployment.",
      502
    );
  }
  if (attestation.expiresAt && Date.parse(attestation.expiresAt) <= Date.now()) {
    throw new DemoError(
      "attestation_expired",
      "Live attestation is expired.",
      502
    );
  }
  return attestation;
}

function isRetryableSubly402(paymentRequired: PaymentRequiredResponse) {
  return (
    isInsufficientSubly402(paymentRequired) ||
    isDepositSyncInProgress(paymentRequired)
  );
}

function isInsufficientSubly402(paymentRequired: PaymentRequiredResponse) {
  const code = paymentRequired.facilitatorError || paymentRequired.error;
  if (code === "insufficient_balance") {
    return true;
  }
  const message =
    typeof paymentRequired.message === "string"
      ? paymentRequired.message.toLowerCase()
      : "";
  return message.includes("insufficient");
}

function isDepositSyncInProgress(paymentRequired: PaymentRequiredResponse) {
  const code = paymentRequired.facilitatorError || paymentRequired.error;
  if (code === "deposit_sync_in_progress") {
    return true;
  }
  const message =
    typeof paymentRequired.message === "string"
      ? paymentRequired.message.toLowerCase()
      : "";
  return message.includes("deposit synchronization");
}

async function postJson<T>(
  baseUrl: string,
  route: string,
  body: unknown,
  headers?: Record<string, string>
) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!response.ok) {
    throw new DemoError(
      "facilitator_error",
      `${route} failed with ${response.status}: ${
        typeof parsed === "string" ? parsed : JSON.stringify(parsed)
      }`,
      502
    );
  }
  return parsed as T;
}

async function fetchAttestation(config: EnvConfig) {
  const response = await fetch(`${config.facilitatorUrl}/v1/attestation`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new DemoError(
      "attestation_unavailable",
      `/v1/attestation failed with ${response.status}`,
      502
    );
  }
  return (await response.json()) as Attestation;
}

async function waitForBalance(args: {
  config: EnvConfig;
  client: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  minimumAtomic: bigint;
}) {
  let last: unknown = null;
  for (let attempt = 0; attempt < BALANCE_SYNC_ATTEMPTS; attempt += 1) {
    const auth = await buildClientRequestAuth(args.client);
    try {
      const body = await postJson<{ free: number | string }>(
        args.config.facilitatorUrl,
        "/v1/balance",
        {
          client: args.client.address,
          issuedAt: auth.issuedAt,
          expiresAt: auth.expiresAt,
          clientSig: auth.clientSig,
        }
      );
      last = body;
      if (BigInt(body.free.toString()) >= args.minimumAtomic) {
        return body;
      }
    } catch (error) {
      last = error;
    }
    await sleep(BALANCE_SYNC_DELAY_MS);
  }
  throw new DemoError(
    "balance_sync_timeout",
    `Vault balance did not sync in time. Last response: ${
      last instanceof Error ? last.message : JSON.stringify(last)
    }`,
    504
  );
}

function buildDemoProviderResponse(providerId: string) {
  return {
    report: {
      weather: "sunny",
      temperature: 70,
      source: "Subly402 live LP demo",
    },
    providerId,
    settlementMode: "subly-private-x402",
  };
}

export async function getLiveAttestation() {
  const config = readConfig();
  if (missingConfig(config).length > 0 && remoteDemoBaseUrl()) {
    return proxyDemoJson<ReturnType<typeof getDemoPublicConfig> & {
      attestation?: Attestation;
    }>("/api/demo/attestation");
  }
  const attestation = await fetchAttestation(config);
  return {
    ...getDemoPublicConfig(),
    attestation: {
      vaultConfig: attestation.vaultConfig,
      vaultSigner: attestation.vaultSigner,
      attestationPolicyHash: attestation.attestationPolicyHash,
      snapshotSeqno: attestation.snapshotSeqno,
      issuedAt: attestation.issuedAt,
      expiresAt: attestation.expiresAt,
    },
  };
}

export async function requestFaucet(recipient: string, amountAtomic?: bigint) {
  const config = readConfig();
  try {
    requiredConfig(config, {
      requireSeller: false,
      requireBuyer: false,
      requireAttestationPolicy: false,
    });
  } catch (error) {
    if (error instanceof DemoError && remoteDemoBaseUrl()) {
      return proxyDemoJson("/api/demo/faucet", {
        method: "POST",
        body: JSON.stringify({ recipient }),
      });
    }
    throw error;
  }
  address(recipient);
  const amount = amountAtomic || config.faucetAmountAtomic;
  if (amount > config.faucetAmountAtomic) {
    throw new DemoError(
      "amount_too_large",
      "Requested faucet amount is too large.",
      400
    );
  }

  const rpc = createRpc(config);
  const feePayer = await signerFromSecret(
    config.feePayerSecretJson!,
    "SUBLY402_DEMO_FEE_PAYER_SECRET_JSON"
  );
  const ata = await createAssociatedTokenAccount(
    rpc,
    feePayer,
    recipient,
    config.usdcMint
  );
  const faucetTx = await faucetToTokenAccount({
    rpc,
    config,
    feePayer,
    destinationTokenAccount: ata.tokenAccount,
    amountAtomic: amount,
  });

  return {
    ok: true,
    recipient,
    tokenAccount: ata.tokenAccount,
    amountAtomic: amount.toString(),
    amount: formatUsdcAtomic(amount),
    createAtaTx: ata.signature,
    faucetTx,
    mint: config.usdcMint,
  };
}

async function prepareBuyerTokenAccount(args: {
  rpc: ReturnType<typeof createSolanaRpc>;
  config: EnvConfig;
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  buyer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  amountAtomic: bigint;
}) {
  const buyerAta = await createAssociatedTokenAccount(
    args.rpc,
    args.feePayer,
    args.buyer.address.toString(),
    args.config.usdcMint
  );
  const faucetTx = await faucetToTokenAccount({
    rpc: args.rpc,
    config: args.config,
    feePayer: args.feePayer,
    destinationTokenAccount: buyerAta.tokenAccount,
    amountAtomic: args.amountAtomic,
  });
  return { buyerTokenAccount: buyerAta.tokenAccount, faucetTx };
}

async function runOfficialX402SellerFlow(args: {
  config: EnvConfig;
  rpc: ReturnType<typeof createSolanaRpc>;
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  buyer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
}) {
  const preflight = await fetch(args.config.x402SellerUrl, {
    method: DEMO_HTTP_METHOD,
    cache: "no-store",
  });
  if (preflight.status !== 402) {
    throw new DemoError(
      "seller_route_unexpected_status",
      `Expected x402 seller to return 402 before payment, got ${preflight.status}.`,
      502
    );
  }
  const paymentRequired = await paymentRequiredFromResponse(preflight);
  const details = selectOfficialX402Details(
    paymentRequired,
    args.config.x402Network
  );
  if (!details) {
    throw new DemoError(
      "payment_details_missing",
      "x402 seller did not return an official exact/SVM payment option for the configured network.",
      502
    );
  }

  const mint = assetMintFromDetails(details);
  if (mint !== args.config.usdcMint) {
    throw new DemoError(
      "asset_mismatch",
      `x402 seller requires asset ${mint}, but LP is configured for ${args.config.usdcMint}.`,
      502
    );
  }
  const amountAtomic = amountFromDetails(details);
  const sellerWallet = stringField(details, "payTo");
  if (!sellerWallet) {
    throw new DemoError(
      "payment_details_missing",
      "x402 seller did not return a payTo wallet.",
      502
    );
  }

  const { buyerTokenAccount, faucetTx } = await prepareBuyerTokenAccount({
    rpc: args.rpc,
    config: args.config,
    feePayer: args.feePayer,
    buyer: args.buyer,
    amountAtomic,
  });
  // The public Seller host already exposes/owns this ATA. Creating it here can
  // collide with deployments where the fee payer is also the seller wallet.
  const sellerTokenAccount = await deriveAssociatedTokenAccount(
    sellerWallet,
    mint
  );
  const buyerBefore = await fetchTokenAmountOrNull(
    args.rpc,
    buyerTokenAccount
  );
  const sellerBefore = await fetchTokenAmountOrNull(
    args.rpc,
    sellerTokenAccount
  );

  const buyerClient = new x402Client().register(
    args.config.x402Network as Network,
    new X402BuyerExactSvmScheme(args.buyer, { rpcUrl: args.config.rpcUrl })
  );
  const fetchWithPayment = wrapX402FetchWithPayment(fetch, buyerClient);
  const response = await fetchWithPayment(args.config.x402SellerUrl, {
    method: DEMO_HTTP_METHOD,
    cache: "no-store",
  });
  const body = await readJsonResponse(response);
  if (!response.ok) {
    throw new DemoError(
      "x402_request_failed",
      `Official x402 request failed with ${response.status}: ${JSON.stringify(
        body
      )}`,
      502
    );
  }

  const httpClient = new x402HTTPClient(buyerClient);
  let settleResponse: Record<string, unknown> | null = null;
  try {
    settleResponse = httpClient.getPaymentSettleResponse((name) =>
      response.headers.get(name)
    ) as unknown as Record<string, unknown>;
  } catch {
    settleResponse = null;
  }
  const rawPaymentResponse = paymentResponseFromHeaders(response.headers);
  const settlementTx =
    stringField(settleResponse, "transaction") ||
    stringField(rawPaymentResponse, "transaction") ||
    stringField(rawPaymentResponse, "txSignature");
  const buyerAfter = await fetchTokenAmountOrNull(args.rpc, buyerTokenAccount);
  const sellerAfter = await fetchTokenAmountOrNull(
    args.rpc,
    sellerTokenAccount
  );

  return {
    ok: true,
    mode: "official-x402-direct",
    route: args.config.x402SellerUrl,
    network: args.config.x402Network,
    facilitatorUrl: args.config.x402FacilitatorUrl,
    amountAtomic: amountAtomic.toString(),
    amount: formatUsdcAtomic(amountAtomic),
    buyer: args.buyer.address.toString(),
    buyerTokenAccount,
    sellerWallet,
    sellerTokenAccount,
    faucetTx,
    settlementTx,
    response: body,
    paymentRequired,
    paymentResponse: rawPaymentResponse || settleResponse,
    balances: {
      buyerBefore: buyerBefore?.toString() || null,
      buyerAfter: buyerAfter?.toString() || null,
      sellerBefore: sellerBefore?.toString() || null,
      sellerAfter: sellerAfter?.toString() || null,
    },
    chainView: {
      visibleNow: [
        {
          label: "direct USDC transfer",
          from: buyerTokenAccount,
          to: sellerTokenAccount,
          amount: formatUsdcAtomic(amountAtomic),
          tx: settlementTx,
        },
      ],
      hidden: [],
      summary:
        "Public chain shows the paid request as a direct Buyer token account -> Seller token account transfer.",
    },
  };
}

async function runSubly402SellerFlow(args: {
  config: EnvConfig;
  rpc: ReturnType<typeof createSolanaRpc>;
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
  buyer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
}) {
  const preflight = await fetch(args.config.subly402SellerUrl, {
    method: DEMO_HTTP_METHOD,
    cache: "no-store",
  });
  if (preflight.status !== 402) {
    throw new DemoError(
      "seller_route_unexpected_status",
      `Expected Subly402 seller to return 402 before payment, got ${preflight.status}.`,
      502
    );
  }
  const paymentRequired = await paymentRequiredFromResponse(preflight);
  const details = selectSubly402Details(paymentRequired, args.config.network);
  if (!details) {
    throw new DemoError(
      "payment_details_missing",
      "Subly402 seller did not return a subly402-svm-v1 payment option for the configured network.",
      502
    );
  }
  const mint = assetMintFromDetails(details);
  if (mint !== args.config.usdcMint) {
    throw new DemoError(
      "asset_mismatch",
      `Subly402 seller requires asset ${mint}, but LP is configured for ${args.config.usdcMint}.`,
      502
    );
  }

  const amountAtomic = amountFromDetails(details);
  const depositAmount =
    args.config.depositAmountAtomic > amountAtomic
      ? args.config.depositAmountAtomic
      : amountAtomic;
  const sellerTokenAccount = stringField(details, "payTo");
  const providerId = stringField(details, "providerId");
  if (!sellerTokenAccount || !providerId) {
    throw new DemoError(
      "payment_details_missing",
      "Subly402 seller did not return payTo or providerId.",
      502
    );
  }

  const attestation = await verifySublyAttestationForDetails(
    args.config,
    details
  );
  const { buyerTokenAccount, faucetTx } = await prepareBuyerTokenAccount({
    rpc: args.rpc,
    config: args.config,
    feePayer: args.feePayer,
    buyer: args.buyer,
    amountAtomic: depositAmount,
  });
  const sellerBefore = await fetchTokenAmountOrNull(
    args.rpc,
    sellerTokenAccount
  );

  const depositTxs: string[] = [];
  const depositForSublyBalance = async (minimumAtomic: bigint) => {
    const signature = await sendInstructions(args.rpc, args.feePayer, [
      buildDepositInstruction({
        programId: args.config.programId,
        client: args.buyer,
        vaultConfig: args.config.vaultConfig,
        clientTokenAccount: buyerTokenAccount,
        vaultTokenAccount: args.config.vaultTokenAccount,
        amountAtomic: depositAmount,
      }),
    ]);
    depositTxs.push(signature);
    return waitForBalance({
      config: args.config,
      client: args.buyer,
      minimumAtomic,
    });
  };

  const balance = await depositForSublyBalance(amountAtomic);

  let paidResponse: Response | null = null;
  let last402: PaymentRequiredResponse | null = null;
  let topUpCount = 0;
  for (let attempt = 0; attempt < SUBLY402_PAYMENT_RETRY_ATTEMPTS; attempt += 1) {
    const payment = await buildSublyPaymentPayload({
      url: args.config.subly402SellerUrl,
      details,
      clientSigner: args.buyer,
    });
    const response = await fetch(args.config.subly402SellerUrl, {
      method: DEMO_HTTP_METHOD,
      cache: "no-store",
      headers: {
        "PAYMENT-SIGNATURE": Buffer.from(
          JSON.stringify(payment.paymentPayload)
        ).toString("base64"),
      },
    });
    if (response.status !== 402) {
      paidResponse = response;
      break;
    }
    last402 = await paymentRequiredFromResponse(response).catch(() => null);
    if (!last402 || !isRetryableSubly402(last402)) {
      paidResponse = response;
      break;
    }
    if (isInsufficientSubly402(last402) && topUpCount < 2) {
      topUpCount += 1;
      await depositForSublyBalance(amountAtomic * BigInt(topUpCount + 1));
    }
    await sleep(SUBLY402_PAYMENT_RETRY_DELAY_MS);
  }

  if (!paidResponse) {
    throw new DemoError(
      "subly402_request_failed",
      `Subly402 seller kept returning 402 after deposit: ${JSON.stringify(
        last402
      )}`,
      504
    );
  }
  const body = await readJsonResponse(paidResponse);
  if (!paidResponse.ok) {
    throw new DemoError(
      "subly402_request_failed",
      `Subly402 request failed with ${paidResponse.status}: ${JSON.stringify(
        body
      )}`,
      502
    );
  }

  const paymentResponse = paymentResponseFromHeaders(paidResponse.headers);
  const settlementId = stringField(paymentResponse, "settlementId");
  const settlementStatus =
    settlementId && providerId
      ? await getSettlementStatus(settlementId, providerId).catch((error) => ({
          ok: false,
          settlementId,
          providerId,
          status: error instanceof Error ? error.message : "status unavailable",
          txSignature: null,
        }))
      : null;
  const sellerAfter = await fetchTokenAmountOrNull(
    args.rpc,
    sellerTokenAccount
  );

  return {
    ok: true,
    mode: "subly-private-x402",
    route: args.config.subly402SellerUrl,
    network: args.config.network,
    facilitatorUrl: args.config.facilitatorUrl,
    buyer: args.buyer.address.toString(),
    buyerTokenAccount,
    sellerTokenAccount,
    vaultTokenAccount: args.config.vaultTokenAccount,
    providerId,
    amountAtomic: amountAtomic.toString(),
    amount: formatUsdcAtomic(amountAtomic),
    depositAmountAtomic: depositAmount.toString(),
    depositAmount: formatUsdcAtomic(depositAmount),
    faucetTx,
    depositTx: depositTxs[0],
    depositTxs,
    attestation: {
      vaultConfig: attestation.vaultConfig,
      vaultSigner: attestation.vaultSigner,
      attestationPolicyHash: attestation.attestationPolicyHash,
      snapshotSeqno: attestation.snapshotSeqno,
      issuedAt: attestation.issuedAt,
      expiresAt: attestation.expiresAt,
    },
    balance,
    response: body,
    paymentRequired,
    paymentResponse,
    settlementStatus,
    balances: {
      sellerBefore: sellerBefore?.toString() || null,
      sellerAfter: sellerAfter?.toString() || null,
    },
    chainView: {
      visibleNow: [
        {
          label: "vault deposit",
          from: buyerTokenAccount,
          to: args.config.vaultTokenAccount,
          amount: formatUsdcAtomic(depositAmount),
          tx: depositTxs[0],
        },
      ],
      hidden: [
        {
          label: "direct Buyer -> Seller edge",
          from: buyerTokenAccount,
          to: sellerTokenAccount,
          amount: formatUsdcAtomic(amountAtomic),
        },
      ],
      delayed: [
        {
          label: "batched seller payout",
          from: args.config.vaultTokenAccount,
          to: sellerTokenAccount,
          tx: settlementStatus?.txSignature || null,
          status: settlementStatus?.status || "pending",
        },
      ],
      summary:
        "Public chain shows the Buyer depositing into Subly's vault; the Buyer token account does not directly transfer to the Seller token account.",
    },
  };
}

export async function runPaymentDemo() {
  const config = readConfig();
  try {
    requiredConfig(config);
  } catch (error) {
    if (error instanceof DemoError && remoteDemoBaseUrl()) {
      return proxyDemoJson("/api/demo/run", {
        method: "POST",
        body: "{}",
      });
    }
    throw error;
  }

  const rpc = createRpc(config);
  const feePayer = await signerFromSecret(
    config.feePayerSecretJson!,
    "SUBLY402_DEMO_FEE_PAYER_SECRET_JSON"
  );
  const buyer = await demoBuyerFromConfig(config);
  const metadata = await fetchSellerMetadata(config);
  const x402 = await runOfficialX402SellerFlow({
    config,
    rpc,
    feePayer,
    buyer,
  });
  const subly402 = await runSubly402SellerFlow({
    config,
    rpc,
    feePayer,
    buyer,
  });

  return {
    ok: true,
    mode: "x402-vs-subly402-hosted-buyer",
    buyer: buyer.address.toString(),
    seller: {
      baseUrl: config.sellerBaseUrl,
      metadataUrl: `${config.sellerBaseUrl}/.well-known/subly402.json`,
      wallet: metadata?.sellerWallet || x402.sellerWallet,
      tokenAccount:
        metadata?.sellerTokenAccount ||
        subly402.sellerTokenAccount ||
        x402.sellerTokenAccount,
      routes: {
        x402: config.x402SellerUrl,
        subly402: config.subly402SellerUrl,
      },
    },
    asset: {
      mint: config.usdcMint,
      symbol: "USDC",
      decimals: USDC_DECIMALS,
    },
    x402,
    subly402,
    comparison: {
      x402: [
        "Uses the official x402 exact/SVM Buyer flow.",
        "The settlement transaction transfers USDC directly from the Buyer token account to the Seller token account.",
      ],
      subly402: [
        "Uses an x402-style 402 challenge and PAYMENT-SIGNATURE retry against the Subly402 Seller route.",
        "The visible Buyer transaction is a vault deposit. Seller payout is later batched from the vault, so the Buyer -> Seller edge is not visible.",
      ],
    },
  };
}

export async function getSettlementStatus(
  settlementId: string,
  providerId?: string
): Promise<SettlementStatus> {
  const config = readConfig();
  if (!settlementId || typeof settlementId !== "string") {
    throw new DemoError(
      "invalid_settlement_id",
      "settlementId is required",
      400
    );
  }
  if (missingConfig(config).length > 0 && remoteDemoBaseUrl()) {
    return proxyDemoJson<SettlementStatus>("/api/demo/settlement-status", {
      method: "POST",
      body: JSON.stringify({ settlementId, providerId }),
    });
  }
  const headers = providerId
    ? { "x-subly402-provider-id": providerId }
    : undefined;
  return postJson<SettlementStatus>(
    config.facilitatorUrl,
    "/v1/settlement/status",
    { settlementId },
    headers
  );
}

export function formatUsdcAtomic(value: bigint | string | number) {
  const atomic = BigInt(value.toString());
  const whole = atomic / BigInt(1_000_000);
  const fraction = (atomic % BigInt(1_000_000)).toString().padStart(6, "0");
  return `${whole}.${fraction} USDC`;
}

export function demoErrorResponse(error: unknown) {
  if (error instanceof DemoError) {
    return {
      body: {
        ok: false,
        error: error.code,
        message: error.message,
        missing: error.missing,
      },
      status: error.status,
    };
  }
  return {
    body: {
      ok: false,
      error: "internal_error",
      message: error instanceof Error ? error.message : "Unknown error",
    },
    status: 500,
  };
}
