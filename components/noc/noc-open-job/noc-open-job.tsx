"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NocOpenJobPage() {
  const router = useRouter();

  const [options, setOptions] = useState<any>({
    projects: [],
    slas: [],
    jobTypes: [],
    priorities: [],
    breakdownTypes: [],
    statuses: [],
    statusSlas: [],
    causesSamart: [],
    causesActivity: [],
    causesCustomer: [],
    causesOther: [],
  });

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchOptions();
  // }, []);

  // เปลี่ยนเป็น
  useEffect(() => {
    fetchOptions();

    const now = toLocalDateTimeString(new Date());
    const close = toLocalDateTimeString(
      new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
    );
    setForm((prev: any) => ({
      ...prev,
      openDate: now,
      closeDate: close,
    }));
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch("/api/noc/options");
      const data = await res.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  // const getCurrentDateTime = () => {
  //   const now = new Date();
  //   return now.toISOString().slice(0, 19);
  // };

  // const calculateCloseDate = (openDateStr: string) => {
  //   if (!openDateStr) return "";
  //   const openDate = new Date(openDateStr);
  //   openDate.setHours(openDate.getHours() + 4);
  //   return openDate.toISOString().slice(0, 19);
  // };

  // const currentDateTime = getCurrentDateTime();

  //   const [form, setForm] = useState<any>({
  //   openDate: currentDateTime,
  //   closeDate: calculateCloseDate(currentDateTime),
  // });

  // เปลี่ยนเป็น
  const toLocalDateTimeString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 19);
  };

  const calculateCloseDate = (openDateStr: string) => {
    if (!openDateStr) return "";
    const openDate = new Date(openDateStr);
    const closeDate = new Date(openDate.getTime() + 4 * 60 * 60 * 1000);
    return toLocalDateTimeString(closeDate);
  };

  // เปลี่ยนเป็น
  const [form, setForm] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "openDate") {
      setForm({
        ...form,
        [name]: value,
        closeDate: calculateCloseDate(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.project || !form.customerName || !form.problemDetail) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/noc/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // project_id: form.project,
          // customer_name: form.customerName,
          // location: form.location,
          // sla_id: form.sla,
          // reporter_name: form.reporter,
          // reporter_phone: form.phone,
          // job_type_id: form.jobType,
          // problem_detail: form.problemDetail,
          // required_close_datetime: form.closeDate,
          // priority_id: form.priority,
          // breakdown_type_id: form.breakdownType,
          // status_id: form.status,
          // status_sla_id: form.statusSla,
          // cause_samart_id: form.cause_samart_id,
          // cause_activity_id: form.cause_activity_id,
          // cause_customer_id: form.cause_customer_id,
          // cause_other_id: form.cause_other_id,
          // created_by: "สุจิตรา",

          project_id: form.project,
          customer_name: form.customerName,
          location: form.location,
          sla_id: form.sla,
          reporter_name: form.reporter,
          reporter_phone: form.phone,
          job_type_id: form.jobType,
          problem_detail: form.problemDetail,
          required_close_datetime: form.closeDate,

          priority_id: form.priority,
          breakdown_type_id: form.breakdownType,
          status_id: form.status,
          status_sla_id: form.statusSla,
          repair_note: form.note,
          job_status: null,
          status_reason: null,

          cause_samart_id: form.cause_samart_id,
          cause_activity_id: form.cause_activity_id,
          cause_customer_id: form.cause_customer_id,
          cause_other_id: form.cause_other_id,

          created_by: "สุจิตรา",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("สร้างงานสำเร็จ 🎉");
        console.log(data);
        router.push("/noc");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg font-semibold mb-6">
            Noc Open Job
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white">
                <Input
                  label="เลขที่งาน"
                  name="jobNo"
                  value={form.jobNo || ""}
                  disabled
                />
              </div>

              <div className="bg-white">
                <Input
                  label="Service No"
                  name="serviceNo"
                  value={form.serviceNo || ""}
                  disabled
                />
              </div>

              <div className="bg-white">
                <Input
                  label="วันเวลาที่เปิด"
                  name="openDate"
                  type="datetime-local"
                  value={form.openDate || ""}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="bg-white">
                <Input
                  label="วันเวลาที่ต้องปิด"
                  name="closeDate"
                  type="datetime-local"
                  value={form.closeDate || ""}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="bg-white">
                <Select
                  label="โครงการ"
                  name="project"
                  onChange={handleChange}
                  options={options.projects}
                  valueKey="project_id"
                  labelKey="project_name"
                  required
                />
              </div>
              <div className="bg-white">
                <Input
                  label="ชื่อสาขา"
                  name="customerName"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="bg-white">
                <Input
                  label="ที่ตั้ง"
                  name="location"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="bg-white">
                <Select
                  label="SLA"
                  name="sla"
                  onChange={handleChange}
                  options={options.slas}
                  valueKey="sla_id"
                  labelKey="sla_name"
                  required
                />
              </div>

              <div className="bg-white">
                <Input
                  label="ชื่อผู้แจ้ง"
                  name="reporter"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="bg-white">
                <Input
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-1 bg-white">
                <Select
                  label="ประเภทงาน"
                  name="jobType"
                  onChange={handleChange}
                  options={options.jobTypes}
                  valueKey="job_type_id"
                  labelKey="job_type_name"
                  required
                />
              </div>

              <div className="col-span-3 bg-white">
                <Textarea
                  label="รายละเอียดปัญหา"
                  name="problemDetail"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION ================= */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Operation Card */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="font-semibold mb-4 text-gray-700">
                การปฏิบัติงาน (Operation)
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="วันที่รับงาน"
                  name="openDate"
                  type="datetime-local"
                  value={form.openDate || ""}
                  onChange={handleChange}
                  disabled
                />
                <Select
                  label="ประเภทงาน"
                  name="jobType"
                  onChange={handleChange}
                  options={options.jobTypes}
                  valueKey="job_type_id"
                  labelKey="job_type_name"
                  required
                />

                <Select
                  label="ความสำคัญ"
                  name="priority"
                  onChange={handleChange}
                  options={options.priorities}
                  valueKey="priority_id"
                  labelKey="priority_name"
                  required
                />

                <Select
                  label="ประเภทเหตุเสีย"
                  name="breakdownType"
                  onChange={handleChange}
                  options={options.breakdownTypes}
                  valueKey="breakdown_type_id"
                  labelKey="breakdown_type_name"
                  required
                />

                <Select
                  label="สถานะดำเนินการ"
                  name="status"
                  onChange={handleChange}
                  options={options.statuses}
                  valueKey="status_id"
                  labelKey="status_name"
                  required
                />

                <Select
                  label="สถานะดำเนินการ SLA"
                  name="statusSla"
                  onChange={handleChange}
                  options={options.statusSlas}
                  valueKey="status_sla_id"
                  labelKey="status_sla_name"
                  required
                />

                <div className="col-span-2">
                  <Textarea
                    label="บันทึกการแก้ไข"
                    name="note"
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="สถานะงาน"
                  name="cause"
                  onChange={handleChange}
                  required
                />
                <Input
                  label="เหตุผลสถานะ"
                  name="reason"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Cause of Breakdown Card */}
            <div className="bg-white p-4 rounded-2xl shadow self-start">
              <h2 className="font-semibold mb-4 text-gray-700">
                สาเหตุการเสีย (Cause of breakdown)
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Samart"
                  name="cause_samart_id"
                  onChange={handleChange}
                  options={options.causesSamart}
                  valueKey="cause_id"
                  labelKey="cause_name"
                  //required
                />

                <Select
                  label="ภัยธรรมชาติ"
                  name="cause_activity_id"
                  onChange={handleChange}
                  options={options.causesActivity}
                  valueKey="cause_id"
                  labelKey="cause_name"
                  //required
                />

                <Select
                  label="ลูกค้า"
                  name="cause_customer_id"
                  onChange={handleChange}
                  options={options.causesCustomer}
                  valueKey="cause_id"
                  labelKey="cause_name"
                  //required
                />

                <Select
                  label="อื่นๆ"
                  name="cause_other_id"
                  onChange={handleChange}
                  options={options.causesOther}
                  valueKey="cause_id"
                  labelKey="cause_name"
                  //required
                />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/noc")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Input({
  label,
  name,
  type = "text",
  onChange,
  disabled = false,
  value,
  required = false, // 👈 เพิ่มตรงนี้
}: {
  label: string;
  name: string;
  type?: string;
  onChange?: any;
  disabled?: boolean;
  value?: string;
  required?: boolean; // 👈 เพิ่มตรงนี้
}) {
  return (
    <div>
      <label className="text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required} // 👈 ใส่ required จริง
        step={type === "datetime-local" ? "1" : undefined}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm 
        focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function Select({
  label,
  name,
  onChange,
  options = [],
  valueKey = "id",
  labelKey = "name",
  required = false, // 👈 เพิ่ม
}: {
  label: string;
  name: string;
  onChange: any;
  options?: any[];
  valueKey?: string;
  labelKey?: string;
  required?: boolean; // 👈 เพิ่ม
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
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
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

function Textarea({
  label,
  name,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  onChange: any;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        name={name}
        rows={3}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
      />
    </div>
  );
}
