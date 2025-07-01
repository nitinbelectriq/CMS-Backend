const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const clients = require("../controllers/client.controller.js");
  
    // register a new vehicle
    app.post("/client/create",checkToken, clients.create);
    // update register a new vehicle
    app.post("/client/update",checkToken, clients.update);

    //get all registered vehicles
    app.get("/client/getClients", checkToken, clients.getClients);
    //get all registered vehicles
    app.get("/client/getClientsCW/:login_id", checkToken, clients.getClientsCW);

    app.get("/client/getActiveClientsCW/:login_id",checkToken, clients.getActiveClientsCW);

    
    app.get("/client/getClientById/:id",checkToken, clients.getClientById);

    // Delete a registered vehicle with id
    app.delete("/client/delete/:id", checkToken,clients.delete);


     
     app.post("/client/createClientModuleMapping",checkToken, clients.createClientModuleMapping);
     app.post("/client/updateClientModuleMapping",checkToken, clients.updateClientModuleMapping);
     app.get("/client/getClientModuleMapping", checkToken, clients.getClientModuleMapping);
     app.get("/client/getClientModuleMappingById/:id", checkToken, clients.getClientModuleMappingById);
     app.get("/client/getClientModuleMappingByClientId/:client_id", checkToken, clients.getClientModuleMappingByClientId);
    
  };