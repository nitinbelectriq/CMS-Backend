const myModule = require("../models/cpo.model.js");

const Cpo = myModule.Cpo;  

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Content can not be empty!' });
  }

  const cpo = {
    client_id: req.body.client_id || 0,
    name: req.body.name || '',
    description: req.body.description || '',
    gst_no: req.body.gst_no || '',
    tin_no: req.body.tin_no || '',
    address1: req.body.address1 || '',
    address2: req.body.address2 || '',
    PIN: req.body.PIN || 0,
    landmark: req.body.landmark || '',
    city_id: req.body.city_id || 0,
    state_id: req.body.state_id || 0,
    country_id: req.body.country_id || 0,
    logoPath: req.body.logoPath || '',
    mobile: req.body.mobile || '',
    email: req.body.email || '',
    cp_name: req.body.cp_name || '',
    status: req.body.status || 'N',
    created_date: req.body.created_date || new Date().toISOString().slice(0, 10),
    created_by: req.body.created_by || 0,
    modify_date: req.body.modify_date || null,
    modify_by: req.body.modify_by || null
  };

  Cpo.create(cpo, (err, data) => {
    if (err) {
      return res.status(500).send({ message: err.message || 'Create error' });
    }
    res.send(data);
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
  const cpo = new Cpo({
    id : req.body.id,
    client_id : req.body.client_id,
    name : req.body.name ,
    description : req.body.description,
    gst_no:req.body.gst_no,
    tin_no:req.body.tin_no,
   
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
  Cpo.update(cpo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.getCpos = (req, res) => {
  Cpo.getCpos( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } 
    } else res.send(data);
  });
};
exports.getCposCW = (req, res) => {
  let login_id = req.params.login_id;
  Cpo.getCposCW( login_id,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } 
    } else res.send(data);
  });
};
exports.getActiveCposCW = (req, res) => {
  let login_id = req.params.login_id;
  Cpo.getActiveCposCW( login_id,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } 
    } else res.send(data);
  });
};

exports.getCpoById = (req, res) => {
  Cpo.getCpoById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 'error',
          message: `CPO with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          status: 'error',
          message: `Error retrieving CPO with id ${req.params.id}`,
        });
      }
    } else {
      res.send({
        status: 'success',
        message: 'CPO details fetched successfully.',
        data: data
      });
    }
  });
};


exports.getCpoByClientId = (req, res) => {
  Cpo.getCpoByClientId(req.params.client_id, (err, data) => {
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

exports.getActiveCposByClientId = (req, res) => {
  // Cpo.getActiveCposByClientId(req.params.client_id, (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(404).send({
  //         message: `Not found Customer with id ${req.params.client_id}.`
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Error retrieving Customer with client_id " + req.params.client_id
  //       });
  //     }
  //   } else res.send(data);
  // });

  let client_id = req.params.client_id;
  Cpo.getActiveCposByClientId(client_id, (err, data) => {
    res.send(data);
  });
};

exports.getCpoByClientIdCW = (req, res) => {
  Cpo.getCpoByClientIdCW(req.params.client_id,req.params.user_id, (err, data) => {
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


exports.delete = (req, res) => {
  Cpo.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found CPO with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete CPO with id " + req.params.id
        });
      }
    } else res.send({ message: `CPO was deleted successfully!` });
  });
};

