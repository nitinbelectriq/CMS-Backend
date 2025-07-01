const myModule = require("../models/version.model.js");

const Version = myModule.Version;  

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const version = new Version({
    name : req.body.name ,
    serial_no : req.body.serial_no,
    batch_id : req.body.batch_id ,
    station_id : req.body.station_id,
    current_version_id : req.body.current_version_id ,
    no_of_guns : req.body.no_of_guns,
    Address : req.body.Address,
    Lat : req.body.Lat,
    Lng : req.body.Lng,
    OTA_Config : req.body.OTA_Config,
    Periodic_Check_Ref_Time : req.body.Periodic_Check_Ref_Time,
    Periodicity_in_hours : req.body.Periodicity_in_hours,
    When_to_Upgrade : req.body.When_to_Upgrade,
    Upgrade_Specific_Time : req.body.Upgrade_Specific_Time,
    is_available : req.body.is_available,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by

  });

  // Save Customer in the database
  Version.create(version, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const version = new Version({
    id : req.body.id,
    name : req.body.name ,
    serial_no : req.body.serial_no,
    batch_id : req.body.batch_id ,
    station_id : req.body.station_id,
    current_version_id : req.body.current_version_id ,
    no_of_guns : req.body.no_of_guns,
    Address : req.body.Address,
    Lat : req.body.Lat,
    Lng : req.body.Lng,
    OTA_Config : req.body.OTA_Config,
    Periodic_Check_Ref_Time : req.body.Periodic_Check_Ref_Time,
    Periodicity_in_hours : req.body.Periodicity_in_hours,
    When_to_Upgrade : req.body.When_to_Upgrade,
    Upgrade_Specific_Time : req.body.Upgrade_Specific_Time,
    is_available : req.body.is_available,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  Version.update(version, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.getVersions = async (req, res) => {
  try {
    const data = await Version.getVersions();
    res.status(200).send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(200).send({ message: "NOT_FOUND" });
    } else {
      res.status(500).send({ message: "Error retrieving versions" });
    }
  }
};


exports.getVersionById = (req, res) => {
  Version.getVersionById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


exports.delete = (req, res) => {
  Version.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found vehicle with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.id
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

