const myModule = require("../models/subsidy.model");

const subSidy = myModule.Subsidy;

  exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Subsidy
    const subsidy = new subSidy({     
      id: req.body.id,
      state_id: req.body.state_id,
      per_KWh_of_battery: req.body.per_KWh_of_battery,
      capacity: !!req.body.capacity ? req.body.capacity:null,
      max_subsidy: !! req.body.max_subsidy ? req.body.max_subsidy:null,
      road_tax_exemption: !! req.body.road_tax_exemption ? req.body.road_tax_exemption:null,
      vehicle_type_id: !! req.body.vehicle_type_id ? req.body.vehicle_type_id:null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
    // Save SubSidy in the database
    subSidy.create(subsidy, (err, data) => {
  
      // if (err)
      //   res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating the Customer."
      //   });
      // else 
      res.send(data);
    });
       
  };
  exports.getAllSubsidy=(req,res)=>{
    subSidy.getAllSubsidy((err,data)=>{
      res.send(data);
    })
  };

  // exports.getSubsidyByVehicleTypeId =  (req, res) => {
  //   subSidy.getSubsidyByVehicleTypeId(req.params.id).then(response=>{
  //     res.send(response);
  //   });
  //   // let vehicleResult =  await  VehicleView.getVehiclesByUserId(req.params.id);
  //   // res.send(vehicleResult);
  // };

  exports.getSubsidyByVehicleType = (req, res) => {

    let vehicle_type = req.params.vehicle_type;

    subSidy.getSubsidyByVehicleType(vehicle_type, (err, data) => {
  
      res.send(data);
    });
  };
  exports.updateSubsidy = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const subsidy = new subSidy({
      id: req.body.id,
      state_id: req.body.state_id,
      per_KWh_of_battery: req.body.per_KWh_of_battery,
      capacity: !!req.body.capacity ?req.body.capacity :null,
      max_subsidy: !! req.body.max_subsidy ? req.body.max_subsidy:null,
      road_tax_exemption: !! req.body.road_tax_exemption ? req.body.road_tax_exemption :null,
      vehicle_type_id: !! req.body.vehicle_type_id ? req.body.vehicle_type_id:null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
    subSidy.updateSubsidy(subsidy, (err, data) => {
        res.send(data);
      });
  };
  exports.publishSubsidy = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const subsidy = new subSidy({
      id: req.body.id,
      state_id: req.body.state_id,
      per_KWh_of_battery: req.body.per_KWh_of_battery,
      capacity: !!req.body.website ?req.body.capacity :null,
      max_subsidy: !! req.body.email ? req.body.max_subsidy:null,
      road_tax_exemption: !! req.body.cp_name ? req.body.road_tax_exemption :null,
      vehicle_type_id: !! req.body.mobile ? req.body.vehicle_type_id:null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
    subSidy.publishSubsidy(subsidy, (err, data) => {
        res.send(data);
      });
  };
  exports.deleteSubsidy = (req, res) => {
    
    subSidy.deleteSubsidy(req.params.id,req.params.modifyby, (err, data) => {
      res.status(200).send(data);
    });
  };

  exports.moderateSubsidy = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const subsidy = new subSidy({
      id: req.body.id,
      status :  req.body.status,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby
    });
    subSidy.moderateSubsidy(subsidy, (err, data) => {
        res.send(data);
      });
  };
  exports.getAllModerateSubsidyList=(req,res)=>{
    subSidy.getAllModerateSubsidyList((err,data)=>{
      res.send(data);
    })
  };