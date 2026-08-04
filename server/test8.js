import { query } from './db/pool.js';

async function run() {
  try {
    const companyId = 1; // adjust if needed
    
    // Test: find account SU-000018
    const accounts = await query(
      `SELECT id, code, name FROM fin_accounts WHERE code = ? AND company_id = ?`,
      ['SU-000018', companyId]
    );
    console.log('Account:', JSON.stringify(accounts));
    
    if (!accounts.length) {
      // try by name
      const accs2 = await query(
        `SELECT id, code, name FROM fin_accounts WHERE name LIKE ? AND company_id = ? LIMIT 5`,
        ['%SU-000018%', companyId]
      );
      console.log('Account (name search):', JSON.stringify(accs2));
    }
    
    // Find supplier linked to this code
    const suppliers = await query(
      `SELECT id, supplier_code, supplier_name FROM pur_suppliers WHERE company_id = ? AND (supplier_code = ? OR supplier_name LIKE ?) LIMIT 5`,
      [companyId, 'SU-000018', '%SU-000018%']
    );
    console.log('Suppliers:', JSON.stringify(suppliers));
    
    // Check transportation bills for any supplier
    const transBills = await query(
      `SELECT tb.id, tb.bill_no, tb.supplier_id, tb.payment_status, tb.status, s.supplier_name, s.supplier_code 
       FROM trans_transportation_bills tb 
       LEFT JOIN pur_suppliers s ON s.id = tb.supplier_id 
       WHERE tb.company_id = ? 
       ORDER BY tb.id DESC LIMIT 10`,
      [companyId]
    );
    console.log('Trans Bills:', JSON.stringify(transBills));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
