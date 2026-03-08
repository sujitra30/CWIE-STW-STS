"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { SelectOption, useNocOptions } from "@/hooks/useNocOptions";
import { useRouter } from "next/navigation";

interface WithdrawalFull {
  withdrawal_id:        number;
  tech_withdraw_no:     string;
  ref_doc_id:           string | null;
  teleport_name:        string | null;
  province:             string | null;
  project_name:         string | null;
  plant_name:           string | null;
  status_name:          string | null;
  material_no:          string | null;
  material_name:        string | null;
  material_type:        string | null;
  unit:                 string | null;
  serial_no:            string | null;
  withdraw_date:        string | null;
  return_date:          string | null;
  project_target_name:  string | null;
  project_used_name:    string | null;
  faulty_project_name:  string | null;
  faulty_plant_name:    string | null;
  faulty_material_no:   string | null;
  faulty_material_name: string | null;
  faulty_serial_no:     string | null;
  remark:               string | null;
  created_by:           string | null;
  created_at:           string;
  updated_by:           string | null;
  updated_at:           string;
}

function fmt(d?: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("th-TH", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
}

function fmtDT(d?: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleString("th-TH", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
}

function StatusBadge({ name }: { name: string | null }) {
  if (!name) return null;
  const map: Record<string, string> = {
    "รอ MA อนุมัติใบเบิก": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "MA ไม่อนุมัติเบิก":   "bg-red-100 text-red-700 border-red-300",
    "TP ยกเลิกเบิก":       "bg-red-100 text-red-700 border-red-300",
    "รอ TP รับอุปกรณ์":    "bg-blue-100 text-blue-700 border-blue-300",
    "TP พร้อมจ่าย":        "bg-indigo-100 text-indigo-700 border-indigo-300",
    "รอ MA รับอุปกรณ์":    "bg-orange-100 text-orange-700 border-orange-300",
    "MA ได้รับอุปกรณ์":    "bg-green-100 text-green-700 border-green-300",
  };
  const cls = map[name] ?? "bg-gray-100 text-gray-600 border-gray-300";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {name}
    </span>
  );
}

function F({ label, value, sub }: {
  label: string;
  value?: string | null;
  sub?: string | null;
}) {
  const v = value && value.trim() !== "" ? value : null;
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-800 font-medium break-all leading-snug">
        {v ?? <span className="text-gray-300 italic text-xs">—</span>}
      </p>
      {sub && sub.trim() !== "" && (
        <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
      )}
    </div>
  );
}

function InlineTitle({ label, dot }: { label: string; dot: string }) {
  return (
    <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center gap-2 pt-1">
      <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
      <span className="text-xs font-semibold text-gray-500 tracking-wide">{label}</span>
      <span className="flex-1 border-t border-gray-100" />
    </div>
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
          <p className="modal-text text-gray-800 text-lg font-semibold">ทำเรื่องคืนอุปกรณ์สำเร็จ</p>
          {techWithdrawNo && (
            <p className="modal-text mt-2 text-sm text-gray-500">
              เลขที่ใบเบิก: <span className="font-mono font-semibold text-blue-700">{techWithdrawNo}</span>
            </p>
          )}
          <button
            onClick={onClose}
            className="modal-text mt-6 px-6 py-2 rounded-md bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition"
          >
            ตกลง
          </button>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// WITHDRAWAL CARD
// =====================================================================
function WithdrawalCard({ data, conditionOptions }: {
  data: WithdrawalFull;
  conditionOptions: SelectOption[];
}) {
  const router = useRouter();
  const matSub = [data.material_no, data.material_type, data.unit].filter(Boolean).join(" · ");

  // ── local state ──────────────────────────────────────────────────
  const [returnPurpose, setReturnPurpose] = useState("");
  const [remark, setRemark]               = useState(data.remark ?? "");
  const [remarkError, setRemarkError]     = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);

  // ── handler ──────────────────────────────────────────────────────
  const handleReturn = () => {
    // Step 1: ถ้าวัตถุประสงค์เป็น "ดี" → ต้องกรอก หมายเหตุ
    if (returnPurpose === "ดี" && remark.trim() === "") {
      setRemarkError(true);
      document.getElementById("return-remark")?.focus();
      return;
    }
    setRemarkError(false);

    // Step 2: ดำเนินการคืนอุปกรณ์ (call API หรือ logic อื่น ๆ ที่นี่)
    console.log("คืนอุปกรณ์", { withdrawal_id: data.withdrawal_id, returnPurpose, remark });

    // Step 3: แสดง success modal
    setShowSuccess(true);
  };

  return (
    <>
      {showSuccess && (
        <SuccessModal
          techWithdrawNo={data.tech_withdraw_no}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
              ใบคืนอุปกรณ์
            </p>
            <p className="text-white text-xl font-bold font-mono tracking-wide">
              {data.tech_withdraw_no}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge name={data.status_name} />
            <div className="text-right">
              <p className="text-blue-200 text-[10px]">Withdrawal ID</p>
              <p className="text-white text-sm font-mono font-semibold">#{data.withdrawal_id}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">

            <InlineTitle label="ข้อมูลเอกสาร" dot="bg-blue-900" />
            <F label="หมายเลขใบช่างเบิก"    value={data.tech_withdraw_no} />
            <F label="อ้างอิงหมายเลขใบเบิก" value={data.ref_doc_id} />
            <F label="Status"               value={data.status_name} />
            <F label="Teleport"             value={data.teleport_name} sub={data.province} />
            <F label="วันที่เบิก"            value={fmt(data.withdraw_date)} />
            <F label="วันที่คืน"             value={fmt(data.return_date)} />

            <InlineTitle label="ข้อมูลอุปกรณ์หลัก" dot="bg-orange-500" />
            <F label="Project"        value={data.project_name} />
            <F label="Project Target" value={data.project_target_name} />
            <F label="Project Used"   value={data.project_used_name} />
            <F label="Plant"          value={data.plant_name} />
            <F label="Material"       value={data.material_name} sub={matSub || null} />
            <F label="Serial No."     value={data.serial_no} />

            <InlineTitle label="ข้อมูลอุปกรณ์เสีย" dot="bg-red-500" />
            <F label="Project ของอุปกรณ์เสีย"     value={data.faulty_project_name} />
            <F label="Plant ของอุปกรณ์เสีย"       value={data.faulty_plant_name} />
            <F label="Material ของอุปกรณ์เสีย"    value={data.faulty_material_name} sub={data.faulty_material_no} />
            <F label="Serial No. ของอุปกรณ์เสีย" value={data.faulty_serial_no} />

          </div>

          {/* Remark (existing display) */}
          {data.remark && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-1">
                หมายเหตุ
              </p>
              <p className="text-sm text-gray-700">{data.remark}</p>
            </div>
          )}

          {/* ── กรณีคืนอุปกรณ์ ── */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-900 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-500 tracking-wide">กรณีคืนอุปกรณ์</span>
              <span className="flex-1 border-t border-gray-100" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">

              {/* วัตถุประสงค์การรับคืน */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  วัตถุประสงค์การรับคืน
                </p>
                <select
                  value={returnPurpose}
                  onChange={(e) => setReturnPurpose(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white
                    focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">--- กรุณาเลือก ---</option>
                  {(conditionOptions ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* หมายเหตุ (editable) — แสดงและบังคับกรอกเมื่อวัตถุประสงค์ = "ดี" */}
              <div className="col-span-2 md:col-span-2 lg:col-span-3">
                <label
                  htmlFor="return-remark"
                  className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 block
                    ${returnPurpose === "ดี" ? "text-gray-700" : "text-gray-400"}`}
                >
                  หมายเหตุ
                  {returnPurpose === "ดี" && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                  id="return-remark"
                  rows={2}
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                    if (e.target.value.trim() !== "") setRemarkError(false);
                  }}
                  placeholder="กรุณากรอกหมายเหตุ..."
                  className={`w-full border rounded-md px-3 py-2 text-sm resize-none
                    focus:outline-none focus:ring-1 transition
                    ${remarkError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-300 bg-red-50"
                      : "border-gray-300 focus:border-gray-500 focus:ring-gray-400"
                    }`}
                />
                {remarkError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    กรุณากรอก หมายเหตุ ก่อนดำเนินการ
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => router.push("/teleport-technician")}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 text-sm
                hover:bg-gray-100 transition"
            >
              กลับหน้าหลัก
            </button>

            <button
              onClick={handleReturn}
              className="px-6 py-2 rounded-md bg-blue-900 text-white text-sm font-medium
                hover:bg-blue-800 transition shadow"
            >
              คืนอุปกรณ์
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              สร้างโดย:{" "}
              <span className="text-gray-600 font-medium">{data.created_by ?? "—"}</span>
              {" · "}{fmtDT(data.created_at)}
            </span>
            {data.updated_by && (
              <span className="text-xs text-gray-400">
                แก้ไขโดย:{" "}
                <span className="text-gray-600 font-medium">{data.updated_by}</span>
                {" · "}{fmtDT(data.updated_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================
export default function NocOpenJobPage() {
  const [data, setData]       = useState<WithdrawalFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { conditionOptions }  = useNocOptions();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/withdrawal-latest");
        if (res.status === 404) { setData(null); return; }
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
        const json: WithdrawalFull = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        console.error("Error fetching withdrawal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="bg-orange-500 h-16 flex items-center px-6 text-white font-medium">
        <div className="w-full max-w-[1440px] flex items-center justify-between px-8 mx-auto">
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

      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6">
          การคืนอุปกรณ์
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-red-500">{error}</div>
        ) : data ? (
          <WithdrawalCard data={data} conditionOptions={conditionOptions} />
        ) : (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">ไม่พบข้อมูล</div>
        )}
      </div>
    </div>
  );
}