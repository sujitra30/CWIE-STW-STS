import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const vehicles = await pool.query(
      `SELECT v.vehicle_id, v.license_plate, v.vehicle_type, v.teleport_id,
          tt.teleport_name, tt.province
   FROM vehicles v
   LEFT JOIN teleport_teams tt ON v.teleport_id = tt.teleport_id
   WHERE v.is_active = true
   ORDER BY v.license_plate`,
    );

    return NextResponse.json({
      vehicles: vehicles.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
