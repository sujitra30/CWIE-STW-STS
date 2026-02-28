import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "noc_job_system",
  password: "sujitra30",
  port: 5432,
});
