const { sql, pool } = require("./db.js");

// constructor
const SubClient = function (subClient) {
  this.id = subClient.id,
  this.client_id = subClient.client_id,
  this.name = subClient.name,
  this.description = subClient.description,
  this.address = subClient.address,
  this.logoPath = subClient.logoPath,
  this.mobile = subClient.mobile,
  this.email = subClient.email,
  this.address1 = subClient.address1;
  this.address2 = subClient.address2;
  this.PIN = subClient.PIN;
  this.landmark = subClient.landmark;
  this.city_id = subClient.city_id;
  this.state_id = subClient.state_id;
  this.country_id = subClient.country_id;
  this.cp_name = subClient.cp_name,
  this.status = subClient.status,
  this.created_date = subClient.created_date,
  this.created_by = subClient.created_by,
  this.modify_date = subClient.modify_date,
  this.modify_by = subClient.modify_by
};

SubClient.create = (newClient, result) => {
  var datetime = new Date();

  let stmt = `insert into sub_client_mst (client_id,name,description,
    address1  ,address2  ,PIN  ,landmark  ,city_id ,state_id ,country_id ,
    logoPath,  mobile,email,cp_name,status,created_date,createdby )
    VALUES (${newClient.client_id},'${newClient.name}','${newClient.description}',
    '${newClient.address1}','${newClient.address2}',${newClient.PIN},'${newClient.landmark}',${newClient.city_id},${newClient.state_id},${newClient.country_id},
    '${newClient.logoPath}',  '${newClient.mobile}','${newClient.email}','${newClient.cp_name}',
    '${newClient.status}','${datetime.toISOString().slice(0, 10)}',${newClient.created_by}) `;

  let todo = newClient;

  sql.query(stmt, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newClient });
  });
};

SubClient.update = (newClient, result) => {
  var datetime = new Date();

  let stmt = `update sub_client_mst set client_id = ${newClient.client_id},
  name = '${newClient.name}',description = '${newClient.description}',
  address1='${newClient.address1}'  ,address2 ='${newClient.address2}' ,PIN =${newClient.PIN} ,
  landmark ='${newClient.landmark}' ,city_id=${newClient.city_id} ,state_id=${newClient.state_id} ,
  country_id=${newClient.country_id} ,
  logoPath = '${newClient.logoPath}',mobile = '${newClient.mobile}',email = '${newClient.email}',
  cp_name = '${newClient.cp_name}',status = '${newClient.status}',
  modifyby = ${newClient.modify_by},modify_date = '${datetime.toISOString().slice(0, 10)}' 
  where id =  ${newClient.id}`;

  sql.query(stmt, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newClient });
  });
};




SubClient.getSubClients = result => {

  let stmt = `select cm.id, cm.client_id, cm.name,cm.description,
    cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
    cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
    cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
    from sub_client_mst cm inner join city_mst city on cm.city_id = city.id
    inner join state_mst sm on cm.state_id = sm.id
    inner join country_mst country on cm.country_id = country.id
    where cm.status <> 'D'
    order by cm.id desc`;

  sql.query(stmt, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

SubClient.getSubClientById = (id, result) => {

  let stmt = `select cm.id, cm.client_id, cm.name,cm.description,
      cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
      cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
      cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
      from sub_client_mst cm inner join city_mst city on cm.city_id = city.id
      inner join state_mst sm on cm.state_id = sm.id
      inner join country_mst country on cm.country_id = country.id
      WHERE cm.id = ? and cm.status = 'Y'`;
  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

SubClient.getSubClientByClientId = (id, result) => {

  let stmt = `select cm.id, cm.client_id, cm.name,cm.description,
      cm.address1  ,cm.address2  ,cm.PIN  ,cm.landmark  ,
      cm.city_id , city.name as city_name, cm.state_id, sm.name as state_name, cm.country_id, country.name as country_name,
      cm.logoPath,cm.mobile,cm.email,cm.cp_name,cm.status,cm.created_date,cm.createdby,cm.modifyby,cm.modify_date
      from sub_client_mst cm inner join city_mst city on cm.city_id = city.id
      inner join state_mst sm on cm.state_id = sm.id
      inner join country_mst country on cm.country_id = country.id
      WHERE cm.client_id = ? and cm.status = 'Y'`;
  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

SubClient.delete = (id, result) => {

  let stmt = `Update sub_client_mst set status = 'D' WHERE id = ?`;
  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

module.exports = {
  SubClient: SubClient
};