import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SelectdPoll } from './types'

type DappStore = {
    loading: boolean

    setFormPollModalOpen: (state: boolean) => void
    isFormPollModalOpen: boolean

    setVoteModalOpen: (state: boolean) => void
    isVoteModalOpen: boolean

    selectedPoll: SelectdPoll | null
    setSelectedPoll: (poll: SelectdPoll) => void

    setVoteResultModalOpen: (state: boolean) => void
    isVoteResultModalOpen: boolean
}

export const useDappStore = create<DappStore>()(
    devtools((set) => ({
        loading: false,

        isFormPollModalOpen: false,
        setFormPollModalOpen: (state: boolean) => {
            set(() => ({
                isFormPollModalOpen: state,
            }))
        },

        isVoteModalOpen: false,
        setVoteModalOpen: (state: boolean) => {
            set(() => ({
                isVoteModalOpen: state,
            }))
        },

        selectedPoll: null,
        setSelectedPoll: (poll) => set({ selectedPoll: poll }),

        isVoteResultModalOpen: false,
        setVoteResultModalOpen: (state: boolean) => {
            set(() => ({
                isVoteResultModalOpen: state,
            }))
        },
    }))
)
