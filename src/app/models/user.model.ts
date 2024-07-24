import { getPool } from "../../config/db";
import sql from 'mssql';

const register = async (participant: ParticipantRegister): Promise<number[]> => {
    const query = `
        INSERT INTO Participant (FirstName, LastName, Email, Age, ActivityLevel, HasAcceptedTerms)
        VALUES (@FirstName, @LastName, @Email, @Age, @ActivityLevel, @HasAcceptedTerms)
    `;
    const result = await getPool().request()
        .input('FirstName', participant.firstName)
        .input('LastName', participant.lastName)
        .input('Email', participant.email)
        .input('Age', participant.age)
        .input('ActivityLevel', participant.activityLevel)
        .input('HasAcceptedTerms', participant.hasAcceptedTerms)
        .query(query);
    return result.rowsAffected;
}

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

// Administrator login
const login = async (id: number, token: string): Promise<number[]> => {
    // TODO: Update query to reflect schema
    const query = `UPDATE Administrator SET Token = @token WHERE Id = @id`;
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

// const getParticipant = async (id: number): Promise<Participant | null> => {
//     const query = `SELECT * FROM participant WHERE id = @id`;
//     const result = await getPool().request()
//         .input('id', sql.Int, id)
//         .query(query);

//     // No participant found with ID
//     if (result.recordset.length == 0) {
//         return null
//     }

//     const row = result.recordset[0];
//     const participant: Participant = {
//         id: row.id,
//         firstName: row.first_name,
//         lastName: row.last_name,
//         email: row.email,
//         age: row.age,

//     }
//     return participant;
// }

export { register, getAdministratorByUsername, login, logout }