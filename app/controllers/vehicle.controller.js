const myModule = require("../models/vehicle.model.js");

const Vehicle = myModule.Vehicle;
const VehicleModel = myModule.VehicleModel;
const VehicleView = myModule.VehicleView;
const VehicleType = myModule.VehicleType;
const VModel_CType = myModule.VModel_CType;

  

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
