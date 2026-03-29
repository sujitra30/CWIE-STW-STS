"use client";

import { useState, useEffect } from "react";

// ---- Types ----
interface Project {
  project_id: string;
  project_name: string;
}

interface SearchParams {
  jobType: string;
  province: string;
  district: string;
  branch: string;
  project: string;
}

interface TableRow {
  id: number;
  selected: boolean;
  branchCode: string;
  functionalName: string;
  projectName: string;
  projectId: string;
  startDate: string;
  endDate: string;
  sla: string;
  wbs: string;
  province: string;
  district: string;
  location: string;
  teleport: string;
  equipmentNo: string;
}

// ---- Mock Geography ----
const PROVINCES = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ขอนแก่น",
  "นครราชสีมา",
  "สงขลา",
];

const DISTRICTS: Record<string, string[]> = {
  "กรุงเทพมหานคร": ["คลองสาน", "บางรัก", "สาทร", "ดอนเมือง", "ลาดกระบัง"],
  "เชียงใหม่":     ["เมืองเชียงใหม่", "สันทราย", "หางดง"],
  "ขอนแก่น":       ["เมืองขอนแก่น", "บ้านฝาง"],
  "นครราชสีมา":    ["เมืองนครราชสีมา", "ปักธงชัย"],
  "สงขลา":         ["เมืองสงขลา", "หาดใหญ่"],
};

// ---- Mock Table Data ----
// projectId ตรงกับ project_id จาก DB (12–20)
const MOCK_ROWS: Omit<TableRow, "id" | "selected">[] = [
    // กรุงเทพ - คลองสาน
    { branchCode: "BKK-001", functionalName: "FL-BKK-KS-001", projectName: "โครงการพัฒนาระบบบริหารงานช่างภาคสนาม",                          projectId: "12", startDate: "01/04/2568", endDate: "30/06/2568", sla: "4 ชม.", wbs: "WBS-001", province: "กรุงเทพมหานคร", district: "คลองสาน",      location: "อาคาร A ชั้น 3 ถ.เจริญนคร",        teleport: "TP-001", equipmentNo: "EQ-BKK-001" },
    { branchCode: "BKK-002", functionalName: "FL-BKK-KS-002", projectName: "โครงการระบบติดตามงานซ่อมบำรุงโครงข่าย",                         projectId: "13", startDate: "15/04/2568", endDate: "15/07/2568", sla: "4 ชม.", wbs: "WBS-002", province: "กรุงเทพมหานคร", district: "คลองสาน",      location: "อาคาร B ถ.สมเด็จเจ้าพระยา",        teleport: "TP-002", equipmentNo: "EQ-BKK-002" },
    { branchCode: "BKK-018", functionalName: "FL-BKK-KS-003", projectName: "โครงการพัฒนาระบบบริหารงานช่างภาคสนาม", projectId: "31", startDate: "01/05/2568", endDate: "31/07/2568", sla: "4 ชม.", wbs: "WBS-027", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.เจริญนคร ซอย 10", teleport: "TP-027", equipmentNo: "EQ-BKK-018" },
    { branchCode: "BKK-019", functionalName: "FL-BKK-KS-004", projectName: "โครงการระบบติดตามงานซ่อมบำรุงโครงข่าย", projectId: "32", startDate: "05/05/2568", endDate: "05/08/2568", sla: "4 ชม.", wbs: "WBS-028", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.ลาดหญ้า", teleport: "TP-028", equipmentNo: "EQ-BKK-019" },
    { branchCode: "BKK-020", functionalName: "FL-BKK-KS-005", projectName: "โครงการบริหารจัดการงานติดตั้งและซ่อมบำรุงภาคสนาม", projectId: "33", startDate: "10/05/2568", endDate: "10/09/2568", sla: "4 ชม.", wbs: "WBS-029", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ซ.สมเด็จเจ้าพระยา 15", teleport: "TP-029", equipmentNo: "EQ-BKK-020" },
    { branchCode: "BKK-021", functionalName: "FL-BKK-KS-006", projectName: "โครงการระบบควบคุมและติดตามงานช่าง NOC", projectId: "34", startDate: "15/05/2568", endDate: "15/10/2568", sla: "4 ชม.", wbs: "WBS-030", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.ประชาธิปก", teleport: "TP-030", equipmentNo: "EQ-BKK-021" },
    { branchCode: "BKK-022", functionalName: "FL-BKK-KS-007", projectName: "โครงการพัฒนาระบบแจ้งเหตุและมอบหมายงานช่าง", projectId: "35", startDate: "01/06/2568", endDate: "30/11/2568", sla: "4 ชม.", wbs: "WBS-031", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.อิสรภาพ", teleport: "TP-031", equipmentNo: "EQ-BKK-022" },
    { branchCode: "BKK-023", functionalName: "FL-BKK-KS-008", projectName: "โครงการเพิ่มประสิทธิภาพงานบริการภาคสนาม", projectId: "36", startDate: "10/06/2568", endDate: "10/12/2568", sla: "4 ชม.", wbs: "WBS-032", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ซ.เจริญนคร 20", teleport: "TP-032", equipmentNo: "EQ-BKK-023" },
    { branchCode: "BKK-024", functionalName: "FL-BKK-KS-009", projectName: "โครงการระบบบริหารจัดการใบงานช่าง", projectId: "37", startDate: "01/07/2568", endDate: "31/12/2568", sla: "4 ชม.", wbs: "WBS-033", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.ตากสิน", teleport: "TP-033", equipmentNo: "EQ-BKK-024" },
    { branchCode: "BKK-025", functionalName: "FL-BKK-KS-010", projectName: "โครงการศูนย์ควบคุมงานบริการ", projectId: "38", startDate: "15/07/2568", endDate: "15/01/2569", sla: "4 ชม.", wbs: "WBS-034", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ซ.ลาดหญ้า 5", teleport: "TP-034", equipmentNo: "EQ-BKK-025" },
    { branchCode: "BKK-026", functionalName: "FL-BKK-KS-011", projectName: "โครงการระบบแจ้งเตือนงานซ่อม", projectId: "39", startDate: "01/08/2568", endDate: "28/02/2569", sla: "4 ชม.", wbs: "WBS-035", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ถ.กรุงธนบุรี", teleport: "TP-035", equipmentNo: "EQ-BKK-026" },
    { branchCode: "BKK-027", functionalName: "FL-BKK-KS-012", projectName: "โครงการพัฒนาระบบ Field Service", projectId: "40", startDate: "10/08/2568", endDate: "10/03/2569", sla: "4 ชม.", wbs: "WBS-036", province: "กรุงเทพมหานคร", district: "คลองสาน", location: "ซ.เจริญนคร 30", teleport: "TP-036", equipmentNo: "EQ-BKK-027" },
    // กรุงเทพ - บางรัก
    { branchCode: "BKK-003", functionalName: "FL-BKK-BR-001", projectName: "โครงการบริหารจัดการงานติดตั้งและซ่อมบำรุงภาคสนาม",              projectId: "14", startDate: "01/05/2568", endDate: "31/08/2568", sla: "4 ชม.", wbs: "WBS-003", province: "กรุงเทพมหานคร", district: "บางรัก",       location: "ถ.สีลม แขวงสีลม",                  teleport: "TP-003", equipmentNo: "EQ-BKK-003" },
    { branchCode: "BKK-004", functionalName: "FL-BKK-BR-002", projectName: "โครงการระบบควบคุมและติดตามงานช่าง NOC",                         projectId: "15", startDate: "01/05/2568", endDate: "30/09/2568", sla: "4 ชม.", wbs: "WBS-004", province: "กรุงเทพมหานคร", district: "บางรัก",       location: "ถ.สุรวงศ์ แขวงบางรัก",             teleport: "TP-004", equipmentNo: "EQ-BKK-004" },
    // กรุงเทพ - สาทร
    { branchCode: "BKK-005", functionalName: "FL-BKK-ST-001", projectName: "โครงการพัฒนาระบบแจ้งเหตุและมอบหมายงานช่าง",                    projectId: "16", startDate: "10/04/2568", endDate: "10/10/2568", sla: "4 ชม.", wbs: "WBS-005", province: "กรุงเทพมหานคร", district: "สาทร",         location: "ถ.สาทรเหนือ",                       teleport: "TP-005", equipmentNo: "EQ-BKK-005" },
    // กรุงเทพ - ดอนเมือง
    { branchCode: "BKK-006", functionalName: "FL-BKK-DM-001", projectName: "โครงการเพิ่มประสิทธิภาพงานบริการภาคสนาม",                      projectId: "17", startDate: "01/06/2568", endDate: "30/11/2568", sla: "4 ชม.", wbs: "WBS-006", province: "กรุงเทพมหานคร", district: "ดอนเมือง",     location: "ถ.วิภาวดีรังสิต",                  teleport: "TP-006", equipmentNo: "EQ-BKK-006" },
    // กรุงเทพ - ลาดกระบัง
    { branchCode: "BKK-007", functionalName: "FL-BKK-LK-001", projectName: "โครงการระบบบริหารจัดการใบงานช่าง (Work Order Management)",      projectId: "18", startDate: "01/07/2568", endDate: "31/12/2568", sla: "4 ชม.", wbs: "WBS-007", province: "กรุงเทพมหานคร", district: "ลาดกระบัง",   location: "นิคมอุตสาหกรรมลาดกระบัง",          teleport: "TP-007", equipmentNo: "EQ-BKK-007" },
    // เชียงใหม่
    { branchCode: "CNX-001", functionalName: "FL-CNX-MC-001", projectName: "โครงการยกระดับการปฏิบัติงานช่างโครงข่าย",                       projectId: "19", startDate: "01/04/2568", endDate: "30/09/2568", sla: "4 ชม.", wbs: "WBS-008", province: "เชียงใหม่",       district: "เมืองเชียงใหม่", location: "ถ.นิมมานเหมินทร์",            teleport: "TP-008", equipmentNo: "EQ-CNX-001" },
    { branchCode: "CNX-002", functionalName: "FL-CNX-ST-001", projectName: "โครงการศูนย์ควบคุมงานบริการและซ่อมบำรุง",                       projectId: "20", startDate: "15/05/2568", endDate: "15/11/2568", sla: "4 ชม.", wbs: "WBS-009", province: "เชียงใหม่",       district: "สันทราย",         location: "ถ.เชียงใหม่-พร้าว",            teleport: "TP-009", equipmentNo: "EQ-CNX-002" },
    { branchCode: "CNX-003", functionalName: "FL-CNX-HD-001", projectName: "โครงการพัฒนาระบบบริหารงานช่างภาคสนาม",                          projectId: "12", startDate: "01/06/2568", endDate: "31/12/2568", sla: "4 ชม.", wbs: "WBS-010", province: "เชียงใหม่",       district: "หางดง",           location: "ถ.เชียงใหม่-หางดง",            teleport: "TP-010", equipmentNo: "EQ-CNX-003" },
    // ขอนแก่น
    { branchCode: "KKN-001", functionalName: "FL-KKN-MK-001", projectName: "โครงการระบบติดตามงานซ่อมบำรุงโครงข่าย",                         projectId: "13", startDate: "01/04/2568", endDate: "30/06/2568", sla: "4 ชม.", wbs: "WBS-011", province: "ขอนแก่น",         district: "เมืองขอนแก่น",   location: "ถ.มิตรภาพ",                    teleport: "TP-011", equipmentNo: "EQ-KKN-001" },
    { branchCode: "KKN-002", functionalName: "FL-KKN-BF-001", projectName: "โครงการบริหารจัดการงานติดตั้งและซ่อมบำรุงภาคสนาม",              projectId: "14", startDate: "15/04/2568", endDate: "15/10/2568", sla: "4 ชม.", wbs: "WBS-012", province: "ขอนแก่น",         district: "บ้านฝาง",         location: "ถ.บ้านฝาง-พระลับ",             teleport: "TP-012", equipmentNo: "EQ-KKN-002" },
    // นครราชสีมา
    { branchCode: "NMA-001", functionalName: "FL-NMA-MN-001", projectName: "โครงการระบบควบคุมและติดตามงานช่าง NOC",                         projectId: "15", startDate: "01/05/2568", endDate: "31/10/2568", sla: "4 ชม.", wbs: "WBS-013", province: "นครราชสีมา",     district: "เมืองนครราชสีมา", location: "ถ.มิตรภาพ โคราช",             teleport: "TP-013", equipmentNo: "EQ-NMA-001" },
    { branchCode: "NMA-002", functionalName: "FL-NMA-PK-001", projectName: "โครงการพัฒนาระบบแจ้งเหตุและมอบหมายงานช่าง",                    projectId: "16", startDate: "01/06/2568", endDate: "30/11/2568", sla: "4 ชม.", wbs: "WBS-014", province: "นครราชสีมา",     district: "ปักธงชัย",        location: "ถ.ปักธงชัย-โชคชัย",           teleport: "TP-014", equipmentNo: "EQ-NMA-002" },
    // สงขลา
    { branchCode: "SKL-001", functionalName: "FL-SKL-MS-001", projectName: "โครงการเพิ่มประสิทธิภาพงานบริการภาคสนาม",                      projectId: "17", startDate: "01/04/2568", endDate: "30/09/2568", sla: "4 ชม.", wbs: "WBS-015", province: "สงขลา",           district: "เมืองสงขลา",     location: "ถ.ไทรบุรี",                    teleport: "TP-015", equipmentNo: "EQ-SKL-001" },
    { branchCode: "SKL-002", functionalName: "FL-SKL-HY-001", projectName: "โครงการระบบบริหารจัดการใบงานช่าง (Work Order Management)",      projectId: "18", startDate: "15/05/2568", endDate: "15/12/2568", sla: "4 ชม.", wbs: "WBS-016", province: "สงขลา",           district: "หาดใหญ่",         location: "ถ.เพชรเกษม หาดใหญ่",          teleport: "TP-016", equipmentNo: "EQ-SKL-002" },
];

const TABLE_COLUMNS = [
  "ลำดับ", "เลือก", "รหัสสาขา", "ชื่อ Functional",
  "ชื่อโครงการ", "วันเวลาเริ่มต้น", "วันเวลาเสร็จสิ้น",
  "SLA", "WBS", "ที่อยู่", "Teleport", "หมายเลขเครื่องวิทยุ",
];

export default function NocOpenJobPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    jobType: "Job",
    province: "",
    district: "",
    branch: "",
    project: "",
  });
  const [rows, setRows] = useState<TableRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);

  // ---- Projects from API ----
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(false);
      try {
        const res = await fetch("/api/noc/GetProject");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setProjects(data.projects ?? []);
      } catch {
        setProjectsError(true);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ---- Cascade district ----
  useEffect(() => {
    if (searchParams.province) {
      setDistricts(DISTRICTS[searchParams.province] || []);
      setSearchParams((prev) => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
    }
  }, [searchParams.province]);

  const handleChange = (field: keyof SearchParams, value: string) => {   
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Search: filter MOCK_ROWS ----
  const handleSearch = () => {
    setHasSearched(true);
    setCurrentPage(1);

    let filtered = MOCK_ROWS;

    if (searchParams.province) {
      filtered = filtered.filter((r) => r.province === searchParams.province);
    }
    if (searchParams.district) {
      filtered = filtered.filter((r) => r.district === searchParams.district);
    }
    if (searchParams.branch.trim()) {
      filtered = filtered.filter((r) =>
        r.branchCode.toLowerCase().includes(searchParams.branch.trim().toLowerCase())
      );
    }
    if (searchParams.project) {
      filtered = filtered.filter((r) => r.projectId === searchParams.project);
    }

    const result: TableRow[] = filtered.map((r, i) => ({
      ...r,
      id: i + 1,
      selected: false,
    }));

    setRows(result);
    setTotalRows(result.length);
  };

  const handleClear = () => {
    setSearchParams({ jobType: "Job", province: "", district: "", branch: "", project: "" });
    setRows([]);
    setTotalRows(0);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const toggleRow = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  // ---- Pagination ----
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const pagedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // ---- Shared styles ----
  const labelCls = "block text-xs font-medium text-white/90 mb-1.5";
  const selectCls =
    "w-full h-[38px] bg-white rounded-md px-3 text-sm text-gray-800 border-0 outline-none focus:ring-2 focus:ring-white/50";
  const inputCls =
    "w-full h-[38px] bg-white rounded-md px-3 text-sm text-gray-800 border-0 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Top Header ── */}
      <div className="bg-orange-500 h-14 flex items-center justify-end px-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white text-xs font-medium">
            สจ
          </div>
          <div className="text-white text-right leading-tight">
            <div className="text-sm font-medium">สุจิตรา หุ่นงาม</div>
            <div className="text-xs text-white/75">administrator</div>
          </div>
        </div>
      </div>

      {/* ── Blue Search Panel ── */}
      <div
        className="w-full px-10 py-8"
        style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span className="text-white font-medium">NOC</span>
          <span className="text-white/50">›</span>
          <span className="text-white font-medium">Search</span>
          <span className="text-white/50">›</span>
          <span className="bg-white/15 text-white px-2 py-0.5 rounded text-xs">
            Functional Location
          </span>
          <div className="ml-auto flex items-center gap-1 text-white/60 text-xs">
            <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[10px]">i</span>
            NOC-01-01
          </div>
        </div>

        {/* Row 1: 4 equal columns */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* ประเภทงาน */}
          <div>
            <label className={labelCls}>
              ประเภทงาน <span className="text-yellow-300">*</span>
            </label>
            <select
              value={searchParams.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              className={selectCls}
            >
              <option value="Job">Job</option>
              <option value="Task">Task</option>
              <option value="Project">Project</option>
            </select>
          </div>

          {/* จังหวัด */}
          <div>
            <label className={labelCls}>
              จังหวัด <span className="text-yellow-300">*</span>
            </label>
            <select
              value={searchParams.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className={selectCls}
            >
              <option value="">เลือกจังหวัด</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* อำเภอ */}
          <div>
            <label className={labelCls}>อำเภอ</label>
            <select
              value={searchParams.district}
              onChange={(e) => handleChange("district", e.target.value)}
              disabled={!searchParams.province}
              className={selectCls}
              style={{
                backgroundColor: searchParams.province ? "white" : "#cbd5e1",
                color: searchParams.province ? "#1e293b" : "#64748b",
              }}
            >
              <option value="">เลือกอำเภอ</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* สาขา */}
          <div>
            <label className={labelCls}>สาขา</label>
            <input
              type="text"
              placeholder="ระบุรหัสสาขา เช่น BKK-001"
              value={searchParams.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 2: โครงการ + buttons */}
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className={labelCls}>โครงการ</label>
            <select
              value={searchParams.project}
              onChange={(e) => handleChange("project", e.target.value)}
              disabled={projectsLoading}
              className={selectCls}
              style={projectsLoading ? { backgroundColor: "#cbd5e1", color: "#64748b" } : {}}
            >
              <option value="">
                {projectsLoading ? "กำลังโหลด..." : projectsError ? "โหลดข้อมูลไม่สำเร็จ" : "เลือกโครงการ"}
              </option>
              {projects.map((p) => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2" />

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="h-[38px] flex-1 rounded-md border border-white/40 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              ล้าง
            </button>
            <button
              onClick={handleSearch}
              className="h-[38px] flex-1 rounded-md bg-white text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              ค้นหา
            </button>
          </div>
        </div>
      </div>

      {/* ── Results Table ── */}
      <div className="px-10 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">ผลการค้นหา</span>
            <span className="text-xs text-gray-400">Total Rows: {totalRows}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 whitespace-nowrap border-b border-gray-100"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center">
                      <div className="text-3xl mb-2 opacity-20">⊘</div>
                      <p className="text-sm text-gray-400">
                        {hasSearched
                          ? "ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่ระบุ"
                          : "กรุณาระบุเงื่อนไขและกดค้นหา"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-50 transition-colors ${
                        row.selected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-3 py-2.5 text-gray-400 text-xs">{row.id}</td>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleRow(row.id)}
                          className="cursor-pointer accent-blue-600"
                        />
                      </td>
                      <td className="px-3 py-2.5 font-medium text-blue-700">{row.branchCode}</td>
                      <td className="px-3 py-2.5">{row.functionalName}</td>
                      <td className="px-3 py-2.5 max-w-[220px] truncate" title={row.projectName}>
                        {row.projectName}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{row.startDate}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{row.endDate}</td>
                      <td className="px-3 py-2.5">
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                          {row.sla}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">{row.wbs}</td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate" title={row.location}>
                        {row.location}
                      </td>
                      <td className="px-3 py-2.5">{row.teleport}</td>
                      <td className="px-3 py-2.5">{row.equipmentNo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Total Rows: {totalRows}</span>
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none bg-white"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-gray-400">หน้า {currentPage} / {totalPages}</span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { label: "«", action: () => setCurrentPage(1),                                          disabled: currentPage === 1 },
                { label: "‹", action: () => setCurrentPage((p) => Math.max(1, p - 1)),                 disabled: currentPage === 1 },
                { label: "›", action: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),        disabled: currentPage === totalPages },
                { label: "»", action: () => setCurrentPage(totalPages),                                 disabled: currentPage === totalPages },
              ].map(({ label, action, disabled }) => (
                <button
                  key={label}
                  onClick={action}
                  disabled={disabled}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}