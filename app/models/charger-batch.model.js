const {sql,pool} = require("./db.js");

const ChargerBatch = function(chargerBatch) {
  this.id = chargerBatch.id ,
  this.name = chargerBatch.name ,
  this.description = chargerBatch.description,
  this.batch_no = chargerBatch.batch_no ,
  this.client_id = chargerBatch.client_id,
  this.model_id = chargerBatch.model_id ,
  this.status = chargerBatch.status ,
  this.created_date = chargerBatch.created_date ,
  this.created_by = chargerBatch.created_by,
  this.modify_date = chargerBatch.modify_date ,
  this.modify_by = chargerBatch.modify_by
};

const _TABLE = 'charger_batch_mst';

ChargerBatch.create = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `insert into ${_TABLE} (name,description,batch_no,client_id,model_id,
    status,created_date,createdby )
    VALUES ('${newCharger.name}','${newCharger.description}','${newCharger.batch_no}',
    ${newCharger.client_id},${newCharger.model_id},
    '${newCharger.status}','${datetime.toISOString().slice(0,10)}',${newCharger.created_by}) `;

    

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newCharger });
  });
};

ChargerBatch.update = (newCharger, result) => {
  var datetime = new Date();

  let stmt = `update ${_TABLE} set 
   name = '${newCharger.name}',description = '${newCharger.description}',
  batch_no = '${newCharger.batch_no}', client_id = ${newCharger.client_id} ,
  model_id = ${newCharger.model_id},
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

ChargerBatch.getChargerBatches = result => {

    let stmt = `select id, name,description,batch_no,client_id,model_id,
      status,created_date,createdby,modifyby,modify_date
      from ${_TABLE}
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


  ChargerBatch.getChargerBatchById = (id, result) => {

    let stmt = `select id, name,description,batch_no,client_id,model_id,
      status,created_date,createdby,modifyby,modify_date
      from ${_TABLE}
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

  ChargerBatch.delete = (id, result) => {

    let stmt = `Update ${_TABLE} set status = 'D' WHERE id = ?`;
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

module.exports = {
  ChargerBatch: ChargerBatch
};