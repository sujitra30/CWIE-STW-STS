import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const teleports = await pool.query(
      `SELECT teleport_id, teleport_name, province 
   FROM teleport_teams 
   WHERE is_active = true 
   ORDER BY province`,
    );
    return NextResponse.json({
      teleports: teleports.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
