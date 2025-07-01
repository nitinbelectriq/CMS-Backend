const myModule = require("../models/charger-monitoring.model.js");

const ChargerMonitoring = myModule.ChargerMonitoring;  


exports.getMenus = (req, res) => {
  ChargerMonitoring.getMenus( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } 
    } else res.send(data);
  });
};

exports.getAvailabilityType = (req, res) => {
  ChargerMonitoring.getAvailabilityType( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } 
    } else res.send(data);
  });
};



