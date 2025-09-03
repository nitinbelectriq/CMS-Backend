const { City } = require("../models/master.model.js");
const myModule = require("../models/master.model.js");

const Master = myModule.Master;
const Country = myModule.Country;
const State = myModule.State;
const StatePIN = myModule.StatePIN;
const Master_Config  = myModule.Master_Config;
const Question = myModule.Question;
const ChargerConfigurationKey = myModule.ChargerConfigurationKey;
const NotificationEngine = myModule.NotificationEngine;

exports.getLocationTypes = (req, res) => {
  Master.getLocationTypes((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getChargerRegistrationTypes = (req, res) => {
  Master.getChargerRegistrationTypes((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getElectricitylineTypes = (req, res) => {
  Master.getElectricitylineTypes((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};


exports.createCountry = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const country = new Country({
    id : req.body.id,
    name : req.body.name,
    description : req.body.description,
    iso_code : req.body.iso_code,
    country_code : req.body.country_code,
    min_mobile_length:req.body.min_mobile_length,
    max_mobile_length:req.body.max_mobile_length,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  Country.createCountry(country, (err, data) => {
    
    res.send(data);
  });
};

exports.updateCountry = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const country = new Country({
    id : req.body.id,
    name : req.body.name,
    description : req.body.description,
    iso_code : req.body.iso_code,
    country_code : req.body.country_code,
    min_mobile_length:req.body.min_mobile_length,
    max_mobile_length:req.body.max_mobile_length,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  Country.updateCountry(country, (err, data) => {
    
    res.send(data);
  });
};

exports.deleteCountry = (req, res) => {

  // Save Customer in the database
  Country.deleteCountry(req.params.id,req.params.user_id, (err, data) => {
    
    res.status(200).send(data);
  });
};



exports.getAllCountries = (req, res) => {
  Country.getAllCountries((err, data) => {
    res.send(data);
  });
};

exports.getAllCountriesBLE = (req, res) => {
  Country.getAllCountriesBLE((err, data) => {
    res.send(data);
  });
};

exports.getCountries = (req, res) => {

  Country.getCountries((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};



//CRUD states==========

exports.createState = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const state = new State({
    id : req.body.id,
    country_id : req.body.country_id,
    name : req.body.name,
    description : req.body.description,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  State.createState(state, (err, data) => {
    
    res.send(data);
  });
};

exports.updateState = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const state = new State({
    id : req.body.id,
    country_id : req.body.country_id,
    name : req.body.name,
    description : req.body.description,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  State.updateState(state, (err, data) => {
    
    res.send(data);
  });
};

exports.deleteState = (req, res) => {

  // Save Customer in the database
  State.deleteState(req.params.id,req.params.user_id, (err, data) => {
    
    res.status(200).send(data);
  });
};

exports.getAllStates = (req, res) => {
  State.getAllStates((err, data) => {
   res.send(data);
  });
};


exports.getStates = (req, res) => {
  State.getStates((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getStateByCountry = (req, res) => {
//;
  State.getStateByCountry(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getStateByCountryBLE = (req, res) => {

  State.getStateByCountryBLE(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getCountryByState = (req, res) => {

  Country.getCountryByState(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};



//CRUD city==========

exports.createCity = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const city = new City({
    id : req.body.id,
    state_id : req.body.state_id,
    name : req.body.name,
    description : req.body.description,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  City.createCity(city, (err, data) => {
    
    res.send(data);
  });
};

exports.updateCity = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const city = new City({
    id : req.body.id,
    state_id : req.body.state_id,
    name : req.body.name,
    description : req.body.description,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  City.updateCity(city, (err, data) => {
    
    res.send(data);
  });
};

exports.deleteCity = (req, res) => {

  // Save Customer in the database
  City.deleteCity(req.params.id,req.params.user_id, (err, data) => {
    
    res.status(200).send(data);
  });
};


exports.getCities = (req, res) => {
  City.getCities((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};

exports.getAllCities = (req, res) => {
  City.getAllCities((err, data) => {
    res.send(data);
  });
};


exports.getCityByState = (req, res) => {
  City.getCityByState(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};
exports.getStateByCity = (req, res) => {
  State.getStateByCity(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};

exports.getAllStatePINMapping = (req, res) => {
  StatePIN.getAllStatePINMapping((err, data) => {
   res.send(data);
  });
};
exports.allPINByStateId = (req, res) => {
  let state_id = req.params.state_id;
  StatePIN.allPINByStateId(state_id,(err, data) => {
   res.send(data);
  });
};
exports.allActivePINByStateId = (req, res) => {
  let state_id = req.params.state_id;
  StatePIN.allActivePINByStateId(state_id,(err, data) => {
   res.send(data);
  });
};

exports.createStatePINMapping = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const statePin = new StatePIN({
    id : req.body.id,
    state_id:req.body.state_id,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by,
    PIN_data : req.body.PIN_data
  });

  // Save Customer in the database
  StatePIN.createStatePINMapping(statePin, (err, data) => {
    res.send(data);
  });
};

exports.updateStatePINMapping = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle
  const statePin = new StatePIN({
    id : req.body.id,
    state_id:req.body.state_id,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by,
    PIN : req.body.PIN
  });

  // Save Customer in the database
  StatePIN.updateStatePINMapping(statePin, (err, data) => {
    
    res.send(data);
  });
};


// exports.getChargingProfileKind= (req, res) => {
//   Master_Config.getChargingProfileKind((err, data) => {
//    res.send(data);
//   });
// };
// exports.getChargingRecurrencyKind = (req, res) => {
//   Master_Config.getChargingRecurrencyKind ((err, data) => {
//    res.send(data);
//   });
// };
// exports.getChargingRateUnit= (req, res) => {
//   Master_Config.getChargingRateUnit((err, data) => {
//    res.send(data);
//   });
// };
// exports.getChargingProfilePurpose= (req, res) => {
//   Master_Config.getChargingProfilePurpose((err, data) => {
//    res.send(data);
//   });
// };

exports.getCountryStateByPIN = (req, res) => {

  Country.getCountryStateByPIN(req.params.PIN, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      }
    } else res.send(data);
  });
};

exports.getChargerConfigurationKeys = (req, res) => {

  ChargerConfigurationKey.getChargerConfigurationKeys( (err, data) => {
     res.send(data);
  });
};

exports.getQuestions = (req, res) => {
  Question.getQuestions((err, data) => {
    res.send(data);
  });
};


exports.deleteStatePINMapping = (req, res) => {
  // Save Customer in the database
  StatePIN.deleteStatePINMapping(req.params.id,req.params.login_id, (err, data) => {
    
    res.status(200).send(data);
  });
};

exports.getActiveMasterConfigData =(req,res)=>{
  let key = req.params.key;

  Master_Config.getActiveMasterConfigData (key,(err,data)=>{
    res.send(data);
  })
}
exports.getProjects = (req, res) => {
  Master_Config.getProjects( (err, data) => {
    res.send(data);
 });
};

exports.navListByUserId = (req, res) => {
  let login_id = req.params.login_id;
  let project_id = req.params.project_id;
  Master.navListByUserId(login_id,project_id, (err, data) => {
    res.send(data);
 });
};

exports.getAllNotificationEngineList = (req, res) => {

  NotificationEngine.getAllNotificationEngineList((err,data)=>{
    res.send(data);
  })
};

exports.getNotificationDetailsByEventCode = (req, res) => {
  let event_code = req.params.event_code;

  NotificationEngine.getNotificationDetailsByEventCode(event_code,(err,data)=>{
    res.send(data);
  })
};

exports.createNotificationEngine = (req,res)=>{
  if(!req.body){
    res.status(200).send({
    message : "Content can not be empty"
    }) 
 };
 const notificationEngine = new NotificationEngine({
  id : req.body.id,
  project_id :req.body.project_id,
  event_code : req.body.event_code,
  event_name : req.body.event_name,
  send_email : req.body.send_email,
  send_sms : req.body.send_sms,
  send_push : req.body.send_push,
  content_email : req.body.content_email,
  content_sms : req.body.content_sms,
  content_push : req.body.content_push,
  status : req.body.status,
  created_date : req.body.created_date,
  created_by : req.body.created_by,
  modify_date : req.body.modify_date,
  modify_by : req.body.modify_by
 });
 NotificationEngine.createNotificationEngine(notificationEngine,(err,data)=>{
   res.send(data);
 });
}

exports.updateNotificationEngine = (req,res)=>{
  if(!req.body){
    res.status(200).send({
    message : "Content can not be empty"
    }) 
 };
 const notificationEngine = new NotificationEngine({
  id : req.body.id,
  project_id :req.body.project_id,
  event_code : req.body.event_code,
  event_name : req.body.event_name,
  send_email : req.body.send_email,
  send_sms : req.body.send_sms,
  send_push : req.body.send_push,
  content_email : req.body.content_email,
  content_sms : req.body.content_sms,
  content_push : req.body.content_push,
  status : req.body.status,
  created_date : req.body.created_date,
  created_by : req.body.created_by,
  modify_date : req.body.modify_date,
  modify_by : req.body.modify_by
 });
 NotificationEngine.updateNotificationEngine(notificationEngine,(err,data)=>{
   res.send(data);
 });
}

exports.deleteNotificationEngine = (req,res)=>{

  let id = req.params.id;
  let modify_by = req.params.modify_by;
  NotificationEngine.deleteNotificationEngine(id,modify_by,(err,data)=>{
    res.status(200).send(data);
  })

 

  
}
exports.testSms = (req,res)=>{
  NotificationEngine.testSms((err,data)=>{
    res.status(200).send(data);
  })
}

  exports.schedulerSms = (req,res)=>{
    let event_code = req.body.event_code;
  let user_id = req.body.user_id;
  let datalist=req.body.datalist
    NotificationEngine.schedulerSms(event_code,user_id,datalist,(err,data)=>{
      res.status(200).send(data);
    })
}
