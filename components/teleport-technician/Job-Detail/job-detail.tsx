"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

// ─── Interfaces ────────────────────────────────────────────────────────────────

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

interface ServiceRecordForm {
  departDateTime: string;
  arriveDateTime: string;
  operation: string;
  slaReason: string;
  samart: string;
  naturalDisaster: string;
  customer: string;
  other: string;
  serviceNote: string;
}

interface CustomerInfoForm {
  arriveDateTime: string;
  customerName: string;
  grade: string;
  phone: string;
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

// ─── Shared Select Component (from backend options) ────────────────────────────

function Select({
  label,
  name,
  onChange,
  options = [],
  valueKey = "id",
  labelKey = "name",
  required = false,
  disabled = false, // เพิ่ม prop นี้
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: any[];
  valueKey?: string;
  labelKey?: string;
  required?: boolean;
  disabled?: boolean; // เพิ่ม type นี้
}) {
  return (
    <div>
      <label className="text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        onChange={onChange}
        required={required}
        disabled={disabled} // เพิ่ม disabled
        className={`w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "bg-white"
        }`}
      >
        <option value="">--- กรุณาเลือก ---</option>
        {options.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── DateTimePicker Component (no seconds) ─────────────────────────────────────

function DateTimePicker({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false, // เพิ่ม prop นี้
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean; // เพิ่ม type นี้
}) {
  return (
    <div>
      <label className="block text-xl text-black mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={onChange}
        step="60"
        required={required}
        disabled={disabled} // เพิ่ม disabled
        className={`w-full h-9 border border-gray-300 rounded px-3 text-base outline-none ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-white focus:border-blue-400"
        }`}
      />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function JobDetail() {
  // Form state
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

  const [serviceForm, setServiceForm] = useState<ServiceRecordForm>({
    departDateTime: "",
    arriveDateTime: "",
    operation: "",
    slaReason: "",
    samart: "",
    naturalDisaster: "",
    customer: "",
    other: "",
    serviceNote: "",
  });

  const [customerForm, setCustomerForm] = useState<CustomerInfoForm>({
    arriveDateTime: "",
    customerName: "",
    grade: "",
    phone: "",
  });

  // Page state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isJobAccepted, setIsJobAccepted] = useState<boolean>(false);

  // Dropdown options fetched from backend
  const [operationOptions, setOperationOptions] = useState<any[]>([]);
  const [slaReasonOptions, setSlaReasonOptions] = useState<any[]>([]);
  const [samartOptions, setSamartOptions] = useState<any[]>([]);
  const [naturalDisasterOptions, setNaturalDisasterOptions] = useState<any[]>(
    [],
  );
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [otherOptions, setOtherOptions] = useState<any[]>([]);
  const [gradeOptions, setGradeOptions] = useState<any[]>([]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

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

  // ─── Fetch job data ──────────────────────────────────────────────────────────

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

  // ─── Fetch all dropdown options in parallel ──────────────────────────────────
  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const [ops, sla, samart, disaster, customers, others, grades] =
  //         await Promise.all([
  //           fetch("/api/options/operations").then((r) => r.json()),
  //           fetch("/api/options/sla-reasons").then((r) => r.json()),
  //           fetch("/api/options/samart").then((r) => r.json()),
  //           fetch("/api/options/natural-disasters").then((r) => r.json()),
  //           fetch("/api/options/customers").then((r) => r.json()),
  //           fetch("/api/options/others").then((r) => r.json()),
  //           fetch("/api/options/grades").then((r) => r.json()),
  //         ]);
  //       setOperationOptions(ops);
  //       setSlaReasonOptions(sla);
  //       setSamartOptions(samart);
  //       setNaturalDisasterOptions(disaster);
  //       setCustomerOptions(customers);
  //       setOtherOptions(others);
  //       setGradeOptions(grades);
  //     } catch (err) {
  //       console.error("Error fetching dropdown options:", err);
  //     }
  //   };
  //   fetchOptions();
  // }, []);

  // แทนที่ useEffect fetchOptions เดิม
  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const res = await fetch("/api/options");
  //       if (!res.ok) throw new Error("fetch options failed");
  //       const data = await res.json();

  //       setOperationOptions(data.operations);
  //       setSlaReasonOptions(data.slaReasons);
  //       setSamartOptions(data.samart);
  //       setNaturalDisasterOptions(data.naturalDisasters);
  //       setCustomerOptions(data.customerCauses);
  //       setOtherOptions(data.otherCauses);
  //       setGradeOptions(data.grades);
  //     } catch (err) {
  //       console.error("Error fetching dropdown options:", err);
  //     }
  //   };
  //   fetchOptions();
  // }, []);

  // ── State ──────────────────────────────────────────────
  const [options, setOptions] = useState({
    operations: [],
    slaReasons: [],
    samart: [],
    naturalDisasters: [],
    customerCauses: [],
    otherCauses: [],
    grades: [],
  });

  // ── useEffect: fetch ครั้งเดียว ─────────────────────────
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/noc/options");
        if (!res.ok) throw new Error("fetch options failed");
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };
    fetchOptions();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleJobChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => window.history.back();

  const handleConfirm = () => {
    console.log("Confirm clicked", jobForm);
    setIsJobAccepted(true);
  };

  const handleSave = async () => {
    if (!serviceForm.departDateTime || !serviceForm.arriveDateTime) {
      alert("กรุณากรอกวันเวลาที่ออกเดินทาง และวันเวลาที่ถึงลูกค้า");
      return;
    }
    if (!customerForm.customerName || !customerForm.phone) {
      alert("กรุณากรอกชื่อลูกค้า และเบอร์โทรศัพท์");
      return;
    }

    try {
      const res = await fetch("/api/service-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobForm.jobNumber, // STW format → API จะ resolve เอง
          departDateTime: serviceForm.departDateTime,
          arriveDateTime: serviceForm.arriveDateTime,
          operationId: serviceForm.operation,
          slaReasonId: serviceForm.slaReason,
          samartId: serviceForm.samart,
          disasterId: serviceForm.naturalDisaster,
          customerCauseId: serviceForm.customer,
          otherCauseId: serviceForm.other,
          serviceNote: serviceForm.serviceNote,
          customerArriveDateTime: customerForm.arriveDateTime,
          customerName: customerForm.customerName,
          gradeId: customerForm.grade,
          phone: customerForm.phone,
          createdBy: "สุจิตรา",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      alert("บันทึกสำเร็จ 🎉");
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleServiceCancel = () => {
    setServiceForm({
      departDateTime: "",
      arriveDateTime: "",
      operation: "",
      slaReason: "",
      samart: "",
      naturalDisaster: "",
      customer: "",
      other: "",
      serviceNote: "",
    });
    setCustomerForm({
      arriveDateTime: "",
      customerName: "",
      grade: "",
      phone: "",
    });
  };

  // ─── Style helpers ───────────────────────────────────────────────────────────

  const labelClass = "block text-xl text-black mb-1";
  const inputClass =
    "w-full h-9 border border-gray-300 rounded px-3 text-base outline-none focus:border-blue-400 bg-white";

  const RequiredStar = () => <span className="text-red-500 ml-0.5">*</span>;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-orange-500 h-16 flex items-center px-6 text-white">
        <div className="w-full flex items-center justify-between px-8">
          <div />
          <div className="flex items-center gap-4">
            <Image
              src="/images/icons8-life-cycle-50.png"
              alt="life-cycle"
              width={40}
              height={40}
            />
            <div className="text-right leading-tight">
              <div className="text-lg font-medium">สุจิตรา หุ่นงาม</div>
              <div className="text-sm opacity-90">administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Breadcrumb */}
        <div className="bg-blue-900 px-6 py-3 rounded-md mb-3">
          <span className="text-white text-2xl font-semibold">
            Job Monitor &gt; Job Detail
          </span>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-7 mb-4 text-center">
            <div className="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-7 mb-4">
            <div className="text-xl text-red-600">เกิดข้อผิดพลาด: {error}</div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Job Detail Card ──────────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl p-7 mb-4">
              <h2 className="text-3xl font-semibold text-black mb-6">
                รายละเอียดงาน
              </h2>
              <div className="grid grid-cols-3 gap-x-10">
                {/* Col 1 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className={labelClass}>เลขที่งาน</label>
                    <input
                      name="jobNumber"
                      value={jobForm.jobNumber}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>โครงการ</label>
                    <input
                      name="project"
                      value={jobForm.project}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>รายละเอียดปัญหา</label>
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
                    <label className={labelClass}>การแก้ไข (Noc)</label>
                    <input
                      name="nocFix"
                      value={jobForm.nocFix}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                </div>
                {/* Col 2 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className={labelClass}>วันเวลาที่เปิด</label>
                    <input
                      name="openDateTime"
                      value={jobForm.openDateTime}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>สาขา</label>
                    <input
                      name="branchName"
                      value={jobForm.branchName}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ประเภทงาน</label>
                    <input
                      name="jobType"
                      value={jobForm.jobType}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ความสำคัญ</label>
                    <input
                      name="priority"
                      value={jobForm.priority}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                </div>
                {/* Col 3 */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className={labelClass}>วันเวลาที่ต้องปิด</label>
                    <input
                      name="closeDateTime"
                      value={jobForm.closeDateTime}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ที่ตั้ง</label>
                    <input
                      name="location"
                      value={jobForm.location}
                      onChange={handleJobChange}
                      className={inputClass}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Action Buttons ───────────────────────────────────────────────── */}
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

            {/* ── Bottom Section ───────────────────────────────────────────────── */}
            <div className="flex gap-4 items-start">
              {/* บันทึกการให้บริการ */}
              <div className="bg-white rounded-3xl p-7 flex-1 border border-gray-200">
                <h2 className="text-3xl font-semibold text-black mb-6">
                  บันทึกการให้บริการ
                </h2>

                {/* Row 1: วันเวลาที่ออกเดินทาง + วันเวลาที่ถึงลูกค้า */}
                <div className="grid grid-cols-2 gap-6 mb-5">
                  <DateTimePicker
                    label="วันเวลาที่ออกเดินทาง"
                    name="departDateTime"
                    value={serviceForm.departDateTime}
                    onChange={handleServiceChange}
                    required
                    disabled={!isJobAccepted}
                  />
                  <DateTimePicker
                    label="วันเวลาที่ถึงลูกค้า"
                    name="arriveDateTime"
                    value={serviceForm.arriveDateTime}
                    onChange={handleServiceChange}
                    required
                    disabled={!isJobAccepted}
                  />
                </div>

                {/* Row 2: ดำเนินการ + สาเหตุที่เกิน SLA */}
                <div className="grid grid-cols-2 gap-6 mb-5">
                  <Select
                    label="ดำเนินการ"
                    name="operation"
                    onChange={handleServiceChange}
                    options={options.operations}
                    valueKey="operation_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />
                  {/* สาเหตุที่เกิน SLA */}
                  <Select
                    label="สาเหตุที่เกิน SLA"
                    name="slaReason"
                    onChange={handleServiceChange}
                    options={options.slaReasons}
                    valueKey="sla_reason_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />
                </div>

                {/* Row 3: Samart + ภัยธรรมชาติ */}
                <div className="grid grid-cols-2 gap-6 mb-5">
                  {/* Samart */}
                  <Select
                    label="Samart"
                    name="samart"
                    onChange={handleServiceChange}
                    options={options.samart}
                    valueKey="samart_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />

                  {/* ภัยธรรมชาติ */}
                  <Select
                    label="ภัยธรรมชาติ"
                    name="naturalDisaster"
                    onChange={handleServiceChange}
                    options={options.naturalDisasters}
                    valueKey="disaster_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />
                </div>

                {/* Row 4: ลูกค้า + อื่นๆ */}
                <div className="grid grid-cols-2 gap-6 mb-5">
                  <Select
                    label="ลูกค้า"
                    name="customer"
                    onChange={handleServiceChange}
                    options={options.customerCauses}
                    valueKey="customer_cause_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />

                  {/* อื่นๆ */}
                  <Select
                    label="อื่นๆ"
                    name="other"
                    onChange={handleServiceChange}
                    options={options.otherCauses}
                    valueKey="other_cause_id"
                    labelKey="name"
                    disabled={!isJobAccepted}
                    required
                  />
                </div>

                {/* การให้บริการ */}
                <div>
                  <label className={labelClass}>
                    การให้บริการ <RequiredStar />
                  </label>
                  <textarea
                    name="serviceNote"
                    value={serviceForm.serviceNote}
                    onChange={handleServiceChange}
                    rows={4}
                    disabled={!isJobAccepted}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-base outline-none resize-none focus:border-blue-400 bg-white"
                  />
                </div>
              </div>

              {/* ข้อมูลลูกค้า */}
              <div className="bg-white rounded-xl p-7 w-80 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-black mb-6">
                    ข้อมูลลูกค้า
                  </h2>
                  <div className="flex flex-col gap-5">
                    <DateTimePicker
                      label="วันเวลาที่ถึงลูกค้า"
                      name="arriveDateTime"
                      value={customerForm.arriveDateTime}
                      onChange={handleCustomerChange}
                      disabled={!isJobAccepted}
                      required
                    />

                    <div>
                      <label className={labelClass}>
                        ชื่อลูกค้า <RequiredStar />
                      </label>
                      <input
                        name="customerName"
                        value={customerForm.customerName}
                        onChange={handleCustomerChange}
                        className={inputClass}
                        disabled={!isJobAccepted}
                      />
                    </div>

                    {/* เกรด — ใช้ Select component จากหลังบ้าน */}
                    <Select
                      label="เกรด"
                      name="grade"
                      onChange={handleCustomerChange}
                      options={options.grades}
                      valueKey="grade_id"
                      labelKey="name"
                      disabled={!isJobAccepted}
                      required
                    />

                    <div>
                      <label className={labelClass}>
                        เบอร์โทรศัพท์ <RequiredStar />
                      </label>
                      <input
                        name="phone"
                        value={customerForm.phone}
                        onChange={handleCustomerChange}
                        className={inputClass}
                        type="tel"
                        disabled={!isJobAccepted}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
              >
                ยกเลิก
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
