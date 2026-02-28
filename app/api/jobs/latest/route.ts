// app/api/jobs/latest/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Query เพื่อดึงข้อมูลงานล่าสุด 1 รายการจาก view
    const query = `
      SELECT 
        job_id,
        job_no,
        service_no,
        open_datetime,
        required_close_datetime,
        receive_datetime,
        actual_close_datetime,
        project_name,
        customer_name,
        location,
        sla_name,
        reporter_name,
        reporter_phone,
        job_type_name,
        problem_detail,
        operation_type,
        priority,
        breakdown_type_name,
        status_name,
        status_sla_name,
        repair_note,
        job_status,
        status_reason,
        cause_samart,
        cause_activity,
        cause_customer,
        cause_other,
        created_by,
        created_at,
        updated_by,
        updated_at
      FROM vw_noc_jobs_full
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query);
    const job = result.rows[0];

    if (!job) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลงาน" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching latest job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}