import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const persons = await pool.query(
      `SELECT rp.person_id, rp.full_name, rp.nickname, rp.teleport_id,
          tt.teleport_name, tt.province
   FROM responsible_persons rp
   LEFT JOIN teleport_teams tt ON rp.teleport_id = tt.teleport_id
   WHERE rp.is_active = true
   ORDER BY rp.full_name`,
    );

    return NextResponse.json({
      persons: persons.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
