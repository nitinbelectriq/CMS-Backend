const myModule = require("../models/charger-batch.model.js");

const ChargerBatch = myModule.ChargerBatch;  

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const chargerBatch = new ChargerBatch({
    name : req.body.name ,
    description : req.body.description,
    batch_no : req.body.batch_no ,
    client_id : req.body.client_id,
    model_id : req.body.model_id ,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by

  });

  // Save Customer in the database
  ChargerBatch.create(chargerBatch, (err, data) => {
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
  const chargerBatch = new ChargerBatch({
    id : req.body.id,
    name : req.body.name ,
    description : req.body.description,
    batch_no : req.body.batch_no ,
    client_id : req.body.client_id,
    model_id : req.body.model_id ,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  ChargerBatch.update(chargerBatch, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.getChargerBatches = (req, res) => {

  ChargerBatch.getChargerBatches( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};



exports.getChargerBatchById = (req, res) => {
  ChargerBatch.getChargerBatchById(req.params.id, (err, data) => {
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
  ChargerBatch.delete(req.params.id, (err, data) => {
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

