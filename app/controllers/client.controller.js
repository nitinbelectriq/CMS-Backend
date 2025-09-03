const myModule = require("../models/client.model.js");

const Client = myModule.Client;  
const ClientModuleMapping = myModule.ClientModuleMapping;  

exports.create = (req, res) => {
  
//;
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const client = new Client({
    name : req.body.name ,
    description : !!req.body.description?req.body.description:'',
    gst_no:req.body.gst_no,
    tin_no:req.body.tin_no,
    address1  :  !!req.body.address1 ? req.body.address1 : '' ,
    address2  :  !!req.body.address2 ? req.body.address2 : '' ,
    PIN  :  !!req.body.PIN ? req.body.PIN : 0 ,
    landmark  :  !!req.body.landmark ? req.body.landmark : '' ,
    city_id  :  !!req.body.city_id ? req.body.city_id : 0 ,
    state_id  :  !!req.body.state_id ? req.body.state_id : 0 ,
    country_id  :  !!req.body.country_id ? req.body.country_id : 0 ,
    logoPath : req.body.logoPath|| '',
    mobile : req.body.mobile,
    email : req.body.email,
    cp_name : req.body.cp_name,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by,
    bank: req.body.bankName,
    ifsc: req.body.ifsc,
    account: req.body.accountNumber,
    account_holder_name: req.body.accountHolderName
  });

  // Save Customer in the database
  Client.create(client, (err, data) => {
    // if (err)
    //   res.status(500).send({
    //     message: err.message || "Some error occurred while creating the Customer."
    //   });
    // else res.send(data);
    res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty!"
    });
  }
//;
  const client = new Client({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description || '',
    gst_no: req.body.gst_no || '',
    tin_no: req.body.tin_no || '',
    address1: req.body.address1 || '',
    address2: req.body.address2 || '',
    PIN: req.body.PIN || '',
    landmark: req.body.landmark || '',
    city_id: req.body.city_id || 0,
    state_id: req.body.state_id || 0,
    country_id: req.body.country_id || 0,
    logoPath: req.body.logoPath || '',
    mobile: req.body.mobile,
    email: req.body.email,
    cp_name: req.body.cp_name,
    status: req.body.status || 'Y',
    created_date: req.body.created_date || null,
    created_by: req.body.created_by || null,
    modify_date: req.body.modify_date || new Date(),
    modify_by: req.body.modify_by || null,

    // Bank Details - handle empty gracefully
    bank: req.body.bankName || '',
    ifsc: req.body.ifsc || '',
    account: req.body.accountNumber || '',
    account_holder_name: req.body.accountHolderName || ''
  });

  Client.update(client, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while updating the client."
      });
    }
    res.send(data);
  });
};


exports.getClients = (req, res) => {

  Client.getClients( (err, data) => {
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

exports.getClientsCW = (req, res) => {

  let login_id = req.params.login_id;
  Client.getClientsCW(login_id, (err, data) => {
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

exports.getActiveClientsCW = (req, res) => {

  let login_id = req.params.login_id;
  Client.getActiveClientsCW(login_id, (err, data) => {
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

exports.getClientById = (req, res) => {
  Client.getClientById(req.params.id, (err, data) => {
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
  Client.delete(req.params.id, (err, data) => {
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


exports.createClientModuleMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const client = new ClientModuleMapping({
    
    client_id : req.body.client_id,
    booking_allowed : req.body.booking_allowed,
    payment_allowed : req.body.payment_allowed,
    reward_allowed : req.body.reward_allowed,
    penalty_allowed : req.body.penalty_allowed,
    otp_authentication : req.body.otp_authentication,
    invoice_allowed : req.body.invoice_allowed,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
  });

  // Save Customer in the database
  ClientModuleMapping.createClientModuleMapping(client, (err, data) => {
    res.send(data);
  });
};

exports.updateClientModuleMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const client = new ClientModuleMapping({
    id : req.body.id,
    client_id : req.body.client_id,
    booking_allowed : req.body.booking_allowed,
    payment_allowed : req.body.payment_allowed,
    reward_allowed : req.body.reward_allowed,
    penalty_allowed : req.body.penalty_allowed,
    otp_authentication : req.body.otp_authentication,
    invoice_allowed : req.body.invoice_allowed,
    status : req.body.status,
    modify_date : req.body.modify_date,
    modified_by : req.body.modified_by
  });

  // Save Customer in the database
  ClientModuleMapping.updateClientModuleMapping(client, (err, data) => {
     res.send(data);
  });
};

exports.getClientModuleMapping = (req, res) => {

  ClientModuleMapping.getClientModuleMapping( (err, data) => {
   res.send(data);
  });
};

exports.getClientModuleMappingById = (req, res) => {

  let id = req.params.id;
  ClientModuleMapping.getClientModuleMappingById(id, (err, data) => {
    res.send(data);
  });
};
exports.getClientModuleMappingByClientId = (req, res) => {

  let client_id = req.params.client_id;
  ClientModuleMapping.getClientModuleMappingByClientId(client_id, (err, data) => {
    res.send(data);
  });
};
