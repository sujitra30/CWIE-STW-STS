import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const slasResult = await pool.query(
      "SELECT sla_id, sla_name FROM sla_templates WHERE is_active = true ORDER BY sla_name",
    );

    return NextResponse.json({
      slas: slasResult.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
