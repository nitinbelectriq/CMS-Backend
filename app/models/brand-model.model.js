const { sql, pool } = require("./db.js");
const VehicleModel = function (vehicle) {
  this.id = vehicle.id,
    this.brand_id = vehicle.brand_id,
    this.vehicle_type_id = vehicle.vehicle_type_id,
    this.connector_type_id = vehicle.connector_type_id,
    this.vehicle_type=vehicle.vehicle_type,
    this.charger_type_id = vehicle.charger_type_id,
    this.driver_range = vehicle.driver_range,
    this.image_url = vehicle.image_url,
    this.name = vehicle.name,
    this.status = vehicle.status,
    this.created_date = vehicle.created_date,
    this.created_by = vehicle.created_by,
    this.modify_date = vehicle.modify_date,
    this.modify_by = vehicle.modify_by
};

VehicleModel.create = async (data, result) => {
  var datetime = new Date();
  
  let stmt = `INSERT INTO vehicle_model_mst (brand_id,vehicle_type_id,connector_type_id,
      charger_type_id,name,driver_range,image_url,status,created_by,created_date)
     Values (?,?,?,?,?,?,?,?,?,?)`;
  let final_res = {};
  let resp;
  let Values = [data.brand_id, data.vehicle_type_id, data.connector_type_id, data.charger_type_id,
  data.name, data.driver_range, data.image_url, data.status, data.created_by, datetime];

  try {

    resp = await pool.query(stmt, Values);
    final_res = {
      status: resp.insertId > 0 ? true : false,
      err_code: resp.insertId > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
      data: [resp.insertId]
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

VehicleModel.getAllVehicleModel = async(result) => {
  //;
  var datetime = new Date();
  let resp;
  let final_res;
  let stmt = `select vms.id,vms.brand_id,vbm.name as brand_name,vms.vehicle_type_id,vtm.name as vehicleType_name,
  vms.connector_type_id,vms.charger_type_id,vms.name,vms.driver_range,vms.image_url,
  vms.status,vms.created_by,vms.created_date from vehicle_model_mst vms
  inner join vehicle_brand_mst vbm on vms.brand_id=vbm.id and vbm.status='Y' and vbm.top_brands=1
  inner join vehicle_type_mst vtm on vms.vehicle_type_id=vtm.id and vtm.status='Y'
  where vms.status<>'D';`;

  try {
    resp = await pool.query(stmt);
    final_res =
    {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'DATA FOUND' : 'DATA NOT FOUND',
      data: resp
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

VehicleModel.getVehicleManufacturesByVehicleType = async (vehicle_type, result) => {
  //;
  // let whereClause = ``;
  // if (id > 0) {
  //   whereClause = ` where ucl.user_id =${id}  `
  // }
  let final_res;
  let res;
  let whereClause = '';
  if (vehicle_type == "Electric Truck") {
    whereClause = `where vtm.name in('Electric Truck','Truck L','Truck H','Truck M','IPLT Electric Truck')`;
  }
  if (vehicle_type == "Two Wheeler") {
    whereClause = `where vtm.name in('Two Wheeler')`;
  }
  if (vehicle_type == "Three Wheeler") {
    whereClause = `where vtm.name in('Three Wheeler')`;
  }
  if (vehicle_type == "Four Wheeler") {
    whereClause = `where vtm.name in('LMV','SUV')`;
  }
  if (vehicle_type == "Electric Bus") {
    whereClause = `where vtm.name in('Electric Bus','Bus l','Bus M','Bus L','Bus H')`;
  }
  if (vehicle_type == "Electric Cycle") {
    whereClause = `where vtm.name in('Electric Cycle') `;
  }


  if(whereClause!=''){

    let stmt = `SELECT vmm.id,vmm.brand_id,vmm.vehicle_type_id,vmm.connector_type_id,vmm.charger_type_id,vmm.name,
    vmm.image_url,vmm.driver_range,vbm.name as vehicle_brand_name,vbm.description,
    vtm.name as vehicle_type_name,vmm.name as vehicle_model_name,vbm.status,vbm.created_by,
    vbm.created_date FROM vehicle_model_mst vmm
    inner join vehicle_brand_mst vbm on vmm.brand_id=vbm.id and vbm.status='Y'
    inner join vehicle_type_mst vtm on vmm.vehicle_type_id=vtm.id and vtm.status='Y' 
    ${whereClause} and vmm.status = 'Y' order by vmm.id desc;`;

  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? `ERROR : 0` : 'ERROR:1',
      message: resp.length > 0 ? 'DATA FOUND' : 'DATA NOT FOUND',
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
  }else{

    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : Keyword is incorrect`,
      count: 0,
      data: []
    }

    result(null, final_res);
  }
  

};


VehicleModel.updateVehicleModel = async (data,result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update vehicle_model_mst set brand_id=?,vehicle_type_id=?,connector_type_id=?,
    charger_type_id=?,name=?,driver_range=?,image_url=?,status=?,modify_by=?,modify_date=? where id=?;`;

  let Values = [data.brand_id, data.vehicle_type_id, data.connector_type_id, data.charger_type_id,
  data.name, data.driver_range, data.image_url, data.status, data.modify_by, datetime,data.id];

  try {

    resp = await pool.query(stmt, Values);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: resp.affectedRows > 0 ? `ERROR : 0`:'ERROR:1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.affectedRows,
      data: [data.id]
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
VehicleModel.publishVehicleModel = async (vehicle, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update vehicle_model_mst set  status = '${vehicle.status}',
    modify_by = ${vehicle.modify_by},modify_date = ? 
    where id =  ${vehicle.id}`;

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

VehicleModel.deleteVehicleModel = async (id, modify_by, result) => {
  var datetime = new Date();
  let stmt = `Update vehicle_model_mst
      set status = 'D' , modify_date = ? , modify_by = ?
      WHERE id = ?`;
  try {

    resp = await pool.query(stmt, [datetime, modify_by, id]);

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

VehicleModel.moderateVehicleModel = async (data, result) => {
  //;
  var datetime = new Date();
  let stmt = `Update vehicle_model_mst
      set status = ? , modify_date = ? , modify_by = ?
      WHERE id = ?`;
  try {

    resp = await pool.query(stmt, [data.status,datetime, data.modify_by, data.id]);

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

VehicleModel.getAllModerateVehicle = async ( result) => {
  let final_res;
  let res;

  let stmt = `select vms.id,vms.brand_id,vbm.name as brand_name,vms.vehicle_type_id,vtm.name as vehicleType_name,
  vms.connector_type_id,vms.charger_type_id,vms.name,vms.driver_range,vms.image_url,
  vms.status,vms.created_by,vms.created_date from vehicle_model_mst vms
  inner join vehicle_brand_mst vbm on vms.brand_id=vbm.id and vbm.status='Y'
  inner join vehicle_type_mst vtm on vms.vehicle_type_id=vtm.id and vtm.status='Y'
  where vms.status='M';`;

  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? `ERROR : 0` : 'ERROR:1',
      message: resp.length > 0 ? 'DATA FOUND' : 'DATA NOT FOUND',
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
  VehicleModel: VehicleModel
};