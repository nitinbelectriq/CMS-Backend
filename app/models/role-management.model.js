const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");
const Role = function (role) {
  this.id = role.id;
  this.code = role.code;
  this.name = role.name;
  this.description = role.description;
  this.project_id = role.project_id,
  this.client_id = role.client_id,  
  this.status = role.status;
  this.created_date = role.created_date;
  this.created_by = role.created_by;
  this.modify_date = role.modify_date;
  this.modify_by = role.modify_by;
};

Role.create = async (newRole, result) => {
  var datetime = new Date();

  let stmt3 = ` select client_id,project_id,status from role_mst 
    where client_id =${newRole.client_id} and code='${newRole.code}'
    and project_id=${newRole.project_id} and  status='Y'`;


  let stmt = `insert into role_mst (code,name,description,project_id,client_id,status,
      created_date,createdby )
      VALUES ('${newRole.code}','${newRole.name}','${newRole.description}','${newRole.project_id}',       
      '${newRole.client_id}','${newRole.status}',?,${newRole.created_by}) `;

  try {
    resp3 = await pool.query(stmt3)

    if (resp3.length > 0) {
      final_res = {
        status: false,
        message: 'DUPLICATE',
        data: []
      }
    } else {
      resp = await pool.query(stmt, [datetime]);

      final_res = {
        status: true,
        message: 'SUCCESS',
        data: []
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

};

Role.update = async (newRole, result) => {
  var datetime = new Date();

  let stmt3 = ` select client_id,project_id,status from role_mst 
    where client_id =${newRole.client_id} and code='${newRole.code}'
    and project_id=${newRole.project_id} and  status='Y' and id <>${newRole.id} `;

  let stmt = `update role_mst set 
  project_id = ${newRole.project_id},client_id = ${newRole.client_id},
  code='${newRole.code}',name = '${newRole.name}',description = '${newRole.description}',     
	status = '${newRole.status}',modifyby = ${newRole.modify_by},modify_date = ?
  where id =  ${newRole.id}`;

    try {

      resp3 = await pool.query(stmt3)
    if (resp3.length > 0) {
      final_res = {
        status: false,
        message: 'DUPLICATE',
        data: []
      }
    } else {
      resp = await pool.query(stmt,[datetime]);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count : 1,
        data: [{id:newRole.id}]
      }
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

Role.getRoles = result => {

  let stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
      from role_mst where status <> 'D' order by id desc;`;

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

Role.getRoleCW = async (user_id, project_id, result) => {

  let final_res;
  let resp;
  let stmt = '';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);

  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

  if (isSA) {
    stmt = `select rm.id,rm.code,rm.name,rm.description,rm.project_id,rm.client_id,cm.name as client_name,
      rm.status,rm.created_date,rm.createdby,rm.modify_date,rm.modifyby
        from role_mst rm inner join client_mst cm on rm.client_id = cm.id
        where rm.status <> 'D' and rm.project_id = ${project_id} order by rm.id desc;`;
  } else {
    // stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
    //     from role_mst where status <> 'D' and project_id = ${project_id} and client_id = ${client_id}
    //     order by id desc;`;
    stmt = `select rm.id,rm.code,rm.name,rm.description,rm.project_id,rm.client_id,cm.name as client_name,
        rm.status,rm.created_date,rm.createdby,rm.modify_date,rm.modifyby
          from role_mst rm inner join client_mst cm on rm.client_id = cm.id
          where rm.status <> 'D' and rm.project_id = ${project_id} and rm.client_id = ${client_id}
          order by rm.id desc;`     
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

Role.getActiveRoleCW = async (user_id, project_id, result) => {
  
    let final_res;
    let resp;
    let stmt = '';
    let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
  
    let client_id = clientAndRoleDetails.data[0].client_id;
    // let role_code = clientAndRoleDetails.data[0].role_code;
    let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

    // if (role_code == 'SA') {
    //   stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
    //       from role_mst where status='Y' and project_id = ${project_id} order by id desc;`;
    // } else {
    //   stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
    //       from role_mst where status='Y' and project_id = ${project_id} and client_id = ${client_id}
    //       order by id desc;`;
    // }

    if (isSA) {
      stmt = `select rm.id,rm.code,rm.name,rm.description,rm.project_id,rm.client_id,cm.name as client_name,
        rm.status,rm.created_date,rm.createdby,rm.modify_date,rm.modifyby
          from role_mst rm inner join client_mst cm on rm.client_id = cm.id
          where rm.status = 'Y' and rm.project_id = ${project_id} order by rm.id desc;`;
    } else {
      stmt = `select rm.id,rm.code,rm.name,rm.description,rm.project_id,rm.client_id,cm.name as client_name,
          rm.status,rm.created_date,rm.createdby,rm.modify_date,rm.modifyby
            from role_mst rm inner join client_mst cm on rm.client_id = cm.id
            where rm.status = 'Y' and rm.project_id = ${project_id} and rm.client_id = ${client_id}
            order by rm.id desc;`;        
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
  
  
    // sql.query(stmt, (err, res) => {
  
    //   if (err) {
    //     result(err, null);
    //     return;
    //   }
  
    //   if (res.length) {
    //     result(null, res);
    //     return;
    //   }
  
    //   // not found Customer with the id
    //   result({ kind: "not_found" }, null);
    // });
  };

Role.getActiveRolesByClientId = async (client_id, project_id, result) => {
  
    let final_res;
    let resp;
    let stmt = '';
    //let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
  
    //let client_id = clientAndRoleDetails.data[0].client_id;
    // let role_code = clientAndRoleDetails.data[0].role_code;
    //let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

    // if (role_code == 'SA') {
    //   stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
    //       from role_mst where status='Y' and project_id = ${project_id} order by id desc;`;
    // } else {
    //   stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
    //       from role_mst where status='Y' and project_id = ${project_id} and client_id = ${client_id}
    //       order by id desc;`;
    // }

      stmt = `select rm.id,rm.code,rm.name,rm.description,rm.project_id,rm.client_id,cm.name as client_name,
          rm.status,rm.created_date,rm.createdby,rm.modify_date,rm.modifyby
            from role_mst rm inner join client_mst cm on rm.client_id = cm.id
            where rm.status = 'Y' and rm.project_id = ${project_id} and rm.client_id = ${client_id}
            order by rm.id desc;`;        
    
  
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
  
  
    // sql.query(stmt, (err, res) => {
  
    //   if (err) {
    //     result(err, null);
    //     return;
    //   }
  
    //   if (res.length) {
    //     result(null, res);
    //     return;
    //   }
  
    //   // not found Customer with the id
    //   result({ kind: "not_found" }, null);
    // });
  };

Role.getRoleById = (id, result) => {

  let stmt = `select id,code,name,description,project_id,client_id,status,created_date,createdby,modify_date,modifyby
        from role_mst where  id=? and  status <> 'D'`;
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
Role.delete = async (id,user_id, result) => {
  
  var datetime = new Date();
  let stmt = `Update role_mst set  modifyby = ${user_id},modify_date = ? , status = 'D' WHERE id = ${id}`;
  try {

    // resp = await pool.query(stmt);
    

    resp = await pool.query(stmt,[datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count : 1,
      data: [{id}]
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
module.exports = { Role };