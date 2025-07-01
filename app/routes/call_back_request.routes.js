const { authenticateUser } = require("../middleware/authentication.js");
const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    const cbr = require("../controllers/call_back_request.controller.js");

    // login to get token
    app.post("/cbr/getCallHistory",checkToken, cbr.getCallHistory);
    app.get("/cbr/getAllCallHistory",checkToken, cbr.getAllCallHistory);
    app.post("/cbr/createRequest",checkToken, cbr.createRequest);
    app.post("/cbr/closeRequest",checkToken, cbr.closeRequest);    
};