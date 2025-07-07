

//--21-04-2025-main api DB--Development DB
let msMain = {

// HOST: "localhost",
// USER: "root",
// PASSWORD: "editor",
// DB: "belectriq_cms",
// PORT : 3306

// HOST:"mysql-367fd85f-belectriq-be1a.i.aivencloud.com",
// USER:"avnadmin",
// PASSWORD:"AVNS_Z83CtBY_B5IGk4Bur4-",
// DB:"AivenBelectriq",
// PORT:24048


HOST: "database-1.c9ws6aq42w98.ap-south-1.rds.amazonaws.com",
USER: "admin",
PASSWORD: "Belectriq##$$%%##",
DB: "cms_belectriq",
PORT : 3306
}


//-21-04-2025-Postgres Logs DB--Development DB for Aiven
let pgPool = {
  // HOST: "pg-26f3e5f8-belectriq-be1a.c.aivencloud.com", // private IP  
  // USER: "avnadmin",
  // PASSWORD: "AVNS_qfuof0AwEhqUa5goVON",
  // DB: "belectriqOCPP",
  // PORT: 24048,
  // ssl: true,
  // multipleStatements : true

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
