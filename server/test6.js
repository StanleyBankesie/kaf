import { query } from './db/pool.js';

async function run() {
  try {
    const cols = await query("SHOW COLUMNS FROM trans_transportation_bills");
    const names = cols.map(c => c.Field);
    
    if (!names.includes('amount_paid')) {
      await query("ALTER TABLE trans_transportation_bills ADD COLUMN amount_paid DECIMAL(15,2) DEFAULT 0.00");
      console.log("Added amount_paid");
    }
    if (!names.includes('payment_status')) {
      await query("ALTER TABLE trans_transportation_bills ADD COLUMN payment_status VARCHAR(30) DEFAULT 'UNPAID'");
      console.log("Added payment_status");
    }
    if (!names.includes('due_date')) {
      await query("ALTER TABLE trans_transportation_bills ADD COLUMN due_date DATE NULL");
      console.log("Added due_date");
    }
    if (!names.includes('branch_id')) {
      await query("ALTER TABLE trans_transportation_bills ADD COLUMN branch_id INT NULL");
      console.log("Added branch_id");
    }
    
    console.log("trans_transportation_bills schema verification complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
