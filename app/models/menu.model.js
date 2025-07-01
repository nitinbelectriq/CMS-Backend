const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");

// constructor
const Menu = function (menu) {
  this.id = menu.id,
    this.nav_level = menu.nav_level,
    this.project_id = menu.project_id,
    this.nav_id = menu.nav_id,
    this.title = menu.title,
    this.type = menu.type,
    this.icon = menu.icon,
    this.icon_url = menu.icon_url,
    this.url = menu.url,
    this.display_order = menu.display_order,
    this.parent_id = menu.parent_id,
    this.status = menu.status,
    this.created_date = menu.created_date,
    this.created_by = menu.created_by,
    this.modify_date = menu.modify_date,
    this.modify_by = menu.modify_by
};

const Menu_Spin = function (menu_spin) {
    this.id = menu_spin.id,
    this.code = menu_spin.code,
    this.title = menu_spin.title,
    this.icon = menu_spin.icon,
    this.icon_url = menu_spin.icon_url,
    this.sub_id = menu_spin.sub_id,
    this.sub_title = menu_spin.sub_title,
    this.sub_icon = menu_spin.sub_icon,
    this.sub_icon_url=menu_spin.sub_icon_url,
    this.menu_type = menu_spin.menu_type,
    this.country_id = menu_spin.country_id,
    this.status=menu_spin.status,
    this.created_date = menu_spin.created_date,
    this.created_by = menu_spin.created_by,
    this.modify_date = menu_spin.modify_date,
    this.modify_by = menu_spin.modify_by
};

const ClientMenu = function (clientMenu) {
  this.id = clientMenu.id,
    this.client_id = clientMenu.client_id,
    this.menu_id = clientMenu.menu_id,
    this.title = clientMenu.title,
    this.display_order = clientMenu.display_order,
    this.menus = clientMenu.menus,
    this.status = clientMenu.status,
    this.created_date = clientMenu.created_date,
    this.created_by = clientMenu.created_by,
    this.modify_date = clientMenu.modify_date,
    this.modify_by = clientMenu.modify_by
};

const RoleMenu = function (roleMenu) {
  this.id = roleMenu.id,
    this.client_id = roleMenu.client_id,
    this.role_id = roleMenu.role_id,
    this.menu_id = roleMenu.menu_id,
    this.title = roleMenu.title,
    this.display_order = roleMenu.display_order,
    this.menus = roleMenu.menus,
    this.status = roleMenu.status,
    this.created_date = roleMenu.created_date,
    this.created_by = roleMenu.created_by,
    this.modify_date = roleMenu.modify_date,
    this.modify_by = roleMenu.modify_by
};

ClientMenu.clientMenuMapping = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let respSelect;
  let respSelectActive;
  let id_to_keep_status_active = [];

  let stmtSelect = `Select id,status from client_menu_mapping where client_id = ?  and menu_id = ? `;
  let stmtSelectActive = `Select id from client_menu_mapping where client_id = ? and status ='Y' and id not in (?)  `;
  let stmtInsert = `insert into client_menu_mapping (client_id,menu_id,title,display_order,
      status,created_date,createdby) VALUES ? `;

  let stmtUpdate = `update client_menu_mapping set client_id = ? ,menu_id = ?,title = ?,
    display_order= ?,status = ?,modify_date = ? ,modifyby =  ?
    where id = ? ; `;
  let stmtUpdateDelete = `update client_menu_mapping set status = 'D',modify_date = ? ,modifyby =  ?
    where client_id = ? and id not in (?)  ; `;

  let values = [];
  try {

    for (let i = 0; i < params.menus.length; i++) {

      respSelect = await pool.query(stmtSelect, [params.client_id, params.menus[i].menu_id]);

      if (respSelect.length == 0) {
        values.push([params.client_id, params.menus[i].menu_id, params.menus[i].title,
        params.menus[i].display_order, params.status, datetime, params.created_by]);
      } else {

        id_to_keep_status_active.push(respSelect[0].id);

        //update only in case of record is not in Y state because if its in already Y state hen it would be unnecessary to make it Y
        if (respSelect[0].status != 'Y') {
          respUpdate = await pool.query(stmtUpdate, [params.client_id, params.menus[i].menu_id, params.menus[i].title,
          params.menus[i].display_order, params.status, datetime, params.created_by, respSelect[0].id])
        }
      }
    }


    if (id_to_keep_status_active.length > 0) {

      respSelectActive = await pool.query(stmtSelectActive, [params.client_id, id_to_keep_status_active]);

      if (respSelectActive.length > 0) {
        respUpdateDelete = await pool.query(stmtUpdateDelete, [datetime, params.created_by, params.client_id, id_to_keep_status_active]);
      }
    }

    if (values.length > 0) {
      resp = await pool.query(stmtInsert, [values]);
    }

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: 'SUCCESS',
      count: 0,
      data: []
    }
    // clean upp all other

  } catch (e) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};


RoleMenu.roleMenuMapping = async (params, result) => {
  debugger;
  var datetime = new Date();
  let final_res;
  let respSelect;
  let respSelectActive;
  let id_to_keep_status_active = [];

  let stmtSelect = `Select map_id,status from role_menu_mapping where role_id = ? and menu_id = ? `;
  let stmtSelectActive = `Select map_id from role_menu_mapping where role_id = ? and status ='Y' and map_id not in (?)  `;
  let stmtInsert = `insert into role_menu_mapping (role_id,menu_id,status,created_date,createdby) VALUES ? `;

  let stmtUpdate = `update role_menu_mapping set role_id = ? ,menu_id = ?,status = ?,modify_date = ? ,modifyby =  ?
    where map_id = ? ; `;
  let stmtUpdateDelete = `update role_menu_mapping set status = 'D',modify_date = ? ,modifyby =  ?
    where role_id = ? and map_id not in (?)  ; `;

  let values = [];
  try {


    for (let i = 0; i < params.menus.length; i++) {

      respSelect = await pool.query(stmtSelect, [params.role_id, params.menus[i].menu_id]);

      if (respSelect.length == 0) {
        values.push([params.role_id, params.menus[i].menu_id, params.status, datetime, params.created_by]);
      } else {
        id_to_keep_status_active.push(respSelect[0].map_id);

        //update only in case of record is not in Y state because if its in already Y state hen it would be unnecessary to make it Y
        if (respSelect[0].status != 'Y') {

          respUpdate = await pool.query(stmtUpdate, [params.role_id, params.menus[i].menu_id,
          params.status, datetime, params.created_by, respSelect[0].map_id])
        }
      }
    }


    if (id_to_keep_status_active.length > 0) {

      respSelectActive = await pool.query(stmtSelectActive, [params.role_id, id_to_keep_status_active]);

      if (respSelectActive.length > 0) {
        respUpdateDelete = await pool.query(stmtUpdateDelete, [datetime, params.created_by, params.role_id, id_to_keep_status_active]);
      }
    }


    if (values.length > 0) {
      resp = await pool.query(stmtInsert, [values]);
    }

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: 'SUCCESS',
      count: 0,
      data: []
    }
    // clean upp all other

  } catch (e) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

Menu.update = async (newClient, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update client_mst set 
  name = '${newClient.name}',description = '${newClient.description}',
  address1='${newClient.address1}'  ,address2 ='${newClient.address2}' ,PIN =${newClient.PIN} ,
  landmark ='${newClient.landmark}' ,city_id=${newClient.city_id} ,state_id=${newClient.state_id} ,
  country_id=${newClient.country_id} ,
  logoPath = '${newClient.logoPath}',mobile = '${newClient.mobile}',email = '${newClient.email}',
  cp_name = '${newClient.cp_name}',status = '${newClient.status}',
  modifyby = ${newClient.modify_by},modify_date = '${datetime.toISOString().slice(0, 10)}' 
  where id =  ${newClient.id}`;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      count: 1,
      data: [{ id: newClient.id }]
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

  // sql.query(stmt, (err, res) => {

  //   if (err) {
  //     result(err, null);
  //     return;
  //   }

  //   result(null, { id: res.insertId, ...newClient });
  // });
};



ClientMenu.getMenusWithAlreadyMappedToClient = async (project_id, client_id, result) => {

  let final_res;
  let resp;
  let stmt = '';

  stmt = `select cmm.id as map_id , mm.id as menu_id,mm.title, cmm.client_id,mm.parent_id 
    from menu_mst mm left join client_menu_mapping cmm on mm.id = cmm.menu_id and cmm.status='Y'  and cmm.client_id = ${client_id} 
    where mm.status = 'Y' and mm.project_id= ${project_id}
    order by mm.display_order ;`;
debugger;
  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};



ClientMenu.getMenusByClientId = async (project_id, client_id, result) => {

  let final_res;
  let resp;
  let stmt = '';

  stmt = `select cmm.id as map_id , mm.id as menu_id,mm.title, cmm.client_id,mm.parent_id 
    from  client_menu_mapping cmm inner join menu_mst mm on cmm.menu_id = mm.id  and  mm.status = 'Y' and mm.project_id= ${project_id}
    where cmm.status='Y' and cmm.client_id = ${client_id} 
    order by mm.display_order ;`;

  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

ClientMenu.getMenusByClientIdWithAlreadyMappedToRole = async (project_id, client_id, role_id, result) => {

  let final_res;
  let resp;
  let stmt = '';

  stmt = `select rmm.map_id as rm_map_id, mm.id as menu_id,mm.title, cmm.client_id,mm.parent_id 
  from  client_menu_mapping cmm inner join menu_mst mm on cmm.menu_id = mm.id  and  mm.status = 'Y' and mm.project_id= ${project_id}
  left join role_menu_mapping rmm on cmm.menu_id = rmm.menu_id and rmm.status='Y' and rmm.role_id=${role_id}
  where cmm.status='Y' and cmm.client_id = ${client_id}
  order by mm.display_order ;`;



  try {

    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

//07 02 2022 : Commented as found copied from client model by mistake
// Menu.getClients = result => {

//   let stmt = `select cm.id,  cm.name,cm.description,
//     cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//     cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//     cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//     from client_mst cm inner join city_mst city on cm.city_id = city.id
//     inner join state_mst sm on cm.state_id = sm.id
//     inner join country_mst country on cm.country_id = country.id
//     where cm.status <> 'D'
//     order by cm.id desc`;

//   sql.query(stmt, (err, res) => {

//     if (err) {
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, res);
//       return;
//     }

//     // not found Customer with the id
//     result({ kind: "not_found" }, null);
//   });
// };


// Menu.getClientsCW = async (login_id,result) => {

//   let stmt='';
//   let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
//   let client_id = clientAndRoleDetails.data[0].client_id;
//   // let role_code = clientAndRoleDetails.data[0].role_code;
//   let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

//   if(isSA){
//     stmt = `select cm.id,  cm.name,cm.description,
//     cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//     cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//     cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//     from client_mst cm inner join city_mst city on cm.city_id = city.id
//     inner join state_mst sm on cm.state_id = sm.id
//     inner join country_mst country on cm.country_id = country.id
//     where cm.status <> 'D'
//     order by cm.id desc`;
//   }else{
//     stmt = `select cm.id,  cm.name,cm.description,
//     cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//     cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//     cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//     from client_mst cm inner join city_mst city on cm.city_id = city.id
//     inner join state_mst sm on cm.state_id = sm.id
//     inner join country_mst country on cm.country_id = country.id
//     where cm.status <> 'D' and cm.id = ${client_id}
//     order by cm.id desc`;
//   }

//   // stmt = `select cm.id,  cm.name,cm.description,
//   //   cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//   //   cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//   //   cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//   //   from client_mst cm inner join city_mst city on cm.city_id = city.id
//   //   inner join state_mst sm on cm.state_id = sm.id
//   //   inner join country_mst country on cm.country_id = country.id
//   //   where cm.status <> 'D'
//   //   order by cm.id desc`;

//   sql.query(stmt, (err, res) => {

//     if (err) {
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, res);
//       return;
//     }

//     // not found Customer with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// Menu.getActiveClientsCW = async (login_id,result) => {

//   let stmt='';
//   let clientAndRoleDetails = await _utility.getClientIdAndRoleByUserId(login_id);
//   let client_id = clientAndRoleDetails.data[0].client_id;
//   // let role_code = clientAndRoleDetails.data[0].role_code;
//   let isSA =  ( clientAndRoleDetails.data.filter(x=>x.role_code=='SA').length > 0) ? true : false;

//   if(isSA){
//     stmt = `select cm.id,  cm.name,cm.description,
//     cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//     cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//     cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//     from client_mst cm inner join city_mst city on cm.city_id = city.id
//     inner join state_mst sm on cm.state_id = sm.id
//     inner join country_mst country on cm.country_id = country.id
//     where cm.status = 'Y'
//     order by cm.id desc`;
//   }else{
//     stmt = `select cm.id,  cm.name,cm.description,
//     cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//     cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//     cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//     from client_mst cm inner join city_mst city on cm.city_id = city.id
//     inner join state_mst sm on cm.state_id = sm.id
//     inner join country_mst country on cm.country_id = country.id
//     where cm.status = 'Y' and cm.id = ${client_id}
//     order by cm.id desc`;
//   }

//   sql.query(stmt, (err, res) => {

//     if (err) {
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, res);
//       return;
//     }

//     // not found Customer with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// Menu.getClientById = (id, result) => {

//   let stmt = `select cm.id,  cm.name,cm.description,
//       cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
//       cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
//       cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
//       from client_mst cm inner join city_mst city on cm.city_id = city.id
//       inner join state_mst sm on cm.state_id = sm.id
//       inner join country_mst country on cm.country_id = country.id
//       WHERE cm.id = ? and cm.status = 'Y'`;
//   sql.query(stmt, id, (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     result(null, res);
//   });
// };

// Menu.delete = (id, result) => {

//   let stmt = `Update client_mst set status = 'D' WHERE id = ?`;
//   sql.query(stmt, id, (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     result(null, res);
//   });
// };


Menu.getNavLevel = async (result) => {
  debugger;
  let final_res;
  let resp;
  let resp1;
  let resp2;
  let nav_level = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let next_display_order = 1;
  let stmt1 = `select max(display_order )+1 as next_display_order from menu_mst where status='Y' ;`;

  try {
    resp1 = await pool.query(stmt1);

    if (resp1.length > 0) {
      next_display_order = resp1[0].next_display_order;
    } else {
      next_display_order = 1;
    }

    resp2 = {
      nav_level: nav_level,
      next_display_order: next_display_order
    }

    final_res = {
      status: true,
      err_code: `ERROR : 0`,
      message: 'SUCCESS',
      count: 0,
      data: resp2
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu.getMenuType = async (result) => {

  let stmt = `select distinct type from Menu_mst where status="Y" `;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};
Menu.getMenuIcon = async (result) => {

  let stmt = `select distinct icon from Menu_mst where status="Y" `;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};
Menu.getParentByNavLevel = async (nav_level, result) => {
  debugger;
  let stmt = `select  id, title from Menu_mst where status="Y"  and nav_level=${nav_level}-1;`;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu.create = async (data, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into menu_mst (nav_level,project_id,nav_id,title,type,icon,icon_url,url,display_order,parent_id,
    status,created_date,createdby) values (?) `;
  let values = [data.nav_level, data.project_id, data.nav_id, data.title, data.type, data.icon, data.icon_url, data.url, data.display_order, data.parent_id,
  data.status, datetime, data.created_by];
  try {
    resp = await pool.query(stmt2, [values]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{ id: resp.insertId }]
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};
Menu.getAllMenus = async (result) => {
  let stmt = `select id,nav_level,project_id,nav_id,title,type,icon,icon_url,url,display_order,parent_id,
  status from menu_mst where status<>'D';`
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};
Menu.updateMenu = async (data, result) => {

  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update menu_mst set nav_level=?,project_id=?,nav_id=?,title=?,
  type=?,icon=?,icon_url=?,url=?,display_order=?,parent_id=?,modify_date=?,modifyby=?,
  status = ? where id = ? ; `;

  try {

    resp = await pool.query(stmt, [data.nav_level, data.project_id, data.nav_id, data.title,
    data.type, data.icon, data.icon_url, data.url, data.display_order, data.parent_id,
      datetime, data.modify_by, data.status, data.id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu.deleteMenu = async (id, modify_by, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update menu_mst set status = 'D',
  modifyby = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modify_by, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};
Menu_Spin.getAllMenuListBLE = async (result) => {
  debugger;
  let stmt = `select id,code,title,icon,icon_url,sub_id,sub_title,sub_icon,sub_icon_url,menu_type,
  country_id,status,created_date,modify_date from menu_spin_mst where status <>'D';`;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu_Spin.getActiveMenusBLE = async (result) => {
  let stmt = `select id,code,title,icon,icon_url,sub_id,sub_title,sub_icon,sub_icon_url,menu_type,
  country_id,created_date,modify_date from menu_spin_mst where status='Y';`
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu_Spin.getActiveMenusByIdBLE = async (id,result) => {
  let stmt = `select code,title,icon,icon_url,sub_id,sub_title,sub_icon,sub_icon_url,menu_type,
  country_id,status,created_date,modify_date from menu_spin_mst where id =${id};`
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
      message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
      data: resp
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu_Spin.createBLE = async (data, result) => {
 
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `insert into menu_spin_mst (code,title,icon,icon_url,sub_id,sub_title,sub_icon,
               sub_icon_url,menu_type,country_id,status,created_by,created_date) values(?);`;

  let values = [data.code,data.title,data.icon,data.icon_url,data.sub_id,data.sub_title,
    data.sub_icon,data.sub_icon_url,data.menu_type,data.country_id,data.status,
    data.created_by,datetime];
  try {
    resp = await pool.query(stmt2, [values]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{ id: resp.insertId }]
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu_Spin.updateMenuBLE = async (data, result) => {

  var datetime = new Date();
  let final_res;
  let resp;

  let stmt = `update menu_spin_mst set code=?,title=?,icon=?,icon_url=?,sub_id=?,sub_title=?,sub_icon=?,
  sub_icon_url=?,menu_type=?,country_id=?,status=?,modify_date=?,modify_by=? where  id=?;`; 

  try {

    resp = await pool.query(stmt, [data.code,data.title,data.icon,data.icon_url,
    data.sub_id,data.sub_title,data.sub_icon,data.sub_icon_url,data.menu_type,data.country_id,data.status,
    datetime,data.modify_by,data.id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{updatedId:data.id}]
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

Menu_Spin.deleteMenuBLE = async (id, modify_by, result) => {
  var datetime = new Date();
  let final_res;
  let resp;

  let stmt2 = `Update menu_spin_mst set status = 'D',
  modify_by = ?, modify_date = ?
  WHERE id = ?`;

  try {

    resp = await pool.query(stmt2, [modify_by, datetime, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows > 0 ?"ERROR:0":"ERROR:1",
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: [{DeletedId:id}]
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

module.exports = {
  Menu: Menu,Menu_Spin,
  ClientMenu: ClientMenu,
  RoleMenu: RoleMenu
};