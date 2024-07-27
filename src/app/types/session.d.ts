type SessionCreate = {
    participantId: number,
    name: string,
    start: string,
    end: string,
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