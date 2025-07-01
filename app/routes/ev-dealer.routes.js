const { checkToken } = require('../middleware/jwt.js')
module.exports = app => {
  debugger;
    const evDealer = require("../controllers/ev-dealer.controller.js");
      //---23-03-2022 cerate a new vehicle brand---
    app.post("/evDealer/evDealer",checkToken, evDealer.create);
    app.delete("/evDealer/deleteEvDealer/:id/:modifyby",checkToken, evDealer.deleteEvDealer);
    app.post("/evDealer/updateEvDealer",checkToken, evDealer.updateEvDealer);
    app.post("/evDealer/publishEvDealer",checkToken, evDealer.publishEvDealer);
    //14-04-2022---{
      // --instead of these APIs we use getModerateEvDealerListByKeys/:key and getPublishEvDealerListByKeys/:key.
    // app.get("/evDealer/getAllEvDealer",checkToken, evDealer.getAllEvDealer);
    // app.get("/evDealer/getChargingStationFranchise",checkToken, evDealer.getChargingStationFranchise);
    // app.get("/evDealer/getBatteryManufacturers",checkToken, evDealer.getBatteryManufacturers);
    //  }
    app.get("/evDealer/getEvDealerShipFranchiseProvider",checkToken, evDealer.getEvDealerShipFranchiseProvider);
    app.post("/evDealer/moderateEvDealer",checkToken, evDealer.moderateEvDealer);
    app.get("/evDealer/getModerateEvDealerListByKeys/:key",checkToken, evDealer.getModerateEvDealerListByKeys);
    app.get("/evDealer/getPublishEvDealerListByKeys/:key",checkToken, evDealer.getPublishEvDealerListByKeys);
};