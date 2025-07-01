const { sql, pool } = require("./db.js");

const CurrentType = function(currentType) {
  this.id = currentType.id;
  this.name = currentType.name;
  this.description = currentType.description;
  this.status = currentType.status;
  this.created_date = currentType.created_date;
  this.createdby = currentType.createdby;
  this.modify_date = currentType.modify_date;
  this.modifyby = currentType.modifyby;
};

CurrentType.getAll = async () => {
    
  const stmt = `SELECT * FROM current_type_mst WHERE status <> 'D' ORDER BY id DESC`;

  const rows = await pool.query(stmt);

  if (!rows.length) {
    const error = new Error("Not found");
    error.kind = "not_found";
    throw error;
  }

  return rows;
};

module.exports = CurrentType;
