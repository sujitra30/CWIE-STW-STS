import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const grades = await pool.query(
      "SELECT grade_id, name FROM customer_grades WHERE is_active = true ORDER BY grade_id",
    );
    return NextResponse.json({
      grades: grades.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
