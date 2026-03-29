import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const slaReasons = await pool.query(
      "SELECT sla_reason_id, name FROM sla_reasons WHERE is_active = true ORDER BY sla_reason_id",
    );
    return NextResponse.json({
      slaReasons: slaReasons.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
