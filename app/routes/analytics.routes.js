const { checkToken } = require('../middleware/jwt');
const { getUserDetails } = require('../middleware/authentication')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const analytics = require("../controllers/analytics.controller");
     
    //get transaction list
    app.post("/analytics/getTransactionList",checkToken, analytics.getTransactionList);
    app.post("/analytics/getTransactionListCW/:login_id",checkToken, analytics.getTransactionListCW);
    app.post("/analytics/getTransactionListCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getTransactionListCCS);

    //get transaction list
    //
    // 12042022 : API not in use //// app.post("/analytics/getDurationList",checkToken, analytics.getDurationList);
    app.post("/analytics/getDurationListCW/:login_id",checkToken, analytics.getDurationListCW);
    app.post("/analytics/getDurationListCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getDurationListCCS);
    
    app.post("/analytics/getChargerWiseAlarmCountCW/:login_id",checkToken, analytics.getChargerWiseAlarmCountCW);
    app.post("/analytics/getTotalAlarmCountCW/:login_id",checkToken, analytics.getTotalAlarmCountCW);
    app.post("/analytics/getTotalAlarmCountCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getTotalAlarmCountCCS);

    app.get("/analytics/getChargerStatusCW/:login_id",checkToken, analytics.getChargerStatusCW);
    app.get("/analytics/getChargerStatusCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerStatusCCS);
    
    // app.get("/analytics/getChargerStatusV1/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerStatusV1);
    app.get("/analytics/getChargerConnectorStatusCW/:login_id",checkToken, analytics.getChargerConnectorStatusCW);
    
    app.get("/analytics/getActiveConnectorStatusCW/:login_id",checkToken, analytics.getActiveConnectorStatusCW);
    app.get("/analytics/getActiveConnectorStatusCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getActiveConnectorStatusCCS);
    
    app.get("/analytics/getAllConnectorLiveStatusCountCW/:login_id",checkToken, analytics.getAllConnectorLiveStatusCountCW);
    app.get("/analytics/getAllConnectorLiveStatusCountCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getAllConnectorLiveStatusCountCCS);

    app.get("/analytics/getChargerModelSummaryCountCW/:login_id",checkToken, analytics.getChargerModelSummaryCountCW);
    app.get("/analytics/getChargerModelSummaryCountCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerModelSummaryCountCCS);
    
    app.post("/analytics/getDailyBasisTotalActiveChargerCountCW/:login_id",checkToken, analytics.getDailyBasisTotalActiveChargerCountCW);
    app.post("/analytics/getDailyBasisTotalActiveChargerCountCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getDailyBasisTotalActiveChargerCountCCS);
   
    app.post("/analytics/getChargerCountByStateCW/:login_id",checkToken, analytics.getChargerCountByStateCW);
    app.post("/analytics/getChargerCountByStateCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerCountByStateCCS);
    // app.post("/analytics/getChargerListByStateCW/:login_id",checkToken, analytics.getChargerCountByStateCW);

    app.post("/analytics/getChargerCountByCityCW/:login_id",checkToken, analytics.getChargerCountByCityCW);
    app.post("/analytics/getChargerCountByCityCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerCountByCityCCS);

    app.post("/analytics/getChargerCountByLastTransactionMonthCW/:login_id",checkToken, analytics.getChargerCountByLastTransactionMonthCW);
    
    app.post("/analytics/getChargerCountByTotalEnergySlabCW/:login_id",checkToken, analytics.getChargerCountByTotalEnergySlabCW);
    app.post("/analytics/getChargerCountByTotalEnergySlabCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerCountByTotalEnergySlabCCS);
    
    app.post("/analytics/getChargerCountByAverageEnergyPerTransactionSlabCW/:login_id",checkToken, analytics.getChargerCountByAverageEnergyPerTransactionSlabCW);
    app.post("/analytics/getChargerCountByAverageEnergyPerTransactionSlabCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, analytics.getChargerCountByAverageEnergyPerTransactionSlabCCS);
    
    app.post("/analytics/getChargerCountByLowDurationAndLowFrequencySlabCW/:login_id",checkToken, analytics.getChargerCountByLowDurationAndLowFrequencySlabCW);
    app.post("/analytics/getChargerCountByLowDurationAndHighFrequencySlabCW/:login_id",checkToken, analytics.getChargerCountByLowDurationAndHighFrequencySlabCW);
    app.post("/analytics/getChargerCountByHighDurationAndLowFrequencySlabCW/:login_id",checkToken, analytics.getChargerCountByHighDurationAndLowFrequencySlabCW);
    app.post("/analytics/getChargerCountByHighDurationAndHighFrequencySlabCW/:login_id",checkToken, analytics.getChargerCountByHighDurationAndHighFrequencySlabCW);



    // Payments 
    app.post('/analytics/getrecenttansactionCW/:login_id',checkToken,analytics.GetRecentTransaction)
    app.post('/analytics/getpaymentsummmaryCW/:login_id',checkToken,analytics.GetPaymentDailySummmaryCW)
    app.post('/analytics/getCustomerVisitingSummaryCW/:login_id',checkToken,analytics.getCustomerVisitingSummaryCW)

    app.post('/analytics/ChargerTransactionSlabCW/:login_id',checkToken,analytics.getChargerTransactionSlab)
    app.post('/analytics/CustomerChargingSummaryCW/:login_id',checkToken,analytics.getCustomerChargingSummaryCW)

    app.post('/analytics/getBookingBillingSummaryDayCW/:login_id',checkToken,analytics.getBookingPaymentSummaryCW)
    app.post('/analytics/getCustomerPaymentSummaryMonth/:login_id',checkToken,analytics.getCustomerPaymentSummaryMonth)

    app.post('/analytics/getBookingCountsCW/:login_id',checkToken,analytics.getBookingCountsCW)

    app.post('/analytics/get/:login_id',checkToken,analytics.getBookingCountsCW)

    app.post('/analytics/getCollectionMonthly/:login_id',checkToken,analytics.getCollectionMonthly)

    //Vehicle wise graphs
    app.get("/analytics/getVehicleChargingStatusCW/:login_id",checkToken, analytics.getVehicleChargingStatusCW);
    app.get("/analytics/getVehicleActiveConnectorStatusCW/:login_id",checkToken, analytics.getVehicleActiveConnectorStatusCW);
    app.post("/analytics/getVehicleTransactionCountCW/:login_id",checkToken, analytics.getVehicleTransactionCountCW);
  };