const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const versions = require("../controllers/version.controller.js");
  
    // register a new vehicle
    app.post("/version/create", versions.create);

    // update register a new vehicle
    app.post("/version/update", versions.update);

   
    app.get("/version/getVersions", versions.getVersions);

    app.get("/version/getVersionById/:id", versions.getVersionById);

    // Delete a registered vehicle with id
    app.delete("/version/delete/:id", versions.delete);
    
  };