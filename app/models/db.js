const mysql = require('mysql2');
const util = require('util');
const dbConfig = require("../config/db.config.js");
const { Pool } = require('pg');

// MySQL connection
const connection = mysql.createConnection({
  host: dbConfig.msMain.HOST,
  user: dbConfig.msMain.USER,
  password: dbConfig.msMain.PASSWORD,
  database: dbConfig.msMain.DB,
  port: dbConfig.msMain.PORT,
  multipleStatements: true
});

const pool = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.msMain.HOST,
  user: dbConfig.msMain.USER,
  password: dbConfig.msMain.PASSWORD,
  database: dbConfig.msMain.DB,
  port: dbConfig.msMain.PORT,
  multipleStatements: true
});

// PostgreSQL connection
const poolPG = new Pool({
  user: dbConfig.pgPool.USER,
  host: dbConfig.pgPool.HOST,
  database: dbConfig.pgPool.DB,
  password: dbConfig.pgPool.PASSWORD,
  port: dbConfig.pgPool.PORT,
  ssl: dbConfig.pgPool.ssl,
  statement_timeout: 0
});

// Promisify MySQL
pool.query = util.promisify(pool.query);

connection.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err.message);
  } else {
    console.log('Connected to MySQL Server!');
  }
});

module.exports = {
  sql: connection,
  pool,
  poolPG
};
