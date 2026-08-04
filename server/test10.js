import { query } from './db/pool.js';

async function run() {
  try {
    const id = 1; // test with bill ID 1
    const rows = await query(
      `SELECT tb.*, s.supplier_name
       FROM trans_transportation_bills tb
       LEFT JOIN pur_suppliers s ON s.id = tb.supplier_id
       WHERE tb.id = ?`,
      [id]
    );
    const details = await query(
      `SELECT tbd.*, ii.item_name, ii.item_code
       FROM trans_transportation_bill_details tbd
       LEFT JOIN inv_items ii ON ii.id = tbd.item_id
       WHERE tbd.bill_id = ?`,
      [id]
    );
    // Map bill_details columns to what the form expects
    const mappedDetails = details.map(d => ({
      ...d,
      desc: d.description || d.item_name || "",
      qty: Number(d.quantity) || 0,
      rate: Number(d.unit_price) || 0,
      line_total: Number(d.total_amount) || 0,
    }));
    console.log(JSON.stringify({ success: true, item: rows[0] || {}, details: mappedDetails }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
