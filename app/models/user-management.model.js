const { sql, pool, poolMG } = require("./db.js");
const _utility = require("../utility/_utility");
const myModule = require("../models/vehicle.model.js");
const fs = require("fs");
const fsPromises = require('fs').promises;
const pathconfig = require('../utility/environment');
const { NotificationEventCode } = require("../config/path-config.js");
// const NotificationEventCode = _config.NotificationEventCode;


const VehicleView = myModule.VehicleView;

const User = function (user) {
  this.id = user.id;
  this.code = user.code;
  this.role_id = user.role_id,
    this.role_code = user.role_code,
    this.cpo_id = user.cpo_id;
  this.user_id = user.user_id;
  this.default_role = user.default_role;
  this.username = user.username;
  this.password = user.password;
  this.f_Name = user.f_Name;
  this.m_Name = user.m_Name;
  this.l_Name = user.l_Name;
  this.dob = user.dob;
  this.mobile = user.mobile;
  this.alt_mobile = user.alt_mobile;
  this.email = user.email;
  this.address1 = user.address1;
  this.address2 = user.address2;
  this.PIN = user.PIN;
  this.landmark = user.landmark;
  this.city_id = user.city_id;
  this.state_id = user.state_id;
  this.country_id = user.country_id;
  this.PAN = user.PAN;
  this.aadhar = user.aadhar;
  this.device_id = user.device_id;
  this.app_version = user.app_version;
  this.os_version = user.os_version;
  this.is_favourite = user.is_favourite;
  this.station_id = user.station_id;
  this.user_type = user.user_type;
  this.client_id = user.client_id;
  this.station_id = user.station_id;
  this.can_expire = user.can_expire;
  this.hint_question = user.hint_question;
  this.hint_answer = user.hint_answer;
  this.last_pass_change = user.last_pass_change;
  this.last_login_date = user.last_login_date;
  this.employee_code = user.employee_code;
  this.is_verified = user.is_verified;
  this.otp = user.otp;
  this.registration_origin = user.registration_origin;
  this.alexa_enabled = user.alexa_enabled;
  this.roles = user.roles;
  this.key = user.key;
  this.status = user.status;
  this.created_date = user.created_date;
  this.created_by = user.created_by;
  this.modify_date = user.modify_date;
  this.modify_by = user.modify_by;
};

const UserStation = function (userStation) {
  this.id = userStation.id;
  this.user_id = userStation.user_id;
  this.station_id = userStation.station_id;
  this.default_station = userStation.default_station;
  this.station_data = userStation.station_data;
  this.status = userStation.status;
  this.created_date = userStation.created_date;
  this.createdby = userStation.createdby;
  this.modify_date = userStation.modify_date;
  this.modifyby = userStation.modifyby;
};

const UserMenu = function (userMenu) {
  this.id = userMenu.id,
    this.client_id = userMenu.client_id,
    this.role_id = userMenu.role_id,
    this.menu_id = userMenu.menu_id,
    this.title = userMenu.title,
    this.display_order = userMenu.display_order,
    this.menus = userMenu.menus,
    this.status = userMenu.status,
    this.created_date = userMenu.created_date,
    this.created_by = userMenu.created_by,
    this.modify_date = userMenu.modify_date,
    this.modify_by = userMenu.modify_by
};

const UserCharging = function (userCharging) {
  this.id=userCharging.id,
  this.client_dev_no=userCharging.client_dev_no,
  this.request_id=userCharging.request_id,
  this.user_id = userCharging.user_id,
    this.charger_id = userCharging.charger_id,
    this.serial_no = userCharging.serial_no,
    this.nick_name = userCharging.nick_name,
    this.client_certificate = userCharging.client_certificate,
    this.action = userCharging.action,
    this.address1 = userCharging.address1;
  this.address2 = userCharging.address2;
  this.PIN = userCharging.PIN;
  this.landmark = userCharging.landmark;
  this.city_id = userCharging.city_id;
  this.state_id = userCharging.state_id;
  this.country_id = userCharging.country_id;
  this.lat = userCharging.lat;
  this.lng = userCharging.lng;
  this.status = userCharging.status;
  this.created_date = userCharging.created_date;
  this.createdby = userCharging.createdby;
  this.modify_date = userCharging.modify_date;
  this.modifyby = userCharging.modifyby;
  this.image1 = userCharging.image1;
  this.image2 = userCharging.image2;
  this.image3 = userCharging.image3;
  this.request_type = userCharging.request_type;
  this.mobile = userCharging.mobile;
  this.map_as_child = userCharging.map_as_child;
  this.updated_at = userCharging.updated_at;
}

const BLE_Session = function (ble_session) {
  this.id = ble_session.id,
  this.user_id = ble_session.user_id,
  this.charger_serial_no = ble_session.charger_serial_no,
  this.vehicle_id = ble_session.vehicle_id,
  this.start_time = ble_session.start_time,
  this.stop_time = ble_session.stop_time,
  this.session_kwh = ble_session.session_kwh,
  this.status = ble_session.status,
  this.created_date = ble_session.created_date,
  this.created_by = ble_session.created_by,
  this.modify_date = ble_session.modify_date,
  this.modify_by = ble_session.modify_by,
  this.session_history = ble_session.session_history
};


User.create = async (newUser, result) => {
  //;
  debugger;
  var datetime = new Date();
  let final_res;
  let resp;
  let resp1;
  let resp3;
  let resp4;
  // let values = [];
  let stmt3 = ``;
  let stmt = `INSERT INTO user_mst_new
  (cpo_id,username,password,f_Name,m_Name,l_Name,dob,mobile,alt_mobile,email,
  address1,address2,PIN,landmark,city_id,state_id,country_id,PAN,aadhar,
  user_type,client_id,can_expire,employee_code,is_verified,registration_origin,status,
  created_date,createdby)
  VALUES
  (${newUser.cpo_id},'${newUser.username}','${newUser.password}','${newUser.f_Name}','${newUser.m_Name}','${newUser.l_Name}',
  '${newUser.dob}','${newUser.mobile}','${newUser.alt_mobile}','${newUser.email}','${newUser.address1}','${newUser.address2}',${newUser.PIN},
  '${newUser.landmark}',${newUser.city_id},${newUser.state_id},${newUser.country_id},'${newUser.PAN}',
   '${newUser.aadhar}','${newUser.user_type}',${newUser.client_id},'${newUser.can_expire}',
   '${newUser.employee_code}','Y','${newUser.registration_origin}','${newUser.status}',?,${newUser.created_by})`;

  let stmt2 = `INSERT INTO user_role_mapping
  (user_id,role_id,default_role,status,created_date,createdby)
  VALUES (?,${newUser.role_id},'Y','Y',?,${newUser.created_by});`;

  stmt3 = `INSERT INTO user_station_mapping
  (user_id,station_id,default_station,status,created_date,createdby)
  VALUES (?,${newUser.station_id},'Y','Y',?,${newUser.created_by});`;

  try {
  //;
    resp = await pool.query(stmt, [datetime]);
    resp1 = await pool.query(stmt2, [resp.insertId, datetime]);

    if (newUser.station_id > 0) {

      resp3 = await pool.query(stmt3, [resp.insertId, datetime]);
    }
     
    resp4 = await mapUserIdTag(resp.insertId,newUser.created_by);

    final_res = {
      status: resp.insertId > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: resp.insertId },resp4]
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

User.update = async (newUserdtl, result) => {
  var datetime = new Date();
  let resp1;
  let resp;
  let stmt3 = ``;
  let stmt4 = ``;
  let stmt5 = ``;
  let stmt6 = ``;
  let stmt7 = ``;
  let resp3;
  let resp4;
  let resp5;
  let resp6;
  let resp7;


  stmt = `update user_mst_new set username = '${newUserdtl.username}',
      cpo_id = '${newUserdtl.cpo_id}', f_name = '${newUserdtl.f_Name}',l_Name = '${newUserdtl.l_Name}',dob = '${newUserdtl.dob}',
      mobile = '${newUserdtl.mobile}',alt_mobile = '${newUserdtl.alt_mobile}', user_type = '${newUserdtl.user_type}',
      email = '${newUserdtl.email}',client_id = '${newUserdtl.client_id}',
      PAN = '${newUserdtl.PAN}',aadhar ='${newUserdtl.aadhar}',
      address1='${newUserdtl.address1}'  ,address2 ='${newUserdtl.address2}' ,PIN =${newUserdtl.PIN} ,
      landmark ='${newUserdtl.landmark}' ,city_id=${newUserdtl.city_id} ,state_id=${newUserdtl.state_id} ,
      country_id=${newUserdtl.country_id} ,	   
      modifyby = ${newUserdtl.modify_by},modify_date = ? ,status='${newUserdtl.status}' 
      where id =  ${newUserdtl.id}`;

  let stmt2 = `UPDATE user_role_mapping SET
      user_id =? ,role_id =${newUserdtl.role_id},status ='${newUserdtl.status}' ,modify_date = ?, modifyby =${newUserdtl.modify_by}
      WHERE user_id =${newUserdtl.id} `;


  stmt6 = `select id from user_station_mapping 
      where user_id = ${newUserdtl.id} and default_station = 'Y'`;

  //when user role changes from (SA,ADMIN,CPO) to (SC,SO)
  stmt3 = `INSERT INTO user_station_mapping
      (user_id,station_id,default_station,status,created_date,createdby)
      VALUES (?,${newUserdtl.station_id},'Y','Y',?,${newUserdtl.created_by});`;

  // //when user role changes from (SC,SO) to (SA,ADMIN,CPO)
  stmt4 = `update user_station_mapping set 
      status = 'D',modify_date = ?, modifyby = ${newUserdtl.modify_by}  
      where user_id = ${newUserdtl.id}`;

  // //when station assigned to user changes
  // stmt5 = `update user_station_mapping set 
  // default_station = 'N',modify_date = ?, modifyby =${newUserdtl.modify_by}  
  // where user_id = ${newUserdtl.id}`;

  //;
  try {

    resp = await pool.query(stmt, [datetime]);
    resp1 = await pool.query(stmt2, [newUserdtl.id, datetime]);
    resp6 = await pool.query(stmt, [datetime]);

    if (newUserdtl.station_id > 0) {

      //station_id >0 means its an SC or SO type user
      if (resp6.length > 0) {

        stmt5 = `update user_station_mapping set 
          station_id = ${newUserdtl.station_id} where id = ${resp6.id}`;

        resp5 = await pool.query(stmt5);

      } else {

        resp3 = await pool.query(stmt3, [resp.insertId, datetime]);

      }
    } else {

      //station_id <=0 means its an SA or CPO or ADMIN type user 

      if (resp6.length > 0) {
        resp4 = await pool.query(stmt4);
      }
    }

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newUserdtl.id }]
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


User.updateAlexaEnabled = async (newUserdtl, result) => {
  var datetime = new Date();
  let resp1;
  let resp;

  stmt = `update user_mst_new set alexa_enabled = ${newUserdtl.alexa_enabled},
    modifyby = ${newUserdtl.modify_by},modify_date = ? 
    where id =  ${newUserdtl.id}`;
  try {
    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newUserdtl.id }]
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

User.getUsersCW = async (user_id, result) => {

  let final_res;
  let resp;
  let stmt = '';
  
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;


  if (isSA) {
    stmt = `select umn.id,umn.cpo_id,urm.role_id,rm.name as role_name,cm.name as cpo_name,
    usm.station_id as station_id,csm.name as station_name,umn.client_id,cmm.name as client_name,
    umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    umn.employee_code,umn.registration_origin,umn.PAN,umn.aadhar,umn.address1  ,umn.address2  ,
    umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
    umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
    from user_mst_new  umn  
    inner join client_mst cmm on umn.client_id=cmm.id
    inner join user_role_mapping urm on umn.id=urm.user_id and urm.default_role='Y'
    inner join role_mst rm on urm.role_id=rm.id
    left join cpo_mst cm  on umn.cpo_id = cm.id 
    left join user_station_mapping usm on umn.id=usm.user_id and usm.status='Y'
    left join charging_station_mst csm on usm.station_id=csm.id
    where umn.status<>'D' order by umn.id desc;`;
  } else {
    stmt = `select umn.id,umn.cpo_id,urm.role_id,rm.name as role_name,cm.name as cpo_name,
    usm.station_id as station_id,csm.name as station_name,umn.client_id,cmm.name as client_name,
    umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    umn.employee_code,umn.registration_origin,umn.PAN,umn.aadhar,umn.address1  ,umn.address2  ,
    umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
    umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
    from user_mst_new  umn  
    inner join client_mst cmm on umn.client_id=cmm.id
    inner join user_role_mapping urm on umn.id=urm.user_id and urm.default_role='Y'
    inner join role_mst rm on urm.role_id=rm.id
    left join cpo_mst cm  on umn.cpo_id = cm.id 
    left join user_station_mapping usm on umn.id=usm.user_id and usm.status='Y'
    left join charging_station_mst csm on usm.station_id=csm.id
    where umn.status<>'D' and umn.client_id=${client_id} order by umn.id desc;`;

  }
  //03 01 2022 : Updated quesry to get station also
  // if (isSA) {
  //   stmt = `select umn.id,umn.cpo_id,urm.role_id,rm.name as role_name,cm.name as cpo_name,umn.client_id,cmm.name as client_name,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
  //    umn.employee_code,umn.registration_origin,
  //    umn.PAN,umn.aadhar,
  //    umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
  //    umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
  //    from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id 
  //    inner join client_mst cmm on umn.client_id=cmm.id
  //    left join user_role_mapping urm on umn.id=urm.user_id and urm.default_role='Y'
  //     left join role_mst rm on urm.role_id=rm.id
  //    where 
  //    umn.status= 'Y' 
  //    order by umn.id desc`;
  // } else {
  //   stmt = `select umn.id,umn.cpo_id,urm.role_id,rm.name as role_name,cm.name as cpo_name,cmm.name as client_name,umn.client_id,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
  //    umn.employee_code,umn.registration_origin,
  //     umn.PAN,umn.aadhar,
  //     umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
  //     umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
  //     from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id 
  //     inner join client_mst cmm on umn.client_id=cmm.id
  //      inner join user_role_mapping urm on umn.id=urm.user_id and urm.default_role='Y'
  //       inner join role_mst rm on urm.role_id=rm.id
  //     where    
  //     umn.status <> 'D' and umn.client_id =${client_id}
  //     order by umn.id desc`;

  // }

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

};

User.getActiveUsersCW = async (user_id, result) => {

  let final_res;
  let resp;
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);

  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select umn.id,umn.cpo_id,cm.name as cpo_name,umn.client_id,cmm.name as client_name,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    umn.employee_code,umn.registration_origin,
    umn.PAN,umn.aadhar,
    umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
    umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
    from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id inner join client_mst cmm on umn.client_id=cmm.id
    where 
    umn.status= 'Y' 
    order by umn.id desc`;
    //  stmt = `select umn.id,umn.cpo_id,cm.name as cpo_name,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    //   umn.employee_code,umn.registration_origin,
    //   umn.PAN,umn.aadhar,
    //   umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
    //   umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
    //   from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id
    //   where 
    //   umn.status= 'Y' 
    //   order by umn.id desc`;
  } else {
    stmt = `select umn.id,umn.cpo_id,umn.client_id,cmm.name as client_name,cm.name as cpo_name,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    umn.employee_code,umn.registration_origin,
     umn.PAN,umn.aadhar,
     umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
     umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
     from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id inner join client_mst cmm on umn.client_id=cmm.id
     where 
     umn.status='Y' and umn.client_id =${client_id}
     order by umn.id desc`;
    //  stmt = `select umn.id,umn.cpo_id,cm.name as cpo_name,umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    //  umn.employee_code,umn.registration_origin,
    //   umn.PAN,umn.aadhar,
    //   umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
    //   umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
    //   from user_mst_new  umn  inner join cpo_mst cm  on umn.cpo_id = cm.id
    //   where 
    //   umn.status='Y' and umn.client_id = ${client_id}
    //   order by umn.id desc`;

  }

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
    ;
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

User.getActiveUsersByClient = async (client_id, result) => {

  let final_res;
  let resp;
  let stmt = '';

  stmt = `select umn.id,umn.cpo_id,umn.client_id,cmm.name as client_name,cm.name as cpo_name,
    umn.username,umn.f_name,umn.m_name,umn.l_name,umn.dob,umn.mobile,umn.alt_mobile,umn.email,
    umn.employee_code,umn.registration_origin,umn.PAN,umn.aadhar,umn.address1  ,umn.address2  ,umn.PIN  ,umn.landmark  ,umn.city_id ,umn.state_id ,umn.country_id ,
     umn.status,umn.created_date,umn.createdby,umn.modifyby,umn.modify_date
     from user_mst_new  umn  
     inner join client_mst cmm on umn.client_id=cmm.id
     left join cpo_mst cm  on umn.cpo_id = cm.id 
     where  umn.status='Y' and umn.client_id =${client_id}
     order by umn.id desc`;


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

};

User.getUserById = (id, result) => {
  let stmt = `SELECT umn.cpo_id,umn.id,cm.name as client_name,umn.client_id,umn.code,umn.username,umn.password,
  umn.f_Name,umn.m_Name,umn.l_Name,umn.dob,umn.mobile,umn.alt_mobile,
  umn.email,umn.address1,umn.address2,umn.PIN,umn.landmark,umn.city_id,umn.state_id,umn.country_id,
  umn.PAN,umn.aadhar,umn.device_id,umn.app_version,umn.os_version,umn.user_type,umn.client_id,
  umn.can_expire,umn.hint_question,umn.hint_answer,umn.last_pass_change,umn.last_login_date,
  umn.employee_code,umn.is_verified,umn.otp, umn.registration_origin,umn.status,
  umn.created_date,umn.createdby,umn.modify_date,umn.modifyby
  FROM user_mst_new umn left join client_mst cm on umn.client_id=cm.id where  umn.id= ? and  umn.status <> 'D';`;

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


User.getUserByMobile = async (mobile, result) => {

  let final_res;
  let resp;

  let stmt = `SELECT umn.cpo_id,umn.id,cm.name as client_name,umn.client_id,umn.code,umn.username,umn.password,
  umn.f_Name,umn.m_Name,umn.l_Name,umn.dob,umn.mobile,umn.alt_mobile,
  umn.email,umn.address1,umn.address2,umn.PIN,umn.landmark,umn.city_id,umn.state_id,umn.country_id,
  umn.PAN,umn.aadhar,umn.device_id,umn.app_version,umn.os_version,umn.user_type,umn.client_id,
  umn.can_expire,umn.hint_question,umn.hint_answer,umn.last_pass_change,umn.last_login_date,
  umn.employee_code,umn.is_verified,umn.otp, umn.registration_origin
  FROM user_mst_new umn left join client_mst cm on umn.client_id=cm.id 
  where  umn.mobile= ? and  umn.status = 'Y';`;

  try {
    resp = await pool.query(stmt, [mobile]);


    if (resp.length > 0) {

      let vehicleResult = await VehicleView.getVehiclesByUserId(resp[0].id);

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: {
          user_detail: resp,
          vehicles: vehicleResult
        }
      }
    } else {
      //no station found
      final_res = {
        status: false,
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
};

User.userChargingHistory = async (id, result) => {
  let whereClause = ``;
  if (id > 0) {
    whereClause = ` where ucl.user_id = ${id}  `
  }

  let stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
  ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
  ucl.vehicle_id ,ucl.vehicle_number ,
  ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
  ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
  ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
  ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
  ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
  ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
  ucl.app_version_stop ,ucl.os_version_stop ,
  ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
  from user_charging_log ucl 
  left join user_mst_new um on ucl.user_id = um.id
  left join user_mst_new um2 on ucl.user_id_stop = um2.id
  left join charging_station_mst csm on ucl.station_id = csm.id
  ${whereClause} order by id desc;`;

  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt, [id]);

    final_res = {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      message: `ERROR : ${e.code} `,
      count: 0,
      data: []
    }
  } finally {
    return (final_res);
  }
};

User.getUserChargingHistoryCW = async (login_id, params, result) => {

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();

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

  let whereClause = "";

  if (from_date !== "" && to_date !== "") {
    if (whereClause != "") {
      whereClause = `${whereClause} and DATE(ucl.created_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = ` where DATE(ucl.created_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause != "") {
      whereClause = `${whereClause} and DATE(ucl.created_date) = '${from_date}'  `;
    } else {
      whereClause = ` where DATE(ucl.created_date) = '${from_date}'  `;
    }
  }

  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
      ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
      ucl.vehicle_id ,ucl.vehicle_number ,
      ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
      ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
      ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
      ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
      ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
      ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
      ucl.app_version_stop ,ucl.os_version_stop ,
      ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
      from user_charging_log ucl 
      left join user_mst_new um on ucl.user_id = um.id
      left join user_mst_new um2 on ucl.user_id_stop = um2.id
      left join charging_station_mst csm on ucl.station_id = csm.id
      ${whereClause}
      order by id desc;`;
  } else {
    stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
    ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
    ucl.vehicle_id ,ucl.vehicle_number ,
    ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
    ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
    ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
    ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
    ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
    ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
    ucl.app_version_stop ,ucl.os_version_stop ,
    ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
    from user_charging_log ucl 
    inner join charger_serial_mst chsm on ucl.charger_display_id = chsm.name and chsm.status <>'D'
    inner join client_charger_mapping ccm on chsm.id = ccm.charger_id and ccm.client_id = ${client_id} and ccm.status <> 'D'
    left join user_mst_new um on ucl.user_id = um.id
    left join user_mst_new um2 on ucl.user_id_stop = um2.id
    left join charging_station_mst csm on ucl.station_id = csm.id
    ${whereClause}
     order by id desc;`;
  }



  // stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
  // ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
  // ucl.vehicle_id ,ucl.vehicle_number ,
  // ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
  // ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
  // ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
  // ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
  // ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
  // ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
  // ucl.app_version_stop ,ucl.os_version_stop ,
  // ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
  // from user_charging_log ucl 
  // left join user_mst_new um on ucl.user_id = um.id
  // left join user_mst_new um2 on ucl.user_id_stop = um2.id
  // left join charging_station_mst csm on ucl.station_id = csm.id
  // ${whereClause} order by id desc;`;

  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt);

    final_res = {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      code: `${!!e.code ? e.code : e.message} `,
      message: `ERROR : ${e.message} `,
      count: 0,
      data: []
    }
  } finally {
    return (final_res);
  }
};



User.getChargingHistoryCW = async (login_id, params, result) => {

  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  let charger_display_id = !!params.charger_display_id ? params.charger_display_id.trim() : '';
  let connector_no = !!params.connector_no ? params.connector_no : 0;
  let station_id = !!params.station_id ? params.station_id : 0;
  let get_status = params.status;

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

  let whereClause = "";

  if (from_date !== "" && to_date !== "") {
    if (whereClause != "") {
      whereClause = `${whereClause} and DATE(ucl.created_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = ` where DATE(ucl.created_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause != "") {
      whereClause = `${whereClause} and DATE(ucl.created_date) = '${from_date}'  `;
    } else {
      whereClause = ` where DATE(ucl.created_date) = '${from_date}'  `;
    }
  }

  if (get_status == 'COMPLETED') {
    if (whereClause != "") {
      whereClause = `${whereClause} and charging_status = 'C'  `;
    } else {
      whereClause = ` where charging_status = 'C' `;
    }
  } else if (get_status == 'ACTIVE') {
    if (whereClause != "") {
      whereClause = `${whereClause} and charging_status = 'A'  `;
    } else {
      whereClause = ` where charging_status = 'A' `;
    }
  }

  if (charger_display_id != '') {
    if (whereClause != "") {
      whereClause = `${whereClause} and charger_display_id = '${charger_display_id}'  `;
    } else {
      whereClause = ` where charger_display_id = '${charger_display_id}' `;
    }
  }

  if (connector_no > 0) {
    if (whereClause != "") {
      whereClause = `${whereClause} and connector_no = ${connector_no}  `;
    } else {
      whereClause = ` where connector_no = ${connector_no}  `;
    }
  }

  if (station_id > 0) {
    if (whereClause != "") {
      whereClause = `${whereClause} and ucl.station_id = ${station_id}  `;
    } else {
      whereClause = ` where ucl.station_id = ${station_id}  `;
    }
  }



  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;


  if (isSA) {
    stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
    ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
    ucl.vehicle_id ,ucl.vehicle_number ,
    ucl.mobile ,ucl.mobile_stop ,ctm.name as charger_model_name, cmm.name as variant_name,ucl.charger_display_id,chsm.serial_no , ucl.connector_no ,
    ucl.id_tag ,ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
    ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
    ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
    ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
    ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
    ucl.app_version_stop ,ucl.os_version_stop ,
    ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
    from user_charging_log ucl 
    inner join charger_serial_mst chsm  on ucl.charger_display_id = chsm.name 
    inner join charging_model_mst cmm on chsm.model_id = cmm.id
    inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id
    left join user_mst_new um on ucl.user_id = um.id
    left join user_mst_new um2 on ucl.user_id_stop = um2.id
    left join charging_station_mst csm on ucl.station_id = csm.id
    ${whereClause}
    order by id desc;`;
    // stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
    //   ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
    //   ucl.vehicle_id ,ucl.vehicle_number ,
    //   ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
    //   ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
    //   ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
    //   ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
    //   ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
    //   ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
    //   ucl.app_version_stop ,ucl.os_version_stop ,
    //   ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
    //   from user_charging_log ucl 
    //   left join user_mst_new um on ucl.user_id = um.id
    //   left join user_mst_new um2 on ucl.user_id_stop = um2.id
    //   left join charging_station_mst csm on ucl.station_id = csm.id
    //   ${whereClause}
    //   order by id desc;`;
  } else {
    stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
    ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
    ucl.vehicle_id ,ucl.vehicle_number ,
    ucl.mobile ,ucl.mobile_stop ,
    ctm.name as charger_model_name, cmm.name as variant_name,ucl.charger_display_id,chsm.serial_no ,ucl.connector_no ,ucl.id_tag ,
    ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
    ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
    ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
    ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
    ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
    ucl.app_version_stop ,ucl.os_version_stop ,
    ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
    from user_charging_log ucl 
    inner join charger_serial_mst chsm on ucl.charger_display_id = chsm.name and chsm.status <>'D'
    inner join client_charger_mapping ccm on chsm.id = ccm.charger_id and ccm.client_id = ${client_id} and ccm.status <> 'D'
     inner join charging_model_mst cmm on chsm.model_id = cmm.id
      inner join charger_type_mst ctm on cmm.charger_type_id = ctm.id
    left join user_mst_new um on ucl.user_id = um.id
    left join user_mst_new um2 on ucl.user_id_stop = um2.id
    left join charging_station_mst csm on ucl.station_id = csm.id
    ${whereClause}
     order by id desc;`;
    // stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
    // ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
    // ucl.vehicle_id ,ucl.vehicle_number ,
    // ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
    // ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
    // ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
    // ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
    // ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
    // ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
    // ucl.app_version_stop ,ucl.os_version_stop ,
    // ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
    // from user_charging_log ucl 
    // inner join charger_serial_mst chsm on ucl.charger_display_id = chsm.name and chsm.status <>'D'
    // inner join client_charger_mapping ccm on chsm.id = ccm.charger_id and ccm.client_id = ${client_id} and ccm.status <> 'D'
    // left join user_mst_new um on ucl.user_id = um.id
    // left join user_mst_new um2 on ucl.user_id_stop = um2.id
    // left join charging_station_mst csm on ucl.station_id = csm.id
    // ${whereClause}
    //  order by id desc;`;
  }



  // stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,
  // ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
  // ucl.vehicle_id ,ucl.vehicle_number ,
  // ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
  // ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
  // ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
  // ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
  // ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
  // ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
  // ucl.app_version_stop ,ucl.os_version_stop ,
  // ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby 
  // from user_charging_log ucl 
  // left join user_mst_new um on ucl.user_id = um.id
  // left join user_mst_new um2 on ucl.user_id_stop = um2.id
  // left join charging_station_mst csm on ucl.station_id = csm.id
  // ${whereClause} order by id desc;`;

  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt);

    final_res = {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      code: `${!!e.code ? e.code : e.message} `,
      message: `ERROR : ${e.message} `,
      count: 0,
      data: []
    }
  } finally {
    return (final_res);
  }
};

User.delete = async (id, user_id, result) => {
//;
  var datetime = new Date();
  let resp1;
  let resp

  let stmt = `Update user_mst_new set  modifyby = ${user_id},modify_date = ? , status = 'D' WHERE id = ${id}`;

  let stmt2 = `UPDATE user_role_mapping SET
  status ='D' ,modify_date = ?, modifyby =${user_id}
  WHERE user_id =${id} `;

  try {
    resp = await pool.query(stmt, [datetime]);
    resp1 = await pool.query(stmt2, [datetime]);
    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id }]
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

User.userStationMapping = async (newPrefranc, result) => {

  var datetime = new Date();
  let final_res;
  let resp;
  let resp2;

  let stmt3 = ` select user_id,station_id from user_preference_mst 
    where station_id =${newPrefranc.station_id} and user_id=${newPrefranc.id} and  status='Y'`;

  let stmt = `insert into user_preference_mst (user_id,station_id,is_favourite,status,
    created_date,created_by )
    VALUES ('${newPrefranc.id}','${newPrefranc.station_id}','${newPrefranc.is_favourite}',
    '${newPrefranc.status}',?,${newPrefranc.created_by})`;


  try {
    resp2 = await pool.query(stmt3)
    resp = await pool.query(stmt, [datetime])

    if (resp3.length > 0) {
      final_res = {
        status: false,
        err_code: `ERROR : ${err.code}`,
        message: `ERROR : ${err.message}`,
        data: []
      }
    } else {
      resp = await pool.query(stmt, [newPrefranc.id, newPrefranc.station_id, newPrefranc.status]);

      final_res = {
        status: resp.insertId > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
        count: 1,
        data: [{ id: resp.insertId }]
      }

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


  // try {
  //   
  //   resp = await pool.query(stmt,values);

  //   final_res = {
  //     status: resp.insertId > 0 ? true : false,
  //     err_code: `ERROR : 0`,
  //     message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
  //     count : 1,
  //     data: [{id : resp.insertId}]
  //   }
  // } catch (err) {
  //   
  //   final_res = {
  //     status: false,
  //     err_code: `ERROR : ${err.code}`,
  //     message: `ERROR : ${err.message}`,
  //     count : 0,
  //     data: []
  //   }
  // } finally {
  //   result(null, final_res);
  // }
};

//New
User.userPreferedStationMapping = async (newPrefranc, result) => {

  var datetime = new Date();
  let final_res;
  let resp;
  let resp2;
  let values = [];

  let stmt3 = ` select user_id,station_id from user_preference_mst 
    where station_id =${newPrefranc.station_id} and user_id=${newPrefranc.id} and  status='Y'`;

  let stmt = `insert into user_preference_mst (user_id,station_id,is_favourite,status,
    created_date,created_by )
    VALUES ('${newPrefranc.id}','${newPrefranc.station_id}','${newPrefranc.is_favourite}',
    '${newPrefranc.status}',?,${newPrefranc.created_by})`;

  try {
    resp2 = await pool.query(stmt3)
    //resp = await pool.query(stmt, [datetime])
    //;
    if (resp2.length > 0) {
      final_res = {
        status: false,
        err_code: `ERROR : DUPLICATE`,
        message: `ERROR : Selected station is already mapped to user.`,
        data: []
      }
    } else {
      // resp = await pool.query(stmt, [newPrefranc.id, newPrefranc.station_id, newPrefranc.status]);
      resp = await pool.query(stmt, [datetime]);

      final_res = {
        status: resp.insertId > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
        count: 1,
        data: [{ id: resp.insertId }]
      }

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


  // try {
  //   
  //   resp = await pool.query(stmt,values);

  //   final_res = {
  //     status: resp.insertId > 0 ? true : false,
  //     err_code: `ERROR : 0`,
  //     message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
  //     count : 1,
  //     data: [{id : resp.insertId}]
  //   }
  // } catch (err) {
  //   
  //   final_res = {
  //     status: false,
  //     err_code: `ERROR : ${err.code}`,
  //     message: `ERROR : ${err.message}`,
  //     count : 0,
  //     data: []
  //   }
  // } finally {
  //   result(null, final_res);
  // }
};

User.updateUserStationMapping = async (newUser, result) => {

  var datetime = new Date();

  let stmt = ` update user_preference_mst set 
  is_favourite = ${newUser.is_favourite},    
  status = '${newUser.status}',
  modify_by = ${newUser.modify_by}, modify_date = ?
  where user_id = ${newUser.id} and station_id = ${newUser.station_id}`;

  try {

    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newUser.id }]
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

User.updateUserPreferedStationMapping = async (newUser, result) => {

  var datetime = new Date();

  let stmt = ` update user_preference_mst set 
  is_favourite = ${newUser.is_favourite},    
  status = '${newUser.status}',
  modify_by = ${newUser.modify_by}, modify_date = ?
  where user_id = ${newUser.id} and station_id = ${newUser.station_id}`;

  try {
    //;
    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newUser.id }]
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


User.clientCpoStationDetails = async (login_id, data, result) => {

  var datetime = new Date();
  let stmt = ``;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);

  if (!clientAndRoleDetails.status) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'USER NOT FOUND',
      count: 0,
      data: []
    }

    result(null, final_res);
  } else {

    let client_id = clientAndRoleDetails.data[0].client_id;
    let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
    let role_code = clientAndRoleDetails.data[0].role_code;

    if (role_code == 'SA') {

      // In case of SA not populating list as it will fetch data for all clients,cposand stations
      // this will take more load time

    } else if (role_code == 'ADMIN') {

      stmt = ` select csm.id as station_id , csm.name as station_name,
      cm.id as cpo_id,cm.name as cpo_name,clm.id as client_id, clm.name as client_name 
      from charging_station_mst csm 
      inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y'  and cm.client_id = ${client_id}
      inner join client_mst clm on cm.client_id = clm.id and clm.status='Y'
      where csm.status = 'Y' ; `;

    } else if (role_code == 'CPO') {

      stmt = ` select csm.id as station_id , csm.name as station_name,cm.id as cpo_id,
    cm.name as cpo_name,clm.id as client_id, clm.name as client_name 
    from charging_station_mst csm 
    inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' and cm.id = ${data.cpo_id}
    inner join client_mst clm on cm.client_id = clm.id and clm.status='Y'
    where csm.status = 'Y' ;`;

    } else if (role_code == 'SC' || role_code == 'SO') {

      stmt = ` select csm.id as station_id , csm.name as station_name,cm.id as cpo_id,
    cm.name as cpo_name,clm.id as client_id, clm.name as client_name 
    from user_station_mapping usm 
    inner join charging_station_mst csm on usm.station_id = csm.id and csm.status = 'Y'
    inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' 
    inner join client_mst clm on cm.client_id = clm.id and clm.status='Y'
    where usm.user_id = ${login_id} and usm.status='Y' ; `;

    }

    try {

      if (role_code != 'SA') {
        resp = await pool.query(stmt);

        final_res = {
          status: resp.length > 0 ? true : false,
          err_code: `ERROR : 0`,
          message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
          count: resp.length,
          data: resp
        }
      } else {
        final_res = {
          status: false,
          err_code: `ERROR : 2`,
          message: 'Not applicable for SA role ',
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
  }
};

User.cpoStationDetailsByClientId = async (login_id, client_id, data, result) => {

  let stmt = ``;
  let resp;
  let final_res;
  let stations = [];
  let cpos = [];
  let item;
  let check = false;
//;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);

  if (!clientAndRoleDetails.status) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'USER NOT FOUND',
      count: 0,
      data: []
    }

    result(null, final_res);

  } else {

    // let client_id = clientAndRoleDetails.data[0].client_id;
    // let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;
    let role_code = clientAndRoleDetails.data[0].role_code;

    if (role_code == 'SA') {

      stmt = ` select csm.id as station_id , csm.name as station_name, cm.id as cpo_id,cm.name as cpo_name
      from charging_station_mst csm 
      inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' and cm.client_id = ${client_id}
      where csm.status = 'Y' ; `;

    } else if (role_code == 'ADMIN') {

      stmt = ` select csm.id as station_id , csm.name as station_name, cm.id as cpo_id,cm.name as cpo_name
      from charging_station_mst csm 
      inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' and cm.client_id = ${client_id}
      where csm.status = 'Y' ;  `;

    } else if (role_code == 'CPO') {

      stmt = ` select csm.id as station_id , csm.name as station_name,cm.id as cpo_id,cm.name as cpo_name
        from charging_station_mst csm 
        inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' and cm.id = ${data.cpo_id}
        where csm.status = 'Y' ;`;

    } else if (role_code == 'SC' || role_code == 'SO') {

      stmt = ` select csm.id as station_id , csm.name as station_name,cm.id as cpo_id,cm.name as cpo_name 
        from user_station_mapping usm 
        inner join charging_station_mst csm on usm.station_id = csm.id and csm.status = 'Y'
        inner join cpo_mst cm on csm.cpo_id = cm.id and cm.status='Y' 
        where usm.user_id = ${login_id} and usm.status='Y' ; `;

    }

    try {

      if (role_code == 'CPO' && !data.cpo_id) {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'Please provide cpo_id in params',
          count: 0,
          data: []
        }
      } else {
        resp = await pool.query(stmt);

        if (resp.length > 0) {

          if (role_code == 'SA' || role_code == 'ADMIN'){
            //Adding "ALL" option in CPO dropdown
            cpos.push({
              cpo_id: -1,
              cpo_name: 'ALL'
            });
          }

          resp.forEach(e => {
            item = {
              cpo_id: e.cpo_id,
              cpo_name: e.cpo_name
            }

            check = false;
            cpos.forEach(e2 => {
              //;
              if (e2.cpo_id == item.cpo_id) {
                check = true;
              }
            });

            if (!check) {
              cpos.push(item)
            }
          });

          stations = resp;
          if (role_code == 'SA' || role_code == 'ADMIN' || role_code == 'CPO'){
            //Adding "ALL" option in Station dropdown
            stations.unshift({
              station_id: -1,
              station_name: 'ALL'
            });
          }

          final_res = {
            status: true,
            err_code: `ERROR : 0`,
            message: 'SUCCESS',
            count: {
              stationsCount: stations.length>1 ? stations.length-1 : stations.length,
              cposCount: cpos.length>1 ? cpos.length-1 :cpos.length
            },
            data: {
              stations: stations,
              cpos: cpos
            }
          }
        } else {
          final_res = {
            status: false,
            err_code: `ERROR : 1`,
            message: 'DATA NOT FOUND',
            count: 0,
            data: []
          }
        }
      }
    } catch (err) {
      //;
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
};


User.getRoleListWithRolesAssignedToUserCW = async (client_id, user_id, project_id, result) => {

  let final_res;
  let resp;
  let stmt;
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;

  // if (role_code == 'SA') {
  //   stmt = `selecT rm.id,rm.code as role_code,rm.name as role_name,rm.client_id,
  //   urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
  //   urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
  //   from role_mst rm 
  //   left join user_role_mapping urm on  rm.id=urm.role_id and urm.user_id=${user_id} and urm.status='Y'
  //   where rm.status='Y' and rm.project_id=${project_id};`;

  // } else {

  stmt = `select rm.id,rm.code as role_code,rm.name as role_name,rm.client_id,
    urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
    urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
    from role_mst rm 
    left join user_role_mapping urm on  rm.id=urm.role_id and urm.user_id=${user_id} and urm.status='Y'
    where rm.status='Y' and rm.client_id=${client_id} and rm.project_id=${project_id};`;

  // }

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


};

User.getUserRoleMappingCW = async (login_id, project_id, result) => {
debugger;
  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {
    // stmt = `select rm.id,rm.code as role_code,rm.name as role_name,rm.client_id,
    // urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
    // urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
    // from user_role_mapping urm 
    // inner join role_mst rm on urm.role_id=rm.id and rm.status='Y' and rm.project_id=${project_id}
    // inner join user_mst_new umn on urm.user_id=umn.id and umn.status='Y'  
    // where urm.status='Y' order by urm.id ;`;
    stmt = `select umn.f_name,umn.l_name, umn.username, rm.id as role_id,rm.code as role_code,rm.name as role_name,rm.client_id,
    cm.name as client_name,urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
    urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
    from user_role_mapping urm 
    inner join role_mst rm on urm.role_id=rm.id and rm.status='Y' and rm.project_id=${project_id}
    inner join user_mst_new umn on urm.user_id=umn.id and umn.status='Y' 
    inner join client_mst cm on umn.client_id = cm.id and cm.status='Y'
    where urm.status='Y' order by urm.id ;`;

  } else {

    stmt = `select umn.f_name,umn.l_name, umn.username, rm.id as role_id,rm.code as role_code,rm.name as role_name,rm.client_id,
    cm.name as client_name,urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
    urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
    from user_role_mapping urm 
    inner join role_mst rm on urm.role_id=rm.id and rm.status='Y' and rm.project_id=${project_id}
    inner join user_mst_new umn on urm.user_id=umn.id and umn.status='Y' and  umn.client_id=${client_id}
    inner join client_mst cm on umn.client_id = cm.id and cm.status='Y'
    where urm.status='Y' order by urm.id ;`;
    // stmt = `select rm.id,rm.code as role_code,rm.name as role_name,rm.client_id,
    // urm.id as map_id, urm.default_role,urm.user_id,urm.status as map_status,
    // urm.created_date,urm.createdby,urm.modify_date,urm.modifyby
    // from role_mst rm 
    // left join user_role_mapping urm on  rm.id=urm.role_id and urm.user_id=${user_id} and urm.status='Y'
    // where rm.status='Y' and rm.client_id=${client_id} and rm.project_id=${project_id};`;

  }

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


};


User.updateUserRoleMapping = async (newUser, result) => {
debugger;
  var datetime = new Date();

  let stmt = `update user_role_mapping set 
  role_id =${newUser.role_id},status = '${newUser.status}',default_role='${newUser.default_role}',   
  modifyby = ${newUser.modify_by}, modify_date = ?
  where id=${newUser.id} and user_id =${newUser.user_id} and status='Y'`;


  try {

    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newUser.id }]
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

User.userRoleMapping = async (newRole, result) => {
  var datetime = new Date();
  let final_res;
  let resp2;
  let resp3;
  let values = [];
  let roles_mapped = [];
  let roles_not_mapped = [];

  let stmt1 = `update user_role_mapping set 
  status = 'N',  modifyby = ? , modify_date = ?
  where  user_id =${newRole.user_id} and status='Y'`;

  let stmt2 = `select id,default_role from user_role_mapping 
  where user_id =${newRole.user_id} and role_id= ? `;

  let stmt3 = `insert into user_role_mapping (user_id,role_id,default_role,status,created_date,createdby)
  VALUES ? `;
  // status is static .
  let stmt4 = `update user_role_mapping set default_role=? ,
  status = 'Y',  modifyby = ?, modify_date = ?
  where  id = ? `;

  try {
    resp1 = await pool.query(stmt1, [newRole.created_by, datetime]);

    for (let index = 0; index < newRole.roles.length; index++) {

      resp2 = await pool.query(stmt2, [newRole.roles[index].role_id])

      if (resp2.length > 0) {
        if (resp2[0].default_role == newRole.roles[index].default_role) {
          resp3 = await pool.query(stmt4, [newRole.roles[index].default_role, newRole.roles[index].modify_by, new Date(newRole.roles[index].modify_date), resp2[0].id])
        } else {
          resp3 = await pool.query(stmt4, [newRole.roles[index].default_role, newRole.created_by, datetime, resp2[0].id])
        }
      } else {
        values.push([newRole.user_id, newRole.roles[index].role_id, newRole.roles[index].default_role, newRole.status, datetime, newRole.created_by])

        roles_mapped.push({
          role_id: newRole.roles[index].role_id,
          remarks: 'SUCCESS'
        })

      }
    }

    if (values.length > 0) {
      resp4 = await pool.query(stmt3, [values]);
    } else {
    }

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: 'SUCCESS',
      data: [{
        roles_not_mapped: roles_not_mapped,
        roles_mapped: roles_mapped
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

User.deleteUserRoleMapping = async (id, user_id, result) => {

  var datetime = new Date();
  let resp1;
  let resp

  let stmt = `Update user_role_mapping set  modifyby = ${user_id},modify_date = ? , status = 'D' WHERE id =${id};`;

  let stmt2 = `select id,role_id,default_role from user_role_mapping where user_id=${user_id} and status='Y'`;

  try {
    resp1 = await pool.query(stmt2);

    if (resp1.length == 1) {
      resp = await pool.query(stmt, [datetime]);

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: 0,
        data: []
      }
    } else {

      const resp2 = resp1.filter(role => role.id == id);

      if (resp2[0].default_role == 'Y') {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'Please select another role as default before deleting this role',
          count: 0,
          data: []
        }
      } else {
        resp = await pool.query(stmt, [datetime]);

        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: 0,
          data: []
        }
      }
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: [],
    }
  } finally {
    result(null, final_res);
  }

};

UserStation.UserStationMappingV1 = async (data, result) => {

  var datetime = new Date();
  let final_res;
  let resp;
  let station_mapped = [];
  let station_not_mapped = [];
  let values = [];

  let stmt1 = `update user_station_mapping set 
  status = 'N',default_station='N',  modifyby = ? , modify_date = ?
  where  user_id =${data.user_id} and status='Y'`;

  let stmt2 = `select id,default_station from user_station_mapping 
  where user_id =${data.user_id} and station_id= ? `;

  let stmt3 = `insert into user_station_mapping (user_id,station_id,default_station,status,created_date,createdby)
  VALUES ? `;

  let stmt4 = `update user_station_mapping set default_station=?,
  status=? , modifyby= ?, modify_date = ?
  where  id = ? `;

  try {
    resp1 = await pool.query(stmt1, [data.created_by, datetime]);

    for (let index = 0; index < data.station_data.length; index++) {

      resp2 = await pool.query(stmt2, [data.station_data[index].station_id])

      if (resp2.length > 0) {
        if (resp2[0].default_station == data.station_data[index].default_station) {
          resp3 = await pool.query(stmt4, [data.station_data[index].default_station, data.status, data.station_data[index].modify_by, new Date(data.station_data[index].modify_date), resp2[0].id])
        } else {
          resp3 = await pool.query(stmt4, [data.station_data[index].default_station, data.status, data.created_by, datetime, resp2[0].id])
        }
      } else {
        values.push([data.user_id, data.station_data[index].station_id, data.station_data[index].default_station, data.status, datetime, data.created_by])

        station_mapped.push({
          station_id: data.station_data[index].station_id,
          remarks: 'SUCCESS'
        })

      }
    }

    if (values.length > 0) {
      resp4 = await pool.query(stmt3, [values]);
    } else {
    }

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: 'SUCCESS',
      data: [{
        station_not_mapped: station_not_mapped,
        station_mapped: station_mapped
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

UserStation.deleteUserStationMapping = async (id, login_id, result) => {

  var datetime = new Date();
  let resp1;
  let resp

  let stmt = `Update user_station_mapping set  modifyby = ${login_id},modify_date = ? , status = 'D' WHERE id =${id};`;

  let stmt2 = `select id,station_id,default_station from user_station_mapping where id=${id} and status='Y' `;

  try {
    resp1 = await pool.query(stmt2);

    if (resp1.length <= 0) {
      resp = await pool.query(stmt, [datetime]);

      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: 0,
        data: []
      }
    } else {

      const resp2 = resp1.filter(station => station.id == id);

      if (resp2[0].default_station == 'Y') {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'Please select another station as default station before deleting this station from this user',
          count: 0,
          data: []
        }
      } else {
        resp = await pool.query(stmt, [datetime]);

        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: 0,
          data: []
        }
      }
    }


  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: [],
    }
  } finally {
    result(null, final_res);
  }

};

UserStation.getAllUserStationMapping = async (login_id, result) => {

  let final_res;
  let resp;
  let stmt;
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);

  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA = (clientAndRoleDetails.data.filter(x => x.role_code == 'SA').length > 0) ? true : false;

  if (isSA) {

    stmt = `select usm.id as map_id, usm.user_id,  umn.f_name,umn.l_name,usm.station_id as station_id, 
 csm.name as station_name ,csm.cpo_id,cm.client_id,default_station as default_station,
 usm.status,usm.created_date,usm.createdby,usm.modify_date,usm.modifyby 
 from user_station_mapping usm
 inner join user_mst_new umn on usm.user_id=umn.id and umn.status='Y'
 inner join role_mst rm on umn.client_id=rm.client_id
 inner join charging_station_mst csm on usm.station_id = csm.id and csm.status='Y'
 inner join cpo_mst cm on csm.cpo_id=cm.id 
 where  rm.code not in ('SA','ADMIN','CPO') and usm.status='Y';`;

  } else {
    stmt = `select usm.id as map_id, usm.user_id,  umn.f_name,umn.l_name,  usm.station_id as station_id, 
    csm.name as station_name ,usm.default_station as default_station,csm.cpo_id,cm.client_id,
    usm.status,usm.created_date,usm.createdby,usm.modify_date,usm.modifyby 
    from user_station_mapping usm
    inner join user_mst_new umn on usm.user_id=umn.id and umn.status='Y' and  umn.client_id=${client_id}
    inner join role_mst rm on umn.client_id=rm.client_id
    inner join charging_station_mst csm on usm.station_id = csm.id and csm.status='Y'
     inner join cpo_mst cm on csm.cpo_id=cm.id 
    where rm.code not in ('SA','ADMIN','CPO') and usm.status='Y';`;

  }

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


};

UserStation.updateUserStationMappingV1 = async (userStation, result) => {
  //;
  var datetime = new Date();

  let stmt = `update user_station_mapping set 
  station_id =${userStation.station_id},status = '${userStation.status}',default_station='${userStation.default_station}',   
  modifyby = ${userStation.user_id}, modify_date = ?
  where id=${userStation.id}  and status='Y'`;


  try {
    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: userStation.id }]
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

UserStation.getStationListWithStationAssignedToUser = async (cpo_id, user_id, result) => {

  let final_res;
  let resp;
  let stmt;

  //;
  stmt = ` select csm.id as station_id, csm.cpo_id,csm.name as station_name,
  usm.id as map_id  , usm.user_id,usm.default_station,usm.status as map_status,usm.created_date,usm.createdby,usm.modify_date,usm.modifyby
  from charging_station_mst csm 
  left join user_station_mapping usm on  csm.id = usm.station_id and usm.user_id=${user_id} and usm.status='Y'
  where csm.cpo_id = ${cpo_id}  and csm.status='Y';`;

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


};
UserCharging.userChargerMappingBLESync = async (data, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let resp1;
  let resp3;
  let resp4;
  let stmt = `select id as charger_id from charger_serial_mst where serial_no=?;`;
  let values1 = [];
  let values2 = [];

  let stmt1 = `INSERT INTO user_charger_mapping (user_id,charger_id,map_as_child,status,created_date,createdby)
  VALUES (?,?,?,?,?,?) ;`;

  let stmt2 = `update  charger_serial_mst set nick_name = ? , client_certificate=? where id = ? ;`;


  let stmt3;
  stmt3 = `select id,user_id from user_charger_mapping where charger_id=? and status<>'D';`;

  let stmt4;
  stmt4 = `select id from user_mst_new where ble_user_id=? and status<>'D';`;

  let stmt5;


  try {
//;
    resp = await pool.query(stmt, [data.serial_no]);

    if (resp.length > 0) {

      resp3 = await pool.query(stmt3, [resp[0].charger_id]);

      // if (resp3.length > 0) { 
      //;
      if (resp3.length > 0 && !!data.map_as_child != 1) { // 04 04 2022 data.map_as_child added as spin have functionality to add charger to multiple user
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'This charger is already assigned to another user',
          count: 0,
          data: []
        }
      } else {

        resp4 = await pool.query(stmt4, [data.user_id]);

        //;
        values1 = [resp4[0].id, resp[0].charger_id, data.map_as_child, data.status, datetime, data.createdby];
        resp1 = await pool.query(stmt1, values1);

        //05 04 2022 : No need to update client certificate when charger is added as child
        if (!!data.map_as_child != 1) {
          values2 = [data.nick_name, data.client_certificate, resp[0].charger_id];
          resp2 = await pool.query(stmt2, values2);
          
          // Nitesh
          stmt5 = `call pSpinAttachedDefaultWarranty(${resp4[0].id},'${data.serial_no}');`
          let resp5 = await pool.query(stmt5);
        }

        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: 0,
          data: [{ id: resp1.insertId }]
        }
      }
    }
    else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Charger not found for this serial number',
        count: 0,
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
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

UserCharging.revokeChargerAccessBLE = async(data,result)=>{
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let resp1;
  let resp3;
  let resp4;
  let resp5;
  let stmt =`update devices set user=REPLACE(user,',${data.user_id}',''),updated_at=? 
  where client_dev_no='${data.client_dev_no}' and id>0; `
  let stmt1 =`update user_charger_mapping set status='D',modify_date=?,modifyby=${data.modifyby}
   where user_id=? and charger_id=?`;
  let stmt2 =`update requests set status=2,updated_at=? where id=${data.request_id};`;
  let stmt4=`select id from user_mst_new where ble_user_id =${data.user_id} and status='Y';`;
  let stmt5=`select id from charger_serial_mst where serial_no ='${data.serial_no}' and status='Y';`;
  try{
    resp4 = await pool.query(stmt4);
    resp5 = await pool.query(stmt5);
    resp1 = await pool.query(stmt1,[datetime,resp4[0].id,resp5[0].id]);

    if(resp1.affectedRows>0){
      //;
    resp = await poolMG.query(stmt,datetime);
    resp3 = await poolMG.query(stmt2,datetime);
    final_res={
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ?'ERROR:0' :'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.affectedRows,
      data: []
    }
    }else{
    final_res={
      status:  false,
      err_code:'ERROR:1',
      message: 'DATA NOT FOUND',
      count: 0,
      data: []
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
  }
  finally{
    result(null,final_res);
  }
};

UserCharging.getEndUserDetailsByMobile = async (mobile, result) => {

  let final_res;
  let resp;

  let stmt = `select id,username,mobile, concat(case when f_name is null then '' else f_name end  ,'', case when l_name is null then '' else l_name end) as full_name 
  from user_mst_new 
  where user_type in ('END','EU') and Mobile=${mobile};`;

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

};

UserCharging.ChargerRenewalRequestBle = async (ud, req, result) => {

  let final_res;
  let resp;
  let img1 = '';
  let img2 = '';
  let img3 = ''
  let count = 1;

  let ff = req.files.gallery;
  ff.forEach(element => {
    let sourcepath = pathconfig.environment.fileuploadtemppath + "//" + element.filename;
    let file_path = pathconfig.environment.fileuploadpath + ud.user_id;

    let fileuploadUri = pathconfig.environment.fileserverurl + "//" + pathconfig.environment.fileuploadUri + "//" + ud.user_id + "//" + element.filename;
    if (!fs.existsSync(file_path)) {
      fs.mkdirSync(file_path);
    }
    file_path = file_path + "\\" + element.filename;
    fsPromises.copyFile(sourcepath, file_path).then(function () {
      fs.unlinkSync(sourcepath);

    }).catch(function (error) {
      console.log(error);

    });

    if (count == 1) img1 = fileuploadUri;
    if (count == 2) img2 = fileuploadUri;
    if (count == 3) img3 = fileuploadUri;
    count++;
  });

  let stmt = `INSERT INTO charger_renewal_request_log (request_type,user_id,charger_id,mobile,image_url1,image_url2,image_url3,address1,address2,PIN,landmark,city_id,  state_id,country_id, status,created_date,createdby) VALUES
  ('${ud.request_type}',${ud.user_id},${ud.charger_id},${ud.mobile},'${img1}','${img2}','${img3}','${ud.address1}','${ud.address2}',${ud.PIN},'${ud.landmark}',${ud.city_id},${ud.state_id},${ud.country_id},'P',now(),${ud.user_id})`;
  try{

    resp = await pool.query(stmt);

    final_res = {

      status: true,
      message: 'SUCCESS',
      data: [{
        id: resp.insertId,
      }]
    }
  } catch (err) {
    //
    final_res = {
      status: false,
      message: 'ERROR',
      data: []
    }
  }
  finally {
    result(null, final_res);
  }

};

UserMenu.createUserMenu = async (params, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let respSelect;
  let respSelectActive;
  let id_to_keep_status_active = [];
  let stmtSelect = `Select map_id,status from user_menu_mapping where user_id = ? and menu_id = ? `;
  let stmtSelectActive = `Select map_id from user_menu_mapping where user_id = ? and status ='Y' and map_id not in (?)  `;
  let stmtInsert = `insert into user_menu_mapping (user_id,menu_id,status,created_date,createdby) VALUES ? `;

  let stmtUpdate = `update user_menu_mapping set user_id = ? ,menu_id = ?,status = ?,modify_date = ? ,modifyby =  ?
    where map_id = ? ; `;
  let stmtUpdateDelete = `update user_menu_mapping set status = 'D',modify_date = ? ,modifyby =  ?
    where user_id = ? and map_id not in (?)  ; `;

    let values = [];
    try {
  
  
      for (let i = 0; i < params.menus.length; i++) {
  
        respSelect = await pool.query(stmtSelect, [params.user_id, params.menus[i].menu_id]);
  
        if (respSelect.length == 0) {
          values.push([params.user_id, params.menus[i].menu_id, params.status, datetime, params.created_by]);
        } else {
          id_to_keep_status_active.push(respSelect[0].map_id);
  
          //update only in case of record is not in Y state because if its in already Y state hen it would be unnecessary to make it Y
          if (respSelect[0].status != 'Y') {
  
            respUpdate = await pool.query(stmtUpdate, [params.user_id, params.menus[i].menu_id,
            params.status, datetime, params.created_by, respSelect[0].map_id])
          }
        }
      }
  
  
      if (id_to_keep_status_active.length > 0) {
  
        respSelectActive = await pool.query(stmtSelectActive, [params.user_id, id_to_keep_status_active]);
  
        if (respSelectActive.length > 0) {
          respUpdateDelete = await pool.query(stmtUpdateDelete, [datetime, params.created_by, params.user_id, id_to_keep_status_active]);
        }
      }
  
  
      if (values.length > 0) {
        resp = await pool.query(stmtInsert, [values]);
      }
  
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: 0,
        data: []
      }
      // clean upp all other
  
    } catch (e) {
  
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

  const mapUserIdTag = async (user_id,created_by) => {
    var datetime = new Date();
    let stmt =`INSERT INTO user_idtag_mapping(user_id,id_tag,status,created_date,createdby)values(?,?,?,?,?);`;
    
    let id_tag = await _utility.getYYYYMMDDHHMMSSfromDate();
    let user_id_tag = id_tag + '' + user_id;
  //;
    let resp = await pool.query(stmt,[user_id,user_id_tag,'Y',datetime,created_by]);
    return { res: resp,user_id_tag };
  }
  

  User.userChargingHistoryBle = async (params, result) => {
  //;
    let stmt = `SELECT chr.nick_name,chr.serial_no, ucl.meter_start_time,ucl.energy_consumed, ucl.duration
    FROM user_charging_log ucl 
   INNER JOIN summary_chargers_report chr ON
   ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
    WHERE  ucl.user_id=${params.userid} `;
  
    let res;
    let final_res;
  
    try {
      //;
      res = await pool.query(stmt);
  
      final_res = {
        status: true,
        message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
        count: res.length,
        data: res
      }
  
    } catch (e) {
      //;
      final_res = {
        status: false,
        message: `ERROR : ${e.code} `,
        count: 0,
        data: []
      }
    } finally {
      return (final_res);
    }
  };

  User.userChargingSummaryBle = async (params, result) => {
  
    let stmt = ` SELECT   DATE(ucl.created_date) AS created_date,ROUND(SUM(ucl.energy_consumed)/1000,2) AS energy_consumed, SUM(ucl.duration) AS duration
    FROM user_charging_log ucl 
   INNER JOIN summary_chargers_report chr ON
   ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
    WHERE  ucl.user_id=${params.userid}  AND chr.serial_no='${params.serialno}' AND energy_consumed>0
    GROUP BY DATE(ucl.created_date),energy_consumed,duration
    ORDER BY DATE(ucl.created_date) DESC
    LIMIT 7 `;

 

    let stmt1 = `  SELECT  COUNT(*) as session,ROUND(SUM(ucl.energy_consumed)/1000,2) AS energy_consumed, SUM(ucl.duration) AS duration
    FROM user_charging_log ucl 
   INNER JOIN summary_chargers_report chr ON
   ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
    WHERE  ucl.user_id=${params.userid}  AND  chr.serial_no='${params.serialno}' and MONTH(ucl.created_date) = MONTH(NOW()) 
    AND energy_consumed>0 `;

    let res;
    let resmonth;
    let final_res;
    let summary_res;
    let lastsession;
    let total_time = 0;
    let total_energy_consumed =0;
    try {
      //;
      res = await pool.query(stmt);
      resmonth = await pool.query(stmt1);

      
      if (res.length > 0) {
        for(let i=0;i< res.length ; i++){

          d = Number(res[i].duration);
          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          total_time += h;
          total_energy_consumed += res[i].energy_consumed
          if(i== 0){
            lastsession = {
              created_date : res[i].created_date,
              energy_consumed : res[i].energy_consumed,
              duration : h + "h " + m + "m",
            }
          }
          res[i].duration = h
       }
       if(resmonth.length > 0 ){
          d = Number(resmonth[0].duration);
          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          resmonth[0].duration =  h + "h " + m + "m"
       }
      }
      final_res = {
        status: true,
        message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
        count: res.length,
        data: {
          detailed :res,
          month : resmonth,
          lastsession :lastsession,
          totaltime : total_time,
          total_energy : total_energy_consumed

        },
       
      }
  
    } catch (e) {
      //;
      final_res = {
        status: false,
        message: `ERROR : ${e.code} `,
        count: 0,
        data: []
      }
    } finally {
      return (final_res);
    }
  };


  User.userChargingSummaryBleMode = async (params, result) => {
    //;
    let stmt = ''
    let stmt1 = ''
    let stmt2 = ''
    if(params.mode == 'BLE'){
        stmt = `  SELECT  CAST(created_date AS CHAR) AS created_date,
        ROUND(SUM(ucl.session_kwh),2) AS energy_consumed, ROUND(IFNULL(SUM(ucl.session_duration),0)) AS duration
            FROM ble_session_logs ucl 
          INNER JOIN summary_chargers_report chr ON
          ucl.charger_serial_no = chr.charger_display_id AND ucl.user_id=${params.userid}
            WHERE  ucl.user_id=${params.userid}  AND ucl.charger_serial_no='${params.serialno}' AND session_kwh>0
            GROUP BY DATE(ucl.created_date),session_kwh,session_duration
            ORDER BY DATE(ucl.created_date) DESC
            LIMIT 7`;
    
        stmt1 = ` SELECT  COUNT(*) AS session,IFNULL(ROUND(SUM(ucl.session_kwh),2),0) AS energy_consumed,ROUND( IFNULL(SUM(ucl.session_duration),0),0) AS duration
        FROM ble_session_logs ucl 
        INNER JOIN summary_chargers_report chr ON
        ucl.charger_serial_no = chr.charger_display_id AND ucl.user_id=${params.userid}
        WHERE  ucl.user_id=${params.userid}  AND  ucl.charger_serial_no='${params.serialno}' AND MONTH(ucl.created_date) = MONTH(NOW()) 
        AND session_duration>0 `;


         stmt2 = ` SELECT  COUNT(*) AS session,IFNULL(ROUND(SUM(ucl.session_kwh),2),0) AS energy_consumed,ROUND( IFNULL(SUM(ucl.session_duration),0),0) AS duration
        FROM ble_session_logs ucl 
        INNER JOIN summary_chargers_report chr ON
        ucl.charger_serial_no = chr.charger_display_id AND ucl.user_id=${params.userid}
        WHERE  ucl.user_id=${params.userid}  AND  ucl.charger_serial_no='${params.serialno}' AND DATE(ucl.created_date) > DATE(NOW()- INTERVAL 30 DAY)
        AND session_duration>0 `;


    }
    else{

      //  stmt = `SELECT   cast(ucl.created_date as char) AS created_date,cast(created_date as char) as created_date_char,ROUND(IFNULL( SUM(ucl.energy_consumed),0)/1000,2) AS energy_consumed, IFNULL(SUM(ucl.duration),0) AS duration
      //   FROM user_charging_log ucl 
      // INNER JOIN summary_chargers_report chr ON
      // ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
      //   WHERE  ucl.user_id=${params.userid}  AND chr.serial_no='${params.serialno}' AND energy_consumed>0
      //   GROUP BY DATE(ucl.created_date),energy_consumed,duration
      //   ORDER BY DATE(ucl.created_date) DESC
      //   LIMIT 7 `;

    
      //    stmt1 = `  SELECT  COUNT(*) as session,IFNULL( ROUND(SUM(ucl.energy_consumed)/1000,2),0) AS energy_consumed, SUM(ucl.duration) AS duration
      //   FROM user_charging_log ucl 
      //   INNER JOIN summary_chargers_report chr ON
      //   ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
      //   WHERE  ucl.user_id=${params.userid}  AND  chr.serial_no='${params.serialno}' and MONTH(ucl.created_date) = MONTH(NOW()) 
      //   AND duration>0  `;

      //   stmt2 = ` SELECT  COUNT(*) as session,IFNULL( ROUND(SUM(ucl.energy_consumed)/1000,2),0) AS energy_consumed, SUM(ucl.duration) AS duration
      //   FROM user_charging_log ucl 
      //   INNER JOIN summary_chargers_report chr ON
      //   ucl.charger_display_id = chr.charger_display_id AND ucl.user_id=${params.userid}
      //   WHERE  ucl.user_id=${params.userid}  AND  chr.serial_no='${params.serialno}' and DATE(ucl.created_date) > DATE(NOW()- INTERVAL 30 DAY) 
      //   AND duration>0  `;

      stmt = `SELECT   cast(ucl.created_on as char) AS created_date,cast(created_on as char) as created_date_char,ROUND(IFNULL( SUM(ucl.energy_consumed),0)/1000,2) AS energy_consumed, IFNULL(SUM(ucl.duration),0) AS duration
      FROM meter_log ucl INNER JOIN summary_chargers_report chr ON  ucl.charger_id = chr.charger_display_id INNER JOIN user_charger_mapping ucm  on chr.charger_id=ucm.charger_id and ucm.user_id=${params.userid}
      WHERE  chr.serial_no='${params.serialno}' AND energy_consumed>0 and ucm.user_id=${params.userid} GROUP BY DATE(ucl.created_on) ORDER BY DATE(ucl.created_on) DESC LIMIT 7`

      stmt1 = `SELECT  COUNT(*) as session,IFNULL( ROUND(SUM(ucl.energy_consumed)/1000,2),0) AS energy_consumed, SUM(ucl.duration) AS duration
      FROM meter_log ucl INNER JOIN summary_chargers_report chr ON ucl.charger_id = chr.charger_display_id  
      INNER JOIN user_charger_mapping ucm  on chr.charger_id=ucm.charger_id and ucm.user_id=${params.userid}
      WHERE  ucm.user_id=${params.userid}  AND  chr.serial_no='${params.serialno}' and MONTH(ucl.created_on) = MONTH(NOW()) AND duration>0`

      stmt2 = `SELECT  COUNT(*) as session,IFNULL( ROUND(SUM(ucl.energy_consumed)/1000,2),0) AS energy_consumed, SUM(ucl.duration) AS duration
      FROM meter_log ucl
      INNER JOIN summary_chargers_report chr ON   ucl.charger_id = chr.charger_display_id
       INNER JOIN user_charger_mapping ucm  on chr.charger_id=ucm.charger_id and ucm.user_id=${params.userid}
      WHERE  ucm.user_id=${params.userid}  AND  chr.serial_no='${params.serialno}' and DATE(ucl.created_on) > DATE(NOW()- INTERVAL 30 DAY)
      AND duration>0`


    }


 
     let res;
     let resmonth;
     let final_res;
     let summary_res;
     let lastsession;
     let total_time = 0;
     let total_time_mm=0;
     let total_energy_consumed =0;
     try {
       //;
       res = await pool.query(stmt);
       resmonth = await pool.query(stmt1);
 
       
       if(resmonth.length == 0 ){

        resmonth = await pool.query(stmt2);
       }
       if (res.length > 0) {
         for(let i=0;i< res.length ; i++){
 
           d = Number(res[i].duration);
           var h = Math.floor(d / 3600);
           var m = Math.floor(d % 3600 / 60);
           total_time += h;

           if(m > 0){
            let mm = (m/60);
            total_time_mm +=mm;
          }

           total_energy_consumed += res[i].energy_consumed
           if(i== 0){
             lastsession = {
               created_date : res[i].created_date,
               energy_consumed : res[i].energy_consumed,
               duration : h + "h " + m + "m",
             }
           }
 
           var hr = d / 3600;
           hr = Number(hr.toFixed(2),2);
           res[i].duration = hr
        }
        if(resmonth.length > 0 ){
           d = Number(resmonth[0].duration);
           var h = Math.floor(d / 3600);
           var m = Math.floor(d % 3600 / 60);
           resmonth[0].duration =  h + "h " + m + "m"
        }
       }
       final_res = {
         status: true,
         message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
         count: res.length,
         data: {
           detailed :res,
           month : resmonth,
           lastsession :lastsession,
           totaltime : Number((total_time + total_time_mm).toFixed(0)) ,
           total_energy : Number(total_energy_consumed.toFixed(2))
 
         },
       }
     } catch (e) {
       final_res = {
         status: false,
         message: `ERROR : ${e.code} `,
         count: 0,
         data: []
       }
     } finally {
       return (final_res);
     }
   };
  
  User.GetMonthlyStatisticsList = async (params, result) => {
     let qry = "SET @OP_ErrorCode = 0; call GetMonthlyStatisticsList(" + params.userid + ",'"+params.serialno+"',"+params.month+","+params.year+", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
     let qry1 = "SET @OP_ErrorCode = 0; call GetMonthlyTotalStatistics(" + params.userid + ",'"+params.serialno+"',"+params.month+","+params.year+", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
     let qryLastSession = "SET @OP_ErrorCode = 0; call Get_Last_Session_Detail(" + params.userid + ",'"+params.serialno+"', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
     var dataRes=[];
     let res;
     let res1;
     let resLastSession;
     let lastsession;
     let final_res;
     let total_time = 0;
     let total_time_mm=0;
     let total_energy_consumed =0;
     try {
      res = await pool.query(qry);
      res1 = await pool.query(qry1);
resLastSession = await pool.query(qryLastSession);
       if(res1.length > 2){
         res1 = res1[1];
       }
       if(resLastSession.length > 2){
        resLastSession = resLastSession[1];
        d = Number(resLastSession[0].duration);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        lastsession = {
          created_date : resLastSession[0].created_date,
          energy_consumed : resLastSession[0].energy_consumed,
          duration : h + "h " + m + "m",
        }
       }
       if (res.length > 2) {
        res = res[1];
        var rDate;
        var rDateDetail=[];
        for(let i=0;i< res.length ; i++){
          let diff = _utility.formatDate(res[i].created_date);
          if(i != 0 && rDate != diff){
            dataRes.push({
              created_date:rDate,
              Detail:rDateDetail
            });
            rDateDetail =[];
          }
          rDate = _utility.formatDate(res[i].created_date);
          d = Number(res[i].duration);
           var h = Math.floor(d / 3600);
           var m = Math.floor(d % 3600 / 60);
           total_time += h;
           if(m > 0){
            let mm = (m/60);
            total_time_mm +=mm;
          }
           total_energy_consumed += res[i].energy_consumed;
           /*if(i== 0){
             lastsession = {
               created_date : bleRes[i].created_date,
               energy_consumed : bleRes[i].energy_consumed,
               duration : h + "h " + m + "m",
             }
           }*/
           res[i].duration =  h + "h " + m + "m";
           rDateDetail.push({
            energy_consumed:res[i].energy_consumed,
            duration:res[i].duration
          });           
          if(i == (res.length-1)){
            dataRes.push({
              created_date:rDate,
              Detail:rDateDetail
            });
            rDateDetail =[];
          }
          }
       }
       final_res = {
         status: true,
         message: res.length > 0 ? 'DATA_FOUND' :'DATA_NOT_FOUND',
         count: res.length,
         data: {
           detailed :dataRes,
           month : res1,
           lastsession:lastsession,
           totaltime : Number((total_time + total_time_mm).toFixed(2)).toString().split('.').length >1? (Number((total_time + total_time_mm).toFixed(2)).toString().replace('.','h '))+"m":Number((total_time + total_time_mm).toFixed(2)).toString()+"h ",
           total_energy : Number(total_energy_consumed.toFixed(2))
         },
       }
     } catch (e) {
       final_res = {
         status: false,
         message: `ERROR : ${e.code} `,
         count: 0,
         data: []
       }
     } finally {
       return (final_res);
     }
   };
   
  User.getUserByMobileAndEmail=async (data,result)=>{
    //;
    let resp;
    let final_res;
    let whereClause='';
    if(data.key=='BOTH'){
      //;
      whereClause = `where status<>'D' and (mobile='${data.mobile}' or email='${data.email}')`;
    }else if(data.key=='EMAIL'){
      whereClause = `where status<>'D' and email='${data.email}'`;
    }else if (data.key=='MOBILE'){
      whereClause = `where status<>'D' and mobile='${data.mobile}'`;
    }

    let stmt = `select id,username,mobile,email,status from user_mst_new ${whereClause}`;
try{
    resp = await pool.query(stmt);
    final_res ={
      status: resp.length > 0 ? true : false,
      err_code:  resp.length > 0 ? `ERROR : 0` : `ERROR : 1`,
      message: resp.length > 0 ? 'User already registered with this mobile/email' : 'Mobile/email available',
      data:[]
    }
}catch{
final_res={
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
}
}
finally{
  result(null,final_res);
}
  }

  User.getUserNotificationList=async (user_id,result)=>{
    //;
    let resp;
    let final_res;
    let stmt = `SELECT nl.id,event_name,notification_message,nl.created_date FROM
     notification_engine_mst ne INNER JOIN notification_log nl
     ON ne.id= nl.notification_engine_id
     WHERE user_id = ${user_id} AND 
     nl.STATUS IN ('S','R') AND notification_type = 'PUSH'
    ORDER BY nl.id DESC`;
try{
    resp = await pool.query(stmt);
    final_res ={
      status: resp.length > 0 ? true : false,
      err_code:  resp.length > 0 ? `ERROR : 0` : `ERROR : 1`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data:resp
    }
}catch(err){
final_res={
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
}
}
finally{
  result(null,final_res);
}
  }

  User.updateUSerNotificationStatus=async (id,result)=>{
    //;
    let resp;
    let final_res;
    let stmt = `UPDATE notification_log SET STATUS ='R' WHERE id =${id}`;
try{
    resp = await pool.query(stmt);
    final_res ={
      status: resp.affectedRows > 0 ? true : false,
      err_code:  resp.affectedRows > 0 ? `ERROR : 0` : `ERROR : 1`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data:[]
    }
}catch(err){
final_res={
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
}
}
finally{
  result(null,final_res);
}
  }



  BLE_Session.insertUserChargingLogs_BLE=async (data,result)=>{
   
    var datetime = new Date();
    let resp;
    let final_res;
    let duration;
    let stmt = `insert into ble_session_logs(user_id,charger_serial_no,vehicle_id,
      start_time,stop_time,session_kwh,session_duration,status,created_date,created_by) 
      values (?,?,?,?,?,?,?,?,?,?); `;
try{
  for (let i = 0; i < data.session_history.length; i++) {
  
    let timeString = new Date(data.session_history[i].start_time);
    let timeString1 = new Date(data.session_history[i].stop_time);
    let duration = Math.abs(timeString1 - timeString)/(1000);
    resp = await pool.query(stmt,[data.user_id,data.charger_serial_no,data.vehicle_id,data.session_history[i].start_time,
      data.session_history[i].stop_time,data.session_history[i].session_kwh,duration,data.status,datetime,data.created_by]);
    }
    final_res ={
      status: resp.affectedRows > 0 ? true : false,
      err_code:  resp.affectedRows > 0 ? `ERROR : 0` : `ERROR : 1`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data:[]
    }
}catch(err){
final_res={
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
}
}
finally{
  result(null,final_res);
}
  }
  User.GetStatisticsMonthValue = async (result) => {
    let final_res;
    let resp;
    let stmt = `select * from statistics_month_mst`;
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
  
  };
  User.Get_Detail_Used_Statistics = async (params, result) => {
    console.log( params.userid);
    //;
     let qry = "SET @OP_ErrorCode = 0; call Get_Detail_Used_Statistics(" + params.userid + ",'"+params.serialno+"',"+params.monthValue+", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
     let res;
     let final_res;
     let total_time = 0;
     let total_time_mm=0;
     let total_energy_consumed =0;
     try {
      res = await pool.query(qry);
      
       if (res.length > 2) {
        res = res[1];
        for(let i=0;i< res.length ; i++){
          d = Number(res[i].duration);
           var h = Math.floor(d / 3600);
           var m = Math.floor(d % 3600 / 60);
           total_time += h;
           if(m > 0){
            let mm = (m/60);
            total_time_mm +=mm;
          }
           total_energy_consumed += res[i].energy_consumed;
           /*if(i== 0){
             lastsession = {
               created_date : bleRes[i].created_date,
               energy_consumed : bleRes[i].energy_consumed,
               duration : h + "h " + m + "m",
             }
           }*/
           var hr = d / 3600;
           hr = Number(hr.toFixed(2),2);
           res[i].duration = hr.toString().split('.').length>1?(hr.toString().replace('.','h '))+"m":hr.toString()+"h ";
        }
       }
       final_res = {
         status: true,
         message: res.length > 0 ? 'DATA_FOUND' :'DATA_NOT_FOUND',
         count: res.length,
         data: {
           detailed :res,
           totaltime :Number((total_time + total_time_mm).toFixed(2)).toString().split('.').length >1? (Number((total_time + total_time_mm).toFixed(2)).toString().replace('.','h '))+"m":Number((total_time + total_time_mm).toFixed(2)).toString()+"h ",
           total_energy : Number(total_energy_consumed.toFixed(2))
         },
       }
     } catch (e) {
       final_res = {
         status: false,
         message: `ERROR : ${e.code} `,
         count: 0,
         data: []
       }
     } finally {
       return (final_res);
     }
   };
  User.userChargingHistoryByRange = async (params, result) => {
    let = ''; 
    var dataRes=[];
    stmt = `CALL GetSessionHistoryByRange( ${params.userid},'${params.serialno}','${params.fromDate}','${params.toDate}',@OP_ErrorCode,@OP_ErrorDetail)`;
    let res;
      let final_res;
    
      try {
        //;
        res = await pool.query(stmt);
        if (res.length > 1) {
          var rDate;
          var rDateDetail=[];
          for(let i=0;i< res[0].length ; i++){
            let diff = _utility.formatDate(res[0][i].created_date);
            if(i != 0 && rDate != diff){
              dataRes.push({
                created_date:rDate,
                Detail:rDateDetail
              });
              rDateDetail =[];
            }
            rDate = _utility.formatDate(res[0][i].created_date);
            let d = Number(res[0][i].duration)
            let rduration;
            if(d > 0){
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
          
            res[0][i].duration =  h + "h " + m + "m";
            rduration = h + "h " + m + "m";
            }
            else{
              res[0][i].duration =  0 + "h " + 0 + "m";
              rduration = 0 + "h " + 0 + "m";
            }
            rDateDetail.push({
              energy_consumed:res[0][i].energy_consumed,
              duration:rduration
            });           
            if(i == (res[0].length-1)){
              dataRes.push({
                created_date:rDate,
                Detail:rDateDetail
              });
              rDateDetail =[];
            }
          }
  
          final_res = {
            status: res[0].length > 0 ? true:false,
            message: res[0].length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
            count: res[0].length,
            data: dataRes
          }
        }else{
          final_res = {
            status: false,
            message:  'DATA_NOT_FOUND',
            count: 0,
            data: []
          }
        }
      } catch (e) {
        //;
        final_res = {
          status: false,
          message: `ERROR : ${e.code} `,
          count: 0,
          data: []
        }
      } finally {
        return (final_res);
      }
    };


module.exports = { User, UserStation, UserCharging,UserMenu,mapUserIdTag,BLE_Session};