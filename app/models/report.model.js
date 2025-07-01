const { sql, pool, poolPG } = require("./db.js");
// const { Pool } = require("pg");
const _utility = require("../utility/_utility");

const Report = function (chargerValues) {
  this.id = chargerValues.id,
    this.charger_id = chargerValues.charger_id,
    this.station_id = chargerValues.station_id,
    this.meter_reading = chargerValues.is_available,
    this.status = chargerValues.status,
    this.created_on = chargerValues.created_on
    this.fdate = chargerValues.fdate,
    this.todate = chargerValues.todate,
    this.start_date=chargerValues.start_date,
    this.end_date=chargerValues.end_date,
    this.status=chargerValues.status
};
Report.getTransactionReportCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,
    csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,
    ML.created_on as Date,ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration, 
    ML.meter_start,  IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,ifnull(ML.initial_soc,'') as start_SOC,
    ifnull(ML.final_soc,'')  as end_SOC ,IFNULL(ML.energy_consumed, 0) as energy_consumed 
    FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'
    inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
    inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
    inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
    inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
    inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
    WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '2022-06-29' AND '2022-07-01'   
    ORDER BY ML.created_on desc;
`
    // stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.transaction_id,csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ML.created_on as Date,
    //     ML.duration,ML.energy_consumed
    //      FROM meter_log ML
    //       inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    //       inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'  
    //       inner join charging_station_mst csm on ccm.name = csm.name and csm.status='Y'
    //       inner join charger_station_mapping cssm on csm.id = cssm.station_id and cssm.status='Y'  
    //       inner join cpo_mst cm on cm.id = csm.cpo_id and cm.status='Y' 
    //       inner join city_mst cmm on cmm.id = csm.city_id and cmm.status='Y' 
    //       inner join state_mst sm on sm.id = csm.state_id and sm.status='Y' 
    //      WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction'   
    //      ORDER BY ML.charger_id desc;`
  } else {
    stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,ML.created_on as Date,
    ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration, ML.meter_start,  IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,ifnull(ML.initial_soc,'') as start_SOC,ifnull(ML.final_soc,'')  as end_SOC, IFNULL(ML.energy_consumed, 0) as energy_consumed 
    FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
    inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
    inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
    inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
    inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
    WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}'   
    ORDER BY ML.created_on desc;`
    // stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.transaction_id,csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ML.created_on as Date,
    //     ML.duration,ML.energy_consumed
    //      FROM meter_log ML
    //       inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    //       inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'  
    //       inner join charging_station_mst csm on ccm.name = csm.name and csm.status='Y'
    //       inner join charger_station_mapping cssm on csm.id = cssm.station_id and cssm.status='Y'  
    //       inner join cpo_mst cm on cm.id = csm.cpo_id and cm.status='Y' 
    //       inner join city_mst cmm on cmm.id = csm.city_id and cmm.status='Y' 
    //       inner join state_mst sm on sm.id = csm.state_id and sm.status='Y' 
    //      WHERE date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}' and ML.action='StartTransaction' 
    //      and cm.client_id=${client_id}
    //      ORDER BY ML.charger_id desc;`

  }

  debugger;
  //--------------------------------
  try {

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

  //----------------------------


};

Report.getTransactionReportCCS = async (params, result) => {

  let final_res;
  let resp;
  let stmt;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {
  //   stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,
  //   csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,
  //   ML.created_on as Date,ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration, 
  //   ML.meter_start,  IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,ifnull(ML.initial_soc,'') as start_SOC,
  //   ifnull(ML.final_soc,'')  as end_SOC ,IFNULL(ML.energy_consumed, 0) as energy_consumed 
  //   FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
  //   inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y'
  //   inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
  //   inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
  //   inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
  //   inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
  //   inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
  //   WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '2022-06-29' AND '2022-07-01'   
  //   ORDER BY ML.created_on desc;`

  // } else {
    // stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,ML.created_on as Date,
    // ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration, ML.meter_start,  IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,ifnull(ML.initial_soc,'') as start_SOC,ifnull(ML.final_soc,'')  as end_SOC, IFNULL(ML.energy_consumed, 0) as energy_consumed 
    // FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
    // inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${client_id}
    // inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
    // inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
    // inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
    // inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
    // inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
    // WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}'   
    // ORDER BY ML.created_on desc;`

  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,
    ccm.nick_name as charger_nick_name,ML.created_on as Date,ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration, ML.meter_start,
      IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,ifnull(ML.initial_soc,'') as start_SOC,ifnull(ML.final_soc,'')  as end_SOC,
      IFNULL(ML.energy_consumed, 0) as energy_consumed 
      FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      inner join client_charger_mapping clcm on ccm.id = clcm.charger_id and clcm.status='Y' and clcm.client_id=${params.client_id}
      inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
      inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
      inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
      inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
      inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
      WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}'   
      ORDER BY ML.created_on desc;`
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    
    stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,
    csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,
    ML.created_on as Date,ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration,
     ML.meter_start,IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,
     ifnull(ML.initial_soc,'') as start_SOC,ifnull(ML.final_soc,'')  as end_SOC,IFNULL(ML.energy_consumed, 0) as energy_consumed 
      FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' 
      inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
      inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' and cm.id=${params.cpo_id}
      inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
      inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
      WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}'   
      ORDER BY ML.created_on desc;`
    
  
  }else{
    stmt = `SELECT sm.name as state_name,cmm.name as city_name,cm.name as cpo_name,ML.idtag,ML.transaction_id,
    csm.name as station_name,ML.charger_id as charger_name,ccm.serial_no,ccm.nick_name as charger_nick_name,
    ML.created_on as Date,ML.start_time,IFNULL(ML.stop_time, '') as stop_time , IFNULL(ML.duration, 0) as duration,
     ML.meter_start,IFNULL(ML.meter_stop, '') as meter_stop,ifnull(ML.reason,'')stop_reason,
     ifnull(ML.initial_soc,'') as start_SOC,ifnull(ML.final_soc,'')  as end_SOC,IFNULL(ML.energy_consumed, 0) as energy_consumed 
      FROM meter_log ML inner join charger_serial_mst ccm on ML.charger_id = ccm.name and ccm.status='Y'
      inner join charger_station_mapping cssm on ccm.id = cssm.charger_id and cssm.status='Y' and cssm.station_id=${params.station_id}
      inner join charging_station_mst csm on cssm.station_id = csm.id and csm.status='Y'
      inner join cpo_mst cm on csm.cpo_id = cm.id  and cm.status='Y' 
      inner join city_mst cmm on csm.city_id = cmm.id  and cmm.status='Y' 
      inner join state_mst sm on csm.state_id = sm.id and sm.status='Y' 
      WHERE ML.action='StartTransaction'  and date(ML.created_on) BETWEEN '${params.fdate}' AND '${params.todate}'   
      ORDER BY ML.created_on desc;`
    
  }  

  debugger;
  //--------------------------------
  try {

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

  //----------------------------


};

Report.getAlarmReportCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = `select charger_id,errorcode,info,charger_srno as charger_serial_no,request_date as date from chargerrequest_log 
        where action='StatusNotification' and errorcode not in('NoError','') 
        and CAST(request_date as DATE) BETWEEN '${params.fdate}'::timestamptz 
        AND '${params.todate}'::timestamptz order by log_id desc;`

  } else {


    stmt = `select charger_id,errorcode,info,charger_srno as charger_serial_no,request_date as date from chargerrequest_log 
        where action='StatusNotification' and errorcode not in('NoError','') 
        and client_id='${client_id}'
        and CAST(request_date as DATE) BETWEEN '${params.fdate}'::timestamptz 
        AND '${params.todate}'::timestamptz order by log_id desc;`



  }

  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    final_res = {
      status: resp.rows.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.rows.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.rows.length,
      data: resp.rows
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

  //----------------------------


};
Report.getAlarmReportDetailViewCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,ml.request_date as date,
        ml.client_name,ml.cpo_name,ml.station_name
        from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
        AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
        and ml.action='StatusNotification'   ORDER BY ml.log_id desc;`

  } else {

    stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,ml.request_date as date,
        ml.client_name,ml.cpo_name,ml.station_name
        from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
        AND '${params.todate}'::timestamptz and errorcode not in('NoError','') and client_id='${client_id}'
        and ml.action='StatusNotification'  ORDER BY ml.log_id desc;`

  }
  
  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    final_res = {
      status: resp.rows.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.rows.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.rows.length,
      data: resp.rows
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  }
  finally {
    result(null, final_res);
  }
};

Report.getAlarmReportDetailViewCCS = async (params, result) => {

  let final_res;
  let resp;
  let stmt;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {

  //   stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,ml.request_date as date,
  //       ml.client_name,ml.cpo_name,ml.station_name
  //       from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
  //       AND '${params.todate}'::timestamptz and errorcode not in('NoError','')
  //       and ml.action='StatusNotification'   ORDER BY ml.log_id desc;`

  // } else {

  //   stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,ml.charger_srno as charger_serial_no,ml.request_date as date,
  //       ml.client_name,ml.cpo_name,ml.station_name
  //       from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
  //       AND '${params.todate}'::timestamptz and errorcode not in('NoError','') and client_id='${client_id}'
  //       and ml.action='StatusNotification'  ORDER BY ml.log_id desc;`

  // }

  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,
      ml.charger_srno as charger_serial_no,ml.request_date as date,ml.client_name,ml.cpo_name,ml.station_name
      from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
      AND '${params.todate}'::timestamptz and errorcode not in('NoError','') and client_id='${params.client_id}'
      and ml.action='StatusNotification'  ORDER BY ml.log_id desc;`  
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    
    stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,
      ml.charger_srno as charger_serial_no,ml.request_date as date,ml.client_name,ml.cpo_name,ml.station_name
      from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
      AND '${params.todate}'::timestamptz and errorcode not in('NoError','') and cpo_id='${params.cpo_id}'
      and ml.action='StatusNotification'  ORDER BY ml.log_id desc;`
    
  
  }else{
    stmt = `select ml.log_id,ml.charger_id as charger_display_id,ml.info as alarm_name,
      ml.charger_srno as charger_serial_no,ml.request_date as date,ml.client_name,ml.cpo_name,ml.station_name
      from chargerrequest_log ml where date(ml.request_date) BETWEEN '${params.fdate}'::timestamptz 
      AND '${params.todate}'::timestamptz and errorcode not in('NoError','') and station_id='${params.station_id}'
      and ml.action='StatusNotification'  ORDER BY ml.log_id desc;`
    
  }  
  
  //--------------------------------
  try {
    resp = await poolPG.query(stmt);

    final_res = {
      status: resp.rows.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.rows.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.rows.length,
      data: resp.rows
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  }
  finally {
    result(null, final_res);
  }
};


Report.getChargerStatusDetailViewCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let resp2 ;
  let resp_modified = [];
  let stmt;
  let stmt2 = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
    scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
     CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
    FROM summary_chargers_report scr
    INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
    order by station_name,charger_id;`
    // stmt = `select csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
    //       ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant,
    //       CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,now()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END as charger_status 
    //       from charger_serial_mst csm           
    //       inner join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
    //       inner join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
    //       inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
    //       inner join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
    //       inner join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
    //       inner join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
    //       inner join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
    //       inner join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
    //       where csm.status='Y' 
    //       order by station_name,csm.id;`

      stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
      scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
      from charger_connector_mapping ccm 
      inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
      where ccm.status='Y' and ccm.current_status='Charging' 
      and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      group by ccm.charger_id
      order by station_name,scr.charger_id;`;          
      // stmt2 = ` select ccm.charger_id  ,csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
      //   ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant,
      //   'CHARGING' as charger_status 
      //   from charger_connector_mapping ccm 
      //   inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
      //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y' 
      //   left join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
      //   left join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
      //   left join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
      //   left join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
      //   left join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
      //   left join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
      //   left join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
      //   left join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
      //   where ccm.status='Y' and ccm.current_status='Charging' 
      //   and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      //   group by ccm.charger_id
      //   order by station_name,csm.id;`;          

  } else {

    stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name, scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
      scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
      CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
      FROM summary_chargers_report scr
      INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
      where client_id=${client_id} 
      order by station_name,charger_id;`;
    // stmt = `select csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
    //     ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant,
    //     CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,now()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END as charger_status 
    //     from charger_serial_mst csm           
    //     inner join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
    //     inner join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
    //     inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
    //     inner join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
    //     inner join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
    //     inner join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
    //     inner join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
    //     inner join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
    //     where csm.status='Y' and cm.client_id=${client_id} 
    //     order by station_name,csm.id;`;

      stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
      scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
      from charger_connector_mapping ccm 
      inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
      where ccm.status='Y' and ccm.current_status='Charging' and  client_id=${client_id}
      and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      group by ccm.charger_id
      order by station_name,scr.charger_id;`;  
      // stmt2 = ` select ccm.charger_id  ,csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
      //   ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant,
      //   'CHARGING' as charger_status  
      //   from charger_connector_mapping ccm 
      //   inner join charger_serial_mst csm on ccm.charger_id = csm.id and csm.status = 'Y'
      //   inner join client_charger_mapping clcm on csm.id = clcm.charger_id and clcm.status='Y'  and clcm.client_id=${client_id}
      //   left join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
      //   left join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
      //   left join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
      //   left join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
      //   left join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
      //   left join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
      //   left join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
      //   left join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
      //   where ccm.status='Y' and ccm.current_status='Charging' 
      //   and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      //   group by ccm.charger_id
      //   order by station_name,csm.id;`;  

  }

  //--------------------------------
  try {
    resp = await pool.query(stmt);
    resp2 = await pool.query(stmt2);

    debugger;

    if (resp.length>0) {
      let is_true = resp.filter(x => x.charger_status == 'OFFLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count : is_true.length,
          data: is_true
        })
      } else {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count : 0,
          data: []
        })
      }

      is_true = resp.filter(x => x.charger_status == 'ONLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'ONLINE',
          count : is_true.length,
          data: is_true
        })
      } else {
        resp_modified.push({
          charger_status: 'ONLINE',
          count : 0,
          data:[]
        })
      }


      // is_true = resp.filter(x => x.charger_status == 'TOTAL');

      if (resp.length > 0) {
        resp_modified.push({
          charger_status: 'TOTAL',
          count : resp.length,
          data: resp
        })
      } else {
        resp_modified.push({
          charger_status: 'TOTAL',
          count : 0,
          data:[]
        })
      }

      if (resp2.length>0) {
      
        resp_modified.push({
          charger_status: 'CHARGING',
          count : resp2.length,
          data: resp2
        })
        
      } else {
        resp_modified.push({
          charger_status: 'CHARGING',
          count : 0,
          data: []
        })
      }

      final_res = {
        status:  true ,
        err_code: `ERROR : 0`,
        message:  'SUCCESS' ,
        count: resp.length,
        data: resp_modified
      }

    } else {
      final_res = {
        status:  false,
        err_code: `ERROR : 1`,
        message: 'DATA NOT FOUND',
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

  //----------------------------


};

Report.getChargerStatusDetailViewCCS = async (params, result) => {

  let final_res;
  let resp;
  let resp2 ;
  let resp_modified = [];
  let stmt;
  let stmt2 = '';
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  // if (isSA) {

  //   stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
  //   scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
  //   CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
  //   FROM summary_chargers_report scr
  //   INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
  //   order by station_name,charger_id;`

  //   stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
  //   scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
  //   from charger_connector_mapping ccm 
  //   inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
  //   where ccm.status='Y' and ccm.current_status='Charging' 
  //   and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
  //   group by ccm.charger_id
  //   order by station_name,scr.charger_id;`;                    

  // } else {

  //   stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name, scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
  //     scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
  //     CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
  //     FROM summary_chargers_report scr
  //     INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
  //     where client_id=${client_id} 
  //     order by station_name,charger_id;`;

  //     stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
  //     scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
  //     from charger_connector_mapping ccm 
  //     inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
  //     where ccm.status='Y' and ccm.current_status='Charging' and  client_id=${client_id}
  //     and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
  //     group by ccm.charger_id
  //     order by station_name,scr.charger_id;`;  
  // }


  if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
    stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name, scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
      scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
      CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
      FROM summary_chargers_report scr
      INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
      where client_id=${params.client_id} 
      order by station_name,charger_id;`;

      stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
      scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
      from charger_connector_mapping ccm 
      inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
      where ccm.status='Y' and ccm.current_status='Charging' and  client_id=${params.client_id}
      and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      group by ccm.charger_id
      order by station_name,scr.charger_id;`;  
  
  }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
    
    stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name, 
    scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,scr.model_id,scr.model ,
    scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
    CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
    FROM summary_chargers_report scr
    INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
    where  cpo_id = ${params.cpo_id}
    order by station_name,charger_id;`;

    stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
    scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
    from charger_connector_mapping ccm 
    inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
    where ccm.status='Y' and ccm.current_status='Charging' and cpo_id = ${params.cpo_id}
    and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
    group by ccm.charger_id
    order by station_name,scr.charger_id;`;  
    
  
  }else{
    stmt = `SELECT scr.charger_display_id,scr.serial_no,csm.nick_name as charger_nick_name, scr.cpo_name,scr.station_id, scr.station_name, scr.state_name, scr.city_name,
      scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,
      CASE WHEN (TIMESTAMPDIFF(SECOND,csm.last_ping_datetime,NOW()) <= csm.heartbeat_interval) THEN "ONLINE" ELSE "OFFLINE" END AS charger_status
      FROM summary_chargers_report scr
      INNER JOIN charger_serial_mst csm ON scr.charger_id = csm.id 
      where scr.station_id=${params.station_id} 
      order by station_name,charger_id;`;

      stmt2 = ` select ccm.charger_id  ,scr.charger_display_id,scr.serial_no,scr.nick_name as charger_nick_name,scr.cpo_name,scr.station_id, scr.station_name, 
      scr.state_name,scr.city_name,scr.model_id,scr.model ,scr.part_no_id, scr.part_no,scr.variant_id,scr.variant,'CHARGING' as charger_status 
      from charger_connector_mapping ccm 
      inner join summary_chargers_report scr on ccm.charger_id = scr.charger_id 
      where ccm.status='Y' and ccm.current_status='Charging' and scr.station_id=${params.station_id} 
      and ( (ccm.last_ping_datetime is not null) && (TIMESTAMPDIFF(SECOND,ccm.last_ping_datetime,now()) <= ( ccm.heartbeat_interval+30)) && current_status is not null  )
      group by ccm.charger_id
      order by station_name,scr.charger_id;`;  
    
  }  

  //--------------------------------
  try {
    resp = await pool.query(stmt);
    resp2 = await pool.query(stmt2);

    debugger;

    if (resp.length>0) {
      let is_true = resp.filter(x => x.charger_status == 'OFFLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count : is_true.length,
          data: is_true
        })
      } else {
        resp_modified.push({
          charger_status: 'OFFLINE',
          count : 0,
          data: []
        })
      }

      is_true = resp.filter(x => x.charger_status == 'ONLINE');

      if (is_true.length > 0) {
        resp_modified.push({
          charger_status: 'ONLINE',
          count : is_true.length,
          data: is_true
        })
      } else {
        resp_modified.push({
          charger_status: 'ONLINE',
          count : 0,
          data:[]
        })
      }


      // is_true = resp.filter(x => x.charger_status == 'TOTAL');

      if (resp.length > 0) {
        resp_modified.push({
          charger_status: 'TOTAL',
          count : resp.length,
          data: resp
        })
      } else {
        resp_modified.push({
          charger_status: 'TOTAL',
          count : 0,
          data:[]
        })
      }

      if (resp2.length>0) {
      
        resp_modified.push({
          charger_status: 'CHARGING',
          count : resp2.length,
          data: resp2
        })
        
      } else {
        resp_modified.push({
          charger_status: 'CHARGING',
          count : 0,
          data: []
        })
      }

      final_res = {
        status:  true ,
        err_code: `ERROR : 0`,
        message:  'SUCCESS' ,
        count: resp.length,
        data: resp_modified
      }

    } else {
      final_res = {
        status:  false,
        err_code: `ERROR : 1`,
        message: 'DATA NOT FOUND',
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

  //----------------------------


};


Report.getChargerByLastTransactionCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  let year = params.year == null ? "" : params.year.trim();
  
  if (!!year) {
    if (!_utility.validateYear(year)) {
      final_res = {
        status:  false,
        err_code: `ERROR : 1`,
        message:  'Please select valid year' ,
        count: 0,
        data: []
      }
      result(null,final_res);
      return;
    }
  }

  if (isSA) {

    stmt = `select max((start_time)) as last_transaction_date , csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
        ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant
        from meter_log ml inner join  charger_serial_mst csm  on ml.charger_id = csm.name          
        inner join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
        inner join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
        inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
        inner join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
        inner join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
        inner join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
        inner join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
        inner join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
        where csm.status='Y' and action='StartTransaction' and YEAR(start_time ) = ${year}
        group by ml.charger_id
        order by last_transaction_date;`
  } else {

    stmt = ` select max((start_time)) as last_transaction_date , csm.name as charger_display_id,csm.serial_no,cm.name as cpo_name,sm.id as station_id, ccsm.name as station_name, sm.name as state_name,citm.name as city_name,
      ctm.id as model_id,ctm.name as model ,csm.part_no_id, cpm.part_code as part_no,cmm.id as variant_id,cmm.name as variant
      from meter_log ml inner join  charger_serial_mst csm  on ml.charger_id = csm.name          
      inner join charger_part_mst cpm on csm.part_no_id=cpm.id and cpm.status='P' 
      inner join charging_model_mst cmm on cpm.variant_id = cmm.id and cmm.status='Y'
      inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id and ctm.status='Y'
      inner join charger_station_mapping cssm on csm.id=cssm.charger_id and cssm.status='Y'
      inner join charging_station_mst ccsm on cssm.station_id=ccsm.id and ccsm.status='Y'
      inner join cpo_mst cm on ccsm.cpo_id=cm.id and ccsm.status='Y'
      inner join state_mst sm on ccsm.state_id=sm.id and sm.status='Y'
      inner join city_mst citm on ccsm.city_id=citm.id and citm.status='Y'
      where csm.status='Y'  and cm.client_id = ${client_id} and action='StartTransaction' and YEAR( start_time ) =${year}
      group by ml.charger_id
      order by last_transaction_date;`
  }

  //--------------------------------
  try {
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

  //----------------------------


};


// getPayment History 


Report.getPendingTransactionCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let role = clientAndRoleDetails.data[0].role_code;
  if (to_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date'
      }
      result(null, final_res);
      return;
    }
  }
  let qry = `call pGetPendingTransCW(${login_id},'${params.status}','${role}','${from_date}','${to_date}', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

  //--------------------------------
  try {
    resp = await pool.query(qry);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp[0].length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp[0].length,
      data: resp[0]
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

  //----------------------------


};



Report.getSuccessTransactionCW = async (login_id, params, result) => {

  let final_res;
  let resp;
  let stmt;
  let from_date = params.f_date.trim();
  let to_date = params.t_date.trim();
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let role = clientAndRoleDetails.data[0].role_code;
  if (to_date !== "") {
    if (!_utility.validateDate(from_date)) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Please select valid to date'
      }
      result(null, final_res);
      return;
    }
  }
  let qry = `call pGetSuccessTransCW(${login_id},'${role}','${from_date}','${to_date}', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

  //--------------------------------
  try {
    resp = await pool.query(qry);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp[0].length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp[0].length,
      data: resp[0]
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

  //----------------------------
};

Report.otpLogsBLE = async (login_id, result) => {

  let final_res;
  let resp;
  let stmt;
  // let from_date = params.f_date.trim();
  // let to_date = params.t_date.trim();
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let role = clientAndRoleDetails.data[0].role_code;
  // if (to_date !== "") {
  //   if (!_utility.validateDate(from_date)) {
  //     final_res = {
  //       status: false,
  //       err_code: `ERROR : 1`,
  //       message: 'Please select valid to date'
  //     }
  //     result(null, final_res);
  //     return;
  //   }
  // }
  let qry = `
  select oa.id as otp_id , user_id ,CONCAT(umn.f_name , " ", umn.l_name ) as username,umn.mobile,
   otp_purpose, oa.otp, oa.validity,
   is_used , oa.status as otp_status, oa.created_date as otp_created_date
  from otp_authentication oa 
  inner join user_mst_new umn on oa.user_id = umn.id and umn.ble_user_id is not null 
  order by  oa.created_date desc;`

  //--------------------------------
  try {
    debugger;
    resp = await pool.query(qry);

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

  //----------------------------


};

Report.successfulTransactionsBLE = async (data ,result) => {
  debugger;
var datetime= new Date();
let resp;
let final_res;
let whereClause='';

 whereClause =` where ual.created_date between '${data.start_date}' and '${data.end_date}' `;

let stmt=`SELECT  um.username,um.email,um.mobile,ual.user_id ,ual.start_date,ual.end_date,ual.amount_paid,
ual.charger_id  AS 'serial_no' ,ual.transaction_status,ual.invoice_path,wm.charger_model_name,wm.NAME,wm.plan_validity
FROM user_acitivity_log ual INNER JOIN 
user_mst_new um ON ual.user_id= um.id INNER JOIN 
warranty_master wm ON ual.activity_id = wm.id
 ${whereClause} and ual.transaction_status = 'TXN_SUCCESS';`;
  try {
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
}

  Report.chargerPendingForRenewalBLE = async (result) => {

    var datetime = new Date();
    let resp;
    let final_res;
    let stmt=`SELECT  um.username,um.email,um.mobile,ual.user_id ,ual.start_date,ual.end_date,
    ual.amount_paid,ual.charger_id  AS 'serial_no' ,ual.transaction_status,ual.invoice_path,
    wm.charger_model_name,wm.NAME,wm.plan_validity,
    DATE_SUB(end_date, INTERVAL wm.grace_period DAY) postgrace 
    FROM user_acitivity_log ual INNER JOIN 
    user_mst_new um ON ual.user_id= um.id INNER JOIN 
    warranty_master wm ON ual.activity_id = wm.id
    WHERE ual.transaction_status = 'TXN_SUCCESS'
    AND ual.end_date >= DATE_SUB(end_date, INTERVAL wm.grace_period DAY)
    GROUP BY user_id,charger_id;`;
      try {
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
    }
  


module.exports = {
  Report: Report
};