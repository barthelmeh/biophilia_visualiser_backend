import { getPool } from "../../config/db";
import sql from 'mssql';

const createTimeframe = async (timeframe: TimeframeCreate): Promise<number | null> => {
    const query = `
            INSERT INTO Timeframe (SessionID, Description, StartTime, EndTime)
            VALUES (@SessionID, @Description, @StartTime, @EndTime);
            SELECT SCOPE_IDENTITY() as id;`;
    const result = await getPool().request()
        .input('SessionID', timeframe.sessionId)
        .input('Description', timeframe.description)
        .input('StartTime', timeframe.startTime)
        .input('EndTime', timeframe.endTime)
        .query(query);

    if(result.recordset.length > 0) {
        return result.recordset[0].id as number;
    }
    return null;
}

const doesTimeframeOverlap = async (timeframe: TimeframeCreate): Promise<boolean> => {
    // Make sure there are no overlaps
    const overlapCheckQuery = `
        SELECT 1
        FROM Timeframe
        WHERE SessionID = @SessionID
        AND (
            (@StartTime <= EndTime AND @EndTime >= StartTime)
        );`;

    const overlapResult = await getPool().request()
        .input('SessionID', timeframe.sessionId)
        .input('StartTime', timeframe.startTime)
        .input('EndTime', timeframe.endTime)
        .query(overlapCheckQuery);

    return overlapResult.recordset.length <= 0;
}

const deleteTimeframe = async (timeframeId: number): Promise<number> => {
    const query = `DELETE FROM Timeframe WHERE Id = @id`;
    const result = await getPool().request()
        .input('id', timeframeId)
        .query(query);
    return result.rowsAffected[0];
}

const updateTimeframe = async (updatedTimeframe: TimeframeUpdate): Promise<number> => {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Build the set clause using the provided params
        const updateFields = [];
        const params = [];

        if(updatedTimeframe.sessionId) {
            updateFields.push(`[SessionID] = @sessionId`);
            params.push({ name: 'sessionId', value: updatedTimeframe.sessionId });
        }

        if(updatedTimeframe.startTime) {
            updateFields.push(`[StartTime] = @startTime`);
            params.push({ name: 'startTime', value: updatedTimeframe.startTime });
        }

        if (updatedTimeframe.endTime) {
            updateFields.push(`[EndTime] = @endTime`);
            params.push({ name: 'endTime', value: updatedTimeframe.endTime });
        }

        if (updatedTimeframe.description) {
            updateFields.push(`[Description] = @description`);
            params.push({ name: 'description', value: updatedTimeframe.description });
        }

        if(updateFields.length === 0) {
            return 0;
        }

        const query = `
            UPDATE Timeframe
            SET ${updateFields.join(', ')}
            WHERE Id = @id;
        `;

        const request = transaction.request();
        params.forEach(param => request.input(param.name, param.value));

        // Add the id of the timeframe
        request.input('id', updatedTimeframe.id);

        const result = await request.query(query);
        await transaction.commit();

        return result.rowsAffected[0];

    } catch (err) {
        await transaction.rollback();
        return 0;
    }
}

export { createTimeframe, doesTimeframeOverlap, deleteTimeframe, updateTimeframe }