type SessionCreate = {
    participantId: number,
    name: string,
    startTime: string,
    endTime: string,
    data: DataCreate[]
}

type Session = {
    id: number,
    participantId: number,
    name: string,
    start: string,
    end: string,
    data: Data[]

}