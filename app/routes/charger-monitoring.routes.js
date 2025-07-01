const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargerMonitorings = require("../controllers/charger-monitoring.controller.js");
  
    // // register a new vehicle
    // app.post("/chargerMonitoring/create", chargerMonitorings.create);

    // // update register a new vehicle
    // app.post("/chargerMonitoring/update", chargerMonitorings.update);

    //get all registered vehicles
    app.get("/chargerMonitoring/getMenus",checkToken, chargerMonitorings.getMenus);
    app.get("/chargerMonitoring/getAvailabilityType",checkToken, chargerMonitorings.getAvailabilityType);

    // 
    // app.get("/chargerMonitoring/getCpoById/:id", chargerMonitorings.getCpoById);
    
    // 
    // app.get("/chargerMonitoring/getCpoByClientId/:client_id", chargerMonitorings.getCpoByClientId);

    // // Delete a registered vehicle with id
    // app.delete("/chargerMonitoring/delete/:id", chargerMonitorings.delete);    
  };