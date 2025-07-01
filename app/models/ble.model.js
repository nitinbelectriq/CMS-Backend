const { sql, pool,poolMG } = require("./db.js");
const _utility = require("../utility/_utility");
// const { param } = require("../../server4000.js");

// constructor
const Ble = function (ble) {
  this.id = ble.id,
  this.user_id = ble.user_id,
  this.user_name = ble.user_name,
  this.chargerid = ble.chargerid,
  this.starttime = ble.starttime,
  this.stoptime = ble.stoptime,
  this.consumed = ble.consumed,
  this.created_at = ble.created_at
};

Ble.getBLELogs = async (params, result) => {
  let final_res;
  let resp;
  let stmt = '';

  let f_date = params.f_date == null ? "" : params.f_date.trim();
  let t_date = params.t_date == null ? "" : params.t_date.trim();
  

  if (f_date !== "") {
    if (!_utility.validateDate(f_date)) {
      final_res = {
        status:  false,
        err_code: `ERROR : 0`,
        message: 'Invalid parameter'
      }
      result(final_res);
      return;
    }
  }else{
    final_res = {
      status:  false,
      err_code: `ERROR : 0`,
      message: 'Invalid parameter'
    }
    result(final_res);
    return;
  }
  if (t_date !== "") {
    if (!_utility.validateDate(t_date)) {
      final_res = {
        status:  false,
        err_code: `ERROR : 0`,
        message: 'Invalid parameter'
      }
      result(final_res);
      return;
    }
  }else{
    final_res = {
      status:  false,
      err_code: `ERROR : 0`,
      message: 'Invalid parameter'
    }
    result(final_res);
    return;
  }



  stmt = `SELECT ls.id as session_id,ls.user_id, us.name as user_name ,chargerid,starttime,
  stoptime,consumed,ls.created_at  
  FROM logs_sessions ls inner join users us on ls.user_id=us.id
  where Date(ls.created_at) between ${f_date} and ${t_date}
  order by ls.created_at desc;`;

  try {

    resp = await poolMG.query(stmt);
    
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


module.exports = {
  Ble: Ble
};