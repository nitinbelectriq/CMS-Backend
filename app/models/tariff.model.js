const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");

const Tariff = {
  // ✅ Create new tariff
  create: async (data) => {
    const query = `
      INSERT INTO tariff_mst (
        tariff_name, type, costing_type, applicable_to, charging_fee, 
        charging_fee_unit, idle_fee, parking_fee, weight, 
        effective_from, effective_to, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.tariff_name,
      data.type,
      data.costing_type,
      data.applicable_to,
      data.charging_fee,
      data.charging_fee_unit,
      data.idle_fee,
      data.parking_fee,
      data.weight,
      _utility.formatDate(data.effective_from),
      _utility.formatDate(data.effective_to),
      data.created_by
    ];

    const result = await pool.query(query, values);
    return result;
  },

  // ✅ Get all tariffs (Role-based filtering)
  getAll: async (user_id) => {
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
    const roleData = clientAndRoleDetails?.data || [];

    let client_id = roleData[0]?.client_id || null;
    const isSA = roleData.some(x => x.role_code === 'SA');

    let query = '';

    if (isSA) {
      // Super Admin → See all
      query = `
        SELECT t.*, u.username AS created_by_name, c.name AS client_name
        FROM tariff_mst t
        LEFT JOIN user_mst_new u ON t.created_by = u.id
        LEFT JOIN client_mst c ON u.client_id = c.id
        WHERE t.status='Y'
        ORDER BY t.tariff_id DESC
      `;
    } else {
      // Client → See only their tariffs
      query = `
        SELECT t.*, u.username AS created_by_name, c.name AS client_name
        FROM tariff_mst t
        LEFT JOIN user_mst_new u ON t.created_by = u.id
        LEFT JOIN client_mst c ON u.client_id = c.id
        WHERE t.status='Y' AND u.client_id='${client_id}'
        ORDER BY t.tariff_id DESC
      `;
    }

    const result = await pool.query(query);
    return result;
  },

  // ✅ Get tariff by ID
  getById: async (id) => {
    const result = await pool.query(`SELECT * FROM tariff_mst WHERE tariff_id = ?`, [id]);
    return result;
  },

  // ✅ Update tariff
  update: async (id, data) => {
    const query = `
      UPDATE tariff_mst SET
        tariff_name=?, type=?, costing_type=?, applicable_to=?, charging_fee=?,
        charging_fee_unit=?, idle_fee=?, parking_fee=?, weight=?, 
        effective_from=?, effective_to=?, modified_by=?, modified_date=NOW()
      WHERE tariff_id = ?
    `;

    const values = [
      data.tariff_name,
      data.type,
      data.costing_type,
      data.applicable_to,
      data.charging_fee,
      data.charging_fee_unit,
      data.idle_fee,
      data.parking_fee,
      data.weight,
      _utility.formatDate(data.effective_from),
      _utility.formatDate(data.effective_to),
      data.modified_by,
      id
    ];

    const result = await pool.query(query, values);
    return result;
  },

  // ✅ Soft delete (status = 'N')
  delete: async (id) => {
    const result = await pool.query(
      `UPDATE tariff_mst SET status='N', modified_date=NOW() WHERE tariff_id=?`,
      [id]
    );
    return result;
  },
  
  createMapping: async (data) => {
  const query = `
    INSERT INTO station_tariff_map (station_id, tariff_id, created_by)
    VALUES (?, ?, ?)
  `;
  const values = [data.station_id, data.tariff_id, data.created_by];
  return await pool.query(query, values);
},

getMappingList: async (login_id) => {
  const clientAndRole = await _utility.getClientIdAndRoleByUserId(login_id);
  const roles = clientAndRole?.data || [];
  const client_id = roles[0]?.client_id || null;
  const isSA = roles.some(x => x.role_code === 'SA');

  const query = isSA
    ? `
      SELECT
        stm.id,
        stm.station_id,
        stm.tariff_id,
        cs.state_id,
        cs.name AS station_name,
        t.tariff_name,
        t.type,
        t.costing_type,
        t.charging_fee,
        t.charging_fee_unit,
        u.username AS created_by_name,
        stm.created_date
      FROM station_tariff_map stm
      LEFT JOIN charging_station_mst cs ON stm.station_id = cs.id
      LEFT JOIN tariff_mst t ON stm.tariff_id = t.tariff_id
      LEFT JOIN user_mst_new u ON stm.created_by = u.id
      WHERE stm.status='Y'
      ORDER BY stm.id DESC
    `
    : `
      SELECT
        stm.id,
        stm.station_id,
        stm.tariff_id,
        cs.state_id,
        cs.name AS station_name,
        t.tariff_name,
        t.type,
        t.costing_type,
        t.charging_fee,
        t.charging_fee_unit,
        u.username AS created_by_name,
        stm.created_date
      FROM station_tariff_map stm
      LEFT JOIN charging_station_mst cs ON stm.station_id = cs.id
      LEFT JOIN tariff_mst t ON stm.tariff_id = t.tariff_id
      LEFT JOIN user_mst_new u ON stm.created_by = u.id
      WHERE stm.status='Y'
        AND u.client_id='${client_id}'
      ORDER BY stm.id DESC
    `;

  const rows = await pool.query(query);

  return {
    status: true,
    data: rows
  };
},


getMappingById: async (id) => {
  const query = `
    SELECT stm.*, cs.name AS station_name, t.tariff_name
    FROM station_tariff_map stm
    LEFT JOIN charging_station_mst cs ON stm.station_id = cs.id
    LEFT JOIN tariff_mst t ON stm.tariff_id = t.tariff_id
    WHERE stm.id = ?
  `;
  return await pool.query(query, [id]);
},

deleteMapping: async (id) => {
  const query = `UPDATE station_tariff_map SET status='N' WHERE id=?`;
  return await pool.query(query, [id]);
},
updateMapping: async (id, data) => {
  const query = `
    UPDATE station_tariff_map
    SET station_id = ?, tariff_id = ?, modify_date = NOW()
    WHERE id = ?
  `;
  return await pool.query(query, [data.station_id, data.tariff_id, id]);
},

getStationsForTariffMapping: async (login_id) => {
  try {
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
    if (!clientAndRoleDetails?.data?.length) {
      return { status: false, message: "INVALID_USER", count: 0, data: [] };
    }

    const client_id = clientAndRoleDetails.data[0].client_id;
    const isSA = clientAndRoleDetails.data.some(x => x.role_code === "SA");

    const query = isSA
      ? `
        SELECT id, name AS station_name
        FROM charging_station_mst
        WHERE status = 'Y'
        ORDER BY name ASC;
      `
      : `
        SELECT csm.id, csm.name AS station_name
        FROM charging_station_mst csm
        INNER JOIN cpo_mst cpom 
          ON csm.cpo_id = cpom.id 
         AND cpom.client_id = ?
        WHERE csm.status = 'Y'
        ORDER BY csm.name ASC;
      `;

    const rows = isSA ? await pool.query(query) : await pool.query(query, [client_id]);
    return {
      status: true,
      message: rows.length ? "DATA_FOUND" : "DATA_NOT_FOUND",
      count: rows.length,
      data: rows
    };
  } catch (err) {
    console.error("Error:", err);
    return { status: false, message: "ERROR", data: [] };
  }
}

};

module.exports = Tariff;
