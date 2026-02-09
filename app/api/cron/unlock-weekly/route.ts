import { NextResponse } from "next/server";
import { clearAllLocked } from "@/lib/polls";

/**
 * Cron: clear locked picks so voting reopens (Monday).
 * Vercel Cron sends Authorization: Bearer CRON_SECRET.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await clearAllLocked();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("unlock-weekly cron error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unlock failed" },
      { status: 500 }
    );
  }
}
