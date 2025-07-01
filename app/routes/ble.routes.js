const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const ble = require("../controllers/ble.controller.js");
  
    app.post("/ble/getBLELogs",checkToken, ble.getBLELogs);
    
    
  };