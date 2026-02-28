// import { NextResponse } from "next/server";
// import { Pool } from "pg";
// import * as XLSX from "xlsx";

// export const runtime = "nodejs";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "noc_job_system",
//   password: "sujitra30",
//   port: 5432,
// });

// export async function POST(req: Request) {
//   let client;
  
//   try {
//     const { jobType, startDate, endDate } = await req.json();

//     console.log("Export request data:", { jobType, startDate, endDate });

//     if (!startDate || !endDate) {
//       return NextResponse.json(
//         { error: "Date range required" },
//         { status: 400 }
//       );
//     }

//     client = await pool.connect();

//     // ใช้ jobType ตรงๆ ไม่ต้องแปลง เพราะใน DB เป็น "Job CM" / "Job PM"
//     const result = await client.query(
//       `
//       SELECT
//         TO_CHAR(open_datetime, 'DD/MM/YYYY HH24:MI') AS "วันเวลาที่เปิดงาน",
//         service_no AS "Service No.",
//         project_name AS "โครงการ",
//         job_type_name AS "ประเภทงาน",
//         breakdown_type_name AS "ประเภทเหตุเสีย",
//         COALESCE(
//           NULLIF(
//             CONCAT_WS(', ',
//               NULLIF(cause_samart, ''),
//               NULLIF(cause_activity, ''),
//               NULLIF(cause_customer, ''),
//               NULLIF(cause_other, '')
//             ), 
//             ''
//           ),
//           '-'
//         ) AS "สาเหตุการเสีย",
//         COALESCE(reporter_name, '-') AS "ชื่อผู้แจ้ง",
//         COALESCE(reporter_phone, '-') AS "เบอร์โทรศัพท์",
//         problem_detail AS "รายละเอียดปัญหา"

        
//       FROM vw_noc_jobs_full
//       WHERE open_datetime BETWEEN $1 AND $2
//         AND job_type_name = $3
//       ORDER BY open_datetime DESC
//       `,
//       [`${startDate} 00:00:00`, `${endDate} 23:59:59`, jobType]
//     );

//     console.log("Query result rows:", result.rows.length);

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: "No data found" },
//         { status: 404 }
//       );
//     }

//     const worksheet = XLSX.utils.json_to_sheet(result.rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "buffer",
//     });

//     console.log("Excel created successfully, size:", excelBuffer.length);

//     return new NextResponse(excelBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition":
//           `attachment; filename="export_jobs_${startDate}_${endDate}.xlsx"`,
//       },
//     });
//   } catch (error) {
//     console.error("EXPORT ERROR:", error);
    
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//     }
    
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Export failed" },
//       { status: 500 }
//     );
//   } finally {
//     if (client) {
//       client.release();
//     }
//   }
// }


import { NextResponse } from "next/server";
import { Pool } from "pg";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "noc_job_system",
  password: "sujitra30",
  port: 5432,
});

export async function POST(req: Request) {
  let client;

  try {
    const { jobType, startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Date range required" },
        { status: 400 }
      );
    }

    client = await pool.connect();

    const result = await client.query(
      `
      SELECT
        TO_CHAR(open_datetime, 'DD/MM/YYYY HH24:MI')          AS "วันเวลาที่เปิดงาน",
        job_no                                                  AS "เลขที่งาน",
        service_no                                             AS "Service No.",
        COALESCE(project_name, '-')                            AS "โครงการ",
        COALESCE(customer_name, '-')                           AS "ชื่อสาขา",
        COALESCE(location, '-')                                AS "สถานที่",
        COALESCE(sla_name, '-')                                AS "SLA",
        COALESCE(reporter_name, '-')                           AS "ชื่อผู้แจ้ง",
        COALESCE(reporter_phone, '-')                          AS "เบอร์โทรศัพท์",
        COALESCE(job_type_name, '-')                           AS "ประเภทงาน",
        COALESCE(problem_detail, '-')                          AS "รายละเอียดปัญหา",
        COALESCE(operation_type, '-')                          AS "ดำเนินการ",
        COALESCE(priority, '-')                                AS "ความสำคัญ",
        COALESCE(breakdown_type_name, '-')                     AS "ประเภทเหตุเสีย",
        COALESCE(status_name, '-')                             AS "สถานะงาน",
        COALESCE(status_sla_name, '-')                         AS "สถานะ SLA",
        COALESCE(repair_note, '-')                             AS "หมายเหตุการซ่อม",
        COALESCE(job_status, '-')                              AS "Job Status",
        COALESCE(status_reason, '-')                           AS "เหตุผลสถานะ",
        COALESCE(
          NULLIF(CONCAT_WS(', ',
            NULLIF(cause_samart, ''),
            NULLIF(cause_activity, ''),
            NULLIF(cause_customer, ''),
            NULLIF(cause_other, '')
          ), ''),
          '-'
        )                                                       AS "สาเหตุการเสีย",
        COALESCE(cause_samart, '-')                            AS "สาเหตุ (Samart)",
        COALESCE(cause_activity, '-')                          AS "สาเหตุ (Activity)",
        COALESCE(cause_customer, '-')                          AS "สาเหตุ (ลูกค้า)",
        COALESCE(cause_other, '-')                             AS "สาเหตุ (อื่นๆ)",
        TO_CHAR(required_close_datetime, 'DD/MM/YYYY HH24:MI') AS "กำหนดปิดงาน",
        TO_CHAR(receive_datetime, 'DD/MM/YYYY HH24:MI')        AS "วันเวลารับงาน",
        TO_CHAR(actual_close_datetime, 'DD/MM/YYYY HH24:MI')   AS "วันเวลาปิดงานจริง",
        ROUND(duration_hours::numeric, 2)                      AS "ระยะเวลา (ชั่วโมง)",
        COALESCE(created_by, '-')                              AS "ผู้สร้างงาน",
        TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI')             AS "วันเวลาสร้างงาน",
        COALESCE(updated_by, '-')                              AS "ผู้แก้ไขล่าสุด",
        TO_CHAR(updated_at, 'DD/MM/YYYY HH24:MI')             AS "วันเวลาแก้ไขล่าสุด"

      FROM vw_noc_jobs_full
      WHERE open_datetime BETWEEN $1 AND $2
        AND job_type_name = $3
      ORDER BY open_datetime DESC
      `,
      [`${startDate} 00:00:00`, `${endDate} 23:59:59`, jobType]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No data found" },
        { status: 404 }
      );
    }

    // ปรับความกว้างคอลัมน์อัตโนมัติ
    const worksheet = XLSX.utils.json_to_sheet(result.rows);
    const colWidths = Object.keys(result.rows[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...result.rows.map((row) => String(row[key] ?? "").length)
      ),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="export_jobs_${startDate}_${endDate}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}