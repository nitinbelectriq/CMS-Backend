const { sql, pool } = require('./db.js');

const ChargerModelType = function(modelType) {
  this.id = modelType.id;
  this.name = modelType.name;
  this.description = modelType.description;
  this.status = modelType.status;
  this.created_date = modelType.created_date;
  this.createdby = modelType.createdby;
  this.modify_date = modelType.modify_date;
  this.modifyby = modelType.modifyby;
};

ChargerModelType.getAll = async () => {
  const stmt = `
    SELECT id, name, description, status, created_date, createdby
    FROM charger_model_type_mst
    WHERE status <> 'D'
    ORDER BY id DESC
  `;

  const rows = await pool.query(stmt);
  return rows;
};

module.exports = ChargerModelType;
