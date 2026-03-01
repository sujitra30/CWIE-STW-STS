import { useState, ChangeEvent, FormEvent } from "react";
import { useNocOptions } from "@/hooks/useNocOptions";
import type { SelectOption } from "@/hooks/useNocOptions";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RowData {
  reQ_ID: string;
  teleports: string;
  porjects: string;
  companys: string;
  materials: string;
  serial: string;
  statuss: string;
  statuS_IDS: number;
  projecT_TARGETS: string;
  projecT_USEDS: string;
  dates: string;
  returN_DATES: string;
  projecT_CHANGE: string;
  companY_CHANGE: string;
  materiaL_CHANGE: string;
  seriaL_NO_CHANGE: string;
  temP_SI_ID: number;
  teleporT_ID: number;
}

interface FormState {
  teleporT_ID: string;
  doC_ID: string;
  projecT_ID: string;
  planT_ID: string;
  materiaL_ID: string;
  seriaL_NO: string;
  statuS_ID: string;
  projecT_TAR_ID: string;
  projecT_USE_ID: string;
  starT_DATE: string;
  enD_DATE: string;
  starT_RE_DATE: string;
  enD_RE_DATE: string;
  projecT_ID_CHANGE: string;
  planT_ID_CHANGE: string;
  seriaL_NO_CHANGE: string;
  materiaL_ID_CHANGE: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_DATA: RowData[] = Array.from({ length: 28 }, (_, i) => ({
  reQ_ID: `REQ-${String(i + 1).padStart(5, "0")}`,
  teleports: `Teleport ${(i % 3) + 1}`,
  porjects: `PRJ-${String((i % 5) + 1).padStart(3, "0")}`,
  companys: `Plant ${String.fromCharCode(65 + (i % 4))}`,
  materials: `MAT-${String((i % 8) + 1).padStart(4, "0")}`,
  serial: `SN-${(i * 7919 + 1234).toString(36).toUpperCase()}`,
  statuss: ["รอ MA อนุมัติใบเบิก", "อนุมัติ", "คืนแล้ว", "TP ยกเลิกเบิก", "MA ได้รับอุปกรณ์"][i % 5],
  statuS_IDS: [1, 9, 12, 14, 15][i % 5],
  projecT_TARGETS: `PRJ-T${String((i % 4) + 1).padStart(3, "0")}`,
  projecT_USEDS: `PRJ-U${String((i % 4) + 1).padStart(3, "0")}`,
  dates: `${String((i % 28) + 1).padStart(2, "0")}/01/2025`,
  returN_DATES:
    i % 3 === 0 ? "—" : `${String((i % 28) + 2).padStart(2, "0")}/01/2025`,
  projecT_CHANGE: `PRJ-C${String((i % 3) + 1).padStart(3, "0")}`,
  companY_CHANGE: `Plant ${String.fromCharCode(65 + (i % 3))}`,
  materiaL_CHANGE: `MAT-C${String((i % 4) + 1).padStart(4, "0")}`,
  seriaL_NO_CHANGE: `SN-${(i * 3571 + 9999).toString(36).toUpperCase()}`,
  temP_SI_ID: i + 100,
  teleporT_ID: (i % 3) + 1,
}));

const STATUS_COLOR: Record<string, string> = {
  รอดำเนินการ: "bg-amber-100 text-amber-700 border-amber-200",
  อนุมัติ: "bg-emerald-100 text-emerald-700 border-emerald-200",
  คืนแล้ว: "bg-sky-100 text-sky-700 border-sky-200",
  ยกเลิก: "bg-rose-100 text-rose-700 border-rose-200",
  รับแล้ว: "bg-violet-100 text-violet-700 border-violet-200",
};

// ─── Static Options ───────────────────────────────────────────────────────────

const OPT_PLANT = [
  { value: "Plant A", label: "Plant A" },
  { value: "Plant B", label: "Plant B" },
  { value: "Plant C", label: "Plant C" },
  { value: "Plant D", label: "Plant D" },
];

const OPT_MATERIAL = [1, 2, 3, 4].map((n) => ({
  value: `MAT-${String(n).padStart(4, "0")}`,
  label: `MAT-${String(n).padStart(4, "0")}`,
}));

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606Z" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const inputCls =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

// ─── Select Component (ใหม่) ──────────────────────────────────────────────────

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  valueKey = "value",   // default ให้ match กับ SelectOption
  labelKey = "label",   // default ให้ match กับ SelectOption
  required = false,
  loading = false,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options?: any[];
  valueKey?: string;
  labelKey?: string;
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled || loading}
          className={`${inputCls} appearance-none pr-7 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <option value="">กำลังโหลด...</option>
          ) : (
            <>
              <option value="">--- กรุณาเลือก ---</option>
              {options.map((item) => (
                <option key={item[valueKey]} value={item[valueKey]}>
                  {item[labelKey]}
                </option>
              ))}
            </>
          )}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
          {loading ? (
            <IconSpinner />
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

// ─── Search Form ──────────────────────────────────────────────────────────────

const BLANK_FORM: FormState = {
  teleporT_ID: "",
  doC_ID: "",
  projecT_ID: "",
  planT_ID: "",
  materiaL_ID: "",
  seriaL_NO: "",
  statuS_ID: "",
  projecT_TAR_ID: "",
  projecT_USE_ID: "",
  starT_DATE: "",
  enD_DATE: "",
  starT_RE_DATE: "",
  enD_RE_DATE: "",
  projecT_ID_CHANGE: "",
  planT_ID_CHANGE: "",
  seriaL_NO_CHANGE: "",
  materiaL_ID_CHANGE: "",
};

function SearchForm({
  onSearch,
  teleportOptions,
  projectOptions,
  statusOptions,
  plantOptions,   
  materialOptions,
  loading,
}: {
  onSearch: (form: FormState | null) => void;
  teleportOptions: SelectOption[];
  projectOptions: SelectOption[];
  statusOptions: SelectOption[];
  plantOptions: SelectOption[];
  materialOptions: SelectOption[];
  loading: boolean;
}) {
  const [form, setForm] = useState<FormState>(BLANK_FORM);

  const setField =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function handleReset() {
    setForm(BLANK_FORM);
    onSearch(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ใช้ valueKey="value" labelKey="label" เพราะ teleportOptions คือ SelectOption[] */}
        <Select
          label="Teleport"
          name="teleporT_ID"
          value={form.teleporT_ID}
          onChange={setField("teleporT_ID")}
          options={teleportOptions}
          loading={loading}
        />
        <div>
          <FieldLabel text="หมายเลขใบเบิก" />
          <input
            type="number"
            value={form.doC_ID}
            onChange={setField("doC_ID")}
            className={inputCls}
          />
        </div>
        <Select
          label="Project"
          name="projecT_ID"
          value={form.projecT_ID}
          onChange={setField("projecT_ID")}
          options={projectOptions}
          loading={loading}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Plant"
          name="planT_ID"
          value={form.planT_ID}
          onChange={setField("planT_ID")}
          options={plantOptions}     // ✅ เปลี่ยนจาก OPT_PLANT
          loading={loading}
        />
        <Select
          label="Material No."
          name="materiaL_ID"
          value={form.materiaL_ID}
          onChange={setField("materiaL_ID")}
          options={materialOptions}
        />
        <div>
          <FieldLabel text="Serial No." />
          <input
            type="text"
            value={form.seriaL_NO}
            onChange={setField("seriaL_NO")}
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Project Target"
          name="projecT_TAR_ID"
          value={form.projecT_TAR_ID}
          onChange={setField("projecT_TAR_ID")}
          options={projectOptions}
          loading={loading}
        />
        <Select
          label="Project Used"
          name="projecT_USE_ID"
          value={form.projecT_USE_ID}
          onChange={setField("projecT_USE_ID")}
          options={projectOptions}
          loading={loading}
        />
        <Select
          label="Status"
          name="statuS_ID"
          value={form.statuS_ID}
          onChange={setField("statuS_ID")}
          options={statusOptions}
          loading={loading}
        />
      </div>

      {/* Row 4 – วันที่เบิก */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <FieldLabel text="วันที่เบิก" />
          <input
            type="date"
            value={form.starT_DATE}
            onChange={setField("starT_DATE")}
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel text="ถึง" />
          <input
            type="date"
            value={form.enD_DATE}
            onChange={setField("enD_DATE")}
            className={inputCls}
          />
        </div>
        <div />
      </div>

      {/* Row 5 – วันที่คืน */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <FieldLabel text="วันที่คืน" />
          <input
            type="date"
            value={form.starT_RE_DATE}
            onChange={setField("starT_RE_DATE")}
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel text="ถึง" />
          <input
            type="date"
            value={form.enD_RE_DATE}
            onChange={setField("enD_RE_DATE")}
            className={inputCls}
          />
        </div>
        <div />
      </div>

      {/* อุปกรณ์สับเปลี่ยน */}
      <div className="border-t border-dashed border-slate-200 pt-4 space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          อุปกรณ์สับเปลี่ยน
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Project"
            name="projecT_ID_CHANGE"
            value={form.projecT_ID_CHANGE}
            onChange={setField("projecT_ID_CHANGE")}
            options={projectOptions}
            loading={loading}
          />
          <Select
            label="Plant"
            name="planT_ID_CHANGE"
            value={form.planT_ID_CHANGE}
            onChange={setField("planT_ID_CHANGE")}
            options={OPT_PLANT}
          />
          <div />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FieldLabel text="Serial" />
            <input
              type="text"
              value={form.seriaL_NO_CHANGE}
              onChange={setField("seriaL_NO_CHANGE")}
              className={inputCls}
            />
          </div>
          <Select
            label="Material"
            name="materiaL_ID_CHANGE"
            value={form.materiaL_ID_CHANGE}
            onChange={setField("materiaL_ID_CHANGE")}
            options={OPT_MATERIAL}
          />
          <div />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
        >
          <IconReset />
          ล้างค่า
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <IconSearch />
          ค้นหา
        </button>
      </div>
    </form>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

interface ColDef {
  key: string;
  label: string;
}

const COLS: ColDef[] = [
  { key: "actions", label: "คำสั่ง" },
  { key: "no", label: "ลำดับ" },
  { key: "reQ_ID", label: "หมายเลขใบเบิก" },
  { key: "teleports", label: "Teleport" },
  { key: "porjects", label: "Project" },
  { key: "companys", label: "Plant" },
  { key: "materials", label: "Material" },
  { key: "serial", label: "Serial No." },
  { key: "statuss", label: "Status" },
  { key: "projecT_TARGETS", label: "Project Target" },
  { key: "projecT_USEDS", label: "Project Used" },
  { key: "dates", label: "วันที่เบิก" },
  { key: "returN_DATES", label: "วันที่คืน" },
  { key: "projecT_CHANGE", label: "Project สับเปลี่ยน" },
  { key: "companY_CHANGE", label: "Plant สับเปลี่ยน" },
  { key: "materiaL_CHANGE", label: "Material สับเปลี่ยน" },
  { key: "seriaL_NO_CHANGE", label: "Serial สับเปลี่ยน" },
];

const MONO_KEYS = new Set(["reQ_ID", "serial", "seriaL_NO_CHANGE"]);

function DataTable({
  data,
  onEdit,
}: {
  data: RowData[];
  onEdit: (row: RowData) => void;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const rows = data.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const from = data.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min((safePage + 1) * PAGE_SIZE, data.length);

  function renderCell(col: ColDef, row: RowData, idx: number) {
    if (col.key === "actions") {
      return (
        <button
          onClick={() => onEdit(row)}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all"
        >
          <IconEdit /> แก้ไข
        </button>
      );
    }
    if (col.key === "no")
      return (
        <span className="text-slate-400 text-xs">
          {safePage * PAGE_SIZE + idx + 1}
        </span>
      );
    if (col.key === "statuss") {
      const v = row.statuss;
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[v] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
        >
          {v}
        </span>
      );
    }
    const raw = row[col.key as keyof RowData];
    const text = raw !== undefined && raw !== null ? String(raw) : "—";
    return (
      <span
        className={
          MONO_KEYS.has(col.key)
            ? "font-mono text-xs text-slate-700"
            : "text-sm text-slate-600"
        }
      >
        {text}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={COLS.length}
                  className="py-20 text-center text-sm text-slate-400"
                >
                  ไม่พบข้อมูล — กรุณากรอกเงื่อนไขแล้วกดค้นหา
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.reQ_ID}
                  className={`border-b border-slate-50 transition-colors hover:bg-blue-50/50 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                >
                  {COLS.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-2.5">
                      {renderCell(col, row, idx)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <p className="text-xs text-slate-400">
          แสดง{" "}
          <span className="font-semibold text-slate-600">
            {from}–{to}
          </span>{" "}
          จาก{" "}
          <span className="font-semibold text-slate-600">{data.length}</span>{" "}
          รายการ
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <IconChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, n) => n).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                safePage === n
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage === totalPages - 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaintenanceStoreTeleportPage() {
  const router = useRouter();
  const [tableData, setTableData] = useState<RowData[]>([]);

  const {
    teleportOptions,
    projectOptions,
    statusIcOptions,
    plantOptions,
    materialOptions,
    loading,
    error,
  } = useNocOptions();

  function handleSearch(form: FormState | null) {
    if (!form) {
      setTableData([]);
      return;
    }
    const result = DUMMY_DATA.filter((row) => {
      if (form.teleporT_ID && String(row.teleporT_ID) !== form.teleporT_ID)
        return false;
      if (form.statuS_ID && row.statuss !== form.statuS_ID) return false;
      if (form.planT_ID && row.companys !== form.planT_ID) return false;
      if (form.materiaL_ID && row.materials !== form.materiaL_ID) return false;
      if (form.seriaL_NO && !row.serial.includes(form.seriaL_NO.toUpperCase()))
        return false;
      return true;
    });
    setTableData(result);
  }

  function handleEdit(row: RowData) {
    alert(
      `Edit: ${row.reQ_ID} | Status: ${row.statuss} (ID: ${row.statuS_IDS})`,
    );
  }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 shadow-md">
//         <div className="mx-auto max-w-screen-2xl flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm font-medium text-white">
//             <span className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6" > IC {">"} Maintenance StoreTeleport</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-blue-100 text-xs">
//             <IconInfo />
//             <span>IC-03-01</span>
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="mx-auto max-w-screen-2xl px-6 py-6 space-y-5">
//         {error && (
//           <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//             ⚠️ โหลด dropdown ไม่สำเร็จ ({error}) — กรุณา refresh หน้าใหม่
//           </div>
//         )}

//         <div>
//           <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
//             เงื่อนไขการค้นหา
//           </p>
//           <SearchForm
//             onSearch={handleSearch}
//             teleportOptions={teleportOptions}
//             projectOptions={projectOptions}
//             statusOptions={statusIcOptions}
//             loading={loading}
//           />
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//               ผลลัพธ์การค้นหา
//             </p>
//             {tableData.length > 0 && (
//               <span className="text-xs text-slate-400">
//                 {tableData.length} รายการ
//               </span>
//             )}
//           </div>
//           <DataTable data={tableData} onEdit={handleEdit} />
//         </div>
//       </div>
//     </div>
//   );
return (
  <div className="min-h-screen bg-gray-200">
    {/* Top Header (Orange) */}
    <div className="bg-orange-500 h-16 flex items-center justify-end px-6 text-white font-medium shadow">
      <div className="w-full max-w-screen-2xl flex items-center justify-between px-6 mx-auto">
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

    {/* Content */}
    <div className="mx-auto max-w-screen-2xl px-6 py-6 space-y-5">
      {/* Page Title */}
      <div 
        onClick={() => router.push("/teleport-head")}
        className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6 cursor-pointer transition-all duration-300 hover:bg-[#162d6f] active:scale-95">
        IC &gt; Maintenance StoreTeleport
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          ⚠️ โหลด dropdown ไม่สำเร็จ ({error}) — กรุณา refresh หน้าใหม่
        </div>
      )}

      {/* Search Section */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          เงื่อนไขการค้นหา
        </p>
        <SearchForm
          onSearch={handleSearch}
          teleportOptions={teleportOptions}
          projectOptions={projectOptions}
          statusOptions={statusIcOptions}
          plantOptions={plantOptions}
          materialOptions={materialOptions}
          loading={loading}
        />
      </div>

      {/* Result Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ผลลัพธ์การค้นหา
          </p>
          {tableData.length > 0 && (
            <span className="text-xs text-slate-400">
              {tableData.length} รายการ
            </span>
          )}
        </div>

        <DataTable data={tableData} onEdit={handleEdit} />
      </div>
    </div>
  </div>
);

}