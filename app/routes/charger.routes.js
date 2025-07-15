const { checkToken } = require('../middleware/jwt.js')
const { getUserDetails } = require('../middleware/authentication')
const { upload } = require('../middleware/multer');

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargers = require("../controllers/charger.controller.js");
    const uploadMultiple = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 3 }])
  
    // register a new vehicle
   app.post("/charger/create", checkToken, upload.single('file'), chargers.create);


    // update register a new vehicle
    app.post("/charger/update",checkToken, chargers.update);
    app.post("/charger/dispatchChargers",checkToken,upload.single('file'), chargers.dispatchChargers);

    //get all registered vehicles
    app.get("/charger/getChargers",checkToken, chargers.getChargers);
    app.post("/charger/getChargersDynamicFilter",checkToken, chargers.getChargersDynamicFilter);
    app.post("/charger/getChargersDynamicFilterCW/:login_id",checkToken, chargers.getChargersDynamicFilterCW);

    
    app.get("/charger/getChargersByStationId/:id",checkToken, chargers.getChargersByStationId);
    app.get("/charger/getChargersByMappedStationId/:id",checkToken, chargers.getChargersByMappedStationId);
    app.get("/charger/getActiveChargersByMappedStationId/:id", chargers.getActiveChargersByMappedStationId);

    app.get("/charger/getChargerById/:id",checkToken, chargers.getChargerById);

    app.get("/charger/getChargerByDisplayId/:display_id",checkToken, chargers.getChargerByDisplayId);

    app.get("/charger/getChargerBySerialNo/:srNo",checkToken, chargers.getChargerBySerialNo);

    // Delete a registered vehicle with id
    app.delete("/charger/delete/:id",checkToken, chargers.delete);

    // update register a new vehicle
    app.post("/charger/addChargerToStationMultiple",checkToken, chargers.addChargerToStationMultiple);
    app.post("/charger/addChargerToStation",checkToken, chargers.addChargerToStation);
    app.post("/charger/removeChargerFromStation",checkToken, chargers.removeChargerFromStation);
    app.post("/charger/getChargersByClient_CPO_StationId",checkToken, chargers.getChargersByClient_CPO_StationId);
    app.post("/charger/updateClientChargers",checkToken, chargers.updateClientChargers);
    app.get("/charger/getAllChargersByUserId/:id",checkToken, chargers.getAllChargersByUserId);
    app.get("/charger/getAllChargersByUserIdBLE/:user_id",checkToken, chargers.getAllChargersByUserIdBLE);

    app.get("/charger/getPlantChargers",checkToken, chargers.getPlantChargers);
    app.get("/charger/getClientChargers/:login_id",checkToken, getUserDetails, chargers.getClientChargers);
    app.get("/charger/getClientChargersNotMappedToAnyStation/:client_id",checkToken, chargers.getClientChargersNotMappedToAnyStation);
    app.delete("/charger/deleteChargerFromClient/:id/:user_id",checkToken, chargers.deleteChargerFromClient);
    app.get("/charger/getAllChargingProfileList",checkToken,chargers.getAllChargingProfileList);
    app.post("/charger/ChargingProfileCreation",checkToken, chargers.ChargingProfileCreation);
    app.post("/charger/ChargingScheduleCreation",checkToken, chargers.ChargingScheduleCreation);
    app.post("/charger/ChargingSchedulePeriodCreation",checkToken, chargers.ChargingSchedulePeriodCreation);
    app.delete("/charger/ChargingProfileDelete/:id/:modifyby",checkToken, chargers.ChargingProfileDelete);
    app.delete("/charger/ChargingScheduleDelete/:id/:modifyby",checkToken, chargers.ChargingScheduleDelete);
    app.delete("/charger/ChargingSchedulePeriodDelete/:id/:modifyby",checkToken, chargers.ChargingSchedulePeriodDelete);
    app.post("/charger/UpdateChargingProfile",checkToken, chargers.UpdateChargingProfile);
    app.post("/charger/UpdateChargingSchedule",checkToken, chargers.UpdateChargingSchedule);
    app.post("/charger/UpdateChargingSchedulePeriod",checkToken, chargers.UpdateChargingSchedulePeriod);
    app.get("/charger/getAllEVChargingProviderList",checkToken,chargers.getAllEVChargingProviderList);
    app.post("/charger/CreateEVChargingProvider",checkToken, chargers.CreateEVChargingProvider);
    app.post("/charger/updateEVChargingProvider",checkToken, chargers.updateEVChargingProvider);
    app.delete("/charger/deleteEVChargingProvider/:id/:modifyby",checkToken, chargers.deleteEVChargingProvider);
    app.get("/charger/getChargerProfile",checkToken,chargers.getChargerProfile);
    app.get("/charger/getChargerScheduleByProfileId/:profile_id",checkToken,chargers.getChargerScheduleByProfileId);
    app.get("/charger/getChargerSchedulePeriodByScheduleId/:schedule_id",checkToken,chargers.getChargerSchedulePeriodByScheduleId);


    app.get("/charger/getAllBleChargers/",checkToken, chargers.getAllBleChargers);
    app.post("/charger/updateBleChargerStatus/",checkToken, uploadMultiple,chargers.updateBleChargerStatus);
    app.post("/charger/updateChargerAddressBLE",checkToken, chargers.updateChargerAddressBLE);

    app.get("/charger/getPendingWarrantyRequestBle/",checkToken, chargers.getPendingWarrantyRequestBle);
    app.get("/charger/checkChargerMappedToStationBySrNo/:serial_no",checkToken, chargers.checkChargerMappedToStationBySrNo);
    app.post("/charger/createChargerRequest/",checkToken, chargers.createChargerRequest);
    app.get("/charger/getAllModerateChargerRequest/",checkToken, chargers.getAllModerateChargerRequest);
    app.post("/charger/approveRejectChargerRequest/",checkToken, chargers.approveRejectChargerRequest);
    app.post("/charger/updateChargerRequest/",checkToken, chargers.updateChargerRequest);
    app.get("/charger/getAllApproveRejectChargerRequest/",checkToken, chargers.getAllApproveRejectChargerRequest);
    app.get("/charger/getApproveRejectChargerRequestByUserId/:user_id",checkToken, chargers.getApproveRejectChargerRequestByUserId);
    app.get("/charger/getModerateChargerRequestByUserId/:user_id",checkToken, chargers.getModerateChargerRequestByUserId);
    app.delete("/charger/deleteChargerRequest/:id/:modify_by",checkToken, chargers.deleteChargerRequest);
    
   
    app.post("/charger/createScheduleBLE/",checkToken, chargers.createScheduleBLE);
    app.get("/charger/getAllScheduleBLE/",checkToken, chargers.getAllScheduleBLE);
    app.get("/charger/getScheduleBLEByChargerSerialNo/:charger_serial_no",checkToken, chargers.getScheduleBLEByChargerSerialNo);
    app.get("/charger/getScheduleBLEByUserId/:user_id",checkToken, chargers.getScheduleBLEByUserId);
    app.post("/charger/ScheduleBLEByChargerSerialNoAndUserId",checkToken, chargers.ScheduleBLEByChargerSerialNoAndUserId);
    app.post("/charger/updateScheduleBLE/",checkToken, chargers.updateScheduleBLE);
    app.post("/charger/updateEnableDisableScheduleBLE",checkToken, chargers.updateEnableDisableScheduleBLE);
    app.post("/charger/updateScheduleStatusBLE",checkToken, chargers.updateScheduleStatusBLE);
    app.delete("/charger/deleteScheduleBLE/",checkToken, chargers.deleteScheduleBLE);
   
    app.post("/charger/setChargerConfiguration",checkToken, chargers.setChargerConfiguration);
    app.get("/charger/getAllChargerConfiguration",checkToken, chargers.getAllChargerConfiguration);

    app.post("/charger/updateNickName",checkToken, chargers.updateChargerNickName);

  }; 