// app/api/withdrawal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ─── POST: บันทึกใบเบิกใหม่ ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      refDocId,
      teleport,
      project,
      plant,
      status,
      materialNo,
      serialNo,
      withdrawDate,
      returnDate,
      projectTarget,
      projectUsed,
      faultyProject,
      faultyPlant,
      faultyMaterialNo,
      faultySerialNo,
      remark,
      createdBy,
    } = body;

    // ── Validate required fields ──────────────────────────────────────────
    const missing: string[] = [];
    if (!teleport)        missing.push("teleport");
    if (!project)         missing.push("project");
    if (!plant)           missing.push("plant");
    if (!status)          missing.push("status");
    if (!materialNo)      missing.push("materialNo");
    if (!serialNo?.trim()) missing.push("serialNo");
    if (!projectTarget)   missing.push("projectTarget");
    if (!projectUsed)     missing.push("projectUsed");
    if (!faultyProject)   missing.push("faultyProject");
    if (!faultyPlant)     missing.push("faultyPlant");
    if (!faultyMaterialNo) missing.push("faultyMaterialNo");
    if (!faultySerialNo?.trim()) missing.push("faultySerialNo");
    if (!remark?.trim())  missing.push("remark");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ", missing },
        { status: 400 },
      );
    }

    // ── เรียก stored procedure ────────────────────────────────────────────
    const result = await pool.query<{
      new_withdrawal_id: number;
      new_tech_withdraw_no: string;
    }>(
      `SELECT * FROM sp_create_withdrawal(
        $1,  -- p_ref_doc_id
        $2,  -- p_teleport_id
        $3,  -- p_project_id
        $4,  -- p_plant_id
        $5,  -- p_status_ic_id
        $6,  -- p_material_id
        $7,  -- p_serial_no
        $8,  -- p_withdraw_date
        $9,  -- p_return_date
        $10, -- p_project_target_id
        $11, -- p_project_used_id
        $12, -- p_faulty_project_id
        $13, -- p_faulty_plant_id
        $14, -- p_faulty_material_id
        $15, -- p_faulty_serial_no
        $16, -- p_remark
        $17  -- p_created_by
      )`,
      [
        refDocId       || null,
        Number(teleport),
        Number(project),
        Number(plant),
        Number(status),
        Number(materialNo),
        serialNo.trim(),
        withdrawDate   || null,
        returnDate     || null,
        Number(projectTarget),
        Number(projectUsed),
        Number(faultyProject),
        Number(faultyPlant),
        Number(faultyMaterialNo),
        faultySerialNo.trim(),
        remark.trim(),
        createdBy      || "SYSTEM",
      ],
    );

    const row = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        withdrawalId:   row.new_withdrawal_id,
        techWithdrawNo: row.new_tech_withdraw_no,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/withdrawal error:", error);
    return NextResponse.json(
      { error: "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}

// ─── GET: ดึงรายการใบเบิก (ใช้ใน list page) ──────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teleportId = searchParams.get("teleport_id");
    const projectId  = searchParams.get("project_id");
    const limit      = Number(searchParams.get("limit")  ?? 50);
    const offset     = Number(searchParams.get("offset") ?? 0);

    const conditions: string[] = ["wr.is_deleted = false"];
    const params: (string | number)[] = [];

    if (teleportId) {
      params.push(Number(teleportId));
      conditions.push(`wr.teleport_id = $${params.length}`);
    }
    if (projectId) {
      params.push(Number(projectId));
      conditions.push(`wr.project_id = $${params.length}`);
    }

    const whereClause = conditions.join(" AND ");

    params.push(limit);
    params.push(offset);

    const result = await pool.query(
      `SELECT * FROM vw_withdrawal_full
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    // นับจำนวนทั้งหมดสำหรับ pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM withdrawal_requests wr WHERE ${whereClause}`,
      params.slice(0, params.length - 2), // ตัด limit/offset ออก
    );

    return NextResponse.json({
      data:  result.rows,
      total: Number(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error("GET /api/withdrawal error:", error);
    return NextResponse.json(
      { error: "โหลดข้อมูลไม่สำเร็จ" },
      { status: 500 },
    );
  }
} 