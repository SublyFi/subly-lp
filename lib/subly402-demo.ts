import { createHash, randomUUID } from "node:crypto";

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
  fetchMint,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getMintToInstruction,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const DEFAULT_FACILITATOR_URL = "https://api.demo.sublyfi.com";
const DEFAULT_NETWORK = "solana:devnet";
const DEFAULT_REQUEST_ORIGIN = "https://demo.sublyfi.com";
const DEMO_ROUTE_PATH = "/weather";
const DEMO_HTTP_METHOD = "GET";
const DEMO_MIME_TYPE = "application/json";
const USDC_DECIMALS = 6;
const CONFIRMATION_ATTEMPTS = 60;
const CONFIRMATION_DELAY_MS = 1000;
const BALANCE_SYNC_ATTEMPTS = 35;
const BALANCE_SYNC_DELAY_MS = 1000;

const DEPOSIT_DISCRIMINATOR = createHash("sha256")
  .update("global:deposit")
  .digest()
  .subarray(0, 8);

type EnvConfig = {
  enabled: boolean;
  rpcUrl: string;
  facilitatorUrl: string;
  network: string;
  programId: string;
  vaultConfig: string;
  vaultTokenAccount: string;
  usdcMint: string;
  sellerTokenAccount: string;
  requestOrigin: string;
  paymentAmountAtomic: bigint;
  depositAmountAtomic: bigint;
  faucetAmountAtomic: bigint;
  feePayerSecretJson?: string;
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

function readConfig(): EnvConfig {
  return {
    enabled: env("SUBLY402_DEMO_ENABLED") === "1",
    rpcUrl:
      env("SUBLY402_DEMO_RPC_URL") || env("SUBLY402_SOLANA_RPC_URL") || "",
    facilitatorUrl:
      env("SUBLY402_DEMO_FACILITATOR_URL") ||
      env("SUBLY402_PUBLIC_ENCLAVE_URL") ||
      DEFAULT_FACILITATOR_URL,
    network: env("SUBLY402_NETWORK") || DEFAULT_NETWORK,
    programId: env("SUBLY402_PROGRAM_ID") || "",
    vaultConfig: env("SUBLY402_VAULT_CONFIG") || "",
    vaultTokenAccount: env("SUBLY402_VAULT_TOKEN_ACCOUNT") || "",
    usdcMint: env("SUBLY402_USDC_MINT") || "",
    sellerTokenAccount: env("SUBLY402_DEMO_SELLER_TOKEN_ACCOUNT") || "",
    requestOrigin:
      env("SUBLY402_DEMO_REQUEST_ORIGIN") || DEFAULT_REQUEST_ORIGIN,
    paymentAmountAtomic: envBigInt(
      "SUBLY402_DEMO_PAYMENT_AMOUNT_ATOMIC",
      BigInt(10_000)
    ),
    depositAmountAtomic: envBigInt(
      "SUBLY402_DEMO_DEPOSIT_AMOUNT_ATOMIC",
      BigInt(50_000)
    ),
    faucetAmountAtomic: envBigInt(
      "SUBLY402_DEMO_FAUCET_AMOUNT_ATOMIC",
      BigInt(100_000)
    ),
    feePayerSecretJson:
      env("SUBLY402_DEMO_FEE_PAYER_SECRET_JSON") ||
      env("SUBLY402_DEMO_FAUCET_SECRET_JSON"),
    mintAuthoritySecretJson: env("SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON"),
    sourceTokenAccount: env("SUBLY402_DEMO_SOURCE_TOKEN_ACCOUNT"),
    sourceOwnerSecretJson: env("SUBLY402_DEMO_SOURCE_OWNER_SECRET_JSON"),
  };
}

function requiredConfig(config: EnvConfig) {
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
  if (!config.usdcMint) {
    missing.push("SUBLY402_USDC_MINT");
  }
  if (!config.sellerTokenAccount) {
    missing.push("SUBLY402_DEMO_SELLER_TOKEN_ACCOUNT");
  }
  if (!config.feePayerSecretJson) {
    missing.push("SUBLY402_DEMO_FEE_PAYER_SECRET_JSON");
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
    usdcMint: config.usdcMint,
    vaultConfig: config.vaultConfig,
    sellerTokenAccount: config.sellerTokenAccount,
    paymentAmount: formatUsdcAtomic(config.paymentAmountAtomic),
    faucetAmount: formatUsdcAtomic(config.faucetAmountAtomic),
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

async function resolveFundingSource(
  rpc: ReturnType<typeof createSolanaRpc>,
  config: EnvConfig,
  feePayer: Awaited<ReturnType<typeof generateKeyPairSigner>>
) {
  const mint = await fetchMint(rpc, address(config.usdcMint));
  const mintAuthority = optionAddressValue(mint.data.mintAuthority);

  const mintAuthoritySigner = config.mintAuthoritySecretJson
    ? await signerFromSecret(
        config.mintAuthoritySecretJson,
        "SUBLY402_DEMO_MINT_AUTHORITY_SECRET_JSON"
      )
    : feePayer;

  if (mintAuthority && mintAuthoritySigner.address === mintAuthority) {
    return { mode: "mint" as const, signer: mintAuthoritySigner };
  }

  if (config.sourceTokenAccount) {
    const sourceOwner = config.sourceOwnerSecretJson
      ? await signerFromSecret(
          config.sourceOwnerSecretJson,
          "SUBLY402_DEMO_SOURCE_OWNER_SECRET_JSON"
        )
      : feePayer;
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
  requiredConfig({
    ...config,
    // A public faucet only needs funding config, not the demo seller.
    sellerTokenAccount:
      config.sellerTokenAccount || "11111111111111111111111111111111",
  });
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

export async function runPaymentDemo() {
  const config = readConfig();
  requiredConfig(config);

  const rpc = createRpc(config);
  const feePayer = await signerFromSecret(
    config.feePayerSecretJson!,
    "SUBLY402_DEMO_FEE_PAYER_SECRET_JSON"
  );
  const buyer = await generateKeyPairSigner(true);
  const buyerAta = await createAssociatedTokenAccount(
    rpc,
    feePayer,
    buyer.address.toString(),
    config.usdcMint
  );
  const faucetTx = await faucetToTokenAccount({
    rpc,
    config,
    feePayer,
    destinationTokenAccount: buyerAta.tokenAccount,
    amountAtomic: config.depositAmountAtomic,
  });

  const depositTx = await sendInstructions(rpc, feePayer, [
    buildDepositInstruction({
      programId: config.programId,
      client: buyer,
      vaultConfig: config.vaultConfig,
      clientTokenAccount: buyerAta.tokenAccount,
      vaultTokenAccount: config.vaultTokenAccount,
      amountAtomic: config.depositAmountAtomic,
    }),
  ]);

  const attestation = await fetchAttestation(config);
  if (attestation.vaultConfig !== config.vaultConfig) {
    throw new DemoError(
      "attestation_mismatch",
      "Live attestation vaultConfig does not match this demo deployment.",
      502
    );
  }

  const balance = await waitForBalance({
    config,
    client: buyer,
    minimumAtomic: config.paymentAmountAtomic,
  });
  const providerId = deriveOpenProviderId({
    network: config.network,
    assetMint: config.usdcMint,
    payTo: config.sellerTokenAccount,
  });
  const payment = buildPayment({
    attestation,
    clientSigner: buyer,
    config,
    providerId,
    nonce: Date.now(),
  });
  const clientSig = await signPaymentPayload(buyer, payment.unsignedPayload);
  const paymentPayload = {
    ...payment.unsignedPayload,
    clientSig,
  };

  const providerHeaders = {
    "x-subly402-provider-id": providerId,
  };
  const verifyBody = await postJson<{
    ok: boolean;
    verificationId: string;
    reservationId: string;
    providerId: string;
    amount: string;
  }>(
    config.facilitatorUrl,
    "/v1/verify",
    {
      paymentPayload,
      paymentDetails: payment.paymentDetails,
      requestContext: payment.requestContext,
    },
    providerHeaders
  );

  const providerResponse = buildDemoProviderResponse(providerId);
  const settleBody = await postJson<{
    ok: boolean;
    settlementId: string;
    participantReceipt: string;
    providerCreditAmount: string;
  }>(
    config.facilitatorUrl,
    "/v1/settle",
    {
      verificationId: verifyBody.verificationId,
      resultHash: sha256hex(JSON.stringify(providerResponse)),
      statusCode: 200,
    },
    providerHeaders
  );

  const settlementStatus = await getSettlementStatus(
    settleBody.settlementId,
    providerId
  ).catch((error) => ({
    ok: false,
    settlementId: settleBody.settlementId,
    status: error instanceof Error ? error.message : "status unavailable",
  }));

  return {
    ok: true,
    mode: "subly-private-x402",
    route: `${DEMO_HTTP_METHOD} ${DEMO_ROUTE_PATH}`,
    buyer: buyer.address.toString(),
    buyerTokenAccount: buyerAta.tokenAccount,
    sellerTokenAccount: config.sellerTokenAccount,
    providerId,
    amountAtomic: config.paymentAmountAtomic.toString(),
    amount: formatUsdcAtomic(config.paymentAmountAtomic),
    faucetTx,
    depositTx,
    attestation: {
      vaultConfig: attestation.vaultConfig,
      vaultSigner: attestation.vaultSigner,
      attestationPolicyHash: attestation.attestationPolicyHash,
      snapshotSeqno: attestation.snapshotSeqno,
    },
    balance,
    verification: verifyBody,
    settlement: settleBody,
    settlementStatus,
    privacy: {
      visible: [
        "buyer token account -> Subly vault deposit",
        "Subly vault -> seller batched payout after the settlement window",
      ],
      hidden: [
        "direct buyer -> seller edge",
        "paid route contents",
        "per-request seller correlation in the buyer wallet history",
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
