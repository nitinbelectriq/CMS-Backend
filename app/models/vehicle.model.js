const { sql, pool } = require("./db.js");

const Vehicle = function (vehicle) {
  this.id = vehicle.id;
  this.user_id = vehicle.user_id;
  this.brand_id = vehicle.brand_id;
  this.model_id = vehicle.model_id;
  this.vehicle_type_id = vehicle.vehicle_type_id; // ✅ new line
  this.connector_type_id = vehicle.connector_type_id;
  this.charger_type_id = vehicle.charger_type_id;
  this.registration_no = vehicle.registration_no;
  this.year_of_manufacture = vehicle.year_of_manufacture;
  this.engine_no = vehicle.engine_no;
  this.chassis_no = vehicle.chassis_no;
  this.vin_no = vehicle.vin_no;
  this.is_default = vehicle.is_default;
  this.status = vehicle.status;
  this.created_date = vehicle.created_date;
  this.created_by = vehicle.created_by;
  this.modify_date = vehicle.modify_date;
  this.modify_by = vehicle.modify_by;
   this.owner_id = vehicle.owner_id;
     this.mac_id = vehicle.mac_id || '';
    this.evse_id = vehicle.evse_id || '';
    this.AutoCharge_Enabled = vehicle.AutoCharge_Enabled || 'N';
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

const VehicleOwner = function (owner) {
  this.id = owner.id;
  this.first_name = owner.first_name;
  this.last_name = owner.last_name;
  this.mobile_no = owner.mobile_no;
  this.email = owner.email;
  this.address = owner.address;
  this.city = owner.city;
  this.state = owner.state;
  this.country = owner.country;
  this.pincode = owner.pincode;
  this.status = owner.status || 'Y';
  this.created_by = owner.created_by;
  this.modify_by = owner.modify_by;
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
//;
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

// =========================================
// ✅ ADD NEW VEHICLE
// =========================================
Vehicle.addNewVehicle = async (newVehicle, result) => {
  const datetime = new Date();
  try {
    if (newVehicle.is_default == 1) {
      await pool.query(`UPDATE vehicle_mst SET is_default = 0 WHERE user_id = ?`, [newVehicle.user_id]);
    }

    const stmt = `
      INSERT INTO vehicle_mst (
        owner_id, user_id, brand_id, model_id, vehicle_type_id,
        connector_type_id, charger_type_id, registration_no, year_of_manufacture,
        engine_no, chassis_no, mac_id, evse_id, vin_no,
        AutoCharge_Enabled, is_default, status, created_by, created_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const res = await pool.query(stmt, [
      newVehicle.owner_id, newVehicle.user_id, newVehicle.brand_id,
      newVehicle.model_id, newVehicle.vehicle_type_id, // ✅ new field
      newVehicle.connector_type_id, newVehicle.charger_type_id,
      newVehicle.registration_no, newVehicle.year_of_manufacture,
      newVehicle.engine_no, newVehicle.chassis_no,
      newVehicle.mac_id, newVehicle.evse_id, newVehicle.vin_no,
      newVehicle.AutoCharge_Enabled, newVehicle.is_default,
      newVehicle.status, newVehicle.created_by, datetime
    ]);

    result(null, {
      status: true,
      message: "New vehicle added successfully",
      data: { id: res.insertId }
    });
  } catch (e) {
    result(null, { status: false, message: e.message, data: [] });
  }
};


// =========================================
// ✅ UPDATE EXISTING VEHICLE
// =========================================
Vehicle.updateExistingVehicle = async (v, result) => {
  const datetime = new Date();
  try {
    debugger;
    const stmt = `
      UPDATE vehicle_mst SET
        owner_id = ?, user_id = ?, brand_id = ?, model_id = ?, vehicle_type_id = ?,
        connector_type_id = ?, charger_type_id = ?, registration_no = ?,
        year_of_manufacture = ?, engine_no = ?, chassis_no = ?, mac_id = ?,
        evse_id = ?, vin_no = ?, AutoCharge_Enabled = ?, is_default = ?,
        status = ?, modify_by = ?, modify_date = ?
      WHERE id = ?
    `;

    const res = await pool.query(stmt, [
      v.owner_id, v.user_id, v.brand_id, v.model_id, v.vehicle_type_id,
      v.connector_type_id, v.charger_type_id, v.registration_no,
      v.year_of_manufacture, v.engine_no, v.chassis_no, v.mac_id,
      v.evse_id, v.vin_no, v.AutoCharge_Enabled, v.is_default || 0,
      v.status, v.modify_by, datetime, v.id
    ]);

    result(null, {
      status: res.affectedRows > 0,
      message: res.affectedRows > 0 ? "Vehicle updated successfully" : "Vehicle not found",
      count: res.affectedRows
    });
  } catch (e) {
    result(null, { status: false, message: e.message, count: 0 });
  }
};



// =========================================
// ✅ TOGGLE AUTOCHARGE ENABLE / DISABLE
// =========================================
Vehicle.toggleAutoCharge = async (id, AutoCharge_Enabled, modify_by) => {
  const datetime = new Date();
  try {
    const res = await pool.query(
      `UPDATE vehicle_mst SET AutoCharge_Enabled = ?, modify_by = ?, modify_date = ? WHERE id = ?`,
      [AutoCharge_Enabled, modify_by, datetime, id]
    );

    if (res.affectedRows > 0) {
      return {
        status: true,
        message: `AutoCharge ${AutoCharge_Enabled === 'Y' ? 'Enabled' : 'Disabled'} successfully`,
        count: res.affectedRows
      };
    } else {
      return { status: false, message: "Vehicle not found", count: 0 };
    }
  } catch (e) {
    return { status: false, message: e.message };
  }
};

// =========================================
// ✅ DELETE VEHICLE
// =========================================
Vehicle.deleteVehicle = async (id, modify_by, result) => {
  const datetime = new Date();
  try {
    const res = await pool.query(
      `UPDATE vehicle_mst SET status = 'D', modify_by = ?, modify_date = ? WHERE id = ?`,
      [modify_by, datetime, id]
    );
    result(null, {
      status: true,
      message: "Vehicle deleted successfully",
      count: res.affectedRows
    });
  } catch (e) {
    result(null, { status: false, message: e.message });
  }
};

// =============================================
// VEHICLE OWNER LOGIC (Integrated Section)
// =============================================


// ✅ CREATE NEW OWNER
VehicleOwner.createOwner = async (newOwner, result) => {
  const datetime = new Date();
  try {
    const query = `
      INSERT INTO vehicle_owner_mst 
      (first_name, last_name, mobile_no, email, address, city, state, country, pincode, status, created_by, created_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const res = await pool.query(query, [
      newOwner.first_name,
      newOwner.last_name,
      newOwner.mobile_no,
      newOwner.email,
      newOwner.address,
      newOwner.city,
      newOwner.state,
      newOwner.country,
      newOwner.pincode,
      newOwner.status,
      newOwner.created_by,
      datetime
    ]);

    result(null, {
      status: true,
      message: "Vehicle owner added successfully",
      data: { id: res.insertId }
    });
  } catch (err) {
    result(null, { status: false, message: err.message });
  }
};

// ✅ UPDATE OWNER
VehicleOwner.updateOwner = async (owner, result) => {
  const datetime = new Date();
  try {
    const query = `
      UPDATE vehicle_owner_mst SET 
        first_name = ?, last_name = ?, mobile_no = ?, email = ?, address = ?, city = ?, 
        state = ?, country = ?, pincode = ?, status = ?, modify_by = ?, modify_date = ?
      WHERE id = ?
    `;
    const res = await pool.query(query, [
      owner.first_name,
      owner.last_name,
      owner.mobile_no,
      owner.email,
      owner.address,
      owner.city,
      owner.state,
      owner.country,
      owner.pincode,
      owner.status,
      owner.modify_by,
      datetime,
      owner.id
    ]);

    result(null, {
      status: res.affectedRows > 0,
      message: res.affectedRows > 0 ? "Owner updated successfully" : "Owner not found"
    });
  } catch (err) {
    result(null, { status: false, message: err.message });
  }
};

// ✅ GET ALL OWNERS
VehicleOwner.getAllOwners = async (result) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, first_name, last_name, mobile_no, email, city, state, country, pincode, status, created_date
      FROM vehicle_owner_mst
      WHERE status <> 'D'
      ORDER BY id DESC
    `);
    result(null, {
      status: true,
      message: rows.length > 0 ? "DATA_FOUND" : "DATA_NOT_FOUND",
      count: rows.length,
      data: rows
    });
  } catch (err) {
    result(null, { status: false, message: err.message });
  }
};

// ✅ GET OWNER BY ID
// in vehicle.model.js (or wherever VehicleOwner is defined)

VehicleOwner.getOwnerById = async (vehicleId) => {
  try {
   const rows = await pool.query(
  `
  SELECT 
    -- 🔹 Vehicle Info
    vm.id AS vehicle_id,
    vm.user_id,
    vm.owner_id,
    vm.brand_id,                -- ✅ for Brand dropdown
    vm.model_id,                -- ✅ for Model dropdown
    vm.vehicle_type_id,         -- ✅ for Vehicle Type dropdown
    vm.connector_type_id,       -- ✅ for Connector dropdown
    vm.charger_type_id,         -- ✅ if you ever show Charger Type
    vm.registration_no,
    vm.year_of_manufacture,
    vm.engine_no,
    vm.chassis_no,
    vm.mac_id,
    vm.evse_id,
    vm.vin_no,
    vm.AutoCharge_Enabled,
    vm.is_default,
    vm.status AS vehicle_status,
    vm.created_date,
    vm.modify_date,

    -- 🔹 Master Names
    vbm.name AS brand_name,
    vmm.name AS model_name,
    vtm.name AS vehicle_type_name,
    vmm.image_url AS model_image_url,
    ctm.name AS connector_type_name,
    ctm2.name AS charger_type_name,

    -- 🔹 Owner Details + Location
    vom.id AS owner_id,
    vom.first_name,
    vom.last_name,
    CONCAT(COALESCE(vom.first_name, ''), ' ', COALESCE(vom.last_name, '')) AS owner_name,
    vom.mobile_no AS owner_mobile,
    vom.email AS owner_email,
    vom.address AS owner_address,
    vom.city AS owner_city_id,
    city.name AS owner_city_name,
    vom.state AS owner_state_id,
    state.name AS owner_state_name,
    vom.country AS owner_country_id,
    country.name AS owner_country_name,
    vom.pincode AS owner_pincode

  FROM vehicle_mst vm
  INNER JOIN vehicle_brand_mst vbm ON vm.brand_id = vbm.id
  INNER JOIN vehicle_model_mst vmm ON vm.model_id = vmm.id
  LEFT JOIN vehicle_type_mst vtm ON vm.vehicle_type_id = vtm.id
  INNER JOIN connector_type_mst ctm ON vm.connector_type_id = ctm.id
  LEFT JOIN connector_type_mst ctm2 ON vm.charger_type_id = ctm2.id
  LEFT JOIN vehicle_owner_mst vom ON vm.owner_id = vom.id
  LEFT JOIN city_mst city ON vom.city = city.id
  LEFT JOIN state_mst state ON vom.state = state.id
  LEFT JOIN country_mst country ON vom.country = country.id
  WHERE vm.status <> 'D' AND vm.id = ?
  `,
  [vehicleId]
);


    if (!rows.length) return { status: false, message: "Vehicle not found" };
    return { status: true, message: "Owner and vehicle data fetched successfully", data: rows[0] };
  } catch (err) {
    console.error("❌ VehicleOwner.getOwnerById error:", err);
    return { status: false, message: err.message };
  }
};








// ✅ DELETE OWNER (Soft Delete)
VehicleOwner.deleteOwner = async (id, modify_by, result) => {
  const datetime = new Date();
  try {
    const res = await pool.query(
      `UPDATE vehicle_owner_mst SET status = 'D', modify_by = ?, modify_date = ? WHERE id = ?`,
      [modify_by, datetime, id]
    );

    result(null, {
      status: res.affectedRows > 0,
      message: res.affectedRows > 0 ? "Owner deleted successfully" : "Owner not found"
    });
  } catch (err) {
    result(null, { status: false, message: err.message });
  }
};

// ======================================================
// ✅ OPTIONAL: VEHICLE BY CLIENT ID (for future use)
// ======================================================
VehicleView.getVehiclesByClientId = async (client_id) => {
  const stmt = `
    SELECT vm.id, vm.brand_id, vbm.name AS brand_name, vm.model_id,
           vmm.name AS model_name, vm.connector_type_id, ctm.name AS connector_type_name,
           vm.registration_no, vm.year_of_manufacture, vm.engine_no,
           vm.chassis_no, vm.vin_no, vm.status, vm.created_date, vm.created_by
    FROM vehicle_mst vm
    INNER JOIN vehicle_brand_mst vbm ON vm.brand_id = vbm.id
    INNER JOIN vehicle_model_mst vmm ON vm.model_id = vmm.id
    INNER JOIN connector_type_mst ctm ON vm.connector_type_id = ctm.id
    INNER JOIN user_mst um ON vm.user_id = um.id
    WHERE vm.status <> 'D' AND um.client_id = ?
    ORDER BY vm.id DESC;
  `;
  try {
    const res = await pool.query(stmt, [client_id]);
    return {
      status: true,
      message: res.length > 0 ? "DATA_FOUND" : "DATA_NOT_FOUND",
      count: res.length,
      data: res
    };
  } catch (err) {
    return { status: false, message: err.message, count: 0, data: [] };
  }
};

// =============================================================
// ✅ NEW: ROLE-BASED VEHICLE VIEWS (without changing old logic)
// =============================================================

/**
 * Get all vehicles (role-based)
 * Includes: brand, model, connector, charger, owner, AutoCharge_Enabled
 */
VehicleView.getAllVehicles_RB_New = async () => {
  const stmt = `
    SELECT 
      vm.id,
      vm.user_id,
      vm.owner_id,
      CONCAT(COALESCE(vom.first_name, ''), ' ', COALESCE(vom.last_name, '')) AS owner_name,
      vom.mobile_no AS owner_mobile,
      vom.email AS owner_email,
      vm.brand_id,
      vbm.name AS brand_name,
      vm.model_id,
      vmm.name AS model_name,
      vm.connector_type_id,
      ctm.name AS connector_type_name,
      vm.charger_type_id,
      ctm2.name AS charger_type_name,
      vm.registration_no,
      vm.year_of_manufacture,
      vmm.image_url AS model_image_url,
      vm.engine_no,
      vm.chassis_no,
      vm.mac_id,
      vm.evse_id,
      vm.vin_no,
      vm.AutoCharge_Enabled,
      vm.is_default,
      vm.status,
      vm.created_date,
      vm.modify_date
    FROM vehicle_mst vm
    INNER JOIN vehicle_brand_mst vbm ON vm.brand_id = vbm.id
    INNER JOIN vehicle_model_mst vmm ON vm.model_id = vmm.id
    INNER JOIN connector_type_mst ctm ON vm.connector_type_id = ctm.id
    LEFT JOIN connector_type_mst ctm2 ON vm.charger_type_id = ctm2.id
    LEFT JOIN vehicle_owner_mst vom ON vm.owner_id = vom.id
    WHERE vm.status <> 'D'
    ORDER BY vm.id DESC
  `;

  try {
    const res = await pool.query(stmt);
    return {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    };
  } catch (e) {
    return {
      status: false,
      message: `ERROR: ${e.message}`,
      count: 0,
      data: []
    };
  }
};

/**
 * Get all vehicles for a specific user (role-based)
 * Includes: owner, AutoCharge, brand, model, connector, charger
 */
VehicleView.getVehiclesByUserId_RB_New = async (user_id) => {
  const stmt = `
    SELECT 
      vm.id,
      vm.user_id,
      vm.owner_id,
      CONCAT(COALESCE(vom.first_name, ''), ' ', COALESCE(vom.last_name, '')) AS owner_name,
      vom.mobile_no AS owner_mobile,
      vom.email AS owner_email,
      vm.brand_id,
      vbm.name AS brand_name,
      vm.model_id,
      vmm.name AS model_name,
      vm.connector_type_id,
      ctm.name AS connector_type_name,
      vm.charger_type_id,
      ctm2.name AS charger_type_name,
      vm.registration_no,
      vm.year_of_manufacture,
      vmm.image_url AS model_image_url,
      vm.engine_no,
      vm.chassis_no,
      vm.mac_id,
      vm.evse_id,
      vm.vin_no,
      vm.AutoCharge_Enabled,
      vm.is_default,
      vm.status,
      vm.created_date,
      vm.modify_date
    FROM vehicle_mst vm
    INNER JOIN vehicle_brand_mst vbm ON vm.brand_id = vbm.id
    INNER JOIN vehicle_model_mst vmm ON vm.model_id = vmm.id
    INNER JOIN connector_type_mst ctm ON vm.connector_type_id = ctm.id
    LEFT JOIN connector_type_mst ctm2 ON vm.charger_type_id = ctm2.id
    LEFT JOIN vehicle_owner_mst vom ON vm.owner_id = vom.id
    WHERE vm.status <> 'D' AND vm.user_id = ?
    ORDER BY vm.id DESC
  `;

  try {
    const res = await pool.query(stmt, [user_id]);
    return {
      status: true,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    };
  } catch (e) {
    return {
      status: false,
      message: `ERROR: ${e.message}`,
      count: 0,
      data: []
    };
  }
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
  VModel_CType: VModel_CType,
   VehicleOwner: VehicleOwner 
};