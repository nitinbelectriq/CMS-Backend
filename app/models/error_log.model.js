const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");
const Error = function (error){
    this.id = error.id ,
    this.username= error.username,  
    this.email=error.email,
    this.device_id=error.device_id,
    this.app_version=error.app_version,
    this.os_version=error.os_version,
    this.activity_name=error.activity_name,
    this.application_plateform=error.application_plateform,
    this.application_name=error.application_name,
    this.project_id=error.project_id,
    this.api_parameters=error.api_parameters,
    this.url=error.url,
    this.error_code=error.error_code,
    this.error_discription=error.error_discription,    
    this.status=error.status ,
    this.created_date=error.created_date ,
    this.created_by=error.created_by,
    this.modify_date =error.modify_date ,
    this.modify_by = error.modify_by
  };
  Error.errorLog = async (newlog, result) => {

    var datetime = new Date();
    let final_res;
    let resp;
    let values = [];
 
      let stmt=`insert into error_log (user_id,username,email,device_id,app_version,os_version,
        activity_name,project_id,application_name,application_platform,url,api_parameters,
        status,error_code,error_discription,created_date,createdby )
        VALUES (${newlog.created_by},'${newlog.username}','${newlog.email}',
        '${newlog.device_id}','${newlog.app_version}','${newlog.os_version}','${newlog.activity_name}','${newlog.project_id}','${newlog.application_name}','${newlog.application_plateform}','${newlog.url}','${newlog.api_parameters}',
        '${newlog.status}','${newlog.error_code}','${newlog.error_discription}','${datetime.toISOString().slice(0,19)}',${newlog.created_by})`;
  
        try {
            
            resp = await pool.query(stmt);
        
            final_res = {
              status: resp.insertId > 0 ? true : false,
              err_code: `ERROR : 0`,
              message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
              count : 1,
              data: [{id:resp.insertId}]
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

  Error.getAllErrorLog = async (params, result) => {

    let final_res;
    let resp;
    
    let stmt =`SELECT el.id,el.user_id,el.username,el.email,el.device_id,el.app_version,
    el.os_version,el.activity_name,el.project_id,pm.code as project_code,pm.name as project_name,
    el.application_name,el.application_platform,el.url,el.api_parameters,el.status,
    el.error_code,el.error_discription,el.created_date,el.createdby,el.modify_date,el.modifyby 
    FROM error_log el inner join project_mst pm on el.project_id=pm.id 
    order by el.id desc `;
  
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
  module.exports = { Error };