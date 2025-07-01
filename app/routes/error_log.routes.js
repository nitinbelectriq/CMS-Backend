module.exports = app => {
    const errors = require("../controllers/error_log.controller.js");

    // get error log
     app.get("/error/getAllErrorLog", errors.getAllErrorLog);   
    
    // create a new Error log
    app.post("/error/errorLog", errors.errorLog);
    

    
};