// hooks/useNocOptions.ts
import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

interface NocOptionsRaw {
  teleports: { teleport_id: number; teleport_name: string; province: string }[];
  projects: { project_id: number; project_name: string }[];
  slas: { sla_id: number; sla_name: string }[];
  jobTypes: { job_type_id: number; job_type_name: string }[];
  priorities: { priority_id: number; priority_name: string }[];
  breakdownTypes: { breakdown_type_id: number; breakdown_type_name: string }[];
  statuses: { status_id: number; status_name: string }[];
  statusSlas: { status_sla_id: number; status_sla_name: string }[];
  causesSamart: { cause_id: number; cause_name: string }[];
  causesActivity: { cause_id: number; cause_name: string }[];
  causesCustomer: { cause_id: number; cause_name: string }[];
  causesOther: { cause_id: number; cause_name: string }[];
  operations: { operation_id: number; name: string }[];
  slaReasons: { sla_reason_id: number; name: string }[];
  samart: { samart_id: number; name: string }[];
  naturalDisasters: { disaster_id: number; name: string }[];
  customerCauses: { customer_cause_id: number; name: string }[];
  otherCauses: { other_cause_id: number; name: string }[];
  grades: { grade_id: number; name: string }[];
  persons: {
    person_id: number;
    full_name: string;
    nickname: string;
    teleport_id: number;
    teleport_name: string;
    province: string;
  }[];
  vehicles: {
    vehicle_id: number;
    license_plate: string;
    vehicle_type: string;
    teleport_id: number;
    teleport_name: string;
    province: string;
  }[];
  statusIc: { status_ic_id: number; name: string }[];
  plants: { plant_id: number; plant_code: string; plant_name: string }[];
  materials: {
    material_id: number;
    material_no: string;
    material_name: string;
    material_type: string;
    unit: string;
  }[];
  conditions: { code: string; name: string }[];
}

export interface NocOptions {
  teleportOptions: SelectOption[];
  projectOptions: SelectOption[];
  slaOptions: SelectOption[];
  jobTypeOptions: SelectOption[];
  priorityOptions: SelectOption[];
  breakdownTypeOptions: SelectOption[];
  statusOptions: SelectOption[];
  statusSlaOptions: SelectOption[];
  causesSamartOptions: SelectOption[];
  causesActivityOptions: SelectOption[];
  causesCustomerOptions: SelectOption[];
  causesOtherOptions: SelectOption[];
  operationOptions: SelectOption[];
  slaReasonOptions: SelectOption[];
  samartOptions: SelectOption[];
  naturalDisasterOptions: SelectOption[];
  customerCauseOptions: SelectOption[];
  otherCauseOptions: SelectOption[];
  gradeOptions: SelectOption[];
  personOptions: SelectOption[];
  vehicleOptions: SelectOption[];
  statusIcOptions: SelectOption[];
  plantOptions: SelectOption[];
  materialOptions: SelectOption[];
  conditionOptions: SelectOption[];
  loading: boolean;
  error: string | null;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const withAll = (opts: SelectOption[]): SelectOption[] => [
  //{ value: "", label: "ทั้งหมด" },
  ...opts,
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNocOptions(): NocOptions {
  const [data, setData] = useState<NocOptionsRaw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/noc/options");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: NocOptionsRaw = await res.json();
        setData(json);
      } catch (err) {
        console.error("useNocOptions error:", err);
        setError(err instanceof Error ? err.message : "โหลด options ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }

    fetch_();
  }, []);

  // ── แปลง raw rows → SelectOption[] ─────────────────────────────────────────
  const teleportOptions = withAll(
    (data?.teleports ?? []).map((t) => ({
      value: String(t.teleport_id),
      label: t.teleport_name,
    })),
  );

  const projectOptions = withAll(
    (data?.projects ?? []).map((p) => ({
      value: String(p.project_id),
      label: p.project_name,
    })),
  );

  const slaOptions = withAll(
    (data?.slas ?? []).map((s) => ({
      value: String(s.sla_id),
      label: s.sla_name,
    })),
  );

  const jobTypeOptions = withAll(
    (data?.jobTypes ?? []).map((j) => ({
      value: String(j.job_type_id),
      label: j.job_type_name,
    })),
  );

  const priorityOptions = withAll(
    (data?.priorities ?? []).map((p) => ({
      value: String(p.priority_id),
      label: p.priority_name,
    })),
  );

  const breakdownTypeOptions = withAll(
    (data?.breakdownTypes ?? []).map((b) => ({
      value: String(b.breakdown_type_id),
      label: b.breakdown_type_name,
    })),
  );

  const statusOptions = withAll(
    (data?.statuses ?? []).map((s) => ({
      value: String(s.status_id),
      label: s.status_name,
    })),
  );

  const statusSlaOptions = withAll(
    (data?.statusSlas ?? []).map((s) => ({
      value: String(s.status_sla_id),
      label: s.status_sla_name,
    })),
  );

  const causesSamartOptions = withAll(
    (data?.causesSamart ?? []).map((c) => ({
      value: String(c.cause_id),
      label: c.cause_name,
    })),
  );

  const causesActivityOptions = withAll(
    (data?.causesActivity ?? []).map((c) => ({
      value: String(c.cause_id),
      label: c.cause_name,
    })),
  );

  const causesCustomerOptions = withAll(
    (data?.causesCustomer ?? []).map((c) => ({
      value: String(c.cause_id),
      label: c.cause_name,
    })),
  );

  const causesOtherOptions = withAll(
    (data?.causesOther ?? []).map((c) => ({
      value: String(c.cause_id),
      label: c.cause_name,
    })),
  );

  const operationOptions = withAll(
    (data?.operations ?? []).map((o) => ({
      value: String(o.operation_id),
      label: o.name,
    })),
  );

  const slaReasonOptions = withAll(
    (data?.slaReasons ?? []).map((s) => ({
      value: String(s.sla_reason_id),
      label: s.name,
    })),
  );

  const samartOptions = withAll(
    (data?.samart ?? []).map((s) => ({
      value: String(s.samart_id),
      label: s.name,
    })),
  );

  const naturalDisasterOptions = withAll(
    (data?.naturalDisasters ?? []).map((n) => ({
      value: String(n.disaster_id),
      label: n.name,
    })),
  );

  const customerCauseOptions = withAll(
    (data?.customerCauses ?? []).map((c) => ({
      value: String(c.customer_cause_id),
      label: c.name,
    })),
  );

  const otherCauseOptions = withAll(
    (data?.otherCauses ?? []).map((o) => ({
      value: String(o.other_cause_id),
      label: o.name,
    })),
  );

  const gradeOptions = withAll(
    (data?.grades ?? []).map((g) => ({
      value: String(g.grade_id),
      label: g.name,
    })),
  );

  const personOptions = withAll(
    (data?.persons ?? []).map((p) => ({
      value: String(p.person_id),
      label: p.nickname ? `${p.full_name} (${p.nickname})` : p.full_name,
    })),
  );

  const vehicleOptions = withAll(
    (data?.vehicles ?? []).map((v) => ({
      value: String(v.vehicle_id),
      label: `${v.license_plate}${v.vehicle_type ? ` – ${v.vehicle_type}` : ""}`,
    })),
  );

  const statusIcOptions = withAll(
    (data?.statusIc ?? []).map((s) => ({
      value: String(s.status_ic_id),
      label: s.name,
    })),
  );

  const plantOptions = withAll(
    (data?.plants ?? []).map((p) => ({
      value: String(p.plant_id),
      label: `${p.plant_code} – ${p.plant_name}`,
    })),
  );

  const materialOptions = withAll(
    (data?.materials ?? []).map((m) => ({
      value: String(m.material_id),
      label: `${m.material_no} – ${m.material_name}`,
    })),
  );

  const conditionOptions = withAll(
    (data?.conditions ?? []).map((c) => ({
      value: c.code,
      label: c.name,
    })),
  );

  return {
    teleportOptions,
    projectOptions,
    slaOptions,
    jobTypeOptions,
    priorityOptions,
    breakdownTypeOptions,
    statusOptions,
    statusSlaOptions,
    causesSamartOptions,
    causesActivityOptions,
    causesCustomerOptions,
    causesOtherOptions,
    operationOptions,
    slaReasonOptions,
    samartOptions,
    naturalDisasterOptions,
    customerCauseOptions,
    otherCauseOptions,
    gradeOptions,
    personOptions,
    vehicleOptions,
    statusIcOptions,
    plantOptions,
    materialOptions,
    conditionOptions,
    loading,
    error,
  };
}
