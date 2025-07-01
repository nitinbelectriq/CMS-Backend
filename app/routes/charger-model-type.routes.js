const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {

    const  ChargerModelTypes= require("../controllers/charger-model-type.controller");

    //get All types of charger models
    app.get("/charger_model_type/getChargerModelTypes",checkToken, ChargerModelTypes.findAll);
};