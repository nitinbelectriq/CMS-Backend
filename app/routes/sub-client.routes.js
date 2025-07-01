const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    const subClients = require("../controllers/sub-client.controller.js");
  
    app.post("/subClient/create", subClients.create);
    app.post("/subClient/update", subClients.update);
    app.get("/subClient/getSubClients", checkToken, subClients.getSubClients);
    app.get("/subClient/getSubClientById/:id", subClients.getSubClientById);
    app.get("/subClient/getSubClientByClientId/:id", subClients.getSubClientByClientId);
    app.delete("/subClient/delete/:id", subClients.delete);
    
  };