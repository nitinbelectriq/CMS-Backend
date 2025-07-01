const { sql, pool } = require("./db.js");

const IoType = function(ioType) {
  this.id = ioType.id;
  this.name = ioType.name;
  this.description = ioType.description;
  this.status = ioType.status;
  this.created_date = ioType.created_date;
  this.createdby = ioType.createdby;
  this.modify_date = ioType.modify_date;
  this.modifyby = ioType.modifyby;
};

IoType.getAll = async () => {
  const stmt = `
    SELECT * FROM io_type_mst
    WHERE status <> 'D'
    ORDER BY id DESC
  `;

  const rows = await pool.query(stmt);

  if (!rows.length) {
    const error = new Error("Not found");
    error.kind = "not_found";
    throw error;
  }

  return rows;
};

module.exports = IoType;
