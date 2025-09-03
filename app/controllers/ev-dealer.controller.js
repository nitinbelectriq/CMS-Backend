const myModule = require("../models/ev-dealer.model");

const EvDealer = myModule.Dealer;
exports.create=(req,res)=>{
let resp;
//;
if (!req.body) {
  resp = {
    status: false,
    err_code: 'ERROR : 1',
    message: 'Please provide parameters.',
    count: 0,
    data: []
  }
  res.status(200).send(resp);
} else {
  const evdealer = new EvDealer({
    id : req.body.id,
    company_name : req.body.company_name,
    deal_type_id : req.body.deal_type_id,
    website : req.body.website,
    email : req.body.email,
    cp_name : req.body.cp_name,
    mobile : req.body.mobile,
    address1 : req.body.address1,
    address2 : req.body.address2,
    PIN : req.body.PIN,
    landmark : req.body.landmark,
    city_id : req.body.city_id,
    state_id : req.body.state_id,
    country_id : req.body.country_id,
    remarks : req.body.remarks,
    status : req.body.status,
    created_date : req.body.created_date,
    createdby : req.body.createdby,
  });

  EvDealer.create(evdealer, (err, data) => {
    res.send(data);
  });
};
}


    
  // exports.getAllEvDealer=(req,res)=>{
  //   EvDealer.getAllEvDealer((err,data)=>{
  //     res.send(data);
  //   })
  // };
  // exports.getChargingStationFranchise = (req, res) => {
  //   EvDealer.getChargingStationFranchise( (err, data) => {
  
  //     res.send(data);
  //   });
  // };
  // exports.getBatteryManufacturers = (req, res) => {
  //   EvDealer.getBatteryManufacturers((err, data) => {
  
  //     res.send(data);
  //   });
  // };
  exports.getBatteryManufacturers = (req, res) => {
    EvDealer.getBatteryManufacturers( (err, data) => {
  
      res.send(data);
    });
  };
  exports.getEvDealerShipFranchiseProvider = (req, res) => {
    EvDealer.getEvDealerShipFranchiseProvider((err, data) => {
  
      res.send(data);
    });
  };
  exports.deleteEvDealer = (req, res) => {
    EvDealer.deleteEvDealer(req.params.id,req.params.modifyby, (err, data) => {
       
        res.status(200).send(data);
      
    });
  };
  exports.updateEvDealer = (req, res) => {
    //;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    const evdealer = new EvDealer({
      id: req.body.id,
      company_name: req.body.company_name,
      deal_type_id: req.body.deal_type_id,
      website: !!req.body.website ?req.body.website :"",
      email: !! req.body.email ? req.body.email:"",
      cp_name: !! req.body.cp_name ? req.body.cp_name :"",
      mobile: !! req.body.mobile ? req.body.mobile:0,
      address1: !! req.body.address1 ? req.body.address1:"",
      address2: !! req.body.address2 ? req.body.address2:"",
      PIN: !!req.body.PIN ? req.body.PIN : 0,
      landmark: !!req.body.landmark ? req.body.landmark : "",
      city_id: !!req.body.city_id ? req.body.city_id :0,
      state_id: !!req.body.state_id ? req.body.state_id : 0,
      country_id: !! req.body.country_id ? req.body.country_id: 0,
      remarks: !! req.body.remarks ? req.body.remarks: "",
      status :  req.body.status,
      created_date: req.body.created_date,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby,
      createdby : req.body.createdby
    });

    EvDealer.updateEvDealer(evdealer, (err, data) => {
    
        res.send(data);
      });
  };
  exports.publishEvDealer = (req, res) => {
    //;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    const evdealer = new EvDealer({
      id: req.body.id,
      status :  req.body.status,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby
    });

    EvDealer.publishEvDealer(evdealer, (err, data) => {
    
        res.send(data);
      });
  };

  exports.moderateEvDealer = (req, res) => {
    //;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    const evdealer = new EvDealer({
      id: req.body.id,
      status :  req.body.status,
      modify_date:req.body.modify_date,
      modifyby:req.body.modifyby
    });

    EvDealer.moderateEvDealer(evdealer, (err, data) => {
    
        res.send(data);
      });
  };

  exports.getModerateEvDealerListByKeys = (req, res) => {
    let key = req.params.key;
    //;
    EvDealer.getModerateEvDealerListByKeys(key, (err, data) => {
  
      res.send(data);
    });
  };

  exports.getPublishEvDealerListByKeys = (req, res) => {
    let key = req.params.key;
    
    EvDealer.getPublishEvDealerListByKeys(key, (err, data) => {
  
      res.send(data);
    });
  };