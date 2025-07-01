module.exports = app => {

    const CurrentTypes = require("../controllers/current-type.controller.js");

    //get All Current types
    app.get("/current_type/getCurrentTypes", CurrentTypes.findAll);
};