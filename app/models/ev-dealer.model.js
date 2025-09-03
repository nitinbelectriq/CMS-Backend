const { sql, pool } = require("./db.js");
const Dealer = function (dealer) {

  this.id = dealer.id,
    this.company_name = dealer.company_name,
    this.deal_type_id = dealer.deal_type_id,
    this.website = dealer.website,
    this.email = dealer.email,
    this.cp_name = dealer.cp_name,
    this.mobile = dealer.mobile,
    this.address1 = dealer.address1,
    this.address2 = dealer.address2,
    this.PIN = dealer.PIN,
    this.landmark = dealer.landmark,
    this.city_id = dealer.city_id,
    this.state_id = dealer.state_id,
    this.country_id = dealer.country_id,
    this.remarks = dealer.remarks,
    this.status = dealer.status,
    this.created_date = dealer.created_date,
    this.createdby = dealer.createdby,
    this.modify_date = dealer.modify_date,
    this.modifyby = dealer.modifyby
};
Dealer.create = async (data, result) => {
  var datetime = new Date();
  let final_res ;
  let resp;
//;
  let stmt = `insert into ev_dealer_mst (company_name,deal_type_id, website,email,
              cp_name,mobile,address1,address2,PIN,landmark,city_id,state_id,country_id,
              remarks,status,createdby,created_date) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  let values =[data.company_name,data.deal_type_id,data.website,data.email,data.cp_name,data.mobile,
              data.address1,data.address2,data.PIN,data.landmark,data.city_id,data.state_id,data.country_id,
              data.remarks,data.status,data.createdby,datetime];

  try {

    resp = await pool.query(stmt,values);
    final_res = {
      status: resp.insertId > 0 ? true:false, 
      err_code:resp.insertId > 0 ? 'ERROR:0':'ERROR:1',
      message: 'Ev Dealer added successfully',
      data: { id: resp.insertId }
    }

  } catch (e) {
    final_res = {
      status: false,
      message: `ERROR : ${e.message} `,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};
// Dealer.getAllEvDealer = async (result) => {
//   let final_res;
//   let resp;

//   let stmt =
//     `SELECT edm.id,edm.company_name,edm.deal_type_id,edm.website,edm.email,edm.cp_name,edm.mobile,edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,cm.name as city_name,
//                 edm.state_id,sm.name as state_name,edm.country_id,ccm.name as country_name,edm.remarks,edm.status,edm.created_date,edm.createdby,edm.modify_date,edm.modifyby
//                 FROM ev_dealer_mst edm 
//                 left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
//                 left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
//                 left join country_mst ccm on edm.country_id=ccm.id and ccm.status='Y' 
//                 left join master_config mc on edm.deal_type_id=mc.id and mc.status='Y' 
//                 where edm.status = 'Y';`;
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

// };
// Dealer.getChargingStationFranchise = async ( result) => {

//   let final_res;
//   let res;

//   let stmt = `select edm.company_name,edm.deal_type_id,mc.value as deal_type,edm.website,edm.email,
//   edm.cp_name,edm.mobile,edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,
//   cm.name as city_name,sm.name as state_name,cmm.name as country_name,edm.state_id,
//   edm.country_id,edm.remarks,edm.status,edm.created_date,edm.createdby,edm.modify_date,edm.modifyby
//   from ev_dealer_mst edm
//   inner join master_config mc on edm.deal_type_id = mc.id and mc.status='Y' and mc.value='EvChargingStation'
//   left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
//   left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
//   left join country_mst cmm on edm.country_id=cmm.id and cmm.status='Y'
//   where edm.status='Y' order by edm.id desc;`;

//   try {

//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       err_code: `ERROR : 0`,
//       message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
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

// };
// Dealer.getBatteryManufacturers = async ( result) => {
//   // let whereClause = ``;
//   // if (id > 0) {
//   //   whereClause = ` where ucl.user_id =${id}  `
//   // }
//   let final_res;
//   let res;

//   let stmt = `select edm.company_name,edm.deal_type_id,mc.value as deal_type,edm.website,edm.email,
//    edm.cp_name,edm.mobile,edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,cm.name as city_name,
//    sm.name as state_name,cmm.name as country_name,edm.state_id,edm.country_id,edm.remarks,edm.status,
//    edm.created_date,edm.createdby,edm.modify_date,edm.modifyby
//    from ev_dealer_mst edm
//    inner join master_config mc on edm.deal_type_id=mc.id and mc.status='Y'and mc.value='EvBattery'
//    left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
//    left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
//    left join country_mst cmm on edm.country_id=cmm.id and cmm.status='Y'
//    where edm.status='Y' order by edm.id desc;`;

//   try {

//     resp = await pool.query(stmt);

//     final_res = {
//       status: resp.length > 0 ? true : false,
//       err_code: `ERROR : 0`,
//       message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
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

// };
Dealer.getEvDealerShipFranchiseProvider = async (result) => {
  // let whereClause = ``;
  // if (id > 0) {
  //   whereClause = ` where ucl.user_id =${id}  `
  // }
  let final_res;
  let res;

  let stmt = `select edm.company_name,edm.deal_type_id,mc.value,edm.website,edm.email,edm.cp_name,edm.mobile,
        edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,cm.name as city_name,sm.name as state_name,
        cmm.name as country_name,edm.state_id,edm.country_id,edm.remarks,edm.status,edm.created_date,edm.createdby,
        edm.modify_date,edm.modifyby
        from ev_dealer_mst edm
        inner join master_config mc on edm.deal_type_id=mc.id and mc.status='Y' and mc.value='EVDealerShip'
        left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
        left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
        left join country_mst cmm on edm.country_id=cmm.id and cmm.status='Y'
        where edm.status='Y' order by edm.id desc;`;

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
Dealer.updateEvDealer = async (newEvDealer, result) => {

  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update ev_dealer_mst set company_name ='${newEvDealer.company_name}', deal_type_id =${newEvDealer.deal_type_id},
        website ='${newEvDealer.website}',email ='${newEvDealer.email}',cp_name ='${newEvDealer.cp_name}',
        mobile =${newEvDealer.mobile},address1 ='${newEvDealer.address1}',address2 ='${newEvDealer.address2}',
        PIN =${newEvDealer.PIN},landmark ='${newEvDealer.landmark}',city_id =${newEvDealer.city_id},
        state_id =${newEvDealer.state_id},country_id =${newEvDealer.country_id},remarks ='${newEvDealer.remarks}',
        status = '${newEvDealer.status}',
        modifyby = ${newEvDealer.modifyby},modify_date = ? 
        where id =  ${newEvDealer.id}`;

  try {

    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows,
      data: []
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
Dealer.publishEvDealer = async (newEvDealer, result) => {
  //;
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update ev_dealer_mst set  status = '${newEvDealer.status}',
        modifyby = ${newEvDealer.modifyby},modify_date = ? 
        where id =  ${newEvDealer.id}`;

  try {

    resp = await pool.query(stmt, [datetime]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows,
      data: []
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
Dealer.deleteEvDealer = async (id, modifyby, result) => {

  var datetime = new Date();
  let final_res;
  let resp;
  let stmt = `Update ev_dealer_mst 
        set status = 'D' , modify_date = ? , modifyby = ?
        WHERE id = ?`;


  try {

    resp = await pool.query(stmt, [datetime, modifyby, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows,
      data: []
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

Dealer.moderateEvDealer = async (data, result) => {

  var datetime = new Date();
  let final_res;
  let resp;
  let stmt = `update ev_dealer_mst set  status = ?,
        modifyby = ?,modify_date = ? 
        where id = ?`;

  try {

    resp = await pool.query(stmt, [data.status, data.modifyby, datetime, data.id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows,
      data: []
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

Dealer.getModerateEvDealerListByKeys = async (key,result) => {
  let final_res;
  let resp;

  let stmt =
    `SELECT edm.id,edm.company_name,edm.deal_type_id, mc.value as deal_type,edm.website,edm.email,edm.cp_name,edm.mobile,edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,cm.name as city_name,
    edm.state_id,sm.name as state_name,edm.country_id,ccm.name as country_name,edm.remarks,edm.status,edm.created_date,edm.createdby,edm.modify_date,edm.modifyby
    FROM ev_dealer_mst edm 
    left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
    left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
    left join country_mst ccm on edm.country_id=ccm.id and ccm.status='Y' 
    inner join master_config mc on edm.deal_type_id=mc.id and mc.status='Y' and mc.value='${key}'
    where edm.status = 'M';`;
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

Dealer.getPublishEvDealerListByKeys = async (key,result) => {
  let final_res;
  let resp;

  let stmt =
    `select edm.id, edm.company_name,edm.deal_type_id,mc.value as deal_type,edm.website,edm.email,edm.cp_name,edm.mobile,
    edm.address1,edm.address2,edm.PIN,edm.landmark,edm.city_id,cm.name as city_name,sm.name as state_name,
    cmm.name as country_name,edm.state_id,edm.country_id,edm.remarks,edm.status,edm.created_date,edm.createdby,
    edm.modify_date,edm.modifyby
    from ev_dealer_mst edm
    inner join master_config mc on edm.deal_type_id=mc.id and mc.status='Y' and mc.value='${key}'
    left join state_mst sm on edm.state_id=sm.id and sm.status='Y'
    left join city_mst cm on edm.city_id=cm.id and cm.status='Y'
    left join country_mst cmm on edm.country_id=cmm.id and cmm.status='Y'
    where edm.status='Y' order by edm.id desc;`;
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

module.exports = {
  Dealer: Dealer
};