type ParticipantRegister = {
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    gender: string,
    activityLevel: string,
}

type Participant = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    gender: import('../constants').gender,
    activityLevel: import('../constants').activityLevel,
    hasAcceptedTerms: boolean
}

type ParticipantUpdate = {
    id: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    age?: number,
    gender?: import('../constants').gender,
    activityLevel?: import('../constants').activityLevel,
    hasAcceptedTerms?: boolean
}