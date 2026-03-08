// app/api/withdrawal-latest/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const query = id
      ? `SELECT * FROM vw_withdrawal_full WHERE withdrawal_id = $1 LIMIT 1`
      : `SELECT * FROM vw_withdrawal_full ORDER BY created_at DESC LIMIT 1`;

    const result = await pool.query(query, id ? [id] : []);

    if (result.rows.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (err: any) {
    console.error("[withdrawal-latest] DB Error:", err?.message);
    return NextResponse.json({ error: err?.message || "Database error" }, { status: 500 });
  }
}