require('dotenv').config();

let msMain = {
  HOST: process.env.MYSQL_HOST,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DB: process.env.MYSQL_DB,
  PORT: process.env.MYSQL_PORT
};

let pgPool = {
  HOST: process.env.PG_HOST,
  USER: process.env.PG_USER,
  PASSWORD: process.env.PG_PASSWORD,
  DB: process.env.PG_DB,
  PORT: process.env.PG_PORT,
  ssl: process.env.PG_SSL === 'true',
  multipleStatements: true
};

module.exports = {
  msMain,
  pgPool
};
