import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // ปรับตาม path ที่เก็บ database connection ของคุณ

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const projectsResult = await pool.query(
      "SELECT project_id, project_name FROM projects WHERE is_active = true ORDER BY project_name",
    );

    const slasResult = await pool.query(
      "SELECT sla_id, sla_name FROM sla_templates WHERE is_active = true ORDER BY sla_name",
    );

    const jobTypesResult = await pool.query(
      "SELECT job_type_id, job_type_name FROM job_types WHERE is_active = true ORDER BY job_type_name",
    );

    const prioritiesResult = await pool.query(
      "SELECT priority_id, priority_name FROM priority_master WHERE is_active = true ORDER BY priority_id",
    );
    const breakdownResult = await pool.query(
      "SELECT breakdown_type_id, breakdown_type_name FROM breakdown_types WHERE is_active = true ORDER BY breakdown_type_name",
    );

    const statusResult = await pool.query(
      "SELECT status_id, status_name FROM status_master WHERE is_active = true ORDER BY status_name",
    );

    const statusSlaResult = await pool.query(
      "SELECT status_sla_id, status_sla_name FROM status_sla_master WHERE is_active = true ORDER BY status_sla_name",
    );

    const causesSamart = await pool.query(
      "SELECT cause_id, cause_name FROM cause_master WHERE cause_type='SAMART' AND is_active=true ORDER BY cause_name",
    );

    const causesActivity = await pool.query(
      "SELECT cause_id, cause_name FROM cause_master WHERE cause_type='ACTIVITY' AND is_active=true ORDER BY cause_name",
    );

    const causesCustomer = await pool.query(
      "SELECT cause_id, cause_name FROM cause_master WHERE cause_type='CUSTOMER' AND is_active=true ORDER BY cause_name",
    );

    const causesOther = await pool.query(
      "SELECT cause_id, cause_name FROM cause_master WHERE cause_type='OTHER' AND is_active=true ORDER BY cause_name",
    );

    const operations = await pool.query(
      "SELECT operation_id, name FROM operation_types WHERE is_active = true ORDER BY operation_id",
    );

    const slaReasons = await pool.query(
      "SELECT sla_reason_id, name FROM sla_reasons WHERE is_active = true ORDER BY sla_reason_id",
    );

    const samart = await pool.query(
      "SELECT samart_id, name FROM samart_causes WHERE is_active = true ORDER BY samart_id",
    );

    const naturalDisasters = await pool.query(
      "SELECT disaster_id, name FROM natural_disaster_causes WHERE is_active = true ORDER BY disaster_id",
    );

    const customerCauses = await pool.query(
      "SELECT customer_cause_id, name FROM customer_causes WHERE is_active = true ORDER BY customer_cause_id",
    );

    const otherCauses = await pool.query(
      "SELECT other_cause_id, name FROM other_causes WHERE is_active = true ORDER BY other_cause_id",
    );

    const grades = await pool.query(
      "SELECT grade_id, name FROM customer_grades WHERE is_active = true ORDER BY grade_id",
    );

    // ✅ ถูก - ชื่อตาราง/คอลัมน์ตรงกับ schema จริง
    const teleports = await pool.query(
      `SELECT teleport_id, teleport_name, province 
   FROM teleport_teams 
   WHERE is_active = true 
   ORDER BY province`,
    );

    const persons = await pool.query(
      `SELECT rp.person_id, rp.full_name, rp.nickname, rp.teleport_id,
          tt.teleport_name, tt.province
   FROM responsible_persons rp
   LEFT JOIN teleport_teams tt ON rp.teleport_id = tt.teleport_id
   WHERE rp.is_active = true
   ORDER BY rp.full_name`,
    );

    const vehicles = await pool.query(
      `SELECT v.vehicle_id, v.license_plate, v.vehicle_type, v.teleport_id,
          tt.teleport_name, tt.province
   FROM vehicles v
   LEFT JOIN teleport_teams tt ON v.teleport_id = tt.teleport_id
   WHERE v.is_active = true
   ORDER BY v.license_plate`,
    );

    const statusIcResult = await pool.query(
      "SELECT status_ic_id, name FROM status_ic WHERE is_active = true ORDER BY status_ic_id",
    );

    const plantsResult = await pool.query(
      "SELECT plant_id, plant_code, plant_name FROM plant ORDER BY plant_code",
    );

    const materialsResult = await pool.query(
      "SELECT material_id, material_no, material_name, material_type, unit FROM material ORDER BY material_no",
    );

    return NextResponse.json({
      projects: projectsResult.rows,
      slas: slasResult.rows,
      jobTypes: jobTypesResult.rows,
      priorities: prioritiesResult.rows,
      breakdownTypes: breakdownResult.rows,
      statuses: statusResult.rows,
      statusSlas: statusSlaResult.rows,
      causesSamart: causesSamart.rows,
      causesActivity: causesActivity.rows,
      causesCustomer: causesCustomer.rows,
      causesOther: causesOther.rows,
      operations: operations.rows,
      slaReasons: slaReasons.rows,
      samart: samart.rows,
      naturalDisasters: naturalDisasters.rows,
      customerCauses: customerCauses.rows,
      otherCauses: otherCauses.rows,
      grades: grades.rows,
      teleports: teleports.rows,
      persons: persons.rows,
      vehicles: vehicles.rows,
      statusIc: statusIcResult.rows,
      plants: plantsResult.rows,
      materials: materialsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 },
    );
  }
}
