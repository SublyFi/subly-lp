import { NextResponse } from "next/server";

import { demoErrorResponse, getLiveAttestation } from "@/lib/subly402-demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getLiveAttestation());
  } catch (error) {
    const { body, status } = demoErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
