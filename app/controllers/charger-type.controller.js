const myModule = require("../models/charger-type.model.js");

const ChargerType = myModule.ChargerType;  

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
    const charger = {
    name: req.body.name, 
    description: req.body.description, 
    status: req.body.status, 
    created_by: req.body.created_by // Should come from JWT or Auth service
  };


  // Save Customer in the database
 ChargerType.create(charger, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error creating charger.", error: err }); 
    }
    res.status(201).json({ message: "Charger successfully created.", data });
  })
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
  
  if (!req.body.id) {
    return res.status(400).send({ message: "Id is required to update a charger model." });
  }
  
  const chargerType = new ChargerType({ 
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    modifyby: req.body.modify_by
  });

  ChargerType.update(chargerType, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error occurred while updating the charger." });
    } else {
      res.status(200).json({ message: "Charger successfully created.", data });;
    }
  });
};



exports.getChargerTypes = (req, res) => {

  ChargerType.getChargerTypes( (err, data) => {
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

exports.getActiveChargerTypes = async (req, res) => {
  try {
    const result = await ChargerType.getActiveChargerTypes();

    res.status(200).json({
      status: true,
      err_code: 'ERROR : 0',
      message: result.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      err_code: `ERROR : ${error.code || 'UNKNOWN'}`,
      message: `ERROR : ${error.message}`,
      count: 0,
      data: []
    });
  }
};


exports.getChargerTypeById = (req, res) => {
  ChargerType.getChargerTypeById(req.params.id, (err, data) => {
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
  const id = req.params.id;
  const modify_by = req.body.modify_by || null;  // assume modify_by passed in body

  if (!modify_by || !id) {
    return res.status(400).send({ message: "id and modify_by is required" });
  }

  ChargerType.delete(id, modify_by, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found charger model with id ${id}.`
        });
      } else {
        return res.status(500).send({
          message: "Could not delete charger model with id " + id
        });
      }
    }
    res.send({ message: "Charger model was deleted successfully!" });
  });
};


