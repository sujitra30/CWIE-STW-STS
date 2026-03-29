"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

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
  remark: string;
}

interface EquipmentRecord {
  id: number;
  datetime: string;
  equipmentName: string;
  newSN: string;
  oldSN: string;
  symptom: string;
}

interface EquipmentForm {
  noChange: boolean;
  equipmentName: string;
  newSN: string;
  oldSN: string;
  symptom: string;
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

// ─── Shared Select Component ───────────────────────────────────────────────────

function Select({
  label,
  name,
  onChange,
  options = [],
  valueKey = "id",
  labelKey = "name",
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: any[];
  valueKey?: string;
  labelKey?: string;
  required?: boolean;
  disabled?: boolean;
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
        disabled={disabled}
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

// ─── DateTimePicker Component ──────────────────────────────────────────────────

function DateTimePicker({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-base sm:text-xl text-black mb-1">
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
        disabled={disabled}
        className={`w-full h-9 border border-gray-300 rounded px-3 text-sm sm:text-base outline-none ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-white focus:border-blue-400"
        }`}
      />
    </div>
  );
}

// ─── Equipment History Tab ─────────────────────────────────────────────────────

function EquipmentHistoryTab({ disabled }: { disabled: boolean }) {
  const [equipmentForm, setEquipmentForm] = useState<EquipmentForm>({
    noChange: false,
    equipmentName: "",
    newSN: "",
    oldSN: "",
    symptom: "",
  });

  const [records, setRecords] = useState<EquipmentRecord[]>([
    {
      id: 1,
      datetime: "18/03/2026 14:03",
      equipmentName: "Audio Code",
      newSN: "A12347",
      oldSN: "B12358",
      symptom: "ไฟไม่เข้า",
    },
    {
      id: 2,
      datetime: "18/03/2026 14:02",
      equipmentName: "Audio Code",
      newSN: "A12345",
      oldSN: "B654321",
      symptom: "ไฟไม่เข้า",
    },
    {
      id: 3,
      datetime: "16/03/2026 16:20",
      equipmentName: "ปลั๊กไฟ",
      newSN: "123456",
      oldSN: "859858",
      symptom: "ไฟใหม้",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEquipmentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (equipmentForm.noChange) {
      alert("บันทึก: ไม่เปลี่ยนอุปกรณ์");
      return;
    }
    if (
      !equipmentForm.newSN ||
      !equipmentForm.oldSN ||
      !equipmentForm.symptom
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newRecord: EquipmentRecord = {
      id: records.length + 1,
      datetime: formatted,
      equipmentName: equipmentForm.equipmentName,
      newSN: equipmentForm.newSN,
      oldSN: equipmentForm.oldSN,
      symptom: equipmentForm.symptom,
    };
    setRecords((prev) => [newRecord, ...prev]);
    setEquipmentForm({
      noChange: false,
      equipmentName: "",
      newSN: "",
      oldSN: "",
      symptom: "",
    });
  };

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(searchText.toLowerCase()),
    ),
  );

  const inputCls = (dis: boolean) =>
    `border border-gray-300 rounded px-3 h-9 text-sm outline-none ${
      dis
        ? "bg-gray-100 cursor-not-allowed text-gray-400"
        : "bg-white focus:border-blue-400"
    }`;

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="noChange"
            id="noChange"
            checked={equipmentForm.noChange}
            onChange={handleFormChange}
            disabled={disabled}
            className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
          />
          <label
            htmlFor="noChange"
            className="text-sm text-gray-700 cursor-pointer"
          >
            ไม่เปลี่ยนอุปกรณ์
          </label>
        </div>

        {/* Equipment form fields — stack on mobile, row on md+ */}
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-4 flex-wrap">
          <div className="w-full md:flex-1 md:min-w-[140px]">
            <label className="block text-sm text-gray-700 mb-1">
              ชื่ออุปกรณ์
            </label>
            <input
              name="equipmentName"
              value={equipmentForm.noChange ? "" : equipmentForm.equipmentName}
              onChange={handleFormChange}
              disabled={disabled || equipmentForm.noChange}
              className={`${inputCls(disabled || equipmentForm.noChange)} w-full`}
            />
          </div>
          <div className="w-full md:flex-1 md:min-w-[120px]">
            <label className="block text-sm text-gray-700 mb-1">
              New S/N <span className="text-red-500">*</span>
            </label>
            <input
              name="newSN"
              value={equipmentForm.noChange ? "" : equipmentForm.newSN}
              onChange={handleFormChange}
              disabled={disabled || equipmentForm.noChange}
              className={`${inputCls(disabled || equipmentForm.noChange)} w-full`}
            />
          </div>
          <div className="w-full md:flex-1 md:min-w-[120px]">
            <label className="block text-sm text-gray-700 mb-1">
              Old S/N <span className="text-red-500">*</span>
            </label>
            <input
              name="oldSN"
              value={equipmentForm.noChange ? "" : equipmentForm.oldSN}
              onChange={handleFormChange}
              disabled={disabled || equipmentForm.noChange}
              className={`${inputCls(disabled || equipmentForm.noChange)} w-full`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">
              อาการเสีย/หมายเหตุ <span className="text-red-500">*</span>
            </label>
            <input
              name="symptom"
              value={equipmentForm.noChange ? "" : equipmentForm.symptom}
              onChange={handleFormChange}
              disabled={disabled || equipmentForm.noChange}
              className={`${inputCls(disabled || equipmentForm.noChange)} w-full`}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="h-9 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded cursor-pointer transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Table controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
        <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 gap-2 w-full sm:max-w-xs bg-white">
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาข้อมูลในตาราง..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent text-gray-600 placeholder-gray-400"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-1.5 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11"
            />
          </svg>
          Export Excel
        </button>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 -mx-1">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-medium text-left">
              <th className="px-3 py-3 w-12">แก้ไข</th>
              <th className="px-3 py-3 w-12">ลำดับ</th>
              <th className="px-3 py-3 whitespace-nowrap">วันเวลาที่แก้ไข</th>
              <th className="px-3 py-3 whitespace-nowrap">ชื่ออุปกรณ์</th>
              <th className="px-3 py-3 whitespace-nowrap">New S/N</th>
              <th className="px-3 py-3 whitespace-nowrap">Old S/N</th>
              <th className="px-3 py-3 whitespace-nowrap">
                อาการเสีย/หมายเหตุ
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr
                key={record.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(record.id)}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="px-3 py-3 text-gray-600">{record.id}</td>
                <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                  {record.datetime}
                </td>
                <td className="px-3 py-3 text-gray-700">
                  {record.equipmentName}
                </td>
                <td className="px-3 py-3 text-gray-700">{record.newSN}</td>
                <td className="px-3 py-3 text-gray-700">{record.oldSN}</td>
                <td className="px-3 py-3 text-gray-700">{record.symptom}</td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Customer Return Tab (Tab 3) ──────────────────────────────────────────────

interface CustomerReturnForm {
  usableDateTime: string;
  grade: string;
  customerName: string;
  phone: string;
}

function CustomerReturnTab({
  disabled,
  gradeOptions,
}: {
  disabled: boolean;
  gradeOptions: any[];
}) {
  const [form, setForm] = useState<CustomerReturnForm>({
    usableDateTime: "",
    grade: "",
    customerName: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.usableDateTime ||
      !form.customerName ||
      !form.phone ||
      !form.grade
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    try {
      const res = await fetch("/api/customer-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      alert("บันทึกสำเร็จ 🎉");
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const inputCls = (dis: boolean) =>
    `w-full h-10 border border-gray-300 rounded-md px-3 text-sm outline-none transition-colors ${
      dis
        ? "bg-gray-100 cursor-not-allowed text-gray-400"
        : "bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
    }`;

  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      {/* Stack on mobile, 2-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div>
          <label className={labelCls}>
            วันเวลาที่ใช้ได้ <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center border border-gray-300 rounded-md px-3 h-10 gap-2 transition-colors ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200"}`}
          >
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                strokeWidth="2"
              />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
            <input
              type="datetime-local"
              name="usableDateTime"
              value={form.usableDateTime}
              onChange={handleChange}
              disabled={disabled}
              step="60"
              className={`flex-1 text-sm outline-none bg-transparent min-w-0 ${disabled ? "cursor-not-allowed text-gray-400" : "text-gray-700"}`}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>
            เกรด <span className="text-red-500">*</span>
          </label>
          <select
            name="grade"
            value={form.grade}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full h-10 border border-gray-300 rounded-md px-3 text-sm outline-none transition-colors ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200"}`}
          >
            <option value="">เลือกรายการ</option>
            {gradeOptions.map((g: any) => (
              <option key={g.grade_id} value={g.grade_id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            ชื่อลูกค้า <span className="text-red-500">*</span>
          </label>
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            disabled={disabled}
            className={inputCls(disabled)}
          />
        </div>
        <div>
          <label className={labelCls}>
            เบอร์โทรศัพท์ <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={disabled}
            type="tel"
            className={inputCls(disabled)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="h-10 px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-md transition-colors w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// ─── ส่งงานกลับ Form ──────────────────────────────────────────────────────────

interface ReturnJobForm {
  reason: string;
}

function ReturnJobCard({ disabled }: { disabled: boolean }) {
  const [form, setForm] = useState<ReturnJobForm>({ reason: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ reason: e.target.value });
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!form.reason.trim()) {
      alert("กรุณากรอกเหตุผลในการส่งงานกลับ");
      return;
    }
    try {
      setSubmitted(true);
      alert("ส่งงานกลับเรียบร้อยแล้ว 🎉");
      setForm({ reason: "" });
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 w-full border border-gray-200 shadow-sm flex flex-col shrink-0">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          ส่งงานกลับ
        </h2>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="block text-sm font-medium text-gray-700">
          เหตุผล <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          disabled={disabled}
          rows={5}
          placeholder={disabled ? "" : "กรุณาระบุเหตุผลในการส่งงานกลับ..."}
          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none transition-colors ${
            disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200"
              : "bg-white border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 placeholder-gray-300"
          }`}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className="mt-4 w-full h-10 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        ส่งงานกลับ
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function JobDetail() {
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
    remark: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isJobAccepted, setIsJobAccepted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);

  const [options, setOptions] = useState({
    operations: [],
    slaReasons: [],
    causesSamart: [],
    causesActivity: [],
    causesCustomer: [],
    causesOther: [],
    grades: [],
  });

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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          operationsRes,
          slaReasonsRes,
          gradesRes,
          causesSamartRes,
          causesActivityRes,
          causesCustomerRes,
          causesOtherRes,
        ] = await Promise.all([
          fetch("/api/teleport-technician/GetOperations"),
          fetch("/api/teleport-technician/GetSlaReasons"),
          fetch("/api/teleport-technician/GetGrades"),
          fetch("/api/noc/GetCausesSamart"),
          fetch("/api/noc/GetCausesActivity"),
          fetch("/api/noc/GetCausesCustomer"),
          fetch("/api/noc/GetCausesOther"),
        ]);

        const [
          operationsData,
          slaReasonsData,
          gradesData,
          causesSamartData,
          causesActivityData,
          causesCustomerData,
          causesOtherData,
        ] = await Promise.all([
          operationsRes.json(),
          slaReasonsRes.json(),
          gradesRes.json(),
          causesSamartRes.json(),
          causesActivityRes.json(),
          causesCustomerRes.json(),
          causesOtherRes.json(),
        ]);

        setOptions({
          operations: operationsData.operations || [],
          slaReasons: slaReasonsData.slaReasons || [],
          grades: gradesData.grades || [],
          causesSamart: causesSamartData.causesSamart,
          causesActivity: causesActivityData.causesActivity,
          causesCustomer: causesCustomerData.causesCustomer,
          causesOther: causesOtherData.causesOther,
        });
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
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
  const handleConfirm = () => setIsJobAccepted(true);

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
          jobId: jobForm.jobNumber,
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
      remark: "",
    });
  };

  const labelClass = "block text-base sm:text-xl text-black mb-1";
  const inputClass =
    "w-full h-9 border border-gray-300 rounded px-3 text-sm sm:text-base outline-none focus:border-blue-400 bg-white";
  const RequiredStar = () => <span className="text-red-500 ml-0.5">*</span>;

  const tabs = [
    { id: 1, label: "บันทึกการให้บริการ" },
    { id: 2, label: "ประวัติการเปลี่ยนอุปกรณ์" },
    { id: 3, label: "ข้อมูลลูกค้ารับคืนดี" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Top Header ── */}
      <div className="bg-orange-500 h-14 sm:h-16 flex items-center px-4 sm:px-6 text-white">
        <div className="w-full flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <Image
              src="/images/icons8-life-cycle-50.png"
              alt="life-cycle"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="text-right leading-tight">
              <div className="text-base sm:text-lg font-medium">
                สุจิตรา หุ่นงาม
              </div>
              <div className="text-xs sm:text-sm opacity-90">administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="p-3 sm:p-5">
        {/* Breadcrumb */}
        <div className="bg-blue-900 px-4 sm:px-6 py-2 sm:py-3 rounded-md mb-3">
          <span className="text-white text-lg sm:text-2xl font-semibold">
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
            {/* ── Job Detail Card ── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-4">
              <h2 className="text-xl sm:text-3xl font-semibold text-black mb-4 sm:mb-6">
                รายละเอียดงาน
              </h2>

              {/* 1-col on mobile, 2-col on sm, 3-col on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-4 sm:gap-y-5">
                {/* Col 1 */}
                <div className="flex flex-col gap-4 sm:gap-5">
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
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base outline-none resize-none focus:border-blue-400 bg-gray-50"
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
                <div className="flex flex-col gap-4 sm:gap-5">
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
                <div className="flex flex-col gap-4 sm:gap-5">
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

            {/* ── Action Buttons ── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-7 py-4 sm:py-5 flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
              {!isJobAccepted && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-10 sm:h-12 px-6 sm:px-0 sm:w-32 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg sm:text-2xl rounded cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
              )}
              {!isJobAccepted ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="h-10 sm:h-12 px-6 sm:px-0 sm:w-44 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg sm:text-2xl rounded cursor-pointer transition-colors"
                >
                  ยืนยันรับงาน
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-xl sm:text-2xl">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
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

            {/* ── Bottom Section ── */}
            {/* Desktop: side-by-side; Mobile/Tablet: stacked */}
            <div
              className="flex flex-col xl:grid xl:gap-4 xl:items-start"
              style={{ gridTemplateColumns: "1fr 380px" }}
            >
              {/* ── Tabs Panel ── */}
              <div className="flex bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden mb-4 xl:mb-0">
                {/* Tab Content */}
                <div className="flex-1 min-w-0 p-4 sm:p-7 overflow-hidden">
                  {/* Breadcrumb title */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-2xl font-semibold text-black">
                      บันทึกการให้บริการ
                    </h2>
                    {activeTab === 2 && (
                      <>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="text-lg sm:text-2xl font-semibold">
                          ประวัติการเปลี่ยนอุปกรณ์
                        </span>
                      </>
                    )}
                    {activeTab === 3 && (
                      <>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="text-lg sm:text-2xl font-semibold">
                          ข้อมูลลูกค้ารับคืนดี
                        </span>
                      </>
                    )}
                  </div>

                  {/* Tab 1 */}
                  {activeTab === 1 && (
                    <>
                      {/* 1-col on mobile, 2-col on sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
                        <Select
                          label="Samart"
                          name="samart"
                          onChange={handleServiceChange}
                          options={options.causesSamart}
                          valueKey="cause_id"
                          labelKey="cause_name"
                          disabled={!isJobAccepted}
                          required
                        />
                        <Select
                          label="ภัยธรรมชาติ"
                          name="naturalDisaster"
                          onChange={handleServiceChange}
                          options={options.causesActivity}
                          valueKey="cause_id"
                          labelKey="cause_name"
                          disabled={!isJobAccepted}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
                        <Select
                          label="ลูกค้า"
                          name="customer"
                          onChange={handleServiceChange}
                          options={options.causesCustomer}
                          valueKey="cause_id"
                          labelKey="cause_name"
                          disabled={!isJobAccepted}
                          required
                        />
                        <Select
                          label="อื่นๆ"
                          name="other"
                          onChange={handleServiceChange}
                          options={options.causesOther}
                          valueKey="cause_id"
                          labelKey="cause_name"
                          disabled={!isJobAccepted}
                          required
                        />
                      </div>
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
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base outline-none resize-none focus:border-blue-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto mt-3"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === 2 && (
                    <EquipmentHistoryTab disabled={!isJobAccepted} />
                  )}
                  {activeTab === 3 && (
                    <CustomerReturnTab
                      disabled={!isJobAccepted}
                      gradeOptions={options.grades}
                    />
                  )}
                </div>

                {/* Vertical Tab Rail */}
                <div className="flex flex-col border-l border-gray-200 bg-gray-50 shrink-0 w-10 sm:w-11">
                  {tabs.map((tab, idx) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      title={tab.label}
                      className={`
                        relative w-full flex items-center justify-center transition-all duration-200 select-none
                        py-5 sm:py-6 cursor-pointer
                        ${activeTab === tab.id ? "bg-blue-600 text-white font-bold" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 font-medium"}
                        ${idx < tabs.length - 1 ? "border-b border-gray-200" : ""}
                      `}
                    >
                      {activeTab === tab.id && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-blue-300 rounded-r-full" />
                      )}
                      <span className="text-sm">{tab.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Right Column: ส่งงานกลับ + นัดหมายลูกค้า ── */}
              <div className="flex flex-col gap-4">
                <ReturnJobCard disabled={!isJobAccepted} />

                {/* นัดหมายลูกค้า */}
                <div className="bg-white rounded-xl p-5 sm:p-7 border border-gray-200 shadow-sm flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4 sm:mb-6">
                    นัดหมายลูกค้า
                  </h2>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <DateTimePicker
                      label="วันเวลาที่นัด"
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
                        className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        disabled={!isJobAccepted}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        เบอร์โทรศัพท์ <RequiredStar />
                      </label>
                      <input
                        name="phone"
                        value={customerForm.phone}
                        onChange={handleCustomerChange}
                        className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        type="tel"
                        disabled={!isJobAccepted}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>หมายเหตุ</label>
                      <input
                        name="remark"
                        value={customerForm.remark}
                        onChange={handleCustomerChange}
                        className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        disabled={!isJobAccepted}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto mt-3"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Save / Cancel ── */}
            {/* <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-5 sm:mt-6">
              <button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto">
                บันทึก
              </button>
              <button type="button" onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md w-full sm:w-auto">
                ยกเลิก
              </button>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
