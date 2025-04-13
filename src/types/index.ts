// Tipamos la tupla que devuelve getPoll()
// export type NewPollForm

export type RawPoll = [
    question: string,
    options: string[],
    votes: bigint[],
    pollType: number,
    creator: string,
    isActive: boolean,
    deadline: bigint
]

export type Poll = {
    question: string
    options: string[]
    votes: number[]
    pollType: 'Public' | 'Anonymous'
    creator: string
    isActive: boolean
    deadline: number
}

export type NewPollForm = {
    question: string
    options: string[]
    pollType: number
    pollDuration: number
}

export type SelectdPoll = {
    id: number
    question: Poll['question']
    options: Poll['options']
    votes: Poll['votes']
}
