import { NextResponse } from "next/server";
import { getListDefinitions } from "@/lib/lists";

export async function GET() {
  try {
    const lists = await getListDefinitions();
    return NextResponse.json(lists);
  } catch (err) {
    console.error("Lists error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load lists" },
      { status: 500 }
    );
  }
}
