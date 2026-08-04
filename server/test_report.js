import { pool, query } from "./db/pool.js";

async function run() {
  try {
    const rawTrips = await query("SELECT t.*, COALESCE(NULLIF(v.reg_number, ''), NULLIF(CONCAT(v.make, ' ', v.model), ' '), CONCAT('Vehicle #', t.vehicle_id)) AS vehicle_name, v.reg_number AS reg_number, COALESCE(NULLIF(d.employee_name, ''), 'Unassigned Driver') AS driver_name FROM trans_trips t LEFT JOIN trans_vehicles v ON v.id = t.vehicle_id LEFT JOIN trans_drivers d ON d.id = t.driver_id WHERE (t.company_id = 1 OR 1 IS NULL OR t.company_id = 0) ORDER BY t.created_at DESC, t.id DESC", []);
    console.log('Raw Trips count:', rawTrips.length);
    
    const fuelRows = await query(
      "SELECT f.*, v.reg_number AS reg_number FROM trans_fuel_logs f LEFT JOIN trans_vehicles v ON v.id = f.vehicle_id WHERE f.company_id = 1 ORDER BY f.log_date DESC",
      []
    ).catch(e => console.error("fuel error", e));
    console.log('Fuel Rows:', fuelRows?.length);
    
  } catch(e) {
    console.error(e);
  }
  process.exit();
}
run();
