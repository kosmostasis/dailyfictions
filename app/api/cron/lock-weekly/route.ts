import { NextResponse } from "next/server";
import { runWeeklyLock } from "@/lib/polls";

/**
 * Cron: run weekly lock (Friday 4pm Malaysia time).
 * Vercel Cron sends Authorization: Bearer CRON_SECRET.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { locked } = await runWeeklyLock();
    return NextResponse.json({ ok: true, locked });
  } catch (e) {
    console.error("lock-weekly cron error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lock failed" },
      { status: 500 }
    );
  }
}
