const Brand = require("../models/brand.model.js");


exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    const brand = new Brand({
        id : req.body.id ,
        name : req.body.name ,
        description : req.body.description,
        status : req.body.status ,
        created_date : req.body.created_date ,
        created_by : req.body.created_by,
        modify_date : req.body.modify_date ,
        modify_by : req.body.modify_by
    });
  
    // Save Brand in the database
    Brand.create(brand, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Brand."
        });
      else res.send(data);
    });
  };
  
exports.findAll = (req, res) => {
  Brand.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message || "Some error occurred while retrieving brands."
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Brands retrieved successfully",
        data: data
      });
    }
  });
};

  
  exports.update = (req, res) => {
    // Validate Request
    const brand = new Brand({
      id : req.body.id ,
      name : req.body.name ,
      description : req.body.description,
      status : req.body.status ,
      created_date : req.body.created_date ,
      created_by : req.body.created_by,
      modify_date : req.body.modify_date ,
      modify_by : req.body.modify_by
  });
  Brand.update(brand, (err, data) => {
    res.send(data);
  });
  }
  exports.publish = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const brand = new Brand({
      id: req.body.id,
      user_id: req.body.user_id,
      name: req.body.name,
      description: req.body.description,
      status :  req.body.status,
      created_by : req.body.created_by,
      modify_by: req.body.modify_by,
      created_date: req.body.created_date,
      modify_date: req.body.modify_date
    });
    Brand.publish(brand, (err, data) => {
        res.send(data);
      });
  };

  exports.moderate = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const brand = new Brand({
      id: req.body.id,
      status :  req.body.status,
      modify_by: req.body.modify_by,
      modify_date: req.body.modify_date
    });
    Brand.moderate(brand, (err, data) => {
        res.send(data);
      });
  };

exports.delete = (req, res) => {
  Brand.delete(req.params.id,req.params.modify_by, (err, data) => {
    res.status(200).send(data);
  });
};
 
exports.getAllModerateList = (req, res) => {
  Brand.getAllModerateList((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};
  