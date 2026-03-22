"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface JobRow {
  open_datetime: string;
  workcenter: string;
  project_name: string;
  document_no: string;
  pm_order: string;
  planned_start: string;
  planned_end: string;
  duration_hours: number;
  customer: string;
  site: string;
  branch: string;
  location: string;
  address: string;
  postal_code: string;
  ip_cbx: string;
  phone: string;
  latest_task: string;
  task_text: string;
  pm_officer: string;
  type: string;
  opener: string;
  pm_detail: string;
  customer_name: string;
  customer_phone: string;
  op_start_datetime: string;
  op_fix: string;
  op_fixer: string;
  technician_dept: string;
  op_complete_datetime: string;
  customer_accept_op: string;
  grad_teleport: string;
  equipment_changed: string;
  removed_equipment: string;
  installed_equipment: string;
  failure_cause: string;
  notifier_name: string;
  acceptor_name: string;
  delay_cause_teleport: string;
  duration: string;
  grad_pm: string;
  customer_comment: string;
  dial_on: string;
  all_downtime: string;
  planner_grp: string;
  dial_onsite_sla: string;
}

const TABLE_COLUMNS: { label: string; key: keyof JobRow }[] = [
  { label: "วันเวลาที่เปิดใบงาน", key: "open_datetime" },
  { label: "WorkCenter", key: "workcenter" },
  { label: "โปรเจ็ค", key: "project_name" },
  { label: "เลขที่เอกสาร", key: "document_no" },
  { label: "PM Order", key: "pm_order" },
  { label: "กำหนดวันเวลาเริ่มต้น", key: "planned_start" },
  { label: "กำหนดวันเวลาที่สิ้นสุด", key: "planned_end" },
  { label: "ระยะเวลา (ชม.)", key: "duration_hours" },
  { label: "ลูกค้า", key: "customer" },
  { label: "Site", key: "site" },
  { label: "สาขา", key: "branch" },
  { label: "ที่ตั้ง", key: "location" },
  { label: "ที่อยู่", key: "address" },
  { label: "รหัสไปรษณีย์", key: "postal_code" },
  { label: "IP CBx", key: "ip_cbx" },
  { label: "เบอร์โทรศัพท์", key: "phone" },
  { label: "Task ล่าสุด", key: "latest_task" },
  { label: "Task Text", key: "task_text" },
  { label: "ชื่อจนท. PM", key: "pm_officer" },
  { label: "ประเภท", key: "type" },
  { label: "ผู้เปิดใบงาน", key: "opener" },
  { label: "รายละเอียดงาน PM", key: "pm_detail" },
  { label: "ชื่อลูกค้า", key: "customer_name" },
  { label: "เบอร์โทรศัพท์ลูกค้า", key: "customer_phone" },
  { label: "ว/ด/ป เวลา เริ่ม OP", key: "op_start_datetime" },
  { label: "การแก้ไข Operation", key: "op_fix" },
  { label: "ผู้แก้ไข OP", key: "op_fixer" },
  { label: "สังกัดของช่าง", key: "technician_dept" },
  { label: "ว/ด/ป เวลา คืนดีจาก OP", key: "op_complete_datetime" },
  { label: "ลูกค้ารับคืนจาก operation", key: "customer_accept_op" },
  { label: "Grad for Teleport", key: "grad_teleport" },
  { label: "เปลี่ยนอุปกรณ์", key: "equipment_changed" },
  { label: "อุปกรณ์ที่รื้อถอน", key: "removed_equipment" },
  { label: "อุปกรณ์ที่ติดตั้งใหม่", key: "installed_equipment" },
  { label: "สาเหตุการเสีย", key: "failure_cause" },
  { label: "ชื่อผู้แจ้งคืนดี", key: "notifier_name" },
  { label: "ชื่อผู้รับแจ้งคืนดี", key: "acceptor_name" },
  { label: "สาเหตุล่าช้า (Teleport)", key: "delay_cause_teleport" },
  { label: "ระยะเวลา", key: "duration" },
  { label: "Grad for PM", key: "grad_pm" },
  { label: "Comment จากลูกค้า", key: "customer_comment" },
  { label: "Dial/On", key: "dial_on" },
  { label: "AllDowntime", key: "all_downtime" },
  { label: "Planer Grp.", key: "planner_grp" },
  { label: "Dial/Onsite SLA", key: "dial_onsite_sla" },
];

const getDefaultDates = () => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const format = (d: Date) => d.toISOString().split("T")[0];
  return { start: format(sevenDaysAgo), end: format(today) };
};

export default function GenerateRawDataPage() {
  const router = useRouter();

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const defaultDates = getDefaultDates();

  const [jobType, setJobType] = useState("Job CM");
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const [showExport, setShowExport] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [tableData, setTableData] = useState<JobRow[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const formatDateCompact = (dateStr: string) =>
    dateStr ? dateStr.replace(/-/g, "") : "";

  const exportFileName =
    startDate && endDate
      ? `PMGenText_${formatDateCompact(startDate)}TO${formatDateCompact(endDate)}`
      : "PMGenText";

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="date"]');
    inputs.forEach((el) => {
      (el as HTMLInputElement).setAttribute("lang", "th-TH");
    });
  }, []);

  const handleClear = () => {
    setStartDate(defaultDates.start);
    setEndDate(defaultDates.end);
    setShowExport(false);
    setTableData([]);
    setExportSuccess(false);
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    setShowExport(true);
    setLoadingTable(true);
    setTableData([]);
    setExportSuccess(false);

    try {
      const response = await fetch("/api/export-job/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType, startDate, endDate }),
      });

      if (!response.ok) throw new Error("Fetch failed");

      const data: JobRow[] = await response.json();
      setTableData(data);
    } catch (err) {
      console.error("Error fetching table data:", err);
      setTableData([]);
    } finally {
      setLoadingTable(false);
      setCurrentPage(1);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType, startDate, endDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Server Error:", errorData);
        alert(errorData.error || "Export failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportFileName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setExportSuccess(true);
    } catch (error) {
      console.error("Export error:", error);
      alert("เกิดข้อผิดพลาดในการ Export");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* ================= Top Bar ================= */}
      <div className="bg-orange-500 h-16 flex items-center justify-end px-6 text-white font-medium">
        <div className="w-full max-w-[1440px] flex items-center justify-between px-8">
          <div />
          <div className="flex items-center gap-4">
            <Image
              src="/images/icons8-life-cycle-50.png"
              alt="life-cycle"
              width={40}
              height={40}
            />
            <div className="text-white text-right leading-tight">
              <div className="text-lg font-medium">สุจิตรา หุ่นงาม</div>
              <div className="text-sm opacity-90">administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div className="w-full max-w-[1600px] p-6 space-y-6">
          {/* Header */}
          <div
            onClick={() => router.push("/PM")}
            className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6 cursor-pointer transition-all duration-300 hover:bg-[#162d6f] active:scale-95"
          >
            Generate Raw Data
          </div>

          {/* ================= Filter + Export Section ================= */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              รายละเอียดการดึงข้อมูล
            </p>

            <div className="flex items-end gap-3 flex-wrap">
              {/* Start Date */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  วันที่เปิดงาน
                </label>
                <input
                  ref={startDateRef}
                  type="date"
                  lang="th-TH"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <span className="text-gray-400 text-sm pb-2">ถึง</span>

              {/* End Date */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  วันที่สิ้นสุด
                </label>
                <input
                  ref={endDateRef}
                  type="date"
                  lang="th-TH"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!startDate || !endDate || loadingTable}
                className="bg-blue-900 text-white px-5 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#162d6f] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingTable ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    กำลังดึงข้อมูล...
                  </>
                ) : (
                  "ดึงข้อมูล"
                )}
              </button>

              <button
                onClick={handleClear}
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-100 active:scale-95"
              >
                ล้าง
              </button>
            </div>

            {/* ── Export ── */}
            {showExport && !loadingTable && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-sm text-gray-600">
                    พบข้อมูล{" "}
                    <span className="font-semibold text-gray-800">{tableData.length}</span>{" "}
                    รายการ — ไฟล์{" "}
                    <span className="font-semibold text-gray-800 font-mono">
                      {exportFileName}
                    </span>{" "}
                    กดปุ่ม &ldquo;Export Excel&rdquo; เพื่อดาวน์โหลด
                  </p>

                  <button
                    onClick={handleExport}
                    disabled={tableData.length === 0}
                    className="ml-auto bg-green-600 text-white px-5 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Excel
                  </button>
                </div>

                {exportSuccess && (
                  <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-sm text-green-700">
                      ดาวน์โหลดไฟล์สำเร็จ{" "}
                      <span className="font-semibold font-mono">{exportFileName}.xlsx</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= Table Section ================= */}
          {tableData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  ผลลัพธ์ข้อมูล{" "}
                  <span className="text-blue-900 normal-case">
                    ({tableData.length} รายการ)
                  </span>
                </p>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="px-3 py-2 text-center font-semibold whitespace-nowrap border-r border-blue-800 sticky left-0 bg-blue-900 z-10">
                        #
                      </th>
                      {TABLE_COLUMNS.map((col) => (
                        <th
                          key={col.key}
                          className="px-3 py-2 text-left font-semibold whitespace-nowrap border-r border-blue-800 last:border-r-0"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, i) => (
                      <tr
                        key={i}
                        className={`transition-colors ${
                          i % 2 === 0
                            ? "bg-white hover:bg-blue-50"
                            : "bg-gray-50 hover:bg-blue-50"
                        }`}
                      >
                        <td className="px-3 py-2 text-center text-gray-400 whitespace-nowrap border-r border-gray-200 sticky left-0 bg-inherit">
                          {startIndex + i + 1}
                        </td>
                        {TABLE_COLUMNS.map((col) => (
                          <td
                            key={col.key}
                            className="px-3 py-2 whitespace-nowrap border-r border-gray-200 last:border-r-0 text-gray-700"
                          >
                            {String(row[col.key] ?? "-")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  <p className="text-sm text-gray-500">
                    แสดง {startIndex + 1}–{Math.min(endIndex, tableData.length)}{" "}
                    จากทั้งหมด {tableData.length} รายการ
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      «
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      ก่อนหน้า
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 bg-blue-900 text-white rounded">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      ถัดไป
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {showExport && !loadingTable && tableData.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm text-gray-400">ไม่พบข้อมูลในช่วงวันที่ที่เลือก</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}