import { query } from './db/pool.js';

async function run() {
  try {
    await query("ALTER TABLE trans_fuel_logs ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING'");
    console.log('Added status column');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
