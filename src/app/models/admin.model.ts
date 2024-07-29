import { getPool } from "../../config/db";

const getAdministratorByUsername = async (username: string): Promise<Administrator | null> => {
    const query = `SELECT Id as id, Username as username, Password as password, Token as token FROM Administrator WHERE username = @username`;
    const result = await getPool().request()
        .input('username', username)
        .query(query);

    if(result.recordset.length > 0) {
        return result.recordset[0] as Administrator;
    }
    return null;
}

const getAdministratorByToken = async (token: string): Promise<Administrator | null> => {
    const query = `SELECT Id as id, Username as username, Password as password, Token as token FROM Administrator WHERE token = @token`;
    const result = await getPool().request()
        .input('token', token)
        .query(query);

    if(result.recordset.length > 0) {
        return result.recordset[0] as Administrator;
    }
    return null;
}

// Administrator login
const login = async (id: number, token: string): Promise<number> => {
    // TODO: Update query to reflect schema
    const query = `UPDATE Administrator SET Token = @token WHERE Id = @id`;
    const result = await getPool().request()
        .input('id', id)
        .input('token', token)
        .query(query);
    return result.rowsAffected[0];
}

// Administrator logout
const logout = async (id: number): Promise<number> => {
    const query = `UPDATE administrator SET Token = NULL WHERE id = @id`;
    const result = await getPool().request()
        .input('id', id)
        .query(query);
    return result.rowsAffected[0];
}

export { login, logout, getAdministratorByToken, getAdministratorByUsername }