const myModule = require("../models/error_log.model.js");

const Error = myModule.Error;  

exports.errorLog= (req, res) =>{
    
   // Validate request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const error = new Error({
    id : req.body.id ,
    username : !!req.body.username ? req.body.username : '' ,
    mobile : !!req.body.mobile ? req.body.mobile : '',
    email : !!req.body.email ? req.body.email : '',
    device_id : !!req.body.device_id ? req.body.device_id : '',
    app_version : !!req.body.app_version ? req.body.app_version : '',
    os_version: !!req.body.os_version ? req.body.os_version : '',
    activity_name: !!req.body.activity_name ? req.body.activity_name : '',
    application_plateform : !!req.body.application_plateform ? req.body.application_plateform : '',
    application_name : !!req.body.application_name ? req.body.application_name : '',
    project_id : req.body.project_id ,
    api_parameters : !!req.body.api_parameters ? req.body.api_parameters : '',
    url: !!req.body.url ? req.body.url : '',
    error_code: !!req.body.error_code ? req.body.error_code : '',
    error_discription: !!req.body.error_discription ? req.body.error_discription :'',    
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : !!req.body.created_by ? req.body.created_by : 0 ,
    modify_date : req.body.modify_date ,
    modify_by : !!req.body.modify_by ? req.body.modify_by :0
  });

  error.error_discription = error.error_discription.replace(/'/g, "''");
  Error.errorLog(error, (err, data) => {
    
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User Prefrence."
      });
    else res.send(data);
  });
};
exports.getAllErrorLog = (req,res)=>{
  
  
  Error.getAllErrorLog( req.body,(err, data) => {
           res.send(data);
      });
  
}