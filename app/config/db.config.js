

//--21-04-2025-main api DB--Development DB
let msMain = {


// HOST: "database-1.c9ws6aq42w98.ap-south-1.rds.amazonaws.com",
// USER: "admin",
// PASSWORD: "Belectriq##$$%%##",
// DB: "cms_belectriq",
// PORT : 3306

// HOST: "localhost",
// USER: "root",
// PASSWORD: "Nitin12345.",   
// DB: "cms_belectriq_test",
// PORT : 3306
HOST: "aws-benz-mysql-database.cvymaesqwh1j.ap-south-1.rds.amazonaws.com",
USER: "admin",
PASSWORD: "Cubenzpower##$$%%##",
DB: "cubenz_cms",
PORT : 3306
}


//-21-04-2025-Postgres Logs DB--Development DB for Aiven
let pgPool = {

 user: "postgres",
    host: "cubenzpgadmin-1.cvymaesqwh1j.ap-south-1.rds.amazonaws.com",
    database: "postgres",
    password: "cubenz#$#$%&%&",
    port: 5432,
    multipleStatements : true,
    ssl: { rejectUnauthorized: false }
}

module.exports = {
  msMain,pgPool
};
