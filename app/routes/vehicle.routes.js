const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const vehicles = require("../controllers/vehicle.controller.js");
  
    // register a new vehicle
    app.post("/vehicles",checkToken, vehicles.create);
    // register a new vehicle1-- added by gaurav
    app.post("/vehicles_new",checkToken, vehicles.create_new);
    // update register a new vehicle
    app.post("/updateRegisteredVehicle",checkToken, vehicles.updateRegisteredVehicle);

    // map a vehicle model with charger type
    app.post("/vModel_Ctype",checkToken, vehicles.vModel_CTypeMap);

    //get all registered vehicles
    app.get("/vehicles", checkToken,vehicles.findAllVehicles);

    //get all registered vehicles by user
    app.get("/vehicles/getVehiclesByUserId/:id",checkToken, vehicles.getVehiclesByUserId);

    
    app.get("/vehicleModels/:brandId", vehicles.findAllVehicleModelsByBrandId);

    // Retrieve all vehicle Types
    app.get("/vehicleTypes", vehicles.findAllVehicleTypes);

    // Retrieve all vehicle model and charger type mapping
    app.get("/vModel_CTypes", vehicles.findAllvModel_CTypes);

    // Retrieve all PUBLISHED vehicle model 
    app.get("/publishedVModel", checkToken,vehicles.findAllPublishedVModel);


    // publish with changes  vehicle model and charger type
    app.post("/publishVModel_CTYpe",checkToken, vehicles.publishVModel_CTYpe);

    // moderate with changes vehicle model and charger type
    app.post("/moderateVModel_CTYpe",checkToken, vehicles.moderateVModel_CTYpe);


    // publish vehicle model and charger type
    app.post("/publishVModel_CTYpeWithoutModify",checkToken, vehicles.publishVModel_CTYpeWithoutModify);

    // moderate vehicle model and charger type
    app.post("/moderateVModel_CTYpeWithoutModify",checkToken, vehicles.moderateVModel_CTYpeWithoutModify);

    // Delete a registered vehicle with id
    app.delete("/deleteRegisteredVehicle/:id/:modify_by",checkToken, vehicles.deleteRegisteredVehicle);
    app.delete("/deleteC_Type_V_Model_Mapping/:id/:user_id",checkToken, vehicles.deleteC_Type_V_Model_Mapping);
  
    // cerate a new vehicle brand
    //app.post("/vehiclebrand",checkToken, vehicles.create);
    //app.delete("/deleteVehicleBrand/:id/:modify_by",checkToken, vehicles.deleteVehicleBrand);
    //app.post("/updateVehicleBrand",checkToken, vehicles.updateVehicleBrand);
    
    
    
  };