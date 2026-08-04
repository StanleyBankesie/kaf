import { query } from './db/pool.js';

async function run() {
  try {
    const cols = await query("SHOW COLUMNS FROM trans_expense_logs");
    console.log('Columns:', cols.map(c => `${c.Field} (${c.Type})`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
