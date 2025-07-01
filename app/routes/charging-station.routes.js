const { checkToken } = require("../middleware/jwt.js");

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const chargingStations = require("../controllers/charging-station.controller.js");
  
    app.post("/chargingStation/create", chargingStations.create);
    app.post("/chargingStation/update", chargingStations.update);
    app.get("/chargingStation/getChargingStations", chargingStations.getChargingStations);

    //get charging stations by logged in person's role
    app.post("/chargingStation/getChargingStationsByUserRoleAndLatLong/:login_id",checkToken, chargingStations.getChargingStationsByUserRoleAndLatLong);
    //WL-without login
    app.post("/chargingStation/getChargingStationsByUserRoleAndLatLongWL", chargingStations.getChargingStationsByUserRoleAndLatLongWL);
    app.post("/chargingStation/getChargingStationsByUserRoleAndLatLongUW/:user_id",checkToken, chargingStations.getChargingStationsByUserRoleAndLatLongUW);
    app.post("/chargingStation/getChargingStationsByUserRoleAndLatLongUW1/:user_id",checkToken, chargingStations.getChargingStationsByUserRoleAndLatLongUW1);
    
    app.get("/chargingStation/getAllChargingStationsWithChargersAndConnectors", chargingStations.getAllChargingStationsWithChargersAndConnectors);
    
    app.get("/chargingStation/getAllChargingStationsWithChargersAndConnectorsCW/:user_id",checkToken, chargingStations.getAllChargingStationsWithChargersAndConnectorsCW);
    app.get("/chargingStation/getAllChargingStationsWithChargersAndConnectorsCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, chargingStations.getAllChargingStationsWithChargersAndConnectorsCCS);
    // API to get all charging station with end customer preference
    app.get("/chargingStation/getAllChargingStationsWithChargersAndConnectorsUW/:user_id",checkToken, chargingStations.getAllChargingStationsWithChargersAndConnectorsUW);
    
    
    app.get("/chargingStation/getActiveChargingStationsWithChargersAndConnectorsCW/:login_id", chargingStations.getActiveChargingStationsWithChargersAndConnectorsCW);
    app.get("/chargingStation/getActiveChargingStationsWithChargersAndConnectorsCCS/:login_id/:client_id/:cpo_id/:station_id",checkToken, chargingStations.getActiveChargingStationsWithChargersAndConnectorsCCS);
    
    app.get("/chargingStation/getActiveChargingStationsCW/:login_id",checkToken, chargingStations.getActiveChargingStationsCW);
    
    app.get("/chargingStation/getChargingStationById/:id", chargingStations.getChargingStationById);
    
    app.get("/chargingStation/getChargingStationByCpoId/:cpo_id", chargingStations.getChargingStationByCpoId);
    app.get("/chargingStation/getChargingStationsWithTotalChargersByCPOId/:cpo_id", chargingStations.getChargingStationsWithTotalChargersByCPOId);

    
    app.get("/chargingStation/getChargingStationByClientId/:client_id", chargingStations.getChargingStationByClientId);
    app.get("/chargingStation/getAmenitiesByStationId/:station_id", chargingStations.getAmenitiesByStationId);
    

    // Delete a registered vehicle with id
    app.delete("/chargingStation/delete/:id", chargingStations.delete); 
    app.get("/chargingStation/getAllActiveChargingStations/:client_id/:cpo_id",checkToken, chargingStations.getAllActiveChargingStations);  

    app.post("/chargingStation/createEvChargingStationRequest", chargingStations.createEvChargingStationRequest); 
    
    //other's pending request except self created requests
    app.get("/chargingStation/getEvChargingStationRequestByCityId/:user_id/:city_id", chargingStations.getEvChargingStationRequestByCityId);
    //all my pending requests
    app.get("/chargingStation/getEvChargingStationRequestByUserIdCityId/:user_id/:city_id", chargingStations.getEvChargingStationRequestByUserIdCityId);
    app.post("/chargingStation/updateEvChargingStationRequest",chargingStations.updateEvChargingStationRequest);
    
    ////other's A or R request except self created requests
    app.get("/chargingStation/getApproveRejectEvChargingStationRequestByCityId/:user_id/:city_id", chargingStations.getApproveRejectEvChargingStationRequestByCityId);
     //all my A or R requests
    app.get("/chargingStation/getApproveRejectEvChargingStationRequestByUserIdCityId/:user_id/:city_id", chargingStations.getApproveRejectEvChargingStationRequestByUserIdCityId);
    
    app.post("/chargingStation/approveRejectChargerStationRequest", chargingStations.approveRejectChargerStationRequest); 
    app.delete("/chargingStation/deleteChargerStationRequest/:id/:modify_by", chargingStations.deleteChargerStationRequest);
    app.post("/chargingStation/LikeDislikeRequest", chargingStations.LikeDislikeRequest);
  };