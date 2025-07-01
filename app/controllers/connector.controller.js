const Connector = require("../models/connector.model.js");
  


exports.findAllConnectorTypesByVehicleModelId = (req, res) => {
  Connector.getAllConnectorTypesByVehicleModelId(req.params.vehicleModelId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.vehicleModelId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.vehicleModelId
        });
      }
    } else res.send(data);
  });
};
exports.findAllConnectorTypesByVehicleModelIdPublished = (req, res) => {
  Connector.getAllConnectorTypesByVehicleModelIdPublished(req.params.vehicleModelId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.vehicleModelId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.vehicleModelId
        });
      }
    } else res.send(data);
  });
};

exports.findAllConnectorTypesExcludingVModelId = (req, res) => {
  const modelId = parseInt(req.params.vehicleModelId, 10);

  if (isNaN(modelId)) {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid vehicleModelId parameter',
      data: null
    });
  }

  Connector.getAllConnectorTypesExcludingVModelId(modelId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          status: 'fail',
          message: 'All connector types are already mapped with this vehicle model.',
          data: []
        });
      } else {
        return res.status(500).send({
          status: 'error',
          message: `Error retrieving connector types for vehicleModelId ${modelId}`,
          data: null
        });
      }
    }

    res.send({
      status: 'success',
      message: 'Unmapped connector types fetched successfully.',
      data: data
    });
  });
};

exports.getAllCTypesExcludingOtherAlreadyMapped = (req, res) => {
  Connector.getAllCTypesExcludingOtherAlreadyMapped(req.params, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.vehicleModelId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.vehicleModelId
        });
      }
    } else res.send(data);
  });
};



exports.findAllConnectorTypes = async (req, res) => {
  try {
    const data = await Connector.getAllConnectorTypes();

    if (!data.length) {
      return res.status(404).send({
        status: false,
        err_code: 'ERROR : 404',
        message: "No connector types found.",
        count: 0,
        data: []
      });
    }

    res.send({
      status: true,
      err_code: 'ERROR : 0',
      message: "SUCCESS",
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      err_code: `ERROR : ${err.code || 'UNKNOWN'}`,
      message: `Error retrieving connector types: ${err.message || 'Internal Server Error'}`,
      count: 0,
      data: []
    });
  }
};

