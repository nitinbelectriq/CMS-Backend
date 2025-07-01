const myModule = require("../models/rf-id.model.js");

const RFNO = myModule.RFid;

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create new RFid instance
  const rfid = {
    rfid_no: req.body.rf_id_no,
    expiry_date: req.body.expiry_date,
    status: req.body.status,
    created_by: req.body.created_by,
    // You can add modify_date and modify_by if needed later for updates
  };

  // Save RFid in database
  RFNO.create(rfid, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the RFID."
      });
    } else {
      res.send(data);
    }
  });
};


exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Construct rfid object
  const rfid = {
    id: req.body.id,
    rfid_no: req.body.rf_id_no,
    expiry_date: req.body.expiry_date,
    status: req.body.status,
    created_date: req.body.created_date, // usually not updated, but keep if needed
    created_by: req.body.created_by,     // usually not updated
    modify_date: req.body.modify_date,   // can be ignored, set by model
    modify_by: req.body.modify_by
  };

  RFNO.update(rfid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `RFID with id ${rfid.id} not found.`
        });
      } else {
        return res.status(500).send({
          message: err.message || "Some error occurred while updating the RFID."
        });
      }
    }
    res.send(data);
  });
};


exports.createCpoRfidMapping = (req, res) => {
  debugger;
  if (!req.body || !req.body.client_id || !req.body.cpo_id || !Array.isArray(req.body.rfid_data)) {
    return res.status(400).send({
      status: false,
      message: "Invalid or missing data in request body",
    });
  }

  const rfno = {
    client_id: req.body.client_id,
    cpo_id: req.body.cpo_id,
    rfid_data: req.body.rfid_data, // Array of objects with `id`
    status: req.body.status || 'Y',
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  };

  RFNO.createCpoRfidMapping(rfno, (err, data) => {
    if (err) {
      return res.status(500).send({
        status: false,
        message: err.message || "Error occurred while creating RFID mapping",
      });
    }
    res.send(data);
  });
};


exports.updateCpoRfidMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const rfno = new RFNO({
    client_id: req.body.client_id,
    cpo_id: req.body.cpo_id,
    rfid_data: req.body.rfid_data,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by 
  });

  // Save Customer in the database
  RFNO.updateCpoRfidMapping(rfno, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.getRFids = (req, res) => {
  RFNO.getRFids((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: "NOT_FOUND"
        });
      } else {
        res.status(500).send({
          message: "Error retrieving RFIDs"
        });
      }
    } else {
      res.send(data);
    }
  });
};


exports.getCpoRFidMappingCW = (req, res) => {
  debugger;
  let login_id = req.params.login_id;
  RFNO.getCpoRFidMappingCW(login_id,(err, data) => {
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

exports.getCpoRFidMappingCCS = (req, res) => {
  
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }
  RFNO.getCpoRFidMappingCCS(params,(err, data) => {
     res.send(data);
  });
};

exports.getRFidsByCpoId = (req, res) => {
  let cpo_id = req.params.cpo_id;
  RFNO.getRFidsByCpoId(cpo_id,(err, data) => {
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

exports.getAllRFidsWithMappedCPOs = (req, res) => {
  let cpo_id = req.params.cpo_id;
  RFNO.getAllRFidsWithMappedCPOs(cpo_id,(err, data) => {
    res.send(data);
  });
};

exports.getRFno_ById = (req, res) => {
  RFNO.getRFno_ById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found RF no with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving RF no with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  RFNO.delete(req.params.id,req.params.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found rf no with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete RF no with id " + req.params.id
        });
      }
    } else res.send({ message: `RF no was deleted successfully!` });
  });
};
exports.unMapRFidCpoID = (req, res) => {
  RFNO.unMapRFidCpoID(req.params.id,req.params.user_id, (err, data) => {
    res.status(200).send(data);
  });
};

