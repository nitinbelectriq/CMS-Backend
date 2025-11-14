

//--21-04-2025-main api DB--Development DB
 let msMain = {
HOST: "116.203.172.166",
USER: "root",
PASSWORD: "Belectriq##$$%%##",
DB: "belectriq_cms",
PORT : 3306
}


//-21-04-2025-Postgres Logs DB--Development DB for Aiven
let pgPool = {

user: "postgres",
    host: "116.203.172.166",
    database: "belectriq_chargerlog",
    password: "Techmates@123",
    port: 5432,
    multipleStatements : true,
    ssl: { rejectUnauthorized: false }
}

module.exports = {
  msMain,pgPool
};
