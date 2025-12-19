const myModule = require("../models/vehicle.model.js");
const _utility = require("../utility/_utility.js");
const Vehicle = myModule.Vehicle;
const VehicleModel = myModule.VehicleModel;
const VehicleView = myModule.VehicleView;
const VehicleType = myModule.VehicleType;
const VModel_CType = myModule.VModel_CType;
const VehicleOwner = myModule.VehicleOwner;
  

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const vehicle = new Vehicle({
    brand_id: req.body.brand_id,
    user_id: req.body.user_id,
    model_id: req.body.model_id,
    connector_type_id: req.body.connector_type_id,
    charger_type_id: req.body.charger_type_id,
    registration_no: req.body.registration_no,
    year_of_manufacture: !!req.body.year_of_manufacture ? req.body.year_of_manufacture : null ,
    chassis_no: !!req.body.chassis_no ? req.body.chassis_no : '',
    engine_no: !!req.body.engine_no ? req.body.engine_no : '',
    vin_no: !!req.body.vin_no ? req.body.vin_no : '',
    is_default: req.body.is_default,
    status :  req.body.status,
    created_by : req.body.created_by
  });

  // Save Customer in the database
  Vehicle.create(vehicle, (err, data) => {
    // if (err)
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Customer."
    //   });
    // else 
    res.send(data);
  });

  // Vehicle.createVehicleBrand(vehicle, (err, data) => {
  //   // if (err)
  //   //   res.status(500).send({
  //   //     message:
  //   //       err.message || "Some error occurred while creating the Customer."
  //   //   });
  //   // else 
  //   res.send(data);
  // });

  
};
exports.create_new = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const vehicle = new Vehicle({
    brand_id: req.body.brand_id,
    user_id: req.body.user_id,
    model_id: req.body.model_id,
    connector_type_id: req.body.connector_type_id,
    charger_type_id: req.body.charger_type_id,
    registration_no: req.body.registration_no,
    year_of_manufacture: !!req.body.year_of_manufacture ? req.body.year_of_manufacture : null ,
    chassis_no: !!req.body.chassis_no ? req.body.chassis_no : '',
    engine_no: !!req.body.engine_no ? req.body.engine_no : '',
    vin_no: !!req.body.vin_no ? req.body.vin_no : '',
    is_default: req.body.is_default,
    status :  req.body.status,
    created_by : req.body.created_by
  });

  // Save Customer in the database
  Vehicle.create_new(vehicle, (err, data) => {
    // if (err)
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Customer."
    //   });
    // else 
    res.send(data);
  });

  // Vehicle.createVehicleBrand(vehicle, (err, data) => {
  //   // if (err)
  //   //   res.status(500).send({
  //   //     message:
  //   //       err.message || "Some error occurred while creating the Customer."
  //   //   });
  //   // else 
  //   res.send(data);
  // });

  
};

exports.updateRegisteredVehicle = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const vehicle = new Vehicle({
    id : req.body.id,
    brand_id: req.body.brand_id,
    user_id: req.body.user_id,
    model_id: req.body.model_id,
    connector_type_id: req.body.connector_type_id,
    charger_type_id: req.body.charger_type_id,
    registration_no: req.body.registration_no,
    year_of_manufacture: !!req.body.year_of_manufacture ? req.body.year_of_manufacture : null ,
    chassis_no: !!req.body.chassis_no ? req.body.chassis_no : '',
    engine_no: !!req.body.engine_no ? req.body.engine_no : '',
    vin_no: !!req.body.vin_no ? req.body.vin_no : '',
    is_default: req.body.is_default,
    status :  req.body.status,
    created_by : req.body.created_by,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  Vehicle.updateRegisteredVehicle(vehicle, (err, data) => {
    res.send(data);
  });

  // Vehicle.updateVehicleBrand(vehicle, (err, data) => {
  //   res.send(data);
  // });
};


exports.vModel_CTypeMap = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const vModel_CType = new VModel_CType({
    id: req.body.id,
    ct_id: req.body.ct_id,
    vm_id: req.body.vm_id,
    vType_id: req.body.vType_id,
    status: req.body.status,
    created_by: req.body.created_by
  });

  // Save Customer in the database
  VModel_CType.vModel_CTypeMap(vModel_CType, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.findAllVehicles = (req, res) => {
  // VehicleView.getAllVehicles( (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(200).send({
  //         message: `NOT_FOUND`
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Error retrieving Customer with id "
  //       });
  //     }
  //   } else res.send(data);
  // });
  VehicleView.getAllVehicles().then(response=>{
    res.send(response);
  });
  // VehicleView.getAllVehicles( (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(200).send({
  //         message: `NOT_FOUND`
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Error retrieving Customer with id "
  //       });
  //     }
  //   } else res.send(data);
  // });
};

exports.getVehiclesByUserId =  (req, res) => {
  VehicleView.getVehiclesByUserId(req.params.id).then(response=>{
    res.send(response);
  });
  // let vehicleResult =  await  VehicleView.getVehiclesByUserId(req.params.id);
  // res.send(vehicleResult);
};

exports.findAllVehicleModelsByBrandId = (req, res) => {
  const brandId = parseInt(req.params.brandId, 10);
  if (isNaN(brandId)) {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid brandId parameter',
      data: null
    });
  }

  VehicleModel.getAllVehicleModelsByBrandId(brandId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          status: 'fail',
          message: `No vehicle models found for brandId ${brandId}.`,
          data: []
        });
      } else {
        return res.status(500).send({
          status: 'error',
          message: `Error retrieving vehicle models for brandId ${brandId}.`,
          data: null
        });
      }
    }
    res.send({
      status: 'success',
      message: `Vehicle models fetched successfully for brandId ${brandId}.`,
      data: data
    });
  });
};



exports.findAllVehicleTypes = (req, res) => {
  VehicleType.getAllVehicleTypes((err, data) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: err.message || "Some error occurred while retrieving vehicle types.",
        data: null
      });
    }

    res.send({
      status: 'success',
      message: 'Vehicle types fetched successfully.',
      data: data
    });
  });
};



exports.findAllPublishedVModel = (req, res) => {
  VModel_CType.getAllPublishedVModel((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vehicle model and connector type mapping."
      });
    else res.send(data);
  });
};

exports.findAllvModel_CTypes = (req, res) => {
  VModel_CType.getAllvModel_CTypes((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vehicle model and connector type mapping."
      });
    else res.send(data);
  });
};

exports.publishVModel_CTYpeWithoutModify = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  VModel_CType.publishVModel_CTYpeWithoutModify(req.body.id,new VModel_CType(req.body),(err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.body.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.body.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.publishVModel_CTYpe = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  VModel_CType.publishVModel_CTYpe(
    req.body.id,
    new VModel_CType(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.body.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.body.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.moderateVModel_CTYpeWithoutModify = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  VModel_CType.moderateVModel_CTYpeWithoutModify(
    req.body.id,
    new VModel_CType(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.body.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.body.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.moderateVModel_CTYpe = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  VModel_CType.moderateVModel_CTYpe(req.params.id,new VModel_CType(req.body),(err, data) => {
      
    if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.deleteRegisteredVehicle = (req, res) => {
  Vehicle.deleteRegisteredVehicle(req.params.id,req.params.modify_by, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found vehicle with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.id
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};


exports.deleteC_Type_V_Model_Mapping = (req, res) => {
  VModel_CType.deleteC_Type_V_Model_Mapping(req.params.id,req.params.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found vehicle with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete vehicle with id " + req.params.id
        });
      }
    } else res.send({ message: `vehicle was deleted successfully!` });
  });
};

// exports.deleteVehicleBrand = (req, res) => {
//   Vehicle.deleteVehicleBrand(req.params.id,req.params.modify_by, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(200).send({
//           message: `Not found vehicle Brand with id ${req.params.id}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete Brand with id " + req.params.id
//         });
//       }
//     } else res.send({ message: `Brand was deleted successfully!` });
//   });
// };

// =========================================
// ✅ ADD NEW VEHICLE
// =========================================
exports.addNewVehicle = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ status: false, message: "Request body cannot be empty!" });
    }

    const {
      owner_id,
      user_id,
      brand_id,
      model_id,
       vehicle_type_id,
      connector_type_id,
      charger_type_id,
      registration_no,
      year_of_manufacture,
      engine_no,
      chassis_no,
      mac_id,
      evse_id,
      vin_no,
      AutoCharge_Enabled,
      is_default,
      status,
      created_by,
      modify_by,
    } = req.body;

    const vehicle = {
      owner_id: Number(owner_id) || null,
      user_id: Number(user_id),
      brand_id,
      model_id,
      connector_type_id,
      charger_type_id: charger_type_id || null,
      registration_no,
      year_of_manufacture: year_of_manufacture || null,
      engine_no: engine_no || "",
      chassis_no: chassis_no || "",
      mac_id: mac_id || "",
      evse_id: evse_id || "",
      vin_no: vin_no || "",
      AutoCharge_Enabled: AutoCharge_Enabled === "Y" ? "Y" : "N",
      is_default: is_default || 0,
      status: status === "Y" ? "Y" : "N",
      created_by: created_by || user_id,
      modify_by: modify_by || user_id,
    };

    console.log("🚗 Final Vehicle Insert Payload:", vehicle);

    Vehicle.addNewVehicle(vehicle, (err, data) => {
      if (err) return res.status(500).send({ status: false, message: err.message });
      return res.status(200).send(data);
    });
  } catch (e) {
    res.status(500).send({ status: false, message: e.message });
  }
};

// =========================================
// ✅ UPDATE EXISTING VEHICLE
// =========================================
exports.updateExistingVehicle = (req, res) => {
  debugger;
  if (!req.body || !req.body.id) {
    return res.status(400).send({ status: false, message: "Vehicle ID is required!" });
  }

  const vehicle = new Vehicle({
    id: req.body.id,
    owner_id: req.body.owner_id,
    user_id: req.body.user_id,
    brand_id: req.body.brand_id,
    model_id: req.body.model_id,
    vehicle_type_id: req.body.vehicle_type_id,
    connector_type_id: req.body.connector_type_id,
    charger_type_id: req.body.charger_type_id,
    registration_no: req.body.registration_no,
    year_of_manufacture: req.body.year_of_manufacture || null,
    engine_no: req.body.engine_no || '',
    chassis_no: req.body.chassis_no || '',
    mac_id: req.body.mac_id || '',
    evse_id: req.body.evse_id || '',
    vin_no: req.body.vin_no || '',
    AutoCharge_Enabled: req.body.AutoCharge_Enabled || 'N',
    is_default: req.body.is_default || 0,
    status: req.body.status || 'Y',
    modify_by: req.body.modify_by
  });

  Vehicle.updateExistingVehicle(vehicle, (err, data) => {
    if (err) res.status(500).send({ status: false, message: err.message });
    else res.send(data);
  });
};

// =========================================
// ✅ TOGGLE AUTOCHARGE ENABLE / DISABLE
// =========================================
exports.toggleAutoCharge = async (req, res) => {
  const { id, AutoCharge_Enabled, modify_by } = req.body;
  if (!id || !AutoCharge_Enabled) {
    return res.status(400).send({ status: false, message: "Vehicle ID and AutoCharge_Enabled are required!" });
  }

  try {
    const result = await Vehicle.toggleAutoCharge(id, AutoCharge_Enabled, modify_by);
    res.send(result);
  } catch (e) {
    res.status(500).send({ status: false, message: e.message });
  }
};

// =========================================
// ✅ DELETE VEHICLE
// =========================================
exports.deleteVehicle = (req, res) => {
  Vehicle.deleteVehicle(req.params.id, req.params.modify_by, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ status: false, message: "Vehicle not found." });
      } else {
        res.status(500).send({ status: false, message: "Error deleting vehicle." });
      }
    } else res.send(data);
  });
};


// =============================================
// VEHICLE OWNER APIS (Integrated Section)
// =============================================

// ✅ CREATE OWNER
exports.createVehicleOwner = async (req, res) => {
  try {
    if (!req.body.first_name) {
      return res.status(400).send({ status: false, message: "First name is required" });
    }

    const owner = {
      ...req.body,
      created_by: req.body.created_by || req.body.user_id || 0,
      modify_by: req.body.modify_by || req.body.user_id || 0,
      status: req.body.status || "Y",
    };

    console.log("👤 Owner insert payload:", owner);

    VehicleOwner.createOwner(owner, (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    });
  } catch (e) {
    res.status(500).send({ status: false, message: e.message });
  }
};

// ✅ UPDATE OWNER
exports.updateVehicleOwner = (req, res) => {
  if (!req.body.id) {
    return res.status(400).send({ status: false, message: "Owner ID is required" });
  }

  const owner = new VehicleOwner(req.body);
  VehicleOwner.updateOwner(owner, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
};

// ✅ GET ALL OWNERS
exports.getAllVehicleOwners = (req, res) => {
  VehicleOwner.getAllOwners((err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
};

// ✅ GET OWNER BY ID


// ✅ DELETE OWNER
exports.deleteVehicleOwner = (req, res) => {
  VehicleOwner.deleteOwner(req.params.id, req.params.modify_by, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
};

// ======================================================
// ✅ NEW: GET ALL VEHICLES (ROLE-BASED)
// ======================================================
exports.getAllVehicles_RB = async (req, res) => {
  try {
    debugger;
    const user_id = login_id = req.params.login_id;

    // Get user’s client and role details
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(user_id);
    const client_id = clientAndRoleDetails.data[0].client_id;
    const isSA = clientAndRoleDetails.data.some(x => x.role_code === "SA");

    let response;
    if (isSA) {
      // Super Admin: get all vehicles
      response = await VehicleView.getAllVehicles_RB_New();
    } else {
      // Regular user: get vehicles only created by them
      response = await VehicleView.getVehiclesByUserId_RB_New(login_id);
    }

    res.send({
      status: true,
      message: response.message,
      count: response.count,
      data: response.data,
      client_id,
      isSuperAdmin: isSA
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================================================
// ✅ NEW: GET VEHICLES BY USER ID (ROLE-BASED)
// ======================================================
exports.getVehiclesByUserId_RB = async (req, res) => {
  try {
    const login_id = req.user.id;
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
    const isSA = clientAndRoleDetails.data.some(x => x.role_code === "SA");

    // Allow only logged-in user's data unless SA
    const userId = isSA && req.params.userId ? req.params.userId : login_id;
    const response = await VehicleView.getVehiclesByUserId(userId);

    res.send({
      status: true,
      message: response.message,
      count: response.count,
      data: response.data,
      isSuperAdmin: isSA
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================================================
// ✅ NEW: GET ALL VEHICLE OWNERS (ROLE-BASED)
// ======================================================
exports.getAllVehicleOwners_RB = async (req, res) => {
  try {
    const login_id = req.user.id;
    const clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
    const isSA = clientAndRoleDetails.data.some(x => x.role_code === "SA");

    if (!isSA) {
      return res.status(403).send({
        status: false,
        message: "Access denied: Only Super Admin can view all owners."
      });
    }

    VehicleOwner.getAllOwners((err, data) => {
      if (err) return res.status(500).send(err);
      res.send(data);
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================================================
// ✅ NEW: GET VEHICLE OWNER BY ID (ROLE-BASED)
// ======================================================
exports.getVehicleOwnerById_RB = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ status: false, message: "Missing ID parameter" });
    }

    const result = await VehicleOwner.getOwnerById(id);

    if (!result.status) {
      return res.status(404).send({
        status: false,
        message: result.message || "Owner or vehicle not found"
      });
    }

    res.status(200).send(result);

  } catch (err) {
    console.error("❌ getVehicleOwnerById_RB Error:", err);
    res.status(500).send({ status: false, message: err.message });
  }
};



