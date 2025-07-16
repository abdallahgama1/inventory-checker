import sql from "mssql";

const sqlConfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: false, // if using SQL Server 2008
        trustServerCertificate: true,
    },
};
