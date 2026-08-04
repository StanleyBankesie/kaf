import { query } from './db/pool.js';

async function run() {
  try {
    const columns = await query("SHOW COLUMNS FROM trans_transportation_bills");
    console.log('Columns of trans_transportation_bills:', columns.map(c => c.Field));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
