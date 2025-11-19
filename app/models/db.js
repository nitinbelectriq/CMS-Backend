// db.connection.js
const mysql = require('mysql2');
const util = require('util');
const { Pool } = require('pg');
const dbConfig = require('../config/db.config.js');

// -------------------- MySQL Single Connection --------------------
const connection = mysql.createConnection({
  host: dbConfig.mysqlMain.host,
  user: dbConfig.mysqlMain.user,
  password: dbConfig.mysqlMain.password,
  database: dbConfig.mysqlMain.database,
  port: dbConfig.mysqlMain.port,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL Server!');
});

// -------------------- MySQL Pool --------------------
const pool = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.mysqlMain.host,
  user: dbConfig.mysqlMain.user,
  password: dbConfig.mysqlMain.password,
  database: dbConfig.mysqlMain.database,
  port: dbConfig.mysqlMain.port,
  multipleStatements: true
});

// Promisify pool queries for async/await
pool.query = util.promisify(pool.query);

// -------------------- PostgreSQL Pool --------------------
const poolPG = new Pool({
  user: String(dbConfig.postgresLogs.user),       // ensure string
  host: dbConfig.postgresLogs.host,
  database: dbConfig.postgresLogs.database,
  password: String(dbConfig.postgresLogs.password), // ensure string
  port: dbConfig.postgresLogs.port,
  ssl:  false
});

poolPG.connect()
  .then(() => console.log('Connected to PostgreSQL Server!'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// -------------------- Export --------------------
module.exports = {
  sql: connection,   // MySQL single connection
  pool,             // MySQL pool
  poolPG            // PostgreSQL pool
};
