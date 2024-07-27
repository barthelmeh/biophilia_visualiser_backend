type TimeframeCreate = {
    sessionId: number,
    description: string,
    startTime: string,
    endTime: string
}

type TimeframeUpdate = {
    id: number,
    sessionId?: number,
    description?: string,
    startTime?: string,
    endTime?: string
}

type Timeframe = TimeframeCreate & {
    id: number
}