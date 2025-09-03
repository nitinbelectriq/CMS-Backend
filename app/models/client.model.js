const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");

// constructor
const Client = function (client) {
  this.id = client.id,
    this.name = client.name,
    this.description = client.description,
    this.gst_no=client.gst_no,
    this.tin_no=client.tin_no,
    this.address = client.address,
    this.logoPath = client.logoPath,
    this.mobile = client.mobile,
    this.email = client.email,

    this.address1 = client.address1;
  this.address2 = client.address2;
  this.PIN = client.PIN;
  this.landmark = client.landmark;
  this.city_id = client.city_id;
  this.state_id = client.state_id;
  this.country_id = client.country_id;

  this.cp_name = client.cp_name,
    this.status = client.status,
    this.created_date = client.created_date,
    this.created_by = client.created_by,
    this.modify_date = client.modify_date,
    this.modify_by = client.modify_by,
    this.bank= client.bank ,
    this.ifsc= client.ifsc ,
    this.account= client.account ,
    this.account_holder_name= client.account_holder_name 
};

const ClientModuleMapping = function (clientModuleMapping) {
  this.id = clientModuleMapping.id,
  this.client_id = clientModuleMapping.client_id,
  this.booking_allowed = clientModuleMapping.booking_allowed,
  this.payment_allowed=clientModuleMapping.payment_allowed,
  this.reward_allowed=clientModuleMapping.reward_allowed,
  this.penalty_allowed=clientModuleMapping.penalty_allowed,
  this.otp_authentication=clientModuleMapping.otp_authentication,
  this.invoice_allowed=clientModuleMapping.invoice_allowed,
  this.status = clientModuleMapping.status,
  this.created_date = clientModuleMapping.created_date,
  this.created_by = clientModuleMapping.created_by,
  this.modify_date = clientModuleMapping.modify_date,
  this.modified_by = clientModuleMapping.modified_by
};

Client.create = async (newClient, result) => {
  let final_res;
  let resp;

  // Call stored procedure with bank details added at the end
  let stmt = `call pCMSAddClient(
    '${newClient.name}',
    '${newClient.description}',
    '${newClient.gst_no}',
    '${newClient.tin_no}',
    '${newClient.address1}',
    '${newClient.address2}',
    ${newClient.PIN},
    '${newClient.landmark}',
    ${newClient.city_id},
    ${newClient.state_id},
    ${newClient.country_id},
    '${newClient.logoPath}',
    '${newClient.mobile}',
    '${newClient.email}',
    '${newClient.cp_name}',
    '${newClient.status}',
    ${newClient.created_by},
    '${newClient.bank || ''}',
    '${newClient.ifsc || ''}',
    '${newClient.account || ''}',
    '${newClient.account_holder_name || ''}',
    @OP_ErrorCode,
    @OP_ErrorDetail
  );
  select @OP_ErrorCode as OP_ErrorCode, @OP_ErrorDetail as OP_ErrorDetail`;

  try {
    resp = await pool.query(stmt);

    if (resp.length == 2) {
      final_res = {
        status: resp[1][0].OP_ErrorCode > 0,
        err_code: `ERROR : 0`,
        message: resp[1][0].OP_ErrorCode > 0 ? 'SUCCESS' : 'FAILED',
        count: 1,
        data: [{ id: resp[1][0].OP_ErrorCode }]
      };
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : UNKNOWN`,
        message: 'Unexpected response',
        count: 0,
        data: []
      };
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};

Client.update = async (newClient, result) => {
  let final_res;
  let resp;
//;
  // Escape and handle nulls safely
  const escape = (val) => (val !== undefined && val !== null ? `'${val}'` : 'NULL');

  const stmt = `
    CALL pCMSUpdateClient(
      ${escape(newClient.id)},
      ${escape(newClient.name)},
      ${escape(newClient.description)},
      ${escape(newClient.gst_no)},
      ${escape(newClient.tin_no)},
      ${escape(newClient.address1)},
      ${escape(newClient.address2)},
      ${newClient.PIN || 0},
      ${escape(newClient.landmark)},
      ${newClient.city_id || 0},
      ${newClient.state_id || 0},
      ${newClient.country_id || 0},
      ${escape(newClient.logoPath)},
      ${escape(newClient.mobile)},
      ${escape(newClient.email)},
      ${escape(newClient.cp_name)},
      ${escape(newClient.status)},
      ${newClient.modify_by || 0},
      ${escape(newClient.bank || '')},
      ${escape(newClient.ifsc || '')},
      ${escape(newClient.account || '')},
      ${escape(newClient.account_holder_name || '')},
      @OP_ErrorCode,
      @OP_ErrorDetail
    );
    SELECT @OP_ErrorCode AS OP_ErrorCode, @OP_ErrorDetail AS OP_ErrorDetail;
  `;

  try {
    resp = await pool.query(stmt);

    if (resp.length >= 2 && resp[1][0]) {
      const output = resp[1][0];

      final_res = {
        status: output.OP_ErrorCode > 0,
        err_code: `ERROR: ${output.OP_ErrorCode}`,
        message: output.OP_ErrorCode > 0 ? 'SUCCESS' : output.OP_ErrorDetail || 'FAILED',
        count: 1,
        data: [{ id: newClient.id }]
      };
    } else {
      final_res = {
        status: false,
        err_code: 'ERROR: UNKNOWN',
        message: 'Unexpected response from stored procedure',
        count: 0,
        data: []
      };
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR: ${err.code}`,
      message: `ERROR: ${err.message}`,
      count: 0,
      data: []
    };
  } finally {
    result(null, final_res);
  }
};



Client.getClients =async(result) => {

  // let stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status <> 'D'
  //   order by cm.id desc`;

    let qry = `call pCMSGetClients('NA', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`
    let resp;
    try {
    resp = await pool.query(qry);
      if (resp.length > 2) {
     
        result(null, resp[0]);
     
      } else {
        result({ kind: "not_found" }, null);
      }
    } catch (e) {
      //;
      result(e, null);
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


Client.getClientsCW = async (login_id,result) => {
//;
  let stmt='';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

  let qry = `call pCMSGetClient('${clientAndRoleDetails.data[0].role_code}','${client_id}', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`


  // if(isSA){
  //   stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status <> 'D'
  //   order by cm.id desc`;
  // }else{
  //   stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status <> 'D' and cm.id = ${client_id}
  //   order by cm.id desc`;
  // }

  // stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status <> 'D'
  //   order by cm.id desc`;

  let resp;
    let final_result;
    try {
    resp = await pool.query(qry);
      if (resp.length > 2) {
     
        result(null, resp[0]);
     
      } else {
        result({ kind: "not_found" }, null);
      }
    } catch (e) {
      //;
      result(e, null);
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

Client.getActiveClientsCW = async (login_id,result) => {
  //;

  let stmt='';
  let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
  let client_id = clientAndRoleDetails.data[0].client_id;
  // let role_code = clientAndRoleDetails.data[0].role_code;
  let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;
  stmt = `call pCMSGetActiveClient('${clientAndRoleDetails.data[0].role_code}','${client_id}', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

  // if(isSA){
  //   stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status = 'Y'
  //   order by cm.id desc`;
  // }else{
  //   stmt = `select cm.id,  cm.name,cm.description,
  //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
  //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
  //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
  //   from client_mst cm inner join city_mst city on cm.city_id = city.id
  //   inner join state_mst sm on cm.state_id = sm.id
  //   inner join country_mst country on cm.country_id = country.id
  //   where cm.status = 'Y' and cm.id = ${client_id}
  //   order by cm.id desc`;
  // }

  let resp;
    let final_result;
    try {
    resp = await pool.query(stmt);
      if (resp.length > 2) {
     
        result(null, resp[0]);
     
      } else {
        result({ kind: "not_found" }, null);
      }
    } catch (e) {
      //;
      result(e, null);
    }
};

Client.getClientById = (id, result) => {

  let stmt = `select cm.id,  cm.name,cm.description,
      cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
      cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
      cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.gst_no,cm.tin_no,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
      from client_mst cm inner join city_mst city on cm.city_id = city.id
      inner join state_mst sm on cm.state_id = sm.id
      inner join country_mst country on cm.country_id = country.id
      WHERE cm.id = ? and cm.status = 'Y'`;
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

Client.delete = async (id, result) => {

 // let stmt = `Update client_mst set status = 'D' WHERE id = ?`;

  let stmt = `call pDeleteClient(${id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

  
  try {
        resp = await pool.query(stmt);
        if (resp.length == 2) {
        if(resp[1][0].OP_ErrorCode == 1 ){
          result({ kind: "not_found" }, null);
          return;
        }
        else{
          result(null, resp[0]);
          return
        }
        }
      }
    catch (err) {
            result(null, err);
      }
  // sql.query(stmt, id, (err, res) => {
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
};


ClientModuleMapping.createClientModuleMapping = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  // let stmt = `insert into client_module_config (client_id , booking_allowed, 
  //   payment_allowed,reward_allowed,penalty_allowed,otp_authentication,invoice_allowed,
  //   status,created_date,created_by ) 
  // values (${params.client_id},${params.booking_allowed},${params.payment_allowed},
  //   ${params.reward_allowed},${params.penalty_allowed},${params.otp_authentication},
  //   ${params.invoice_allowed},'${params.status}',?,${params.created_by});`;


    let stmt = `call pCMSAddClientModuleConfig(${params.client_id},${params.booking_allowed},${params.payment_allowed},
      ${params.reward_allowed},${params.penalty_allowed},${params.otp_authentication},
      ${params.invoice_allowed},'${params.status}',${params.created_by}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`


  try {
    resp = await pool.query(stmt);
    if (resp.length = 2) {
      final_res = {
        status: resp[1][0].OP_ErrorCode > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp[1][0].OP_ErrorCode > 0 ? 'SUCCESS' : 'FAILED',
        count : 1,
        data: [{id:resp[1][0].OP_ErrorCode}]
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

ClientModuleMapping.updateClientModuleMapping = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  // let stmt = `update client_module_config set 
  // client_id =${params.client_id} , booking_allowed = ${params.booking_allowed}, 
  // payment_allowed =${params.payment_allowed} ,reward_allowed = ${params.reward_allowed},
  // penalty_allowed = ${params.penalty_allowed},otp_authentication = ${params.otp_authentication},
  // invoice_allowed = ${params.invoice_allowed},
  // status = '${params.status}', modified_by = ${params.modified_by},modified_date = ? 
  // where id =  ${params.id}`;

  let stmt = `call pCMSAddClientModuleConfig(${params.client_id},${params.booking_allowed},${params.payment_allowed},
    ${params.reward_allowed},${params.penalty_allowed},${params.otp_authentication},
    ${params.invoice_allowed},'${params.status}',${params.created_by}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`


  try {
    
    resp = await pool.query(stmt,[datetime]);
    if(resp.affectedRows > 0){
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS' ,
        count : 1,
        data: [{id: params.id}]
      }
    }else{
      final_res = {
        status:  false,
        err_code: `ERROR : 1`,
        message: 'DATA_NOT_FOUND',
        count : 0,
        data: [{id: params.id}]
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


ClientModuleMapping.getClientModuleMapping = async (result) => {

  let resp;
  let final_res;

  // let stmt = `select cmc.client_id , cmc.booking_allowed, cmc.payment_allowed, 
  // cmc.reward_allowed,cmc.penalty_allowed,cmc.otp_authentication,cmc.invoice_allowed,
  // cmc.status,cmc.created_date,cmc.created_by , cm.id,  cm.name,cm.description
  // from client_module_config cmc inner join client_mst cm on cmc.client_id=cm.id and cm.status='Y'
  // where cmc.status <> 'D'
  // order by cmc.id desc`;

  let qry = `call pCMSGetClientModuleMapping('NA', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`


try {
  resp = await pool.query(qry);
  
  if (resp.length > 2) {
    final_res = {
      status: true,
      message:  'DATA_FOUND' ,
      count: resp[0].length,
      data: resp[0]
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

ClientModuleMapping.getClientModuleMappingById = async (id,result) => {

  let stmt='';
  let resp;
  let final_res;
  
    // stmt = `select cmc.client_id , cmc.booking_allowed, cmc.payment_allowed, 
    // cmc.reward_allowed,cmc.penalty_allowed,cmc.otp_authentication,cmc.invoice_allowed,
    // cmc.status,cmc.created_date,cmc.created_by , cm.id,  cm.name,cm.description
    // from client_module_config cmc inner join client_mst cm on cmc.client_id=cm.id and cm.status='Y'
    // where cmc.id = ? `;

    stmt = `call pCMSGetClientModuleMappingById('NA',${id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

   
  try {
    resp = await pool.query(stmt);
    
    if (resp.length > 2) {
      final_res = {
        status: true,
        message:  'DATA_FOUND' ,
        count: resp[0].length,
        data: resp[0]
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

ClientModuleMapping.getClientModuleMappingByClientId = async (client_id,result) => {

  let stmt='';
  let resp;
  let final_res;
  
    // stmt = `select cmc.client_id , cmc.booking_allowed, cmc.payment_allowed, 
    // cmc.reward_allowed,cmc.penalty_allowed,cmc.otp_authentication,cmc.invoice_allowed,
    // cmc.status,cmc.created_date,cmc.created_by , cm.id,  cm.name,cm.description
    // from client_module_config cmc inner join client_mst cm on cmc.client_id=cm.id and cm.status='Y'
    // where cmc.client_id = ? and cmc.status='Y'`;

    
  stmt = `call pCMSGetClientModuleMappingByClient(${client_id}, @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`

   
  try {
    resp = await pool.query(stmt);
    
    if (resp.length > 2) {
      final_res = {
        status: true,
        message:  'DATA_FOUND' ,
        count: resp[0].length,
        data: resp[0]
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

module.exports = {
  Client: Client,
  ClientModuleMapping: ClientModuleMapping
};