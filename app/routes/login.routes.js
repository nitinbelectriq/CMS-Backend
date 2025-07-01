const { authenticateUser } = require("../middleware/authentication.js");
const { checkToken } = require('../middleware/jwt');

module.exports = app => {
    const login = require("../controllers/login.controller.js");

    // login to get token
    app.post("/login", login.authorize);
    app.post("/loginViaMobile", login.loginViaMobile);
    app.post("/loginBLE", login.authorizeBLE);
    app.post("/loginCustom", login.loginCustom);
    app.post("/register", login.register);
    app.post("/registerNew", login.registerNew);
    app.post("/registerNewBLE", login.registerNewBLE);
    app.post("/verifyUser", login.verifyUser);
    app.post("/verifyUserNew", login.verifyUserNew);
    app.post("/verifyUserNewBLE", login.verifyUserNewBLE);
    app.post("/verifyOTP", login.verifyOTP);
    app.post("/verifyOTPNew", login.verifyOTPNew);
    // app.post("/verifyUserAlexa", login.verifyUserAlexa);
    app.post("/forgotpassword", authenticateUser,login.forgotpassword);
    app.post("/updatepassword", login.updatepassword);
    app.post("/updatePasswordNewBLE", login.updatePasswordNewBLE);
    app.post("/webforgotpassword", login.Webforgotpassword);
    app.post("/getOTP",authenticateUser, login.getOTP);
    app.post("/getOTPNew", login.getOTPNew);
    app.post("/getOTPAnonymous", login.getOTPAnonymous);


    
};