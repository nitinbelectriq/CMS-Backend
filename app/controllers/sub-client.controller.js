const myModule = require("../models/sub-client.model.js");

const SubClient = myModule.SubClient;  

exports.create = (req, res) => {
  

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const subClient = new SubClient({

    client_id : req.body.client_id ,
    name : req.body.name ,
    description : req.body.description,
    address1  :  !!req.body.address1 ? req.body.address1 : '' ,
    address2  :  !!req.body.address2 ? req.body.address2 : '' ,
    PIN  :  !!req.body.PIN ? req.body.PIN : 0 ,
    landmark  :  !!req.body.landmark ? req.body.landmark : '' ,
    city_id  :  !!req.body.city_id ? req.body.city_id : 0 ,
    state_id  :  !!req.body.state_id ? req.body.state_id : 0 ,
    country_id  :  !!req.body.country_id ? req.body.country_id : 0 ,
    logoPath : req.body.logoPath,
    mobile : req.body.mobile,
    email : req.body.email,
    cp_name : req.body.cp_name,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  SubClient.create(subClient, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Customer."
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
  const subClient = new SubClient({
    id : req.body.id,
    client_id : req.body.client_id,
    name : req.body.name ,
    description : req.body.description,
    address1  :  !!req.body.address1 ? req.body.address1 : '' ,
    address2  :  !!req.body.address2 ? req.body.address2 : '' ,
    PIN  :  !!req.body.PIN ? req.body.PIN : 0 ,
    landmark  :  !!req.body.landmark ? req.body.landmark : '' ,
    city_id  :  !!req.body.city_id ? req.body.city_id : 0 ,
    state_id  :  !!req.body.state_id ? req.body.state_id : 0 ,
    country_id  :  !!req.body.country_id ? req.body.country_id : 0 ,
    logoPath : req.body.logoPath,
    mobile : req.body.mobile,
    email : req.body.email,
    cp_name : req.body.cp_name,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  SubClient.update(subClient, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.getSubClients = (req, res) => {

  SubClient.getSubClients( (err, data) => {
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

exports.getSubClientById = (req, res) => {
  SubClient.getSubClientById(req.params.id, (err, data) => {
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
exports.getSubClientByClientId = (req, res) => {
  SubClient.getSubClientByClientId(req.params.id, (err, data) => {
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
  SubClient.delete(req.params.id, (err, data) => {
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

