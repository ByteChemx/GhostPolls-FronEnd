import { Poll, RawPoll } from '@/types'

export function formatPoll(raw: RawPoll): Poll {
    return {
        question: raw[0],
        options: raw[1],
        votes: raw[2].map((v) => Number(v)),
        pollType: Number(raw[3]) === 0 ? 'Public' : 'Anonymous',
        creator: raw[4],
        isActive: raw[5],
        deadline: Number(raw[6]),
    }
}
