const { pool } = require('./db.js');
const _utility = require('../utility/_utility.js');

const Billing = {
  // ✅ Check station–tariff mapping active
 // ✅ Check if station & tariff are mapped
isStationTariffMapped: async (station_id, tariff_id) => {
  
  const rows = await pool.query(
    `
    SELECT id
    FROM station_tariff_map
    WHERE station_id = ?
      AND tariff_id = ?
      AND status = 'Y'
    LIMIT 1
    `,
    [station_id, tariff_id]
  );

  return rows.length > 0;
},



  // ✅ Tariff details (for rate and type)
  getTariffDetails: async (tariff_id) => {
    debugger;
  const result = await pool.query(
    `
    SELECT charging_fee, charging_fee_unit, tariff_name, type
    FROM tariff_mst
    WHERE tariff_id = ? AND status = 'Y'
    `,
    [tariff_id]
  );

  const rows = result[0] || [];
  return rows;
},


  // ✅ GST list (global, not per client)
  getGSTList: async () => {
    debugger;
    const [rows] = await pool.query(`
      SELECT 
        s.id AS state_id,
        s.name AS state_name,
        COALESCE(g.gst_rate, 18.00) AS gst_rate
      FROM state_mst s
      LEFT JOIN gst_mst g ON g.state_id = s.id
      WHERE s.status = 'Active' OR s.status = 'Y'
      ORDER BY s.name ASC
    `);
    return rows;
  },

  // ✅ GST rate by state
getGSTRateByState: async (state_id) => {
  const rows = await pool.query(
    `
    SELECT gst_rate
    FROM gst_mst
    WHERE state_id = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [state_id]
  );

  // ✅ If GST exists → return number
  if (rows.length > 0) {
    return Number(rows[0].gst_rate);
  }

  // ✅ Default GST
  return 18;
},



  // ✅ Insert/Update GST
  updateGST: async (state_id, gst_rate, user_id) => {
    const [[existing]] = await pool.query(
      `SELECT id FROM gst_mst WHERE state_id = ? LIMIT 1`,
      [state_id]
    );

    if (existing) {
      await pool.query(
        `
        UPDATE gst_mst
        SET gst_rate = ?, modified_by = ?, modified_date = NOW()
        WHERE state_id = ?
      `,
        [gst_rate, user_id || null, state_id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO gst_mst (
          state_id, gst_rate, effective_from, created_by, created_date
        ) VALUES (?, ?, CURDATE(), ?, NOW())
      `,
        [state_id, gst_rate, user_id || null]
      );
    }
  },

  // ✅ Create Bill (billing_txn)
  createBill: async (data) => {
    debugger;
  const {
    station_id,
    tariff_id,
    state_id,
    units_consumed,
    base_amount,
    gst_rate,
    gst_amount,
    final_amount,
    created_by
  } = data;

  const result = await pool.query(
    `
    INSERT INTO billing_txn (
      station_id,
      tariff_id,
      state_id,
      units_consumed,
      base_amount,
      gst_rate,
      gst_amount,
      final_amount,
      payment_status,
      created_by,
      created_date,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, NOW(), 'Y')
    `,
    [
      station_id,
      tariff_id,
      state_id,
      units_consumed,
      base_amount,
      gst_rate,
      gst_amount,
      final_amount,
      created_by || null
    ]
  );

  return result.insertId;
},


  // ✅ Bill details for invoice, view & edit
 getBillById: async (bill_id) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        b.*,
        cs.name AS station_name,
        sm.name AS state_name,
        t.tariff_name,
        t.type AS tariff_type
      FROM billing_txn b
      LEFT JOIN charging_station_mst cs ON b.station_id = cs.id
      LEFT JOIN state_mst sm ON b.state_id = sm.id
      LEFT JOIN tariff_mst t ON b.tariff_id = t.tariff_id
      WHERE b.bill_id = ?
      LIMIT 1
      `,
      [bill_id]
    );

    return rows.length ? rows[0] : null;

  } catch (err) {
    console.error('❌ getBillById error:', err);
    throw err;
  }
},


  // ✅ Update Bill in DB
  updateBill: async (data) => {
    const {
      bill_id,
      station_id,
      tariff_id,
      state_id,
      units_consumed,
      base_amount,
      gst_rate,
      gst_amount,
      final_amount,
      modified_by
    } = data;

    await pool.query(
      `
      UPDATE billing_txn
      SET 
        station_id = ?,
        tariff_id = ?,
        state_id = ?,
        units_consumed = ?,
        base_amount = ?,
        gst_rate = ?,
        gst_amount = ?,
        final_amount = ?,
        modify_date = NOW(),
        modified_by = ?
      WHERE bill_id = ?
      `,
      [
        station_id,
        tariff_id,
        state_id,
        units_consumed,
        base_amount,
        gst_rate,
        gst_amount,
        final_amount,
        modified_by || null,
        bill_id
      ]
    );
  },

  // ✅ Billing list with role-based filter (like Tariff.getAll)
  // ✅ Billing list with role-based filter (FINAL VERSION)
getBillingList: async (login_id) => {
  const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  const roleData = clientAndRoleDetails?.data || [];

  const client_id = roleData[0]?.client_id || null;
  const isSA = roleData.some(x => x.role_code === 'SA');

  let query = '';
  let params = [];

  if (isSA) {
    // ✅ SUPER ADMIN – ALL DATA
    query = `
      SELECT 
        b.bill_id,

        -- 🔹 USER
        TRIM(
          CONCAT(
            COALESCE(um.f_Name, ''),
            ' ',
            COALESCE(um.l_Name, '')
          )
        ) AS user_name,

        -- 🔹 STATION / TARIFF
        cs.name AS station_name,
        t.tariff_name,

        -- 🔹 BILLING
        b.units_consumed,
        b.base_amount,
        b.gst_amount,
        b.final_amount,
        b.payment_status,
        b.invoice_path,

        -- 🔹 TRANSACTION (FOR REFUND)
        b.payment_order_id AS order_id,
        tm.pg_txn_id AS txn_id,
        b.payment_mode,

        DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date

      FROM billing_txn b
      LEFT JOIN charging_station_mst cs ON b.station_id = cs.id
      LEFT JOIN tariff_mst t ON b.tariff_id = t.tariff_id

      LEFT JOIN transaction_mst tm 
        ON tm.order_id = b.payment_order_id
        AND tm.status = 'Success'

      LEFT JOIN user_mst_new um 
        ON um.id = tm.user_id

      WHERE b.status = 'Y'
      ORDER BY b.bill_id DESC
    `;
  } else {
    // ✅ CLIENT – CLIENT STATIONS ONLY
    query = `
      SELECT 
        b.bill_id,

        TRIM(
          CONCAT(
            COALESCE(um.f_Name, ''),
            ' ',
            COALESCE(um.l_Name, '')
          )
        ) AS user_name,

        cs.name AS station_name,
        t.tariff_name,

        b.units_consumed,
        b.base_amount,
        b.gst_amount,
        b.final_amount,
        b.payment_status,
        b.invoice_path,

        b.payment_order_id AS order_id,
        tm.pg_txn_id AS txn_id,
        b.payment_mode,

        DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date

      FROM billing_txn b
      LEFT JOIN charging_station_mst cs ON b.station_id = cs.id
      LEFT JOIN cpo_mst cpom ON cs.cpo_id = cpom.id
      LEFT JOIN tariff_mst t ON b.tariff_id = t.tariff_id

      LEFT JOIN transaction_mst tm 
        ON tm.order_id = b.payment_order_id
        AND tm.status = 'Success'

      LEFT JOIN user_mst_new um 
        ON um.id = tm.user_id

      WHERE b.status = 'Y'
        AND cpom.client_id = ?
      ORDER BY b.bill_id DESC
    `;
    params = [client_id];
  }

  const rows = await pool.query(query, params);
  return rows;
}


};


// ------------------------------------------------------
// SAVE Paytm ORDER ID INTO billing_txn
// ------------------------------------------------------
Billing.updateBillPaymentOrder = async (bill_id, orderId, mode) => {
  await pool.query(
    `
      UPDATE billing_txn
      SET payment_order_id = ?, payment_mode = ?
      WHERE bill_id = ?
    `,
    [orderId, mode, bill_id]
  );
};


module.exports = Billing;

