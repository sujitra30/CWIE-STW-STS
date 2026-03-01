"use client";

import Image from "next/image";
import { useState } from "react";
import { useNocOptions } from "@/hooks/useNocOptions";
import type { SelectOption } from "@/hooks/useNocOptions";

// ─── shared styles ───────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400";

const labelCls = "text-sm text-gray-700 font-medium";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className={labelCls}>
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function SelectField({
  label,
  name,
  options = [],
  value,
  onChange,
  required,
  disabled,
}: {
  label: string;
  name: string;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        <option value="">--- กรุณาเลือก ---</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── mock options (คงไว้สำหรับ field อื่นที่ยังไม่มี API) ───────────────────
const plantOptions = [
  { value: "5000", label: "5000" },
  { value: "5001", label: "5001" },
];
const materialOptions = [
  {
    value: "SB-GCMACBAC006N",
    label: "SB-GCMACBAC006N - KT 2L-61261-01 BATTERY PACK FOR M5000X",
  },
  { value: "MAT002", label: "MAT002 - Item B" },
];

// ─── main form state type ─────────────────────────────────────────────────────
interface FormState {
  teleport: string;
  doC_ID: string;
  project: string;
  plant: string;
  materialNo: string;
  serialNo: string;
  status: string;
  statusIc: string; // ← เพิ่ม
  withdrawDate: string;
  returnDate: string;
  projectTarget: string;
  projectUsed: string;
  remark: string;
}

const emptyForm: FormState = {
  teleport: "",
  doC_ID: "",
  project: "",
  plant: "",
  materialNo: "",
  serialNo: "",
  status: "",
  statusIc: "", // ← เพิ่ม
  withdrawDate: "",
  returnDate: "",
  projectTarget: "",
  projectUsed: "",
  remark: "",
};

// ─── page ─────────────────────────────────────────────────────────────────────
export default function WithdrawalPage() {
  const [form, setForm] = useState<FormState>(emptyForm);

  // ── ดึง options จาก API ผ่าน hook ─────────────────────────────────────────
  const {
    teleportOptions,
    projectOptions,
    statusIcOptions,
    plantOptions,
    materialOptions,
    loading,
    error,
  } = useNocOptions();

  const setField =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", form);
    alert("บันทึกสำเร็จ");
  };

  const handleClear = () => setForm(emptyForm);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Top Header */}
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

      <div className="p-6">
        {/* แสดง error banner ถ้าโหลด options ไม่สำเร็จ */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-md">
            ⚠️ โหลด options ไม่สำเร็จ: {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6">
            Withdrawal
          </div>

          {/* ── Form card ── */}
          <div className="bg-white border border-gray-300 rounded-[20px] p-6 space-y-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">การเบิกอุปกรณ์</h2>
            {/* Row 1 : Teleport | หมายเลขใบเบิก | Project | Serial No. */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* ✅ Teleport — ดึงจาก API */}
              <SelectField
                label="Teleport"
                name="teleport"
                options={teleportOptions.filter((o) => o.value !== "")} // ตัด "ทั้งหมด" ออก
                value={form.teleport}
                onChange={setField("teleport")}
                required
                disabled={loading}
              />

              <div>
                <FieldLabel text="หมายเลขใบเบิก" />
                <input
                  type="number"
                  value={form.doC_ID}
                  onChange={setField("doC_ID")}
                  className={inputCls}
                  placeholder="กรอกหมายเลขใบเบิก"
                />
              </div>

              {/* ✅ Project — ดึงจาก API */}
              <SelectField
                label="Project"
                name="project"
                options={projectOptions.filter((o) => o.value !== "")}
                value={form.project}
                onChange={setField("project")}
                disabled={loading}
              />

              <div>
                <FieldLabel text="Serial No." />
                <input
                  type="text"
                  value={form.serialNo}
                  onChange={setField("serialNo")}
                  className={inputCls}
                  placeholder="กรอก Serial No."
                />
              </div>
            </div>

            {/* Row 2 : Plant | Material No. | Status | Status IC */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField
                label="Plant"
                name="plant"
                options={plantOptions.filter((o) => o.value !== "")} // ✅ จาก API
                value={form.plant}
                onChange={setField("plant")}
                disabled={loading}
              />

              <SelectField
                label="Material No."
                name="materialNo"
                options={materialOptions.filter((o) => o.value !== "")} // ✅ จาก API
                value={form.materialNo}
                onChange={setField("materialNo")}
                disabled={loading}
              />

              <SelectField
                label="Status"
                name="status"
                options={statusIcOptions.filter((o) => o.value !== "")}
                value={form.statusIc}
                onChange={setField("statusIc")}
                disabled={loading}
              />
            </div>

            {/* Row 3 : วันที่เบิก | วันที่คืน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel text="วันที่เบิก" />
                <input
                  type="date"
                  value={form.withdrawDate}
                  onChange={setField("withdrawDate")}
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel text="วันที่คืน" />
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={setField("returnDate")}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Row 4 : Project Target | Project Used */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Project Target"
                name="projectTarget"
                options={projectOptions.filter((o) => o.value !== "")}
                value={form.project}
                onChange={setField("project")}
                disabled={loading}
              />

              <SelectField
                label="Project Used"
                name="projectUsed"
                options={projectOptions.filter((o) => o.value !== "")}
                value={form.project}
                onChange={setField("project")}
                disabled={loading}
              />
            </div>

            {/* Row 5 : หมายเหตุ */}
            <div>
              <FieldLabel text="หมายเหตุ" />
              <input
                type="text"
                value={form.remark}
                onChange={setField("remark")}
                className={inputCls}
                placeholder="กรอกหมายเหตุ"
              />
            </div>

            {/* ── Action buttons ── */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-6 py-2 rounded-md transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z" />
                </svg>
                {loading ? "กำลังโหลด..." : "บันทึก"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2 rounded-md transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"
                  />
                </svg>
                ล้างข้อมูล
              </button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-6 py-2 rounded-md transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
