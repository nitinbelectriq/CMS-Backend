const { checkToken } = require('../middleware/jwt');
const { getUserDetails } = require('../middleware/authentication')
module.exports = app => {
    
const reports = require("../controllers/report.controller.js");

//----TransactionReport------//
app.post("/report/getTransactionReportCW/:login_id",checkToken, reports.getTransactionReportCW);
app.post("/report/getTransactionReportCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, reports.getTransactionReportCCS);
//----Alaram Warning Report------//
app.post("/report/getAlarmReportCW/:login_id",checkToken, reports.getAlarmReportCW);
app.post("/report/getAlarmReportDetailViewCW/:login_id",checkToken, reports.getAlarmReportDetailViewCW);
app.post("/report/getAlarmReportDetailViewCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, reports.getAlarmReportDetailViewCCS);

app.post("/report/getChargerStatusDetailViewCW/:login_id",checkToken, reports.getChargerStatusDetailViewCW);
app.post("/report/getChargerStatusDetailViewCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, reports.getChargerStatusDetailViewCCS);

app.post("/report/getChargerByLastTransactionCW/:login_id",checkToken, reports.getChargerByLastTransactionCW);


app.post("/report/getPendingTransactionCW/:login_id",checkToken, reports.getPendingTransactionCW);
app.post("/report/getSuccessTransactionCW/:login_id",checkToken, reports.getSuccessTransactionCW);
app.get("/report/otpLogsBLE/:login_id",checkToken, reports.otpLogsBLE);

app.post("/report/successfulTransactionsBLE",checkToken, reports.successfulTransactionsBLE);
app.get("/report/chargerPendingForRenewalBLE",checkToken, reports.chargerPendingForRenewalBLE);
}