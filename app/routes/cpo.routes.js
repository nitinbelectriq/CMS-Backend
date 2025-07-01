module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const cpos = require("../controllers/cpo.controller.js");
  
    // register a new vehicle
    app.post("/cpo/create", cpos.create);

    // update register a new vehicle
    app.post("/cpo/update", cpos.update);

/* @swagger
  components : 
    schemas:
      Book : 
        type: object
        required : 
          -title
          - author
        properties: 
          id : 
            type : string
            description : auto generated id
          title : 
            type : string
            description : The book title

        example : 
          id : descsdsd
          title : The New Turin

*/
    
    //get all registered vehicles
    app.get("/cpo/getCpos", cpos.getCpos);
    app.get("/cpo/getCposCW/:login_id", cpos.getCposCW);
    app.get("/cpo/getActiveCposCW/:login_id", cpos.getActiveCposCW);

    
    app.get("/cpo/getCpoById/:id", cpos.getCpoById);
    
    
    app.get("/cpo/getCpoByClientId/:client_id", cpos.getCpoByClientId);

    app.get("/cpo/getActiveCposByClientId/:client_id", cpos.getActiveCposByClientId);

    
    app.get("/cpo/getCpoByClientIdCW/:client_id/:user_id", cpos.getCpoByClientIdCW);

    // Delete a registered vehicle with id
    app.delete("/cpo/delete/:id", cpos.delete);    
  };