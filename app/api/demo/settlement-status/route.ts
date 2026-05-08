import { NextResponse } from "next/server";

import { demoErrorResponse, getSettlementStatus } from "@/lib/subly402-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      settlementId?: string;
      providerId?: string;
      observedPayoutSinceTx?: string;
      depositTx?: string;
    };
    return NextResponse.json(
      await getSettlementStatus(
        body.settlementId || "",
        body.providerId,
        body.observedPayoutSinceTx || body.depositTx
      )
    );
  } catch (error) {
    const { body, status } = demoErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
