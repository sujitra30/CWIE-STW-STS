"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNocOptions } from "@/hooks/useNocOptions";

// ─── shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400";
const inputErrCls =
  "w-full border border-red-400 rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400";
const labelCls = "text-sm text-gray-700 font-medium";

// ─── Inline error text ────────────────────────────────────────────────────────
function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ techWithdrawNo, onClose }: { techWithdrawNo: string; onClose: () => void }) {
  return (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalPop {
          0%   { opacity:0; transform:scale(0.7) translateY(30px) }
          60%  { transform:scale(1.05) translateY(-4px) }
          80%  { transform:scale(0.97) translateY(2px) }
          100% { opacity:1; transform:scale(1) translateY(0) }
        }
        @keyframes checkDraw {
          0%   { stroke-dashoffset:50; opacity:0 }
          40%  { opacity:1 }
          100% { stroke-dashoffset:0 }
        }
        @keyframes ringPulse {
          0%   { transform:scale(0.6); opacity:0 }
          60%  { transform:scale(1.08); opacity:1 }
          100% { transform:scale(1); opacity:1 }
        }
        @keyframes textFadeUp {
          from { opacity:0; transform:translateY(8px) }
          to   { opacity:1; transform:translateY(0) }
        }
        .modal-backdrop { animation:backdropIn 0.25s ease forwards }
        .modal-card     { animation:modalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards }
        .modal-ring     { animation:ringPulse 0.45s 0.1s cubic-bezier(0.34,1.56,0.64,1) both }
        .modal-check    { stroke-dasharray:50; stroke-dashoffset:50; animation:checkDraw 0.4s 0.3s ease forwards }
        .modal-text     { animation:textFadeUp 0.35s 0.45s ease both }
      `}</style>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="modal-card bg-white rounded-2xl shadow-2xl w-80 flex flex-col items-center py-10 px-8">
          <div className="modal-ring w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path className="modal-check" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="modal-text text-gray-800 text-lg font-semibold">เบิกสำเร็จ</p>
          {techWithdrawNo && (
            <p className="modal-text mt-2 text-sm text-gray-500">
              เลขที่ใบเบิก: <span className="font-mono font-semibold text-blue-700">{techWithdrawNo}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className={labelCls}>
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function SelectField({
  label, name, options = [], value, onChange, required, disabled, error,
}: {
  label: string; name: string;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean; disabled?: boolean; error?: string;
}) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <select
        name={name} value={value} onChange={onChange} disabled={disabled}
        className={`${error ? inputErrCls : inputCls} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        <option value="">--- กรุณาเลือก ---</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ErrorMsg msg={error} />
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  techWithdrawNo: string;
  refDocId: string;
  project: string;
  plant: string;
  materialNo: string;
  serialNo: string;
  status: string;
  withdrawDate: string;
  returnDate: string;
  projectTarget: string;
  faultyProject: string;
  faultyPlant: string;
  faultyMaterialNo: string;
  faultySerialNo: string;
  teleport: string;
  projectUsed: string;
  remark: string;
}

interface FormErrors {
  teleport?: string;
  project?: string;
  plant?: string;
  status?: string;
  materialNo?: string;
  serialNo?: string;
  projectTarget?: string;
  faultyProject?: string;
  faultyPlant?: string;
  faultyMaterialNo?: string;
  faultySerialNo?: string;
  projectUsed?: string;
  remark?: string;
}

const emptyForm: FormState = {
  techWithdrawNo: "", refDocId: "", project: "", plant: "",
  materialNo: "", serialNo: "", status: "", withdrawDate: "",
  returnDate: "", projectTarget: "", faultyProject: "", faultyPlant: "",
  faultyMaterialNo: "", faultySerialNo: "", teleport: "",
  projectUsed: "", remark: "",
};

const errorKeyMap: Partial<Record<keyof FormState, keyof FormErrors>> = {
  teleport: "teleport", project: "project", plant: "plant", status: "status",
  materialNo: "materialNo", serialNo: "serialNo", projectTarget: "projectTarget",
  faultyProject: "faultyProject", faultyPlant: "faultyPlant",
  faultyMaterialNo: "faultyMaterialNo", faultySerialNo: "faultySerialNo",
  projectUsed: "projectUsed", remark: "remark",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WithdrawalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);          // ← แยก loading submit
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successNo, setSuccessNo] = useState<string | null>(null); // ← เก็บเลขที่ใบเบิก

  const { teleportOptions, projectOptions, statusIcOptions, plantOptions, materialOptions, loading, error } = useNocOptions();

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      const errKey = errorKeyMap[key];
      if (errKey) setErrors((prev) => ({ ...prev, [errKey]: undefined }));
      setSubmitError(null);
    };

  // ── Validate ────────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.teleport)              e.teleport         = "กรุณาเลือก Teleport";
    if (!form.project)               e.project          = "กรุณาเลือก";
    if (!form.plant)                 e.plant            = "กรุณาเลือก";
    if (!form.status)                e.status           = "กรุณาเลือก";
    if (!form.materialNo)            e.materialNo       = "กรุณาเลือก";
    if (!form.serialNo.trim())       e.serialNo         = "กรุณากรอก";
    if (!form.projectTarget)         e.projectTarget    = "กรุณาเลือก";
    if (!form.projectUsed)           e.projectUsed      = "กรุณาเลือก Project Used";
    if (!form.faultyProject)         e.faultyProject    = "กรุณาเลือก";
    if (!form.faultyPlant)           e.faultyPlant      = "กรุณาเลือก";
    if (!form.faultyMaterialNo)      e.faultyMaterialNo = "กรุณาเลือก";
    if (!form.faultySerialNo.trim()) e.faultySerialNo   = "กรุณากรอก";
    if (!form.remark.trim())         e.remark           = "กรุณากรอกหมายเหตุ";
    return e;
  };

  // ── Submit → POST /api/withdrawal ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refDocId:        form.refDocId || null,
          teleport:        form.teleport,
          project:         form.project,
          plant:           form.plant,
          status:          form.status,
          materialNo:      form.materialNo,
          serialNo:        form.serialNo.trim(),
          withdrawDate:    form.withdrawDate || null,
          returnDate:      form.returnDate   || null,
          projectTarget:   form.projectTarget,
          projectUsed:     form.projectUsed,
          faultyProject:   form.faultyProject,
          faultyPlant:     form.faultyPlant,
          faultyMaterialNo: form.faultyMaterialNo,
          faultySerialNo:  form.faultySerialNo.trim(),
          remark:          form.remark.trim(),
          createdBy:       "admin", // TODO: เปลี่ยนเป็น session user จริง
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "บันทึกไม่สำเร็จ");
        return;
      }

      // ── สำเร็จ: แสดง modal + เลขที่ใบเบิก ──────────────────────────────
      setSuccessNo(data.techWithdrawNo ?? "");
      setTimeout(() => {
        setSuccessNo(null);
        router.push("/teleport-technician");
      }, 2500);
    } catch {
      setSubmitError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => { setForm(emptyForm); setErrors({}); setSubmitError(null); };
  const cleanOpts = (opts: { value: string; label: string }[]) => opts.filter((o) => o.value !== "");
  const isDisabled = loading || submitting;

  return (
    <div className="min-h-screen bg-gray-200">
      {successNo !== null && (
        <SuccessModal techWithdrawNo={successNo} onClose={() => setSuccessNo(null)} />
      )}

      {/* Top Header */}
      <div className="bg-orange-500 h-16 flex items-center px-6 text-white font-medium">
        <div className="w-full max-w-[1440px] flex items-center justify-between px-8">
          <div />
          <div className="flex items-center gap-4">
            <Image src="/images/icons8-life-cycle-50.png" alt="life-cycle" width={40} height={40} />
            <div className="text-white text-right leading-tight">
              <div className="text-lg font-medium">สุจิตรา หุ่นงาม</div>
              <div className="text-sm opacity-90">administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error banner จาก options */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-md">
            ⚠️ โหลด options ไม่สำเร็จ: {error}
          </div>
        )}
        {/* Error banner จาก submit */}
        {submitError && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-md flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6">
            Withdrawal
          </div>

          <div className="bg-white border border-gray-300 rounded-[20px] p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">การเบิกอุปกรณ์</h2>

            {/* ══ Section 1: ข้อมูลใบเบิก ══ */}
            <div>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3 pb-1 border-b border-blue-100">
                ข้อมูลใบเบิก
              </h3>

              {/* Row A: หมายเลขใบช่างเบิก | อ้างอิง | Teleport */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <FieldLabel text="หมายเลขใบช่างเบิก" />
                  <input
                    type="text"
                    value={form.techWithdrawNo}
                    readOnly
                    placeholder="(ระบบจะกำหนดให้อัตโนมัติ)"
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <FieldLabel text="อ้างอิงหมายเลขใบเบิก" />
                  <input type="text" value={form.refDocId} onChange={setField("refDocId")}
                    className={inputCls} placeholder="กรอกหมายเลขอ้างอิง" />
                </div>
                <SelectField label="Teleport" name="teleport"
                  options={cleanOpts(teleportOptions)} value={form.teleport}
                  onChange={setField("teleport")} required disabled={isDisabled}
                  error={errors.teleport} />
              </div>

              {/* Row B: Project | Plant | Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <SelectField label="Project" name="project"
                  options={cleanOpts(projectOptions)} value={form.project}
                  onChange={setField("project")} required disabled={isDisabled}
                  error={errors.project} />
                <SelectField label="Plant" name="plant"
                  options={cleanOpts(plantOptions)} value={form.plant}
                  onChange={setField("plant")} required disabled={isDisabled}
                  error={errors.plant} />
                <SelectField label="Status" name="status"
                  options={cleanOpts(statusIcOptions)} value={form.status}
                  onChange={setField("status")} required disabled={isDisabled}
                  error={errors.status} />
              </div>

              {/* Row C: Material No. | Serial No. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectField label="Material No." name="materialNo"
                  options={cleanOpts(materialOptions)} value={form.materialNo}
                  onChange={setField("materialNo")} required disabled={isDisabled}
                  error={errors.materialNo} />
                <div>
                  <FieldLabel text="Serial No." required />
                  <input type="text" value={form.serialNo} onChange={setField("serialNo")}
                    className={errors.serialNo ? inputErrCls : inputCls}
                    placeholder="กรอก Serial No." />
                  <ErrorMsg msg={errors.serialNo} />
                </div>
              </div>

              {/* Row D: วันที่เบิก | วันที่คืน */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <FieldLabel text="วันที่เบิก" />
                  <input type="date" value={form.withdrawDate} onChange={setField("withdrawDate")} className={inputCls} />
                </div>
                <div>
                  <FieldLabel text="วันที่คืน" />
                  <input type="date" value={form.returnDate} onChange={setField("returnDate")} className={inputCls} />
                </div>
              </div>

              {/* Row E: Project Target | Project Used */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Project Target" name="projectTarget"
                  options={cleanOpts(projectOptions)} value={form.projectTarget}
                  onChange={setField("projectTarget")} required disabled={isDisabled}
                  error={errors.projectTarget} />
                <SelectField label="Project Used" name="projectUsed"
                  options={cleanOpts(projectOptions)} value={form.projectUsed}
                  onChange={setField("projectUsed")} required disabled={isDisabled}
                  error={errors.projectUsed} />
              </div>
            </div>

            {/* ══ Section 2: ข้อมูลอุปกรณ์เสีย ══ */}
            <div>
              <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3 pb-1 border-b border-red-100">
                ข้อมูลอุปกรณ์เสีย
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectField label="Project ของอุปกรณ์เสีย" name="faultyProject"
                  options={cleanOpts(projectOptions)} value={form.faultyProject}
                  onChange={setField("faultyProject")} required disabled={isDisabled}
                  error={errors.faultyProject} />
                <SelectField label="Plant ของอุปกรณ์เสีย" name="faultyPlant"
                  options={cleanOpts(plantOptions)} value={form.faultyPlant}
                  onChange={setField("faultyPlant")} required disabled={isDisabled}
                  error={errors.faultyPlant} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Material No. ของอุปกรณ์เสีย" name="faultyMaterialNo"
                  options={cleanOpts(materialOptions)} value={form.faultyMaterialNo}
                  onChange={setField("faultyMaterialNo")} required disabled={isDisabled}
                  error={errors.faultyMaterialNo} />
                <div>
                  <FieldLabel text="Serial No. ของอุปกรณ์เสีย" required />
                  <input type="text" value={form.faultySerialNo} onChange={setField("faultySerialNo")}
                    className={errors.faultySerialNo ? inputErrCls : inputCls}
                    placeholder="กรอก Serial No. ของอุปกรณ์เสีย" />
                  <ErrorMsg msg={errors.faultySerialNo} />
                </div>
              </div>
            </div>

            {/* ══ Section 3: หมายเหตุ ══ */}
            <div>
              <FieldLabel text="หมายเหตุ" required />
              <textarea
                rows={3}
                value={form.remark}
                onChange={setField("remark")}
                className={`${errors.remark ? inputErrCls : inputCls} resize-none`}
                placeholder="กรอกหมายเหตุ"
              />
              <ErrorMsg msg={errors.remark} />
            </div>

            {/* ── Action buttons ── */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isDisabled}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-6 py-2 rounded-md transition"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z" />
                    </svg>
                    {loading ? "กำลังโหลด..." : "บันทึก"}
                  </>
                )}
              </button>

              <button type="button" onClick={handleClear} disabled={submitting}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-6 py-2 rounded-md transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z" />
                </svg>
                ล้างข้อมูล
              </button>

              <button type="button" onClick={() => window.history.back()} disabled={submitting}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2 rounded-md transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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