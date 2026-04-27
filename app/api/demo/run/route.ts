import { NextResponse } from "next/server";

import {
  demoErrorResponse,
  runPaymentDemo,
} from "@/lib/subly402-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  try {
    return NextResponse.json(await runPaymentDemo());
  } catch (error) {
    const { body, status } = demoErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
