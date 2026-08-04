import { query } from './db/pool.js';

async function run() {
  try {
    const companyId = 1; // Assuming companyId 1
    const branchId = 1;
    const accountCode = 'SU-000018';
    const supplierRows = await query(
          `SELECT id, supplier_code, supplier_name 
           FROM pur_suppliers 
           WHERE company_id = ? AND supplier_code = ?
           LIMIT 1`,
          [companyId, accountCode]
        );
    const supplierId = supplierRows[0].id;

    const sql = `
        SELECT id, bill_no, bill_date, net_amount, amount_paid, balance_amount,
               payment_status, due_date, supplier_name, source, items
        FROM (
          SELECT b.id, b.bill_no, b.bill_date, b.net_amount, b.amount_paid,
                 (b.net_amount - COALESCE(b.amount_paid, 0)) as balance_amount,
                 b.payment_status, b.due_date, s.supplier_name,
                 'Purchase' as source,
                 NULL as items
          FROM pur_bills b
          LEFT JOIN pur_suppliers s ON b.supplier_id = s.id
          WHERE b.supplier_id = ?
            AND b.company_id = ?
            AND (b.branch_id = ? OR b.branch_id IS NULL)
            AND (b.payment_status = 'UNPAID' OR b.payment_status = 'PARTIAL PAYMENT')
            AND b.status = 'POSTED'

          UNION ALL

          SELECT sb.id, sb.bill_no, sb.bill_date,
                 sb.total_amount as net_amount,
                 COALESCE(sb.amount_paid, 0) as amount_paid,
                 (sb.total_amount - COALESCE(sb.amount_paid, 0)) as balance_amount,
                 sb.payment_status, sb.due_date, s.supplier_name,
                 'Service' as source,
                 NULL as items
          FROM pur_service_bills sb
          LEFT JOIN pur_suppliers s ON sb.supplier_id = s.id
          WHERE sb.supplier_id = ?
            AND sb.company_id = ?
            AND (sb.branch_id = ? OR sb.branch_id IS NULL)
            AND (sb.payment_status = 'UNPAID' OR sb.payment_status = 'PARTIAL' OR sb.payment_status = 'PARTIAL PAYMENT')
            AND (sb.status IN ('PENDING', 'COMPLETED', 'POSTED') OR sb.status IS NULL OR sb.status = '')

          UNION ALL

          SELECT mb.id, mb.bill_no, mb.bill_date,
                 mb.total_amount as net_amount,
                 COALESCE(mb.amount_paid, 0) as amount_paid,
                 (mb.total_amount - COALESCE(mb.amount_paid, 0)) as balance_amount,
                 mb.payment_status, mb.due_date, s.supplier_name,
                 'Maintenance' as source,
                 NULL as items
          FROM maint_bills mb
          LEFT JOIN pur_suppliers s ON mb.supplier_id = s.id
          WHERE mb.supplier_id = ?
            AND mb.company_id = ?
            AND (mb.branch_id = ? OR mb.branch_id IS NULL)
            AND (mb.payment_status = 'UNPAID' OR mb.payment_status = 'PARTIAL' OR mb.payment_status = 'PARTIAL PAYMENT')
            AND mb.status NOT IN ('CANCELLED', 'DRAFT')

          UNION ALL

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
          WHERE tb.supplier_id = ?
            AND tb.company_id = ?
            AND (tb.branch_id = ? OR tb.branch_id IS NULL)
            AND (tb.payment_status IS NULL OR tb.payment_status IN ('UNPAID', 'PARTIAL', 'PARTIAL PAYMENT'))
            AND (tb.status IS NULL OR tb.status IN ('DRAFT', 'POSTED', 'COMPLETED'))
        ) combined
        ORDER BY bill_date DESC`;
      const billParams = [
        supplierId, companyId, branchId,
        supplierId, companyId, branchId,
        supplierId, companyId, branchId,
        supplierId, companyId, branchId
      ];
      const billRows = await query(sql, billParams);
      console.log(billRows);
      process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
run();
