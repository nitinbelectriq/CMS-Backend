const { checkToken } = require('../middleware/jwt.js')
module.exports = app => {
    const subsidy = require("../controllers/subsidy.controller.js");
      //---23-03-2022 create a new Subsidy---
    app.post("/subsidy/subsidy",checkToken, subsidy.create);
    app.delete("/subsidy/deleteSubsidy/:id/:modify_by",checkToken, subsidy.deleteSubsidy);
    app.post("/subsidy/updateSubsidy",checkToken, subsidy.updateSubsidy);
    app.post("/subsidy/publishSubsidy",checkToken, subsidy.publishSubsidy);
    app.get("/subsidy/getAllSubsidy",checkToken, subsidy.getAllSubsidy);
    app.post("/subsidy/moderateSubsidy",checkToken, subsidy.moderateSubsidy);
    app.get("/subsidy/getSubsidyByVehicleType/:vehicle_type",checkToken, subsidy.getSubsidyByVehicleType);
    app.get("/subsidy/getAllModerateSubsidyList",checkToken, subsidy.getAllModerateSubsidyList);

};