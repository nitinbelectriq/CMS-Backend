const myModule = require("../models/report.model.js");

const Report = myModule.Report;

exports.getTransactionReportCW = (req, res) => {
    
    let login_id = req.params.login_id;
    Report.getTransactionReportCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with report "
          });
        }
      } else res.send(data);
    });
  };

exports.getTransactionReportCCS = (req, res) => {
    
    // let login_id = req.params.login_id;
    let params ={
      login_id : req.params.login_id,
      client_id : req.params.client_id,
      cpo_id : req.params.cpo_id,
      station_id : req.params.station_id,
      fdate : req.body.fdate,
      todate : req.body.todate
    }
    Report.getTransactionReportCCS(params, (err, data) => {
     res.send(data);
    });
  };
  exports.getAlarmReportCW = (req, res) => {
    
    let login_id = req.params.login_id;
    Report.getAlarmReportCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with report "
          });
        }
      } else res.send(data);
    });
  };
  exports.getAlarmReportDetailViewCW = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.getAlarmReportDetailViewCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with DetailView "
          });
        }
      } else res.send(data);
    });
  };

  exports.getAlarmReportDetailViewCCS = (req, res) => {
    
    let params ={
      login_id : req.params.login_id,
      client_id : req.params.client_id,
      cpo_id : req.params.cpo_id,
      station_id : req.params.station_id,
      fdate : req.body.fdate,
      todate : req.body.todate
    }

    Report.getAlarmReportDetailViewCCS(params, (err, data) => {
       res.send(data);
    });
  };

  exports.getChargerStatusDetailViewCW = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.getChargerStatusDetailViewCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with DetailView "
          });
        }
      } else res.send(data);
    });
  };

  exports.getChargerStatusDetailViewCCS = (req, res) => {
    
      let params ={
      login_id : req.params.login_id,
      client_id : req.params.client_id,
      cpo_id : req.params.cpo_id,
      station_id : req.params.station_id
    }

 
    Report.getChargerStatusDetailViewCCS(params, (err, data) => {
     res.send(data);
    });
  };

  exports.getChargerByLastTransactionCW = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.getChargerByLastTransactionCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with DetailView "
          });
        }
      } else res.send(data);
    });
  };



  // Get payment History Station_wise

  exports.getPendingTransactionCW = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.getPendingTransactionCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with DetailView "
          });
        }
      } else res.send(data);
    });
  };

  exports.getSuccessTransactionCW = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.getSuccessTransactionCW(login_id,req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(200).send({
            message: `NOT_FOUND`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Date with DetailView "
          });
        }
      } else res.send(data);
    });
  };

  exports.otpLogsBLE = (req, res) => {
    
    let login_id = req.params.login_id;
 
    Report.otpLogsBLE(login_id, (err, data) => {
      res.send(data);
    });
  };
  
  exports.successfulTransactionsBLE = (req, res) => {
    let resp;
    if (!req.body) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide body parameters.',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    const request=new Report({
      start_date:req.body.start_date,
      end_date:req.body.end_date,
      status:req.body.status
    })
    Report.successfulTransactionsBLE(request, (err, data) => {
     res.send(data)
    });
  };

  exports.chargerPendingForRenewalBLE = (req, res) => {
    
    Report.chargerPendingForRenewalBLE((err,data)=>{
       res.send(data);
    });
  };