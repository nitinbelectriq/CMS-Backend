const { checkToken } = require('../middleware/jwt.js')
module.exports = app => {
     
    const alexa = require("../controllers/alexa.controller.js");
  
     
     app.post("/alexa", alexa.authorize);
    
  };