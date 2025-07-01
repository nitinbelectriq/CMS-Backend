const myModule = require("../models/analytics.model.js");

const TransactionList = myModule.TransactionList;

//---------Start Analytics-----------------------------//
exports.getTransactionList = (req, res) => {

  TransactionList.getTransactionList(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with transaction "
        });
      }
    } else res.send(data);
  });
};

exports.getTransactionListCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getTransactionListCW(login_id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with transaction "
        });
      }
    } else res.send(data);
  });
};

exports.getTransactionListCCS = (req, res) => {
  
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    fdate : req.body.fdate,
    todate : req.body.todate
  }

  TransactionList.getTransactionListCCS(params, (err, data) => {
    res.send(data);
  });
};

exports.getVehicleTransactionCountCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getVehicleTransactionCountCW(login_id, req.body, (err, data) => {
     res.send(data);
  });
};

exports.getDurationList = (req, res) => {

  TransactionList.getDurationList(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with duration "
        });
      }
    } else res.send(data);
  });
};
exports.getDurationListCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getDurationListCW(login_id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with duration "
        });
      }
    } else res.send(data);
  });
};

exports.getDurationListCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    fdate : req.body.fdate,
    todate : req.body.todate
  }

  TransactionList.getDurationListCCS( params, (err, data) => {
    res.send(data);
  });
};
exports.getChargerWiseAlarmCountCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerWiseAlarmCountCW(login_id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with alarm "
        });
      }
    } else res.send(data);
  });
};
exports.getTotalAlarmCountCW = (req, res) => {
  debugger;
  let login_id = req.params.login_id;
  TransactionList.getTotalAlarmCountCW(login_id, req.body, (err, data) => {
     res.send(data);
  });
};

exports.getTotalAlarmCountCCS = (req, res) => {
  debugger;
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    fdate : req.body.fdate,
    todate : req.body.todate
  }
  TransactionList.getTotalAlarmCountCCS(params, (err, data) => {
     res.send(data);
  });
};

exports.getChargerStatusCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerStatusCW(login_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with charger "
        });
      }
    } else res.send(data);
  });
};

exports.getChargerStatusCCS = (req, res) => {

  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }

  TransactionList.getChargerStatusCCS(params, (err, data) => {
    res.send(data);
  });
};


// exports.getChargerStatusV1 = (req, res) => {
//   // let login_id = req.params.login_id;
//   TransactionList.getChargerStatusV1(req.params, (err, data) => {
//     res.send(data);
//   });
// };

exports.getChargerConnectorStatusCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerConnectorStatusCW(login_id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Date with connector "
        });
      }
    } else res.send(data);
  });
};
exports.getActiveConnectorStatusCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getActiveConnectorStatusCW(login_id, (err, data) => {
    res.send(data);
  });
};

exports.getActiveConnectorStatusCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }
  TransactionList.getActiveConnectorStatusCCS(params, (err, data) => {
    res.send(data);
  });
};


exports.getAllConnectorLiveStatusCountCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getAllConnectorLiveStatusCountCW(login_id, (err, data) => {
    res.send(data);
  });
};
exports.getAllConnectorLiveStatusCountCCS = (req, res) => {
  
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }
  
  TransactionList.getAllConnectorLiveStatusCountCCS(params, (err, data) => {
    res.send(data);
  });
};

exports.getChargerModelSummaryCountCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerModelSummaryCountCW(login_id, (err, data) => {
    res.send(data);
  });
};

exports.getChargerModelSummaryCountCCS = (req, res) => {

  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }

  TransactionList.getChargerModelSummaryCountCCS(params, (err, data) => {
    res.send(data);
  });
};
exports.getDailyBasisTotalActiveChargerCountCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getDailyBasisTotalActiveChargerCountCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};


exports.getDailyBasisTotalActiveChargerCountCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    fdate : req.body.fdate,
    todate : req.body.todate
  }
  TransactionList.getDailyBasisTotalActiveChargerCountCCS(params, (err, data) => {
    res.send(data);
  });
};


exports.getChargerCountByStateCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerCountByStateCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByStateCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }
  TransactionList.getChargerCountByStateCCS(params, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByCityCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerCountByCityCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByCityCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }
  TransactionList.getChargerCountByCityCCS(params, (err, data) => {
    res.send(data);
  });
};


exports.getChargerCountByLastTransactionMonthCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerCountByLastTransactionMonthCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByTotalEnergySlabCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerCountByTotalEnergySlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByTotalEnergySlabCCS = (req, res) => {

  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    f_date : req.body.f_date,
    t_date : req.body.t_date
  }

  TransactionList.getChargerCountByTotalEnergySlabCCS( params, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByAverageEnergyPerTransactionSlabCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getChargerCountByAverageEnergyPerTransactionSlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByAverageEnergyPerTransactionSlabCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id,
    f_date : req.body.f_date,
    t_date : req.body.t_date
  }
  TransactionList.getChargerCountByAverageEnergyPerTransactionSlabCCS( params, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByLowDurationAndLowFrequencySlabCW = (req, res) => {
  let login_id = req.params.login_id;
  let from_date = req.body.f_date;
  let to_date = req.body.t_date;
  let avg_duration = req.body.avg_duration;
  let final_res;

  if (!login_id) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'login_id is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!from_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'from_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!to_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'to_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!avg_duration ) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'avg_duration is missing in parameters'
    }
    res.status(200).send(final_res);
  }else{
    if (avg_duration<=0 || avg_duration>24 ) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Incorrect avg_duration'
      }
      res.status(200).send(final_res);
    }
  }
  TransactionList.getChargerCountByLowDurationAndLowFrequencySlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByLowDurationAndHighFrequencySlabCW = (req, res) => {
  let login_id = req.params.login_id;
  let from_date = req.body.f_date;
  let to_date = req.body.t_date;
  let avg_duration = req.body.avg_duration;
  let final_res;

  if (!login_id) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'login_id is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!from_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'from_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!to_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'to_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!avg_duration ) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'avg_duration is missing in parameters'
    }
    res.status(200).send(final_res);
  }else{
    if (avg_duration<=0 || avg_duration>24 ) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Incorrect avg_duration'
      }
      res.status(200).send(final_res);
    }
  }
  TransactionList.getChargerCountByLowDurationAndHighFrequencySlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByHighDurationAndLowFrequencySlabCW = (req, res) => {
  let login_id = req.params.login_id;
  let from_date = req.body.f_date;
  let to_date = req.body.t_date;
  let avg_duration = req.body.avg_duration;
  let final_res;

  if (!login_id) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'login_id is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!from_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'from_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!to_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'to_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!avg_duration ) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'avg_duration is missing in parameters'
    }
    res.status(200).send(final_res);
  }else{
    if (avg_duration<=0 || avg_duration>24 ) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Incorrect avg_duration'
      }
      res.status(200).send(final_res);
    }
  }
  TransactionList.getChargerCountByHighDurationAndLowFrequencySlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

exports.getChargerCountByHighDurationAndHighFrequencySlabCW = (req, res) => {
  let login_id = req.params.login_id;
  let from_date = req.body.f_date;
  let to_date = req.body.t_date;
  let avg_duration = req.body.avg_duration;
  let final_res;

  if (!login_id) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'login_id is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!from_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'from_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!to_date) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'to_date is missing in parameters'
    }
    res.status(200).send(final_res);
  }
  if (!avg_duration ) {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: 'avg_duration is missing in parameters'
    }
    res.status(200).send(final_res);
  }else{
    if (avg_duration<=0 || avg_duration>24 ) {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Incorrect avg_duration'
      }
      res.status(200).send(final_res);
    }
  }
  TransactionList.getChargerCountByHighDurationAndHighFrequencySlabCW(login_id, req.body, (err, data) => {
    res.send(data);
  });
};

//------End Analytics---------------------------------//


//------ Start Payment Analytics---------------------------------//
exports.GetRecentTransaction =  (req, res) => {
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getRecentTransactionCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};

exports.GetPaymentDailySummmaryCW =  (req, res) => {
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "User Id Missing!"
    });
  }

  TransactionList.getPaymentSummaryCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};


exports.getCustomerVisitingSummaryCW =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "User Id Missing!"
    });
  }

  TransactionList.getCustomerVisitingSummaryCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};


exports.getChargerTransactionSlab =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getChargerTransactionSlab(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};

exports.getCustomerChargingSummaryCW =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getCustomerChargingSummaryCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};


exports.getBookingPaymentSummaryCW =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getBookingPaymentSummaryCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};

exports.getCustomerPaymentSummaryMonth =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getCustomerPaymentSummaryMonth(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};

exports.getCollectionMonthly =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getCollectionMonthly(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};

exports.getBookingCountsCW =  (req, res) => {
   
  let login_id = req.params.login_id;
  if (!login_id) {
    res.status(400).send({
      message: "Login Id Missing!"
    });
  }

  TransactionList.getBookingCountsCW(login_id,req.body,  (err, data) => {
    //console.lo
    res.send(data)
  });
};



//------ Start vehicle wise Analytics---------------------------------//


exports.getVehicleChargingStatusCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getVehicleChargingStatusCW(login_id, (err, data) => {
    res.send(data);
  });
};

exports.getVehicleActiveConnectorStatusCW = (req, res) => {
  let login_id = req.params.login_id;
  TransactionList.getVehicleActiveConnectorStatusCW(login_id, (err, data) => {
    res.send(data);
  });
};