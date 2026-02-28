"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AssignedTechnician {
  id: number;
  responsible: string;
}

interface JobDetailForm {
  jobNumber: string;
  project: string;
  problemDetail: string;
  nocFix: string;
  openDateTime: string;
  closeDateTime: string;
  location: string;
  branchName: string;
  jobType: string;
  priority: string;
}

interface AssignmentForm {
  teleport: string;
  responsible: string;
  licensePlate: string;
}

interface JobDetailResponse {
  job_id: number;
  job_no: string;
  service_no: string;
  open_datetime: string;
  required_close_datetime: string;
  receive_datetime: string | null;
  actual_close_datetime: string | null;
  project_name: string;
  customer_name: string;
  location: string;
  sla_name: string;
  reporter_name: string;
  reporter_phone: string;
  job_type_name: string;
  problem_detail: string;
  operation_type: string | null;
  priority: string;
  breakdown_type_name: string | null;
  status_name: string;
  status_sla_name: string | null;
  repair_note: string | null;
  job_status: string | null;
  status_reason: string | null;
  cause_samart: string | null;
  cause_activity: string | null;
  cause_customer: string | null;
  cause_other: string | null;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string | null;
}

interface TeleportOption {
  teleport_id: number;
  teleport_name: string;
  province: string;
}

interface PersonOption {
  person_id: number;
  full_name: string;
  nickname: string;
  teleport_id: number;
}

interface VehicleOption {
  vehicle_id: number;
  license_plate: string;
  vehicle_type: string;
  teleport_id: number;
}

export default function JobDetail() {
  const router = useRouter()

  const [jobForm, setJobForm] = useState<JobDetailForm>({
    jobNumber: "",
    project: "",
    problemDetail: "",
    nocFix: "",
    openDateTime: "",
    closeDateTime: "",
    location: "",
    branchName: "",
    jobType: "",
    priority: "",
  });

  const [assignForm, setAssignForm] = useState<AssignmentForm>({
    teleport: "",
    responsible: "",
    licensePlate: "",
  });

  // เปลี่ยนจาก const เป็น state ที่ set ได้
  const [assignedList, setAssignedList] = useState<AssignedTechnician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isJobAccepted, setIsJobAccepted] = useState<boolean>(false);

  // Dropdown states
  const [teleports, setTeleports] = useState<TeleportOption[]>([]);
  const [persons, setPersons] = useState<PersonOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);

  // Filter ตาม teleport ที่เลือก
  const filteredPersons = persons.filter(
    (p) =>
      !assignForm.teleport || p.teleport_id === Number(assignForm.teleport),
  );
  const filteredVehicles = vehicles.filter(
    (v) =>
      !assignForm.teleport || v.teleport_id === Number(assignForm.teleport),
  );

  const formatDateTime = (isoDate: string | null): string => {
    if (!isoDate) return "";
    try {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  // ดึงข้อมูลงานล่าสุด
  useEffect(() => {
    const fetchLatestJob = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/jobs/latest");
        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
        const data: JobDetailResponse = await response.json();
        setJobForm({
          jobNumber: data.job_no || "",
          project: data.project_name || "",
          problemDetail: data.problem_detail || "",
          nocFix: data.repair_note || "",
          openDateTime: formatDateTime(data.open_datetime),
          closeDateTime: formatDateTime(data.required_close_datetime),
          location: data.location || "",
          branchName: data.customer_name || "",
          jobType: data.job_type_name || "",
          priority: data.priority || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        console.error("Error fetching job data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJob();
  }, []);

  // ดึง dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/noc/options");
        if (!res.ok) return;
        const data = await res.json();
        setTeleports(data.teleports || []);
        setPersons(data.persons || []);
        setVehicles(data.vehicles || []);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleJobChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // เมื่อเปลี่ยน teleport ให้ reset responsible และ licensePlate
  const handleAssignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "teleport") {
      setAssignForm({ teleport: value, responsible: "", licensePlate: "" });
    } else {
      setAssignForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleConfirm = () => {
    console.log("Confirm clicked", jobForm);
    setIsJobAccepted(true);
  };

  // ===== ฟังก์ชัน Add ผู้รับผิดชอบลงตาราง =====
  const handleAdd = () => {
    // ต้องเลือกผู้รับผิดชอบก่อน
    if (!assignForm.responsible) return;

    // จำกัดไม่เกิน 5 คน
    if (assignedList.length >= 5) return;

    // หาชื่อจาก persons
    const person = persons.find(
      (p) => p.person_id === Number(assignForm.responsible),
    );
    if (!person) return;

    const fullLabel = person.full_name + (person.nickname ? ` (${person.nickname})` : "");

    // ป้องกันเพิ่มคนซ้ำ
    const alreadyAdded = assignedList.some(
      (item) => item.id === person.person_id,
    );
    if (alreadyAdded) return;

    setAssignedList((prev) => [
      ...prev,
      { id: person.person_id, responsible: fullLabel },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header - Orange */}
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

      {/* Main Content */}
      <div className="p-5">
        {/* Sub Header */}
        <div className="bg-blue-900 px-6 py-3 rounded-md">
          <span className="text-white text-2xl font-semibold mb-6">
            Job Monitor &gt; Job Detail
          </span>
        </div>

        <div className="p-3"></div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-7 mb-4 text-center">
            <div className="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-7 mb-4">
            <div className="text-xl text-red-600">เกิดข้อผิดพลาด: {error}</div>
          </div>
        )}

        {/* Job Detail Card */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-3xl p-7 mb-4">
              <h2 className="text-3xl font-semibold text-black mb-6">
                รายละเอียดงาน
              </h2>

              <div className="grid grid-cols-3 gap-x-10">
                {/* Column 1 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xl text-black mb-1">
                      เลขที่งาน
                    </label>
                    <input
                      name="jobNumber"
                      value={jobForm.jobNumber}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      โครงการ
                    </label>
                    <input
                      name="project"
                      value={jobForm.project}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      รายละเอียดปัญหา
                    </label>
                    <textarea
                      name="problemDetail"
                      value={jobForm.problemDetail}
                      onChange={handleJobChange}
                      rows={5}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base outline-none resize-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      การแก้ไข (Noc)
                    </label>
                    <input
                      name="nocFix"
                      value={jobForm.nocFix}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xl text-black mb-1">
                      วันเวลาที่เปิด
                    </label>
                    <input
                      name="openDateTime"
                      value={jobForm.openDateTime}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      สาขา
                    </label>
                    <input
                      name="branchName"
                      value={jobForm.branchName}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      ประเภทงาน
                    </label>
                    <input
                      name="jobType"
                      value={jobForm.jobType}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      ความสำคัญ
                    </label>
                    <input
                      name="priority"
                      value={jobForm.priority}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xl text-black mb-1">
                      วันเวลาที่ต้องปิด
                    </label>
                    <input
                      name="closeDateTime"
                      value={jobForm.closeDateTime}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-black mb-1">
                      ที่ตั้ง
                    </label>
                    <input
                      name="location"
                      value={jobForm.location}
                      onChange={handleJobChange}
                      className="w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="bg-white rounded-3xl px-7 py-5 flex items-center gap-4 mb-4">
              {!isJobAccepted && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-32 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-2xl rounded cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
              )}

              {!isJobAccepted ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-44 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-2xl rounded cursor-pointer transition-colors"
                >
                  ยืนยันรับงาน
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-2xl">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  รับงานเรียบร้อยแล้ว
                </div>
              )}
            </div>

            {/* Assign Technician Card */}
            <div className="bg-white rounded-3xl p-7 max-w-[1135px]">
              <h2 className="text-3xl font-semibold text-black mb-6">
                มอบหมายงานให้ช่าง
              </h2>

              {/* Teleport + ผู้รับผิดชอบ */}
              <div className="flex items-center gap-8 mb-5 flex-wrap">
                {/* Teleport */}
                <div className="flex items-center gap-3">
                  <label className="text-xl text-black whitespace-nowrap">
                    Teleport <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="teleport"
                      value={assignForm.teleport}
                      onChange={handleAssignChange}
                      disabled={!isJobAccepted}
                      className={`w-64 h-9 border border-gray-300 rounded px-3 pr-9 text-base appearance-none outline-none focus:border-blue-400 ${
                        !isJobAccepted
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "bg-white text-gray-700 cursor-pointer"
                      }`}
                    >
                      <option value="" disabled>
                        เลือก Teleport
                      </option>
                      {teleports.map((t) => (
                        <option key={t.teleport_id} value={t.teleport_id}>
                          {t.teleport_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown disabled={!isJobAccepted} />
                  </div>
                </div>

                {/* ผู้รับผิดชอบ */}
                <div className="flex items-center gap-3">
                  <label className="text-xl text-black whitespace-nowrap">
                    ผู้รับผิดชอบ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="responsible"
                      value={assignForm.responsible}
                      onChange={handleAssignChange}
                      disabled={!isJobAccepted || !assignForm.teleport}
                      className={`w-64 h-9 border border-gray-300 rounded px-3 pr-9 text-base appearance-none outline-none focus:border-blue-400 ${
                        !isJobAccepted || !assignForm.teleport
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "bg-white text-gray-700 cursor-pointer"
                      }`}
                    >
                      <option value="" disabled>
                        เลือก ผู้รับผิดชอบ
                      </option>
                      {filteredPersons.map((p) => (
                        <option key={p.person_id} value={p.person_id}>
                          {p.full_name}
                          {p.nickname ? ` (${p.nickname})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      disabled={!isJobAccepted || !assignForm.teleport}
                    />
                  </div>
                </div>
              </div>

              {/* ทะเบียนรถ */}
              <div className="flex items-center gap-3 mb-6">
                <label className="text-xl text-black whitespace-nowrap">
                  ทะเบียนรถ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="licensePlate"
                    value={assignForm.licensePlate}
                    onChange={handleAssignChange}
                    disabled={!isJobAccepted || !assignForm.teleport}
                    className={`w-64 h-9 border border-gray-300 rounded px-3 pr-9 text-base appearance-none outline-none focus:border-blue-400 ${
                      !isJobAccepted || !assignForm.teleport
                        ? "bg-gray-100 cursor-not-allowed text-gray-400"
                        : "bg-white text-gray-700 cursor-pointer"
                    }`}
                  >
                    <option value="" disabled>
                      เลือก ทะเบียนรถ
                    </option>
                    {filteredVehicles.map((v) => (
                      <option key={v.vehicle_id} value={v.vehicle_id}>
                        {v.license_plate}
                        {v.vehicle_type ? ` (${v.vehicle_type})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    disabled={!isJobAccepted || !assignForm.teleport}
                  />
                </div>
              </div>

              {/* Action Buttons: Add & Out Going */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={
                    !isJobAccepted ||
                    !assignForm.responsible ||
                    assignedList.length >= 5
                  }
                  className={`w-28 h-10 font-semibold text-xl rounded text-white transition-colors ${
                    isJobAccepted &&
                    assignForm.responsible &&
                    assignedList.length < 5
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-green-300 cursor-not-allowed"
                  }`}
                >
                  Add
                </button>
                <button
                  type="button"
                  disabled={!isJobAccepted}
                  onClick={() => router.push('/teleport-head')}
                  className={`w-38 h-10 font-semibold text-xl rounded text-white transition-colors ${
                    isJobAccepted
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  Out Going
                </button>
              </div>

              {/* Assigned Table */}
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 px-5 py-3 border-b border-gray-300 bg-gray-50">
                  <span className="text-gray-500 text-xl text-center">
                    ลำดับ
                  </span>
                  <span className="text-gray-500 text-xl text-center">
                    ผู้รับผิดชอบ
                  </span>
                </div>
                <div className="min-h-[80px] flex items-center justify-center">
                  {assignedList.length === 0 ? (
                    <span className="text-gray-500 text-base">No results.</span>
                  ) : (
                    <div className="w-full">
                      {assignedList.map((item, index) => (
                        <div
                          key={item.id}
                          className={`grid grid-cols-2 px-5 py-3 ${
                            index < assignedList.length - 1
                              ? "border-b border-gray-300"
                              : ""
                          } ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <span className="text-center text-base">
                            {index + 1}
                          </span>
                          <span className="text-center text-base">
                            {item.responsible}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* แสดงจำนวน */}
              {assignedList.length > 0 && (
                <p className="text-sm text-gray-400 mt-2 text-right">
                  {assignedList.length}/5 คน
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ disabled = false }: { disabled?: boolean }) {
  return (
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke={disabled ? "#d1d5db" : "#6b7280"}
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}