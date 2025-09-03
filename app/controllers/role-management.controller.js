const myModule = require("../models/role-management.model.js");

const Role = myModule.Role;  

exports.create = (req, res) => {
  //;
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Role
    const role = new Role({
         id:req.body.id,
      code : req.body.code ,
      name : req.body.name ,
      description : req.body.description,
      project_id:req.body.project_id,
      client_id:req.body.client_id,      
      status : req.body.status ,
      created_date : req.body.created_date ,
      created_by : req.body.created_by,
      modify_date : req.body.modify_date ,
      modify_by : req.body.modify_by
  
    });
  
    // Save Role in the database
    Role.create(role, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Role."
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
    const role = new Role({
        id : req.body.id ,
        code : !!req.body.code ? req.body.code : ''  ,
        name : req.body.name ,  
        description : req.body.description ,     
        status : req.body.status ,
        created_date : req.body.created_date ,
        created_by : !!req.body.created_by ? req.body.created_by : 0 ,
        modify_date : req.body.modify_date ,
        modify_by : req.body.modify_by,
        client_id : req.body.client_id,
        project_id : req.body.project_id
      
    });
  
    // Save user in the database
    Role.update(role, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Role."
        });
      else res.send(data);
    });
  };
exports.getRoles = (req, res) => {

    Role.getRoles( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Roles with id "
        });
      }
    } else res.send(data);
  });
};

exports.getRoleCW = (req, res) => {

  let user_id = req.params.user_id;
  let project_id = req.params.project_id;
  Role.getRoleCW(user_id,project_id, (err, data) => {
   res.send(data);
});
};
exports.getActiveRoleCW = (req, res) => {

  let user_id = req.params.user_id;
  let project_id = req.params.project_id;
  Role.getActiveRoleCW(user_id,project_id, (err, data) => {
  
   res.send(data);
});
};

exports.getActiveRolesByClientId = (req, res) => {

  let client_id = req.params.client_id;
  let project_id = req.params.project_id;
  Role.getActiveRolesByClientId(client_id,project_id, (err, data) => {
  
   res.send(data);
});
};

exports.getRoleById = (req, res) => {
    Role.getRoleById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Role with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Role with id " + req.params.id
          });
        }
      } else res.send(data);
    });
};
exports.delete = (req, res) => {
    Role.delete(req.params.id,req.params.user_id, (err, data) => {
      // if (err) {
      //   if (err.kind === "not_found") {
      //     res.status(200).send({
      //       message: `Not found Role with id ${req.params.id}.`
      //     });
      //   } else {
      //     res.status(500).send({
      //       message: "Could not delete Role with id " + req.params.id
      //     });
      //   }
      // } else res.send({ message: `Role was deleted successfully!` });
       res.send(data);
    });
  };
  

 

