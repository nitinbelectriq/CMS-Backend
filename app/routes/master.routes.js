module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const masters = require("../controllers/master.controller.js");
  
    app.get("/master/getLocationTypes", masters.getLocationTypes);
    app.get("/master/getChargerRegistrationTypes", masters.getChargerRegistrationTypes);
    app.get("/master/getElectricitylineTypes", masters.getElectricitylineTypes);

    //COUNTRY
    app.post("/master/createCountry", masters.createCountry);
    app.post("/master/updateCountry", masters.updateCountry);
    app.delete("/master/deleteCountry/:id/:user_id", masters.deleteCountry);
    app.get("/master/getAllCountries", masters.getAllCountries);
    app.get("/master/getAllCountriesBLE", masters.getAllCountriesBLE);
    app.get("/master/getCountries", masters.getCountries);
    app.get("/master/getCountryByState/:id", masters.getCountryByState);

    //STATE
    app.post("/master/createState", masters.createState);
    app.post("/master/updateState", masters.updateState);
    app.delete("/master/deleteState/:id/:user_id", masters.deleteState);
    app.get("/master/getAllStates", masters.getAllStates);
    app.get("/master/getStates", masters.getStates);
    app.get("/master/getStateByCountry/:id", masters.getStateByCountry);
    app.get("/master/getStateByCountryBLE/:id", masters.getStateByCountryBLE);
    app.get("/master/getStateByCity/:id", masters.getStateByCity);
    app.post("/master/createStatePINMapping", masters.createStatePINMapping);
    app.get("/master/getAllStatePINMapping", masters.getAllStatePINMapping);
    app.post("/master/updateStatePINMapping", masters.updateStatePINMapping);
    app.get("/master/allPINByStateId/:state_id", masters.allPINByStateId);
    app.get("/master/allActivePINByStateId/:state_id", masters.allActivePINByStateId);
    app.delete("/master/deleteStatePINMapping/:id/:login_id", masters.deleteStatePINMapping);
    
    //CITY
    app.post("/master/createCity", masters.createCity);
    app.post("/master/updateCity", masters.updateCity);
    app.delete("/master/deleteCity/:id/:user_id", masters.deleteCity);
    app.get("/master/getAllCities", masters.getAllCities);
    app.get("/master/getCities", masters.getCities);
    app.get("/master/getCityByState/:id", masters.getCityByState);
    app.get("/master/getCountryStateByPIN/:PIN", masters.getCountryStateByPIN);
    app.get("/master/getChargerConfigurationKeys", masters.getChargerConfigurationKeys);
    
    app.get("/master/getQuestions", masters.getQuestions); //token not required

    // app.get("/master/getChargingProfileKind",masters.getChargingProfileKind)
    // app.get("/master/getChargingRecurrencyKind",masters.getChargingRecurrencyKind)
    // app.get("/master/getChargingProfilePurpose",masters.getChargingProfilePurpose)
    // app.get("/master/getChargingRateUnit",masters.getChargingRateUnit)


    app.get("/master/getActiveMasterConfigData/:key", masters.getActiveMasterConfigData);

    app.get("/master/getProjects", masters.getProjects);
    app.get("/master/navListByUserId/:login_id/:project_id", masters.navListByUserId);
    app.get("/master/getAllNotificationEngineList", masters.getAllNotificationEngineList);
    app.get("/master/getNotificationDetailsByEventCode/:event_code", masters.getNotificationDetailsByEventCode);
    app.post("/master/createNotificationEngine", masters.createNotificationEngine);
    app.post("/master/updateNotificationEngine", masters.updateNotificationEngine);
    app.delete("/master/deleteNotificationEngine/:id/:modify_by", masters.deleteNotificationEngine);
    // use for send sms notification --28-06-2022
    app.get("/master/testSms", masters.testSms);

    app.post("/master/schedulerSms", masters.schedulerSms);
    
  };