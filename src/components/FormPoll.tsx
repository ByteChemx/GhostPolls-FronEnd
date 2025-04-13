import { Dialog, DialogPanel } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { useDappStore } from '@/store'
import { NewPollForm } from '@/types'
import { usePollContract } from '@/hooks/useContract'
import ErrorMessage from '@/components/ErrorMessage'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPoll } from '@/services'

export default function FormPoll() {
    const { getContract } = usePollContract()

    const isFormPollModalOpen = useDappStore(
        (state) => state.isFormPollModalOpen
    )
    const setFormPollModalOpen = useDappStore(
        (state) => state.setFormPollModalOpen
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<NewPollForm>({
        defaultValues: {
            question: '',
            options: ['', ''],
            pollDuration: 3600,
        },
    })

    const queryCLient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createPoll,
        onError: () => {
            toast.error('Error creating Poll')
        },
        onSuccess: () => {
            queryCLient.invalidateQueries({
                queryKey: ['polls'],
            })
            reset()
            toast.success('Poll successfully created')
            setFormPollModalOpen(false)
        },
    })

    const onSubmit = async (formData: NewPollForm) => {
        const contract = await getContract()

        const data = {
            contract,
            question: formData.question,
            options: formData.options,
            pollType: formData.pollType,
            pollDuration: formData.pollDuration,
        }

        mutate(data)
    }

    return (
        <Dialog
            open={isFormPollModalOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => setFormPollModalOpen(false)}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full backdrop-blur-xs items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full rounded max-w-[35em] min-h-[20rem] bg-[var(--card)] border border-[var(--border-color)] p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <h3 className="text-3xl font-mono text-center">
                                Create a New Poll
                            </h3>
                            <div className="flex flex-col mb-3">
                                <label
                                    htmlFor="question"
                                    className="font-geist-mono"
                                >
                                    Poll Title
                                </label>
                                <input
                                    type="text"
                                    id="question"
                                    className="pl-2.5 bg-white h-10 outline-0 text-black rounded"
                                    placeholder="Your question"
                                    {...register('question', {
                                        required:
                                            'The question of the poll is required',
                                    })}
                                />
                            </div>
                            {errors.question && (
                                <ErrorMessage>
                                    {errors.question.message}
                                </ErrorMessage>
                            )}
                            <div className="flex flex-col mb-3">
                                <label
                                    htmlFor="pollDuration"
                                    className="font-geist-mono"
                                >
                                    Poll Time in Seconds
                                </label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    id="pollDuration"
                                    className="pl-2.5 bg-white h-10 outline-0 text-black rounded"
                                    placeholder="3600"
                                    {...register('pollDuration', {
                                        required:
                                            'The duration of the poll is required',
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            {errors.pollDuration && (
                                <ErrorMessage>
                                    {errors.pollDuration.message}
                                </ErrorMessage>
                            )}
                            <div className="flex flex-col mb-3">
                                <label
                                    htmlFor="pollType"
                                    className="font-geist-mono"
                                >
                                    Poll Type
                                </label>
                                <select
                                    id="pollType"
                                    className="pl-2.5 bg-white h-10 outline-0 text-black rounded"
                                    {...register('pollType', {
                                        valueAsNumber: true,
                                    })}
                                >
                                    <option value={0}>Public</option>
                                    <option value={1}>Anonymous</option>
                                </select>
                            </div>
                            <div className="flex flex-col mb-3">
                                <label className="font-geist-mono">
                                    Poll Options
                                </label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        {...register('options.0', {
                                            required:
                                                'The option cannot be empty',
                                        })}
                                        className="pl-2.5 bg-white h-10 outline-0 text-black rounded w-full"
                                        placeholder={'Option 1'}
                                    />
                                    {errors.options && errors.options[0] && (
                                        <ErrorMessage>
                                            {errors.options[0]?.message}
                                        </ErrorMessage>
                                    )}
                                    <input
                                        type="text"
                                        {...register('options.1', {
                                            required:
                                                'The option cannot be empty',
                                        })}
                                        className="pl-2.5 bg-white h-10 outline-0 text-black rounded w-full"
                                        placeholder={'Option 2'}
                                    />
                                    {errors.options && errors.options[1] && (
                                        <ErrorMessage>
                                            {errors.options[1]?.message}
                                        </ErrorMessage>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-3 w-full bg-[#cecece] rounded py-1.5 px-4 font-geist-mono text-black font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                            >
                                Create Poll
                            </button>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
