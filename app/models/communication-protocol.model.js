const { sql, pool } = require("./db.js");

// constructor
const CommunicationProtocol = function (commprotocol) {
  this.id = commprotocol.id;
  this.name = commprotocol.name;
  this.description = commprotocol.description;
  this.status = commprotocol.status;
  this.created_date = commprotocol.created_date;
  this.createdby = commprotocol.createdby;
  this.modify_date = commprotocol.modify_date;
  this.modifyby = commprotocol.modifyby;
};

CommunicationProtocol.getAll = async () => {
  const stmt = `
    SELECT id, name, description, status, created_date, createdby
    FROM communication_protocol_mst
    WHERE status <> 'D'
    ORDER BY id DESC
  `;
  const [rows] = await pool.query(stmt);
  return rows;
};

module.exports = CommunicationProtocol;
