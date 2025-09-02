

//--21-04-2025-main api DB--Development DB
 let msMain = {
HOST: "belectriq-cms-database-1-instance-1.cgdyye6ya8ia.us-east-1.rds.amazonaws.com",
USER: "admin",
PASSWORD: "Belectriq##$$%%##",
DB: "belectriq_cms",
PORT : 3306
}


//-21-04-2025-Postgres Logs DB--Development DB for Aiven
let pgPool = {

user: "belectriq",
    host: "cms-belectriqpgadmin-database-1.cgdyye6ya8ia.us-east-1.rds.amazonaws.com",
    database: "belectriq_chargerlog",
    password: "Belectriq##$$%%##",
    port: 5432,
    multipleStatements : true,
    ssl: { rejectUnauthorized: false }
}

module.exports = {
  msMain,pgPool
};
