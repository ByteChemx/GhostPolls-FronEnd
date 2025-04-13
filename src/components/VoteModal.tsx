import { useDappStore } from '@/store'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { usePollContract } from '@/hooks/useContract'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { votePoll } from '@/services'

export default function VoteModal() {
    const { getContract } = usePollContract()

    const isVoteModalOpen = useDappStore((state) => state.isVoteModalOpen)
    const setVoteModalOpen = useDappStore((state) => state.setVoteModalOpen)
    const selectedPoll = useDappStore((state) => state.selectedPoll)

    type VoteForm = {
        option: string
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VoteForm>()

    useEffect(() => {
        if (
            errors.option?.message &&
            typeof errors.option.message === 'string'
        ) {
            toast.error(errors.option.message)
        }
    }, [errors.option])

    const queryCLient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: votePoll,
        onError: () => {
            toast.error('Error registering vote')
        },
        onSuccess: () => {
            queryCLient.invalidateQueries({
                queryKey: ['polls'],
            })
            toast.success('Vote successfully registered')
            setVoteModalOpen(false)
        },
    })

    const onSubmit = async (formData: VoteForm) => {
        const contract = await getContract()
        const pollId = selectedPoll?.id

        if (pollId === undefined) {
            toast.error('No poll selected')
            return
        }

        const data = {
            contract,
            pollId,
            option: +formData.option,
        }

        mutate(data)
    }

    return (
        <Dialog
            open={isVoteModalOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => setVoteModalOpen(false)}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full backdrop-blur-xs items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full rounded-lg max-w-[23em] min-h-[10rem] bg-[var(--card)] border border-[var(--border-color)] p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-2.5"
                            noValidate
                        >
                            <h3 className="text-lg font-geist-mono mb-2">
                                {selectedPoll?.question} ?
                            </h3>
                            {selectedPoll?.options.map((option, index) => (
                                <label
                                    key={option}
                                    className="cursor-pointer font-geist-mono flex items-center gap-2.5"
                                >
                                    <input
                                        type="radio"
                                        value={index}
                                        className="hidden peer"
                                        {...register('option', {
                                            required: 'The option is required',
                                        })}
                                    />
                                    <div className="h-5 w-5 peer-checked:bg-white peer-checked:border-2 bg-transparent border border-gray-500 text-white rounded-full text-sm transition" />
                                    {option}
                                </label>
                            ))}
                            <button
                                type="submit"
                                className="mt-3 w-full bg-[#292a2c] rounded py-1.5 px-4 font-geist-mono text-white font-semibold cursor-pointer hover:bg-gray-100 hover:text-black transition-colors duration-300"
                            >
                                Submit Vote
                            </button>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
