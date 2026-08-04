import mysql from 'mysql2/promise';

async function run() {
  try {
    const con = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'multi_db'
    });
    
    const [columns] = await con.execute("SHOW COLUMNS FROM fin_tax_codes LIKE 'valid_pages'");
    console.log('Columns:', columns);
    
    const [rows] = await con.execute("SELECT valid_pages FROM fin_tax_codes WHERE name = 'Exempted'");
    console.log('Data:', rows);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
