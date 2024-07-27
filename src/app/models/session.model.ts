import { getPool } from "../../config/db";
import sql from 'mssql';

// Create a new Session
const createSession = async (session: SessionCreate): Promise<number> => {

    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Create the session
        const query = `
            INSERT INTO Session (ParticipantId, Name, StartTime, EndTime)
            VALUES (@ParticipantId, @Name, @Start, @End);
            SELECT SCOPE_IDENTITY() as id;
        `;

        const sessionResult = await transaction.request()
            .input('ParticipantId', session.participantId)
            .input('Name', session.name)
            .input('Start', session.start)
            .input('End', session.end)
            .query(query);

        if (sessionResult.recordset.length === 0) {
            await transaction.rollback();
            return 0;
        }

        const newSessionId = sessionResult.recordset[0].id as number;

        // Insert the data
        const insertDataQuery = `
            INSERT INTO Data (SessionID, Value, RecordedTime)
            VALUES (@SessionId, @Value, @RecordedTime);
        `;

        for (const data of session.data) {
            await transaction.request()
                .input('SessionId', newSessionId)
                .input('Value', data.value)
                .input('RecordedTime', data.time)
                .query(insertDataQuery);
        }

        await transaction.commit();
        return newSessionId;

    } catch (err) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        return 0;
    }

}

// Get one session by its id
const getSessionById = async (sessionId: number): Promise<Session | null> => {
    const query = `
    SELECT
        s.Id as sessionId,
        s.ParticipantID as participantId,
        s.Name as sessionName,
        s.StartTime as sessionStart,
        s.EndTime as sessionEnd,
        d.Id as dataId,
        d.Value as dataValue,
        d.RecordedTime as dataRecordedTime
    FROM Session s
    LEFT JOIN Data d ON s.Id = d.SessionID
    WHERE s.Id = @id
    `;
    const result = await getPool().request()
        .input('id', sessionId)
        .query(query);

    if(result.recordset.length === 0) {
        return null;
    }

    const row = result.recordset[0];
    const session: Session = {
        id: row.sessionId as number,
        participantId: row.participantId,
        name: row.sessionName,
        start: row.sessionStart,
        end: row.sessionEnd,
        data: result.recordset.map((dataRow) => ({id: dataRow.dataId, value: dataRow.dataValue, time: dataRow.dataRecordedTime}))

    };

    return session;
}


// Delete session
const deleteSession = async (sessionId: number): Promise<number> => {

    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Delete associated data first
        const deleteDataQuery = `DELETE FROM Data WHERE SessionId = @sessionId`;
        await transaction.request()
            .input('sessionId', sessionId)
            .query(deleteDataQuery);

        // Delete the session
        const deleteSessionQuery = `DELETE FROM Session WHERE Id = @id`;
        const sessionResult = await transaction.request()
            .input('id', sessionId)
            .query(deleteSessionQuery);

        await transaction.commit();
        return sessionResult.rowsAffected[0];

    } catch (err) {
        await transaction.rollback();
        return 0;
    }
}

export { createSession, getSessionById, deleteSession }