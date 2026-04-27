import { NextRequest, NextResponse } from "next/server";

import { demoErrorResponse, requestFaucet } from "@/lib/subly402-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      recipient?: string;
    };
    if (!body.recipient) {
      return NextResponse.json(
        {
          ok: false,
          error: "recipient_required",
          message: "recipient wallet address is required",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(await requestFaucet(body.recipient));
  } catch (error) {
    const { body, status } = demoErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
