import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  demoErrorResponse,
  runPaymentDemo,
} from "@/lib/subly402-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export async function POST(request: NextRequest) {
  try {
    checkRateLimit(`run:${clientKey(request)}`, 2, 10 * 60 * 1000);
    return NextResponse.json(await runPaymentDemo());
  } catch (error) {
    const { body, status } = demoErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
