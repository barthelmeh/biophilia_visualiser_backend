import { getPool } from "../../config/db";
import sql from 'mssql';

// Create a new Session
const createSession = async (session: SessionCreate): Promise<number | null> => {

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
            .input('Start', session.startTime)
            .input('End', session.endTime)
            .query(query);

        if (sessionResult.recordset.length === 0) {
            await transaction.rollback();
            return null;
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
        return null;
    }

}

// Get one session by its id
const getSessionById = async (sessionId: number): Promise<Session | null> => {
    // Get the session and data
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
    LEFT JOIN Timeframe t ON s.Id = t.SessionID
    WHERE s.Id = @id
    `;
    const sessionResult = await getPool().request()
        .input('id', sessionId)
        .query(query);

    if(sessionResult.recordset.length === 0) {
        return null;
    }

    const row = sessionResult.recordset[0];
    let session: Session = {
        id: row.sessionId as number,
        participantId: row.participantId,
        name: row.sessionName,
        start: row.sessionStart,
        end: row.sessionEnd,
        data: sessionResult.recordset.map((dataRow) => ({id: dataRow.dataId, value: dataRow.dataValue, time: dataRow.dataRecordedTime})),
    };

    // Get the timeframes for the given session
    const getTimeframeQuery = `
    SELECT
        t.Id as id,
        t.SessionID as sessionId,
        t.Description as description,
        t.StartTime as startTime,
        t.EndTime as endTime
    FROM Session s
    JOIN Timeframe t ON s.Id = t.SessionID
    WHERE s.Id = @id;
    `;
    const timeframeResult = await getPool().request()
        .input('id', sessionId)
        .query(getTimeframeQuery);

    if(timeframeResult.recordset.length > 0) {

        // Add the timeframes to the session object
        session = {...session,
            timeframes: timeframeResult.recordset.map((timeframeRow) => ({
                id: timeframeRow.id,
                sessionId: timeframeRow.sessionId,
                description: timeframeRow.description,
                startTime: timeframeRow.startTime,
                endTime: timeframeRow.endTime
            }))
        }
    }

    return session;
}


// Delete session
const deleteSession = async (sessionId: number): Promise<number> => {

    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Delete associated data first
        const deleteDataQuery = `DELETE FROM Data WHERE SessionID = @sessionId`;
        await transaction.request()
            .input('sessionId', sessionId)
            .query(deleteDataQuery);

        // Delete timeframes
        const deleteTimeframesQuery = `DELETE FROM Timeframe WHERE SessionID = @sessionId`;
        await transaction.request()
            .input('sessionId', sessionId)
            .query(deleteTimeframesQuery);

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