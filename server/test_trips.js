import { pool } from "./db/pool.js";
async function run() {
  try {
    const [res] = await pool.query('DESCRIBE trans_expense_logs');
    console.log("trans_expense_logs schema:");
    console.log(res.map(r => r.Field).join(", "));
  } catch(e) {}
  process.exit();
}
run();
