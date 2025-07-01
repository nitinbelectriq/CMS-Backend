module.exports = app => {

    const IoTypes = require("../controllers/io-type.controller.js");

    //get All IO types 
    app.get("/io_type/getIOTypes", IoTypes.findAll);
};