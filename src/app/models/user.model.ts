import { getPool } from "../../config/db";
import sql from 'mssql';

// Administrator login
const login = async (id: number, token: string): Promise<number[]> => {
    // TODO: Update query to reflect schema
    const query = `UPDATE administrator SET auth_token = ? WHERE id = @id`;
    const result = await getPool().request()
        .input('id', sql.Int, id)
        .input('token', sql.NVarChar, token)
        .query(query);
    return result.rowsAffected;
}

// Administrator logout
const logout = async (id: number): Promise<number[]> => {
    const query = `UPDATE administrator SET auth_token = NULL WHERE id = @id`;
    const result = await getPool().request()
        .input('id', sql.Int, id)
        .query(query);
    return result.rowsAffected;
}

const getAllParticipants = async (): Promise<number[]> => {
    const query = `SELECT * FROM participant`;
    const result = await getPool().request().query(query);
    return result.rowsAffected;
}

export { login, logout, getAllParticipants }
