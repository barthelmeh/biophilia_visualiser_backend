import sql from "mssql";
import dotenv from "dotenv";
import Logger from "./logger";

dotenv.config();

interface StateType {
    pool: null | sql.ConnectionPool
}

const state: StateType = {
    pool: null
}

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
        encrypt: true, // For Azure SQL Database
        enableArithAbort: true
    }
};

const connect = async (): Promise<void> => {
    state.pool = await sql.connect(config);
    Logger.info(`Successfully connected to database`)
    return;
};

const getPool = () => {
    return state.pool;
};

export { connect, getPool }