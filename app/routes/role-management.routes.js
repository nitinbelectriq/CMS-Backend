module.exports = app => {
    const rolemgmt = require("../controllers/role-management.controller.js");

    // create a new Role
    app.post("/role/create", rolemgmt.create);
    // get role
    app.get("/role/getroles", rolemgmt.getRoles); 
        // get role client wise
    app.get("/role/getRoleCW/:user_id/:project_id", rolemgmt.getRoleCW); 
    // get active role client wise
    app.get("/role/getActiveRoleCW/:user_id/:project_id", rolemgmt.getActiveRoleCW); 

    app.get("/role/getActiveRolesByClientId/:project_id/:client_id", rolemgmt.getActiveRolesByClientId); 

     // get active role
     //app.get("/role/getActiveroles", rolemgmt.getActiveRoles); 
     // get a role
    app.get("/role/getRoleById/:id", rolemgmt.getRoleById);
    //update role
    app.post("/role/update", rolemgmt.update);
    // delete a role
    app.delete("/role/delete/:id/:user_id", rolemgmt.delete);
     

    
};