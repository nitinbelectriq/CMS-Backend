const myModule = require("../models/ev-component-dealer.model");

const ComponentDealer = myModule.EvComponent;

  exports.create = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Ev Component
    const evcomponent = new ComponentDealer({
      id: req.body.id,
      company_name: req.body.company_name,
      ev_components: req.body.ev_components,
      website: !!req.body.website ?req.body.website :null,
      email: !! req.body.email ? req.body.email:null,
      cp_name: !! req.body.cp_name ? req.body.cp_name :null,
      mobile: !! req.body.mobile ? req.body.mobile:null,
      address1: !! req.body.address1 ? req.body.address1:null,
      address2: !! req.body.address2 ? req.body.address2:null,
      PIN: !!req.body.PIN ? req.body.PIN : null ,
      landmark: !!req.body.landmark ? req.body.landmark : null,
      city_id: !!req.body.city_id ? req.body.city_id :null,
      state_id: !!req.body.state_id ? req.body.state_id : '',
      country_id: !! req.body.country_id ? req.body.country_id: null,
      remarks: !! req.body.remarks ? req.body.remarks: null,
      country_id: !! req.body.country_id ? req.body.country_id: null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
  
    // Save Customer in the database
    ComponentDealer.create(evcomponent, (err, data) => {
      // if (err)
      //   res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating the Customer."
      //   });
      // else 
      res.send(data);
    });
  
  
    
  };
  exports.getAllEvComponentDealer=(req,res)=>{
    ComponentDealer.getAllEvComponentDealer((err,data)=>{
      res.send(data);
    })
  }
  exports.getEVComponentsManufacturersList = (req, res) => {

    let id = req.params.id;
    ComponentDealer.getEVComponentsManufacturersList( (err, data) => {
  
      res.send(data);
    });
  };
  exports.deleteEvComponentDealer = (req, res) => {
    ComponentDealer.deleteEvComponentDealer(req.params.id,req.params.modifyby, (err, data) => {
      res.status(200).send(data);
      // if (err) {
      //   if (err.kind === "not_found") {
      //     res.status(200).send({
      //       message: `Not found Component Dealer with id ${req.params.id}.`
      //     });
      //   } else {
      //     res.status(500).send({
      //       message: "Could not delete Component Dealer with id " + req.params.id
      //     });
      //   }
      // } else res.send({ message: `Component Dealer was deleted successfully!` });
    });
  };
  exports.updateEvComponentDealer = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const evcomponent = new ComponentDealer({
      id: req.body.id,
      company_name: req.body.company_name,
      ev_components: req.body.ev_components,
      website: !!req.body.website ?req.body.website :null,
      email: !! req.body.email ? req.body.email:null,
      cp_name: !! req.body.cp_name ? req.body.cp_name :null,
      mobile: !! req.body.mobile ? req.body.mobile:null,
      address1: !! req.body.address1 ? req.body.address1:null,
      address2: !! req.body.address2 ? req.body.address2:null,
      PIN: !!req.body.PIN ? req.body.PIN : null ,
      landmark: !!req.body.landmark ? req.body.landmark : null,
      city_id: !!req.body.city_id ? req.body.city_id :null,
      state_id: !!req.body.state_id ? req.body.state_id : '',
      country_id: !! req.body.country_id ? req.body.country_id: null,
      remarks: !! req.body.remarks ? req.body.remarks: null,
      country_id: !! req.body.country_id ? req.body.country_id: null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
    ComponentDealer.updateEvComponentDealer(evcomponent, (err, data) => {
        res.send(data);
      });
  };
  exports.publishEvComponentDealer = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const evcomponent = new ComponentDealer({
      id: req.body.id,
      company_name: req.body.company_name,
      ev_components: req.body.ev_components,
      website: !!req.body.website ?req.body.website :null,
      email: !! req.body.email ? req.body.email:null,
      cp_name: !! req.body.cp_name ? req.body.cp_name :null,
      mobile: !! req.body.mobile ? req.body.mobile:null,
      address1: !! req.body.address1 ? req.body.address1:null,
      address2: !! req.body.address2 ? req.body.address2:null,
      PIN: !!req.body.PIN ? req.body.PIN : null ,
      landmark: !!req.body.landmark ? req.body.landmark : null,
      city_id: !!req.body.city_id ? req.body.city_id :null,
      state_id: !!req.body.state_id ? req.body.state_id : '',
      country_id: !! req.body.country_id ? req.body.country_id: null,
      remarks: !! req.body.remarks ? req.body.remarks: null,
      country_id: !! req.body.country_id ? req.body.country_id: null,
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });
    ComponentDealer.publishEvComponentDealer(evcomponent, (err, data) => {
        res.send(data);
      });
  };
  exports.moderateComponentDealer = (req, res) => {
    debugger;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const evcomponent = new ComponentDealer({
      id: req.body.id,
      status :  req.body.status,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby
    });
    ComponentDealer.moderateComponentDealer(evcomponent, (err, data) => {
        res.send(data);
      });
  };

  exports.getAllModerateComponentDealer=(req,res)=>{
    ComponentDealer.getAllModerateComponentDealer((err,data)=>{
      res.send(data);
    })
  } 

  