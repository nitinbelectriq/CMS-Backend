// config/db.config.js

// -------------------- MySQL Main DB --------------------
const mysqlMain = {
  host: "116.203.172.166",
  user: "root",
  password: "Belectriq##$$%%##",
  database: "belectriq_cms",
  port: 3307
};

// -------------------- PostgreSQL Logs DB --------------------
const postgresLogs = {
  user: "postgres",
  host: "116.203.172.166",
  database: "belectriq_chargerlog",
  password: "Techmates@123",
  port: 5432,
  ssl:  false  // keep for dev; set true in prod
};

module.exports = {
  mysqlMain,
  postgresLogs
};
