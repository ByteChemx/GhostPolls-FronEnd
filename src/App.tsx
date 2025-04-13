import { Copyright } from 'lucide-react'
import { Bounce, ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import CardPoll from './components/CardPoll'
import VoteModal from './components/VoteModal'
import VoteResults from './components/VoteResults'
import FormPoll from '@/components/FormPoll'
import { useWallet } from '@/hooks/useWallet'
import { useDappStore } from '@/store'
import { fetchPolls } from '@/services'
import { Poll } from '@/types'

export default function App() {
    const { walletAddress, isChecking, connectWallet } = useWallet()
    const isFormPollModalOpen = useDappStore(
        (state) => state.isFormPollModalOpen
    )
    const setFormPollModalOpen = useDappStore(
        (state) => state.setFormPollModalOpen
    )

    const {
        data: polls,
        isLoading,
        isError,
    } = useQuery<Poll[]>({
        queryKey: ['polls'],
        queryFn: fetchPolls,
    })

    if (isLoading) return <p>Cargando encuestas...</p>
    if (isError) return <p>Error: {isError}</p>

    return (
        <>
            <FormPoll />
            <VoteModal />
            <VoteResults />
            <div className="flex flex-col min-h-screen bg-[var(--background)] bg-noise">
                <header className="bg-noise bg-[#1a1a1a] min-h-14 py-3 px-4">
                    <nav className="max-w-7xl mx-auto flex justify-between items-center">
                        <a href="#">
                            <img
                                src="/logo.png"
                                className="max-w-[100px]"
                                alt="logo"
                            />
                        </a>
                        <button
                            onClick={connectWallet}
                            disabled={!!walletAddress || isChecking}
                            className="font-geist-mono px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded shadow transition duration-200 cursor-pointer"
                        >
                            {walletAddress
                                ? `Connected: ${walletAddress.slice(
                                      0,
                                      6
                                  )}...${walletAddress.slice(-4)}`
                                : 'Connect Wallet'}
                        </button>
                    </nav>
                </header>
                <main className="flex-grow w-full mt-4 px-3 xl:px-0 max-w-7xl mx-auto">
                    <div className="flex items-center gap-5 mb-6">
                        <h2 className="text-xl font-geist-mono">
                            Active Polls
                        </h2>
                        <span>-</span>
                        <button
                            onClick={() =>
                                setFormPollModalOpen(!isFormPollModalOpen)
                            }
                            className="w-fit bg-[#cecece] rounded py-1.5 px-4 font-geist-mono text-black font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        >
                            Create a Poll
                        </button>
                    </div>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {polls?.map((poll, index) => (
                            <CardPoll
                                key={index}
                                pollId={index}
                                question={poll.question}
                                votes={poll.votes}
                                status={poll.isActive}
                                endtime={poll.deadline}
                                options={poll.options}
                                pollType={poll.pollType}
                            />
                        ))}
                    </section>
                </main>
                <footer className="mt-20 bg-noise bg-[#1a1a1a] min-h-14 py-3 px-4 flex items-center justify-center font-geist-mono gap-2">
                    Luna <Copyright size={20} />
                </footer>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </>
    )
}
