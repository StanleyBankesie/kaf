import { query } from './db/pool.js';

async function run() {
  try {
    const r = await query(
      "UPDATE trans_transportation_bills SET status = 'POSTED' WHERE status = 'DRAFT' OR status IS NULL"
    );
    console.log('Updated', r.affectedRows, 'bills to POSTED');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
