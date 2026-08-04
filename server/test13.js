import { query } from './db/pool.js';

async function run() {
  try {
    await query("ALTER TABLE trans_transportation_bills ADD COLUMN service_date DATE NULL");
    await query("ALTER TABLE trans_transportation_bills ADD COLUMN order_id INT NULL");
    await query("ALTER TABLE trans_transportation_bills ADD COLUMN cost_center_id INT NULL");
    console.log('Added missing columns');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
