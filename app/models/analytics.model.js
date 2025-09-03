const { sql, pool, poolPG, poolMG } = require("./db.js");
const _utility = require("../utility/_utility");

// constructor
const Transaction = function (charger) {
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
    this.connector_data = charger.connector_data
};


const TransactionList = function (chargerValues) {
  this.id = chargerValues.id,
    this.charger_id = chargerValues.charger_id,
    this.station_id = chargerValues.station_id,
    this.meter_reading = chargerValues.is_available,
    this.status = chargerValues.status,
    this.created_on = chargerValues.created_on
  this.fdate = chargerValues.fdate,
    this.todate = chargerValues.todate
};
//-----------Start Analytics--------------------------------//

TransactionList.getTransactionList = async (params, result) => {
  stmt = `SELECT charger_id, count(transaction_id) as total_transaction
  FROM meter_log
  WHERE date(created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and action='StartTransaction' 
  GROUP BY (charger_id)
  ORDER BY charger_id;`
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {
      // let children = await getMappedConnectors();

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];
        //  final_resp[p].connector_data = [];

        // for (let c = 0; c < children.res.length; c++) {
        //   const child = children.res[c];

        //   if (parent.charger_id == child.charger_id) {
        //     final_resp[p].connector_data.push(child);
        //   }

        // }

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

  //----------------------------
  // 
  // sql.query(stmt, async (err, res) => {

  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   if (res.length) {
  //    // let children = await getMappedConnectors();

  //     let final_res = res;

  //     for (let p = 0; p < res.length; p++) {
  //       const parent = res[p];
  //       final_res[p].connector_data = [];

  //       // for (let c = 0; c < children.res.length; c++) {
  //       //   const child = children.res[c];

  //       //   if (parent.id == child.charger_id) {
  //       //     final_res[p].connector_data.push(child);
  //       //   }
  //       // }
  //     }

  //     result(null, final_res);
  //     return;
  //   }

  //   result({ kind: "not_found" }, null);
  // });

};

TransactionList.getTransactionListCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = `SELECT ml.charger_id,csm.serial_no, count(ml.transaction_id) as total_transaction
  FROM meter_log ml
  inner join charger_serial_mst csm on ml.charger_id=csm.name and csm.status='Y'
  WHERE date(ml.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ml.action='StartTransaction' 
  GROUP BY (ml.charger_id)
  ORDER BY ml.charger_id;`
  } else {
    stmt = `SELECT ML.charger_id,ccm.serial_no,count(ML.transaction_id) as total_transaction
    FROM meter_log ML
     inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
     inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'   
    WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
    and clcm.client_id=${client_id}
    GROUP BY (ML.charger_id)
    ORDER BY ML.charger_id;`
    //   stmt = `SELECT charger_id, count(transaction_id) as total_transaction
    // FROM meter_log
    // WHERE date(created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and action='StartTransaction' 
    // GROUP BY (charger_id)
    // ORDER BY charger_id;`
  }
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {
      // let children = await getMappedConnectors();

      // for (let p = 0; p < resp.length; p++) {
      //   const parent = resp[p];
      //   //  final_resp[p].connector_data = [];

      //   // for (let c = 0; c < children.res.length; c++) {
      //   //   const child = children.res[c];

      //   //   if (parent.charger_id == child.charger_id) {
      //   //     final_resp[p].connector_data.push(child);
      //   //   }

      //   // }

      // }
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

  //----------------------------
  // 
  // sql.query(stmt, async (err, res) => {

  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   if (res.length) {
  //    // let children = await getMappedConnectors();

  //     let final_res = res;

  //     for (let p = 0; p < res.length; p++) {
  //       const parent = res[p];
  //       final_res[p].connector_data = [];

  //       // for (let c = 0; c < children.res.length; c++) {
  //       //   const child = children.res[c];

  //       //   if (parent.id == child.charger_id) {
  //       //     final_res[p].connector_data.push(child);
  //       //   }
  //       // }
  //     }

  //     result(null, final_res);
  //     return;
  //   }

  //   result({ kind: "not_found" }, null);
  // });

};

TransactionList.getTransactionListCCS = async (params, result) => {

  let stmt = '';
  let final_res;
  let resp;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {

  //   stmt = `SELECT ml.charger_id,csm.serial_no, count(ml.transaction_id) as total_transaction
  // FROM meter_log ml
  // inner join charger_serial_mst csm on ml.charger_id=csm.name and csm.status='Y'
  // WHERE date(ml.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ml.action='StartTransaction' 
  // GROUP BY (ml.charger_id)
  // ORDER BY ml.charger_id;`
  // } else {
    // stmt = `SELECT ML.charger_id,ccm.serial_no,count(ML.transaction_id) as total_transaction
    // FROM meter_log ML
    //  inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    //  inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'   
    // WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
    // and clcm.client_id=${client_id}
    // GROUP BY (ML.charger_id)
    // ORDER BY ML.charger_id;`
   
  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

      stmt = `SELECT ML.charger_id,ccm.serial_no,count(ML.transaction_id) as total_transaction
      FROM meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'  
      WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
      and ML.client_id=${params.client_id}
      GROUP BY (ML.charger_id)
      ORDER BY total_transaction desc limit 20 ;`

    }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
  
      stmt = `SELECT ML.charger_id,ccm.serial_no,count(ML.transaction_id) as total_transaction
      FROM meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
      and ML.cpo_id = '${params.cpo_id}' 
      GROUP BY (ML.charger_id)
      ORDER BY total_transaction desc limit 20;`
  
    }else{// station_id check will be applicable in this case
  
      stmt = `SELECT ML.charger_id,ccm.serial_no,count(ML.transaction_id) as total_transaction
      FROM meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
      and ML.station_id = '${params.station_id}' 
      GROUP BY (ML.charger_id)
      ORDER BY total_transaction desc limit 20;`
    }
  
 
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

TransactionList.getVehicleTransactionCountCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = ` SELECT  ml.idtag , count(ml.transaction_id) as total_transaction
      FROM meter_log ml
      -- inner join charger_serial_mst csm on ml.charger_id=csm.name and csm.status='Y'
      WHERE date(ml.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ml.action='StartTransaction' 
      GROUP BY (ml.idtag)
      ORDER BY ml.idtag;`
  } else {
    stmt =  ` SELECT  ml.idtag , count(ml.transaction_id) as total_transaction
      FROM meter_log ml
      -- inner join charger_serial_mst csm on ml.charger_id=csm.name and csm.status='Y'
      WHERE date(ml.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ml.action='StartTransaction' 
      and clcm.client_id=${client_id}
      GROUP BY (ml.idtag)
      ORDER BY ml.idtag;`
  }
  let final_res;
  let resp;
  //--------------------------------
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

TransactionList.getDurationList = async (params, result) => {
  stmt = `select ml.charger_id,sum(ml.meter_reading)/1000 AS total_energy_consumed
  from meter_log ml,charger_station_mapping csm where date(ml.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
   and action='StartTransaction'  
   GROUP BY (ml.charger_id)
  ORDER BY ml.charger_id;`
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];

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

TransactionList.getDurationListCW = async (login_id, params, result) => {

  //To get total energy consumed
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed
  from meter_log ml
  inner join charger_serial_mst csm on ml.charger_id=csm.name
   where date(ml.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
   and action='StartTransaction'  
   GROUP BY (ml.charger_id)
  ORDER BY ml.charger_id;`
  } else {
    stmt = `select ML.charger_id,ccm.serial_no,sum(ML.meter_reading)/1000 AS total_energy_consumed
    from meter_log ML
     inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
     inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'
    where date(ML.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
     and action='StartTransaction'   and clcm.client_id=${client_id}
     GROUP BY (ML.charger_id)
    ORDER BY ML.charger_id;
  `
    //   stmt = `select ml.charger_id,sum(ml.meter_reading)/1000 AS total_energy_consumed
    // from meter_log ml,charger_station_mapping csm where date(ml.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
    //  and action='StartTransaction'  
    //  GROUP BY (ml.charger_id)
    // ORDER BY ml.charger_id;`
  }
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];

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

TransactionList.getDurationListCCS = async ( params, result) => {

  //To get total energy consumed
  let stmt = '';
  let final_res;
  let resp;

  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed
  // from meter_log ml
  // inner join charger_serial_mst csm on ml.charger_id=csm.name
  //  where date(ml.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
  //  and action='StartTransaction'  
  //  GROUP BY (ml.charger_id)
  // ORDER BY ml.charger_id;`
  // } else {
  //   stmt = `select ML.charger_id,ccm.serial_no,sum(ML.meter_reading)/1000 AS total_energy_consumed
  //   from meter_log ML
  //    inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
  //    inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'
  //   where date(ML.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
  //    and action='StartTransaction'   and clcm.client_id=${client_id}
  //    GROUP BY (ML.charger_id)
  //   ORDER BY ML.charger_id; `;
    
  // }
 
  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt =  ` select ML.charger_id,ccm.serial_no, sum(ML.meter_reading)/1000 AS total_energy_consumed
      from meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      where date(ML.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
      and action='StartTransaction' and ML.client_id=${params.client_id} and ML.meter_reading>-1
      GROUP BY (ML.charger_id)
      ORDER BY total_energy_consumed desc limit 20;`;

    }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
  
      stmt =  ` select ML.charger_id,ccm.serial_no, sum(ML.meter_reading)/1000 AS total_energy_consumed
      from meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      where date(ML.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
      and action='StartTransaction' and ML.cpo_id=${params.cpo_id} and ML.meter_reading>-1
      GROUP BY (ML.charger_id)
      ORDER BY total_energy_consumed desc limit 20;`;
  
    }else{// station_id check will be applicable in this case
  
      stmt =  ` select ML.charger_id,ccm.serial_no, sum(ML.meter_reading)/1000 AS total_energy_consumed
      from meter_log ML
      inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      where date(ML.created_on) BETWEEN '${params.fdate}' and '${params.todate}'
      and action='StartTransaction' and ML.station_id=${params.station_id} and ML.meter_reading>-1
      GROUP BY (ML.charger_id)
      ORDER BY total_energy_consumed desc limit 20;`;
    }

  //--------------------------------
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

TransactionList.getChargerWiseAlarmCountCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select ml.charger_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,count(*) as count
    from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
    AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
    and ml.action='StatusNotification'   
    group by ml.info,ml.charger_id,ml.charger_srno
    ORDER BY ml.charger_id;`
  } else {
    stmt = `select ml.charger_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,count(*) as count
    from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
    AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
    and ml.action='StatusNotification' and ml.client_id='${client_id}'  
    group by ml.info,ml.charger_id,ml.charger_srno
    ORDER BY ml.charger_id;`
  }
  let final_res;
  let resp;
  let temp_arr = [];
  let temp_sub_arr = [];

  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    if (resp.rows.length > 0) {

      for (let i = 0; i < resp.rows.length; i++) {
        const ele = resp.rows[i];

        if (i == 0) {
          temp_arr.push({
            charger_display_id: ele.charger_id
          });
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].charger_display_id == ele.charger_id) {
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].charger_display_id != ele.charger_id) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
          temp_sub_arr = [];

          temp_arr.push({
            charger_display_id: ele.charger_id
          });

          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // });

        }
        temp_sub_arr.push({
          alarm_name: ele.alarm_name,
          charger_serial_no: ele.charger_serial_no,
          count: ele.count
        });

        if (i == resp.rows.length - 1) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
        }
      }

      final_res = {
        status: temp_arr.length > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: temp_arr.length > 0 ? 'SUCCESS' : 'FAILED',
        count: temp_arr.length,
        data: temp_arr
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }


};

TransactionList.getTotalAlarmCountCW = async (login_id, params, result) => {
//;
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select ml.info as alarm_name, count(*) as count
    from chargerrequest_log ml where date(ml.request_date) 
    BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
    and ml.action='StatusNotification' 
      group by ml.info
    ORDER BY count;`
  } else {
    stmt = `select ml.info as alarm_name, count(*) as count
      from chargerrequest_log ml where date(ml.request_date) 
      BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
      and ml.action='StatusNotification' and ml.client_id='${client_id}' 
        group by ml.info
      ORDER BY count;`
  }
  let final_res;
  let resp;
  let temp_arr = [];
  let temp_sub_arr = [];

  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    if (resp.rows.length > 0) {

      for (let i = 0; i < resp.rows.length; i++) {
        const ele = resp.rows[i];

        if (i == 0) {
          temp_arr.push({
            alarm_name: ele.alarm_name
          });
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].alarm_name == ele.alarm_name) {
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].alarm_name != ele.alarm_name) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
          temp_sub_arr = [];

          temp_arr.push({
            alarm_name: ele.alarm_name
          });

          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // });

        }
        temp_sub_arr.push({
          alarm_name: ele.alarm_name,
         // charger_serial_no: ele.charger_serial_no,
          count: ele.count
        });

        if (i == resp.rows.length - 1) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
        }
      }

      final_res = {
        status: temp_arr.length > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: temp_arr.length > 0 ? 'SUCCESS' : 'FAILED',
        count: temp_arr.length,
        data: temp_arr
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }


};

TransactionList.getTotalAlarmCountCCS = async ( params, result) => {
//;
  let stmt = '';
  let final_res;
  let resp;
  let temp_arr = [];
  let temp_sub_arr = [];
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `select ml.info as alarm_name, count(*) as count
  //   from chargerrequest_log ml where date(ml.request_date) 
  //   BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
  //   and ml.action='StatusNotification' 
  //     group by ml.info
  //   ORDER BY count;`
  // } else {
  //   stmt = `select ml.info as alarm_name, count(*) as count
  //     from chargerrequest_log ml where date(ml.request_date) 
  //     BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
  //     and ml.action='StatusNotification' and ml.client_id='${client_id}' 
  //     group by ml.info
  //     ORDER BY count;`
  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = `select ml.info as alarm_name, count(*) as count
      from chargerrequest_log ml where date(ml.request_date) 
      BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
      and ml.action='StatusNotification' and ml.client_id='${params.client_id}' 
      group by ml.info
      ORDER BY count;`;

    }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
  
      stmt = `select ml.info as alarm_name, count(*) as count
      from chargerrequest_log ml where date(ml.request_date) 
      BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
      and ml.action='StatusNotification' and ml.client_id='${params.client_id}'  and ml.cpo_id='${params.cpo_id}'
      group by ml.info
      ORDER BY count;`;
  
    }else{// station_id check will be applicable in this case
  
      stmt = `select ml.info as alarm_name, count(*) as count
      from chargerrequest_log ml where date(ml.request_date) 
      BETWEEN '${params.fdate}'::timestamptz AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
      and ml.action='StatusNotification' and ml.client_id='${params.client_id}' and ml.station_id='${params.station_id}' 
      group by ml.info
      ORDER BY count;`;
    }
  

  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    if (resp.rows.length > 0) {

      for (let i = 0; i < resp.rows.length; i++) {
        const ele = resp.rows[i];

        if (i == 0) {
          temp_arr.push({
            alarm_name: ele.alarm_name
          });
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].alarm_name == ele.alarm_name) {
          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // }) ;
        } else if (temp_arr[temp_arr.length - 1].alarm_name != ele.alarm_name) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
          temp_sub_arr = [];

          temp_arr.push({
            alarm_name: ele.alarm_name
          });

          // temp_sub_arr.push({
          //   alarm_name : ele.alarm_name,
          //   count : ele.count
          // });

        }
        temp_sub_arr.push({
          alarm_name: ele.alarm_name,
         // charger_serial_no: ele.charger_serial_no,
          count: ele.count
        });

        if (i == resp.rows.length - 1) {
          temp_arr[temp_arr.length - 1].alarms = temp_sub_arr;
        }
      }

      final_res = {
        status: temp_arr.length > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: temp_arr.length > 0 ? 'SUCCESS' : 'FAILED',
        count: temp_arr.length,
        data: temp_arr
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }


};

//Get total chargers distribution , total online, total offline count of chargers
TransactionList.getChargerStatusCW = async (login_id, result) => {

  let stmt = '';
  let stmt2 = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let resp_modified = [];
  let resp;
  let resp2;
//;
  if (isSA) {
    stmt = ` select count(*) as count,CASE
      WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+10)) THEN "ONLINE"
      ELSE "OFFLINE"
      END as charger_status  
      from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y'
      group by charger_status
      union 
      select count(*)  as total_chargers, 'TOTAL' charger_status
      from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y';`;

    stmt2 = `    select count(*),ccm.charger_id 
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
    where ccm.status='Y' and ccm.current_status='Charging' 
    and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
    group by ccm.charger_id;`;

  } else {
    stmt = ` select count(*) as count,CASE
    WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+30)) THEN "ONLINE"
    ELSE "OFFLINE"
    END as charger_status  
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
	inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
	where csm.status='Y'
    group by charger_status
    union 
    select count(*)  as total_chargers, 'TOTAL' charger_status
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
	inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
	where csm.status='Y' ;`

  stmt2 = `    select count(*),ccm.charger_id 
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    where ccm.status='Y' and ccm.current_status='Charging' 
    and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
    group by ccm.charger_id;`;

  }
  
  //--------------------------------
  try {

    resp = await pool.query(stmt);
    resp2 = await pool.query(stmt2);
    final_resp = resp;
    
    if (resp.length > 0) {

      let is_true = resp.filter(x => x.charger_status == 'OFFLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count: 0
        })
      }

      is_true = resp.filter(x => x.charger_status == 'ONLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'ONLINE',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'ONLINE',
          count: 0
        })
      }


      is_true = resp.filter(x => x.charger_status == 'TOTAL');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'TOTAL',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'TOTAL',
          count: 0
        })
      }


      if (resp2.length>0) {
      
        resp_modified.push({
          charger_status: 'CHARGING',
          count: resp2.length
        })
        
      } else {
        resp_modified.push({
          charger_status: 'CHARGING',
          count: 0
        })
      }


    }

    resp = {
      status: true,
      message: resp_modified.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp_modified.length,
      data: resp_modified
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

//Get total chargers distribution , total , online, offline , charging count of chargers
// on basis of CCS-client,cpo,station
TransactionList.getChargerStatusCCS = async (params, result) => {

  let stmt = '';
  let stmt2 = '';
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let resp_modified = [];
  let resp;
  let resp2;
//;
  // if (isSA) {
  //   stmt = ` select count(*) as count,CASE
  //     WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+10)) THEN "ONLINE"
  //     ELSE "OFFLINE"
  //     END as charger_status  
  //     from charger_serial_mst csm 
  //     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
  //     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y'
  //     group by charger_status
  //     union 
  //     select count(*)  as total_chargers, 'TOTAL' charger_status
  //     from charger_serial_mst csm 
  //     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
  //     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y';`;

  //   stmt2 = `    select count(*),ccm.charger_id 
  //   from charger_connector_mapping ccm 
  //   inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
  //   where ccm.status='Y' and ccm.current_status='Charging' 
  //   and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
  //   group by ccm.charger_id;`;

  // } else {

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

  stmt = ` select count(*) as count,CASE
    WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+30)) THEN "ONLINE"
    ELSE "OFFLINE"
    END as charger_status  
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' and ccm.client_id=${params.client_id}
    group by charger_status
    union 
    select count(*)  as total_chargers, 'TOTAL' charger_status
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' and ccm.client_id=${params.client_id} ;`

  stmt2 = `select count(*),ccm.charger_id 
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
    where ccm.status='Y' and ccm.current_status='Charging' and clcm.client_id=${params.client_id}
    and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
    group by ccm.charger_id ; `;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = ` select count(*) as count,CASE
    WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+30)) THEN "ONLINE"
    ELSE "OFFLINE"
    END as charger_status  
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
    inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status = 'Y'
    where csm.status='Y' and ccm.client_id=${params.client_id}  and cstm.cpo_id = ${params.cpo_id}
    group by charger_status
    union 
    select count(*)  as total_chargers, 'TOTAL' charger_status
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
    inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status = 'Y'
    where csm.status='Y' and ccm.client_id=${params.client_id}  and cstm.cpo_id = ${params.cpo_id} ;`

  stmt2 = ` select count(*),ccm.charger_id 
  from charger_connector_mapping ccm 
  inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
  inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
  inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status = 'Y'
  where ccm.status='Y' and ccm.current_status='Charging' and clcm.client_id=${params.client_id} 
  and cstm.cpo_id = ${params.cpo_id}
  and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
  group by ccm.charger_id  ; `;

  }else{// station_id check will be applicable in this case

    stmt = ` select count(*) as count,CASE
    WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= (heartbeat_interval+30)) THEN "ONLINE"
    ELSE "OFFLINE"
    END as charger_status  
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
    where csm.status='Y' and ccm.client_id=${params.client_id}  and chsm.station_id = ${params.station_id}
    group by charger_status
    union 
    select count(*)  as total_chargers, 'TOTAL' charger_status
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y'
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
    where csm.status='Y' and ccm.client_id=${params.client_id}  and chsm.station_id = ${params.station_id} ;`

    stmt2 = ` select count(*),ccm.charger_id 
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id and chsm.status='Y'
  
    where ccm.status='Y' and ccm.current_status='Charging' and clcm.client_id=${params.client_id} 
    and chsm.station_id = ${params.station_id}
    and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
    group by ccm.charger_id  ; `;
  }

  try {
//;
    resp = await pool.query(stmt);
    resp2 = await pool.query(stmt2);
    final_resp = resp;
    
    if (resp.length > 0) {

      let is_true = resp.filter(x => x.charger_status == 'OFFLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count: 0
        })
      }

      is_true = resp.filter(x => x.charger_status == 'ONLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'ONLINE',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'ONLINE',
          count: 0
        })
      }


      is_true = resp.filter(x => x.charger_status == 'TOTAL');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'TOTAL',
          count: is_true[0].count
        })
      } else {
        resp_modified.push({
          charger_status: 'TOTAL',
          count: 0
        })
      }


      if (resp2.length>0) {
      
        resp_modified.push({
          charger_status: 'CHARGING',
          count: resp2.length
        })
        
      } else {
        resp_modified.push({
          charger_status: 'CHARGING',
          count: 0
        })
      }


    }

    resp = {
      status: true,
      message: resp_modified.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp_modified.length,
      data: resp_modified
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

// //Get total chargers distribution , total online, total offline count of chargers
// TransactionList.getChargerStatusV1 = async (params, result) => {

//   let stmt = '';
//   let client_id = params.client_id;
//   let cpo_id = params.cpo_id;
//   let station_id = params.station_id;

//   // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
//   // let client_id = clientAndRoleDetails.data[0].client_id;
//   // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  
//   let resp_modified = [];

//   if(cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

//   }else if(station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

//   }else{// station_id check will be applicable in this case

//   }

//   if (isSA) {
//     stmt = ` select count(*) as count,CASE
//       WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= heartbeat_interval) THEN "ONLINE"
//       ELSE "OFFLINE"
//       END as charger_status  
//       from charger_serial_mst csm 
//       inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
//       inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
//     inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
//     where csm.status='Y'
//       group by charger_status
//       union 
//       select count(*)  as total_chargers, 'TOTAL' charger_status
//       from charger_serial_mst csm 
//       inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
//       inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
//     inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
//     where csm.status='Y';`
//   } else {
//     stmt = ` select count(*) as count,CASE
//     WHEN (TIMESTAMPDIFF(SECOND,last_ping_datetime,now()) <= heartbeat_interval) THEN "ONLINE"
//     ELSE "OFFLINE"
//     END as charger_status  
//     from charger_serial_mst csm 
//     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
//     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
// 	inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
// 	where csm.status='Y'
//     group by charger_status
//     union 
//     select count(*)  as total_chargers, 'TOTAL' charger_status
//     from charger_serial_mst csm 
//     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
//     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
// 	inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
// 	where csm.status='Y' ;`

//   }
//   let resp;
//   //--------------------------------
//   try {

//     resp = await pool.query(stmt);
//     final_resp = resp;
//     if (resp.length > 0) {

//       let is_true = resp.filter(x => x.charger_status == 'OFFLINE');

//       if (is_true.length > 0) {
//         resp_modified.push({
//           charger_status: 'OFFLINE',
//           count: is_true[0].count
//         })
//       } else {
//         resp_modified.push({
//           charger_status: 'OFFLINE',
//           count: 0
//         })
//       }

//       is_true = resp.filter(x => x.charger_status == 'ONLINE');

//       if (is_true.length > 0) {
//         resp_modified.push({
//           charger_status: 'ONLINE',
//           count: is_true[0].count
//         })
//       } else {
//         resp_modified.push({
//           charger_status: 'ONLINE',
//           count: 0
//         })
//       }


//       is_true = resp.filter(x => x.charger_status == 'TOTAL');

//       if (is_true.length > 0) {
//         resp_modified.push({
//           charger_status: 'TOTAL',
//           count: is_true[0].count
//         })
//       } else {
//         resp_modified.push({
//           charger_status: 'TOTAL',
//           count: 0
//         })
//       }
//     }

//     resp = {
//       status: true,
//       message: resp_modified.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
//       count: resp_modified.length,
//       data: resp_modified
//     }
//   } catch (err) {
//     resp = {
//       status: false,
//       message: "ERROR",
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, resp);
//   }


// };


TransactionList.getChargerConnectorStatusCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = ` select connector_status,count(*) from (
      select charger_id, connector_no, current_status ,case 
      when (lastping > 0 and lastping < heartbeat_interval+10 and current_status != 'Charging') THEN "AVAILABLE" 
      when (lastping > 0 and lastping < heartbeat_interval+10 and  current_status = 'Charging') THEN "CHARGING"
      else 'OFFLINE' 
      end 'connector_status'
      from (
      select charger_id,connector_no,current_status,IFNULL(ccm.heartbeat_interval,0) heartbeat_interval,
      IFNULL(TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()),0) lastping
      from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status='Y'
      where ccm.status='Y'
       )aa)bb
      group by connector_status
      union
      select 'TOTAL CHARGERS'  connector_status,count(*)
      from charger_serial_mst csm 
      where status = 'Y';`
  } else {
    stmt = `select connector_status,count(*) from (
      select charger_id, connector_no, current_status ,case 
      when (lastping > 0 and lastping < heartbeat_interval+10 and current_status != 'Charging') THEN "AVAILABLE" 
      when (lastping > 0 and lastping < heartbeat_interval+10 and  current_status = 'Charging') THEN "CHARGING"
      else 'OFFLINE' 
      end 'connector_status'
      from (
      select charger_id,connector_no,current_status,IFNULL(ccm.heartbeat_interval,0) heartbeat_interval,
      IFNULL(TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()),0) lastping
      from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status='Y'
      where ccm.status='Y'
       )aa)bb
      group by connector_status
      union
      select 'TOTAL CHARGERS'  connector_status,count(*)
      from charger_serial_mst csm 
      where status = 'Y';`

  }
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    final_resp = resp;
    if (resp.length > 0) {

      for (let p = 0; p < resp.length; p++) {
        const parent = resp[p];

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

//Return connector status  details view
TransactionList.getActiveConnectorStatusCW = async (login_id, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let countCharging ;

  if (isSA) {
    stmt = ` select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
    ccm.connector_type_id ,cstm.station_id as station_id,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as current_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
    inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
	  inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
    where ccm.status='Y'  
    order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no `
    // stmt = `  select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id, ccm.connector_no,
    // ccm.connector_type_id ,ctm.name as connector_type_name, 
    // case when ccm.current_status is null then 'Unavailable' else ccm.current_status end as current_status,
    // ccm.current_status_date
    // from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    // inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
    // inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
    // where ccm.status='Y'  order by csm.name,ccm.connector_no, ccm.current_status_date desc ;`
  } else {
    stmt = `select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
    ccm.connector_type_id ,cstm.station_id as station_id,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as current_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
	  inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
    where ccm.status='Y'  
    order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no; `
    // stmt = ` select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id, ccm.connector_no,
    // ccm.connector_type_id ,ctm.name as connector_type_name, 
    // case when ccm.current_status is null then 'Unavailable' else ccm.current_status end as current_status,
    // ccm.current_status_date
    // from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    // inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
    // inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    // where ccm.status='Y'  order by csm.name,ccm.connector_no, ccm.current_status_date desc ;`

  }
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);
    //final_resp = resp;
//
countCharging = resp.filter(x => x.current_status == 'Charging');

    final_res = {
      detail : resp,
      countCharging : countCharging.length
    }

    resp = {
      status: true,
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
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
    result(null, resp);
  }


};

//Return connector status  details view
TransactionList.getActiveConnectorStatusCCS = async (params, result) => {

  let stmt = '';
  let final_res;
  let resp;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let countCharging ;

  // if (isSA) {
  //   stmt = ` select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
  //   ccm.connector_type_id ,cstm.station_id as station_id,
  //   case 
	// 	when ( ccm.last_ping_datetime is null )
	// 		then 'Offline'
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
	// 		then ccm.current_status
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
	// 		then 'Charger online but connector not responding'
  //     else  'Not Responding'
	//   end	as current_status	
  //   from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
  //   inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
	//   inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
  //   where ccm.status='Y'  
  //   order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no `
    
  // } else {

    if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
      stmt = `select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
      ccm.connector_type_id ,cstm.station_id as station_id,
      case 
      when ( ccm.last_ping_datetime is null )
        then 'Offline'
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
        then ccm.current_status
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
        then 'Charger online but connector not responding'
        else  'Not Responding'
      end	as current_status	
      from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
      inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${params.client_id}
      inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
      inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
      where ccm.status='Y'  
      order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no; `
    
    }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
      
      stmt = `select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
      ccm.connector_type_id ,cstm.station_id as station_id,
      case 
      when ( ccm.last_ping_datetime is null )
        then 'Offline'
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
        then ccm.current_status
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
        then 'Charger online but connector not responding'
        else  'Not Responding'
      end	as current_status	
      from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
      inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
      inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
      inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
        inner join charging_station_mst chsm on cstm.station_id = chsm.id and chsm.status = 'Y'
      where ccm.status='Y'  and clcm.client_id=${params.client_id} and chsm.cpo_id=${params.cpo_id}
      order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no;  ` 
    
    }else{
      
      stmt = `select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id,csm.nick_name as charger_nick_name, ccm.connector_no,ctm.name as connector_type_name,
      ccm.connector_type_id ,cstm.station_id as station_id,
      case 
      when ( ccm.last_ping_datetime is null )
        then 'Offline'
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
        then ccm.current_status
      when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
        then 'Charger online but connector not responding'
        else  'Not Responding'
      end	as current_status	
      from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
      inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
      inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
      inner join charger_station_mapping cstm on csm.id=cstm.charger_id  and cstm.status='Y'
      where ccm.status='Y'  and clcm.client_id=${params.client_id} and cstm.station_id=${params.station_id}
      order by ccm.last_ping_datetime desc,csm.name,ccm.connector_no;  `
    }  

  // }
  //;
 
  try {
    resp = await pool.query(stmt);
    countCharging = resp.filter(x => x.current_status == 'Charging');

    final_res = {
      detail : resp,
      countCharging : countCharging.length
    }

    resp = {
      status: true,
      message: resp.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: resp.length,
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
    result(null, resp);
  }


};

//Return connector status count summary
TransactionList.getAllConnectorLiveStatusCountCW = async (login_id, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let resp_modified = [];

  if (isSA) {
    stmt = `select count(*) as count,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
    where ccm.status='Y'  group by live_status
    union
    select count(*) as count, 'Total' as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
    where ccm.status='Y'  group by live_status
    ;`
    // stmt = `  select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id, ccm.connector_no,
    // ccm.connector_type_id ,ctm.name as connector_type_name, 
    // case when ccm.current_status is null then 'Unavailable' else ccm.current_status end as current_status,
    // ccm.current_status_date
    // from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    // inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
    // inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
    // where ccm.status='Y'  order by csm.name,ccm.connector_no, ccm.current_status_date desc ;`
  } else {
    stmt = `select count(*) as count,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    where ccm.status='Y'  group by live_status
    union
    select count(*) as count, 'Total' as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    where ccm.status='Y'  group by live_status
    ;`
    // stmt = ` select ccm.id as map_id, ccm.charger_id , csm.serial_no , csm.name as charger_display_id, ccm.connector_no,
    // ccm.connector_type_id ,ctm.name as connector_type_name, 
    // case when ccm.current_status is null then 'Unavailable' else ccm.current_status end as current_status,
    // ccm.current_status_date
    // from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    // inner join connector_type_mst ctm on ccm.connector_type_id = ctm.id and ctm.status = 'Y'
    // inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    // where ccm.status='Y'  order by csm.name,ccm.connector_no, ccm.current_status_date desc ;`

  }
  let final_res;
  let resp;
  //--------------------------------
  try {
    resp = await pool.query(stmt);

    if (resp.length > 0) {

      let is_true = resp.filter(x => x.live_status == 'Offline');

      if (is_true.length <= 0) {
        resp.push({
          live_status: 'Offline',
          count: 0
        })
      }

      is_true = resp.filter(x => x.live_status == 'Charging');

      if (is_true.length <= 0) {
        resp.push({
          live_status: 'Charging',
          count: 0
        })
      }

      is_true = resp.findIndex(item => item.live_status === 'Total');

      if (is_true != resp.length - 1) {

        resp.push(resp.splice(is_true, 1)[0]);
      }
    }
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

TransactionList.getAllConnectorLiveStatusCountCCS = async (params, result) => {

  let stmt = '';
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
  let resp_modified = [];
  let final_res;
  let resp;

  // if (isSA) {
  //   stmt = `select count(*) as count,
  //   case 
	// 	when ( ccm.last_ping_datetime is null )
	// 		then 'Offline'
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
	// 		then ccm.current_status
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
	// 		then 'Charger online but connector not responding'
  //     else  'Not Responding'
	//   end	as live_status	
  //   from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
  //   where ccm.status='Y'  group by live_status
  //   union
  //   select count(*) as count, 'Total' as live_status	
  //   from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'
  //   where ccm.status='Y'  group by live_status ;` ;
    
  // } else {
  //   stmt = `select count(*) as count,
  //   case 
	// 	when ( ccm.last_ping_datetime is null )
	// 		then 'Offline'
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is not null  )
	// 		then ccm.current_status
	// 	when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ccm.heartbeat_interval) && current_status is null  )
	// 		then 'Charger online but connector not responding'
  //     else  'Not Responding'
	//   end	as live_status	
  //   from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
  //   where ccm.status='Y'  group by live_status
  //   union
  //   select count(*) as count, 'Total' as live_status	
  //   from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
  //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
  //   where ccm.status='Y'  group by live_status ;` ;
   

  // }


  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `select count(*) as count,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${params.client_id}
    where ccm.status='Y'  group by live_status
    union
    select count(*) as count, 'Total' as live_status	
    from charger_connector_mapping ccm inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${params.client_id}
    where ccm.status='Y'  group by live_status ;` ;
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    
    stmt = `select count(*) as count,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as live_status	
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  
    inner join charging_station_mst cstm on chstm.station_id = cstm.id and cstm.status='Y' and cstm.cpo_id = ${params.cpo_id}
    where ccm.status='Y'  group by live_status
    union
    select count(*) as count, 'Total' as live_status	
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  
    inner join charging_station_mst cstm on chstm.station_id = cstm.id and cstm.status='Y' and cstm.cpo_id = ${params.cpo_id}
    where ccm.status='Y'  group by live_status ;` ;
  
  }else{
    
    stmt = ` select count(*) as count,
    case 
		when ( ccm.last_ping_datetime is null )
			then 'Offline'
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is not null  )
			then ccm.current_status
		when ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= (ccm.heartbeat_interval+30)) && current_status is null  )
			then 'Charger online but connector not responding'
      else  'Not Responding'
	  end	as live_status	
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  and chstm.station_id=${params.station_id}
    where ccm.status='Y'  group by live_status
    union
    select count(*) as count, 'Total' as live_status	
    from charger_connector_mapping ccm 
    inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'   and chstm.station_id=${params.station_id}
    where ccm.status='Y'  group by live_status ;` ;
  }  
  
  //--------------------------------
  try {
    resp = await pool.query(stmt);

    if (resp.length > 0) {

      let is_true = resp.filter(x => x.live_status == 'Offline');

      if (is_true.length <= 0) {
        resp.push({
          live_status: 'Offline',
          count: 0
        })
      }

      is_true = resp.filter(x => x.live_status == 'Charging');

      if (is_true.length <= 0) {
        resp.push({
          live_status: 'Charging',
          count: 0
        })
      }

      is_true = resp.findIndex(item => item.live_status === 'Total');

      if (is_true != resp.length - 1) {

        resp.push(resp.splice(is_true, 1)[0]);
      }
    }
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

//Return all charger model wise count in summary
TransactionList.getChargerModelSummaryCountCW = async (login_id, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select count(*) as count, ctm.name as charger_model_name 
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y'
    group by charger_model_name 
    union
    select count(*) as count, 'Total' as charger_model_name 
    from charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' order by charger_model_name;`
  } else {
    stmt = `select count(*) as count, ctm.name as charger_model_name 
    from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y'
    group by charger_model_name 
      union
      select count(*) as count, 'Total' as charger_model_name 
    from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' order by charger_model_name;`

  }
  let final_res;
  let resp;
  //--------------------------------
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

TransactionList.getChargerModelSummaryCountCCS = async (params, result) => {

  let stmt = '';
  let final_res;
  let resp;

  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `select count(*) as count, ctm.name as charger_model_name 
  //   from charger_serial_mst csm 
  //   inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
  //   inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y'
  //   group by charger_model_name 
  //   union
  //   select count(*) as count, 'Total' as charger_model_name 
  //   from charger_serial_mst csm 
  //   inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' 
  //   inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y' order by charger_model_name;`
  // } else {
  //   stmt = `select count(*) as count, ctm.name as charger_model_name 
  //   from charger_serial_mst csm 
  //     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
  //     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y'
  //   group by charger_model_name 
  //     union
  //     select count(*) as count, 'Total' as charger_model_name 
  //   from charger_serial_mst csm 
  //     inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
  //     inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
  //   inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
  //   where csm.status='Y' order by charger_model_name;`

  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = `select count(*) as count, ctm.name as charger_model_name 
      from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${params.client_id}
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
      inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
      where csm.status='Y'
      group by charger_model_name 
      union
      select count(*) as count, 'Total' as charger_model_name 
      from charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id= ccm.charger_id and ccm.status='Y' and ccm.client_id=${params.client_id}
      inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
      inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
      where csm.status='Y' order by charger_model_name;`;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = `  
    select count(*) as count, ctm.name as charger_model_name 
    from charger_serial_mst csm 
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  
    inner join charging_station_mst cstm on chstm.station_id = cstm.id and cstm.status='Y' and cstm.cpo_id = ${params.cpo_id} 
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' 
    group by charger_model_name 
    union
    select count(*) as count, 'Total' as charger_model_name 
    from charger_serial_mst csm 
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  
    inner join charging_station_mst cstm on chstm.station_id = cstm.id and cstm.status='Y' and cstm.cpo_id = ${params.cpo_id}
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' 
    order by charger_model_name;`;

  }else{

    stmt = ` select count(*) as count, ctm.name as charger_model_name 
    from charger_serial_mst csm 
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  and chstm.station_id = ${params.station_id} 
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' 
    group by charger_model_name 
    union
    select count(*) as count, 'Total' as charger_model_name 
    from charger_serial_mst csm 
    inner join charger_station_mapping chstm on csm.id=chstm.charger_id and chstm.status='Y'  and chstm.station_id = ${params.station_id}  
    inner join charging_model_mst cmm on csm.model_id = cmm.id and cmm.status='Y' 
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y' and ctm.charger_category_id = 2
    where csm.status='Y' 
    order by charger_model_name;`;

  }
  
  //--------------------------------
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


TransactionList.getDailyBasisTotalActiveChargerCountCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
    from chargerrequest_log
    where action='Heartbeat' 
    and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
    group by  server_date
    order by server_date asc;`
  } else {
    stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
    from chargerrequest_log
    where action='Heartbeat' and client_id = '${client_id}'
    and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
    group by  server_date
    order by server_date asc;`

  }
  let final_res;
  let resp;
  //--------------------------------
  try {

    resp = await poolPG.query(stmt);

    if (resp.rows.length > 0) {

      final_res = {
        status: resp.rows.length > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.rows.length > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.rows.length,
        data: resp.rows
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getDailyBasisTotalActiveChargerCountCCS = async (params, result) => {
  let final_res;
  let resp;
  let stmt = '';
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
  //   from chargerrequest_log
  //   where action='Heartbeat' 
  //   and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
  //   group by  server_date
  //   order by server_date asc;`
  // } else {
  //   stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
  //   from chargerrequest_log
  //   where action='Heartbeat' and client_id = '${client_id}'
  //   and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
  //   group by  server_date
  //   order by server_date asc;`

  // }


  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
      from chargerrequest_log
      where action='Heartbeat' and client_id = '${params.client_id}'  
      and request_date::timestamp::date between '${params.fdate}' and '${params.todate}'
      group by  server_date
      order by server_date asc;`;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
      from chargerrequest_log
      where action='Heartbeat' and client_id = '${params.client_id}' and cpo_id = '${params.cpo_id}'
      and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
      group by  server_date
      order by server_date asc;`;

  }else{

    stmt = ` select  to_char("request_date", 'DD/MM/YYYY') as server_date , count( distinct charger_id)
      from chargerrequest_log
      where action='Heartbeat' and client_id = '${params.client_id}' and station_id = '${params.station_id}'
      and request_date::timestamp::date between '${params.fdate}' and  '${params.todate}'
      group by  server_date
      order by server_date asc;`;

  }
  
  //--------------------------------
  try {

    resp = await poolPG.query(stmt);

    if (resp.rows.length > 0) {

      final_res = {
        status: resp.rows.length > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.rows.length > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.rows.length,
        data: resp.rows
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByStateCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let whereClause = '';

  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      result(response);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      result(response);
      return;
    }
  }

  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
    }
  }


  if (isSA) {
    stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
      FROM charger_serial_mst csm 
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`
  } else {
    stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
      FROM charger_serial_mst csm inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`
  }
  let final_res;
  let resp;
  //--------------------------------
  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByStateCCS = async ( params, result) => {

  let stmt = '';
  let final_res;
  let resp;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // let from_date = params.f_date == null ? "" : params.f_date.trim();
  // let to_date = params.t_date == null ? "" : params.t_date.trim();
  // let whereClause = '';

  // if (from_date !== "") {
  //   if (!_utility.validateDate(from_date)) {
  //     result(response);
  //     return;
  //   }
  // }
  // if (to_date !== "") {
  //   if (!_utility.validateDate(to_date)) {
  //     result(response);
  //     return;
  //   }
  // }

  // if (from_date !== "" && to_date !== "") {
  //   if (whereClause == "") {
  //     whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
  //   } else {
  //     whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
  //   }
  // } else if (from_date != "") {
  //   if (whereClause == "") {
  //     whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
  //   } else {
  //     whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
  //   }
  // }


  // if (isSA) {
  //   stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
  //     FROM charger_serial_mst csm 
  //     inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
  //     inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
  //     inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
  //     where csm.status='Y'
  //     group by  cstm.state_id order by charger_count desc;`
  // } else {
  //   stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
  //     FROM charger_serial_mst csm inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
  //     inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
  //     inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
  //     inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
  //     where csm.status='Y'
  //     group by  cstm.state_id order by charger_count desc;`
  // }


  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = ` SELECT count(*) as charger_count , cstm.state_id ,sm.name
      FROM charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
    FROM charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
    inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
    inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
    where csm.status='Y' and cstm.cpo_id = ${params.cpo_id}
    group by  cstm.state_id order by charger_count desc;`;

  }else{

    stmt = ` SELECT count(*) as charger_count , cstm.state_id  ,sm.name
    FROM charger_serial_mst csm 
    inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
    inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
    inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
    inner join state_mst sm on cstm.state_id = sm.id and sm.status='Y'
    where csm.status='Y' and cstm.id = ${params.station_id}
    group by  cstm.state_id order by charger_count desc;`;

  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByCityCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let whereClause = '';
  let final_res;
  let resp;
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      result(response);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      result(response);
      return;
    }
  }

  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
    }
  }


  if (isSA) {
    stmt = ` SELECT count(*) as charger_count , cstm.city_id  ,cm.name
      FROM charger_serial_mst csm inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`
  } else {
    stmt = `  SELECT count(*) as charger_count , cstm.state_id  ,cm.name
      FROM charger_serial_mst csm inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`
  }

  //--------------------------------
  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByCityCCS = async ( params, result) => {

  let stmt = '';
  let final_res;
  let resp;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // let from_date = params.f_date == null ? "" : params.f_date.trim();
  // let to_date = params.t_date == null ? "" : params.t_date.trim();
  // let whereClause = '';
  
  // if (from_date !== "") {
  //   if (!_utility.validateDate(from_date)) {
  //     result(response);
  //     return;
  //   }
  // }
  // if (to_date !== "") {
  //   if (!_utility.validateDate(to_date)) {
  //     result(response);
  //     return;
  //   }
  // }

  // if (from_date !== "" && to_date !== "") {
  //   if (whereClause == "") {
  //     whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
  //   } else {
  //     whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
  //   }
  // } else if (from_date != "") {
  //   if (whereClause == "") {
  //     whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
  //   } else {
  //     whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
  //   }
  // }


  // if (isSA) {
  //   stmt = ` SELECT count(*) as charger_count , cstm.city_id  ,cm.name
  //     FROM charger_serial_mst csm inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
  //     inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
  //     inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
  //     where csm.status='Y'
  //     group by  cstm.state_id order by charger_count desc;`
  // } else {
  //   stmt = `  SELECT count(*) as charger_count , cstm.state_id  ,cm.name
  //     FROM charger_serial_mst csm inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
  //     inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
  //     inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
  //     inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
  //     where csm.status='Y'
  //     group by  cstm.state_id order by charger_count desc;`
  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = `  SELECT count(*) as charger_count , cstm.city_id  ,cm.name
      FROM charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
      where csm.status='Y'
      group by  cstm.state_id order by charger_count desc;`

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = `  SELECT count(*) as charger_count , cstm.city_id  ,cm.name
      FROM charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
      where csm.status='Y' and cstm.cpo_id = ${params.cpo_id}
      group by  cstm.state_id order by charger_count desc;`

  }else{

    stmt = `  SELECT count(*) as charger_count , cstm.city_id  ,cm.name
      FROM charger_serial_mst csm 
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${params.client_id}
      inner join charger_station_mapping chsm on csm.id=chsm.charger_id  and chsm.status='Y'
      inner join charging_station_mst cstm on chsm.station_id = cstm.id and cstm.status='Y'
      inner join city_mst cm on cstm.city_id = cm.id and cm.status='Y'
      where csm.status='Y' and cstm.id = ${params.station_id}
      group by  cstm.state_id order by charger_count desc;`

  }

  //--------------------------------
  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByLastTransactionMonthCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let resp_temp;
  let resp_drop;
  var datetime = new Date();


  let temp_table = ' temp_last_transaction_month' + '' + datetime.getDate() + '' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '' + datetime.getFullYear() + '' + datetime.getHours() + '' + datetime.getMinutes() + '' + datetime.getSeconds() + '' + login_id;

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // let from_date = params.f_date == null ? "" : params.f_date.trim();
  // let to_date = params.t_date == null ? "" : params.t_date.trim();
  let year = params.year == null ? "" : params.year.trim();

  if (!!year) {
    if (!_utility.validateYear(year)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid year',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }

  let stmt_drop = `drop table if exists ${temp_table};`;
  let stmt = `select count(*) as count,MONTHNAME( last_transaction_date )  as month_name , max_month as month 
    from ${temp_table} group by month_name order by max_month ;`;
  let stmt_temp;

  if (isSA) {
    stmt_temp = `CREATE  TABLE ${temp_table}
    select charger_id,max(MONTH(start_time)) as max_month,max((start_time)) as last_transaction_date  
    from meter_log where action='StartTransaction' and YEAR( start_time ) =${year}
    group by charger_id`;
  } else {
    stmt_temp = `CREATE  TABLE ${temp_table} 
    select ml.charger_id,max(MONTH(start_time)) as max_month,max((start_time)) as last_transaction_date  
    from meter_log ml inner join charger_serial_mst csm on ml.charger_id=csm.name and csm.status='Y'
    inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id=${client_id}
    where action='StartTransaction' and YEAR( start_time ) =${year}
	  group by ml.charger_id;`;
  }

  //--------------------------------
  try {

    //if(resp_drop.warningCount==1){
    resp_temp = await pool.query(stmt_temp);

    if (resp_temp.affectedRows > 0) {
      resp = await pool.query(stmt);

      if (resp.length > 0) {

        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: resp.length,
          data: resp
        }
      } else {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: `NOT_FOUND`,
          count: 0,
          data: []
        }
      }
    } else {
      //
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    resp_drop = await pool.query(stmt_drop);
    result(null, final_res);
  }
};


TransactionList.getChargerCountByTotalEnergySlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;


  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  // where date(ml.created_on) BETWEEN '2022-08-01' and '2021-11-30'
  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) = '${from_date}'  `;
    }
  }


  if (isSA) {
    stmt = ` select count(*) as count , energy_slab from
    ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
      case when (  (sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
       when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
       when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
       when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
       when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
       when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      ${whereClause} and action='StartTransaction'  
      GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
      ) as temp_table
      group by energy_slab;`
  } else {
    stmt = `select count(*) as count , energy_slab from
    ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
      case when (  (sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
       when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
       when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
       when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
       when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
       when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
        inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
      ${whereClause} and action='StartTransaction'  
      GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
      ) as temp_table
      group by energy_slab; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {



      if (resp.filter(x => x.energy_slab == '0-1000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '0-1000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '0-1000 KWh'
        })
      }

      if (resp.filter(x => x.energy_slab == '1001-2000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '1001-2000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '1001-2000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '2001-3000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '2001-3000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '2001-3000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '3001-4000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '3001-4000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '3001-4000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '4001-5000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '4001-5000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '4001-5000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '5001 KWh & above').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '5001 KWh & above');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '5001 KWh & above'
        })
      }


      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByTotalEnergySlabCCS = async ( params, result) => {

  let stmt = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let whereClause = '';
 


  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  // where date(ml.created_on) BETWEEN '2022-08-01' and '2021-11-30'
  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) = '${from_date}'  `;
    }
  }


  // if (isSA) {
  //   stmt = ` select count(*) as count , energy_slab from
  //   ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
  //     case when (  (sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
  //      when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
  //      when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
  //      when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
  //      when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
  //      when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
  //     from meter_log ml
  //     inner join charger_serial_mst csm on ml.charger_id=csm.name
  //     ${whereClause} and action='StartTransaction'  
  //     GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
  //     ) as temp_table
  //     group by energy_slab;`
  // } else {
    // stmt = `select count(*) as count , energy_slab from
    // ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
    //   case when (  (sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
    //    when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
    //    when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
    //    when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
    //    when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
    //    when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
    //   from meter_log ml
    //   inner join charger_serial_mst csm on ml.charger_id=csm.name
    //     inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
    //   ${whereClause} and action='StartTransaction'  
    //   GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
    //   ) as temp_table
    //   group by energy_slab; `;
  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = `select count(*) as count , energy_slab from
      ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
        case when ((sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
         when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
         when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
         when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
         when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
         when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
        from meter_log ml
        inner join charger_serial_mst csm on ml.charger_id=csm.name
        ${whereClause} and action='StartTransaction' and ml.client_id = ${params.client_id} 
        GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
        ) as temp_table
        group by energy_slab; `;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = `select count(*) as count , energy_slab from
      ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
        case when ((sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
         when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
         when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
         when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
         when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
         when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
        from meter_log ml
        inner join charger_serial_mst csm on ml.charger_id=csm.name
        ${whereClause} and action='StartTransaction' and ml.cpo_id = ${params.cpo_id} 
        GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
        ) as temp_table
        group by energy_slab; `;     

  }else{

    stmt = `select count(*) as count , energy_slab from
    ( select ml.charger_id,csm.serial_no,sum(ml.meter_reading)/1000 AS total_energy_consumed, 
      case when ((sum(ml.meter_reading)/1000) <=1000 || sum(ml.meter_reading) is null) then '0-1000 KWh'
       when  ((sum(ml.meter_reading)/1000) >1000 && (sum(ml.meter_reading)/1000) <=2000 ) then '1001-2000 KWh'
       when  ((sum(ml.meter_reading)/1000) >2000 && (sum(ml.meter_reading)/1000) <=3000 ) then '2001-3000 KWh'
       when  ((sum(ml.meter_reading)/1000) >3000 && (sum(ml.meter_reading)/1000) <=4000 ) then '3001-4000 KWh'
       when  ((sum(ml.meter_reading)/1000) >4000 && (sum(ml.meter_reading)/1000) <=5000 ) then '4001-5000 KWh'
       when  ((sum(ml.meter_reading)/1000) >5000  ) then '5001 KWh & above' end as energy_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      ${whereClause} and action='StartTransaction' and ml.station_id = ${params.station_id} 
      GROUP BY (ml.charger_id) ORDER BY ml.charger_id 
      ) as temp_table
      group by energy_slab; `;

  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {
      if (resp.filter(x => x.energy_slab == '0-1000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '0-1000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '0-1000 KWh'
        })
      }

      if (resp.filter(x => x.energy_slab == '1001-2000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '1001-2000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '1001-2000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '2001-3000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '2001-3000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '2001-3000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '3001-4000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '3001-4000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '3001-4000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '4001-5000 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '4001-5000 KWh');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '4001-5000 KWh'
        })
      }
      if (resp.filter(x => x.energy_slab == '5001 KWh & above').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.energy_slab == '5001 KWh & above');
        resp_modified.push({
          count: item.count,
          energy_slab: item.energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          energy_slab: '5001 KWh & above'
        })
      }


      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByAverageEnergyPerTransactionSlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;


  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  // where date(ml.created_on) BETWEEN '2022-08-01' and '2021-11-30'
  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) = '${from_date}'  `;
    }
  }


  if (isSA) {
    stmt = ` select count(*) as count , avg_energy_slab,charger_id from
      ( select count(*),ml.charger_id,csm.serial_no, 
      case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
      when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
      when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
      when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
      when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
      when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
      GROUP BY (ml.charger_id)
      ORDER BY ml.charger_id 
      ) as temp_table
      group by avg_energy_slab ;`
  } else {
    stmt = `select count(*) as count , avg_energy_slab,charger_id from
      ( select count(*),ml.charger_id,csm.serial_no, 
      case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
      when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
      when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
      when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
      when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
      when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y'   and ccm.client_id = ${client_id}
      ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
      GROUP BY (ml.charger_id)
      ORDER BY ml.charger_id 
      ) as temp_table
      group by avg_energy_slab ; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {



      if (resp.filter(x => x.avg_energy_slab == '0-20 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '0-20 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '0-20 KWh'
        })
      }

      if (resp.filter(x => x.avg_energy_slab == '21-40 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '21-40 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '21-40 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '41-60 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '41-60 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '41-60 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '61-80 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '61-80 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '61-80 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '81-100 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '81-100 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '81-100 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '101 KWh & above').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '101 KWh & above');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '101 KWh & above'
        })
      }


      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByAverageEnergyPerTransactionSlabCCS = async ( params, result) => {

  let stmt = '';
  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;

  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
 
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  // where date(ml.created_on) BETWEEN '2022-08-01' and '2021-11-30'
  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(ml.created_on) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(ml.created_on) = '${from_date}'  `;
    }
  }


  // if (isSA) {
  //   stmt = ` select count(*) as count , avg_energy_slab,charger_id from
  //     ( select count(*),ml.charger_id,csm.serial_no, 
  //     case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
  //     when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
  //     when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
  //     when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
  //     when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
  //     when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
  //     from meter_log ml
  //     inner join charger_serial_mst csm on ml.charger_id=csm.name
  //     ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
  //     GROUP BY (ml.charger_id)
  //     ORDER BY ml.charger_id 
  //     ) as temp_table
  //     group by avg_energy_slab ;`
  // } else {
    // stmt = `select count(*) as count , avg_energy_slab,charger_id from
    //   ( select count(*),ml.charger_id,csm.serial_no, 
    //   case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
    //   when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
    //   when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
    //   when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
    //   when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
    //   when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
    //   from meter_log ml
    //   inner join charger_serial_mst csm on ml.charger_id=csm.name
    //   inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y'   and ccm.client_id = ${client_id}
    //   ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
    //   GROUP BY (ml.charger_id)
    //   ORDER BY ml.charger_id 
    //   ) as temp_table
    //   group by avg_energy_slab ; `;
  // }


  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query

    stmt = `select count(*) as count , avg_energy_slab,charger_id from
    ( select count(*),ml.charger_id,csm.serial_no, 
    case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
    when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
    when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
    when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
    when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
    when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
    from meter_log ml
    inner join charger_serial_mst csm on ml.charger_id=csm.name
    ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
    and ml.client_id = ${params.client_id}
    GROUP BY (ml.charger_id)
    ORDER BY ml.charger_id 
    ) as temp_table
    group by avg_energy_slab ; `;

  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query

    stmt = `select count(*) as count , avg_energy_slab,charger_id from
    ( select count(*),ml.charger_id,csm.serial_no, 
    case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
    when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
    when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
    when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
    when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
    when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
    from meter_log ml
    inner join charger_serial_mst csm on ml.charger_id=csm.name
    ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
    and ml.cpo_id = ${params.cpo_id}
    GROUP BY (ml.charger_id)
    ORDER BY ml.charger_id 
    ) as temp_table
    group by avg_energy_slab ; `;

  }else{

    stmt = `select count(*) as count , avg_energy_slab,charger_id from
    ( select count(*),ml.charger_id,csm.serial_no, 
    case when (  (sum(meter_reading)/count(*)) <=20000 || (sum(meter_reading)/count(*)) is null) then '0-20 KWh'
    when  ( (sum(meter_reading)/count(*)) >20000 && (sum(meter_reading)/count(*)) <=40000 ) then '21-40 KWh'
    when  ( (sum(meter_reading)/count(*)) >40000 && (sum(meter_reading)/count(*)) <=60000 ) then '41-60 KWh'
    when  ( (sum(meter_reading)/count(*)) >60000 && (sum(meter_reading)/count(*)) <=80000 ) then '61-80 KWh'
    when  ( (sum(meter_reading)/count(*)) >80000 && (sum(meter_reading)/count(*)) <=100000 ) then '81-100 KWh'
    when  ( (sum(meter_reading)/count(*)) >100000  ) then '101 KWh & above' end as avg_energy_slab
    from meter_log ml
    inner join charger_serial_mst csm on ml.charger_id=csm.name
    ${whereClause} and action='StartTransaction'  and (meter_reading>0 && meter_reading is not null)
    and ml.station_id = ${params.station_id}
    GROUP BY (ml.charger_id)
    ORDER BY ml.charger_id 
    ) as temp_table
    group by avg_energy_slab ; `;

  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      if (resp.filter(x => x.avg_energy_slab == '0-20 KWh').length > 0) {
        item = resp.find(x => x.avg_energy_slab == '0-20 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '0-20 KWh'
        })
      }

      if (resp.filter(x => x.avg_energy_slab == '21-40 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '21-40 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '21-40 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '41-60 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '41-60 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '41-60 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '61-80 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '61-80 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '61-80 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '81-100 KWh').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '81-100 KWh');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '81-100 KWh'
        })
      }
      if (resp.filter(x => x.avg_energy_slab == '101 KWh & above').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.avg_energy_slab == '101 KWh & above');
        resp_modified.push({
          count: item.count,
          avg_energy_slab: item.avg_energy_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          avg_energy_slab: '101 KWh & above'
        })
      }


      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByLowDurationAndLowFrequencySlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let avg_duration =  params.avg_duration;
  let avg_frequency = 5; //frequency is fixed 5 as per login more than 5 will come in another graph where we show more than 5 frequency

  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;
  let no_of_weeks;
  
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }

  no_of_weeks = (_utility.getDayDifference(from_date,to_date))/7; 
  whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;


  if (isSA) {
    stmt = ` select count(*) as count , transaction_slab from
      ( select ml.charger_id, csm.serial_no, 
        (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
        case when ( count(*) <= 1 ) then '0-1'
        when  (count(*) >1 && count(*) <=3 ) then '2-3'
        when  (count(*) >3 && count(*) <=5 ) then '4-5'
        -- when  (((sum(ml.duration)/3600)/2) >5 ) then 'above 5' 
        end as transaction_slab
        from meter_log ml
        inner join charger_serial_mst csm on ml.charger_id=csm.name
       -- inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' -- and ccm.client_id = 27
        ${whereClause}
        and action='StartTransaction'  and duration is not null and duration>0
        GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) <=${avg_duration}) and count(*)<=${avg_frequency}
        ORDER BY ml.charger_id 
      ) as temp_table
      group by transaction_slab ;`
  } else {
    stmt = ` select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 1 ) then '0-1'
      when  (count(*) >1 && count(*) <=3 ) then '2-3'
      when  (count(*) >3 && count(*) <=5 ) then '4-5'
      -- when  (((sum(ml.duration)/3600)/2) >5 ) then 'above 5' 
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y'  and ccm.client_id = ${client_id}
      ${whereClause}
      and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) <=${avg_duration}) and count(*)<=${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      if (resp.filter(x => x.transaction_slab == '0-1').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '0-1');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '0-1'
        })
      }

      if (resp.filter(x => x.transaction_slab == '2-3').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '2-3');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '2-3'
        })
      }
      if (resp.filter(x => x.transaction_slab == '4-5').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '4-5');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '4-5'
        })
      }
     
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByLowDurationAndHighFrequencySlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let avg_duration =  params.avg_duration;
  let avg_frequency = 5; //frequency is fixed 5 as per login more than 5 will come in another graph where we show more than 5 frequency

  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;
  let no_of_weeks;
  
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }

  no_of_weeks = (_utility.getDayDifference(from_date,to_date))/7; 
  whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;

  if (isSA) {
    stmt = `  select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks}  as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 6 ) then '5-6'
      when  (count(*) >6 && count(*) <=8 ) then '7-8'
      when  (count(*) >8 && count(*) <=10 ) then '9-10'
       when  (count(*) >10 ) then 'above 10' 
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
     ${whereClause} and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) <=${avg_duration}) and count(*)>${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ;`
  } else {
    stmt = ` select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 6 ) then '5-6'
      when  (count(*) >6 && count(*) <=8 ) then '7-8'
      when  (count(*) >8 && count(*) <=10 ) then '9-10'
       when  (count(*) >10 ) then 'above 10' 
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
     inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y'  and ccm.client_id = ${client_id}
     ${whereClause} and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) <=${avg_duration}) and count(*)>${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      if (resp.filter(x => x.transaction_slab == '5-6').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '5-6');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '5-6'
        })
      }

      if (resp.filter(x => x.transaction_slab == '7-8').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '7-8');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '7-8'
        })
      }

      if (resp.filter(x => x.transaction_slab == '9-10').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '9-10');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '9-10'
        })
      }
      if (resp.filter(x => x.transaction_slab == 'above 10').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == 'above 10');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: 'above 10'
        })
      }
     
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByHighDurationAndLowFrequencySlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let avg_duration =  params.avg_duration;
  let avg_frequency = 5; //frequency is fixed 5 as per login more than 5 will come in another graph where we show more than 5 frequency

  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;
  let no_of_weeks;
  
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date'
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date'
      }
      result(null, final_res);
      return;
    }
  }

  no_of_weeks = (_utility.getDayDifference(from_date,to_date))/7; 
  whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;

  if (isSA) {
    stmt = `  select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 1 ) then '0-1'
      when  (count(*) >1 && count(*) <=3 ) then '2-3'
      when  (count(*) >3 && count(*) <=5 ) then '4-5'
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      ${whereClause} and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) >${avg_duration}) and count(*)<=${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ;`

  } else {
   
    stmt = `  select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 1 ) then '0-1'
      when  (count(*) >1 && count(*) <=3 ) then '2-3'
      when  (count(*) >3 && count(*) <=5 ) then '4-5'
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
      ${whereClause}
      and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) >${avg_duration}) and count(*)<=${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      if (resp.filter(x => x.transaction_slab == '0-1').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '0-1');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '0-1'
        })
      }

      if (resp.filter(x => x.transaction_slab == '2-3').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '2-3');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '2-3'
        })
      }
      if (resp.filter(x => x.transaction_slab == '4-5').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '4-5');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '4-5'
        })
      }
     
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};

TransactionList.getChargerCountByHighDurationAndHighFrequencySlabCW = async (login_id, params, result) => {

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let avg_duration =  params.avg_duration;
  let avg_frequency = 5; //frequency is fixed 5 as per login more than 5 will come in another graph where we show more than 5 frequency

  let whereClause = '';
  let final_res;
  let resp;
  let resp_modified = [];
  let item;
  let no_of_weeks;
  
  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid from date'
      }
      result(null, final_res);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date'
      }
      result(null, final_res);
      return;
    }
  }

  no_of_weeks = (_utility.getDayDifference(from_date,to_date))/7; 
  whereClause = ` where DATE(ml.created_on) BETWEEN '${from_date}' AND '${to_date}' `;

  if (isSA) {
    stmt = ` select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 6 ) then '5-6'
      when  (count(*) >6 && count(*) <=8 ) then '7-8'
      when  (count(*) >8 && count(*) <=10 ) then '9-10'
       when  (count(*) >10 ) then 'above 10' 
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      ${whereClause} and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) >${avg_duration}) and count(*)>${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ;`

  } else {
   
    stmt = `  select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 1 ) then '0-1'
      when  (count(*) >1 && count(*) <=3 ) then '2-3'
      when  (count(*) >3 && count(*) <=5 ) then '4-5'
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y' and ccm.client_id = ${client_id}
      ${whereClause}
      and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) >${avg_duration}) and count(*)<=${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ; `;
    stmt = ` select count(*) as count , transaction_slab from
    ( select ml.charger_id, csm.serial_no, 
      (sum(ml.duration)/3600 )/${no_of_weeks} as total_duration_per_week, count(*) as total_transactions,
      case when ( count(*) <= 6 ) then '5-6'
      when  (count(*) >6 && count(*) <=8 ) then '7-8'
      when  (count(*) >8 && count(*) <=10 ) then '9-10'
       when  (count(*) >10 ) then 'above 10' 
      end as transaction_slab
      from meter_log ml
      inner join charger_serial_mst csm on ml.charger_id=csm.name
      inner join client_charger_mapping ccm on csm.id=ccm.charger_id and ccm.status='Y'  and ccm.client_id = ${client_id}
      ${whereClause} and action='StartTransaction'  and duration is not null and duration>0
      GROUP BY (ml.charger_id)  having (((sum(ml.duration)/3600)/${no_of_weeks}) >${avg_duration}) and count(*)>${avg_frequency}
      ORDER BY ml.charger_id 
    ) as temp_table
    group by transaction_slab ; `;
  }

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {

      if (resp.filter(x => x.transaction_slab == '5-6').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '5-6');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '5-6'
        })
      }

      if (resp.filter(x => x.transaction_slab == '7-8').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '7-8');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '7-8'
        })
      }

      if (resp.filter(x => x.transaction_slab == '9-10').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == '9-10');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: '9-10'
        })
      }
      if (resp.filter(x => x.transaction_slab == 'above 10').length > 0) {
        // index = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
        item = resp.find(x => x.transaction_slab == 'above 10');
        resp_modified.push({
          count: item.count,
          transaction_slab: item.transaction_slab
        })
      } else {
        resp_modified.push({
          count: 0,
          transaction_slab: 'above 10'
        })
      }
     
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp_modified.length,
        data: resp_modified
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `NOT_FOUND`,
        count: 0,
        data: []
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
    result(null, final_res);
  }
};




//------------End Analytics---------------------------------//

//------------Payment Analytics---------------------------------//



TransactionList.getRecentTransactionCW = async (login_id, params, result) => {


  //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
  let qry = "SET @OP_ErrorCode = 0; call Proc_GetRecentTransCW(" + login_id + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length > 3) {

      final_result = {
        status: true,
        err_code: resp[1].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[1].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[1].length,
        data: resp[1]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};

TransactionList.getPaymentSummaryCW = async (login_id, params, result) => {


  //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
  let qry = "SET @OP_ErrorCode = 0; call Proc_GetPaymentSummary_Day(" + login_id + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length > 3) {

      final_result = {
        status: true,
        err_code: resp[1].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[1].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[1].length,
        data: resp[1]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};

TransactionList.getCustomerVisitingSummaryCW = async (login_id, params, result) => {


  //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
  let qry = "SET @OP_ErrorCode = 0; call Proc_GetCustomerVisitingSummartCW(" + login_id + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length > 3) {

      final_result = {
        status: true,
        err_code: resp[1].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[1].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[1].length,
        data: resp[1]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};


TransactionList.getChargerTransactionSlab = async (login_id, params, result) => {

  let year = params.year == null ? "" : params.year.trim();
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id.trim();
  if (!!year) {
    if (!_utility.validateYear(year)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid year',
        count: 0,
        data: []
      }
      result(null, final_res);
      return;
    }
  }

  //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
  let qry = "SET @OP_ErrorCode = 0; call proc_AR_ChargerTransactionSlab(" + login_id + ","+ station_id + "," + year + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length > 3) {

      final_result = {
        status: true,
        err_code: resp[1].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[1].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[1].length,
        data: resp[1]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};



TransactionList.getCustomerChargingSummaryCW = async (login_id, params, result) => {

  let days = params.days == null ? "" : 30;
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id.trim();


  //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
  let qry = "SET @OP_ErrorCode = 0; call proc_AR_GetCustomerChargingSCW(" + login_id + ","+ station_id + "," + days + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length > 3) {

      final_result = {
        status: true,
        err_code: resp[1].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[1].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[1].length,
        data: resp[1][0]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};


TransactionList.getBookingPaymentSummaryCW = async (login_id, params, result) => {

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id;

  // let qry = "SET @OP_ErrorCode = 0; call proc_AR_GetCustomerChargingSCW(" + login_id + ","+ station_id + "," + days + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
  let qry = `call pAR_BookingBillingSummaryDay('${clientAndRoleDetails.data[0].role_code}',${clientAndRoleDetails.data[0].client_id},${params.station_id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail `

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length >= 3) {

      final_result = {
        status: true,
        err_code: resp[0].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[0].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[0].length,
        data: resp[0][0]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};




TransactionList.getCustomerPaymentSummaryMonth = async (login_id, params, result) => {

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id;

  // let qry = "SET @OP_ErrorCode = 0; call proc_AR_GetCustomerChargingSCW(" + login_id + ","+ station_id + "," + days + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
  let qry = `call pAR_PaymentSummaryMonth('${clientAndRoleDetails.data[0].role_code}',${clientAndRoleDetails.data[0].client_id},${params.station_id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail `

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length >= 3) {

      final_result = {
        status: true,
        err_code: resp[0].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[0].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[0].length,
        data: resp[0]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};

TransactionList.getCollectionMonthly = async (login_id, params, result) => {

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id;

  // let qry = "SET @OP_ErrorCode = 0; call proc_AR_GetCustomerChargingSCW(" + login_id + ","+ station_id + "," + days + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
  let qry = `call pAR_PaymentCollectionMonth('${clientAndRoleDetails.data[0].role_code}',${clientAndRoleDetails.data[0].client_id},${params.station_id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail `

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length >= 3) {
      let totalamount = 0
      let avg = 0;
      for (const type of resp[0]) {  
        totalamount += type.amount;
      }
      avg = totalamount/resp[0].length;
      final_result = {
        status: true,
        err_code: resp[0].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[0].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[0].length,
        data: {
          graphdata : resp[0],
          averagecollection : avg
        }
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};

TransactionList.getBookingCountsCW = async (login_id, params, result) => {

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let station_id = params.station_id == null || params.station_id == '' ? 0 : params.station_id;

  // let qry = "SET @OP_ErrorCode = 0; call proc_AR_GetCustomerChargingSCW(" + login_id + ","+ station_id + "," + days + ", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
  let qry = `call pAR_GetBookingCountCW('${clientAndRoleDetails.data[0].role_code}',${params.station_id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail `

  let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
    if (resp.length >= 3) {

      final_result = {
        status: true,
        err_code: resp[0].length > 0 ? `ERROR : 0` : `ERROR : 1`,
        message: resp[0].length > 0 ? `SUCCESS` : `NOT_FOUND`,
        count: resp[0].length,
        data: resp[0]
      }
    } else {

      final_result = {
        status: false,
        err_code: `ERROR : 1`,
        message: resp[2][0].OP_ErrorDetail,
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    console.log(e.stack);
    final_result = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_result);
  }
};



// =====================vehicle ==========================

//Get total vehicle  , total vehicle charging, total vehicle not charging
TransactionList.getVehicleChargingStatusCW = async (login_id, result) => {

  let stmtTotal = '';
  let stmtChargingCount = '';
  let respTotal; 
  let respChargingCount;
  let total_vehicles ;
  let total_vehicles_charging;
  let total_vehicles_not_charging ;

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmtTotal = ` select count(id) as total_vehicles from cpo_rfid_mapping crm where crm.status = 'Y' ;`;
    stmtChargingCount = ` select count(id) as total_vehicles_charging from meter_log 
      where action='StartTransaction' 
      and active_transaction_status='Y'  and created_on > (now() - interval 8 hour)
      order by id desc;`;
  } else {
    stmtTotal = ` select count(id) as total_vehicles from cpo_rfid_mapping crm where crm.status = 'Y' and crm.client_id = ${client_id} ;`
    stmtChargingCount = ` select count(id) as total_vehicles_charging from meter_log 
      where action='StartTransaction' 
      and active_transaction_status='Y' and client_id = ${client_id} and created_on > (now() - interval 8 hour)
      order by id desc ;`
  }
  
  //--------------------------------
  try {

    respTotal = await pool.query(stmtTotal);
    respChargingCount = await pool.query(stmtChargingCount);

    total_vehicles = respTotal[0].total_vehicles,
    total_vehicles_charging = respChargingCount[0].total_vehicles_charging,
    total_vehicles_not_charging = total_vehicles - total_vehicles_charging
    //;
    final_res = {
      total_vehicles :total_vehicles,
      total_vehicles_charging : total_vehicles_charging,
      total_vehicles_not_charging : total_vehicles_not_charging
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
    result(null, resp);
  }


};

TransactionList.getVehicleActiveConnectorStatusCW = async (login_id, result) => {

  let stmt = '';
  let resp;
  let final_resp;

  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select id,action,message_id, message_code,charger_id,connector_id, idtag ,
      transaction_id,custom_trans_id,start_value,start_time,stop_time,
      stop_value,initial_soc,final_soc from meter_log 
      where action='StartTransaction' 
      and active_transaction_status='Y'  and created_on > (now() - interval 8 hour)
      order by id desc ; `
  } else {
    stmt = `select id,action,message_id, message_code,charger_id,connector_id, idtag ,
      transaction_id,custom_trans_id,start_value,start_time,stop_time,
      stop_value,initial_soc,final_soc from meter_log 
      where action='StartTransaction' 
      and active_transaction_status='Y' and client_id = ${client_id} and created_on > (now() - interval 8 hour)
      order by id desc ; `
  }

  try {
    resp = await pool.query(stmt);

    final_resp = {
      status: true,
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



//------------End Analytics---------------------------------//


module.exports = {
  TransactionList: TransactionList

};