import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { mockJobData } from "@/lib/mockExportData";

const COLUMNS = [
  { header: "วันเวลาที่เปิดใบงาน", key: "open_datetime" },
  { header: "WorkCenter", key: "workcenter" },
  { header: "โปรเจ็ค", key: "project_name" },
  { header: "เลขที่เอกสาร", key: "document_no" },
  { header: "PM Order", key: "pm_order" },
  { header: "กำหนดวันเวลาเริ่มต้น", key: "planned_start" },
  { header: "กำหนดวันเวลาที่สิ้นสุด", key: "planned_end" },
  { header: "ระยะเวลา (ชม.)", key: "duration_hours" },
  { header: "ลูกค้า", key: "customer" },
  { header: "Site", key: "site" },
  { header: "สาขา", key: "branch" },
  { header: "ที่ตั้ง", key: "location" },
  { header: "ที่อยู่", key: "address" },
  { header: "รหัสไปรษณีย์", key: "postal_code" },
  { header: "IP CBx", key: "ip_cbx" },
  { header: "เบอร์โทรศัพท์", key: "phone" },
  { header: "Task ล่าสุด", key: "latest_task" },
  { header: "Task Text", key: "task_text" },
  { header: "ชื่อจนท. PM", key: "pm_officer" },
  { header: "ประเภท", key: "type" },
  { header: "ผู้เปิดใบงาน", key: "opener" },
  { header: "รายละเอียดงาน PM", key: "pm_detail" },
  { header: "ชื่อลูกค้า", key: "customer_name" },
  { header: "เบอร์โทรศัพท์ลูกค้า", key: "customer_phone" },
  { header: "ว/ด/ป เวลา เริ่ม OP", key: "op_start_datetime" },
  { header: "การแก้ไข Operation", key: "op_fix" },
  { header: "ผู้แก้ไข OP", key: "op_fixer" },
  { header: "สังกัดของช่าง", key: "technician_dept" },
  { header: "ว/ด/ป เวลา คืนดีจาก OP", key: "op_complete_datetime" },
  { header: "ลูกค้ารับคืนจาก operation", key: "customer_accept_op" },
  { header: "Grad for Teleport", key: "grad_teleport" },
  { header: "เปลี่ยนอุปกรณ์", key: "equipment_changed" },
  { header: "อุปกรณ์ที่รื้อถอน", key: "removed_equipment" },
  { header: "อุปกรณ์ที่ติดตั้งใหม่", key: "installed_equipment" },
  { header: "สาเหตุการเสีย", key: "failure_cause" },
  { header: "ชื่อผู้แจ้งคืนดี", key: "notifier_name" },
  { header: "ชื่อผู้รับแจ้งคืนดี", key: "acceptor_name" },
  { header: "สาเหตุล่าช้า (Teleport)", key: "delay_cause_teleport" },
  { header: "ระยะเวลา", key: "duration" },
  { header: "Grad for PM", key: "grad_pm" },
  { header: "Comment จากลูกค้า", key: "customer_comment" },
  { header: "Dial/On", key: "dial_on" },
  { header: "AllDowntime", key: "all_downtime" },
  { header: "Planer Grp.", key: "planner_grp" },
  { header: "Dial/Onsite SLA", key: "dial_onsite_sla" },
];

export async function POST(req: NextRequest) {
  const { startDate, endDate } = await req.json();

  const filtered = mockJobData.filter((row) => {
    const d = row.open_datetime.split(" ")[0];
    return d >= startDate && d <= endDate;
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Job Data");

  sheet.columns = COLUMNS.map((col) => ({
    header: col.header,
    key: col.key,
    width: 20,
  }));

  // Style header row
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A6E" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  filtered.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=export.xlsx",
    },
  });
}