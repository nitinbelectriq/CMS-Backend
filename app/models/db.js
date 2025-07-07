const mysql = require('mysql2');
const util = require('util');
const dbConfig = require("../config/db.config.js");
const Pool = require('pg').Pool;



const connection = mysql.createConnection({
  host: dbConfig.msMain.HOST,
  user: dbConfig.msMain.USER,
  password: dbConfig.msMain.PASSWORD,
  database: dbConfig.msMain.DB,
  port : dbConfig.msMain.PORT,
  multipleStatements : true
});


const pool = mysql.createPool({
  connectionLimit : 100, //important
  host: dbConfig.msMain.HOST,
  user: dbConfig.msMain.USER,
  password: dbConfig.msMain.PASSWORD,
  database: dbConfig.msMain.DB,
  port : dbConfig.msMain.PORT,
  multipleStatements : true
});

// const poolMG = mysql.createPool({
//   connectionLimit : 100, //important
//   host: dbConfig.msMGBLE.HOST,
//   user: dbConfig.msMGBLE.USER,
//   password: dbConfig.msMGBLE.PASSWORD,
//   database: dbConfig.msMGBLE.DB,
//   port : dbConfig.msMGBLE.PORT,
//   multipleStatements : true
// });


const poolPG = new Pool({
  user: dbConfig.pgPool.USER,
  host: dbConfig.pgPool.HOST,
  database: dbConfig.pgPool.DB,
  password: dbConfig.pgPool.PASSWORD,
  port: dbConfig.pgPool.PORT,
  multipleStatements : true
})


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});
 

pool.query = util.promisify(pool.query);
//poolMG.query = util.promisify(poolMG.query);


//for future use
// pool.getConnection((err, connection) => {
//   console.log('sql connection');
//   if (err) {
//       console.log(err);
//       if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//           console.error('Database connection was closed.');
//       }
//       if (err.code === 'ER_CON_COUNT_ERROR') {
//           console.error('Database has too many connections.');
//       }
//       if (err.code === 'ECONNREFUSED') {
//           console.error('Database connection was refused.');
//       }
//   }

//   if (connection) connection.release();

//   return
// })


module.exports = {sql : connection,pool,poolPG};

