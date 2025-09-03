const { sql, pool } = require("./db.js");
const charger_model = require("../models/charger.model.js");
const _utility = require("../utility/_utility");
const { DATETIME } = require("mysql/lib/protocol/constants/types");

const ChargingStation = function (chargingStation) {
  this.id = chargingStation.id,
    this.cpo_id = chargingStation.cpo_id,
    this.cpo_name = chargingStation.cpo_name,
    this.name = chargingStation.name,
    this.code = chargingStation.code,
    this.description = chargingStation.description,
    this.address1 = chargingStation.address1;
  this.address2 = chargingStation.address2;
  this.PIN = chargingStation.PIN;
  this.landmark = chargingStation.landmark;
  this.city_id = chargingStation.city_id;
  this.state_id = chargingStation.state_id;
  this.country_id = chargingStation.country_id;
  this.lat = chargingStation.lat,
    this.lng = chargingStation.lng,
    this.location_type_id = chargingStation.location_type_id,
    this.cp_name = chargingStation.cp_name,
    this.mobile = chargingStation.mobile,
    this.email = chargingStation.email,
    this.commissioned_dt = chargingStation.commissioned_dt,
    this.register_as = chargingStation.register_as,
    this.electricity_line_id = chargingStation.electricity_line_id,
    this.o_time = chargingStation.o_time,
    this.c_time = chargingStation.c_time,
    this.status = chargingStation.status,
    this.created_date = chargingStation.created_date,
    this.created_by = chargingStation.created_by,
    this.modify_date = chargingStation.modify_date,
    this.modify_by = chargingStation.modify_by,
    this.amenities = chargingStation.amenities || [];
};


const AddEvChargingStation = function (addEvChargingStation) {
  this.id = addEvChargingStation.id,
    this.user_id = addEvChargingStation.user_id,
    this.country_id = addEvChargingStation.country_id,
    this.volume_of_ev_user = addEvChargingStation.volume_of_ev_user,
    this.space_for_station = addEvChargingStation.space_for_station,
    this.population_density = addEvChargingStation.population_density,
    this.like_count = addEvChargingStation.like_count,
    this.address1 = addEvChargingStation.address1,
    this.address2 = addEvChargingStation.address2,
    this.dislike_count = addEvChargingStation.dislike_count,
    this.landmark = addEvChargingStation.landmark,
    this.city_id = addEvChargingStation.city_id,
    this.PIN = addEvChargingStation.PIN,
    this.state_id = addEvChargingStation.state_id,
    this.country_id = addEvChargingStation.country_id,
    this.lat = addEvChargingStation.lat,
    this.lng = addEvChargingStation.lng,
    this.mobile = addEvChargingStation.mobile,
    this.email = addEvChargingStation.email,
    this.status = addEvChargingStation.status,
    this.created_date = addEvChargingStation.created_date,
    this.created_by = addEvChargingStation.created_by,
    this.modify_date = addEvChargingStation.modify_date,
    this.modify_by = addEvChargingStation.modify_by,
    this.like_dislike = addEvChargingStation.like_dislike,
    this.like_count = addEvChargingStation.like_count,
    this.dislike_count = addEvChargingStation.dislike_count
    
};


ChargingStation.create = async (newCs, result) => {
  let final_res;
  let resp;
  let respCheck;
  const datetime = new Date();
  const createdDate = datetime.toISOString().slice(0, 10);

  const stmtCheck = `
    SELECT id FROM charging_station_mst 
    WHERE cpo_id = ${newCs.cpo_id} AND name='${newCs.name}'
  `;

  const stmt = `
    INSERT INTO charging_station_mst (
      cpo_id, name, code, description,
      address1, address2, PIN, landmark,
      city_id, state_id, country_id,
      lat, lng, location_type_id, cp_name, mobile,
      email, commissioned_dt, register_as, electricity_line_id,
      o_time, c_time, status, created_date, createdby
    ) VALUES (
      ${newCs.cpo_id}, '${newCs.name}', '${newCs.code}', '${newCs.description}',
      '${newCs.address1}', '${newCs.address2}', ${newCs.PIN}, '${newCs.landmark}',
      ${newCs.city_id}, ${newCs.state_id}, ${newCs.country_id},
      ${newCs.lat}, ${newCs.lng}, ${newCs.location_type_id}, '${newCs.cp_name}', ${newCs.mobile},
      '${newCs.email}', '${newCs.commissioned_dt}', ${newCs.register_as}, ${newCs.electricity_line_id},
      '${newCs.o_time}', '${newCs.c_time}', '${newCs.status}', '${createdDate}', ${newCs.created_by}
    )
  `;

  try {
    // Check if station already exists
    respCheck = await pool.query(stmtCheck);
    if (respCheck.length > 0) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Station already added for this CPO',
        count: 0,
        data: []
      };
      return result(null, final_res);
    }

    // Insert station
    resp = await pool.query(stmt);
    const stationId = resp.insertId;

    // Insert amenities if provided
    if (stationId && Array.isArray(newCs.amenities) && newCs.amenities.length > 0) {
      for (let amenityId of newCs.amenities) {
        const insertAmenityStmt = `
          INSERT INTO station_amenity_mapping
          (station_id, amenity_id, status, created_date, createdby)
          VALUES (${stationId}, ${amenityId}, 'Y', '${createdDate}', ${newCs.created_by})
        `;
        await pool.query(insertAmenityStmt);
      }
    }

    final_res = {
      status: stationId > 0,
      err_code: `ERROR : 0`,
      message: stationId > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: stationId }]
    };
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    };
  }

  result(null, final_res);
};

ChargingStation.update = async (newCs, result) => {
  //;
  const datetime = new Date();
  let final_res;

  try {
    // Check duplicate station name for the same CPO
    const duplicateCheck = await pool.query(`
      SELECT id FROM charging_station_mst 
      WHERE cpo_id = ? AND name = ? AND id <> ?
    `, [newCs.cpo_id, newCs.name, newCs.id]);

    if (duplicateCheck.length > 0) {
      return result(null, {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Station with same name already added for this CPO',
        count: 0,
        data: []
      });
    }

    // Update charging station
    await pool.query(`
      UPDATE charging_station_mst SET 
        cpo_id = ?, name = ?, code = ?, description = ?, address1 = ?, address2 = ?, PIN = ?,
        landmark = ?, city_id = ?, state_id = ?, country_id = ?, lat = ?, lng = ?, 
        location_type_id = ?, cp_name = ?, mobile = ?, email = ?, commissioned_dt = ?, 
        register_as = ?, electricity_line_id = ?, o_time = ?, c_time = ?, status = ?, 
        modify_date = ?, modifyby = ?
      WHERE id = ?
    `, [
      newCs.cpo_id, newCs.name, newCs.code, newCs.description, newCs.address1, newCs.address2, newCs.PIN,
      newCs.landmark, newCs.city_id, newCs.state_id, newCs.country_id, newCs.lat, newCs.lng,
      newCs.location_type_id, newCs.cp_name, newCs.mobile, newCs.email, newCs.commissioned_dt,
      newCs.register_as, newCs.electricity_line_id, newCs.o_time, newCs.c_time, newCs.status,
      datetime.toISOString().slice(0, 19).replace('T', ' '), newCs.modify_by, newCs.id
    ]);

    // Remove old amenities
    await pool.query(`DELETE FROM station_amenity_mapping WHERE station_id = ?`, [newCs.id]);

    // Insert new amenities
    if (Array.isArray(newCs.amenities) && newCs.amenities.length > 0) {
      for (const amenity_id of newCs.amenities) {
        try {
          await pool.query(`
            INSERT INTO station_amenity_mapping (station_id, amenity_id, status, created_date, createdby)
            VALUES (?, ?, 'A', ?, ?)
          `, [newCs.id, amenity_id,newCs.status, datetime.toISOString().slice(0, 10), newCs.modify_by]);

          console.log(`Amenity inserted: station ${newCs.id}, amenity ${amenity_id}`);
        } catch (insertErr) {
          console.error(`Amenity insert failed for ID ${amenity_id}`, insertErr.message);
        }
      }
    } else {
      console.log('No amenities provided.');
    }

    final_res = {
      status: true,
      err_code: 'ERROR : 0',
      message: 'SUCCESS',
      count: 1,
      data: [{ id: newCs.id }]
    };

  } catch (err) {
    console.error('Update failed:', err);
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code || 'UNKNOWN'}`,
      message: `ERROR : ${err.message || 'Internal Server Error'}`,
      count: 0,
      data: []
    };
  }

  result(null, final_res);
};


ChargingStation.getChargingStations = async result => {

  let ress = await getAllChargingStations();
  result(null, ress);
};

ChargingStation.getChargingStationsByUserRoleAndLatLong = async (login_id, params, result) => {
  let ress = await func_getChargingStationsByUserRoleAndLatLong(login_id, params);
  result(null, ress);
};
ChargingStation.getChargingStationsByUserRoleAndLatLongWL = async (params, result) => {
  let ress = await func_getChargingStationsByUserRoleAndLatLongWL(params);
  result(null, ress);
};

ChargingStation.getChargingStationsByUserRoleAndLatLongUW = async (user_id, params, result) => {
  let ress = await func_getChargingStationsByUserRoleAndLatLongUW(user_id, params);
  result(null, ress);
};
ChargingStation.getChargingStationsByUserRoleAndLatLongUW1 = async (user_id, params, result) => {
  //;
  let ress = await func_getChargingStationsByUserRoleAndLatLongUW1(user_id, params);
  result(null, ress);
};

ChargingStation.getChargingStationById = (id, result) => {

  let stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description,
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as,csm.electricity_line_id,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.id = ? `;
  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

ChargingStation.getChargingStationByCpoId = async (cpo_id, result) => {
  let ress = await getAllChargingStationsByCPOId(cpo_id);
  result(null, ress);
};

ChargingStation.getAmenitiesByStationId = async (station_id, result) => {
  try {
    amenities = await func_getAmenitiesByStationId(station_id);
  } catch (err) {
  }
  result(null, amenities);
};

ChargingStation.getChargingStationsWithTotalChargersByCPOId = async (cpo_id, result) => {
  let ress = await getAllChargingStationsByCPOId(cpo_id);
  result(null, ress);
};

ChargingStation.getAllChargingStationsWithChargersAndConnectors = async (result) => {
  let stations_details;

  try {
    stations_details = await func_allChargingStationsWithChargersAndConnectors();
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getAllChargingStationsWithChargersAndConnectorsUW = async (user_id, result) => {
  let stations_details;

  try {
    stations_details = await func_allChargingStationsWithChargersAndConnectorsUW(user_id);
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getAllChargingStationsWithChargersAndConnectorsCW = async (user_id) => {
  return await func_allChargingStationsWithChargersAndConnectorsCW(user_id);
};


ChargingStation.getAllChargingStationsWithChargersAndConnectorsCCS = async (params, result) => {
  let stations_details;
  try {

    stations_details = await func_allChargingStationsWithChargersAndConnectorsCCS(params);
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getActiveChargingStationsWithChargersAndConnectorsCW = async (login_id, result) => {
  let stations_details;
  //;
  try {

    stations_details = await func_activeChargingStationsWithChargersAndConnectorsCW(login_id);
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getActiveChargingStationsWithChargersAndConnectorsCCS = async (params, result) => {
  let stations_details;
  try {
    stations_details = await func_activeChargingStationsWithChargersAndConnectorsCCS(params);
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getActiveChargingStationsCW = async (login_id, result) => {
  let stations_details;
  try {

    stations_details = await func_activeChargingStationsCW(login_id);
  } catch (err) {
  }
  result(null, stations_details);
};

ChargingStation.getChargingStationByClientId = (client_id, result) => {

  let stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , csm.city_id ,csm.state_id, csm.country_id ,
      csm.lat, csm.lng,csm.location_type_id,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as,csm.electricity_line_id,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm inner join cpo_mst cpom on csm.cpo_id = cpom.id
      WHERE csm.cpo_id in (select id from cpo_mst where client_id = ?) and csm.status = 'Y'`;
  sql.query(stmt, client_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

ChargingStation.delete = (id, result) => {

  let stmt = `Update charging_station_mst set status = 'D' WHERE id = ?`;
  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};


async function getAllChargingStationsByCPOId(cpo_id) {

  let stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as,csm.electricity_line_id,csm.o_time,csm.c_time,
      csm.id as station_id, csm.name as station_name,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm inner join cpo_mst cpom on csm.cpo_id = cpom.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      WHERE csm.cpo_id = ? and csm.status = 'Y'`;

  let ress;
  try {
    ress = await pool.query(stmt, [cpo_id]);

    ress = {
      status: true,
      message: ress.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: ress.length,
      data: ress
    }
  } catch (err) {
    // handle the error
    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}

async function func_allChargingStationsWithChargersAndConnectors() {

  let stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
  csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  FROM charging_station_mst csm 
  left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  inner join location_type_mst ltm on csm.location_type_id = ltm.id
  inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  inner join city_mst city on csm.city_id = city.id
  inner join state_mst sm on csm.state_id = sm.id
  inner join country_mst country on csm.country_id = country.id
  where csm.status = 'Y' 
  group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  order by csm.created_date desc ;`;

  let stations_details;
  let chargers_details;

  try {

    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getAmenitiesStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }

        }

      }

    } else {

    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }

        }

      }

    } else {

    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}

async function func_allChargingStationsWithChargersAndConnectorsUW(user_id) {


  let stmt = `SELECT count(chsm.charger_id) as total_chargers,upm.id as favourite_station,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , csm.landmark , csm.city_id , 
    city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name, csm.lat, csm.lng,
    csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , eltm.name as electricity_line ,
    csm.o_time,csm.c_time,csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by favourite_station desc, csm.name desc ;`;

  let stations_details;
  let chargers_details;

  try {
    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getAmenitiesStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }

        }

      }

    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }

        }

      }

    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}


async function func_allChargingStationsWithChargersAndConnectorsUW1(user_id) {


  let stmt = `SELECT count(chsm.charger_id) as total_chargers,upm.id as favourite_station,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , csm.landmark , csm.city_id , 
    city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name, csm.lat, csm.lng,
    csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , eltm.name as electricity_line ,
    csm.o_time,csm.c_time,csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by favourite_station desc, csm.name desc ;`;

  let stations_details;
  let chargers_details;

  try {
    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getMarkerStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }

        }

      }

    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }

        }

      }

    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}
async function func_allChargingStationsWithChargersAndConnectorsCW(user_id) {
  try {
    //;
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
    const userRoles = clientAndRoleDetails.data;
    const client_id = userRoles[0]?.client_id;
    const isSA = userRoles.some(x => x.role_code === 'SA');

    const baseQuery = `
      SELECT COUNT(chsm.charger_id) AS total_chargers, csm.id, csm.cpo_id, cpom.name AS cpo_name, cpom.client_id,
             csm.name, csm.code, csm.description, csm.address1, csm.address2, csm.PIN, csm.landmark,
             csm.city_id, city.name AS city_name, csm.state_id, sm.name AS state_name, 
             csm.country_id, country.name AS country_name, csm.lat, csm.lng, csm.location_type_id,
             ltm.name AS location_type, csm.cp_name, csm.mobile, csm.email, csm.commissioned_dt,
             csm.register_as AS register_as_id, crtm.name AS register_as,
             csm.electricity_line_id, eltm.name AS electricity_line, csm.o_time, csm.c_time,
             csm.status, csm.created_date, csm.createdby, csm.modify_date, csm.modifyby
      FROM charging_station_mst csm
      LEFT JOIN charger_station_mapping chsm ON csm.id = chsm.station_id AND chsm.status = 'Y'
      INNER JOIN cpo_mst cpom ON csm.cpo_id = cpom.id
      INNER JOIN location_type_mst ltm ON csm.location_type_id = ltm.id
      INNER JOIN charger_registration_type_mst crtm ON csm.register_as = crtm.id
      INNER JOIN electricity_line_type_mst eltm ON csm.electricity_line_id = eltm.id
      INNER JOIN city_mst city ON csm.city_id = city.id
      INNER JOIN state_mst sm ON csm.state_id = sm.id
      INNER JOIN country_mst country ON csm.country_id = country.id
      WHERE csm.status <> 'D'
      ${!isSA ? `AND cpom.client_id = ${client_id}` : ''}
      GROUP BY csm.id, csm.cpo_id, cpom.name, cpom.client_id, csm.name, csm.code, csm.description, 
               csm.address1, csm.address2, csm.PIN, csm.landmark, csm.city_id, city.name, 
               csm.state_id, sm.name, csm.country_id, country.name, csm.lat, csm.lng,
               csm.location_type_id, ltm.name, csm.cp_name, csm.mobile, csm.email,
               csm.commissioned_dt, csm.register_as, crtm.name, csm.electricity_line_id, eltm.name,
               csm.o_time, csm.c_time, csm.status, csm.created_date, csm.createdby,
               csm.modify_date, csm.modifyby
      ORDER BY csm.created_date DESC
    `;

    const stations_details = await pool.query(baseQuery);
    const chargers_details = await charger_model.func_getChargers();
    const amenity_details = await func_getAmenitiesStationMapping();

    const stationMap = {};

    stations_details.forEach(station => {
      station.chargers = [];
      station.amenities = [];
      stationMap[station.id] = station;
    });

    chargers_details?.data?.forEach(charger => {
      if (stationMap[charger.station_id]) {
        stationMap[charger.station_id].chargers.push(charger);
      }
    });

    amenity_details?.data?.forEach(amenity => {
      if (stationMap[amenity.station_id]) {
        stationMap[amenity.station_id].amenities.push(amenity);
      }
    });

    const finalData = Object.values(stationMap);

    return {
      status: true,
      message: finalData.length ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: finalData.length,
      data: finalData
    };
  } catch (error) {
    console.error('Error in func_allChargingStationsWithChargersAndConnectorsCW:', error);
    return {
      status: false,
      message: 'ERROR',
      count: 0,
      data: []
    };
  }
}

async function func_allChargingStationsWithChargersAndConnectorsCCS(params) {


  let stmt = '';
  let stations_details;
  let chargers_details;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // // let role_code = clientAndRoleDetails.data[0].role_code;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status <> 'D' 
  //   group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  //   csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  //   state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  //   location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  //   register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  //   csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   order by csm.created_date desc ;`;
  // } else {

  //   stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status <> 'D'  
  //   and cpom.client_id = ${client_id}
  //   group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  //   csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  //   state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  //   location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  //   register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  //   csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   order by csm.created_date desc ;`;
  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , 
    csm.landmark , csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, 
    csm.country_id, country.name as country_name,csm.lat, csm.lng,csm.location_type_id,
    ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , 
    eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status <> 'D'  and cpom.client_id = ${params.client_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    where csm.status <> 'D' and cpom.id = ${params.cpo_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;` ;
  
  }else{
    
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    where csm.status <> 'D' and csm.id = ${params.station_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;` ;
  }  
  

  try {
    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getAmenitiesStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }
        }
      }
    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }
        }
      }
    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}

async function func_activeChargingStationsWithChargersAndConnectorsCW(login_id) {
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  } else {

    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    and cpom.client_id = ${client_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  }


  let stations_details;
  let chargers_details;

  try {
    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getAmenitiesStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }

        }

      }

    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }

        }

      }

    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}

async function func_activeChargingStationsWithChargersAndConnectorsCCS(params) {
  let stmt = '';
  let stations_details;
  let chargers_details;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // // let role_code = clientAndRoleDetails.data[0].role_code;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status = 'Y' 
  //   group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  //   csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  //   state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  //   location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  //   register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  //   csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   order by csm.created_date desc ;`;
  // } else {

  //   stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status = 'Y' 
  //   and cpom.client_id = ${client_id}
  //   group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  //   csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  //   state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  //   location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  //   register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  //   csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   order by csm.created_date desc ;`;
  // }


 

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , 
    csm.landmark , csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, 
    csm.country_id, country.name as country_name,csm.lat, csm.lng,csm.location_type_id,
    ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , 
    eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    and cpom.client_id = ${params.client_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    stmt =` SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , 
    csm.landmark , csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, 
    csm.country_id, country.name as country_name,csm.lat, csm.lng,csm.location_type_id,
    ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , 
    eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.id=${params.cpo_id}
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
    
  }else{
    
    stmt =` SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,
    cpom.client_id, csm.name, csm.code, csm.description, csm.address1,  csm.address2,  csm.PIN , 
    csm.landmark , csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, 
    csm.country_id, country.name as country_name,csm.lat, csm.lng,csm.location_type_id,
    ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,
    csm.register_as as register_as_id , crtm.name as register_as ,csm.electricity_line_id , 
    eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' and csm.id=${params.station_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  }  

  try {
    stations_details = await pool.query(stmt);
    chargers_details = await charger_model.func_getChargers();
    amenity_details = await func_getAmenitiesStationMapping();

    if (stations_details.length > 0 && chargers_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].chargers = [];

        for (let c = 0; c < chargers_details.data.length; c++) {
          const child = chargers_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].chargers.push(child);
          }

        }

      }

    }

    if (stations_details.length > 0 && amenity_details.data.length > 0) {

      final_stations_details = stations_details;

      for (let p = 0; p < stations_details.length; p++) {
        const parent = stations_details[p];
        final_stations_details[p].amenities = [];

        for (let c = 0; c < amenity_details.data.length; c++) {
          const child = amenity_details.data[c];

          if (parent.id == child.station_id) {
            final_stations_details[p].amenities.push(child);
          }

        }

      }

    }

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}

async function func_activeChargingStationsCW(login_id) {
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;


  if (isSA) {
    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  } else {

    stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name ,cpom.client_id, csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
    inner join cpo_mst cpom on csm.cpo_id = cpom.id 
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    and cpom.client_id = ${client_id}
    group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
    csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
    state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
    location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
    register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
    csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc ;`;
  }


  let stations_details;
  let chargers_details;

  try {
    stations_details = await pool.query(stmt);
    // chargers_details = await charger_model.func_getChargers();
    // amenity_details = await func_getAmenitiesStationMapping();

    // if (stations_details.length > 0 && chargers_details.data.length > 0) {

    //   final_stations_details = stations_details;

    //   for (let p = 0; p < stations_details.length; p++) {
    //     const parent = stations_details[p];
    //     final_stations_details[p].chargers = [];

    //     for (let c = 0; c < chargers_details.data.length; c++) {
    //       const child = chargers_details.data[c];

    //       if (parent.id == child.station_id) {
    //         final_stations_details[p].chargers.push(child);
    //       }

    //     }

    //   }

    // } 

    // if (stations_details.length > 0 && amenity_details.data.length > 0) {

    //   final_stations_details = stations_details;

    //   for (let p = 0; p < stations_details.length; p++) {
    //     const parent = stations_details[p];
    //     final_stations_details[p].amenities = [];

    //     for (let c = 0; c < amenity_details.data.length; c++) {
    //       const child = amenity_details.data[c];

    //       if (parent.id == child.station_id) {
    //         final_stations_details[p].amenities.push(child);
    //       }

    //     }

    //   }

    // } 

    stations_details = {
      status: true,
      message: stations_details.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: stations_details.length,
      data: stations_details
    }
  } catch (err) {
    // handle the error
    stations_details = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return stations_details;
  }

}

async function getAllChargingStations() {

  let stmt = `SELECT count(chsm.charger_id) as total_chargers,csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
  csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  FROM charging_station_mst csm 
  left join charger_station_mapping chsm on csm.id = chsm.station_id and chsm.status = 'Y'
  inner join cpo_mst cpom on csm.cpo_id = cpom.id 
  inner join location_type_mst ltm on csm.location_type_id = ltm.id
  inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  inner join city_mst city on csm.city_id = city.id
  inner join state_mst sm on csm.state_id = sm.id
  inner join country_mst country on csm.country_id = country.id
  where csm.status = 'Y' 
  group by csm.id, csm.cpo_id,cpo_name , csm.name, csm.code, csm.description, csm.address1,  
  csm.address2,  csm.PIN , csm.landmark , csm.city_id ,  city_name, csm.state_id,  
  state_name, csm.country_id, country_name,csm.lat, csm.lng,csm.location_type_id,
  location_type ,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt, register_as_id ,
  register_as ,csm.electricity_line_id , electricity_line ,csm.o_time,csm.c_time,csm.status,
  csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  order by csm.created_date desc ;`;
  let ress;
  try {
    ress = await pool.query(stmt);

    ress = {
      status: true,
      message: ress.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: ress.length,
      data: ress
    }
  } catch (err) {
    // handle the error
    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}

//commented for new change as station to be filtered by user-station_mapping
//below is new version of this api
// async function func_getChargingStationsByUserRoleAndLatLong(login_id,params) {

//   let stmt='';
//   let final_res=[];
//   let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
//   let client_id = clientAndRoleDetails.data[0].client_id;
//   let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

//   let lat = params.lat;
//   let lng = params.lng;
//   let radius = params.radius;
//   let connector_type_id = params.connector_type_id;

//   if(isSA){
//     if(connector_type_id>0){

//       stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
//       csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//       csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
//       csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
//       csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
//       csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
//       csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//       FROM charging_station_mst csm 
//       inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
//       inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
//       inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
//       inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
//       inner join cpo_mst cpom on csm.cpo_id = cpom.id 
//       inner join location_type_mst ltm on csm.location_type_id = ltm.id
//       inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
//       inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
//       inner join city_mst city on csm.city_id = city.id
//       inner join state_mst sm on csm.state_id = sm.id
//       inner join country_mst country on csm.country_id = country.id
//       where csm.status = 'Y' 
//       group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
//       csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//       csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
//       csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
//       csm.commissioned_dt, register_as_id ,  register_as ,
//       csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
//       csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//       order by csm.created_date desc;`;
//     }else{
//       stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
//       csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//       csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
//       csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
//       csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
//       csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
//       csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//       FROM charging_station_mst csm 
//       inner join cpo_mst cpom on csm.cpo_id = cpom.id 
//       inner join location_type_mst ltm on csm.location_type_id = ltm.id
//       inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
//       inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
//       inner join city_mst city on csm.city_id = city.id
//       inner join state_mst sm on csm.state_id = sm.id
//       inner join country_mst country on csm.country_id = country.id
//       where csm.status = 'Y' 
//       order by csm.created_date desc;`;
//     }
//   }else{
//     if(connector_type_id>0){
//       stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
//     csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//     csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
//     csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
//     csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
//     csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
//     csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//     FROM charging_station_mst csm 
//     inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
//     inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
//     inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
//     inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
//     inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
//     inner join location_type_mst ltm on csm.location_type_id = ltm.id
//     inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
//     inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
//     inner join city_mst city on csm.city_id = city.id
//     inner join state_mst sm on csm.state_id = sm.id
//     inner join country_mst country on csm.country_id = country.id
//     where csm.status = 'Y' 
//     group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
//       csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//       csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
//       csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
//       csm.commissioned_dt, register_as_id ,  register_as ,
//       csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
//       csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//     order by csm.created_date desc;`;
//     }else{
//       stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
//     csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
//     csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
//     csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
//     csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
//     csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
//     csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
//     FROM charging_station_mst csm 
//     inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
//     inner join location_type_mst ltm on csm.location_type_id = ltm.id
//     inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
//     inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
//     inner join city_mst city on csm.city_id = city.id
//     inner join state_mst sm on csm.state_id = sm.id
//     inner join country_mst country on csm.country_id = country.id
//     where csm.status = 'Y' 
//     order by csm.created_date desc;`;
//     }

//   }


//   let ress;
//   try {

//     ress = await pool.query(stmt);

//     amenity_details = await func_getAmenitiesStationMapping();

//     if(ress.length>0){
//       let distance=0;
//       for (let i = 0; i < ress.length; i++) {
//         const ele = ress[i];
//         distance = getDistanceFromLatLonInKm(ele.lat,ele.lng,lat,lng).toFixed(1)
//         if(distance<=radius){
//           ele.distance = distance;
//           final_res.push(ele);
//         }

//       }

//     }

//     ress = {
//       status: true,
//       message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
//       count: final_res.length,
//       data: final_res
//     }
//   } catch (err) {

//     ress = {
//       status: false,
//       message: "ERROR",
//       count: 0,
//       data: []
//     }
//   } finally {
//     // await db.close();
//     return ress;
//   }

// }
async function func_getChargingStationsByUserRoleAndLatLong(login_id, params) {

  let stmt = '';
  let final_res = [];
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let lat = params.lat;
  let lng = params.lng;
  let radius = params.radius;
  let connector_type_id = params.connector_type_id;

  if (isSA) {
    if (connector_type_id > 0) {

      stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
      inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
      inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
      inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      where csm.status = 'Y' 
      group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
      csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt, register_as_id ,  register_as ,
      csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      order by csm.created_date desc;`;
    } else {
      stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      where csm.status = 'Y' 
      order by csm.created_date desc;`;
    }
  } else {
    if (connector_type_id > 0) {
      stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
    inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
    inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
    inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
    inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
      csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt, register_as_id ,  register_as ,
      csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    order by csm.created_date desc;`;
    } else {
      stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
    csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
    csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
    csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
    csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
    csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
    csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
    FROM charging_station_mst csm 
    inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
    inner join location_type_mst ltm on csm.location_type_id = ltm.id
    inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
    inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
    inner join city_mst city on csm.city_id = city.id
    inner join state_mst sm on csm.state_id = sm.id
    inner join country_mst country on csm.country_id = country.id
    where csm.status = 'Y' 
    order by csm.created_date desc;`;
    }

  }


  let ress;
  try {

    ress = await pool.query(stmt);

    amenity_details = await func_getAmenitiesStationMapping();

    if (ress.length > 0) {
      let distance = 0;
      for (let i = 0; i < ress.length; i++) {
        const ele = ress[i];
        distance = getDistanceFromLatLonInKm(ele.lat, ele.lng, lat, lng).toFixed(1)
        if (distance <= radius) {
          ele.distance = distance;
          final_res.push(ele);
        }

      }

    }

    ress = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {

    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}

async function func_getChargingStationsByUserRoleAndLatLongWL(params) {

  let stmt = '';
  let final_res = [];
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

  let lat = params.lat;
  let lng = params.lng;
  let radius = params.radius;
  let connector_type_id = params.connector_type_id;

  // if(isSA){
  if (connector_type_id > 0) {

    stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
      inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
      inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
      inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      where csm.status = 'Y' 
      group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
      csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt, register_as_id ,  register_as ,
      csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      order by csm.created_date desc;`;
  } else {
    stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      where csm.status = 'Y' 
      order by csm.created_date desc;`;
  }
  // }else{
  //   if(connector_type_id>0){
  //     stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
  //   inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
  //   inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
  //   inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status = 'Y' 
  //   group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
  //     csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //     csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
  //     csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
  //     csm.commissioned_dt, register_as_id ,  register_as ,
  //     csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
  //     csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   order by csm.created_date desc;`;
  //   }else{
  //     stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
  //   csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
  //   csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //   csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
  //   csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
  //   csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
  //   csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
  //   FROM charging_station_mst csm 
  //   inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.client_id = ${client_id}
  //   inner join location_type_mst ltm on csm.location_type_id = ltm.id
  //   inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
  //   inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
  //   inner join city_mst city on csm.city_id = city.id
  //   inner join state_mst sm on csm.state_id = sm.id
  //   inner join country_mst country on csm.country_id = country.id
  //   where csm.status = 'Y' 
  //   order by csm.created_date desc;`;
  //   }

  // }


  let ress;
  try {
    ress = await pool.query(stmt);

    amenity_details = await func_getAmenitiesStationMapping();

    if (ress.length > 0) {
      let distance = 0;
      for (let i = 0; i < ress.length; i++) {
        const ele = ress[i];
        distance = getDistanceFromLatLonInKm(ele.lat, ele.lng, lat, lng).toFixed(1)
        if (distance <= radius) {
          ele.distance = distance;
          final_res.push(ele);
        }

      }

    }

    ress = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {
    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}

async function func_getChargingStationsByUserRoleAndLatLongUW(user_id, params) {

  let stmt = '';
  let final_res = [];
  let lat = params.lat;
  let lng = params.lng;
  let radius = params.radius;
  let connector_type_id = params.connector_type_id;

  if (connector_type_id > 0) {

    stmt = `SELECT csm.id,upm.id as favourite_station, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
      inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
      inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
      inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
      where csm.status = 'Y' 
      group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
      csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt, register_as_id ,  register_as ,
      csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      order by csm.created_date desc;`;
  } else {
    stmt = `SELECT csm.id,upm.id as favourite_station, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
      where csm.status = 'Y' 
      order by csm.created_date desc;`;
  }

  let ress;
  try {

    ress = await pool.query(stmt);
    amenity_details = await func_getAmenitiesStationMapping();

    if (ress.length > 0) {
      let distance = 0;
      for (let i = 0; i < ress.length; i++) {
        const ele = ress[i];
        distance = getDistanceFromLatLonInKm(ele.lat, ele.lng, lat, lng).toFixed(1)
        if (distance <= radius) {
          ele.distance = distance;
          final_res.push(ele);
        }
      }
    }

    ress = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {

    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}
async function func_getChargingStationsByUserRoleAndLatLongUW1(user_id, params) {
  //;
  let stmt = '';
  let final_res = [];
  let lat = params.lat;
  let lng = params.lng;
  let radius = params.radius;
  let connector_type_id = params.connector_type_id;

  if (connector_type_id > 0) {

    stmt = `SELECT csm.id,upm.id as favourite_station, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,cmm.map_marker_icon_url,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join charger_station_mapping cstm on csm.id = cstm.station_id and cstm.status='Y'
      inner join charger_serial_mst csrm on cstm.charger_id=csrm.id and csrm.status = 'Y'
      inner join charging_model_mst chmm on csrm.model_id = chmm.id and chmm.status='Y' 
      inner join charging_model_connector_map cmcm on chmm.id=cmcm.model_id and cmcm.status='Y' and connector_type_id=${connector_type_id}
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join client_mst cmm on cpom.client_id = cmm.id and cmm.status='Y'
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
      where csm.status = 'Y' 
      group by csm.id, csm.cpo_id,  cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id ,  city_name, csm.state_id,  state_name, csm.country_id,  country_name,
      csm.lat, csm.lng,csm.location_type_id, location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt, register_as_id ,  register_as ,
      csm.electricity_line_id ,  electricity_line ,csm.o_time,csm.c_time,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      order by csm.created_date desc;`;
  } else {
    stmt = `SELECT csm.id,upm.id as favourite_station, csm.cpo_id, cpom.name as cpo_name , csm.name, csm.code, csm.description, 
      csm.address1,  csm.address2,  csm.PIN , csm.landmark , 
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.lat, csm.lng,csm.location_type_id,ltm.name as location_type ,csm.cp_name,csm.mobile,csm.email,
      csm.commissioned_dt,csm.register_as as register_as_id , crtm.name as register_as ,
      csm.electricity_line_id , eltm.name as electricity_line ,csm.o_time,csm.c_time,cmm.map_marker_icon_url,
      csm.status,csm.created_date,csm.createdby,csm.modify_date,csm.modifyby
      FROM charging_station_mst csm 
      inner join cpo_mst cpom on csm.cpo_id = cpom.id 
      inner join client_mst cmm on cpom.client_id = cmm.id and  cmm.status = 'Y'
      inner join location_type_mst ltm on csm.location_type_id = ltm.id
      inner join charger_registration_type_mst crtm on csm.register_as = crtm.id
      inner join electricity_line_type_mst eltm on csm.electricity_line_id = eltm.id
      inner join city_mst city on csm.city_id = city.id
      inner join state_mst sm on csm.state_id = sm.id
      inner join country_mst country on csm.country_id = country.id
      left join user_preference_mst upm on csm.id = upm.station_id and upm.status = 'Y' and upm.user_id = ${user_id}
      where csm.status = 'Y' 
      order by csm.created_date desc;`;
  }

  let ress;
  try {

    ress = await pool.query(stmt);
    amenity_details = await func_getAmenitiesStationMapping();

    if (ress.length > 0) {
      let distance = 0;
      for (let i = 0; i < ress.length; i++) {
        const ele = ress[i];
        distance = getDistanceFromLatLonInKm(ele.lat, ele.lng, lat, lng).toFixed(1)
        if (distance <= radius) {
          ele.distance = distance;
          final_res.push(ele);
        }
      }
    }

    ress = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {

    ress = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    // await db.close();
    return ress;
  }

}


async function func_getAmenitiesByStationId(station_id) {

  let resp;
  let final_res;

  let stmt = `select sam.id as map_id, sam.station_id,sam.amenity_id , am.name as amenity_name ,
    am.icon_url ,am.status as amenity_status
    from station_amenity_mapping sam 
    inner join amenity_mst am on sam.amenity_id = am.id and am.status = 'Y'
    where sam.status = 'Y' and sam.station_id = ? order by display_order ;`;

  try {
    resp = await pool.query(stmt, [station_id]);

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    return final_res;
  }

}

async function func_getAmenitiesStationMapping() {

  let resp;
  let final_res;

  let stmt = `select sam.id as map_id, sam.station_id,sam.amenity_id , am.name as amenity_name ,
    am.icon_url ,am.status as amenity_status
    from station_amenity_mapping sam 
    inner join amenity_mst am on sam.amenity_id = am.id and am.status = 'Y'
    where sam.status = 'Y' order by display_order ;`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    return final_res;
  }

}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}



ChargingStation.getAllActiveChargingStations = async (client_id, cpo_id, result) => {
  let resp;
  let final_res;

  let whereClause = ` WHERE csm.status = 'Y' `;

  if (!!cpo_id) {
    if (cpo_id > 0) {
      whereClause = `${whereClause} and cpom.client_id = ${client_id} and cpom.id = ${cpo_id} `;
    } else {
      whereClause = `${whereClause} and cpom.client_id = ${client_id} `;
    }
  } else {
    whereClause = `${whereClause} and cpom.client_id = ${client_id} `;
  }

  let stmt = `SELECT csm.id, csm.cpo_id, cpom.name as cpo_name  , csm.name as station_name, csm.code, csm.description, 
  csm.address1,  csm.address2,  csm.PIN , csm.landmark , csm.city_id , city.name as city_name, 
  csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,csm.lat, 
  csm.lng,csm.location_type_id,csm.cp_name,csm.mobile,csm.email,csm.commissioned_dt,csm.register_as,
  csm.electricity_line_id,csm.o_time,csm.c_time,csm.status,csm.created_date,csm.createdby,
  csm.modify_date,csm.modifyby
  FROM charging_station_mst csm inner join cpo_mst cpom on csm.cpo_id = cpom.id and cpom.status='Y'
  inner join city_mst city on csm.city_id = city.id
  inner join state_mst sm on csm.state_id = sm.id
  inner join country_mst country on csm.country_id = country.id
  ${whereClause} `;

  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}

AddEvChargingStation.createEvChargingStationRequest = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt = `insert into ev_charging_station_request(user_id,mobile,email,lat,lng,address1,address2,landmark,
    PIN,city_id,state_id,country_id,volume_of_ev_user,space_for_station,population_density,like_count,
    dislike_count,remarks,status,created_date,created_by)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  let values = [data.user_id, data.mobile, data.email, data.lat, data.lng, data.address1, data.address2, data.landmark,
  data.PIN,data.city_id, data.state_id, data.country_id, data.volume_of_ev_user, data.space_for_station,
  data.population_density, data.like_count, data.dislike_count, data.remarks, data.status,
    datetime, data.created_by];
  try {
    resp = await pool.query(stmt, values);
    final_res = {
      status: resp.insertId > 0 ? true : false,
      err_code: resp.insertId > 0 ? 'ERROR : 0' : 'ERROR:1',
      message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: resp.insertId }]
    }
  }
  catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

AddEvChargingStation.getEvChargingStationRequestByCityId = async (user_id, city_id, result) => {
  let resp;
  let final_res;
  //;
  let stmt = `select ecsr.id,ecsr.user_id,umn.username as user_name,ecsr.mobile,ecsr.email,ecsr.lat,
  ecsr.lng,ecsr.address1,ecsr.address2,ecsr.landmark,ecsr.PIN,ecsr.city_id,cm.name as city_name,ecsr.state_id,
  sm.name as state_name,ecsr.country_id,cmt.name as country_name,ecsr.volume_of_ev_user,
  ecsr.space_for_station,ecsr.population_density,ecsr.like_count,ecsr.dislike_count,ecsr.remarks,
  ecsr.status,ecsr.created_date,ecsr.created_by,ecsr.modify_by,ecsr.modify_date
  from ev_charging_station_request ecsr
  inner join city_mst cm on ecsr.city_id=cm.id and cm.status='Y'
  inner join state_mst sm on ecsr.state_id=sm.id and sm.status='Y'
  inner join country_mst cmt on ecsr.country_id=cmt.id and cmt.status='Y'
  inner join user_mst_new umn on ecsr.user_id=umn.id and umn.status='Y'
  left join ev_charging_station_request_log ecsrl on ecsrl.request_id = ecsr.id and ecsrl.status='Y'
  and ecsrl.user_id=${user_id} where ecsr.user_id<>${user_id} and ecsr.status='M' and 
  ecsr.city_id =${city_id};`;

  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}

AddEvChargingStation.getEvChargingStationRequestByUserIdCityId = async (user_id,city_id, result) => {
  let resp;
  let final_res;

  let stmt = `select ecsr.id,ecsr.user_id,umn.username as user_name,ecsr.mobile,ecsr.email,ecsr.lat,
  ecsr.lng,ecsr.address1,ecsr.address2,ecsr.landmark,ecsr.PIN,ecsr.city_id,cm.name as city_name,ecsr.state_id,
  sm.name as state_name,ecsr.country_id,cmt.name as country_name,ecsr.volume_of_ev_user,
  ecsr.space_for_station,ecsr.population_density,ecsr.like_count,ecsr.dislike_count,ecsr.remarks,
  ecsr.status,ecsr.created_date,ecsr.created_by,ecsr.modify_by,ecsr.modify_date
  from ev_charging_station_request ecsr
  inner join city_mst cm on ecsr.city_id=cm.id and cm.status='Y'
  inner join state_mst sm on ecsr.state_id=sm.id and sm.status='Y'
  inner join country_mst cmt on ecsr.country_id=cmt.id and cmt.status='Y'
  inner join user_mst_new umn on ecsr.user_id=umn.id and umn.status='Y'
  left join ev_charging_station_request_log ecsrl on ecsrl.request_id = ecsr.id and ecsrl.status='Y'
  and ecsrl.user_id=${user_id} where ecsr.user_id=${user_id} and ecsr.status='M' and ecsr.city_id =${city_id};`;

  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}


AddEvChargingStation.updateEvChargingStationRequest = async (data, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt = `update ev_charging_station_request set user_id=?,mobile=?,email=?,lat=?,lng=?,address1=?,
             address2=?,landmark=?,PIN=?,city_id=?,state_id=?,country_id=?,volume_of_ev_user=?,
             space_for_station=?,population_density=?,like_count=?,dislike_count=?,remarks=?,status=?,
             modify_date=?,modify_by=? where id=?;`;

  let values = [data.user_id, data.mobile, data.email, data.lat, data.lng, data.address1, data.address2, data.landmark,
  data.PIN,data.city_id, data.state_id, data.country_id, data.volume_of_ev_user, data.space_for_station,
  data.population_density, data.like_count, data.dislike_count, data.remarks, data.status,
    datetime, data.modify_by, data.id];
  try {
    resp = await pool.query(stmt, values);
    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? 'ERROR : 0' : 'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id:data.id }]
    }
  }
  catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

AddEvChargingStation.getApproveRejectEvChargingStationRequestByCityId = async (user_id, city_id, result) => {
  let resp;
  let final_res;
//;
  let stmt = `select ecsr.id,ecsr.user_id,umn.username as user_name,ecsr.mobile,ecsr.email,ecsr.lat,
  ecsr.lng,ecsr.address1,ecsr.address2,ecsr.landmark,ecsr.PIN,ecsr.city_id,cm.name as city_name,ecsr.state_id,
  sm.name as state_name,ecsr.country_id,cmt.name as country_name,ecsr.volume_of_ev_user,
  ecsr.space_for_station,ecsr.population_density,ecsr.like_count,ecsr.dislike_count,ecsr.remarks,
  ecsr.status,ecsr.created_date,ecsr.created_by,ecsr.modify_by,ecsr.modify_date
  from ev_charging_station_request ecsr
  inner join city_mst cm on ecsr.city_id=cm.id and cm.status='Y'
  inner join state_mst sm on ecsr.state_id=sm.id and sm.status='Y'
  inner join country_mst cmt on ecsr.country_id=cmt.id and cmt.status='Y'
  inner join user_mst_new umn on ecsr.user_id=umn.id and umn.status='Y'
  left join ev_charging_station_request_log ecsrl on ecsrl.request_id = ecsr.id and ecsrl.status='Y'
  and ecsrl.user_id=${user_id} where ecsr.user_id <> ${user_id} and ecsr.status in ('A','R') and 
  ecsr.city_id =${city_id};`;


  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}

AddEvChargingStation.getApproveRejectEvChargingStationRequestByUserIdCityId = async (user_id, city_id, result) => {
  let resp;
  let final_res;
 //;
  let stmt = `select ecsr.id,ecsr.user_id,umn.username as user_name,ecsr.mobile,ecsr.email,ecsr.lat,
  ecsr.lng,ecsr.address1,ecsr.address2,ecsr.landmark,ecsr.PIN,ecsr.city_id,cm.name as city_name,ecsr.state_id,
  sm.name as state_name,ecsr.country_id,cmt.name as country_name,ecsr.volume_of_ev_user,
  ecsr.space_for_station,ecsr.population_density,ecsr.like_count,ecsr.dislike_count,ecsr.remarks,
  ecsr.status,ecsr.created_date,ecsr.created_by,ecsr.modify_by,ecsr.modify_date
  from ev_charging_station_request ecsr
  inner join city_mst cm on ecsr.city_id=cm.id and cm.status='Y'
  inner join state_mst sm on ecsr.state_id=sm.id and sm.status='Y'
  inner join country_mst cmt on ecsr.country_id=cmt.id and cmt.status='Y'
  inner join user_mst_new umn on ecsr.user_id=umn.id and umn.status='Y'
  left join ev_charging_station_request_log ecsrl on ecsrl.request_id = ecsr.id and ecsrl.status='Y'
  and ecsrl.user_id=${user_id} where ecsr.user_id=${user_id} and ecsr.status in ('A','R')  
  and ecsr.city_id =${city_id};`;

  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}

AddEvChargingStation.approveRejectChargerStationRequest = async (data, result) => {
  //;
  var datetime = new Date();
  let resp;
  let final_resp;
  let stmt = `update ev_charging_station_request set status=?,modify_date=?,modify_by = ? where id=?;`;
  let values = [data.status, datetime, data.modify_by, data.id];
  try {
    resp = await pool.query(stmt, values);
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp.length,
      data: [{ updatedId: data.id }]
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }
}

AddEvChargingStation.deleteChargerStationRequest = async(id,modify_by, result) => {
  var datetime = new Date();
  let resp;
  let final_res;
  let stmt = `Update ev_charging_station_request set status = 'D',modify_by=${modify_by},
  modify_date=? where id =${id}`;
  try{
    resp = await pool.query(stmt,datetime);
    final_res={
      status:resp.affectedRows>0 ? true:false,
      err_code:resp.affectedRows>0 ? 'ERROR:0':'ERROR:1',
      message:resp.affectedRows>0 ? 'SUCCESS':'FAILED',
      data:[]
    }
  }catch(err){
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}

AddEvChargingStation.LikeDislikeRequest = async (data, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let dynamicQuery = ``;
  let resp;
  let resp1;
  let resp2;
  let resp3;
  let stmt = `select id,like_dislike from ev_charging_station_request_log where user_id=? and request_id=? and status='Y';`;

  let stmt1 = `insert into ev_charging_station_request_log(request_id,user_id,like_dislike,status,
    created_by,created_date)values(?,?,?,?,?,?);`;

  let stmt2 ;

  let stmt3 = `update ev_charging_station_request_log set like_dislike=?,modify_by=?,
    modify_date=? where user_id=?;`;

  try {
    resp = await pool.query(stmt, [data.user_id,data.id]);
    if (resp.length > 0) {
      // case when user liked/disliked earlier

      if (resp[0].like_dislike != data.like_dislike) {

        resp1 = await pool.query(stmt3, [data.like_dislike, data.modify_by, datetime, data.user_id,data.id]);

        if (data.like_dislike == 1) {
          dynamicQuery = ` like_count = like_count + 1 ,dislike_count = dislike_count - 1`;
        } else {
          dynamicQuery = ` like_count = like_count - 1 ,dislike_count = dislike_count + 1 `;
        }
        stmt2 = `update ev_charging_station_request set  ${dynamicQuery}  ,modify_by=?,
        modify_date=? where id=?;`;
    
        resp2 = await pool.query(stmt2,[data.modify_by, datetime, data.id]);
        
        final_res = {
          status: resp2.affectedRows > 0 ? true : false,
          err_code: resp2.affectedRows > 0 ? 'ERROR : 0' : 'ERROR:1',
          message: resp2.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
          count: 1,
          data: [{ id: data.id }]
        }
      }else{
        //;
        final_res = {
          status:  true ,
          err_code:'ERROR : 0',
          message: data.like_dislike == 1 ? 'You have already voted as liked for this request' : 'You have already voted as disliked for this request',
          count: 1,
          data: [{ id: data.id }]
        }
      }
    }
    else {
        // case when 1st time user liked/disliked
        if (data.like_dislike == 1) {
          dynamicQuery = ` like_count = like_count + 1 `;
        } else {
          dynamicQuery = ` dislike_count = dislike_count + 1 `;
        }
        
      stmt2 = `update ev_charging_station_request set  ${dynamicQuery}  ,modify_by=?,
        modify_date=? where id=?;`;

      resp2 = await pool.query(stmt2, [  data.modify_by, datetime, data.id]);
      resp3 = await pool.query(stmt1, [data.id, data.user_id, data.like_dislike, data.status, data.created_by, datetime])

      final_res = {
        status: resp3.affectedRows > 0 ? true : false,
        err_code: resp3.affectedRows > 0 ? 'ERROR : 0' : 'ERROR:1',
        message: resp3.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count: 1,
        data: [{ id: data.id }]
      }
    }
  }
  catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

ChargingStation.getAllAmenities = async (result) => {
  let stmt = `SELECT id, name, icon_url FROM amenity_mst`;
  let final_res;

  try {
    const resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0,
      err_code: resp.length > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA_NOT_FOUND',
      data: resp
    };
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};





module.exports = {
  ChargingStation: ChargingStation,
  AddEvChargingStation: AddEvChargingStation
};