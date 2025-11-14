const myModule = require("../models/menu.model.js");

const Menu = myModule.Menu;  
const Menu_Spin = myModule.Menu_Spin;  
const ClientMenu = myModule.ClientMenu;  
const RoleMenu = myModule.RoleMenu;  

exports.clientMenuMapping = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const clientMenu = new ClientMenu({
    client_id : req.body.client_id,
    menu_id : req.body.menu_id,
    title : req.body.title,
    display_order : req.body.display_order,
    menus : req.body.menus,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  ClientMenu.clientMenuMapping(clientMenu, (err, data) => {
    res.send(data);
  });
};

exports.roleMenuMapping = (req, res) => {
debugger;
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const roleMenu = new RoleMenu({
    client_id : req.body.client_id,
    role_id : req.body.role_id,
    menu_id : req.body.menu_id,
    title : req.body.title,
    display_order : req.body.display_order,
    menus : req.body.menus,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  RoleMenu.roleMenuMapping(roleMenu, (err, data) => {
    res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const menu = new Menu({
    id : req.body.id,
    name : req.body.name ,
    description : req.body.description,

    // address : req.body.address,
    address1  :  !!req.body.address1 ? req.body.address1 : '' ,
    address2  :  !!req.body.address2 ? req.body.address2 : '' ,
    PIN  :  !!req.body.PIN ? req.body.PIN : 0 ,
    landmark  :  !!req.body.landmark ? req.body.landmark : '' ,
    city_id  :  !!req.body.city_id ? req.body.city_id : 0 ,
    state_id  :  !!req.body.state_id ? req.body.state_id : 0 ,
    country_id  :  !!req.body.country_id ? req.body.country_id : 0 ,

    logoPath : req.body.logoPath,
    mobile : req.body.mobile,
    email : req.body.email,
    cp_name : req.body.cp_name,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

  // Save Customer in the database
  Menu.update(menu, (err, data) => {
    // if (err)
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Customer."
    //   });
    // else res.send(data);
     res.send(data);
  });
};

exports.getMenusWithAlreadyMappedToClient = (req, res) => {

  let project_id = req.params.project_id;
  let client_id = req.params.client_id;

  ClientMenu.getMenusWithAlreadyMappedToClient(project_id,client_id, (err, data) => {
    res.send(data);
 });
};

exports.getMenusByClientId = (req, res) => {

  let project_id = req.params.project_id;
  let client_id = req.params.client_id;

  ClientMenu.getMenusByClientId(project_id,client_id, (err, data) => {
    res.send(data);
 });
};

exports.getMenusByClientIdWithAlreadyMappedToRole = (req, res) => {

  let project_id = req.params.project_id;
  let client_id = req.params.client_id;
  let role_id = req.params.role_id;

  ClientMenu.getMenusByClientIdWithAlreadyMappedToRole(project_id,client_id,role_id, (err, data) => {
    res.send(data);
 });
};

// exports.getClientsCW = (req, res) => {

//   let login_id = req.params.login_id;
//   Menu.getClientsCW(login_id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(200).send({
//           message: `NOT_FOUND`
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Customer with id "
//         });
//       }
//     } else res.send(data);
//   });
// };

// exports.getActiveClientsCW = (req, res) => {

//   let login_id = req.params.login_id;
//   Menu.getActiveClientsCW(login_id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(200).send({
//           message: `NOT_FOUND`
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Customer with id "
//         });
//       }
//     } else res.send(data);
//   });
// };

// exports.getClientById = (req, res) => {
//   Menu.getClientById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Customer with id ${req.params.id}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Customer with id " + req.params.id
//         });
//       }
//     } else res.send(data);
//   });
// };


// exports.delete = (req, res) => {
//   Menu.delete(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(200).send({
//           message: `Not found vehicle with id ${req.params.id}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete Customer with id " + req.params.id
//         });
//       }
//     } else res.send({ message: `Customer was deleted successfully!` });
//   });
// };

exports.getNavLevel = (req, res) => {

 

  Menu.getNavLevel( (err, data) => {
    res.send(data);
 });
};

exports.getMenuType = (req, res) => {

 

  Menu.getMenuType( (err, data) => {
    res.send(data);
 });
};
exports.getMenuIcon = (req, res) => {

 

  Menu.getMenuIcon( (err, data) => {
    res.send(data);
 });
};
exports.getParentByNavLevel = (req, res) => {

  let nav_level = req.params.nav_level;

  Menu.getParentByNavLevel( nav_level,(err, data) => {
    res.send(data);
 });
};
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const menu = new Menu({
    nav_level : req.body.nav_level,
    project_id : req.body.project_id,
    parent_id : req.body.parent_id,
    nav_id : req.body.nav_id,
    title : req.body.title,
    type : req.body.type,
    icon : req.body.icon,
    icon_url : '',
    url : !!req.body.url ? req.body.url:null,
    display_order : req.body.display_order,
    status : req.body.status ,
    created_date : req.body.created_date ,
    created_by : req.body.created_by
  });

  Menu.create(menu, (err, data) => {
    res.send(data);
  });
};
exports.getAllMenus = (req,res) =>{

  Menu.getAllMenus((err,data) =>{
    res.send(data)
  });
};
exports.updateMenu = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  const menu= new Menu({
    id:req.body.id,
    nav_level : req.body.nav_level,
    project_id : req.body.project_id,
    parent_id : req.body.parent_id,
    nav_id : req.body.nav_id,
    title : req.body.title,
    type : req.body.type,
    icon : req.body.icon,
    icon_url : '',
    url : !!req.body.url ? req.body.url:null,
    display_order : req.body.display_order,
    status : req.body.status ,
    modify_date : req.body.modify_date ,
    modify_by : req.body.modify_by
  });

 
  Menu.updateMenu(menu, (err, data) => {
    
    res.send(data);
  });
};
exports.deleteMenu = (req, res) => {

  
  Menu.deleteMenu(req.params.id,req.params.modify_by, (err, data) => {
    
    res.status(200).send(data);
  });
};

exports.getAllMenuListBLE = (req,res) =>{

  Menu_Spin.getAllMenuListBLE((err,data) =>{
    res.send(data)
  });
};

exports.getActiveMenusBLE = (req,res) =>{

  Menu_Spin.getActiveMenusBLE((err,data) =>{
    res.send(data)
  });
};

exports.getActiveMenusByIdBLE = (req,res) =>{

  Menu_Spin.getActiveMenusByIdBLE(req.params.id,(err,data) =>{
    res.send(data)
  });
};

exports.createBLE = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const menu_spin = new Menu_Spin({
    id : req.body.id,
    code : req.body.code,
    title : req.body.title,
    icon : req.body.icon,
    icon_url : req.body.icon_url,
    sub_id : req.body.sub_id,
    sub_title : req.body.sub_title,
    sub_icon : req.body.sub_icon,
    sub_icon_url:req.body.sub_icon_url,
    menu_type : req.body.menu_type,
    country_id : req.body.country_id,
    status:req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by
  });

  Menu_Spin.createBLE(menu_spin, (err, data) => {
    res.send(data);
  });
};

exports.updateMenuBLE = (req, res) => {
  
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  const menu_spin= new Menu_Spin({
    id : req.body.id,
    code : req.body.code,
    title : req.body.title,
    icon : req.body.icon,
    icon_url : req.body.icon_url,
    sub_id : req.body.sub_id,
    sub_title : req.body.sub_title,
    sub_icon : req.body.sub_icon,
    sub_icon_url:req.body.sub_icon_url,
    menu_type : req.body.menu_type,
    country_id : req.body.country_id,
    status:req.body.status,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by  
  });

 
  Menu_Spin.updateMenuBLE(menu_spin, (err, data) => {
    
    res.send(data);
  });
};

exports.deleteMenuBLE = (req, res) => {

  
  Menu_Spin.deleteMenuBLE(req.params.id,req.params.modify_by, (err, data) => {
    
    res.status(200).send(data);
  });
};