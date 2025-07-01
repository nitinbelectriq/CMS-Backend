const {sql,pool} = require("./db.js");
const _utility = require("../utility/_utility");

// constructor
const Cpo = function(cpo) {
  this.id = cpo.id ,
  this.client_id = cpo.client_id ,
  this.name = cpo.name ,
  this.description = cpo.description,
  this.gst_no=cpo.gst_no,
  this.tin_no=cpo.tin_no,
  this.address = cpo.address,
  this.logoPath = cpo.logoPath,
  this.mobile = cpo.mobile,
  this.email = cpo.email,

  this.address1  = cpo.address1 ;
  this.address2  = cpo.address2 ;
  this.PIN  = cpo.PIN ;
  this.landmark  = cpo.landmark ;
  this.city_id  = cpo.city_id ;
  this.state_id  = cpo.state_id ;
  this.country_id  = cpo.country_id ;

  this.cp_name = cpo.cp_name,
  this.status = cpo.status ,
  this.created_date = cpo.created_date ,
  this.created_by = cpo.created_by,
  this.modify_date = cpo.modify_date ,
  this.modify_by = cpo.modify_by
};

Cpo.create = async (newCpo, result) => {
  const datetime = new Date().toISOString().slice(0, 10);
  const stmt = `
    INSERT INTO cpo_mst (
      client_id, name, description, gst_no, tin_no,
      address1, address2, PIN, landmark, city_id,
      state_id, country_id, logoPath, mobile, email,
      cp_name, status, created_date, createdby
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newCpo.client_id,
    newCpo.name,
    newCpo.description,
    newCpo.gst_no,
    newCpo.tin_no,
    newCpo.address1,
    newCpo.address2,
    newCpo.PIN,
    newCpo.landmark,
    newCpo.city_id,
    newCpo.state_id,
    newCpo.country_id,
    newCpo.logoPath,
    newCpo.mobile,
    newCpo.email,
    newCpo.cp_name,
    newCpo.status,
    datetime,
    newCpo.created_by
  ];

  try {
    const resp = await pool.query(stmt, values);
    result(null, {
      status: resp.insertId > 0,
      err_code: `ERROR : 0`,
      message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: resp.insertId }]
    });
  } catch (err) {
    result(null, {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    });
  }
};


Cpo.update = async (newCpo, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update cpo_mst set 
  client_id = ${newCpo.client_id},
  name = '${newCpo.name}',description = '${newCpo.description}',
  gst_no = '${newCpo.gst_no}',tin_no = '${newCpo.tin_no}',
  address1='${newCpo.address1}'  ,address2 ='${newCpo.address2}' ,PIN =${newCpo.PIN} ,
  landmark ='${newCpo.landmark}' ,city_id=${newCpo.city_id} ,state_id=${newCpo.state_id} ,
  country_id=${newCpo.country_id} ,
  logoPath = '${newCpo.logoPath}',mobile = '${newCpo.mobile}',email = '${newCpo.email}',
  cp_name = '${newCpo.cp_name}',status = '${newCpo.status}',
  modifyby = ${newCpo.modify_by},modify_date = '${datetime.toISOString().slice(0,10)}' 
  where id =  ${newCpo.id}`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count : 1,
      data: [{id:newCpo.id}]
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

  // sql.query(stmt, (err, res) => {
    
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   result(null, { id: res.insertId, ...newCpo });
  // });
};

 Cpo.getCpos = result => {

    let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      inner join city_mst city on cpom.city_id = city.id
      inner join state_mst sm on cpom.state_id = sm.id
      inner join country_mst country on cpom.country_id = country.id
      where cpom.status <> 'D'
      order by cpom.id desc`;

      
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


 Cpo.getCposCW = async (login_id,result) => {

    // let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    // cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    // cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
    //   cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,
    //   cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    //   from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    //   inner join city_mst city on cpom.city_id = city.id
    //   inner join state_mst sm on cpom.state_id = sm.id
    //   inner join country_mst country on cpom.country_id = country.id
    //   where cpom.status <> 'D'
    //   order by cpom.id desc`;

    let stmt='';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

  if(isSA){

    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
      cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
      cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      inner join city_mst city on cpom.city_id = city.id
      inner join state_mst sm on cpom.state_id = sm.id
      inner join country_mst country on cpom.country_id = country.id
      where cpom.status <> 'D'
      order by cpom.id desc`;
  }else{
    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
    cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
    cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    inner join city_mst city on cpom.city_id = city.id
    inner join state_mst sm on cpom.state_id = sm.id
    inner join country_mst country on cpom.country_id = country.id
    where cpom.status <> 'D' and cpom.client_id = ${client_id}
    order by cpom.id desc`;
  }

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
 Cpo.getActiveCposCW = async (login_id,result) => {

    // let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    // cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    // cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
    //   cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,
    //   cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    //   from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    //   inner join city_mst city on cpom.city_id = city.id
    //   inner join state_mst sm on cpom.state_id = sm.id
    //   inner join country_mst country on cpom.country_id = country.id
    //   where cpom.status <> 'D'
    //   order by cpom.id desc`;

    let stmt='';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

  if(isSA){

    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
      cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
      cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      inner join city_mst city on cpom.city_id = city.id
      inner join state_mst sm on cpom.state_id = sm.id
      inner join country_mst country on cpom.country_id = country.id
      where cpom.status = 'Y'
      order by cpom.id desc`;
  }else{
    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
    cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
    cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    inner join city_mst city on cpom.city_id = city.id
    inner join state_mst sm on cpom.state_id = sm.id
    inner join country_mst country on cpom.country_id = country.id
    where cpom.status = 'Y' and cpom.client_id = ${client_id}
    order by cpom.id desc`;
  }

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

  Cpo.getCpoById = (id, result) => {

    let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,
    cpom.city_id , city.name as city_name, cpom.state_id, sm.name as state_name, cpom.country_id, country.name as country_name,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      inner join city_mst city on cpom.city_id = city.id
      inner join state_mst sm on cpom.state_id = sm.id
      inner join country_mst country on cpom.country_id = country.id
      WHERE cpom.id = ? `;
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

  Cpo.getCpoByClientId = (client_id, result) => {

    let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      WHERE cpom.client_id = ? and cpom.status <> 'D'`;
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

  Cpo.getActiveCposByClientId = async (client_id, result) => {

    // let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    // cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
    //   cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
    //   cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    //   from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    //   WHERE cpom.client_id = ? and cpom.status = 'Y'`;

    // sql.query(stmt, client_id, (err, res) => {
    //   if (err) {
    //     result(null, err);
    //     return;
    //   }
  
    //   if (res.affectedRows == 0) {
    //     // not found Customer with the id
    //     result({ kind: "not_found" }, null);
    //     return;
    //   }
  
    //   result(null, res);
    // });

    let stmt='';
  let resp;
  let final_res;
  
    // stmt = `select cmc.client_id , cmc.booking_allowed, cmc.payment_allowed, 
    // cmc.reward_allowed,cmc.penalty_allowed,cmc.otp_authentication,cmc.invoice_allowed,
    // cmc.status,cmc.created_date,cmc.created_by , cm.id,  cm.name,cm.description
    // from client_module_config cmc inner join client_mst cm on cmc.client_id=cm.id and cm.status='Y'
    // where cmc.id = ? `;

    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
      cpom.address1, cpom.address2, cpom.PIN, cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.id as cpo_id, cpom.name as cpo_name,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      WHERE cpom.client_id = ? and cpom.status = 'Y'`;

  try {
    resp = await pool.query(stmt,[client_id]);
    
    if (resp.length > 0) {
      final_res = {
        status: true,
        message:  'DATA_FOUND' ,
        count: resp.length,
        data: resp
      }
    }else{
      final_res = {
        status: false,
        message:  'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
    }

  } catch (err) {
    final_res = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

  };

  Cpo.getCpoByClientIdCW = async (client_id,user_id, result) => {
    let stmt='';
    let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
    // let client_id = clientAndRoleDetails.data[0].client_id;
    //let role_code = clientAndRoleDetails.data[0].role_code;
    let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;
    if(isSA){

    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      WHERE cpom.status <> 'D'`;

  }else{
    stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
      cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,cpom.gst_no,cpom.tin_no,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      WHERE cpom.client_id = ${client_id} and cpom.status <> 'D'`;
  }
    // let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,
    // cpom.address1  ,cpom.address2  ,cpom.PIN  ,cpom.landmark  ,cpom.city_id ,cpom.state_id ,cpom.country_id ,
    //   cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,
    //   cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    //   from cpo_mst cpom inner join client_mst cm on cpom.client_id = cm.id
    //   WHERE cpom.client_id = ? and cpom.status <> 'D'`;
    sql.query(stmt, (err, res) => {
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

  Cpo.delete = (id, result) => {

    let stmt = `Update cpo_mst set status = 'D' WHERE id = ?`;
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

 module.exports = {
  Cpo: Cpo
};