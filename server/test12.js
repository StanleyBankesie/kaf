import { query } from './db/pool.js';

async function run() {
  try {
    await query("ALTER TABLE trans_transportation_bills ADD COLUMN currency_id INT DEFAULT 4");
    await query("ALTER TABLE trans_transportation_bills ADD COLUMN exchange_rate DECIMAL(15,6) DEFAULT 1.000000");
    console.log('Added currency columns');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
