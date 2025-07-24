const { sql, pool } = require("./db.js");

const Vehicle = function (vehicle) {
  this.id = vehicle.id,
  this.user_id = vehicle.user_id,
    this.brand_id = vehicle.brand_id,
    this.model_id = vehicle.model_id,
    this.connector_type_id = vehicle.connector_type_id,
    this.charger_type_id = vehicle.charger_type_id,
    this.registration_no = vehicle.registration_no,
    this.year_of_manufacture = vehicle.year_of_manufacture,
    this.engine_no = vehicle.engine_no,
    this.chassis_no = vehicle.chassis_no,
    this.vin_no = vehicle.vin_no,
    this.is_default = vehicle.is_default,
    this.status = vehicle.status,
    this.created_date = vehicle.created_date,
    this.created_by = vehicle.created_by,
    this.modify_date = vehicle.modify_date,
    this.modify_by = vehicle.modify_by
};

const VehicleView = function (vehicleView) {
  this.id = vehicleView.id,
  this.user_id = vehicleView.user_id,
    this.brand_id = vehicleView.brand_id,
    this.brand_name = vehicleView.brand_name,
    this.model_id = vehicleView.model_id,
    this.model_name = vehicleView.model_name,
    this.connector_type_id = vehicleView.connector_type_id,
    this.connector_type_name = vehicleView.connector_type_name,
    this.charger_type_id = vehicleView.charger_type_id,
    this.charger_type_name = vehicleView.charger_type_name,
    this.registration_no = vehicleView.registration_no,
    this.year_of_manufacture = vehicleView.year_of_manufacture,
    this.engine_no = vehicleView.engine_no,
    this.chassis_no = vehicleView.chassis_no,
    this.vin_no = vehicleView.vin_no,
    this.is_default = vehicleView.is_default,
    this.status = vehicleView.status,
    this.created_date = vehicleView.created_date,
    this.created_by = vehicleView.created_by,
    this.modify_date = vehicleView.modify_date,
    this.modify_by = vehicleView.modify_by
};

const VehicleModel = function (vehicleModel) {
  this.id = vehicleModel.id,
    this.brand_id = vehicleModel.brand_id,
    this.vehicle_type_id = vehicleModel.vehicle_type_id,
    this.connector_type_id = vehicleModel.connector_type_id,
    this.charger_type_id = vehicleModel.charger_type_id,
    this.name = vehicleModel.name,
    this.status = vehicleModel.status,
    this.created_date = vehicleModel.created_date,
    this.created_by = vehicleModel.created_by,
    this.modify_date = vehicleModel.modify_date,
    this.modify_by = vehicleModel.modify_by
};

const VehicleType = function (vehicleType) {
  this.id = vehicleType.id,
    this.name = vehicleType.name,
    this.description = vehicleType.description,
    this.status = vehicleType.status,
    this.created_date = vehicleType.created_date,
    this.created_by = vehicleType.created_by,
    this.modify_date = vehicleType.modify_date,
    this.modify_by = vehicleType.modify_by
};

const VModel_CType = function (vModel_CType) {
  this.id = vModel_CType.id,
    this.ct_id = vModel_CType.ct_id,
    this.ct_name = vModel_CType.ct_name,
    this.vm_id = vModel_CType.vm_id,
    this.vm_name = vModel_CType.vm_name,
    this.vType_id = vModel_CType.vType_id,
    this.vType_name = vModel_CType.vType_name,
    this.vBrand_id = vModel_CType.vBrand_id,
    this.vBrand_name = vModel_CType.vBrand_name,
    this.published_with_modification = vModel_CType.published_with_modification,
    this.status = vModel_CType.status,
    this.created_date = vModel_CType.created_date,
    this.created_by = vModel_CType.created_by,
    this.modify_date = vModel_CType.modify_date,
    this.modify_by = vModel_CType.modify_by
  this.published_date = vModel_CType.published_date,
    this.published_by = vModel_CType.published_by
};

Vehicle.create = async (newVehicle, result) => {
  var datetime = new Date();
  let final_res = {};
  let resp;

  if(newVehicle.is_default==1){
    let stmt2 = `update vehicle_mst set is_default = 0 where user_id = ${newVehicle.user_id} `;
    resp = await pool.query(stmt2);
  }

  let stmt = `INSERT INTO vehicle_mst (brand_id,user_id, model_id,connector_type_id,registration_no,
    year_of_manufacture,engine_no,chassis_no,vin_no,is_default,status,
    created_by,created_date) 
    VALUES (${newVehicle.brand_id},${newVehicle.user_id},${newVehicle.model_id},${newVehicle.connector_type_id},'${newVehicle.registration_no}',
    ${newVehicle.year_of_manufacture},'${newVehicle.engine_no}','${newVehicle.chassis_no}','${newVehicle.vin_no}',${!!newVehicle.is_default?newVehicle.is_default:0},'${newVehicle.status}',
    ${newVehicle.created_by},?) `;

  try {
    
    resp = await pool.query(stmt,[datetime]);
    final_res = {
      status: true,
      message: 'Vehicle added successfully',
      data: { id: resp.insertId, registration_no: newVehicle.registration_no }
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

Vehicle.create_new = async (newVehicle, result) => {
  var datetime = new Date();
  let final_res = {};
  let resp;

  if(newVehicle.is_default==1){
    let stmt2 = `update vehicle_mst set is_default = 0 where user_id = ${newVehicle.user_id} `;
    resp = await pool.query(stmt2);
  }

  let stmt = `INSERT INTO vehicle_mst (brand_id,user_id, model_id,connector_type_id,registration_no,
    is_default,status,created_by,created_date) 
    VALUES (${newVehicle.brand_id},${newVehicle.user_id},${newVehicle.model_id},${newVehicle.connector_type_id},'${newVehicle.registration_no}',
   ${!!newVehicle.is_default?newVehicle.is_default:0},'${newVehicle.status}',
    ${newVehicle.created_by},?) `;

  try {
    
    resp = await pool.query(stmt,[datetime]);
    final_res = {
      status: true,
      message: 'Vehicle added successfully',
      data: { id: resp.insertId, registration_no: newVehicle.registration_no }
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
// Vehicle.create = async (newVehicle, result) => {
//   var datetime = new Date();

//   if(newVehicle.is_default==1){
//     let stmt2 = `update vehicle_mst set is_default = 0 where created_by = ${newVehicle.created_by} `;
//     resp = await pool.query(stmt2);
//   }

//   let stmt = `INSERT INTO vehicle_mst (brand_id, model_id,connector_type_id,registration_no,
//     year_of_manufacture,engine_no,chassis_no,vin_no,is_default,status,
//     created_by,created_date) 
//     VALUES (${newVehicle.brand_id},${newVehicle.model_id},${newVehicle.connector_type_id},'${newVehicle.registration_no}',
//     ${newVehicle.year_of_manufacture},'${newVehicle.engine_no}','${newVehicle.chassis_no}','${newVehicle.vin_no}',${!!newVehicle.is_default?newVehicle.is_default:0},'${newVehicle.status}',
//     ${newVehicle.created_by},?) `;

//   let final_res = {};
//   let resp;

//   try {
    
//     resp = await pool.query(stmt,[datetime]);
//     final_res = {
//       status: true,
//       message: 'Vehicle added successfully',
//       data: { id: resp.insertId, registration_no: newVehicle.registration_no }
//     }

//   } catch (e) {
//     final_res = {
//       status: false,
//       message: `ERROR : ${e.message} `,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// };

Vehicle.updateRegisteredVehicle = async (newVehicle, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  if(newVehicle.is_default==1){
    let stmt2 = `update vehicle_mst set is_default = 0 where user_id = ${newVehicle.user_id} `;
    try {
      resp = await pool.query(stmt2);
    } catch (e) {
    } finally {
    }
  }
  

  let stmt = `update vehicle_mst set brand_id = ${newVehicle.brand_id}, user_id =${newVehicle.user_id},
    model_id = ${newVehicle.model_id}, connector_type_id = ${newVehicle.connector_type_id},
    registration_no = '${newVehicle.registration_no}',
    year_of_manufacture = ${newVehicle.year_of_manufacture}, engine_no = '${newVehicle.engine_no}',
    chassis_no='${newVehicle.chassis_no}', vin_no = '${newVehicle.vin_no}',
    is_default = ${!!newVehicle.is_default?newVehicle.is_default:0},
    status = '${newVehicle.status}',
    modify_by = ${newVehicle.modify_by},modify_date = ? 
    where id =  ${newVehicle.id}`;

    try {
      
      resp = await pool.query(stmt,[datetime]);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count : resp.affectedRows,
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

  // sql.query(stmt, (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   result(null, { id: res.insertId, ...newVehicle });
  // });
};


VModel_CType.vModel_CTypeMap = (data, result) => {
  var datetime = new Date();

  let values = [];
debugger;
  for (let index = 0; index < data.ct_id.length; index++) {
    values.push([data.ct_id[index], data.vm_id, data.vType_id, data.status, 1, datetime.toISOString().slice(0, 10)])
  }

  let stmt = `insert into c_type_v_model_mapping (ct_id,vm_id,vType_id,status,created_by,created_date)
    values  ? `;

  sql.query(stmt, [values], (err, res) => {
    if (err) {

      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...data });
  });
};

VehicleView.getAllVehicles = async (result) => {

  let stmt = `select vm.id,vm.brand_id , vbm.name as brand_name , vm.model_id ,
      vmm.name as model_name , vm.connector_type_id , ctm.name  as connector_type_name,
      vm.registration_no, vm.year_of_manufacture, vmm.image_url as model_image_url,
      vm.engine_no,vm.chassis_no,vm.vin_no,vm.status,vm.created_date,vm.created_by 
      from vehicle_mst vm inner join vehicle_brand_mst vbm on vm.brand_id = vbm.id
      inner join vehicle_model_mst vmm on vm.model_id = vmm.id
      inner join connector_type_mst ctm on vm.connector_type_id = ctm.id
      where vm.status <> 'D'
      order by vm.id desc`;

  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt);

    final_res = {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      message: `ERROR : ${e.code} `,
      count: 0,
      data: []
    }
  } finally {
    return (final_res);
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
VehicleView.getVehiclesByUserId = async (id, result) => {

  let stmt = `select vm.id,vm.brand_id , vbm.name as brand_name , vm.model_id ,
      vmm.name as model_name , vm.connector_type_id , ctm.name  as connector_type_name,
      vm.registration_no, vm.year_of_manufacture,vmm.image_url as model_image_url,
      vm.engine_no,vm.chassis_no,vm.vin_no,vm.is_default,
      vm.status,vm.created_date,vm.created_by 
      from vehicle_mst vm inner join vehicle_brand_mst vbm on vm.brand_id = vbm.id
      inner join vehicle_model_mst vmm on vm.model_id = vmm.id
      inner join connector_type_mst ctm on vm.connector_type_id = ctm.id
      where vm.status <> 'D' and vm.user_id = ${id}
      order by vm.id desc`;

  //02 03 2021\
  //
  let resp;
  let final_result;
  try {
    //
    resp = await pool.query(stmt);

    if (resp.length > 0) {
      final_result = {
        status: true,
        message: 'DATA_FOUND',
        count: resp.length,
        data: resp
      }
    } else {
      final_result = {
        status: false,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      };
    }
  } catch (e) {
    //;
    final_result = {
      status: false,
      message: `ERROR : ${e.code}`,
      count: 0,
      data: []
    };
  } finally {
    return final_result;
  }


  // let promise = new Promise((resolve, reject) => {
  //   sql.query(stmt, (err, res) => {
  //     if (err) {
  //       reject({ message: "ERROR", data: null, error: err });
  //     }

  //     resolve({ message: "DATA_FOUND", data: res, error: null });
  //   });
  // })

  // return await promise;



};


VehicleModel.getAllVehicleModelsByBrandId = (brandId, result) => {
  const query = `
    SELECT vmm.id, vmm.name, vmm.image_url AS model_image_url
    FROM vehicle_model_mst vmm
    INNER JOIN vehicle_brand_mst vbm ON vmm.brand_id = vbm.id
    WHERE vmm.brand_id = ? AND vbm.status = 'Y' AND vbm.top_brands = 1
  `;

  sql.query(query, [brandId], (err, res) => {
    if (err) {
      return result(err, null);
    }

    if (res.length > 0) {
      return result(null, res);
    }

    // no models found for brandId
    return result({ kind: "not_found" }, null);
  });
};



VehicleType.getAllVehicleTypes = (result) => {
  const query = "SELECT id, name, description FROM vehicle_type_mst WHERE status = 'Y'";

  sql.query(query, (err, res) => {
    if (err) {
      return result(err, null); // error is returned as the first param
    }

    result(null, res); // no error, return result
  });
};


VModel_CType.getAllPublishedVModel = result => {
  sql.query(`select ctvmm.id,ctvmm.ct_id, ctm.name as ct_name,vmm.id as vm_id, vmm.name as vm_name,ctvmm.vType_id ,
      vtm.name as vType_name , ctvmm.created_date,ctvmm.status, vbm.id as brand_id,
      vmm.image_url as model_image_url
      from c_type_v_model_mapping ctvmm 
      inner join connector_type_mst ctm on ctvmm.ct_id = ctm.id 
      inner join vehicle_model_mst vmm on  ctvmm.vm_id = vmm.id
      inner join vehicle_type_mst vtm on  ctvmm.vType_id = vtm.id
      inner join vehicle_brand_mst vbm on vmm.brand_id = vbm.id
      where ctvmm.status <> 'D'
      order by ctvmm.id desc`, (err, res) => {
    if (err) {

      result(null, err);
      return;
    }

    result(null, res);
  });
};

VModel_CType.getAllvModel_CTypes = result => {

  sql.query(`select ctvmm.id,ctvmm.ct_id, ctm.name as ct_name,vmm.id as vm_id, vmm.name as vm_name,ctvmm.vType_id ,
      vtm.name as vType_name , ctvmm.created_date,ctvmm.status , vbm.id as brand_id,
      vmm.image_url as model_image_url
      from c_type_v_model_mapping ctvmm 
      inner join connector_type_mst ctm on ctvmm.ct_id = ctm.id 
      inner join vehicle_model_mst vmm on  ctvmm.vm_id = vmm.id
      inner join vehicle_type_mst vtm on  ctvmm.vType_id = vtm.id
      inner join vehicle_brand_mst vbm on vmm.brand_id = vbm.id
      where ctvmm.status = 'M'
      order by vmm.id, ctvmm.id desc`, (err, res) => {
    if (err) {

      result(null, err);
      return;
    }

    result(null, res);
  });
};


VModel_CType.publishVModel_CTYpeWithoutModify = (id, customer, result) => {
  var datetime = new Date();

  let stmt = `update c_type_v_model_mapping set status = 'P', 
    published_with_modification=? , published_date= ?,published_by = ? where id = ?`;

  sql.query(stmt, [customer.published_with_modification, datetime.toISOString().slice(0, 10), customer.published_by, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...customer });
    }
  );
};

VModel_CType.publishVModel_CTYpe = (id, data, result) => {

  var datetime = new Date();

  let stmt = `update c_type_v_model_mapping set status = 'P', ct_id = ?, vm_id =? ,vType_id= ?, 
    published_with_modification=? , published_date= ?,published_by = ? where id = ?`;

  sql.query(stmt, [data.ct_id, data.vm_id, data.vType_id, data.published_with_modification,
  datetime.toISOString().slice(0, 10), data.published_by, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...data });
    }
  );
};

VModel_CType.moderateVModel_CTYpe = (id, customer, result) => {
  var datetime = new Date();

  let stmt = `update c_type_v_model_mapping set status = 'M', ct_id = ?, vm_id =? ,vType_id= ?, 
    published_with_modification=? , modify_date= ?,modify_by = ? where id = ?`;

  sql.query(stmt, [customer.ct_id, customer.vm_id, customer.vType_id, customer.published_with_modification,
  datetime.toISOString().slice(0, 10), customer.published_by, customer.id],
    (err, res) => {
      
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...customer });
    }
  );
};

VModel_CType.moderateVModel_CTYpeWithoutModify = (id, customer, result) => {
  var datetime = new Date();

  let stmt = `update c_type_v_model_mapping set status = 'M', 
    published_with_modification=? , modify_date= ?,modify_by = ? where id = ?`;

  sql.query(
    stmt, [customer.published_with_modification, datetime.toISOString().slice(0, 10), customer.published_by, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...customer });
    }
  );
};


Vehicle.deleteRegisteredVehicle = (id,modify_by, result) => {
  var datetime = new Date();
  let stmt = `Update vehicle_mst set status = 'D', modify_date= ? ,modify_by=? WHERE id = ?`;
  sql.query(stmt, [datetime , modify_by, id], (err, res) => {
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

VModel_CType.deleteC_Type_V_Model_Mapping = (id, user_id, result) => {
  var datetime = new Date();
  let stmt = `Update c_type_v_model_mapping 
    set status = 'D' , modify_date = ? , modify_by = ?
    WHERE id = ?`;
  sql.query(stmt, [datetime, user_id, id], (err, res) => {
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

//------------21-03-2022-------------------//
// VehicleType.getAllVehicleBrand = result => {
//   sql.query("SELECT id,name,description FROM vehicle_type_mst where status = 'Y'", (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }

//     result(null, res);
//   });
// };

// Vehicle.createVehicleBrand = async (newVehicle, result) => {
//   var datetime = new Date();

//   // if(newVehicle.is_default==1){
//   //   let stmt2 = `update vehicle_mst set is_default = 0 where user_id = ${newVehicle.user_id} `;
//   //   resp = await pool.query(stmt2);
//   // }

//   let stmt = `INSERT INTO vehicle_brand_mst (name,description, model_id,status,created_by,created_date) Values (${newVehicle.name},${newVehicle.description},'${newVehicle.status}',
//     ${newVehicle.created_by},?) `;

//   let final_res = {};
//   let resp;

//   try {
    
//     resp = await pool.query(stmt,[datetime]);
//     final_res = {
//       status: true,
//       message: 'Vehicle Brand added successfully',
//       data: { id: resp.insertId}
//     }

//   } catch (e) {
//     final_res = {
//       status: false,
//       message: `ERROR : ${e.message} `,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// };
// Vehicle.updateVehicleBrand = async (newVehicle, result) => {
//   var datetime = new Date();
//   let final_res;
//   let resp;
 
//   let stmt = `update vehicle_brand_mst set name = ${newVehicle.name}, description =${newVehicle.description},
//   status = '${newVehicle.status}',
//   modify_by = ${newVehicle.modify_by},modify_date = ? 
//   where id =  ${newVehicle.id}`;

//     try {
      
//       resp = await pool.query(stmt,[datetime]);
  
//       final_res = {
//         status: resp.affectedRows > 0 ? true : false,
//         err_code: `ERROR : 0`,
//         message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
//         count : resp.affectedRows,
//         data: []
//       }
//     } catch (err) {
      
//       final_res = {
//         status: false,
//         err_code: `ERROR : ${err.code}`,
//         message: `ERROR : ${err.message}`,
//         count : 0,
//         data: []
//       }
//     } finally {
//       result(null, final_res);
//     }

//   // sql.query(stmt, (err, res) => {
//   //   if (err) {
//   //     result(err, null);
//   //     return;
//   //   }

//   //   result(null, { id: res.insertId, ...newVehicle });
//   // });
// };

// Vehicle.deleteVehicleBrand = (id,modify_by, result) => {
//   var datetime = new Date();
//   let stmt = `Update vehicle_brand_mst 
//     set status = 'D' , modify_date = ? , modify_by = ?
//     WHERE id = ?`;
//   sql.query(stmt, [datetime , modify_by, id], (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     result(null, res);
//   });
// };


// module.exports = Vehicle;
// module.exports = VehicleModel;

module.exports = {
  Vehicle: Vehicle,
  VehicleModel: VehicleModel,
  VehicleView: VehicleView,
  VehicleType: VehicleType,
  VModel_CType: VModel_CType
};