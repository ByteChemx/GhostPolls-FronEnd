import { useDappStore } from '@/store'
import { Dialog, DialogPanel } from '@headlessui/react'
import { TriangleAlert } from 'lucide-react'
import { Chart } from 'react-google-charts'

export default function VoteResults() {
    const selectedPoll = useDappStore((state) => state.selectedPoll)

    const isVoteResultModalOpen = useDappStore(
        (state) => state.isVoteResultModalOpen
    )
    const setVoteResultModalOpen = useDappStore(
        (state) => state.setVoteResultModalOpen
    )

    const data: (string | number)[][] = [['Options', 'Votes']]

    selectedPoll?.options.forEach((option, index) => {
        data.push([option, selectedPoll.votes[index]])
    })

    const totalVotes = selectedPoll?.votes.reduce((sum, val) => sum + val, 0)

    const options = {
        titleTextStyle: {
            color: '#ffffff',
            fontSize: 18,
            bold: true,
        },
        legend: {
            position: 'bottom',
            textStyle: { color: '#ffffff', fontSize: 14 },
        },
        colors: ['#4ade80', '#f87171'],
        hAxis: {
            textStyle: { color: '#ffffff' },
        },
        vAxis: {
            textStyle: { color: '#ffffff' },
        },
    }

    return (
        <Dialog
            open={isVoteResultModalOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => setVoteResultModalOpen(false)}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full backdrop-blur-xs items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="rounded-lg w-fit min-h-[10rem] min-w-[25rem] bg-[var(--card)] border border-[var(--border-color)] p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <div className="flex flex-col gap-2.5">
                            <h3 className="text-lg font-geist-mono mb-2">
                                {selectedPoll?.question} ?
                            </h3>
                            {totalVotes === 0 ? (
                                <div className="flex flex-col items-center gap-4 text-gray-400 font-geist-mono">
                                    <TriangleAlert
                                        size={50}
                                        className="text-red-500"
                                    />
                                    No votes for this poll
                                </div>
                            ) : (
                                <>
                                    <h4 className="font-geist-mono text-sm">
                                        Poll results:
                                    </h4>
                                    <div className="max-w-md mx-auto">
                                        <Chart
                                            chartType="PieChart"
                                            width="100%"
                                            height="300px"
                                            data={data}
                                            options={{
                                                ...options,
                                                pieHole: 0.4, // si quieres un donut chart
                                                backgroundColor: '#1e1e1e',
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
