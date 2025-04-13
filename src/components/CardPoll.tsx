import { useEffect, useState } from 'react'
import { AlarmClockOff, Ghost, Timer, Volume1 } from 'lucide-react'
import Countdown from 'react-countdown'
import { useDappStore } from '@/store'
import { hasVoted } from '@/services'
import { useWallet } from '@/hooks/useWallet'

type CardPollProps = {
    pollId: number
    question: string
    votes: number[]
    status: boolean
    endtime: number
    options: string[]
    pollType: string
}

export default function CardPoll({
    pollId,
    question,
    votes,
    status,
    endtime,
    options,
    pollType,
}: CardPollProps) {
    const { walletAddress } = useWallet()
    const [hasVotedPoll, setHasVotedPoll] = useState(false)
    const setSelectedPoll = useDappStore((state) => state.setSelectedPoll)
    const setVoteModalOpen = useDappStore((state) => state.setVoteModalOpen)
    const setVoteResultModalOpen = useDappStore(
        (state) => state.setVoteResultModalOpen
    )
    const [finish, setFinish] = useState(false)
    const deadlineMs = endtime * 1000

    const handleOpenVote = () => {
        setSelectedPoll({ id: pollId, question, options, votes })
        setVoteModalOpen(true)
    }

    const handleOpenResults = () => {
        setSelectedPoll({ id: pollId, question, options, votes })
        setVoteResultModalOpen(true)
    }

    useEffect(() => {
        if (walletAddress) {
            const run = async () => {
                const result = await hasVoted({
                    pollId,
                    address: walletAddress,
                })
                setHasVotedPoll(result)
            }

            run()
        }
    }, [pollId, walletAddress])

    return (
        <div className="flex flex-col gap-2 border-[var(--border-color)] bg-[var(--card)] min-h-40 rounded-lg py-2.5 px-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {pollType == 'Anonymous' ? (
                        <>
                            <Ghost
                                size={40}
                                className="bg-[#cecece] rounded-full text-black p-1"
                            />
                            <p className="flex items-center font-geist-mono">
                                Anonymous
                            </p>
                        </>
                    ) : (
                        <>
                            <Ghost
                                size={40}
                                className="bg-[#cecece] rounded-full text-black p-1"
                            />
                            <p className="flex items-center font-geist-mono">
                                <Volume1 />
                                Public
                            </p>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {finish ? <AlarmClockOff size={20} /> : <Timer size={20} />}

                    <h4 className=" text-sm">
                        <Countdown
                            date={deadlineMs}
                            onComplete={() => setFinish(true)}
                            renderer={({ hours, minutes, seconds }) => {
                                if (finish) {
                                    return <span>Closed!</span>
                                } else {
                                    return (
                                        <span>
                                            {hours}:{minutes}:{seconds}{' '}
                                        </span>
                                    )
                                }
                            }}
                        />
                    </h4>
                </div>
            </div>
            <h3 className="flex-grow mt-2 text-lg font-geist-mono">
                {question} ?
            </h3>
            <p className="font-geist-mono text-xs">
                {votes.reduce((count, number) => count + number, 0)} votes
                {' - '}
                {!finish ? 'Active' : 'Inactive'}
                {status}
            </p>
            {!finish ? (
                <button
                    onClick={handleOpenVote}
                    className="bg-[#cecece] rounded py-1.5 px-4 font-geist-mono text-black font-semibold cursor-pointer hover:bg-gray-100 disabled:hover:bg-[#cecece] disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={hasVotedPoll}
                >
                    {hasVotedPoll ? "You can't vote again" : 'Vote'}
                </button>
            ) : (
                <button
                    onClick={handleOpenResults}
                    className="bg-[#cecece] rounded py-1.5 px-4 font-geist-mono text-black font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                    View Results
                </button>
            )}
        </div>
    )
}
