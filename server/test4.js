import { query } from './db/pool.js';

async function run() {
  try {
    const columns = await query("SHOW COLUMNS FROM fin_tax_codes LIKE 'valid_pages'");
    console.log('Columns:', columns);
    
    const rows = await query("SELECT valid_pages FROM fin_tax_codes WHERE name = 'Exempted'");
    console.log('Data:', rows);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
