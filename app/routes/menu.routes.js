const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    // const customers = require("../controllers/customer.controller.js");
    const menus = require("../controllers/menu.controller.js");
  
    // register a new vehicle
    app.post("/menu/clientMenuMapping",checkToken, menus.clientMenuMapping);
    app.post("/menu/roleMenuMapping",checkToken, menus.roleMenuMapping);
    app.get("/menu/getMenusWithAlreadyMappedToClient/:project_id/:client_id",checkToken, menus.getMenusWithAlreadyMappedToClient);
    app.get("/menu/getMenusByClientId/:project_id/:client_id",checkToken, menus.getMenusByClientId);
    app.get("/menu/getMenusByClientIdWithAlreadyMappedToRole/:project_id/:client_id/:role_id",checkToken, menus.getMenusByClientIdWithAlreadyMappedToRole);
    
    
    app.get("/menu/getNavLevel",checkToken, menus.getNavLevel);
    app.get("/menu/getMenuType",checkToken, menus.getMenuType);
    app.get("/menu/getMenuIcon",checkToken, menus.getMenuIcon);
    app.get("/menu/getParentByNavLevel/:nav_level",checkToken, menus.getParentByNavLevel);
    app.get("/menu/getAllMenus",checkToken, menus.getAllMenus);
    app.post("/menu/create",checkToken, menus.create);
    app.post("/menu/updateMenu",checkToken, menus.updateMenu);
    app.delete("/menu/deleteMenu/:id/:modify_by",checkToken, menus.deleteMenu);

    // // update register a new vehicle
    // app.post("/menu/update",checkToken, menus.update);

    // //get all registered vehicles
    // app.get("/menu/getClients", checkToken, menus.getClients);
    // //get all registered vehicles
    // app.get("/menu/getClientsCW/:login_id", checkToken, menus.getClientsCW);

    // app.get("/menu/getActiveClientsCW/:login_id",checkToken, menus.getActiveClientsCW);

    // 
    // app.get("/menu/getClientById/:id",checkToken, menus.getClientById);

    // // Delete a registered vehicle with id
    // app.delete("/menu/delete/:id", checkToken,menus.delete);

    app.get("/menu/getAllMenuListBLE",checkToken, menus.getAllMenuListBLE);
    app.get("/menu/getActiveMenusBLE",checkToken, menus.getActiveMenusBLE);
    app.get("/menu/getActiveMenusByIdBLE/:id",checkToken, menus.getActiveMenusByIdBLE);
    app.post("/menu/createBLE",checkToken, menus.createBLE);
    app.post("/menu/updateMenuBLE",checkToken, menus.updateMenuBLE);
    app.delete("/menu/deleteMenuBLE/:id/:modify_by",checkToken, menus.deleteMenuBLE);



  };