// app/api/service-records/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      jobId,
      departDateTime,
      arriveDateTime,
      operationId,
      slaReasonId,
      samartId,
      disasterId,
      customerCauseId,
      otherCauseId,
      serviceNote,
      customerArriveDateTime,
      customerName,
      gradeId,
      phone,
      createdBy = "system",
    } = body;

    // Validate required fields
    if (!jobId || !departDateTime || !arriveDateTime || !customerName || !phone) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ (jobId, departDateTime, arriveDateTime, customerName, phone)" },
        { status: 400 }
      );
    }

    // ต้องหา job_id จาก job_no ก่อน (เพราะ frontend ส่ง job_no มา เช่น "STW000000000001")
    let resolvedJobId: number;

    if (typeof jobId === "string" && jobId.startsWith("STW")) {
      const jobResult = await pool.query(
        `SELECT job_id FROM noc_jobs WHERE job_no = $1 AND is_deleted = false`,
        [jobId]
      );

      if (jobResult.rows.length === 0) {
        return NextResponse.json(
          { error: `ไม่พบงานเลขที่ ${jobId}` },
          { status: 404 }
        );
      }
      resolvedJobId = jobResult.rows[0].job_id;
    } else {
      resolvedJobId = Number(jobId);
    }

    // เรียก stored procedure
    const result = await pool.query(
      `SELECT * FROM sp_save_service_record(
        $1,   -- p_job_id
        $2,   -- p_depart_datetime
        $3,   -- p_arrive_datetime
        $4,   -- p_operation_id
        $5,   -- p_sla_reason_id
        $6,   -- p_samart_id
        $7,   -- p_disaster_id
        $8,   -- p_customer_cause_id
        $9,   -- p_other_cause_id
        $10,  -- p_service_note
        $11,  -- p_customer_arrive_datetime
        $12,  -- p_customer_name
        $13,  -- p_grade_id
        $14,  -- p_phone
        $15   -- p_created_by
      )`,
      [
        resolvedJobId,
        departDateTime,
        arriveDateTime,
        operationId   ? Number(operationId)   : null,
        slaReasonId   ? Number(slaReasonId)   : null,
        samartId      ? Number(samartId)      : null,
        disasterId    ? Number(disasterId)    : null,
        customerCauseId ? Number(customerCauseId) : null,
        otherCauseId  ? Number(otherCauseId)  : null,
        serviceNote   || null,
        customerArriveDateTime || arriveDateTime, // fallback ใช้ arriveDateTime ถ้าไม่ได้กรอก
        customerName,
        gradeId       ? Number(gradeId)       : null,
        phone,
        createdBy,
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "บันทึกสำเร็จ",
    });

  } catch (error) {
    console.error("service-records POST error:", error);
    return NextResponse.json(
      { error: "Database error", detail: String(error) },
      { status: 500 }
    );
  }
}