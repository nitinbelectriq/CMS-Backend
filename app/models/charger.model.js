const { sql, pool ,poolMG} = require("./db.js");
const _utility = require("../utility/_utility");
const { debug } = require("request");
const { registerPartial } = require("handlebars");

// constructor
const Charger = function (charger) {
  this.id = charger.id,
    this.name = charger.name,
    this.serial_no = charger.serial_no,
    this.batch_id = charger.batch_id,
    this.station_id = charger.station_id,
    this.model_id = charger.model_id,
    this.current_version_id = charger.current_version_id,
    this.no_of_guns = charger.no_of_guns,
    this.address1 = charger.address1;
  this.address2 = charger.address2;
  this.PIN = charger.PIN;
  this.landmark = charger.landmark;
  this.city_id = charger.city_id;
  this.state_id = charger.state_id;
  this.country_id = charger.country_id;
  this.Lat = charger.Lat,
    this.Lng = charger.Lng,
    this.OTA_Config = charger.OTA_Config,
    this.Periodic_Check_Ref_Time = charger.Periodic_Check_Ref_Time,
    this.Periodicity_in_hours = charger.Periodicity_in_hours,
    this.When_to_Upgrade = charger.When_to_Upgrade,
    this.Upgrade_Specific_Time = charger.Upgrade_Specific_Time,
    this.is_available = charger.is_available,
    this.status = charger.status,
    this.created_date = charger.created_date,
    this.created_by = charger.created_by,
    this.modify_date = charger.modify_date,
    this.modify_by = charger.modify_by,
    this.connector_data = charger.connector_data,
    this.can_renew_warranty = charger.can_renew_warranty,
    this.can_renew_plan = charger.can_renew_plan,
    this.remarks = charger.remarks,
    this.request_id = charger.request_id
};


const ChargerStationMap = function (chargerStationMap) {
  this.id = chargerStationMap.id,
    this.charger_id = chargerStationMap.charger_id,
    this.station_id = chargerStationMap.station_id,
    this.is_available = chargerStationMap.is_available,
    this.status = chargerStationMap.status,
    this.created_date = chargerStationMap.created_date,
    this.created_by = chargerStationMap.created_by,
    this.modify_date = chargerStationMap.modify_date,
    this.modify_by = chargerStationMap.modify_by,
    this.charger_data = chargerStationMap.charger_data
};

const ClientChargerMap = function (clientChargerMap) {
  this.id = clientChargerMap.id,
    this.charger_id = clientChargerMap.charger_id,
    this.client_id = clientChargerMap.client_id,
    this.sub_client_id = clientChargerMap.sub_client_id,
    this.is_private = clientChargerMap.is_private,
    this.dispatch_status = clientChargerMap.dispatch_status,
    this.dispatch_by = clientChargerMap.dispatch_by,
    this.dispatch_date = clientChargerMap.dispatch_date,
    this.status = clientChargerMap.status,
    this.created_date = clientChargerMap.created_date,
    this.created_by = clientChargerMap.created_by,
    this.modify_date = clientChargerMap.modify_date,
    this.modify_by = clientChargerMap.modify_by,
    this.charger_data = clientChargerMap.charger_data

};

const Set_Schedule_BLE = function (set_Schedule_BLE) {
  this.id = set_Schedule_BLE.id,
    this.charger_serial_no = set_Schedule_BLE.charger_serial_no,
    this.user_id = set_Schedule_BLE.user_id,
    this.schedule_id = set_Schedule_BLE.schedule_id,
    this.start_schedule_time = set_Schedule_BLE.start_schedule_time,
    this.stop_schedule_time = set_Schedule_BLE.stop_schedule_time,
    this.duration = set_Schedule_BLE.duration,
    this.schedule_type = set_Schedule_BLE.schedule_type,
    this.schedule_status = set_Schedule_BLE.schedule_status,
    this.schedule_name = set_Schedule_BLE.schedule_name,
    this.day_name = set_Schedule_BLE.day_name,
    this.schedule_status=set_Schedule_BLE.schedule_status,
    this.status = set_Schedule_BLE.status,
    this.created_date = set_Schedule_BLE.created_date,
    this.created_by = set_Schedule_BLE.created_by,
    this.modify_date = set_Schedule_BLE.modify_date,
    this.modify_by = set_Schedule_BLE.modify_by,
    this.schedule = set_Schedule_BLE.schedule

};


const ChargingProfile = function (chargingProfile) {
  this.id = chargingProfile.id,
    this.stack_level = chargingProfile.stack_level,
    this.charging_profile_name = chargingProfile.charging_profile_name,
    this.charging_profile_kind_id = chargingProfile.charging_profile_kind_id,
    this.recurrency_kind_id = chargingProfile.recurrency_kind_id,
    this.charging_profile_purpose_id = chargingProfile.charging_profile_purpose_id,
    this.valid_from = chargingProfile.valid_from,
    this.valid_to = chargingProfile.valid_to,
    this.charging_profile_id = chargingProfile.charging_profile_id,
    this.duration = chargingProfile.duration,
    this.start_schedule = chargingProfile.start_schedule,
    this.charging_rate_unit_id = chargingProfile.charging_rate_unit_id,
    this.mincharging_rate = chargingProfile.mincharging_rate,
    this.charging_schedule_id = chargingProfile.charging_schedule_id,
    this.start_period = chargingProfile.start_period,
    this.period_limit = chargingProfile.period_limit,
    this.numberof_phase_id = chargingProfile.numberof_phase_id,
    this.name = chargingProfile.name,
    this.role = chargingProfile.role,
    this.offerings = chargingProfile.offerings,
    this.projects = chargingProfile.projects,
    this.remarks = chargingProfile.remarks,
    this.status = chargingProfile.status,
    this.created_by = chargingProfile.created_by,
    this.created_date = chargingProfile.created_date,
    this.modify_date = chargingProfile.modify_date,
    this.modifyby = chargingProfile.modifyby,
    this.scheduleData = chargingProfile.scheduleData

};

const AddChargerRequest = function (addChargerRequest) {
  this.id = addChargerRequest.id,
    this.charger_id = addChargerRequest.charger_id,
    this.user_id = addChargerRequest.user_id,
    this.station_name = addChargerRequest.station_name,
    this.provider = addChargerRequest.provider,
    this.model = addChargerRequest.model,
    this.lat = addChargerRequest.lat,
    this.lng = addChargerRequest.lng,
    this.remarks = addChargerRequest.remarks,
    this.charger_serial_no = addChargerRequest.charger_serial_no,
    this.address1 = addChargerRequest.address1,
    this.address2 = addChargerRequest.address2,
    this.PIN = addChargerRequest.PIN,
    this.landmark = addChargerRequest.landmark,
    this.city_id = addChargerRequest.city_id,
    this.state_id = addChargerRequest.state_id,
    this.country_id = addChargerRequest.country_id,
    this.image_url = addChargerRequest.image_url,
    this.status = addChargerRequest.status,
    this.created_date = addChargerRequest.created_date,
    this.created_by = addChargerRequest.created_by,
    this.modify_date = addChargerRequest.modify_date,
    this.modify_by = addChargerRequest.modify_by,
    this.request_id = addChargerRequest.request_id

};

const ChargerRenewalRequestBle = function (charger) {
  this.id = charger.id,
  this.name = charger.name,
  this.serial_no = charger.serial_no,
  this.station_id = charger.station_id,
  this.model_id = charger.model_id,
  this.address1 = charger.address1;
  this.address2 = charger.address2;
  this.PIN = charger.PIN;
  this.landmark = charger.landmark;
  this.city_id = charger.city_id;
  this.state_id = charger.state_id;
  this.country_id = charger.country_id;
  this.Lat = charger.Lat,
  this.Lng = charger.Lng,
  this.status = charger.status,
  this.created_date = charger.created_date,
  this.created_by = charger.created_by,
  this.modify_date = charger.modify_date,
  this.modify_by = charger.modify_by,
  this.can_renew_warranty = charger.can_renew_warranty,
  this.can_renew_plan = charger.can_renew_plan,
  this.remarks = charger.remarks,
  this.request_id = charger.request_id,
  this.visit_date = charger.visit_date,
  this.charger_condition = charger.charger_condition,
  this.charger_description = charger.charger_description
  this.engineer_name = charger.engineer_name,
  this.vendor_name = charger.vendor_name,
  this.amount_collected = charger.amount_collected,
  this.payment_mode = charger.payment_mode,
  this.image_path = charger.image_path,
  this.physical_visit = charger.physical_visit
};


const ChargerConfiguration = function (chargerConfiguration) {
    this.id = chargerConfiguration.id,
    this.charger_id = chargerConfiguration.charger_id,
    this.charger_part_no_id = chargerConfiguration.charger_part_no_id,
    this.charger_serial_no = chargerConfiguration.charger_serial_no,
    this.charger_part_no = chargerConfiguration.charger_part_no,
    this.card_id = chargerConfiguration.card_id,
    this.card_part_no_id = chargerConfiguration.card_part_no_id,
    this.card_serial_no = chargerConfiguration.card_serial_no,
    this.card_part_no = chargerConfiguration.card_part_no,
    this.current_ampere_value = chargerConfiguration.current_ampere_value,
    this.user_id = chargerConfiguration.user_id,
    this.fw_version_id = chargerConfiguration.fw_version_id,
    this.fw_version_name = chargerConfiguration.fw_version_name,
    this.board_type = chargerConfiguration.board_type,
    this.source_app = chargerConfiguration.source_app,
    this.project_id = chargerConfiguration.project_id,
    this.status = chargerConfiguration.status,
    this.created_by = chargerConfiguration.created_by,
    this.created_date = chargerConfiguration.created_date,
    this.modify_date = chargerConfiguration.modify_date,
    this.modifyby = chargerConfiguration.modifyby,
    this.configuration_key = chargerConfiguration.configuration_key,
    this.current_fw_version_main_board = chargerConfiguration.current_fw_version_main_board,
    this.current_fw_version_id_main_board = chargerConfiguration.current_fw_version_id_main_board,
    this.current_fw_version_ocpp_board = chargerConfiguration.current_fw_version_ocpp_board,
    this.current_fw_version_id_ocpp_board = chargerConfiguration.current_fw_version_id_ocpp_board,
    this.current_ampere_value = chargerConfiguration.current_ampere_value
};


const _TABLE = 'charger_serial_mst';

Charger.create = async (newCharger, result) => {
  const datetime = new Date().toISOString().slice(0, 10);
debugger;
  const insertChargerQuery = `
    INSERT INTO ${_TABLE} (
      serial_no, name, model_id, station_id, current_version_id, no_of_guns,
      Lat, Lng, OTA_Config, Periodic_Check_Ref_Time, Periodicity_in_hours,
      When_to_Upgrade, Upgrade_Specific_Time, is_available,
      address1, address2, PIN, landmark, city_id, state_id, country_id,
      status, created_date, createdby
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertValues = [
    newCharger.serial_no, newCharger.name, newCharger.model_id, newCharger.station_id,
    newCharger.current_version_id, newCharger.no_of_guns, newCharger.Lat, newCharger.Lng,
    newCharger.OTA_Config, newCharger.Periodic_Check_Ref_Time, newCharger.Periodicity_in_hours,
    newCharger.When_to_Upgrade, datetime, newCharger.is_available,
    newCharger.address1, newCharger.address2, newCharger.PIN, newCharger.landmark,
    newCharger.city_id, newCharger.state_id, newCharger.country_id,
    newCharger.status, datetime, newCharger.created_by
  ];

  let final_res;

  try {
    // Insert charger
    const resp = await pool.query(insertChargerQuery, insertValues);
    const insertId = resp.insertId;

    // Fetch connector config from charging_model_connector_map
    const modelConnectors= await pool.query(
      `SELECT * FROM charging_model_connector_map WHERE model_id = ? AND status = 'Y'`,
      [newCharger.model_id]
    );

    // Map to required structure
    const connectorData = modelConnectors.map((item) => ({
      connector_type_id: item.connector_type_id,
      status: 'Y',
    }));

    // Insert charger connector mappings
    await insertModelConnector(connectorData, insertId, newCharger.name, newCharger.created_by);

    final_res = {
      status: true,
      message: 'SUCCESS',
      data: [{ id: insertId }]
    };
  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR: ${err.message}`,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};



Charger.update = async (newCharger, result) => {
  const datetime = new Date().toISOString().slice(0, 10);
debugger;
  // SQL query using parameterized inputs to prevent injection
  const stmt = `
    UPDATE ${_TABLE} SET 
      serial_no = ?, name = ?, model_id = ?, station_id = ?,
      current_version_id = ?, no_of_guns = ?,
      Lat = ?, Lng = ?, OTA_Config = ?,
      Periodic_Check_Ref_Time = ?, Periodicity_in_hours = ?,
      When_to_Upgrade = ?, Upgrade_Specific_Time = ?,
      is_available = ?, address1 = ?, address2 = ?, PIN = ?,
      landmark = ?, city_id = ?, state_id = ?, country_id = ?,
      status = ?, modifyby = ?, modify_date = ?
    WHERE id = ?
  `;

  const values = [
    newCharger.serial_no,
    newCharger.name,
    newCharger.model_id,
    newCharger.station_id,
    newCharger.current_version_id,
    newCharger.no_of_guns,
    newCharger.Lat,
    newCharger.Lng,
    newCharger.OTA_Config,
    newCharger.Periodic_Check_Ref_Time,
    newCharger.Periodicity_in_hours,
    newCharger.When_to_Upgrade,
    datetime,
    newCharger.is_available,
    newCharger.address1,
    newCharger.address2,
    newCharger.PIN,
    newCharger.landmark,
    newCharger.city_id,
    newCharger.state_id,
    newCharger.country_id,
    newCharger.status || 'Y',
    newCharger.modify_by,
    datetime,
    newCharger.id
  ];

  let final_res;

  try {
    // Execute charger update query
    await pool.query(stmt, values);

    // 🔽 Fetch connector configuration from charging_model_connector_map
    const modelConnectors = await pool.query(
      `SELECT * FROM charging_model_connector_map WHERE model_id = ? AND status = 'Y'`,
      [newCharger.model_id]
    );

    // (Optional) Use `modelConnectors` to manipulate or validate connector_data if needed
    // Example: log connector types for debugging
    console.log('Fetched model connectors:', modelConnectors);

    // 🔽 Call to update connectors
    await insertModelConnector(
      newCharger.connector_data,
      newCharger.id,
      newCharger.name,
      newCharger.modify_by
    );

    // Final response
    final_res = {
      status: true,
      message: 'SUCCESS',
      data: [{ id: newCharger.id }]
    };
  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR: ${err.code || err.message}`,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};



ClientChargerMap.dispatchChargers = async (data, result) => {
  debugger;
  var datetime = new Date();
  let final_res;
  let resp3;
  let resp4;
  let chargers_mapped = [];
  let chargers_not_mapped = [];
  let id_to_update = [];

  let stmt2 = `insert into client_charger_mapping (client_id,sub_client_id,charger_id,
  dispatch_status,dispatch_by,dispatch_date,
  status,createdby,created_date)
  values ? `;

  let stmt3 = `select id from client_charger_mapping 
    where charger_id = ? and status <>'D'`;

  let stmt4 = `update charger_serial_mst set is_private = ? where id in (?) `;

  let values = [];
  try {


    for (let index = 0; index < data.charger_data.length; index++) {

      resp3 = await pool.query(stmt3, [data.charger_data[index]])

      if (resp3.length > 0) {
        chargers_not_mapped.push({
          id: data.charger_data[index].id,
          serial_no: data.charger_data[index].serial_no,
          remarks: 'DUPLICATE'
        })

      } else {
        values.push([data.client_id, data.sub_client_id, data.charger_data[index].id,
        data.dispatch_status, data.dispatch_by, data.dispatch_date,
        data.status, data.created_by, datetime])

        chargers_mapped.push({
          id: data.charger_data[index].id,
          serial_no: data.charger_data[index].serial_no,
          remarks: 'SUCCESS'
        });

        id_to_update.push(data.charger_data[index].id);

      }
    }

    // resp = await pool.query(stmt);


    if (values.length > 0) {

      resp2 = await pool.query(stmt2, [values]);


      resp4 = await pool.query(stmt4, [data.is_private, id_to_update]);

    } else {
    }

    final_res = {
      status: values.length > 0 ? true : false,
      message: values.length > 0 ? 'SUCCESS' : 'ALL_DUPLICATE',
      data: [{
        chargers_not_mapped: chargers_not_mapped,
        chargers_mapped: chargers_mapped
      }]
    }
  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

ClientChargerMap.updateClientChargers = async (data, result) => {
  const datetime = new Date();
  let final_res;

  const updateStmt = `
    UPDATE client_charger_mapping
    SET client_id = ?, 
        charger_id = ?, 
        dispatch_date = ?, 
        status = ?, 
        modifyby = ?, 
        modify_date = ?
    WHERE id = ?
  `;

  try {
    // Validate required fields
    if (!data.id || !data.client_id || !data.charger_id) {
      throw new Error('Missing required fields: id, client_id, charger_id');
    }

    const values = [
      data.client_id,
      data.charger_id,
      data.dispatch_date,
      data.status,
      data.modify_by,
      datetime,
      data.id
    ];

    const resp = await pool.query(updateStmt, values);

    if (resp.affectedRows > 0) {
      final_res = {
        status: true,
        message: 'SUCCESS',
        data: []
      };
    } else {
      final_res = {
        status: false,
        message: 'No record updated. Possibly invalid ID.',
        data: []
      };
    }
  } catch (err) {
    console.error('Update Error:', err);
    final_res = {
      status: false,
      message: `ERROR: ${err.message}`,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};


ChargerStationMap.addChargerToStation = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `insert into charger_station_mapping (charger_id,station_id,
    status,created_date,createdby )
    VALUES (${newCharger.charger_id},${newCharger.station_id},
    '${newCharger.status}','${datetime.toISOString().slice(0, 10)}',${newCharger.created_by}) `;
  ;
  sql.query(stmt, async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    let final_result = await updateChargerAddress(newCharger.charger_id, newCharger.station_id, newCharger.created_by)

    result(null, { id: res.insertId, ...newCharger });
  });
};

ChargerStationMap.addChargerToStationMultiple = async (data, result) => {
  // var datetime = new Date();

  // let stmt = `insert into charger_station_mapping (charger_id,station_id,
  //   status,created_date,createdby )
  //   VALUES (${newCharger.charger_id},${newCharger.station_id},
  //   '${newCharger.status}','${datetime.toISOString().slice(0, 10)}',${newCharger.created_by}) `;

  // sql.query(stmt, async (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   //let final_result = await updateChargerAddress(newCharger.charger_id, newCharger.station_id, newCharger.created_by)

  //   result(null, { id: res.insertId, ...newCharger });
  // });

  //===============================
  var datetime = new Date();
  let final_res;
  let resp3;
  let chargers_mapped = [];
  let chargers_not_mapped = [];

  let stmt2 = `insert into charger_station_mapping (station_id,charger_id,
  status,created_date,createdby)
  values ? `;

  let stmt3 = `select id from charger_station_mapping 
  where charger_id = ? and status <>'D'`;

  let values = [];
  try {

    for (let index = 0; index < data.charger_data.length; index++) {


      resp3 = await pool.query(stmt3, [data.charger_data[index].charger_id])

      if (resp3.length > 0) {
        chargers_not_mapped.push({
          charger_id: data.charger_data[index].charger_id,
          serial_no: data.charger_data[index].serial_no,
          remarks: 'DUPLICATE'
        })

      } else {
        values.push([data.station_id, data.charger_data[index].charger_id,
        data.status, datetime, data.created_by])

        chargers_mapped.push({
          charger_id: data.charger_data[index].charger_id,
          serial_no: data.charger_data[index].serial_no,
          remarks: 'SUCCESS'
        })

      }
    }

    // resp = await pool.query(stmt);

    if (values.length > 0) {

      resp2 = await pool.query(stmt2, [values]);
    } else {
    }

    final_res = {
      status: values.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: values.length > 0 ? 'SUCCESS' : 'ALL_DUPLICATE',
      data: [{
        chargers_not_mapped: chargers_not_mapped,
        chargers_mapped: chargers_mapped
      }]
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

};


ChargerStationMap.removeChargerFromStation = async (newCharger, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update charger_station_mapping set status = 'D',
  modifyby = ${newCharger.modify_by}, modify_date = ?
  where id = ${newCharger.id} `;

  try {
    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

  // sql.query(stmt, [datetime], (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   result(null, { id: res.insertId, ...newCharger });
  // });
};

Charger.getChargers = async result => {
  debugger;
  let resp = await func_getChargers();
  result(null, resp);
};

Charger.getPlantChargers = result => {

  let stmt = `select csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,csm.model_id,cmm.name as model_name , 
  csm.current_version_id, vm.name as version_name , csm.no_of_guns,csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  from charger_serial_mst  csm 
  left join version_mst vm on csm.current_version_id = vm.id and vm.status = 'Y'
  left join city_mst city on csm.city_id = city.id
  left join state_mst sm on csm.state_id = sm.id
  left join country_mst country on csm.country_id = country.id
  inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
  where csm.id not in (select charger_id from client_charger_mapping where  client_id <>0  and status <> 'D' ) 
  and csm.status = 'Y' 
  order by csm.id desc;`;

  //23 02 2022 : changed query for version with left join as 
  //chargers created from upgrade app dont show here
  // let stmt = `select csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  //  csm.model_id,cmm.name as model_name , 
  // csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  // csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  // csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  // csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  // When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  // csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  // from ${_TABLE}  csm inner join version_mst vm on csm.current_version_id = vm.id
  // left join city_mst city on csm.city_id = city.id
  // left join state_mst sm on csm.state_id = sm.id
  // left join country_mst country on csm.country_id = country.id
  // inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
  // where csm.id not in (select charger_id from client_charger_mapping where  client_id <>0  and status <> 'D' ) 
  // and csm.status <> 'D' 
  // order by csm.id desc;`;


  sql.query(stmt, async (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      let children = await getMappedConnectors();

      let final_res = res;

      for (let p = 0; p < res.length; p++) {
        const parent = res[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.id == child.charger_id) {
            final_res[p].connector_data.push(child);
          }
        }
      }

      result(null, final_res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

// Charger model method
Charger.getClientChargers = async (login_id) => {
  try {
    // Get client and role details
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
    if (!clientAndRoleDetails || !clientAndRoleDetails.data?.length) {
      throw new Error("User client/role details not found");
    }

    const client_id = clientAndRoleDetails.data[0].client_id;
    const isSA = clientAndRoleDetails.data.some(x => x.role_code === "SA");

    // Compose query based on role
    const baseQuery = `
      SELECT 
        ccm.charger_id,
        csm.nick_name,
        ccm.client_id,
        ccm.dispatch_date,
        ccm.dispatch_by,
        ccm.id,
        csm.serial_no,
        CASE WHEN csm.name IS NULL THEN csm.serial_no ELSE csm.name END AS name,
        csm.model_id,
        cmm.name AS model_name,
        csmap.station_id,
        cm.id AS client_id,
        cm.name AS client_name,
        chsm.name AS station_name,
        csm.current_version_id,
        vm.name AS version_name,
        csm.no_of_guns,
        csm.address1,
        csm.address2,
        csm.PIN,
        csm.landmark,
        csm.city_id,
        city.name AS city_name,
        csm.state_id,
        sm.name AS state_name,
        csm.country_id,
        country.name AS country_name,
        csm.Lat,
        csm.Lng,
        csm.OTA_Config,
        csm.Periodic_Check_Ref_Time,
        csm.Periodicity_in_hours,
        csm.When_to_Upgrade,
        csm.Upgrade_Specific_Time,
        csm.is_available,
        ccm.status,
        csm.created_date,
        csm.createdby,
        csm.modifyby,
        csm.modify_date
      FROM ${_TABLE} csm
      LEFT JOIN version_mst vm ON csm.current_version_id = vm.id
      INNER JOIN charging_model_mst cmm ON csm.model_id = cmm.id
      INNER JOIN client_charger_mapping ccm ON csm.id = ccm.charger_id AND ccm.status <> 'D'
      INNER JOIN client_mst cm ON ccm.client_id = cm.id AND cm.status = 'Y'
      LEFT JOIN city_mst city ON csm.city_id = city.id
      LEFT JOIN state_mst sm ON csm.state_id = sm.id
      LEFT JOIN country_mst country ON csm.country_id = country.id
      LEFT JOIN charger_station_mapping csmap ON csm.id = csmap.charger_id AND csmap.status <> 'D'
      LEFT JOIN charging_station_mst chsm ON csmap.station_id = chsm.id
      WHERE csm.status <> 'D'
      ${isSA ? '' : `AND ccm.client_id = ${client_id}`}
      ORDER BY csm.id DESC;
    `;

    // Run query with promise wrapper for async/await
    const res = await new Promise((resolve, reject) => {
      sql.query(baseQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (!res.length) {
      return null;
    }

    // Fetch all connector data once
    const children = await getMappedConnectors();

    // Map connector data to each charger by charger_id (ccm.id)
    const connectorMap = new Map();

    children.res.forEach(child => {
      if (!connectorMap.has(child.charger_id)) {
        connectorMap.set(child.charger_id, []);
      }
      connectorMap.get(child.charger_id).push(child);
    });

    // Attach connector data to chargers
    const final_res = res.map(charger => ({
      ...charger,
      connector_data: connectorMap.get(charger.id) || []
    }));

    return final_res;

  } catch (error) {
    console.error("Error in Charger.getClientChargers:", error);
    throw error;
  }
};


Charger.getClientChargersNotMappedToAnyStation = async (client_id, result) => {

  let final_res;
  let resp;

  let stmt = `select ccm.charger_id, csm.serial_no, csm.name	as charger_display_id
  from client_charger_mapping ccm
  inner join charger_serial_mst csm on ccm.charger_id=csm.id and csm.status='Y'
  where ccm.status='Y' and ccm.client_id = ${client_id}
  and ccm.charger_id not in (select charger_id from charger_station_mapping where status<>'D')  
  order by csm.id desc; `;

  try {

    // resp = await pool.query(stmt);


    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
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
    result(null, final_res);
  }




  // let stmt = ` select ccm.charger_id,ccm.client_id,ccm.dispatch_date,ccm.dispatch_by,ccm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  //  csm.model_id,cmm.name as model_name  ,csmap.station_id ,
  // cm.id as client_id,cm.name as client_name,
  // chsm.name as station_name ,csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  // csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  // csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  // csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  // When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  // ccm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  // from  ${_TABLE} csm inner join version_mst vm on csm.current_version_id = vm.id
  // inner join charging_model_mst cmm on csm.model_id = cmm.id
  // inner join client_charger_mapping ccm on csm.id = ccm.charger_id and ccm.status<>'D'
  // inner join client_mst cm on ccm.client_id = cm.id and cm.status='Y'
  // left join city_mst city on csm.city_id = city.id
  // left join state_mst sm on csm.state_id = sm.id
  // left join country_mst country on csm.country_id = country.id

  // left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  // left join charging_station_mst chsm on csmap.station_id = chsm.id
  // where csm.status <> 'D'  
  // and csm.
  // order by csm.id desc;`;

  // sql.query(stmt, async (err, res) => {

  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   if (res.length) {
  //     let children = await getMappedConnectors();
  //     let final_res = res;

  //     for (let p = 0; p < res.length; p++) {
  //       const parent = res[p];
  //       final_res[p].connector_data = [];

  //       for (let c = 0; c < children.res.length; c++) {
  //         const child = children.res[c];

  //         if (parent.id == child.charger_id) {
  //           final_res[p].connector_data.push(child);
  //         }

  //       }

  //     }


  //     result(null, final_res);
  //     return;
  //   }

  //   result({ kind: "not_found" }, null);
  // });
};

Charger.getChargersByClient_CPO_StationId = async (data, result) => {
  //all chargers mapped to a client irrespective of those chargers are mapped to other CPO ,station

  let final_resp;
  let resp;
  let key = data.key;
  let value = data.value;
  let stmt2;

  if (key.toUpperCase() != 'CLIENT_ID') {
    if (key.toUpperCase() == 'STATION_ID') {
      stmt2 = `select cm.client_id from charging_station_mst csm inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status ='Y' 
      where csm.id = ${value} and csm.status ='Y' ;`;
    } else if (key.toUpperCase() == 'CPO_ID') {
      stmt2 = `select client_id from  cpo_mst
      where id = ${value} and status ='Y' ;`;
    }

    let resp1 = await pool.query(stmt2);

    try {
      if (resp1.length > 0) {
        value = resp1[0].client_id;
      } else {

        final_resp = {
          status: false,
          message: key.toUpperCase() == 'STATION_ID' ? `No client mapped to this station` : `No client mapped to this CPO`,
          data: []
        }
      }

    } catch (e) {

      final_resp = {
        status: false,
        message: `ERROR : ${e.message}`,
        data: []
      }
    }

  }

  let stmt = `  select csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
   csm.model_id,cmm.name as model_name  ,csmap.station_id ,
  cm.id as client_id,cm.name as client_name,
  chsm.name as station_name ,csm.current_version_id , csm.no_of_guns,
  csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  from client_charger_mapping ccm 
  inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  inner join charging_model_mst cmm on csm.model_id = cmm.id
  inner join client_mst cm on ccm.client_id = cm.id and cm.status='Y'
  left join city_mst city on csm.city_id = city.id
  left join state_mst sm on csm.state_id = sm.id
  left join country_mst country on csm.country_id = country.id
  
  left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  left join charging_station_mst chsm on csmap.station_id = chsm.id
  where ccm.client_id = ${value} and ccm.status <> 'D';`;

  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {
      let children = await getMappedConnectors();

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_resp[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.charger_id == child.charger_id) {
            final_resp[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }
};

Charger.getAllChargersByUserId = async (id, result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = ` select ucm.id as map_id, ucm.user_id , umn.f_Name as user_f_name, umn.l_Name as user_l_name ,
  ucm.charger_id, csm.name as charger_display_id, csm.serial_no , csm.nick_name,
  ucm.status , ucm.createdby,ucm.created_date,csm.current_fw_version_main_board,
  csm.current_fw_version_id_main_board,csm.current_fw_version_ocpp_board,csm.current_fw_version_id_ocpp_board, 
  csm.current_ampere_value
  from user_charger_mapping ucm 
  inner join user_mst_new umn on ucm.user_id = umn.id
  inner join charger_serial_mst csm on ucm.charger_id = csm.id
  where ucm.user_id = ${id} and ucm.status = 'Y';`;

  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {
      let children = await getMappedConnectors();

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_resp[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.charger_id == child.charger_id) {
            final_resp[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

Charger.getAllChargersByUserIdBLE = async (user_id, result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = ` select ucm.id as map_id, ucm.user_id , umn.f_Name as user_f_name, umn.l_Name as user_l_name ,
  ucm.charger_id, csm.name as charger_display_id, csm.serial_no , csm.nick_name,map_as_child,
  ucm.status , ucm.createdby,ucm.created_date, csm.client_certificate,'' AS 'warranty_status', 
  '' AS 'plan_status',ucm.can_renew_plan,ucm.can_renew_warranty
  , csm.address1,csm.address2,csm.lat,csm.lng,csm.country_id,csm.PIN,csm.created_date,csm.last_ping_datetime,
  csm.city_id, csm.state_id,csm.current_fw_version_main_board,
  csm.current_fw_version_id_main_board,csm.current_fw_version_ocpp_board,csm.current_fw_version_id_ocpp_board, 
  csm.current_ampere_value
  from user_charger_mapping ucm 
  inner join user_mst_new umn on ucm.user_id = umn.id
  inner join charger_serial_mst csm on ucm.charger_id = csm.id
  where ucm.user_id = ${user_id} and ucm.status = 'Y';`

  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {


      for (let p = 0; p < resp.length; p++) {

        let charger_id = final_resp[p].charger_display_id;

        let children = await getChargerPlanWarrantyUser(charger_id, user_id);
        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (child.activity_type.toUpperCase() == 'WARRANTY') {
            final_resp[p].warranty_status = child.status;
          }

          if (child.activity_type.toUpperCase == 'PLAN') {
            final_resp[p].plan_status = child.status;
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};


ChargerStationMap.addChargerToStation = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `insert into charger_station_mapping (charger_id,station_id,
    status,created_date,createdby )
    VALUES (${newCharger.charger_id},${newCharger.station_id},
    '${newCharger.status}','${datetime.toISOString().slice(0, 10)}',${newCharger.created_by}) `;
  ;
  sql.query(stmt, async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    let final_result = await updateChargerAddress(newCharger.charger_id, newCharger.station_id, newCharger.created_by)

    result(null, { id: res.insertId, ...newCharger });
  });
};

//NOT in use as , getChargersByMappedStationId is in use
Charger.getChargersByStationId = (id, result) => {

  let stmt = `select 
      csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
      model_id,csm.station_id , chsm.name as station_name ,
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.Lat,csm.Lng,
      csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
      from ${_TABLE} csm left join version_mst vm on csm.current_version_id = vm.id
      left join city_mst city on csm.city_id = city.id
      left join state_mst sm on csm.state_id = sm.id
      left join country_mst country on csm.country_id = country.id
      
      inner join charging_station_mst chsm on csm.station_id = chsm.id
      where csm.station_id = ? and csm.status = 'Y'
      order by csm.id desc`


  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

Charger.getChargersByMappedStationId = async (id, result) => {
  let resp = await func_getChargersByMappedStationId(id);
  result(null, resp);
};
Charger.getActiveChargersByMappedStationId = async (id, result) => {
  let resp = await func_getActiveChargersByMappedStationId(id);
  result(null, resp);
};

Charger.getChargerById = (id, result) => {

  let stmt = `select 
      csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
      batch_id,csm.model_id, cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available, csm.is_private,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
      from ${_TABLE} csm left join version_mst vm on csm.current_version_id = vm.id
      left join city_mst city on csm.city_id = city.id
      left join state_mst sm on csm.state_id = sm.id
      left join country_mst country on csm.country_id = country.id
      left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
      left join charging_station_mst chsm on csmap.station_id = chsm.id
      left join charger_batch_mst cbm on csm.batch_id = cbm.id
      where csm.id = ? and csm.status<>'D'`;

  sql.query(stmt, id, async (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    let children = await getMappedConnectors();

    let final_res = res;

    for (let p = 0; p < res.length; p++) {
      const parent = res[p];
      final_res[p].connector_data = [];

      for (let c = 0; c < children.res.length; c++) {
        const child = children.res[c];

        if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
          final_res[p].connector_data.push(child);
        }
      }
    }

    result(null, final_res);
  });
};

Charger.getChargerByDisplayId = (display_id, result) => {

  // let stmt = `select 
  //     csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  //     batch_id,csm.model_id, cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
  //     csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  //     csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  //     csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //     csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  //     When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  //     csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  //     from ${_TABLE} csm inner join version_mst vm on csm.current_version_id = vm.id
  //     left join city_mst city on csm.city_id = city.id
  //     left join state_mst sm on csm.state_id = sm.id
  //     left join country_mst country on csm.country_id = country.id
  //     left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  //     left join charging_station_mst chsm on csmap.station_id = chsm.id
  //     left join charger_batch_mst cbm on csm.batch_id = cbm.id
  //     where csm.name = ?  and csm.status<>'D'`;
  let stmt = `select csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
      batch_id,csm.model_id, cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
      chsm.location_type_id,chsm.cp_name, chsm.mobile as station_mobile , chsm.email as station_email,
      chsm.o_time , chsm.c_time, ltm.name as location_type_name , 
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      -- csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      -- csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      chsm.address1  ,chsm.address2  ,chsm.PIN  ,chsm.landmark  ,
      chsm.city_id , city.name as city_name, chsm.state_id, sm.name as state_name, chsm.country_id, country.name as country_name,
      chsm.Lat,chsm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available, csm.is_private,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
      from ${_TABLE} csm left join version_mst vm on csm.current_version_id = vm.id
      left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
      left join charging_station_mst chsm on csmap.station_id = chsm.id
      left join city_mst city on chsm.city_id = city.id
      left join state_mst sm on chsm.state_id = sm.id
      left join country_mst country on chsm.country_id = country.id
      left join charger_batch_mst cbm on csm.batch_id = cbm.id
      left join location_type_mst ltm on chsm.location_type_id = ltm.id
      where csm.name = ?  and csm.status<>'D'`;
  debugger;
  //26 10 2021 : changes are : sending station address details 
  // let stmt = `select 
  // csm.id, csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  // batch_id,csm.model_id, cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
  // chsm.location_type_id,chsm.cp_name, chsm.mobile as station_mobile , chsm.email as station_email,
  // chsm.o_time , chsm.c_time, ltm.name as location_type_name , 
  // csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  // csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  // csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  // chsm.Lat,chsm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  // When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  // csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date
  // from ${_TABLE} csm inner join version_mst vm on csm.current_version_id = vm.id
  // left join city_mst city on csm.city_id = city.id
  // left join state_mst sm on csm.state_id = sm.id
  // left join country_mst country on csm.country_id = country.id
  // left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  // left join charging_station_mst chsm on csmap.station_id = chsm.id
  // left join charger_batch_mst cbm on csm.batch_id = cbm.id
  // left join location_type_mst ltm on chsm.location_type_id = ltm.id
  // where csm.name = ?  and csm.status<>'D'`;

  sql.query(stmt, display_id, async (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    let children = await getMappedConnectors();

    let final_res = res;

    for (let p = 0; p < res.length; p++) {
      const parent = res[p];
      final_res[p].connector_data = [];

      for (let c = 0; c < children.res.length; c++) {
        const child = children.res[c];

        if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
          final_res[p].connector_data.push(child);
        }

      }

    }

    result(null, final_res);
  });
};

Charger.getChargerBySerialNo = (params, result) => {

  let stmt = `select chsm.id as map_id, csmap.station_id ,chsm.name as station_name, csm.id, 
  csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,csm.model_id , 
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available, csm.is_private,csm.current_fw_version_main_board,
      csm.current_fw_version_id_main_board,csm.current_fw_version_ocpp_board,csm.current_fw_version_id_ocpp_board, 
      csm.current_ampere_value,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date,chsm.status as map_status
      from ${_TABLE} csm left join version_mst vm on csm.current_version_id = vm.id   
      left join city_mst city on csm.city_id = city.id
      left join state_mst sm on csm.state_id = sm.id
      left join country_mst country on csm.country_id = country.id   
      left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
      left join charging_station_mst chsm on csmap.station_id = chsm.id
      
      where csm.serial_no = ?  and csm.status<>'D'`;

  sql.query(stmt, params.srNo, async (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    let children = await getMappedConnectors();

    let final_res = res;

    for (let p = 0; p < res.length; p++) {
      const parent = res[p];
      final_res[p].connector_data = [];

      for (let c = 0; c < children.res.length; c++) {
        const child = children.res[c];

        if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
          final_res[p].connector_data.push(child);
        }

      }

    }
    result(null, final_res);
  });
};

Charger.delete = (id, result) => {

  let stmt = `Update ${_TABLE} set status = 'D' WHERE id = ?`;
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


Charger.deleteChargerFromClient = async (id, user_id, result) => {
  var datetime = new Date();
  let stmt = `Update client_charger_mapping set status = 'D',
    modifyby = ${user_id}, modify_date = ?
  WHERE id = ?`;

  let final_res;
  let res;
  try {

    res = await pool.query(stmt, [datetime, id]);
    final_res = {
      status: true,
      message: `SUCCESS`
    }
  } catch (e) {
    final_res = {
      status: false,
      message: `ERROR : ${e.message}`
    }
  } finally {
    result(null, final_res);
  }
};

const insertModelConnector = async (data, charger_id, charger_display_id, created_by) => {
  const datetime = new Date().toISOString().slice(0, 10);

  const values = data.map((item, index) => [
    index + 1, // connector_no
    charger_id,
    item.connector_type_id,
    charger_display_id,
    item.status || 'Y',
    created_by,
    datetime
  ]);

  const deactivateStmt = `
    UPDATE charger_connector_mapping
    SET status = 'D', modify_date = ?, modifyby = ?
    WHERE charger_id = ? OR charger_display_id = ?
  `;

  const insertStmt = `
    INSERT INTO charger_connector_mapping (
      connector_no, charger_id, connector_type_id,
      charger_display_id, status, createdby, created_date
    ) VALUES ?
  `;

  try {
    // Deactivate old connectors
    await pool.query(deactivateStmt, [datetime, created_by, charger_id, charger_display_id]);

    // Insert new connectors
    const insertResult = await pool.query(insertStmt, [values]);

    return {
      status: true,
      message: "SUCCESS insert",
      inserted: insertResult.affectedRows || values.length
    };
  } catch (err) {
    return {
      status: false,
      message: "ERROR during insertModelConnector",
      error: err.message
    };
  }
};



const getChargerPlanWarrantyUser = async (charger_id, user_id) => {

  let stmt = `SELECT MAX(id), activity_type,status   FROM user_acitivity_log WHERE user_id = ${user_id} AND charger_id = '${charger_id}'
  GROUP BY activity_type`;

  let resp = await pool.query(stmt);
  return { res: resp };
}



const getMappedConnectors = async () => {

  let stmt = `select ccm.id as map_id,ccm.charger_id,ccm.connector_no,ccm.connector_type_id,
    ccm.current_status,ccm.current_status_date, ccm.charger_display_id ,
    ctm.name as connector_type_name,ccm.heartbeat_interval,cmcm.model_id,cmcm.id,cmcm.io_type_id,
    im.name as io_type_name,cmcm.current_type_id , cutm.name as current_type_name,
    cmcm.voltage,cmcm.phase,cmcm.max_amp,cmcm.power,cmcm.frequency,cmcm.status
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id
    inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id
    inner join charging_model_connector_map cmcm on csm.model_id = cmcm.model_id and ccm.connector_no = cmcm.connector_no and cmcm.status<>'D'
    inner join io_type_mst im on cmcm.io_type_id=im.id
    inner join current_type_mst cutm on cmcm.current_type_id = cutm.id
    where ccm.status ='Y'
    order by ccm.connector_no`;

  let resp = await pool.query(stmt);
  return { res: resp };
}

const deleteMappedConnectors = async (model_id) => {
  let stmt = `update charging_model_connector_map set 
        status = 'D' where model_id = ? `

  let promise = new Promise((resolve, reject) => {
    sql.query(stmt, [model_id], (err, res) => {
      if (err) {
        reject({ message: "ERROR", error: err });
      }

      if (res.length) {

        resolve({ message: "SUCCESS", res: res });
      }
    })
  })

  return await promise;

}

async function updateChargerAddress(charger_id, station_id, modify_by) {
  var datetime = new Date();
  let promise = new Promise((resolve, reject) => {
    let stmt1 = `select address1,  address2,  PIN , landmark , city_id ,state_id, country_id ,lat,lng
      from charging_station_mst
      where id =  ${station_id} `;

    sql.query(stmt1, async (err, res) => {
      if (err) {
        reject({ message: "ERROR", error: err });
      }

      let stmt = `update ${_TABLE} set 
        station_id = ${station_id}, 
        Lat = ${res[0].lat}, Lng = ${res[0].lng},
        address1='${res[0].address1}'  ,address2 ='${res[0].address2}' ,PIN =${res[0].PIN} ,
        landmark ='${res[0].landmark}' ,city_id=${res[0].city_id} ,state_id=${res[0].state_id} ,
        country_id=${res[0].country_id} ,
        modifyby = ${modify_by},modify_date = '${datetime.toISOString().slice(0, 10)}' 
        where id =  ${charger_id} `;

      sql.query(stmt, async (err, res) => {
        if (err) {
          reject({ message: "ERROR", error: err });
        }

        resolve({ message: "SUCCESS", id: res.insertId });
      });
    });
  })
  return await promise;
}


async function func_getChargers() {
  debugger;

  let stmt = `
    SELECT 
      csm.id, 
      csm.serial_no, 
      CASE 
        WHEN csm.name IS NULL THEN csm.serial_no 
        ELSE csm.name 
      END AS name,
      batch_id, 
      csm.model_id,
      cmm.name AS model_name, 
      cbm.name AS charger_batch_name, 
      csmap.station_id, 
      chsm.name AS station_name,
      csm.current_version_id, 
      vm.name AS version_name, 
      csm.no_of_guns,
      csm.address1, 
      csm.address2, 
      csm.PIN, 
      csm.landmark,
      csm.city_id, 
      city.name AS city_name, 
      csm.state_id, 
      sm.name AS state_name, 
      csm.country_id, 
      country.name AS country_name,
      csm.Lat,
      csm.Lng,
      csm.OTA_Config,
      Periodic_Check_Ref_Time,
      Periodicity_in_hours,
      When_to_Upgrade,
      Upgrade_Specific_Time,
      csm.is_available,
      csm.status,
      csm.created_date,
      csm.createdby,
      csm.modifyby,
      csm.modify_date,
      CASE
        WHEN TIMESTAMPDIFF(SECOND, last_ping_datetime, NOW()) <= heartbeat_interval THEN 'ONLINE'
        ELSE 'OFFLINE/UNAVAILABLE'
      END AS charger_status
    FROM ${_TABLE} csm
    LEFT JOIN city_mst city ON csm.city_id = city.id
    LEFT JOIN state_mst sm ON csm.state_id = sm.id
    LEFT JOIN country_mst country ON csm.country_id = country.id
    LEFT JOIN version_mst vm ON csm.current_version_id = vm.id
    LEFT JOIN charger_batch_mst cbm ON csm.batch_id = cbm.id
    INNER JOIN charging_model_mst cmm ON csm.model_id = cmm.id AND cmm.status = 'Y'
    LEFT JOIN charger_station_mapping csmap ON csm.id = csmap.charger_id AND csmap.status = 'Y'
    LEFT JOIN charging_station_mst chsm ON csmap.station_id = chsm.id
    WHERE csm.status = 'Y'
    ORDER BY csm.id DESC;
  `;

  let resp;
  let final_res;

  try {
    resp = await pool.query(stmt);

    if (resp.length > 0) {
      let children = await getMappedConnectors();
      final_res = resp;

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];
          if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
            if (child.current_status) {
              if (child.current_status.toUpperCase() === 'CHARGING') {
                final_res[p].charger_status = 'ONLINE';
              }
            }

            final_res[p].connector_data.push(child);
          }
        }
      }
    }

    resp = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    };

  } catch (err) {
    resp = {
      status: false,
      message: 'ERROR',
      count: 0,
      data: []
    };
  } finally {
    return resp;
  }
}


Charger.getChargersDynamicFilter = async (params, result) => {
  let resp = await func_getChargersDynamicFilter(params);
  result(null, resp);
};
Charger.getChargersDynamicFilterCW = async (login_id, params, result) => {
  let resp = await func_getChargersDynamicFilterCW(login_id, params);
  result(null, resp);
};


async function func_getChargersDynamicFilter(params) {

  let whereClause = '';
  if (params.cpo_id) whereClause += `  and chsm.cpo_id = ${params.cpo_id} `;
  if (params.station_id) whereClause += ` and csmap.station_id = ${params.station_id} `

  let stmt = ` select csmap.id as map_id,chsm.cpo_id as cpo_id,csm.id as charger_id , csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  batch_id, csm.model_id ,cmm.name as model_name , cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
  csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date,
  CASE
    WHEN (TIMESTAMPDIFF(SECOND, last_ping_datetime, NOW()) <= heartbeat_interval) THEN 'ONLINE'
    ELSE 'OFFLINE/UNAVALIABLE'
  END AS charger_status
  from ${_TABLE} csm 
  left join city_mst city on csm.city_id = city.id
  left join state_mst sm on csm.state_id = sm.id
  left join country_mst country on csm.country_id = country.id
  left join version_mst vm on csm.current_version_id = vm.id
  left join charger_batch_mst cbm on csm.batch_id = cbm.id
  inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
  left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  left join charging_station_mst chsm on csmap.station_id = chsm.id
  left join cpo_mst cm on chsm.cpo_id = cm.id
  where csm.status = 'Y' ${whereClause}
  order by csm.id desc;`;


  let resp;
  let final_res;
  try {
    resp = await pool.query(stmt);
    final_res = resp;
    if (resp.length > 0) {
      let children = await getMappedConnectors();

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];
          if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
            if (!!child.current_status) {
              if (child.current_status.toUpperCase() == 'CHARGING') final_res[p].charger_status = 'ONLINE'
            }

            final_res[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    return resp;
  }
}
async function func_getChargersDynamicFilterCW(login_id, params) {
debugger;
  let whereClause = '';
  if (params.cpo_id) whereClause += `  and chsm.cpo_id = ${params.cpo_id} `;
  if (params.station_id) whereClause += ` and csmap.station_id = ${params.station_id} `

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = ` select csmap.id as map_id,chsm.cpo_id as cpo_id,csm.id as charger_id , csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
      batch_id, csm.model_id ,cmm.name as model_name , cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date,
       CASE
    WHEN (TIMESTAMPDIFF(SECOND, last_ping_datetime, NOW()) <= heartbeat_interval) THEN 'ONLINE'
    ELSE 'OFFLINE/UNAVALIABLE'
  END AS charger_status
      from ${_TABLE} csm 
      left join city_mst city on csm.city_id = city.id
      left join state_mst sm on csm.state_id = sm.id
      left join country_mst country on csm.country_id = country.id
      left join version_mst vm on csm.current_version_id = vm.id
      left join charger_batch_mst cbm on csm.batch_id = cbm.id
      inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
      left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
      left join charging_station_mst chsm on csmap.station_id = chsm.id
      left join cpo_mst cm on chsm.cpo_id = cm.id
      where csm.status = 'Y' ${whereClause}
      order by csm.id desc;`;
  } else {
    stmt = ` select csmap.id as map_id,chsm.cpo_id as cpo_id,csm.id as charger_id , csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
      batch_id, csm.model_id ,cmm.name as model_name , cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
      csm.current_version_id, vm.name as version_name , csm.no_of_guns,
      csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
      csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
      csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
      csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date,
       CASE
    WHEN (TIMESTAMPDIFF(SECOND, last_ping_datetime, NOW()) <= heartbeat_interval) THEN 'ONLINE'
    ELSE 'OFFLINE/UNAVALIABLE'
  END AS charger_status
      from ${_TABLE} csm 
      left join city_mst city on csm.city_id = city.id
      left join state_mst sm on csm.state_id = sm.id
      left join country_mst country on csm.country_id = country.id
      left join version_mst vm on csm.current_version_id = vm.id
      left join charger_batch_mst cbm on csm.batch_id = cbm.id
      inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
      left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
      left join charging_station_mst chsm on csmap.station_id = chsm.id
      inner join cpo_mst cm on chsm.cpo_id = cm.id and  cm.client_id = ${client_id}
      where csm.status = 'Y' ${whereClause} 
      order by csm.id desc;`;
  }


  // stmt = ` select csmap.id as map_id,chsm.cpo_id as cpo_id,csm.id as charger_id , csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name,
  // batch_id, csm.model_id ,cmm.name as model_name , cbm.name as charger_batch_name ,csmap.station_id , chsm.name as station_name ,
  // csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  // csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  // csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  // csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  // When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  // csm.status,csm.created_date,csm.createdby,csm.modifyby,csm.modify_date,
  // CASE
  //   WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= heartbeat_interval) THEN "ONLINE"
  //   ELSE "OFFLINE/UNAVALIABLE"
  // END as charger_status
  // from ${_TABLE} csm 
  // left join city_mst city on csm.city_id = city.id
  // left join state_mst sm on csm.state_id = sm.id
  // left join country_mst country on csm.country_id = country.id
  // inner join version_mst vm on csm.current_version_id = vm.id
  // left join charger_batch_mst cbm on csm.batch_id = cbm.id
  // inner join charging_model_mst cmm on csm.model_id = cmm.id  and cmm.status='Y'
  // left join charger_station_mapping csmap on csm.id = csmap.charger_id and csmap.status <>'D'
  // left join charging_station_mst chsm on csmap.station_id = chsm.id
  // left join cpo_mst cm on chsm.cpo_id = cm.id
  // where csm.status = 'Y' ${whereClause}
  // order by csm.id desc;`;

  let resp;
  let final_res;
  try {
    resp = await pool.query(stmt);
    final_res = resp;
    if (resp.length > 0) {
      let children = await getMappedConnectors();

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];
          if (parent.charger_id == child.charger_id || parent.id == child.charger_id) {
            if (!!child.current_status) {
              if (child.current_status.toUpperCase() == 'CHARGING') final_res[p].charger_status = 'ONLINE'
            }

            final_res[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    return resp;
  }
}

async function func_getChargersByMappedStationId(station_id) {
  debugger;
  let stmt = ` select chsm.id as map_id,chsm.station_id ,cst.name as station_name, csm.id as charger_id,csm.nick_name as charger_nick_name,
    csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name, csm.model_id  ,
    csm.current_version_id, vm.name as version_name , csm.no_of_guns, cst.address1  ,cst.address2  ,cst.PIN  ,cst.landmark  ,
    cst.city_id , city.name as city_name, cst.state_id, sm.name as state_name, cst.country_id, country.name as country_name,
    cst.Lat,cst.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
    csm.status as charger_status, csm.heartbeat_interval ,chsm.status ,chsm.created_date,chsm.createdby,chsm.modifyby,chsm.modify_date
    from charger_station_mapping chsm  inner join charger_serial_mst csm on chsm.charger_id = csm.id and csm.status ='Y'
    inner join charging_station_mst cst on chsm.station_id = cst.id and cst.status='Y'
    left join city_mst city on cst.city_id = city.id
    left join state_mst sm on cst.state_id = sm.id
    left join country_mst country on cst.country_id = country.id
    left join version_mst vm on csm.current_version_id = vm.id
    where chsm.station_id=? and chsm.status <> 'D' order by chsm.id;`;

  //24 02 2022 : address fields picked up from station master table as picking charger address from charger mst is wrong
  // let stmt = ` select chsm.id as map_id,chsm.station_id ,cst.name as station_name, csm.id as charger_id, csm.serial_no, 
  //     case when csm.name is null then csm.serial_no else csm.name end as name,
  //     csm.model_id  ,
  //     csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  //     csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  //     csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //     csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  //     When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  //     csm.status as charger_status, csm.heartbeat_interval ,
  //     chsm.status ,chsm.created_date,chsm.createdby,chsm.modifyby,chsm.modify_date
  //     from charger_station_mapping chsm
  //     inner join charger_serial_mst csm on chsm.charger_id = csm.id and csm.status <>'D'
  //     left join city_mst city on csm.city_id = city.id
  //     left join state_mst sm on csm.state_id = sm.id
  //     left join country_mst country on csm.country_id = country.id
  //     inner join version_mst vm on csm.current_version_id = vm.id
  //     inner join charging_station_mst cst on chsm.station_id = cst.id
  //     where chsm.station_id = ? and chsm.status <> 'D' order by chsm.id ;`;

  let resp;
  let final_res;
  try {

    resp = await pool.query(stmt, [station_id]);

    if (resp.length > 0) {
      let children = await getMappedConnectors();
      final_res = resp;

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.charger_id == child.charger_id) {
            final_res[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    return resp;
  }
}

async function func_getActiveChargersByMappedStationId(station_id) {
  let stmt = ` select chsm.id as map_id,chsm.station_id ,cst.name as station_name, csm.id as charger_id, 
  csm.serial_no, case when csm.name is null then csm.serial_no else csm.name end as name, csm.model_id  ,
  csm.current_version_id, vm.name as version_name , csm.no_of_guns, cst.address1  ,cst.address2  ,cst.PIN  ,cst.landmark  ,
  cst.city_id , city.name as city_name, cst.state_id, sm.name as state_name, cst.country_id, country.name as country_name,
  cst.Lat,cst.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  csm.status as charger_status, csm.heartbeat_interval ,chsm.status ,chsm.created_date,chsm.createdby,chsm.modifyby,chsm.modify_date
  from charger_station_mapping chsm  inner join charger_serial_mst csm on chsm.charger_id = csm.id and csm.status ='Y'
  inner join charging_station_mst cst on chsm.station_id = cst.id and cst.status='Y'
  left join city_mst city on cst.city_id = city.id
  left join state_mst sm on cst.state_id = sm.id
  left join country_mst country on cst.country_id = country.id
  left join version_mst vm on csm.current_version_id = vm.id
  where chsm.station_id=? and chsm.status = 'Y' order by chsm.id;`;

  //24 02 2022 : new query as above function
  // let stmt = ` select 
  //     chsm.id as map_id,chsm.station_id ,cst.name as station_name, csm.id as charger_id, csm.serial_no, 
  //     case when csm.name is null then csm.serial_no else csm.name end as name,
  //     csm.model_id  ,
  //     csm.current_version_id, vm.name as version_name , csm.no_of_guns,
  //     csm.address1  ,csm.address2  ,csm.PIN  ,csm.landmark  ,
  //     csm.city_id , city.name as city_name, csm.state_id, sm.name as state_name, csm.country_id, country.name as country_name,
  //     csm.Lat,csm.Lng,csm.OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
  //     When_to_Upgrade,Upgrade_Specific_Time,csm.is_available,
  //     csm.status as charger_status, csm.heartbeat_interval ,
  //     chsm.status ,chsm.created_date,chsm.createdby,chsm.modifyby,chsm.modify_date
  //     from charger_station_mapping chsm
  //     inner join charger_serial_mst csm on chsm.charger_id = csm.id and csm.status <>'D'
  //     left join city_mst city on csm.city_id = city.id
  //     left join state_mst sm on csm.state_id = sm.id
  //     left join country_mst country on csm.country_id = country.id
  //     inner join version_mst vm on csm.current_version_id = vm.id
  //     inner join charging_station_mst cst on chsm.station_id = cst.id
  //     where chsm.station_id = ? and chsm.status = 'Y' order by chsm.id ;`;

  let resp;
  let final_res;
  try {
    resp = await pool.query(stmt, [station_id]);

    if (resp.length > 0) {
      let children = await getMappedConnectors();
      final_res = resp;

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.charger_id == child.charger_id) {
            final_res[p].connector_data.push(child);
          }

        }

      }
    }

    resp = {
      status: true,
      message: final_res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_res.length,
      data: final_res
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    return resp;
  }
}
ChargingProfile.getAllChargingProfileList = async result => {

  let final_res;
  let res;

  let stmt = `select cpm.id as chargingProfileId,cpm.stack_level,cpm.charging_profile_name,cpm.valid_from as validFrom,
  cpm.valid_to as validTo,cpm.status,
  mc.value as chargingProfilePurpose,mc1.value as chargingProfileKind, mc2.value as recurrencyKind 
  from charging_profile_mst cpm
  inner join master_config mc on cpm.charging_profile_purpose_id=mc.id 
  inner join master_config mc1 on cpm.charging_profile_kind_id=mc1.id 
  inner join master_config mc2 on cpm.recurrency_kind_id=mc2.id
  where  cpm.status='Y' order by cpm.id;`;

  // let stmt = `select cpm.id as chargingProfileId,cpm.stack_level,cpm.charging_profile_name,cpm.valid_from as validFrom,
  //   cpm.valid_to as validTo,cpm.status,csm.duration,csm.start_schedule as startSchedule,csm.id as schedule_id,
  //   csm.mincharging_rate as minChargingRate, cspm.start_period as startPeriod,cspm.id as schedule_period_id,cspm.period_limit,
  //   mc4.value as numberPhases,mc3.value as ChargingRateUnit,mc.value as chargingProfilePurpose,mc1.value as chargingProfileKind, mc2.value as recurrencyKind 
  //   from charging_profile_mst cpm
  //   inner join charging_schedule_mst csm on cpm.id=csm.charging_profile_id 
  //   inner join charging_schedule_period_mst cspm on cspm.charging_schedule_id=csm.id
  //   inner join master_config mc on cpm.charging_profile_purpose_id=mc.id 
  //   inner join master_config mc1 on cpm.charging_profile_kind_id=mc1.id 
  //   inner join master_config mc2 on cpm.recurrency_kind_id=mc2.id
  //   inner join master_config mc3 on csm.charging_rate_unit_id=mc3.id 
  //   inner join master_config mc4 on cspm.numberof_phase_id=mc4.id   
  //   where  cpm.status='Y' order by csm.id;`;

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
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
}


ChargingProfile.ChargingScheduleCreation = async (data, result) => {

  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into charging_schedule_mst(charging_profile_id,duration,start_schedule,charging_rate_unit_id,
    mincharging_rate,status,created_date,createdby) values (?) `;
  let values = [data.charging_profile_id, data.duration, data.start_schedule, data.charging_rate_unit_id,
  data.mincharging_rate, data.status, datetime, data.created_by];
  try {
    resp = await pool.query(stmt2, [values]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{ id: resp.insertId }]
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

};
ChargingProfile.ChargingProfileCreation = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into charging_profile_mst (stack_level,charging_profile_kind_id,charging_profile_name,
    recurrency_kind_id,charging_profile_purpose_id,valid_from,valid_to,status,created_date,createdby) values (?) `;
  let values = [data.stack_level, data.charging_profile_kind_id, data.charging_profile_name,
  data.recurrency_kind_id, data.charging_profile_purpose_id, data.valid_from, data.valid_to, data.status, datetime, data.created_by];
  try {
    resp = await pool.query(stmt2, [values]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{ id: resp.insertId }]
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

};
ChargingProfile.ChargingSchedulePeriodCreation = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let values = [];
  let stmt = `insert into charging_schedule_period_mst(charging_schedule_id,start_period,period_limit,numberof_phase_id,
    status,created_date,createdby) values ? `;
  try {

    for (let index = 0; index < data.scheduleData.length; index++) {

      values.push([data.charging_schedule_id, data.scheduleData[index].start_period,
      data.scheduleData[index].period_limit, data.scheduleData[index].numberof_phase_id, data.status, datetime,
      data.created_by]);

    }

    if (values.length > 0) {
      resp = await pool.query(stmt, [values]);
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: resp.affectedRows > 0 ? 'ERROR : 0' : 'ERROR : 1',
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        data: [{ id: resp.insertId }]
      }
    } else {

      final_res = {
        status: false,
        err_code: `ERROR : ${err.code}`,
        message: `ERROR : there is nothing to insert`,
        data: []

      }
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

};
ChargingProfile.ChargingProfileDelete = async (id, modify_by, result) => {

  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update charging_profile_mst set status = 'D',
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modify_by, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

};
ChargingProfile.ChargingScheduleDelete = async (id, modifyby, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update charging_schedule_mst set 
  modifyby = ?, modify_date = ?,status="D"
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modifyby, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

};
ChargingProfile.ChargingSchedulePeriodDelete = async (id, modifyby, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update charging_schedule_period_mst set 
  modifyby = ?, modify_date = ?,status="D"
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modifyby, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

};
ChargingProfile.UpdateChargingProfile = async (data, result) => {
  debugger;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `update charging_profile_mst set charging_profile_name = ? , stack_level = ? ,
  charging_profile_purpose_id = ?,charging_profile_kind_id = ?,valid_from=?,valid_to=?,status = ?,modify_date=?,modifyby= ? where id = ? `;



  try {

    resp = await pool.query(stmt2, [data.charging_profile_name, data.stack_level,
    data.charging_profile_purpose_id, data.charging_profile_kind_id, data.valid_from, data.valid_to, data.status, datetime, data.modifyby, data.id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [data.id]
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

};

ChargingProfile.UpdateChargingSchedule = async (data, result) => {
  debugger;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `update charging_schedule_mst set charging_profile_id=?,duration=?,start_schedule=?,charging_rate_unit_id=?,
  mincharging_rate=?,status=?,modify_date=?,modifyby=? where id = ? `;



  try {

    resp = await pool.query(stmt2, [data.charging_profile_id, data.duration,
    data.start_schedule, data.charging_rate_unit_id, data.mincharging_rate, data.status,
      datetime, data.modifyby, data.id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

};

ChargingProfile.UpdateChargingSchedulePeriod = async (data, result) => {
  debugger;
  var datetime = new Date();
  let final_resp;
  let resp;
  let values = [];

  let stmt = `update charging_schedule_period_mst set charging_schedule_id = ?,
  start_period = ?, period_limit = ?,numberof_phase_id = ? ,status = ?,
  modify_date=?,modifyby= ? where id = ? ;`;

  try {
    for (let index = 0; index < data.scheduleData.length; index++) {

      resp = await pool.query(stmt, [data.charging_schedule_id, data.scheduleData[index].start_period,
      data.scheduleData[index].period_limit, data.scheduleData[index].numberof_phase_id, data.status, datetime,
      data.modifyby, data.scheduleData[index].id]);
    }

    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows > 0 ? resp.affectedRows : 0,
      data: [{ id: data.scheduleData }]
    }

  } catch (err) {

    final_resp = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_resp);
  }

};

ChargingProfile.getAllEVChargingProviderList = async result => {

  let final_res;
  let resp;

  let stmt = `select  id,name,role,offerings,projects,status,remarks from ev_charging_solu_provider_mst where status<>"D";`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
    result(null, final_res);
  }
}
ChargingProfile.CreateEVChargingProvider = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let final_resp;
  let stmt = `insert into ev_charging_solu_provider_mst(name,role,offerings,projects,remarks,status,created_date,createdby) values (?,?,?,?,?,?,?,?)`;
  let values = [data.name, data.role, data.offerings, data.projects, data.remarks, data.status, datetime, data.created_by];
  try {
    resp = await pool.query(stmt, values);
    final_resp = {
      status: resp.insertId > 0 ? true : false,
      err_code: resp.insertId > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp.insertId > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp.length,
      data: [resp.insertId]
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
ChargingProfile.updateEVChargingProvider = async (data, result) => {

  var datetime = new Date();
  let resp;
  let final_resp;
  let stmt = `update ev_charging_solu_provider_mst set name=?,
  role=?,offerings=?,projects=?,remarks=?,status=?,modifyby=?,modify_date=? where id=?;`;
  let values = [data.name, data.role, data.offerings, data.projects, data.remarks, data.status, data.modifyby, datetime, data.id];

  try {
    resp = await pool.query(stmt, values);
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
    }
  } catch (err) {

    final_resp = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_resp);
  }

};

ChargingProfile.deleteEVChargingProvider = async (id, modifyby, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update ev_charging_solu_provider_mst set 
  modifyby = ?, modify_date = ?,status="D"
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modifyby, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? 'ERROR : 0' : 'ERROR : 1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
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

};
ChargingProfile.getChargerProfile = async result => {

  let final_res;
  let resp;

  let stmt = `select id,charging_profile_name from charging_profile_mst where status="Y";`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
    result(null, final_res);
  }
}

ChargingProfile.getChargerProfile_mst = async result => {

  let final_res;
  let resp;

  let stmt = `select id,stack_level,charging_profile_name,charging_profile_kind_id,recurrency_kind_id,
  charging_profile_purpose_id,valid_from,valid_to,status from charging_profile_mst;`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
    result(null, final_res);
  }
}

ChargingProfile.getChargerScheduleByProfileId = async (profile_id, result) => {

  let final_res;
  let resp;

  let stmt = `  select id,duration,start_schedule,charging_rate_unit_id,
  mincharging_rate,status from charging_schedule_mst where charging_profile_id=${profile_id};`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
    result(null, final_res);
  }
}
ChargingProfile.getChargerSchedulePeriodByScheduleId = async (schedule_id, result) => {

  let final_res;
  let resp;

  let stmt = ` select id,start_period,period_limit,numberof_phase_id,status
   from charging_schedule_period_mst where charging_schedule_id = ${schedule_id};`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
    result(null, final_res);
  }
}


Charger.getAllBleChargers = async (result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `SELECT aa.*,bb.plan_validity,bb.start_date 'warranty_start_date',
  bb.end_date 'warranty_end_date',bb.warranty_status
   FROM (SELECT ifnull(ucm.id,0)AS map_id, umn.id 'user_id', umn.f_Name AS user_f_name, ifnull(l_Name,'') AS user_l_name ,umn.mobile,
    ifnull(ucm.charger_id,0), ifnull(csm.name,0) AS charger_display_id, ifnull(csm.serial_no,'')serial_no , ifnull(csm.nick_name,'')nick_name,
    ucm.status 'user_status', ifnull(ucm.createdby,0)createdby,ifnull(ucm.created_date,'') 'installation_date',IFNULL(ucm.can_renew_plan,'N') can_renew_plan,IFNULL(ucm.can_renew_warranty,'N') can_renew_warranty
    , ifnull(csm.address1,'')address1,ifnull(csm.address2,'')address2,csm.lat,csm.lng,ifnull(csm.country_id,0)country_id,ifnull(csm.PIN,0)PIN,ifnull(csm.created_date,'') 'activation_date',ifnull(csm.last_ping_datetime,'')last_ping_datetime,ifnull(cm.name,'')'city', ifnull(sm.name,'')'state',
    ifnull(ctm.name,'') 'charger_model'
    FROM user_mst_new  umn  
    LEFT JOIN  user_charger_mapping ucm ON umn.id = ucm.user_id
    LEFT JOIN charger_serial_mst csm ON ucm.charger_id = csm.id
    LEFT JOIN charger_type_mst ctm  ON csm.model_id = ctm.id
    LEFT JOIN city_mst cm ON  csm.city_id = cm.id
    LEFT JOIN state_mst sm ON  cm.state_id = sm.id   WHERE umn.ble_user_id IS NOT NULL
    )aa LEFT JOIN ( SELECT MAX(ual.id),start_date,end_date,wm.plan_validity,ual.charger_id,CASE ual.status  WHEN 'P' THEN 'Pending' 
    WHEN 'A' THEN 'Active'
  WHEN 'E' THEN 'Expried'
  ELSE
  'Pending'	
    END  AS 'warranty_status' FROM user_acitivity_log ual
  INNER JOIN warranty_master wm ON ual.activity_id = wm.id	GROUP BY ual.charger_id) bb ON aa.charger_display_id = bb.charger_id;`
  console.log(stmt);
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};



ChargerRenewalRequestBle.updateBleChargerStatus = async (request,user_id, result) => {
  //all chargers mapped to a user

  let qry = `call pBleUpdateChargerRenewalStatus(${user_id},${request.id},'${request.can_renew_warranty}','${request.can_renew_plan}','${request.remarks}',
    '${request.modify_by}','${request.status}',${request.request_id},'${request.visit_date}','${request.charger_condition}','${request.charger_description}','${request.engineer_name}',
    '${request.vendor_name}',${request.amount_collected},'${request.payment_mode}','${request.image_path}','${request.physical_visit}')`;
  


  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    //final_resp = resp;
    final_result = {
      status: true,
      message: resp.affectedRows > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.affectedRows,
      data: []
    }

  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }

};

Charger.updateChargerAddressBLE = async (data, result) => {
  debugger;
  //all chargers mapped to a user
  var datetime = new Date();
  let final_resp;
  let resp;

  // for Ble Users charger address will be station address
  let stmt = `Update charging_station_mst set address1=?,address2=?,PIN=?,landmark=?,city_id=?,
  state_id=?,country_id=?,Lat=?,Lng=?,modify_date=?,modifyby=? where id=?;`;

  let values = [data.address1, data.address2, data.PIN, data.landmark, data.city_id, data.state_id,
  data.country_id, data.Lat, data.Lng, datetime, data.modify_by, data.station_id];
  try {
    resp = await pool.query(stmt, values);
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
    }
  } catch (err) {

    final_resp = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_resp);
  }

};


Charger.getPendingWarrantyRequestBle = async (result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `SELECT aa.*,bb.plan_validity,bb.start_date 'warranty_start_date',
  bb.end_date 'warranty_end_date',bb.warranty_status
     FROM (SELECT crl.id 'request_id', umn.id 'user_id', umn.f_Name AS user_f_name, umn.l_Name AS user_l_name,
      ucm.charger_id, csm.name AS charger_display_id, csm.serial_no , csm.nick_name,
      ucm.status 'user_status', ifnull(ucm.createdby,0)createdby,ucm.created_date 'installation_date',IFNULL(ucm.can_renew_plan,'N') can_renew_plan,IFNULL(ucm.can_renew_warranty,'N') can_renew_warranty
      ,crl.mobile,crl.image_url1,ifnull(crl.image_url2,'')image_url2,ifnull(crl.image_url3,'')image_url3,
crl.landmark, crl.PIN,crl.remarks,crl.request_type,csm.created_date 'activation_date',ifnull(csm.last_ping_datetime,'')last_ping_datetime,ifnull(cm.name,'')'city', ifnull(sm.name,'') 'state',
      ctm.name 'charger_model',crl.amount_collected,ifnull(crl.charger_condition,'')charger_condition,ifnull(crl.charger_description,'')charger_description,ifnull(crl.engineer_name,'')engineer_name,
      ifnull(crl.image_path,'')image_path,ifnull(crl.payment_mode,'')payment_mode,ifnull(crl.vendor_name,'')vendor_name,ifnull(crl.visit_date,'')visit_date,ifnull(crl.physical_visit,'')physical_visit,ifnull(crl.created_date,'')createddate
      FROM user_mst_new  umn  
      INNER JOIN charger_renewal_request_log crl ON umn.id = crl.user_id 
      LEFT JOIN  user_charger_mapping ucm ON crl.user_id = ucm.user_id
      LEFT JOIN charger_serial_mst csm ON ucm.charger_id = csm.id
      LEFT JOIN charger_type_mst ctm  ON csm.model_id = ctm.id
      LEFT JOIN city_mst cm ON  csm.city_id = cm.id
      LEFT JOIN state_mst sm ON  cm.state_id = sm.id  WHERE crl.status IN('P','R','IP')
      ) aa INNER JOIN 
      (SELECT MAX(ual.id),start_date,end_date,wm.plan_validity,ual.charger_id,CASE ual.status  WHEN 'P' THEN 'Pending' 
      WHEN 'A' THEN 'Active'
    WHEN 'E' THEN 'Expried'
    ELSE 'Pending'	
      END  AS 'warranty_status' FROM user_acitivity_log ual
    INNER JOIN warranty_master wm ON ual.activity_id = wm.id	GROUP BY ual.charger_id)
    bb ON aa.charger_display_id = bb.charger_id ;`
  console.log(stmt);
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};



Charger.checkChargerMappedToStationBySrNo = async (serial_no, result) => {
  debugger;
  let final_resp;
  let resp;
  let resp1;

  let stmt = `select id from charger_serial_mst where serial_no="${serial_no}" and status="Y";`;
  let stmt1 = `select id,station_id from charger_station_mapping where charger_id = ? and 
    status='Y';`;
  try {
    resp = await pool.query(stmt);

    if (resp.length > 0) {
      resp1 = await pool.query(stmt1, resp[0].id);
      final_resp = {
        status: resp1.length > 0 ? 'true' : 'false',
        err_code: resp1.length > 0 ? 'ERROR:0' : 'ERROR:1',
        message: resp1.length > 0 ? 'Charger is already mapped to station' : 'charger is not mapped to station',
        count: resp1.length,
        data: [{
          charger_id: resp[0].id,
          station_id: resp1.length > 0 ? resp1[0].station_id : null
        }]
      }
    }
    else {
      final_resp = {
        status: false,
        message: 'Charger does not exist.'
      }
    }
  }
  catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }

};

AddChargerRequest.createChargerRequest = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp1;
  let resp;
  let final_resp;
  let stmt = `select id from add_charger_request_log where charger_serial_no=? and status<>'D';`;
  let stmt1 = `insert into add_charger_request_log(user_id,charger_id,charger_serial_no,station_name,
      provider,model,lat,lng,address1,address2,PIN,landmark,city_id,state_id,country_id,image_url,remarks,
      status,created_date,createdby) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  let values = [data.user_id, data.charger_id, data.charger_serial_no, data.station_name, data.provider,
  data.model, data.lat, data.lng, data.address1, data.address2, data.PIN, data.landmark, data.city_id,
  data.state_id, data.country_id, data.image_url, data.remarks, data.status, datetime, data.created_by];
  try {
    debugger;
    resp = await pool.query(stmt, data.charger_serial_no);
    if (resp.length > 0) {
      final_resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: ' Request for this charger serial number is already registered.',
      }
      res.status(200).send(final_resp);
    } else {
      resp1 = await pool.query(stmt1, values);
      final_resp = {
        status: resp1.insertId > 0 ? true : false,
        err_code: resp1.insertId > 0 ? `ERROR : 0` : 'ERROR : 1',
        message: resp1.insertId > 0 ? 'SUCCESS' : 'NOT FOUND',
        data: [resp1.insertId]
      }
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

AddChargerRequest.getAllModerateChargerRequest = async (result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `select acrl.id,acrl.user_id,umn.username as user_name,acrl.charger_id,csm.name as charger_name,
  acrl.charger_serial_no,acrl.station_name,acrl.provider,acrl.model,acrl.lat,acrl.lng,acrl.address1,
  acrl.address2,acrl.PIN,acrl.landmark,acrl.city_id,cm.name as city_name,acrl.state_id,sm.name as state_name,
  acrl.country_id,com.name as country_name,acrl.image_url,acrl.remarks,acrl.status,acrl.created_date,
  acrl.createdby from add_charger_request_log acrl
  inner join user_mst_new umn on acrl.user_id=umn.id and umn.status='Y' 
  INNER join city_mst cm on acrl.city_id=cm.id and cm.status='Y'
  INNER join state_mst sm on acrl.state_id=sm.id and sm.status='Y'
  INNER join country_mst com on acrl.country_id=com.id and com.status='Y'
  left join charger_serial_mst csm on acrl.charger_serial_no=csm.serial_no 
  where acrl.status='M';`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

AddChargerRequest.approveRejectChargerRequest = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp1;
  let final_resp;
  let stmt = `update add_charger_request_log set status=?,modify_date=?,modifyby = ? where id=?;`;
  let values = [data.status, datetime, data.modify_by, data.id];
  try {
    resp1 = await pool.query(stmt, values);
    final_resp = {
      status: resp1.affectedRows > 0 ? true : false,
      err_code: resp1.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp1.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp1.length,
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

AddChargerRequest.getAllApproveRejectChargerRequest = async (result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `select acrl.id,acrl.user_id,umn.username as user_name,acrl.charger_id,csm.name as charger_name,
  acrl.charger_serial_no,acrl.station_name,acrl.provider,acrl.model,acrl.lat,acrl.lng,acrl.address1,
  acrl.address2,acrl.PIN,acrl.landmark,acrl.city_id,cm.name as city_name,acrl.state_id,sm.name as state_name,
  acrl.country_id,com.name as country_name,acrl.image_url,acrl.remarks,acrl.status,acrl.created_date,
  acrl.createdby from add_charger_request_log acrl
  inner join user_mst_new umn on acrl.user_id=umn.id and umn.status='Y' 
  INNER join city_mst cm on acrl.city_id=cm.id and cm.status='Y'
  INNER join state_mst sm on acrl.state_id=sm.id and sm.status='Y'
  INNER join country_mst com on acrl.country_id=com.id and com.status='Y'
  left join charger_serial_mst csm on acrl.charger_serial_no=csm.serial_no 
  where acrl.status='A' or acrl.status='R';`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

AddChargerRequest.updateChargerRequest = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp1;
  let final_resp;
  let stmt = `update add_charger_request_log set user_id=?,charger_id=?,charger_serial_no=?,station_name=?,
      provider=?,model=?,lat=?,lng=?,address1=?,address2=?,PIN=?,landmark=?,city_id=?,state_id=?,country_id=?,image_url=?,remarks=?,
      status=?,modify_date=?,modifyby=? where id=?;`;

  let values = [data.user_id, data.charger_id, data.charger_serial_no, data.station_name, data.provider,
  data.model, data.lat, data.lng, data.address1, data.address2, data.PIN, data.landmark, data.city_id,
  data.state_id, data.country_id, data.image_url, data.remarks, data.status, datetime, data.modify_by, data.id];
  try {
    resp1 = await pool.query(stmt, values);
    final_resp = {
      status: resp1.affectedRows > 0 ? true : false,
      err_code: resp1.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp1.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp1.length,
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

AddChargerRequest.getApproveRejectChargerRequestByUserId = async (user_id, result) => {


  let final_resp;
  let resp;

  let stmt = `select acrl.id,acrl.user_id,umn.username as user_name,acrl.charger_id,csm.name as charger_name,
  acrl.charger_serial_no,acrl.station_name,acrl.provider,acrl.model,acrl.lat,acrl.lng,acrl.address1,
  acrl.address2,acrl.PIN,acrl.landmark,acrl.city_id,cm.name as city_name,acrl.state_id,sm.name as state_name,
  acrl.country_id,com.name as country_name,acrl.image_url,acrl.remarks,acrl.status,acrl.created_date,
  acrl.createdby from add_charger_request_log acrl
  inner join user_mst_new umn on acrl.user_id=umn.id and umn.status='Y' 
  INNER join city_mst cm on acrl.city_id=cm.id and cm.status='Y'
  INNER join state_mst sm on acrl.state_id=sm.id and sm.status='Y'
  INNER join country_mst com on acrl.country_id=com.id and com.status='Y'
  left join charger_serial_mst csm on acrl.charger_serial_no=csm.serial_no 
  where acrl.status='A' or acrl.status='R'and user_id=${user_id};`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

AddChargerRequest.getModerateChargerRequestByUserId = async (user_id, result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `select acrl.id,acrl.user_id,umn.username as user_name,acrl.charger_id,csm.name as charger_name,
  acrl.charger_serial_no,acrl.station_name,acrl.provider,acrl.model,acrl.lat,acrl.lng,acrl.address1,
  acrl.address2,acrl.PIN,acrl.landmark,acrl.city_id,cm.name as city_name,acrl.state_id,sm.name as state_name,
  acrl.country_id,com.name as country_name,acrl.image_url,acrl.remarks,acrl.status,acrl.created_date,
  acrl.createdby from add_charger_request_log acrl
  inner join user_mst_new umn on acrl.user_id=umn.id and umn.status='Y' 
  INNER join city_mst cm on acrl.city_id=cm.id and cm.status='Y'
  INNER join state_mst sm on acrl.state_id=sm.id and sm.status='Y'
  INNER join country_mst com on acrl.country_id=com.id and com.status='Y'
  left join charger_serial_mst csm on acrl.charger_serial_no=csm.serial_no 
  where acrl.status='M' and user_id=${user_id};`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

AddChargerRequest.deleteChargerRequest = async (id, modify_by, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let final_resp;
  let stmt = `update add_charger_request_log set status='D',modify_date=?,modifyby=${modify_by} where id=${id};`;

  try {
    resp = await pool.query(stmt, datetime);
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp.affectedRows,
      data: []
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

Set_Schedule_BLE.createScheduleBLE = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let resp1;
  let resp2;
  let resp3;
  let respCount=0;
  let respCount1=0;
  let final_resp;
  let stmt3 = `select id,schedule_id,charger_serial_no,user_id,status,stop_schedule_time from set_schedule_ble 
  where charger_serial_no=?
  and  stop_schedule_time > DATE_ADD(now(),interval 24 hour) and status='Y';`;

  let stmt2 = `select id,schedule_id,start_schedule_time,stop_schedule_time,status from set_schedule_ble 
where start_schedule_time between now() and DATE_ADD(now(),interval 24 hour) and status='Y'
and charger_serial_no=? order by start_schedule_time desc;`;

  let stmt = `select case when max(schedule_id) is null then 1 else max(schedule_id) +1 
  end as next_schedule_id from set_schedule_ble ;`;
  let stmt1 = `insert into set_schedule_ble (charger_serial_no,user_id,schedule_id,start_schedule_time,
    stop_schedule_time,duration,schedule_type,schedule_name,day_name,schedule_status,status,created_date,
    createdby)values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  try {
  if(data.schedule_type =='ONE_TIME'){
    resp2= await pool.query(stmt2,data.charger_serial_no);
    respCount = resp2.length
  }else{
   resp3 = await pool.query(stmt3,data.charger_serial_no);
   respCount1 = resp3.length
  }
  if(respCount>0 || respCount1>0){
      final_resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: `Current schedule is already exist at this time`,
        count: 0,
        data: []
      }
    }
    else{
    resp = await pool.query(stmt);
    
    for (let i = 0; i < data.schedule.length; i++) {

      let values = [data.charger_serial_no, data.user_id, resp[0].next_schedule_id, data.start_schedule_time,
      data.stop_schedule_time, data.duration, data.schedule_type, data.schedule_name,
      data.schedule[i].day_name,data.schedule_status, data.schedule[i].status, datetime, data.created_by];

      resp1 = await pool.query(stmt1, values);
    }
  
    final_resp = {
      status: resp1.insertId > 0 ? true : false,
      err_code: resp1.insertId > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp1.insertId > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp1.insertId,
      data: [{"insertId":resp1.insertId}]
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
    result(null, final_resp);
  }
}

Set_Schedule_BLE.getAllScheduleBLE = async (result) => {

  let final_resp;
  let resp;

  let stmt = `SELECT id,charger_serial_no,user_id,schedule_id,start_schedule_time,stop_schedule_time,
              duration,schedule_type,schedule_name,day_name,status,created_date,createdby,modify_date,modifyby
               from set_schedule_ble where status<>'D';`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

Set_Schedule_BLE.getScheduleBLEByChargerSerialNo = async (charger_serial_no, result) => {
 debugger;
  let final_resp;
  let resp;

  let stmt = `SELECT id,charger_serial_no,user_id,schedule_id,start_schedule_time,stop_schedule_time,
  duration,schedule_type,schedule_name,day_name,status,created_date,createdby,modify_date,modifyby
   from set_schedule_ble where status<>'D' and charger_serial_no='${charger_serial_no}';`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  }
   finally {
    result(null, resp);
  }

};

Set_Schedule_BLE.getScheduleBLEByUserId = async (user_id, result) => {
  //all chargers mapped to a user

  let final_resp;
  let resp;

  let stmt = `SELECT id,charger_serial_no,user_id,schedule_id,start_schedule_time,stop_schedule_time,
  duration,schedule_type,schedule_name,day_name,status,created_date,createdby,modify_date,modifyby
   from set_schedule_ble where status<>'D' and user_id=${user_id};`;
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    resp = {
      status: true,
      message: final_resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: final_resp.length,
      data: final_resp
    }
  } catch (err) {
    resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, resp);
  }

};

Set_Schedule_BLE.ScheduleBLEByChargerSerialNoAndUserId = async (user_id,charger_serial_no,schedule_type, result) => {
  debugger;

  let final_resp;
  let resp;
  let ele ;
  let days_arr={} ;
  let schedule_arr={} ;
  let main_arr={} ;
  let schedule_id ;
  let previous_schedule_id ;
  let whereClause='';
  if(schedule_type=='one-time'){
  whereClause=` where status<>'D' and user_id='${user_id}' and charger_serial_no='${charger_serial_no}'
  and schedule_type='${schedule_type}' and start_schedule_time between now() and DATE_ADD(now(),interval 24 hour)
   order by id DESC,status;`;
  }else{
    whereClause=` where status<>'D' and user_id='${user_id}' and charger_serial_no='${charger_serial_no}'
    and schedule_type='${schedule_type}' order by id DESC,status;`; 
  }
  let stmt = `SELECT id,charger_serial_no,user_id,schedule_id,start_schedule_time,stop_schedule_time,
  duration,schedule_type,schedule_name,day_name,schedule_status,status,created_date,createdby,modify_date,modifyby
   from set_schedule_ble ${whereClause}`;
  try {
    resp = await pool.query(stmt);

    debugger;

    for (let i = 0; i < resp.length; i++) {
      ele = resp[i];
      schedule_id = ele.schedule_id;

      if(i==0){
        main_arr.charger_serial_no = ele.charger_serial_no;
        main_arr.user_id = ele.user_id;
        main_arr.schedules = [];

        schedule_arr.schedule_id = schedule_id;
        schedule_arr.schedule_name = ele.schedule_name;
        schedule_arr.schedule_type = ele.schedule_type;
        schedule_arr.start_schedule_time = ele.start_schedule_time;
        schedule_arr.stop_schedule_time = ele.stop_schedule_time;
        schedule_arr.schedule_status = ele.schedule_status;
        schedule_arr.duration = ele.duration;
        days_arr = {
          id:ele.id,
          day_name : ele.day_name,
          status : ele.status,
        }
        schedule_arr.days = [];
        schedule_arr.days.push(days_arr);
        main_arr.schedules.push(schedule_arr);

      }else if(i==resp.length-1){

        if(schedule_id==previous_schedule_id){
          days_arr={};
          days_arr = {
            id:ele.id,
            day_name : ele.day_name,
            status : ele.status,
          }
          schedule_arr.days.push(days_arr);
        }else{
          schedule_arr={};
          days_arr={}
          schedule_arr.schedule_id = schedule_id;
          schedule_arr.schedule_name = ele.schedule_name;
          schedule_arr.schedule_type = ele.schedule_type;
          schedule_arr.start_schedule_time = ele.start_schedule_time;
          schedule_arr.stop_schedule_time = ele.stop_schedule_time;
          schedule_arr.schedule_status = ele.schedule_status;
          schedule_arr.duration = ele.duration;
          days_arr = {
            id:ele.id,
            day_name : ele.day_name,
            status : ele.status,
          }
          schedule_arr.days = [];
          schedule_arr.days.push(days_arr);
          main_arr.schedules.push(schedule_arr);

        }

      }else{

        if(schedule_id==previous_schedule_id){
          days_arr={};
          days_arr = {
            id:ele.id,
            day_name : ele.day_name,
            status : ele.status,
          }
          schedule_arr.days.push(days_arr);

        }else{
          schedule_arr={};
          days_arr={}
          schedule_arr.schedule_id = schedule_id;
          schedule_arr.schedule_name = ele.schedule_name;
          schedule_arr.schedule_type = ele.schedule_type;
          schedule_arr.start_schedule_time = ele.start_schedule_time;
          schedule_arr.stop_schedule_time = ele.stop_schedule_time;
          schedule_arr.schedule_status = ele.schedule_status;
          schedule_arr.duration = ele.duration;
          days_arr = {
            id:ele.id,
            day_name : ele.day_name,
            status : ele.status,
          }
          schedule_arr.days = [];
          schedule_arr.days.push(days_arr);
          main_arr.schedules.push(schedule_arr);
        }
      }
      previous_schedule_id = ele.schedule_id;  
    }
    final_resp = {
      status: true,
      message:  main_arr.schedules.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count:  main_arr.schedules.length,
      data:  main_arr.schedules
    }
  } catch (err) {
    final_resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }

};

Set_Schedule_BLE.deleteScheduleBLE = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let final_resp;
  let whereClause = ` where schedule_id = ${data.schedule_id} `;

  if (data.id == 0) {
    whereClause = `${whereClause}`;
  } else {
    whereClause = `${whereClause} and id=${data.id}`;
  }
  let stmt = `update set_schedule_ble set status='D',modify_date=?,modifyby=? ${whereClause};`;

  try {
    resp = await pool.query(stmt, [datetime, data.modify_by]);
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp.affectedRows,
      data: []
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

Set_Schedule_BLE.updateScheduleBLE = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let resp2;
  let final_resp;
  let stmt = `update set_schedule_ble set charger_serial_no=?,user_id=?,schedule_id=?,start_schedule_time=?,
      stop_schedule_time=?,duration=?,schedule_type=?,schedule_name=?,day_name=?,schedule_status=?,status=?,modify_date=?,
      modifyby=? where id=?;`;

  let stmt2 = `select id,schedule_id,start_schedule_time,stop_schedule_time,status from set_schedule_ble 
  where start_schedule_time between now() and DATE_ADD(now(),interval 24 hour) and status='Y' and user_id=?
  and charger_serial_no=? order by start_schedule_time desc;`;
  try {
    resp2= await pool.query(stmt2,[data.user_id,data.charger_serial_no]);
    if(resp2.length>0){
      final_resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: `Current schedule is already exist at ${resp2[0].start_schedule_time} time`,
        count: 0,
        data: []
      }
    }
else{
    for (let i = 0; i < data.schedule.length; i++) {
      let values = [data.charger_serial_no, data.user_id,data.schedule_id, data.start_schedule_time,
      data.stop_schedule_time, data.duration, data.schedule_type, data.schedule_name,
      data.schedule[i].day_name,data.schedule_status, data.schedule[i].status, datetime, data.modify_by, data.schedule[i].id];

      resp = await pool.query(stmt, values);
    }
    final_resp = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
      count: resp.affectedRows,
      data: []
    }
  }
}
  catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: [],
      
    }
  } finally {
    result(null, final_resp);
  }
}

Set_Schedule_BLE.updateEnableDisableScheduleBLE = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp,resp1;
  let final_resp;
  let stmt = `update set_schedule_ble set status=?,modify_date=?,
      modifyby=? where id=?;`;
  try {
    for (let index = 0; index < data.schedule.length; index++) {
      let values = [data.schedule[index].status, datetime, data.modify_by, data.schedule[index].id];
      resp = await pool.query(stmt,values);
  }
  final_resp = {
    status: resp.affectedRows > 0 ? true : false,
    err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
    message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
    count: resp.affectedRows,
    data: []
  }
}
  catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: [],
      
    }
  } finally {
    result(null, final_resp);
  }
}

Set_Schedule_BLE.updateScheduleStatusBLE = async (data, result) => {
  debugger;
  var datetime = new Date();
  let resp;
  let final_resp;
  let stmt =`update  set_schedule_ble set schedule_status=?,modify_date=?,
  modifyby=? where schedule_id=?;`;
  try {
      resp = await pool.query(stmt,[data.schedule_status,datetime,data.modify_by,data.schedule_id]);

      final_resp = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR : 1',
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'NOT FOUND',
        count: resp.affectedRows,
        data: []
      }
  }
  catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: [],
      
    }
  } finally {
    result(null, final_resp);
  }
}


ChargerConfiguration.setChargerConfiguration = async(data,result)=>{
  var datetime = new Date();
  let resp1;
  let resp2;
  let resp3;
  let resp4;
  let resp5;
  let respSpin;
  let final_res;
  let dynamicQuery='';
  let values1=[];
  let valuesSpin=[];
  let fw_id=[];
  let card_id=[];
  let card_part_no_id=[];
  let charger_part_no_id;
  let last_ping_datetime;

  let stmt1 = `select id as charger_id,part_no_id as charger_part_no_id,last_ping_datetime from charger_serial_mst 
  where serial_no=? and status='Y';`;

  let stmt2 = `select id as card_id,card_part_no_id from card_serial_mst where card_serial_no = ? and status='P';`;

  let stmt3 = `select id as fw_version_id from version_mst where name=? and status='Y';`;
   
  let stmt7 = `insert into charger_current_configuration_log(charger_id,charger_part_no_id,charger_serial_no,
    charger_part_no,card_id,card_part_no_id,card_serial_no,card_part_no,current_ampere_value,user_id,fw_version_id,
    fw_version_name,board_type,source_app,project_id,status,created_date,createdby)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  try{
debugger;
  resp1 = await pool.query(stmt1,data.charger_serial_no);
  if(resp1.length<=0){
    final_res={
      status:false,
      err_code:'ERROR:1',
      message:`Charger with serial_no '${data.charger_serial_no}', doesn't exist.`,
      data:[]
    }
    res.status(200).send(final_res);
  }else{
 
  last_ping_datetime = !!resp1[0].last_ping_datetime ? resp1[0].last_ping_datetime : null;
  charger_part_no_id = !!resp1[0].charger_part_no_id ? resp1[0].charger_part_no_id : 0;
 
  resp2 = await pool.query(stmt2,data.card_serial_no);
  if(resp2.length>0){
    card_id = resp2[0].card_id;
    card_part_no_id = resp2[0].card_part_no_id;
  }else{
    card_id = 0;
    card_part_no_id =0;
  }
  resp3 = await pool.query(stmt3,data.fw_version_name);
  if(resp3.length>0){
    fw_version_id = resp3[0].fw_version_id;
  }else{
      fw_version_id = 0;
    }

  
  if(data.configuration_key=='FW'){
    if ( data.board_type=='OCPP') {
      dynamicQuery = ` current_fw_version_ocpp_board=?,current_fw_version_id_ocpp_board=? `;
    } else {
      dynamicQuery = ` current_fw_version_main_board=?,current_fw_version_id_main_board=? `;
    }
    values1=[data.fw_version_name,fw_version_id,datetime,data.modifyby ,resp1[0].charger_id];
    valuesSpin=[data.fw_version_name,fw_version_id,resp1[0].last_ping_datetime];
  }else if(data.configuration_key=='CURRENT'){
    dynamicQuery=` current_ampere_value=? `;
    values1=[data.current_ampere_value,datetime,data.modifyby ,resp1[0].charger_id];
    valuesSpin=[data.current_ampere_value,resp1[0].last_ping_datetime];
  }
  let stmt4 = `update charger_serial_mst set ${dynamicQuery},modify_date=?,modifyby=? where id=? and status='Y';`;
  resp4 = await pool.query(stmt4,values1);

  //SYNC WITH SPIN DB
  let stmtSpin = `update devices set ${dynamicQuery},last_ping_datetime = ? where client_dev_no like '%${data.charger_serial_no}' and status =1  `;
  respSpin = await poolMG.query(stmtSpin,valuesSpin);

  //insert data
  let values2= [resp1[0].charger_id,data.charger_part_no_id,data.charger_serial_no,data.charger_part_no,card_id,
  card_part_no_id,data.card_serial_no,data.card_part_no,data.current_ampere_value,data.user_id,fw_version_id,
  data.fw_version_name,data.board_type,data.source_app,data.project_id,data.status,datetime,data.created_by];

  resp5 = await pool.query(stmt7,values2);
  
  final_res={
    status:resp4.affectedRows > 0 ? true:false,
      err_code:resp4.affectedRows > 0 ? 'ERROR:0':'ERROR:1',
      message:resp4.affectedRows > 0 ? 'Success':'Failed',
      data:[resp1[0].charger_id]
  }
}
  }catch (err) {
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


ChargerConfiguration.getAllChargerConfiguration = async (result) => {

  let final_resp;
  let resp;
  debugger;
  let stmt = `SELECT id,charger_id,charger_part_no_id,charger_serial_no,
  charger_part_no,card_id,card_part_no_id,card_serial_no,card_part_no,current_ampere_value,user_id,fw_version_id,
  fw_version_name,board_type,source_app,project_id,status,created_date,createdby from 
  charger_current_configuration_log where status<>'D';`;
  try {
    resp = await pool.query(stmt);
    final_resp = {
      status: true,
      err_code: resp.length > 0 ? 'ERROR:0':'ERROR:1',
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {
    final_resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }
};

ChargerConfiguration.getChargerConfigurationByCharger_serial_no = async (result) => {

  let final_resp;
  let resp;
  debugger;
  let stmt = `SELECT id,charger_id,charger_part_no_id,charger_serial_no,
  charger_part_no,card_id,card_part_no_id,card_serial_no,card_part_no,current_ampere_value,user_id,fw_version_id,
  fw_version_name,board_type,source_app,project_id,status,created_date,createdby from 
  charger_current_configuration_log where status = 'Y' and charger_serial_no = ${charger_serial_no} ;`;
  try {
    resp = await pool.query(stmt);
    final_resp = {
      status: true,
      err_code: resp.length > 0 ? 'ERROR:0':'ERROR:1',
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {
    final_resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }
};

ChargerConfiguration.updateChargerNickName = async (body, result) => {

  let final_resp;
  let resp;
  
  let queries = '';

  body.data.forEach(function (item) {
    queries += `UPDATE charger_serial_mst SET nick_name ='${item.nick_name}'  WHERE id = ${item.id} 	;`
  });


  try {
    resp = await pool.query(queries);

    debugger;

    final_resp = {
      status: resp.length > 0 ? true:false,
      err_code: resp.length > 0 ? 'ERROR:0':'ERROR:1',
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
      data: []
    }
  } catch (err) {
    final_resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_resp);
  }
};

module.exports = {
  Charger: Charger,
  AddChargerRequest: AddChargerRequest,
  ChargingProfile: ChargingProfile,
  ChargerStationMap: ChargerStationMap,
  ClientChargerMap: ClientChargerMap,
  Set_Schedule_BLE: Set_Schedule_BLE,
  ChargerRenewalRequestBle : ChargerRenewalRequestBle,
  ChargerConfiguration : ChargerConfiguration,
  getMappedConnectors: getMappedConnectors,
  func_getChargers: func_getChargers
};