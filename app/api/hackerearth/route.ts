import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { fetchHackerEarthStats } from "@/lib/cp/fetchHackerEarth";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const stats = await fetchHackerEarthStats(username.trim());
    if (!stats) {
      return NextResponse.json({ error: "Failed to fetch HackerEarth stats" }, { status: 502 });
    }

    return NextResponse.json({ username, stats });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
