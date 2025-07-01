const {sql,pool} = require("./db.js");

// constructor
const Version = function(version) {
  this.id = version.id ,
  this.name = version.name ,
  this.serial_no = version.serial_no,
  this.batch_id = version.batch_id ,
  this.station_id = version.station_id,
  this.current_version_id = version.current_version_id ,
  this.no_of_guns = version.no_of_guns,
  this.Address = version.Address,
  this.Lat = version.Lat,
  this.Lng = version.Lng,
  this.OTA_Config = version.OTA_Config,
  this.Periodic_Check_Ref_Time = version.Periodic_Check_Ref_Time,
  this.Periodicity_in_hours = version.Periodicity_in_hours,
  this.When_to_Upgrade = version.When_to_Upgrade,
  this.Upgrade_Specific_Time = version.Upgrade_Specific_Time,
  this.is_available = version.is_available,
  this.status = version.status ,
  this.created_date = version.created_date ,
  this.created_by = version.created_by,
  this.modify_date = version.modify_date ,
  this.modify_by = version.modify_by
};

const _TABLE = 'version_mst';

Version.create = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `insert into ${_TABLE} (serial_no,name,batch_id,station_id,
    current_version_id,no_of_guns,Address,Lat,Lng,
    OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
    When_to_Upgrade,Upgrade_Specific_Time,is_available,
    status,created_date,createdby )
    VALUES ('${newCharger.serial_no}','${newCharger.name}',${newCharger.batch_id},${newCharger.station_id},
    ${newCharger.current_version_id},${newCharger.no_of_guns},'${newCharger.Address}',${newCharger.Lat},${newCharger.Lng},
    '${newCharger.OTA_Config}','${newCharger.Periodic_Check_Ref_Time}',${newCharger.Periodicity_in_hours},
    '${newCharger.When_to_Upgrade}','${newCharger.Upgrade_Specific_Time}',${is_available},
    '${newCharger.status}','${datetime.toISOString().slice(0,10)}',${newCharger.created_by}) `;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newCharger });
  });
};

Version.update = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `update ${_TABLE} set 
  serial_no = '${newCharger.serial_no}', name = '${newCharger.name}',batch_id = ${newCharger.batch_id},
  station_id = ${newCharger.station_id}, current_version_id = ${newCharger.current_version_id} ,
  no_of_guns = ${newCharger.no_of_guns}, Address='${newCharger.Address}',
  Lat = ${newCharger.Lat}, Lng = ${newCharger.Lng},OTA_Config = '${newCharger.OTA_Config}',
  Periodic_Check_Ref_Time = '${newCharger.Periodic_Check_Ref_Time}',Periodicity_in_hours = ${newCharger.Periodicity_in_hours},
  When_to_Upgrade = '${newCharger.When_to_Upgrade}',Upgrade_Specific_Time = '${newCharger.Upgrade_Specific_Time}',
  is_available = ${newCharger.is_available},
  status = '${newCharger.status}',modifyby = ${newCharger.modify_by},modify_date = '${datetime.toISOString().slice(0,10)}' 
  where id =  ${newCharger.id}`;

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newCharger });
  });
};

Version.getVersions = () => {
  const stmt = `
    SELECT id, name, description,
      status, created_date, createdby, modifyby, modify_date
    FROM ${_TABLE}
    WHERE status <> 'D'
    ORDER BY id DESC
  `;

  return new Promise((resolve, reject) => {
    sql.query(stmt, (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length) {
        return resolve(results);
      } else {
        return reject({ kind: "not_found" });
      }
    });
  });
};


  

  Version.getVersionById = (id, result) => {

    let stmt = `select id, serial_no,name,batch_id,station_id,
      current_version_id,no_of_guns,Address,Lat,Lng,
      OTA_Config,Periodic_Check_Ref_Time,Periodicity_in_hours,
      When_to_Upgrade,Upgrade_Specific_Time,is_available,status,created_date,createdby,modifyby,modify_date
      from ${_TABLE}
      WHERE id = ?`;
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

  Version.delete = (id, result) => {

    let stmt = `Update ${_TABLE} set status = 'D' WHERE id = ?`;
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
  Version: Version
};