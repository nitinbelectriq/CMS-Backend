const { upload } = require('../middleware/multer');

module.exports = app => {
    const users = require("../controllers/user-management.controller.js");
    const uploadMultiple = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 3 }])
    // create a new User
    app.post("/user/create", users.create);
    // get user
   // app.get("/getusers", users.getUsers);   
      // get user client wise
    app.get("/user/getUsersCW/:user_id", users.getUsersCW); 
    // get active user client wise
    app.get("/user/getActiveUsersCW/:user_id", users.getActiveUsersCW);
    app.get("/user/getActiveUsersByClient/:client_id", users.getActiveUsersByClient);
    app.get("/usermanagement/getUserById/:id", users.getUserById);
    app.get("/usermanagement/getUserByMobile/:mobile", users.getUserByMobile);

    // get active user role mapped client wise
    app.get("/user/getRoleListWithRolesAssignedToUserCW/:client_id/:user_id/:project_id", users.getRoleListWithRolesAssignedToUserCW); 
    app.get("/user/getUserRoleMappingCW/:login_id/:project_id", users.getUserRoleMappingCW); 
    app.post("/user/updateUserRoleMapping", users.updateUserRoleMapping);
    app.post("/user/userRoleMapping", users.userRoleMapping);
      
    //udate user
    app.post("/user/update", users.update);
    app.delete("/user/delete/:id/:user_id", users.delete);
    app.delete("/user/deleteUserRoleMapping/:id/:user_id", users.deleteUserRoleMapping);
    
    app.get("/user/userChargingHistory/:id", users.userChargingHistory);
    app.get("/user/getStationListWithStationAssignedToUser/:cpo_id/:user_id", users.getStationListWithStationAssignedToUser); 
    
    app.post("/user/getUserChargingHistoryCW/:login_id", users.getUserChargingHistoryCW);
    app.post("/user/getChargingHistoryCW/:login_id", users.getChargingHistoryCW);
    

    //START to be deleted as name changed from userStationMapping to userPreferedStationMapping
    // and updateUserStationMapping to updateUserPreferedStationMapping
    app.post("/user/userStationMapping", users.userStationMapping);
    app.post("/user/updateUserStationMapping", users.updateUserStationMapping);
    app.post("/user/userPreferedStationMapping", users.userPreferedStationMapping);
    app.post("/user/updateUserPreferedStationMapping", users.updateUserPreferedStationMapping);
    //END =============

    app.get("/user/getAllUserStationMapping/:login_id", users.getAllUserStationMapping); 
    app.post("/user/UserStationMappingV1", users.UserStationMappingV1);
    app.post("/user/updateUserStationMappingV1", users.updateUserStationMappingV1);
    app.delete("/user/deleteUserStationMapping/:id/:login_id", users.deleteUserStationMapping);
    

    

    app.post("/user/clientCpoStationDetails/:login_id", users.clientCpoStationDetails);
    app.post("/user/cpoStationDetailsByClientId/:login_id/:client_id", users.cpoStationDetailsByClientId);
    
    app.post("/user/updateAlexaEnabled", users.updateAlexaEnabled);
    app.get("/user/getEndUserDetailsByMobile/:mobile", users.getEndUserDetailsByMobile);
    app.post("/user/userChargerMappingBLESync", users.userChargerMappingBLESync);
    app.post("/user/revokeChargerAccessBLE", users.revokeChargerAccessBLE);

    
    app.post("/user/chargerRenewalRequestble",uploadMultiple, users.ChargerRenewalRequestBle);

    app.post("/user/createUserMenu", users.createUserMenu);
    app.post("/user/userChargingHistoryBle", users.userChargingHistoryBle);

    app.post("/user/userChargingSummaryBle", users.userChargingSummaryBle);
    app.post("/user/getUserByMobileAndEmail", users.getUserByMobileAndEmail);

    app.get("/user/getUserNotificationList/:user_id",users.getUserNotificationList);
    app.get("/user/updateUSerNotificationStatus/:id",users.updateUSerNotificationStatus);
    
};