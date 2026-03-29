import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const causesOther = await pool.query(
      "SELECT cause_id, cause_name FROM cause_master WHERE cause_type='OTHER' AND is_active=true ORDER BY cause_name",
    );

    return NextResponse.json({
      causesOther: causesOther.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
