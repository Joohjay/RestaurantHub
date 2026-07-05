import pg from "pg";
import { env } from "./config/env.js";

const { Pool } = pg;

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

export default pool;
