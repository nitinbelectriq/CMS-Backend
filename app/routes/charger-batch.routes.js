const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargerBatches = require("../controllers/charger-batch.controller.js");
  
    // register a new vehicle
    app.post("/chargerBatch/create",checkToken, chargerBatches.create);

    // update register a new vehicle
    app.post("/chargerBatch/update",checkToken, chargerBatches.update);

    //get all registered vehicles
    app.get("/chargerBatch/getChargerBatches",checkToken, chargerBatches.getChargerBatches);

    

    app.get("/chargerBatch/getChargerBatchById/:id",checkToken, chargerBatches.getChargerBatchById);

    // Delete a registered vehicle with id
    app.delete("/chargerBatch/delete/:id",checkToken, chargerBatches.delete);
    
  };