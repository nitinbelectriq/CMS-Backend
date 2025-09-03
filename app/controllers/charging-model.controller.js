const myModule = require("../models/charging-model.model.js");

const ChargingModel = myModule.ChargingModel;  

exports.create = async (req, res) => {
  const data = req.body;
  //;
//;
  // Basic validation
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty." });
  }

  const chargingModel = {
    client_id: data.client_id,
    charger_type_id: data.charger_type_id,
    manufacturer_id: data.manufacturer_id,
    charger_model_type_id: data.charger_model_type_id,
    battery_backup: data.battery_backup,
    code: data.code,
    name: data.name,
    description: data.description,
    communication_protocol_id: data.communication_protocol_id,
    communication_mode: data.communication_mode,
    card_reader_type: data.card_reader_type,
    no_of_connectors: data.no_of_connectors,
    isDual: data.isDual,
    status: data.status,
    created_by: data.created_by,
    connector_data: data.connector_data
  };

  ChargingModel.create(chargingModel, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "An error occurred while creating the charging model."
      });
    }

    res.status(201).json({
      message: "Charging model created successfully.",
      data: result
    });
  });
};


exports.update = (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const chargingModel = {
    id: req.body.id,
    client_id: req.body.client_id,
    charger_type_id: req.body.charger_type_id,
    manufacturer_id: req.body.manufacturer_id,
    charger_model_type_id: req.body.charger_model_type_id,
    battery_backup: req.body.battery_backup,
    code: req.body.code,
    name: req.body.name,
    description: req.body.description,
    communication_protocol_id: req.body.communication_protocol_id,
    communication_mode: req.body.communication_mode,
    card_reader_type: req.body.card_reader_type,
    no_of_connectors: req.body.no_of_connectors,
    isDual: req.body.isDual,
    status: req.body.status,
    created_by: req.body.created_by,
    modify_by: req.body.modify_by,
    connector_data: req.body.connector_data
  };

  ChargingModel.update(chargingModel, (err, data) => {
    if (err) {
      console.error('Update error:', err);
      res.status(500).send({
        message: err.message || "Some error occurred while updating the Charging Model."
      });
    } else {
      res.send(data);
    }
  });
};

exports.getChargingModels = async (req, res) => {
  try {
    const data = await ChargingModel.getChargingModels();
    res.status(200).send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(200).send({ message: "NOT_FOUND" });
    } else {
      res.status(500).send({ message: "Error retrieving Charging Models" });
    }
  }
};


exports.getChargingModelsAll = (req, res) => {
  //;
  ChargingModel.getChargingModelsAll( (err, data) => {
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

exports.getChargingModelById = (req, res) => {
  ChargingModel.getChargingModelById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Charging Model not found with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Charging Model with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


exports.getChargingModelByClientId = (req, res) => {
  ChargingModel.getChargingModelByClientId(req.params.client_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.client_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with client_id " + req.params.client_id
        });
      }
    } else res.send(data);
  });
};

exports.getChargingModelByChargerTypeId = (req, res) => {
  ChargingModel.getChargingModelByChargerTypeId(req.params.charger_type_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.charger_type_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with charger_type_id " + req.params.charger_type_id
        });
      }
    } else res.send(data);
  });
};


exports.delete = (req, res) => {
  ChargingModel.delete(req.params.id, (err, data) => {
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
    } else res.send({ message: `charger model variant  was deleted successfully!` });
  });
};

