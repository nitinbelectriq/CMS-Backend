const {sql,pool} = require("./db.js");


// constructor
const Manufacturer = function (manufacturer) {
    this.id = manufacturer.id,
    this.name = manufacturer.name;
    this.description = manufacturer.description;
    this.status = manufacturer.status;
    this.created_date = manufacturer.created_date;
    this.createdby = manufacturer.createdby;
    this.modify_date = manufacturer.modify_date;
    this.modifyby = manufacturer.modifyby;
};


Manufacturer.getManufacturers = async () => {
  const stmt = `
    SELECT id, name, description, status, created_date, createdby
    FROM manufacturer_mst
    WHERE status <> 'D'
    ORDER BY id DESC
  `;

  const rows = await pool.query(stmt);
  return rows;
};



module.exports = Manufacturer;