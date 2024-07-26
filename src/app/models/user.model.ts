import { getPool } from "../../config/db";
import sql from 'mssql';
import { convertStringToEnum } from "../utility/enumConverter";
import { gender, activityLevel } from "../constants";

const getAllParticipants = async (): Promise<Participant[] | null> => {
    const query = `SELECT Id as id, FirstName as firstName, LastName as lastName, Email as email, Gender as gender, Age as age, ActivityLevel as activityLevel, HasAcceptedTerms as hasAcceptedTerms
                   FROM Participant`;
    const result = await getPool().request()
        .query(query);

    // No participant found with ID
    if (result.recordset.length === 0) {
        return null;
    }

    const participants: Participant[] = [];

    for(const row of result.recordset) {
        const participant: Participant = {
            id: row.id as number,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            age: row.age,
            gender: convertStringToEnum(gender, row.gender),
            activityLevel: convertStringToEnum(activityLevel, row.activityLevel),
            hasAcceptedTerms: row.hasAcceptedTerms
        };
        participants.push(participant);
    }

    return participants;
}

const getParticipant = async (id: number): Promise<Participant | null> => {
    const query = `SELECT Id as id, FirstName as firstName, LastName as lastName, Email as email, Gender as gender, Age as age, ActivityLevel as activityLevel, HasAcceptedTerms as hasAcceptedTerms
                   FROM Participant WHERE Id = @id`;
    const result = await getPool().request()
        .input('id', sql.Int, id)
        .query(query);

    // No participant found with ID
    if (result.recordset.length === 0) {
        return null;
    }

    const row = result.recordset[0];
    const participant: Participant = {
        id: row.id as number,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        age: row.age,
        gender: convertStringToEnum(gender, row.gender),
        activityLevel: convertStringToEnum(activityLevel, row.activityLevel),
        hasAcceptedTerms: row.hasAcceptedTerms
    };
    return participant;
}

const registerParticipant = async (participant: ParticipantRegister): Promise<number | null> => {
    const query = `
        INSERT INTO Participant (FirstName, LastName, Email, Age, ActivityLevel, Gender, HasAcceptedTerms)
        VALUES (@FirstName, @LastName, @Email, @Age, @ActivityLevel, @Gender, @HasAcceptedTerms);
        SELECT SCOPE_IDENTITY() as id;
    `;
    const result = await getPool().request()
        .input('FirstName', participant.firstName)
        .input('LastName', participant.lastName)
        .input('Email', participant.email)
        .input('Age', participant.age)
        .input('ActivityLevel', participant.activityLevel)
        .input('Gender', participant.gender)
        .input('HasAcceptedTerms', participant.hasAcceptedTerms)
        .query(query);

    if(result.recordset.length > 0) {
        return result.recordset[0].id as number;
    }
    return null;
}

const deleteParticipant = async (id: number): Promise<number[]> => {
    const query = 'DELETE FROM Participant WHERE Id = @id';
    const result = await getPool().request()
        .input('Id', id)
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
    const query = `UPDATE administrator SET Token = NULL WHERE id = @id`;
    const result = await getPool().request()
        .input('id', sql.Int, id)
        .query(query);
    return result.rowsAffected;
}

export { registerParticipant, getAllParticipants, getParticipant, deleteParticipant, getAdministratorByUsername, getAdministratorByToken, login, logout }
