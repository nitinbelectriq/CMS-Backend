const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargerTypes = require("../controllers/charger-type.controller.js");
  
    app.post("/chargerType/create", checkToken, chargerTypes.create);
    
    app.post("/chargerType/update", checkToken, chargerTypes.update);

    //get all registered vehicles
    app.get("/chargerType/getChargerTypes", checkToken,  chargerTypes.getChargerTypes);

    app.get("/chargerType/getActiveChargerTypes",  checkToken, chargerTypes.getActiveChargerTypes);

    
    app.get("/chargerType/getChargerTypeById/:id", checkToken, chargerTypes.getChargerTypeById);

    // Delete a registered vehicle with id
    app.delete("/chargerType/delete/:id", checkToken, chargerTypes.delete);
    
  };