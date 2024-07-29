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
        .input('id', id)
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

const deleteParticipant = async (participantId: number): Promise<number | null> => {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Delete all data associated with sessions of the participant
        const deleteDataQuery = `
            DELETE FROM Data
            WHERE SessionID IN (
                SELECT Id FROM Session WHERE ParticipantID = @participantId
            );
        `;
        await transaction.request()
            .input('participantId', participantId)
            .query(deleteDataQuery);

        // Delete all timeframes of the sessions of the participant
        const deleteTimeframesQuery = `
            DELETE FROM Timeframe
            WHERE SessionID IN (
                SELECT Id FROM Session WHERE ParticipantID = @participantId
            );
        `;
        await transaction.request()
            .input('participantId', participantId)
            .query(deleteTimeframesQuery);

        // Delete all sessions of the participant
        const deleteSessionsQuery = `
            DELETE FROM Session WHERE ParticipantID = @participantId;
        `;
        await transaction.request()
            .input('participantId', participantId)
            .query(deleteSessionsQuery);

        // Delete the participant
        const deleteParticipantQuery = `
            DELETE FROM Participant WHERE Id = @id;
        `;
        const participantResult = await transaction.request()
            .input('id', participantId)
            .query(deleteParticipantQuery);

        await transaction.commit();
        return participantResult.rowsAffected[0];

    } catch (err) {
        await transaction.rollback();
        return null;
    }
};

export { registerParticipant, getAllParticipants, getParticipant, deleteParticipant }
