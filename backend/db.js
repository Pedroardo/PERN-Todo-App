import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "Pedroardo100",
  host: "localhost",
  port: "5432",
  database: "todo-app",
});

export default pool;
