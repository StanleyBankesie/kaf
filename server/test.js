import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  const [columns] = await con.execute("SHOW COLUMNS FROM fin_tax_codes LIKE 'valid_pages'");
  console.log('Columns:', columns);
  
  const [rows] = await con.execute("SELECT valid_pages FROM fin_tax_codes WHERE name = 'Exempted'");
  console.log('Data:', rows);
  
  process.exit(0);
}
run();
