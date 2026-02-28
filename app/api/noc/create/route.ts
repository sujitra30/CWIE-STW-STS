import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      project_id,
      customer_name,
      location,
      sla_id,
      reporter_name,
      reporter_phone,
      job_type_id,
      problem_detail,
      required_close_datetime,

      priority_id,
      breakdown_type_id,
      status_id,
      status_sla_id,
      repair_note,
      job_status,
      status_reason,

      cause_samart_id,
      cause_activity_id,
      cause_customer_id,
      cause_other_id,

      created_by,
    } = body;

    const result = await pool.query(
      `SELECT * FROM sp_create_noc_job(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,
    $10,$11,$12,$13,$14,$15,$16,
    $17,$18,$19,$20,
    $21
  )`,
      [
        // Number(project_id),
        // customer_name,
        // location,
        // Number(sla_id),
        // reporter_name,
        // reporter_phone,
        // Number(job_type_id),
        // problem_detail,
        // required_close_datetime,

        // Number(priority_id),
        // Number(breakdown_type_id),
        // Number(status_id),
        // Number(status_sla_id),
        // repair_note,
        // job_status,
        // status_reason,

        // Number(cause_samart_id),
        // Number(cause_activity_id),
        // Number(cause_customer_id),
        // Number(cause_other_id),

        // created_by,

        Number(project_id),
        customer_name,
        location,
        Number(sla_id),
        reporter_name,
        reporter_phone,
        Number(job_type_id),
        problem_detail,
        required_close_datetime,

        priority_id ? Number(priority_id) : null,
        breakdown_type_id ? Number(breakdown_type_id) : null,
        status_id ? Number(status_id) : null,
        status_sla_id ? Number(status_sla_id) : null,
        repair_note || null,
        job_status || null,
        status_reason || null,

        cause_samart_id ? Number(cause_samart_id) : null,
        cause_activity_id ? Number(cause_activity_id) : null,
        cause_customer_id ? Number(cause_customer_id) : null,
        cause_other_id ? Number(cause_other_id) : null,

        created_by,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

//cwie-stw\app\api\noc\create\route.ts
