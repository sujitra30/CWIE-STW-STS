"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ประเภทข้อมูลที่ดึงจาก API
interface JobRow {
  open_datetime: string;
  service_no: string;
  project_name: string;
  job_type_name: string;
  breakdown_type_name: string;
  cause: string;
  reporter_name: string;
  reporter_phone: string;
  problem_detail: string;
}

export default function ExportJobPage() {
  const router = useRouter();

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [jobType, setJobType] = useState("Job CM");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showExport, setShowExport] = useState(false);

  // --- เพิ่ม state สำหรับตาราง ---
  const [tableData, setTableData] = useState<JobRow[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentData = tableData.slice(startIndex, endIndex);

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setShowExport(false);
    setTableData([]);
  };

  // --- เพิ่ม: ดึงข้อมูลตารางจาก API ---
  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    setShowExport(true);
    setLoadingTable(true);
    setTableData([]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobType,
          startDate,
          endDate,
        }),
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
      a.download = `export_jobs_${startDate}_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
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
            onClick={() => router.push("/export-job")}
            className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6 cursor-pointer transition-all duration-300 hover:bg-[#162d6f] active:scale-95"
          >
            Export Job
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-3xl font-semibold mb-8">
              ค้นหาและ Export ข้อมูลงาน
            </h2>

            <div className="flex items-center gap-4 flex-wrap">
              {/* ประเภทงาน */}
              <div className="flex items-center gap-3 bg-[#FFCC80] px-4 py-3 rounded-lg">
                <span className="text-base font-medium whitespace-nowrap">
                  ประเภทงาน
                </span>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none"
                >
                  <option>Job CM</option>
                  <option>Job PM</option>
                </select>
              </div>

              {/* ตั้งแต่วันที่ */}
              <div className="flex items-center gap-3 bg-[#FFCC80] px-4 py-3 rounded-lg">
                <span className="text-base font-medium whitespace-nowrap">
                  ตั้งแต่วันที่
                </span>
                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-gray-300 px-3 py-2 rounded text-sm outline-none"
                />
              </div>

              {/* ถึงวันที่ */}
              <div className="flex items-center gap-3 bg-[#FFCC80] px-4 py-3 rounded-lg">
                <span className="text-base font-medium whitespace-nowrap">
                  ถึงวันที่
                </span>
                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-gray-300 px-3 py-2 rounded text-sm outline-none"
                />
              </div>

              {/* Buttons */}
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-[#F0EDED] rounded text-base hover:bg-gray-200"
              >
                ล้าง
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#13298C] text-white rounded text-base hover:bg-[#0f1f6b]"
              >
                ค้นหา
              </button>
            </div>
          </div>

          {/* Export Button */}
          {showExport && (
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded text-base hover:bg-green-700"
            >
              Export ข้อมูลงาน
            </button>
          )}

          {/* ================= ตารางแสดงข้อมูล ================= */}
          {showExport && (
            <div className="bg-white rounded-lg overflow-hidden border border-[#A9A9A9]  mb-10 ">
              <div className="overflow-auto max-h-[350px]">
                <table className="w-full text-sm border-collapse">
                  {/* Header ตาราง */}
                  <thead className="bg-[#13298C] text-white sticky top-0 z-10">
                    <tr className="border-b border-[#A9A9A9]">
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        วันเวลาที่เปิดงาน
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        Service No.
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        โครงการ
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        ประเภทงาน
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        ประเภทเหตุเสีย
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        สาเหตุการเสีย
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        ชื่อผู้แจ้ง
                      </th>
                      <th className="px-4 py-3 text-left font-normal text-white whitespace-nowrap">
                        เบอร์โทรศัพท์
                      </th>
                    </tr>
                  </thead>

                  {/* Body ตาราง */}
                  <tbody>
                    {loadingTable ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-10 text-gray-400"
                        >
                          กำลังโหลดข้อมูล...
                        </td>
                      </tr>
                    ) : tableData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-10 text-gray-400"
                        >
                          ไม่พบข้อมูล
                        </td>
                      </tr>
                    ) : (
                      currentData.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.open_datetime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.service_no}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.project_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.job_type_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.breakdown_type_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.cause}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.reporter_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.reporter_phone}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                {tableData.length > rowsPerPage && (
                  <div className="flex justify-center items-center gap-2 py-6">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      ก่อนหน้า
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-[#13298C] text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      ถัดไป
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
