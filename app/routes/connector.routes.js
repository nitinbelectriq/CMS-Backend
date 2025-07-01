module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const connectorTypes = require("../controllers/connector.controller.js");
  
    // Retrieve all Customers
    app.get("/connectorTypes/:vehicleModelId", connectorTypes.findAllConnectorTypesByVehicleModelId);

    // Retrieve all Customers
    app.get("/connectorTypesPublished/:vehicleModelId", connectorTypes.findAllConnectorTypesByVehicleModelIdPublished);

    // Retrieve all charger types 
    app.get("/connectorTypes", connectorTypes.findAllConnectorTypes);

    // Retrieve all charger types 
    app.get("/connectorTypesExcludingVModelId/:vehicleModelId", connectorTypes.findAllConnectorTypesExcludingVModelId);
  
    // Retrieve all charger types 
    app.get("/getAllCTypesExcludingOtherAlreadyMapped/:vehicleModelId/:ct_id", connectorTypes.getAllCTypesExcludingOtherAlreadyMapped);
  
    
  };