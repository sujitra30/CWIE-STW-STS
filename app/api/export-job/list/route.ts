// import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";

// // *** สำคัญ: ต้องมีเหมือน export route ***
// export const runtime = "nodejs";

// // *** ใช้ config ตรงๆ เหมือน export route ที่ทำงานได้ ***
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "noc_job_system",
//   password: "sujitra30",
//   port: 5432,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { jobType, startDate, endDate } = await req.json();

//     if (!startDate || !endDate) {
//       return NextResponse.json(
//         { error: "Date range required" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();

//     // *** ใช้ BETWEEN เหมือน export route ที่ทำงานได้ ***
//     const result = await client.query(
//       `
//       SELECT
//         TO_CHAR(j.open_datetime, 'DD/MM/YYYY HH24:MI') AS open_datetime,
//         j.service_no,
//         p.project_name,
//         jt.job_type_name,
//         bt.breakdown_type_name,
//         COALESCE(
//           NULLIF(CONCAT_WS(', ',
//             NULLIF(j.cause_samart, ''),
//             NULLIF(j.cause_activity, ''),
//             NULLIF(j.cause_customer, ''),
//             NULLIF(j.cause_other, '')
//           ), ''),
//         '-') AS cause,
//         COALESCE(j.reporter_name, '-')  AS reporter_name,
//         COALESCE(j.reporter_phone, '-') AS reporter_phone
//       FROM noc_jobs j
//       LEFT JOIN projects p         ON j.project_id       = p.project_id
//       LEFT JOIN job_types jt       ON j.job_type_id      = jt.job_type_id
//       LEFT JOIN breakdown_types bt ON j.breakdown_type_id = bt.breakdown_type_id
//       WHERE j.is_deleted = false
//         AND j.open_datetime BETWEEN $1 AND $2
//       ORDER BY j.open_datetime DESC
//       `,
//       [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
//     );

//     client.release();

//     return NextResponse.json(result.rows);
//   } catch (err) {
//     console.error("DB Error:", err);
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";

// export const runtime = "nodejs";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "noc_job_system",
//   password: "sujitra30",
//   port: 5432,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { jobType, startDate, endDate } = await req.json();

//     if (!startDate || !endDate) {
//       return NextResponse.json(
//         { error: "Date range required" },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();

//     // กรองตาม jobType
//     const jobTypeCondition = jobType === "Job CM" 
//       ? "AND jt.job_type_name = 'CM'"
//       : "AND jt.job_type_name = 'PM'";

//     const result = await client.query(
//       `
//       SELECT
//         TO_CHAR(j.open_datetime, 'DD/MM/YYYY HH24:MI') AS open_datetime,
//         j.service_no,
//         p.project_name,
//         jt.job_type_name,
//         bt.breakdown_type_name,
//         COALESCE(
//           NULLIF(CONCAT_WS(', ',
//             NULLIF(j.cause_samart, ''),
//             NULLIF(j.cause_activity, ''),
//             NULLIF(j.cause_customer, ''),
//             NULLIF(j.cause_other, '')
//           ), ''),
//         '-') AS cause,
//         COALESCE(j.reporter_name, '-') AS reporter_name,
//         COALESCE(j.reporter_phone, '-') AS reporter_phone
//       FROM noc_jobs j
//       LEFT JOIN projects p ON j.project_id = p.project_id
//       LEFT JOIN job_types jt ON j.job_type_id = jt.job_type_id
//       LEFT JOIN breakdown_types bt ON j.breakdown_type_id = bt.breakdown_type_id
//       WHERE j.is_deleted = false
//         AND j.open_datetime BETWEEN $1 AND $2
//         ${jobTypeCondition}
//       ORDER BY j.open_datetime DESC
//       `,
//       [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
//     );

//     client.release();

//     return NextResponse.json(result.rows);
//   } catch (err) {
//     console.error("DB Error:", err);
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "noc_job_system",
  password: "sujitra30",
  port: 5432,
});

export async function POST(req: NextRequest) {
  let client;
  
  try {
    const { jobType, startDate, endDate } = await req.json();

    console.log("List request data:", { jobType, startDate, endDate });

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Date range required" },
        { status: 400 }
      );
    }

    client = await pool.connect();

    // ใช้ jobType ตรงๆ ไม่ต้องแปลง เพราะใน DB เป็น "Job CM" / "Job PM"
    const result = await client.query(
      `
      SELECT
        TO_CHAR(open_datetime, 'DD/MM/YYYY HH24:MI') AS open_datetime,
        service_no,
        project_name,
        job_type_name,
        breakdown_type_name,
        COALESCE(
          NULLIF(
            CONCAT_WS(', ',
              NULLIF(cause_samart, ''),
              NULLIF(cause_activity, ''),
              NULLIF(cause_customer, ''),
              NULLIF(cause_other, '')
            ), 
            ''
          ),
          '-'
        ) AS cause,
        COALESCE(reporter_name, '-') AS reporter_name,
        COALESCE(reporter_phone, '-') AS reporter_phone
      FROM vw_noc_jobs_full
      WHERE open_datetime BETWEEN $1 AND $2
        AND job_type_name = $3
      ORDER BY open_datetime DESC
      `,
      [`${startDate} 00:00:00`, `${endDate} 23:59:59`, jobType]
    );

    console.log("List result rows:", result.rows.length);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    
    if (err instanceof Error) {
      console.error("Error message:", err.message);
    }
    
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}