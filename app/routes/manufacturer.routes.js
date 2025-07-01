module.exports = app => {

    const Manufacturers = require("../controllers/manufacturer.controller.js");

    //get All IO types 
    app.get("/manufacturer/getManufacturers", Manufacturers.getManufacturers);
};