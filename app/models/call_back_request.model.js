const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");
// const charger = require("../models/charger.model");

const CBR = function (cbr) {
  this.id = cbr.id;
  this.user_id = cbr.user_id;
  this.question_id = cbr.question_id;
  this.source_app = cbr.source_app;
  this.name = cbr.name;
  this.mobile = cbr.mobile;
  this.email = cbr.email;
  this.date = cbr.date;
  this.remarks = cbr.remarks;
  this.status = cbr.status;
  this.closed_by = cbr.closed_by;
  this.closed_date = cbr.closed_date;
};


CBR.getCallHistory = async (params, result) => {

  let final_res;
  let resp;
  let whereClause =``;

  //;
  if (!!params.user_id) {
    whereClause = ` and cbrl.user_id = ${params.user_id} `;
  } 
  
  if (!!params.mobile && whereClause !='' )  {
    whereClause = ` ${whereClause} and cbrl.mobile = ${params.mobile} `;
  } else if (!!params.mobile) {
    whereClause = ` and cbrl.mobile = ${params.mobile} `;
  }
  
  if (!!params.source_app && whereClause !='' )  {
    whereClause = ` ${whereClause} and cbrl.source_app = '${params.source_app}' `;
  } else if (!!params.source_app) {
    whereClause = ` and cbrl.source_app = '${params.source_app}' `;
  }

  let stmt =`select cbrl.id ,cbrl.user_id,cbrl.question_id ,cbrl.source_app, qm.question ,cbrl.name ,cbrl.mobile ,
  cbrl.email ,cbrl.date ,cbrl.remarks,cbrl.agent_remarks,
  cbrl.status ,cbrl.closed_by ,cbrl.closed_date 
  from call_back_request_log cbrl inner join question_mst qm on cbrl.question_id = qm.id
  where cbrl.status = '${params.status}'  ${whereClause} 
  order by cbrl.id desc `;

  try {
   
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count : resp.length,
      data: resp
    }
  } catch (err) {
  
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count : 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

CBR.getAllCallHistory = async (params, result) => {

  let final_res;
  let resp;
  // let whereClause =``;

  // if (params.user_id>0) {
  //   whereClause = ` cbrl.user_id = ${params.user_id} `;
  // } else {
  //   whereClause = ` cbrl.mobile = ${params.mobile} `;
  // }

  let stmt =` select cbrl.id ,cbrl.user_id,cbrl.question_id,cbrl.source_app , qm.question ,cbrl.name ,cbrl.mobile ,
    cbrl.email ,cbrl.date ,cbrl.remarks,cbrl.agent_remarks,
    cbrl.status ,cbrl.closed_by ,umn.f_name ,cbrl.closed_date 
    from call_back_request_log cbrl inner join question_mst qm on cbrl.question_id = qm.id
    left join user_mst_new umn on cbrl.closed_by = umn.id
    order by cbrl.id desc `;

  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count : resp.length,
      data: resp
    }
  } catch (err) {
  
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count : 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

CBR.createRequest = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let values = [];

  let stmt =`insert into call_back_request_log (user_id ,question_id,source_app ,name ,mobile ,email ,date ,remarks ,
    status ,created_date,createdby ) VALUES (?,?,?,?,?,?,?,?,?,?,?) `;
  
  values = [params.user_id,params.question_id,params.source_app,params.name,params.mobile,
    params.email,params.date,params.remarks,params.status,datetime,params.createdby ];

  try {
    
    resp = await pool.query(stmt,values);

    final_res = {
      status: resp.insertId > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
      count : 1,
      data: [{id : resp.insertId}]
    }
  } catch (err) {
    
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count : 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

CBR.closeRequest = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let values = [];

  let stmt =`update call_back_request_log  set  
  status = 'C' ,agent_remarks =?, closed_by=?, closed_date=? 
   where id = ? `;

  values = [params.remarks,params.closed_by,datetime,params.id ];

  try {
    
    resp = await pool.query(stmt,values);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count : 1,
      data: []
    }
  } catch (err) {
    
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count : 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};


module.exports = { CBR };