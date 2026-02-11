const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");

// constructor
const RFid = function (rfid) {
  this.id = rfid.id,
    this.name = rfid.name,
    this.description = rfid.description,
    this.rfid_no = rfid.rfid_no,
    this.expiry_date = rfid.expiry_date,
    this.status = rfid.status,
    this.created_date = rfid.created_date,
    this.created_by = rfid.created_by,
    this.modify_date = rfid.modify_date,
    this.modify_by = rfid.modify_by,
    this.client_id = rfid.client_id,
    this.cpo_id = rfid.cpo_id,
    this.rfid_data = rfid.rfid_data
};

RFid.create = (newRfid, result) => {
  const datetime = new Date();
//;
  // SQL statement should match columns and values count
  const stmt = `
    INSERT INTO charger_rfid 
      (RF_ID_no, expiry_date, status, created_date, createdby)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    newRfid.rfid_no,     // assuming newRfid.rfid_no has RFID number
    newRfid.expiry_date,
    newRfid.status,
    datetime.toISOString().slice(0, 10),
    newRfid.created_by
  ];

  sql.query(stmt, params, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newRfid });
  });
};


RFid.update = (rfid, result) => {
  const datetime = new Date();

  const stmt = `
    UPDATE charger_rfid SET 
      rf_id_no = ?, 
      expiry_date = ?, 
      status = ?, 
      modifyby = ?, 
      modify_date = ? 
    WHERE id = ?
  `;

  const params = [
    rfid.rfid_no,
    rfid.expiry_date,
    rfid.status,
    rfid.modify_by,
    datetime.toISOString().slice(0, 10),
    rfid.id
  ];

  sql.query(stmt, params, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows === 0) {
      // No record found with the given id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: rfid.id, ...rfid });
  });
};

RFid.createCpoRfidMapping = async (data, result) => {
  try {
    const datetime = new Date().toISOString().slice(0, 10);
    const created_by = data.created_by || data.modify_by || null;

    if (!created_by) {
      return result(null, {
        status: false,
        message: "Missing created_by or modify_by user ID",
        data: []
      });
    }

    console.log('rfid_data received:', data.rfid_data);

    // Map each RFID id correctly (assumes data.rfid_data is array of numbers)
    const values = data.rfid_data.map(rfidId => [
      data.client_id,
      data.cpo_id,
      rfidId,
      data.status || 'Y',
      created_by,
      datetime
    ]);

    // Step 1: Soft delete existing mappings for this CPO
    const updateQuery = `
      UPDATE cpo_rfid_mapping 
      SET status = 'D', modify_date = ?, modifyby = ? 
      WHERE cpo_id = ?
    `;
    await pool.query(updateQuery, [datetime, created_by, data.cpo_id]);

    // Step 2: Insert new mappings
    const insertQuery = `
      INSERT INTO cpo_rfid_mapping 
        (client_id, cpo_id, rfid_id, status, createdby, created_date)
      VALUES ?
    `;
    await pool.query(insertQuery, [values]);

    // Final response
    return result(null, {
      status: true,
      message: "SUCCESS",
      data: []
    });

  } catch (error) {
    console.error("createCpoRfidMapping error:", error);
    return result(null, {
      status: false,
      message: error.message || "Database error",
      data: []
    });
  }
};



RFid.updateCpoRfidMapping = async (data, result) => {
  var datetime = new Date();
  let values = [];
  let final_response = {};
  let created_by = !!data.created_by ? data.created_by : data.modify_by

  try {
    for (let index = 0; index < data.rfid_data.length; index++) {
      values.push([data.client_id, data.cpo_id, data.rfid_data[index].id,
      data.status, created_by, datetime.toISOString().slice(0, 10)])
    }

    let stmt = `update cpo_rfid_mapping set 
      status = 'D' ,
      modify_date = '${datetime.toISOString().slice(0, 10)}' , modifyby = ${created_by} 
      where cpo_id = ${data.cpo_id}  `;

    let resp1 = await pool.query(stmt);
    //

    let stmt2 = `insert into cpo_rfid_mapping (client_id,cpo_id,rfid_id,
    status,createdby,created_date)
    values  ? `;

    let resp2 = await pool.query(stmt2, [values]);
    //

    final_response = {
      status: true,
      message: 'SUCCESS',
      data: []
    }
  } catch (error) {
    //;
    final_response = {
      status: false,
      message: error,
      data: []
    }
  } finally {

    result(null, final_response)
  }

};


RFid.getRFids = (result) => {
  const stmt = `
    SELECT 
      id, 
      name,
      description,
      rf_id_no,
      expiry_date,
      status,
      created_date,
      createdby,
      modifyby,
      modify_date
    FROM charger_rfid
    WHERE status <> 'D'
    ORDER BY id DESC
  `;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      // Format expiry_date as ISO string for each record (if expiry_date exists)
    const formattedData = res.map(row => ({
        ...row,
        // ✅ Keep expiry_date as string (no UTC conversion)
        expiry_date: row.expiry_date
          ? typeof row.expiry_date === 'string'
            ? row.expiry_date
            : new Date(row.expiry_date).toLocaleDateString('en-CA') // 'YYYY-MM-DD'
          : null,
      }));


      result(null, formattedData);
      return;
    }

    // No records found
    result({ kind: "not_found" }, null);
  });
};


RFid.getCpoRFidMappingCW = async (login_id,result) => {
  //;
  let stmt='';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;
  //;
  if(isSA){
  stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
    crm.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
    crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
    from  cpo_rfid_mapping  crm inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
    inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
    inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
    where crm.status <> 'D' 
    order by crm.id desc;`;

    }else{
      stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
      crm.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
      crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
      from  cpo_rfid_mapping  crm inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
      inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
      inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
      where crm.status <> 'D' and crm.client_id = ${client_id}
      order by crm.id desc;`;
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

RFid.getCpoRFidMappingCCS = async (params,result) => {

  let stmt='';
  // let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  // let client_id = clientAndRoleDetails.data[0].client_id;
  // // let role_code = clientAndRoleDetails.data[0].role_code;
  // let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;
  
  // if(isSA){
  // stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
  //   CRM.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
  //   crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
  //   from  cpo_rfid_mapping  crm inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
  //   inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
  //   inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
  //   where crm.status <> 'D' 
  //   order by crm.id desc;`;

  //   }else{
  //     stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
  //     CRM.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
  //     crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
  //     from  cpo_rfid_mapping  crm inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
  //     inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
  //     inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
  //     where crm.status <> 'D' and crm.client_id = ${client_id}
  //     order by crm.id desc;`;
  //   }

    if(params.cpo_id==-1){ // cpo_id == -1 => Data for All CPOs is required, it means only client_id check will be applied in select query
    
      stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
      CRM.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
      crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
      from  cpo_rfid_mapping  crm 
      inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
      inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
      inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
      where crm.status <> 'D' and crm.client_id = ${params.client_id}
      order by crm.id desc;`;
    
    }else if(params.station_id==-1){ // station_id == -1 => Data for All CPOs is required, it means only cpo_id check will be applied in select query
      
      stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
      CRM.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
      crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
      from  cpo_rfid_mapping  crm 
      inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
      inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y' and cm.id=${params.cpo_id}
      inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
      where crm.status <> 'D' and crm.client_id = ${params.client_id}
      order by crm.id desc;`;
    
    }else{
      // same as above if condition because station and rfid have no link currently
      stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
      CRM.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
      crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
      from  cpo_rfid_mapping  crm 
      inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
      inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y' and cm.id=${params.cpo_id}
      inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
      where crm.status <> 'D' and crm.client_id = ${params.client_id}
      order by crm.id desc;`;
    }  

    try {
//;
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

RFid.getRFidsByCpoId = async (cpo_id, result) => {

  let final_res;
  let resp;

  // let stmt = ` select cr.status,crm.id ,crm.client_id , cm.name as client_name,  crm.cpo_id, 
  // cpom.name as cpo_name ,cr.id as rfid_id, cr.rf_id_no as rfid_no, cr.expiry_date, 
  // crm.status ,  crm.created_date ,  crm.createdby ,  crm.modify_date,  crm.modifyby 
  // from cpo_rfid_mapping crm inner join client_mst cm on crm.client_id = cm.id and cm.status='Y'
  // inner join cpo_mst cpom on crm.cpo_id = cpom.id and cpom.status='Y'
  // inner join  charger_rfid cr on crm.rfid_id = cr.id  and cr.status='Y'
  // where crm.cpo_id = ? and crm.status<>'D' order by crm.cpo_id ;`;

  let stmt = `select crm.id as map_id,  cr.name as rfid_name ,cr.description,cr.rf_id_no,cr.expiry_date,
  crm.CLIENT_ID, cm.name as cpo_name, clm.name as client_name,crm.cpo_id,
  crm.status,crm.created_date,crm.createdby,crm.modifyby,crm.modify_date
  from  cpo_rfid_mapping  crm inner join charger_rfid cr on crm.rfid_id=cr.id  and cr.status = 'Y'
  inner join cpo_mst cm on crm.cpo_id = cm.id and cm.status = 'Y'
  inner join client_mst clm on cm.client_id = clm.id and clm.status = 'Y'
  where crm.status <> 'D' and crm.cpo_id = ?
  order by crm.id desc;`;

  try {

    resp = await pool.query(stmt,[cpo_id]);

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

RFid.getAllRFidsWithMappedCPOs = async (cpo_id, result) => {

  let stmt = ` select crm.id , crm.cpo_id,crm.id ,crm.client_id , cm.name as client_name,  crm.cpo_id, cpom.name as cpo_name ,
  cr.id as rfid_id, cr.rf_id_no as rfid_no, cr.expiry_date, 
  crm.status ,  crm.created_date ,  crm.createdby ,  crm.modify_date,  crm.modifyby
  from charger_rfid cr 
  left join cpo_rfid_mapping crm on cr.id = crm.rfid_id and crm.status='Y'
  left join client_mst cm on crm.client_id = cm.id and cm.status='Y'
  left join  cpo_mst cpom on crm.cpo_id = cpom.id and cpom.status='Y'
   where cr.status ='Y' and (crm.cpo_id = ? or crm.cpo_id is null) ;`;

  let final_res;
  let resp;

  try {
    resp = await pool.query(stmt, [cpo_id]);
    final_res = {
      status: true,
      message: 'DATA_FOUND',
      count : resp.length,
      data: resp
    }
  } catch (error) {
    final_res = {
      status: false,
      message: 'DATA_NOT_FOUND',
      count : 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

RFid.getRFno_ById = (id, result) => {

  let stmt = `select id,  name,description,rf_id_no,expiry_date
    status,created_date,createdby,modifyby,modify_date
      from charger_rfid
      WHERE id = ?`;
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

RFid.delete = (id,user_id, result) => {
  var datetime = new Date();
  let stmt = `Update charger_rfid set status = 'D' ,
  modify_date = ? , modifyby = ?
  WHERE id = ?`;

  sql.query(stmt, [datetime,user_id,id], (err, res) => {
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


RFid.unMapRFidCpoID = async (id,user_id, result) => {
  var datetime = new Date();
  let stmt = `Update cpo_rfid_mapping set status = 'D' ,
  modify_date = ? , modifyby = ?
  WHERE id = ? `;

  let final_res;
  let resp;

  try {
    resp = await pool.query(stmt, [datetime,user_id,id]);

    if (resp.affectedRows > 0) {
      final_res = {
        status: true,
        message: 'DELETED',
        data: []
      }
    } else {
      final_res = {
        status: false,
        message: 'DATA_NOT_FOUND',
        data: []
      }
    }

  } catch (error) {
    //
    final_res = {
      status: false,
      message: 'DATA_NOT_FOUND',
      data: []
    }
  } finally {
    //  
    result(null, final_res);
  }
};


RFid.createUserRfidMapping = async (data, result) => {
  try {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const created_by = data.created_by || data.modify_by;

    if (!created_by) {
      return result(null, {
        status: false,
        message: "created_by missing",
        data: []
      });
    }

    // ✅ CHECK RFID USED BY SOMEONE ELSE
    for (const rfid of data.rfid_data) {

      // other USER
      const userCheck = await pool.query(`
        SELECT user_id 
        FROM user_rfid_mapping 
        WHERE rfid_id=? AND status <> 'D'
      `, [rfid]);

      if (userCheck.length && userCheck[0].user_id !== data.user_id) {
        return result(null, {
          status: false,
          message: `RFID already assigned to another USER`,
          data: []
        });
      }

      // any CPO
      const cpoCheck = await pool.query(`
        SELECT cpo_id 
        FROM cpo_rfid_mapping 
        WHERE rfid_id=? AND status <> 'D'
      `, [rfid]);

      if (cpoCheck.length) {
        return result(null, {
          status: false,
          message: `RFID already assigned to a CPO`,
          data: []
        });
      }
    }

    // ✅ SAFE → NOW DELETE OLD
    await pool.query(`
      UPDATE user_rfid_mapping 
      SET status='D', modify_date=?, modifyby=? 
      WHERE user_id=? AND status <> 'D'
    `, [datetime, created_by, data.user_id]);

    // ✅ INSERT
    const values = data.rfid_data.map(rfid => [
      data.user_id,
      rfid,
      data.status || 'Y',
      created_by,
      datetime
    ]);

    await pool.query(`
      INSERT INTO user_rfid_mapping
      (user_id, rfid_id, status, createdby, created_date)
      VALUES ?
    `, [values]);

    result(null, { status: true, message: "SUCCESS", data: [] });

  } catch (error) {
    console.error("createUserRfidMapping:", error);
    result(null, { status: false, message: error.message, data: [] });
  }
};

RFid.updateUserRfidMapping = async (data, result) => {
  try {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const modify_by = data.modify_by || data.created_by;

    if (!modify_by) {
      return result(null, {
        status: false,
        message: "modify_by missing",
        data: []
      });
    }

    // ✅ CHECK RFID USED BY SOMEONE ELSE
    for (const rfid of data.rfid_data) {

      // check other USER
      const userCheck = await pool.query(`
        SELECT user_id 
        FROM user_rfid_mapping 
        WHERE rfid_id=? AND status <> 'D'
      `, [rfid]);

      if (userCheck.length && userCheck[0].user_id !== data.user_id) {
        return result(null, {
          status: false,
          message: `RFID already assigned to another USER`,
          data: []
        });
      }

      // check CPO
      const cpoCheck = await pool.query(`
        SELECT cpo_id 
        FROM cpo_rfid_mapping 
        WHERE rfid_id=? AND status <> 'D'
      `, [rfid]);

      if (cpoCheck.length) {
        return result(null, {
          status: false,
          message: `RFID already assigned to a CPO`,
          data: []
        });
      }
    }

    // ✅ SAFE → DELETE OLD
    await pool.query(`
      UPDATE user_rfid_mapping 
      SET status='D', modify_date=?, modifyby=? 
      WHERE user_id=? AND status <> 'D'
    `, [datetime, modify_by, data.user_id]);

    // ✅ INSERT NEW
    const values = data.rfid_data.map(rfid => [
      data.user_id,
      rfid,
      data.status || 'Y',
      modify_by,
      datetime
    ]);

    await pool.query(`
      INSERT INTO user_rfid_mapping
      (user_id, rfid_id, status, createdby, created_date)
      VALUES ?
    `, [values]);

    result(null, { status: true, message: "UPDATED", data: [] });

  } catch (error) {
    console.error("updateUserRfidMapping:", error);
    result(null, { status: false, message: error.message, data: [] });
  }
};


RFid.getUserRFidMapping = async (login_id, result) => {
  let final_res;
  let resp;

  try {
    resp = await pool.query(`
      SELECT 
        urm.id as map_id,
        u.id as user_id,
        CONCAT(u.f_Name,' ',u.l_Name) as user_name,
        cr.id as rf_id,
        cr.rf_id_no,
        cr.description,
        cr.expiry_date,
        urm.status,
        urm.created_date,
        urm.createdby,
        urm.modify_date,
        urm.modifyby
      FROM user_rfid_mapping urm
      INNER JOIN user_mst_new u ON u.id = urm.user_id AND u.status='Y'
      INNER JOIN charger_rfid cr ON cr.id = urm.rfid_id AND cr.status='Y'
      WHERE urm.status <> 'D'
      ORDER BY urm.id DESC
    `);

    final_res = resp;

  } catch (error) {
    final_res = [];
  } finally {
    result(null, final_res);
  }
};
RFid.getRFidsByUserId = async (user_id, result) => {
  try {
    const resp = await pool.query(`
      SELECT rfid_id
      FROM user_rfid_mapping
      WHERE user_id=? AND status <> 'D'
    `, [user_id]);

    result(null, resp);

  } catch (error) {
    result({ kind: "not_found" }, null);
  }
};
RFid.deleteUserRfidMapping = async (id, user_id, result) => {
  try {
    const datetime = new Date();

    const resp = await pool.query(`
      UPDATE user_rfid_mapping
      SET status='D', modify_date=?, modifyby=?
      WHERE id=?
    `, [datetime, user_id, id]);

    if (resp.affectedRows > 0) {
      result(null, { status: true, message: "DELETED" });
    } else {
      result(null, { status: false, message: "NOT_FOUND" });
    }

  } catch (error) {
    result(null, { status: false, message: error.message });
  }
};

RFid.checkRfidUsage = async (rfid_id, result) => {
  try {

    // Check in USER mapping
    const userResp = await pool.query(`
      SELECT u.id, CONCAT(u.f_name,' ',u.l_name) as name
      FROM user_rfid_mapping urm
      INNER JOIN user_mst_new u ON u.id = urm.user_id
      WHERE urm.rfid_id = ? AND urm.status <> 'D'
      LIMIT 1
    `, [rfid_id]);

    if (userResp.length) {
      return result(null, {
        used: true,
        mapped_to: 'USER',
        name: userResp[0].name
      });
    }

    // Check in CPO mapping
    const cpoResp = await pool.query(`
      SELECT cm.name
      FROM cpo_rfid_mapping crm
      INNER JOIN cpo_mst cm ON cm.id = crm.cpo_id
      WHERE crm.rfid_id = ? AND crm.status <> 'D'
      LIMIT 1
    `, [rfid_id]);

    if (cpoResp.length) {
      return result(null, {
        used: true,
        mapped_to: 'CPO',
        name: cpoResp[0].name
      });
    }

    // free
    return result(null, {
      used: false
    });

  } catch (error) {
    return result(error, null);
  }
};


module.exports = {
  RFid: RFid
};