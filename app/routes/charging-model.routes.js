module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargingModels = require("../controllers/charging-model.controller");
  
    // register a new vehicle
    app.post("/chargingModel/create", chargingModels.create);

    // update register a new vehicle
    app.post("/chargingModel/update", chargingModels.update);

    //get all registered vehicles
    app.get("/chargingModel/getChargingModels", chargingModels.getChargingModels);
    app.get("/chargingModel/getChargingModelsAll", chargingModels.getChargingModelsAll);

    
    app.get("/chargingModel/getChargingModelById/:id", chargingModels.getChargingModelById);
    
    
    app.get("/chargingModel/getChargingModelByClientId/:client_id", chargingModels.getChargingModelByClientId);

    // Delete a registered vehicle with id
    app.delete("/chargingModel/delete/:id", chargingModels.delete);    
  };