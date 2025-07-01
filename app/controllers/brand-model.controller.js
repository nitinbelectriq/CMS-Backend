const myModule = require("../models/brand-model.model.js");

const VehicleModel = myModule.VehicleModel;
debugger;
  exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  debugger;
    // Create a VehicleModel
    const vehicle = new VehicleModel({
      id : req.body.id,
      brand_id : req.body.brand_id,
      vehicle_type_id : req.body.vehicle_type_id,
      vehicle_type : req.body.vehicle_type,
      connector_type_id : req.body.connector_type_id,
      charger_type_id : req.body.charger_type_id,
      driver_range : req.body.driver_range,
      image_url : req.body.image_url,    
      name : req.body.name,
      status : req.body.status,
      created_date : req.body.created_date,
      created_by : req.body.created_by,
      modify_date : req.body.modify_date,
      modify_by : req.body.modify_by
 
    });
  
    // Save Customer in the database
    VehicleModel.create(vehicle, (err, data) => {
      // if (err)
      //   res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating the Customer."
      //   });
      // else 
      res.send(data);
    });    
  };
  exports.getAllVehicleModel = (req, res) => {
    VehicleModel.getAllVehicleModel((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Vehicle Brand."
        });
      else res.send(data);
    });
  };
  exports.getVehicleManufacturesByVehicleType = (req, res) => {
debugger;
    let vehicle_type = req.params.vehicle_type;
    VehicleModel.getVehicleManufacturesByVehicleType(vehicle_type, (err, data) => {
  
      res.send(data);
    });
  };
  exports.deleteVehicleModel = (req, res) => {
   
    VehicleModel.deleteVehicleModel(req.params.id,req.params.modify_by, (err, data) => {
      res.status(200).send(data);
    });
  };
  exports.updateVehicleModel = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const vehicle = new VehicleModel({
      id : req.body.id,
      brand_id : req.body.brand_id,
      vehicle_type_id : req.body.vehicle_type_id,
      connector_type_id : req.body.connector_type_id,
      charger_type_id : req.body.charger_type_id,
      driver_range : req.body.driver_range,
      image_url : req.body.image_url,    
      name : req.body.name,
      status : req.body.status,
      modify_date : req.body.modify_date,
      modify_by : req.body.modify_by
    });
    VehicleModel.updateVehicleModel(vehicle, (err, data) => {
        res.send(data);
      });
  };
  exports.publishVehicleModel = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }else {
    const vehicle = new VehicleModel({
      id: req.body.id,
      status :  req.body.status,
      modify_by: req.body.modify_by,
      modify_date: req.body.modify_date
    });
    VehicleModel.publishVehicleModel(vehicle, (err, data) => {
        res.send(data);
      });
  };
}

  exports.moderateVehicleModel = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const vehicle = new VehicleModel({
      id: req.body.id,
      status :  req.body.status,
      modify_by: req.body.modify_by,
      modify_date: req.body.modify_date
    });
    VehicleModel.moderateVehicleModel(vehicle, (err, data) => {
        res.send(data);
      });
  };
  exports.getAllModerateVehicle = (req, res) => {
    VehicleModel.getAllModerateVehicle((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Vehicle Brand."
        });
      else res.send(data);
    });
  };