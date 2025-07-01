const { checkToken } = require('../middleware/jwt.js')
module.exports = app => {
    const vehicleModel = require("../controllers/brand-model.controller.js");
      //---23-03-2022 cerate a new vehicle brand---
    app.get("/vehicleModel/getAllModels",checkToken, vehicleModel.getAllVehicleModel);
    app.get("/vehicleModel/getVehicleManufacturesByVehicleType/:vehicle_type",checkToken, vehicleModel.getVehicleManufacturesByVehicleType);
    app.post("/vehicleModel/create",checkToken, vehicleModel.create);
    app.post("/vehicleModel/update",checkToken, vehicleModel.updateVehicleModel);
    app.post("/vehicleModel/publish",checkToken, vehicleModel.publishVehicleModel);
    app.post("/vehicleModel/moderate",checkToken, vehicleModel.moderateVehicleModel);
    app.delete("/vehicleModel/delete/:id/:modify_by",checkToken, vehicleModel.deleteVehicleModel);
    app.get("/vehicleModel/getAllModerateVehicle",checkToken, vehicleModel.getAllModerateVehicle);
};