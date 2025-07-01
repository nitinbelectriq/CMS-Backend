const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const rfids = require("../controllers/rf-id.controller.js");
  
    // register a new vehicle
    app.post("/rfid/create", rfids.create);
    // update register a new vehicle
    app.post("/rfid/update", rfids.update);

    // update register a new vehicle
    app.post("/rfid/updateCpoRfidMapping", rfids.updateCpoRfidMapping);
    // update register a new vehicle
    app.post("/rfid/createCpoRfidMapping", rfids.createCpoRfidMapping);

    //get all registered vehicles
    app.get("/rfid/getRFids", checkToken, rfids.getRFids);
    app.get("/rfid/getCpoRFidMappingCW/:login_id", checkToken, rfids.getCpoRFidMappingCW);
    app.get("/rfid/getCpoRFidMappingCCS/:login_id/:client_id/:cpo_id/:station_id", checkToken, rfids.getCpoRFidMappingCCS);

    //get all registered vehicles
    app.get("/rfid/getRFidsByCpoId/:cpo_id", rfids.getRFidsByCpoId);
    app.get("/rfid/getAllRFidsWithMappedCPOs/:cpo_id", rfids.getAllRFidsWithMappedCPOs);

    
    app.get("/rfid/getRFidnoById/:id", rfids.getRFno_ById);

    // Delete a registered vehicle with id
    app.delete("/rfid/delete/:id/:user_id", rfids.delete);
    app.delete("/rfid/unMapRFidCpoID/:id/:user_id", rfids.unMapRFidCpoID);
    
  };