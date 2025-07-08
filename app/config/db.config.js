

//--21-04-2025-main api DB--Development DB
let msMain = {


HOST: "database-1.c9ws6aq42w98.ap-south-1.rds.amazonaws.com",
USER: "admin",
PASSWORD: "Belectriq##$$%%##",
DB: "cms_belectriq",
PORT : 3306
}


//-21-04-2025-Postgres Logs DB--Development DB for Aiven
let pgPool = {

  HOST: "belectriq-database-2.c9ws6aq42w98.ap-south-1.rds.amazonaws.com", // private IP  
  USER: "postgres",
  PASSWORD: "Belectriq##$$%%##",
  DB: "cms_belectriq",
  PORT: 5432,
  ssl: true,
  multipleStatements : true
}

module.exports = {
  msMain,pgPool
};
