const { checkToken } = require('../middleware/jwt.js')
module.exports = app => {
    const evComponentDealer = require("../controllers/ev-component-dealer.controller.js");
      //---23-03-2022 cerate a new vehicle brand---
    app.post("/evComponentDealer/componentDealer",checkToken, evComponentDealer.create);
    app.delete("/evComponentDealer/deleteComponentDealer/:id/:modify_by",checkToken, evComponentDealer.deleteEvComponentDealer);
    app.post("/evComponentDealer/updateComponentDealer",checkToken, evComponentDealer.updateEvComponentDealer);
    app.post("/evComponentDealer/publishComponentDealer",checkToken, evComponentDealer.publishEvComponentDealer);
    app.get("/evComponentDealer/getAllComponentDealer",checkToken, evComponentDealer.getAllEvComponentDealer);
    app.get("/evComponentDealer/getEVComponentsManufacturersList",checkToken, evComponentDealer.getEVComponentsManufacturersList);
    app.post("/evComponentDealer/moderateComponentDealer",checkToken, evComponentDealer.moderateComponentDealer);
    app.get("/evComponentDealer/getAllModerateComponentDealer",checkToken, evComponentDealer.getAllModerateComponentDealer);
};