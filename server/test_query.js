import { query } from './db/pool.js';

async function run() {
  try {
    const res = await query(`
          SELECT tb.id, tb.bill_no, tb.bill_date,
                 tb.total_amount as net_amount,
                 COALESCE(tb.amount_paid, 0) as amount_paid,
                 (tb.total_amount - COALESCE(tb.amount_paid, 0)) as balance_amount,
                 COALESCE(tb.payment_status, 'UNPAID') as payment_status,
                 COALESCE(tb.due_date, tb.bill_date) as due_date,
                 s.supplier_name,
                 'Transportation' as source,
                 NULL as items
          FROM trans_transportation_bills tb
          LEFT JOIN pur_suppliers s ON tb.supplier_id = s.id
          WHERE tb.supplier_id = 24
    `);
    console.log(res);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
