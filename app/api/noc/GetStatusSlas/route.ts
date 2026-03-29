import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const statusSlaResult = await pool.query(
      "SELECT status_sla_id, status_sla_name FROM status_sla_master WHERE is_active = true ORDER BY status_sla_name",
    );

    return NextResponse.json({
      statusSlas: statusSlaResult.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
