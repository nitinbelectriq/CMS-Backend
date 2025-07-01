const {sql,pool} = require("./db.js");

const ChargerType = function(chargerType) {
  this.id = chargerType.id ,
  this.name = chargerType.name ,
  this.description = chargerType.description,
  this.status = chargerType.status ,
  this.created_date = chargerType.created_date ,
  this.created_by = chargerType.created_by,
  this.modify_date = chargerType.modify_date ,
  this.modify_by = chargerType.modify_by
};

ChargerType.create = (newCharger, result) => {
  const datetime = new Date();

  const stmt = `
    INSERT INTO charger_type_mst (name, description, status, created_date, createdby )
    VALUES(?, ?, ?, ?, ?)
  `;
  
  const values = [
    newCharger.name,
    newCharger.description,
    newCharger.status,
    datetime.toISOString().slice(0, 10),
    newCharger.created_by
  ];

  sql.query(stmt, values, (err, res) => {
    if (err) {
      console.error("Error executing insert:", err);
      return result(err, null);
    }
    result(null, { id: res.insertId, ...newCharger });
  });
};

ChargerType.update = (newCharger, result) => {
  const datetime = new Date();
  const modifyDate = datetime.toISOString().slice(0, 10);
  
  const stmt = `
    UPDATE charger_type_mst
    SET name = ?, description = ?, status = ?, modifyby = ?, modify_date = ?
    WHERE id = ?
  `;
  
  const params = [
    newCharger.name,
    newCharger.description,
    newCharger.status,
    newCharger.modify_by,
    modifyDate,
    newCharger.id
  ];

  sql.query(stmt, params, (err, res) => {
    if (err) {
      console.error('MySQL Error during Update!', err);
      return result(err, null);
    }
    result(null, { id: newCharger.id, ...newCharger });
  });
};




ChargerType.getChargerTypes = result => {

    let stmt = `select id,  name,description,status,created_date,createdby,modifyby,modify_date
      from charger_type_mst
      where status <> 'D'
      order by id desc`;

      sql.query(stmt, (err, res) => {
          if (err) {
            result(err, null);
            return;
          }

          if (res.length) {
            result(null, res);
            return;
          }

          result({ kind: "not_found" }, null);
        });
  };


ChargerType.getActiveChargerTypes = async () => {
  const query = `
    SELECT id, name, description, status, created_date, createdby, modifyby, modify_date
    FROM charger_type_mst
    WHERE status = 'Y'
    ORDER BY id DESC
  `;

  const rows = await pool.query(query); // assuming pool.query returns a promise
  return rows;
};


  ChargerType.getChargerTypeById = (id, result) => {

    let stmt = `select id,  name,description,status,created_date,createdby,modifyby,modify_date
      from charger_type_mst
      WHERE id = ?`;
    sql.query(stmt, id, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
  
      result(null, res);
    });
  };

  ChargerType.delete = (id, modify_by, result) => {
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const stmt = `
    UPDATE charger_type_mst 
    SET status = 'D', modify_date = ?, modifyby = ?
    WHERE id = ?
  `;

  const params = [datetime, modify_by, id];

  sql.query(stmt, params, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};


module.exports = {
  ChargerType: ChargerType
};