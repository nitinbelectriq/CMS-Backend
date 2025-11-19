const { sql, pool, poolMG } = require("./db.js");
const _utility = require("../utility/_utility");

const Master = function (master) {
  this.id = master.id,
    this.code = master.code,
    this.name = master.name,
    this.description = master.description,
    this.status = master.status,
    this.created_date = master.created_date,
    this.created_by = master.created_by,
    this.modify_date = master.modify_date,
    this.modify_by = master.modify_by
};
const Master_Config = function(master_config){
  this.id=master_config.id,
  this.key= master_config.key,
  this.value = master_config.value,
  this.description = master_config.description,
  this.application = master_config.application,
  this.status= master_config.status,
  this.created_date= master_config.created_date,
  this.createdby = master_config.createdby,
  this.modify_date= master_config.modify_date,
  this.modifyby= master_config.modifyby,
  this.project=master_config.project
};

const Country = function (country) {
  this.id = country.id,
    this.name = country.name,
    this.description = country.description,
    this.iso_code = country.iso_code,
    this.country_code = country.country_code,
    this.min_mobile_length=country.min_mobile_length,
    this.max_mobile_length=country.max_mobile_length,
    this.status = country.status,
    this.created_date = country.created_date,
    this.created_by = country.created_by,
    this.modify_date = country.modify_date,
    this.modify_by = country.modify_by
};

const State = function (state) {
  this.id = state.id,
    this.country_id = state.country_id,
    this.name = state.name,
    this.description = state.description,
    this.status = state.status,
    this.created_date = state.created_date,
    this.created_by = state.created_by,
    this.modify_date = state.modify_date,
    this.modify_by = state.modify_by
};
const StatePIN = function (statePin) {
  this.id = statePin.id,
    this.state_id = statePin.state_id,
    this.PIN = statePin.PIN,
    this.status = statePin.status,
    this.created_date = statePin.created_date,
    this.created_by = statePin.created_by,
    this.modify_date = statePin.modify_date,
    this.modify_by = statePin.modify_by,
    this.PIN_data = statePin.PIN_data
};

const City = function (city) {
  this.id = city.id,
    this.state_id = city.state_id,
    this.name = city.name,
    this.description = city.description,
    this.status = city.status,
    this.created_date = city.created_date,
    this.created_by = city.created_by,
    this.modify_date = city.modify_date,
    this.modify_by = city.modify_by
};

const Question = function (question) {
  this.id = question.id,
    this.question = question.question,
    this.description = question.description,
    this.status = question.status,
    this.created_date = question.created_date,
    this.created_by = question.created_by,
    this.modify_date = question.modify_date,
    this.modify_by = question.modify_by
};

const NotificationEngine = function (notificationEngine) {
    this.id = notificationEngine.id,
    this.project_id = notificationEngine.project_id,
    this.event_code = notificationEngine.event_code,
    this.event_name = notificationEngine.event_name,
    this.send_email = notificationEngine.send_email,
    this.send_sms = notificationEngine.send_sms,
    this.send_push = notificationEngine.send_push,
    this.content_email = notificationEngine.content_email,
    this.content_sms = notificationEngine.content_sms,
    this.content_push = notificationEngine.content_push,
    this.status = notificationEngine.status,
    this.created_date = notificationEngine.created_date,
    this.created_by = notificationEngine.created_by,
    this.modify_date = notificationEngine.modify_date,
    this.modify_by = notificationEngine.modify_by
};

const ChargerConfigurationKey = function (master) {
  this.id = master.id,
    this.name = master.name,
    this.description = master.description,
    this.data_type = master.data_type,
    this.max_length = master.max_length,
    this.min_length = master.min_length,
    this.display_order = master.display_order,
    this.status = master.status,
    this.created_date = master.created_date,
    this.created_by = master.created_by,
    this.modify_date = master.modify_date,
    this.modify_by = master.modify_by
};
Master.getLocationTypes = result => {

  let stmt = `select id, name , description,
      status,created_date,createdby,modifyby,modify_date
      from location_type_mst 
      where status <> 'D'
      order by name `;
  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Master.getChargerRegistrationTypes = result => {

  let stmt = `select id, name , description,
      status,created_date,createdby,modifyby,modify_date
      from charger_registration_type_mst 
      where status <> 'D'
      order by name `;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Master.getElectricitylineTypes = result => {

  let stmt = `select id, name , description,
      status,created_date,createdby,modifyby,modify_date
      from electricity_line_type_mst 
      where status <> 'D'
      order by name `;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};


Country.createCountry = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into country_mst (name,description,iso_code,country_code, 
    min_mobile_length,max_mobile_length,status,createdby,created_date) values (?) `;
  let values = [data.name, data.description, data.iso_code, data.country_code,data.min_mobile_length,
  data.max_mobile_length,data.status, data.created_by, datetime];
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

Country.updateCountry = async (data, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `update country_mst set name = ? , description = ? ,iso_code = ? ,country_code = ?,
  min_mobile_length=?,max_mobile_length=?, status = ?,modifyby = ? ,modify_date = ? where id = ? `;

  try {

    resp = await pool.query(stmt2, [data.name, data.description, data.iso_code, data.country_code,
    data.min_mobile_length,data.max_mobile_length,data.status, data.modify_by, datetime, data.id]);

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

Country.deleteCountry = async (id, user_id, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `Update country_mst set status = 'D',
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [user_id, datetime, id]);

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


Country.getCountries = result => {
  let stmt = `SELECT id,name, description,iso_code,country_code,min_mobile_length,max_mobile_length,
    status, created_date, modify_date 
    FROM country_mst where status='Y' order by name`;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};


Country.getAllCountries = async (result) => {
  let final_res;
  let resp;

  let stmt = `SELECT id,name, description,iso_code,country_code,min_mobile_length,max_mobile_length,
  status, created_date, modify_date FROM country_mst where status<>'D' order by name`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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

  // sql.query(stmt, (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   if (res.length) {
  //     result(null, res);
  //     return;
  //   }

  //   result({ kind: "not_found" }, null);
  // });
};

Country.getAllCountriesBLE = async (result) => {
  let final_res;
  let resp;

  let stmt = `SELECT id,name, code,length FROM country_mobiles order by name`;

  try {
    resp = await poolMG.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
};



State.createState = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into state_mst (name,description,country_id,
    status,createdby,created_date) values (?) `;
  let values = [data.name, data.description, data.country_id,
  data.status, data.created_by, datetime];
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

State.updateState = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `update state_mst set name = ? , description = ? ,country_id = ? ,
    status = ?,modifyby = ? ,modify_date = ? where id = ? `;

  try {

    resp = await pool.query(stmt2, [data.name, data.description, data.country_id,
    data.status, data.modify_by, datetime, data.id]);

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

State.deleteState = async (id, user_id, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update state_mst set status = 'D',
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [user_id, datetime, id]);

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


State.getAllStates = async result => {

  let final_res;
  let resp;

  let stmt = `SELECT sm.id, sm.country_id,cm.name as country_name, sm.name , sm.description,
  sm.status, sm.created_date, sm.createdby  
  FROM state_mst sm inner join country_mst cm on sm.country_id = cm.id 
  where sm.status<>'D' order by sm.name`;

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
};



State.getStates = result => {
  let stmt = `SELECT sm.id, sm.country_id,cm.name as country_name, sm.name , sm.description,
    sm.status, sm.created_date, sm.createdby  
    FROM state_mst sm inner join country_mst cm on sm.country_id = cm.id 
    where sm.status='Y' order by sm.name`;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};



Country.getCountryByState = (id, result) => {
  var datetime = new Date();

  let stmt = `SELECT cm.id,cm.name ,cm.iso_code,cm.country_code,cm.min_mobile_length,cm.max_mobile_length , 
    cm.status,cm.created_date,cm.createdby  
    FROM  country_mst cm inner join state_mst sm on cm.id = sm.country_id   
    where sm.id = ? and cm.status='Y' order by cm.name`;

  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      return;
    }
    result(null, res);
  });
};
State.getStateByCountry = (id, result) => {
  var datetime = new Date();

  let stmt = `SELECT sm.id,sm.name , sm.status,sm.created_date,sm.createdby  
    FROM  state_mst sm inner join country_mst cm on sm.country_id=cm.id    
    where cm.id= ? and sm.status='Y' order by sm.name`;

  sql.query(stmt, id, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

State.getStateByCountryBLE = async (id, result) => {
  let final_res;
  let resp;

  let stmt = `SELECT sm.id,sm.name ,cm.id as country_id, cm.name as country_name, 
  sm.status,sm.created_date,sm.createdby  
  FROM  state_mst sm inner join country_mobiles cm on sm.country_id=cm.id    
  where cm.id= ? and sm.status='Y' order by sm.name`;

  try {
    resp = await poolMG.query(stmt,[id]);

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

};


City.createCity = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into city_mst (name,description,state_id,
    status,createdby,created_date) values (?) `;
  let values = [data.name, data.description, data.state_id,
  data.status, data.created_by, datetime];
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


StatePIN.getAllStatePINMapping = async result => {

  let final_res;
  let resp;

  let stmt = `SELECT spm.id, spm.state_id,sm.name as state_name ,sm.country_id, spm.PIN,spm.status , spm.created_date, spm.createdby  ,spm.modify_date ,spm.modifyby
  FROM state_pin_mapping  spm inner join state_mst sm on spm.state_id = sm.id and sm.status='Y'
  where spm.status<>'D' order by sm.name; `;

  try {
    resp = await pool.query(stmt);
//;
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

StatePIN.allPINByStateId = async (state_id,result) => {

  let final_res;
  let resp;

  let stmt = `SELECT spm.id, spm.state_id,sm.name as state_name ,sm.country_id , spm.PIN,spm.status , spm.created_date, spm.createdby  ,spm.modify_date ,spm.modifyby
  FROM state_pin_mapping  spm inner join state_mst sm on spm.state_id = sm.id 
  where sm.status<>'D' and spm.state_id = ? order by sm.name; `;

  try {
    resp = await pool.query(stmt,[state_id]);

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

StatePIN.allActivePINByStateId = async (state_id,result) => {

  let final_res;
  let resp;

  let stmt = `SELECT spm.id, spm.state_id,sm.name as state_name ,sm.country_id, spm.PIN,spm.status , spm.created_date, spm.createdby  ,spm.modify_date ,spm.modifyby
  FROM state_pin_mapping  spm inner join state_mst sm on spm.state_id = sm.id 
  where sm.status='Y' and spm.state_id = ? order by sm.name; `;

  try {
    resp = await pool.query(stmt,[state_id]);

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


StatePIN.createStatePINMapping = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let PIN_not_mapped = [];
  let PIN_mapped = [];
  //;
  let stmt3 = `select id from state_pin_mapping
  where Pin = ? and status <>'D'`;


  let stmt2 = `insert into state_pin_mapping (state_id,Pin,
    status,createdby,created_date) values ? `;
  let values = [];

  try {
    //resp = await pool.query(stmt2,[values]);

    for (let index = 0; index < data.PIN_data.length; index++) {
      resp3 = await pool.query(stmt3, [data.PIN_data[index]])

      if (resp3.length > 0) {
        PIN_not_mapped.push({
          PIN: data.PIN_data[index],
          remarks: 'DUPLICATE'
        })

      } else {
        values.push([data.state_id, data.PIN_data[index],
        data.status, data.created_by, datetime]);

        PIN_mapped.push({
          PIN: data.PIN_data[index],
          remarks: 'SUCCESS'
        });
      }

    }
    if (values.length > 0) {

      resp = await pool.query(stmt2, [values]);


    } else {
    }
    final_res = {
      status: values.length > 0 ? true : false,
      message: values.length > 0 ? 'SUCCESS' : 'ALL_DUPLICATE',
      data: [{
        PIN_not_mapped: PIN_not_mapped,
        PIN_mapped: PIN_mapped
      }]
    }
  }

  catch (err) {
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

City.updateCity = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `update city_mst set name = ? , description = ? ,state_id = ? ,
    status = ?,modifyby = ? ,modify_date = ? where id = ? `;

  try {

    resp = await pool.query(stmt2, [data.name, data.description, data.state_id,
    data.status, data.modify_by, datetime, data.id]);

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

City.deleteCity = async (id, user_id, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update city_mst set status = 'D',
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [user_id, datetime, id]);

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


City.getAllCities = async result => {
  let final_res;
  let resp;
  let stmt = `SELECT cm.id,cm.state_id,sm.name as state_name, cm.name, cm.description,cm.status,cm.created_date,cm.createdby  
      FROM city_mst cm inner join state_mst sm on cm.state_id = sm.id 
      where cm.status<>'D' order by cm.name `;

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
};




City.getCities = result => {

  let stmt = `SELECT cm.id,cm.state_id,sm.name as state_name, cm.name, cm.description,cm.status,cm.created_date,cm.createdby   
      FROM city_mst cm inner join state_mst sm on cm.state_id = sm.id 
      where cm.status='Y' order by cm.name `;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};


City.getCityByState = (id, result) => {
  var datetime = new Date();

  let stmt = `SELECT cm.id,cm.name , cm.status,cm.created_date,cm.createdby  
    FROM  city_mst cm   inner join state_mst sm on cm.state_id=sm.id   
    where sm.id = ? and cm.status='Y' order by cm.name`;

  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

State.getStateByCity = (id, result) => {
  var datetime = new Date();

  let stmt = `SELECT sm.id,sm.name , sm.status,sm.created_date,sm.createdby  
        FROM  state_mst sm   inner join city_mst cm on sm.id=cm.state_id   
        where cm.id = ? and sm.status='Y' order by sm.name`;

  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Country.getCountryStateByPIN = (pin, result) => {
  var datetime = new Date();

  let stmt = `select spm.id as map_id,spm.pin,spm.created_date,spm.createdby,sm.id as state_id,
    sm.name as state_name,cm.id as country_id,cm.name as country_name
    from state_PIN_mapping spm 
    inner join state_mst sm on spm.state_id = sm.id and sm.status = 'Y'
    inner join country_mst cm on sm.country_id = cm.id and cm.status = 'Y'
    where spm.PIN = ? and spm.status = 'Y';`;

  sql.query(stmt, pin, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};


ChargerConfigurationKey.getChargerConfigurationKeys = (result) => {

  let final_res;

  let stmt = `select id ,name,description,data_type,max_length,min_length,display_order,status,
    created_date,createdby,modify_date,modifyby 
    from charger_config_mst where status = 'Y'`;

  sql.query(stmt, (err, res) => {
    if (err) {
      final_res = {
        status: false,
        message: `ERROR : ${err.code}`,
        data: []
      }
      result(null, final_res);
      return;
    }

    if (res.length > 0) {
      final_res = {
        status: true,
        message: 'DATA_FOUND',
        count: res.length,
        data: res
      }
    } else {
      final_res = {
        status: false,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
    }

    result(null, final_res);
  });
};

Question.getQuestions = async result => {
  let final_res;
  let resp;
  let stmt = `SELECT qm.id, qm.question, qm.description,
    qm.status,qm.created_date,qm.createdby  
    FROM question_mst qm 
    where qm.status='Y' order by qm.question `;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
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


Master.getProjects = async (params, result) => {

  let final_res;
  let resp;


  let stmt = `select id,code,name,description,status,createdby,created_date
  from project_mst
  order by name `;

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
    return final_res;
  }
};


Master.getProjectsByCode = async (project_code, result) => {

  let final_res;
  let resp;


  let stmt = `select id,code,name,description,status,createdby,created_date
  from project_mst
  where code = '${project_code}'
  order by name `;

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
    return final_res;
  }
};

Master.getNavListByUserId = async (login_id, project_id, result) => {
debugger;
  let final_res;
  let resp;
  let arr_final_nav_list;
  let arr_nav_list_L1;
  let arr_nav_list_L2;
  let arr_nav_list_L3;
  let arr_nav_list_L4;
  let arr_nav_list_L5;

  //role based for fututre
  // let stmt =`SELECT mm.id as table_id,mm.nav_level , mm.nav_id as id , mm.title, mm.type,
  //   mm.icon,mm.url,mm.icon_url,mm.parent_id
  //   FROM menu_mst mm where mm.status = 'Y' and mm.project_id=${project_id} 
  //   order by mm.display_order;`;
  // let stmt =`select umm.map_id,umm.menu_id  as table_id, mm.title, mm.nav_level,mm.nav_id as id ,mm.type,mm.icon,
  //   mm.icon_url,mm.url,mm.display_order,mm.parent_id  ,umm.user_id, usm.f_Name,usm.l_Name ,
  //   umm.status as umm_status, umm.created_date,umm.createdby,umm.modify_date,umm.modifyby 
  //   from user_menu_mapping umm 
  //   inner join menu_mst mm on umm.menu_id = mm.id and mm.status='Y'
  //   inner join user_mst_new usm on umm.user_id=usm.id and usm.status = 'Y'
  //   where umm.status='Y' and umm.user_id=${login_id} and mm.project_id=${project_id} 
  //   order by mm.display_order;`;
//;
  let stmt = `select rmm.menu_id  as table_id, mm.title, mm.nav_level,mm.nav_id as id ,mm.type,
    mm.icon,mm.icon_url,mm.url,mm.display_order,mm.parent_id  
    from role_menu_mapping rmm 
    inner join menu_mst mm on rmm.menu_id = mm.id and mm.status='Y'
    inner join role_mst rm on rmm.role_id=rm.id and rm.status = 'Y'
    where rmm.status='Y' 
    and rmm.role_id in (select role_id from user_role_mapping where user_id = ${login_id} and status='Y') 
    and mm.project_id=${project_id} 
    UNION
    select umm.menu_id  as table_id, mm.title, mm.nav_level,mm.nav_id as id ,mm.type,mm.icon,
    mm.icon_url,mm.url,mm.display_order,mm.parent_id  
    from user_menu_mapping umm 
    inner join menu_mst mm on umm.menu_id = mm.id and mm.status='Y'
    inner join user_mst_new usm on umm.user_id=usm.id and usm.status = 'Y'
    where umm.status='Y' and umm.user_id=${login_id}  and mm.project_id=${project_id} 
    order by display_order ;`;

  try {

    resp = await pool.query(stmt);
//;
    arr_nav_list_L1 = resp.filter(x => x.parent_id == null);
    arr_nav_list_L2 = resp.filter(x => x.nav_level == 2);
    arr_nav_list_L3 = resp.filter(x => x.nav_level == 3);
    arr_nav_list_L4 = resp.filter(x => x.nav_level == 4);
    arr_nav_list_L5 = resp.filter(x => x.nav_level == 5);

    let childL5;
    if (arr_nav_list_L5.length > 0) {
      for (let iL4 = 0; iL4 < arr_nav_list_L4.length; iL4++) {
        childL5 = arr_nav_list_L5.filter(x => x.parent_id == arr_nav_list_L4[iL4].table_id);
        if (childL5.length > 0) arr_nav_list_L4[iL4].children = childL5;
      }
    }

    let childL4;
    if (arr_nav_list_L4.length > 0) {
      for (let iL3 = 0; iL3 < arr_nav_list_L3.length; iL3++) {
        childL4 = arr_nav_list_L4.filter(x => x.parent_id == arr_nav_list_L3[iL3].table_id);
        if (childL4.length > 0) arr_nav_list_L3[iL3].children = childL4;

      }
    }

    let childL3;
    if (arr_nav_list_L3.length > 0) {
      for (let iL2 = 0; iL2 < arr_nav_list_L2.length; iL2++) {
        childL3 = arr_nav_list_L3.filter(x => x.parent_id == arr_nav_list_L2[iL2].table_id);
        if (childL3.length > 0) arr_nav_list_L2[iL2].children = childL3;

      }
    }

    let childL2;
    if (arr_nav_list_L2.length > 0) {
      for (let iL1 = 0; iL1 < arr_nav_list_L1.length; iL1++) {
        childL2 = arr_nav_list_L2.filter(x => x.parent_id == arr_nav_list_L1[iL1].table_id);
        if (childL2.length > 0) arr_nav_list_L1[iL1].children = childL2;

      }
    }

    arr_final_nav_list = arr_nav_list_L1;

    final_res = {
      status: arr_final_nav_list.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: arr_final_nav_list.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: arr_final_nav_list.length,
      data: arr_final_nav_list
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
};

StatePIN.updateStatePINMapping = async (data, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt2 = `update state_pin_mapping set state_id = ? , PIN = ? ,
    status = ?,modifyby = ? ,modify_date = ? where id = ? `;

    

  try {

    resp = await pool.query(stmt2, [data.state_id, data.PIN,
    data.status, data.modify_by, datetime, data.id]);

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

StatePIN.deleteStatePINMapping = async (id,login_id, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update state_pin_mapping set status = 'D' ,
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [login_id, datetime,id]);

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

// Master_Config.getChargingProfileKind = async result => {

//   let final_res;
//   let resp;
//   let stmt = `select id, \`key\`,value from master_config where \`key\` = 'ChargingProfileKind' and status="Y";`;
// //;
//   try {
//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
//       count: resp.length,
//       data: resp
//     }
//   } catch (err) {

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// }
// Master_Config.getChargingRecurrencyKind = async result => {

//   let final_res;
//   let resp;

//   let stmt = `select id, \`key\`,value from master_config where \`key\` = 'RecurrencyKind' where status="Y";`;

//   try {
//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
//       count: resp.length,
//       data: resp
//     }
//   } catch (err) {

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// }
// Master_Config.getChargingProfilePurpose = async result => {

//   let final_res;
//   let resp;

//   let stmt = `select id, \`key\`,value from master_config where \`key\` = 'ChargingProfilePurpose' and status="Y";`;

//   try {
//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
//       count: resp.length,
//       data: resp
//     }
//   } catch (err) {

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// }
// Master_Config.getChargingRateUnit = async result => {

//   let final_res;
//   let resp;

//   let stmt = `select id, \`key\`,value from master_config where \`key\` = 'ChargingRateUnit' and status="Y";`;

//   try {
//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
//       count: resp.length,
//       data: resp
//     }
//   } catch (err) {

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// }


Master_Config.getActiveMasterConfigData = async (key,result) => {

  let final_res;
  let resp;

  let stmt = `select id, \`key\`,value,description 
  from master_config where \`key\` = '${key}' and status="Y";`;
//;
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
Master_Config.getProjects =  result => {

  let stmt = `select id,code,name from project_mst where status='Y' `;
  sql.query(stmt,  (err, res) => {
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

Master.navListByUserId = async( login_id,project_id ,result) => {
//;
  let respNavList = await Master.getNavListByUserId(login_id,project_id);
    result(null, respNavList);
 
};

NotificationEngine.getAllNotificationEngineList = async(result ) => {
  let final_res;
  let resp;

  let stmt = `select nem.id,nem.event_code,nem.event_name,nem.send_email,nem.send_sms,nem.send_push,
  nem.content_email,nem.content_sms,nem.content_push,nem.status,nem.project_id ,pm.code as project_code
  from notification_engine_mst nem inner join project_mst pm on nem.project_id=pm.id and pm.status='Y'
  where nem.status<>'D';`;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code:resp.length> 0 ? "ERROR:0":"ERROR:1",
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
};


NotificationEngine.getNotificationDetailsByEventCode = async(event_code,result ) => {

  let final_res;
  let resp;

  let stmt = `select nem.id,nem.project_id,pm.code as project_code,nem.event_name,nem.send_email,nem.send_sms,nem.send_push,
  nem.content_email,nem.content_sms,nem.content_push,
  nem.status,nem.created_date,nem.created_by,nem.modified_by,nem.modified_date 
  from notification_engine_mst  nem inner join project_mst pm on nem.project_id=pm.id and pm.status='Y'
   where nem.event_code='${event_code}';`;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code:resp.length> 0 ? "ERROR:0":"ERROR:1",
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
};


NotificationEngine.createNotificationEngine = async(data,result)=>{
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt=`insert into notification_engine_mst(project_id,event_code,event_name,send_email,send_sms,send_push,
    content_email,content_sms,content_push,status,created_date,created_by) values(?,?,?,?,?,?,?,?,?,?,?,?);`;

  let values=[data.project_id,data.event_code,data.event_name,data.send_email,data.send_sms,data.send_push,data.content_email,
    data.content_sms,data.content_push,data.status,datetime,data.created_by];

  try{
    resp = await pool.query(stmt,values);
    final_res = {
      status: resp.insertId > 0 ? true : false,
      err_code:resp.insertId > 0 ? "ERROR:0":"ERROR:1",
      message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
      data: [{insertId:resp.insertId}]
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

NotificationEngine.updateNotificationEngine = async(data,result)=>{
  //;
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt=`update notification_engine_mst set project_id=?, event_code=?,event_name=?,send_email=?,send_sms=?,send_push=?,
    content_email=?,content_sms=?,content_push=?,status=?,modified_date=?,modified_by=? where id=?;`;

  let values=[data.project_id,data.event_code,data.event_name,data.send_email,data.send_sms,data.send_push,data.content_email,
    data.content_sms,data.content_push,data.status,datetime,data.modify_by,data.id];

  try{
    resp = await pool.query(stmt,values);
    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ? "ERROR:0":"ERROR:1",
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{updateId:data.id}]
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

NotificationEngine.deleteNotificationEngine = async(id,modify_by,result)=>{
  //;
  var datetime = new Date();
  let resp;
  let final_res;
  let stmt = `update notification_engine_mst set status='D',modified_by=${modify_by},
  modified_date=? where id=${id};`;
  try {
    resp = await pool.query(stmt,datetime);
    
    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data:[{deletedId:id}]
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



NotificationEngine.testSms = async (result)=>{
  //;
  let datetime = _utility.convertDatetimeToStringYYYYMMDDHHMMSS();

  let resp;
  let queryResp;
  let final_res;
  let countryCode;
  let queries='';
  let responseArray=[];

  let stmt = `SELECT nl.id,nl.notification_message, um.mobile 
  FROM notification_log nl INNER JOIN user_mst_new um	ON nl.user_id = um.id
  where nl.notification_type='SMS' and nl.status='N';`;
  
  try {
    resp = await pool.query(stmt);

    if (resp.length>0) {
      let id;
      let response_send_otp;
      let object;

      for(let i=0; i<resp.length; i++) {
        id = resp[i].id;
        response_send_otp = await _utility.sendSMSDynamic('send', resp[i].notification_message, resp[i].mobile,countryCode);
        //;
        //object  =  Object.assign({ id: id }, response_send_otp);
        //responseArray.push(object);

        queries +=`UPDATE notification_log SET response ='${response_send_otp.message}',
        status='${response_send_otp.status ? 'Y' : 'N'}',request_time = '${datetime}' , modified_date = '${datetime}'
        WHERE id = ${id};`
    
      }

      // responseArray.forEach(function (item) {
      //   queries +=`UPDATE notification_log SET response ='${item.message}',
      //   status='${item.status}',request_time = '${datetime}' , modified_date = '${datetime}'
      //   WHERE id = ${item.id};`
      // });

      //;
      queryResp = await pool.query(queries);
      
      final_res = {
        status: queryResp.affectedRows > 0 ? true : false,
        err_code:queryResp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
        message: queryResp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        data:[]
      }


    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `DATA_NOT_FOUND`,
        data: []
      }
    }

    

// //  update response here notification_log table 
//     try {
//       let queries='';
   
//       responseArray.forEach(function (item) {
//         queries +=`UPDATE notification_log SET response ='${item.message}',status='${item.status}',request_time='${datetime.toISOString().slice(0, 10)}'WHERE id = ${item.id};`
//       });
//       queryResp = await pool.query(queries);
//       }
    
//     catch (err) {

//       final_res = {
//         status: false,
//         err_code: `ERROR : ${err.code}`,
//         message: `ERROR : ${err.message}`,
//         data: []
//       }
//     }
  
//     final_res = {
//       status: queryResp.affectedRows > 0 ? true : false,
//       err_code:queryResp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
//       message: queryResp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
//       data:[]
//     }
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
NotificationEngine.schedulerSms = async(event_code,user_id,datalist,result)=>{
  //;
  let datetime = _utility.convertDatetimeToStringYYYYMMDDHHMMSS();
  let resp;
  let final_res;
  let content_sms_edit;
  let stmt = `SELECT id, project_id, event_code,send_sms,send_push,content_sms,content_push,
  content_sms,content_push,send_immediate FROM notification_engine_mst 
  where event_code='${event_code}';`;
  
  try {
    resp = await pool.query(stmt);
    if(resp.length > 0) {
      stmt = '';
      let smsContenttxt =''

      for(let i=0; i<resp[0].content_sms.length; i++) {
      if(resp[0].content_sms.indexOf('<v'+i+'>') > -1) {
       if( datalist.length > 0) {
          var arr = datalist.split("$");
         content_sms_edit=resp[0].content_sms.replace('<v'+i+'>',arr[i]);
         // arr=data2;
       //  console.log('data2',content_sms_edit)


       }
        }
      }

      if(resp[0].send_sms == 1 && resp[0].send_immediate == "N"){
        stmt+= `insert into notification_log(project_id,notification_engine_id,event_code,notification_type,notification_message,is_resent,status,
          user_id,created_by,created_date) values(${resp[0].project_id},${resp[0].id},'${resp[0].event_code}','SMS','${content_sms_edit}','N','N',${user_id},${user_id},'${datetime}');`
         // values=[resp[0].project_id,resp[0].id,resp[0].event_code,'SMS',resp[0].content_sms,'N','N',user_id,user_id,datetime]
          
      }
      // if(resp[0].send_sms == 1 && resp[0].send_immediate == "Y"){

      //   stmt+= `insert into notification_log(project_id,notification_engine_id,event_code,notification_type,notification_message,is_resent,status,
      //     user_id,created_by,created_date) values(${resp[0].project_id},${resp[0].id},'${resp[0].event_code}','SMS','${resp[0].content_sms}','N','N',${user_id},${user_id},'${datetime}');`
        
          
      // }
      if(resp[0].send_push == 1){
        stmt += `insert into notification_log(project_id,notification_engine_id,event_code,notification_type,notification_message,is_resent,status,
          user_id,created_by,created_date) values(${resp[0].project_id},${resp[0].id},'${resp[0].event_code}','PUSH','${resp[0].content_push}','N','N',${user_id},${user_id},'${datetime}');`
         // values=[resp[0].project_id,resp[0].id,resp[0].event_code,'PUSH',resp[0].content_push,'N','N',user_id,user_id,datetime]
    
      }
       

      queryResp = await pool.query(stmt);

      final_res = {
        status: queryResp[0].affectedRows > 0 ? true : false,
        err_code:queryResp[0].affectedRows > 0 ?"ERROR:0":"ERROR:1",
        message: queryResp[0].affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        data:[]
      }
      }

      else
      { final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `DATA_NOT_FOUND`,
        data: []
      }}
    
   
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


module.exports = {
  Master: Master,
  Country: Country,
  Master_Config:Master_Config,
  State: State,
  City: City,
  ChargerConfigurationKey: ChargerConfigurationKey,
  Question: Question,
  StatePIN: StatePIN,
  NotificationEngine:NotificationEngine
};