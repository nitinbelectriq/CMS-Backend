const myModule = require("../models/ble.model.js");

const Ble = myModule.Ble;  

exports.getBLELogs = (req, res) => {

  Ble.getBLELogs(req.body, (err, data) => {
    res.send(data);
 });
};
