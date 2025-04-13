import { Contract, ethers } from 'ethers'
import { formatPoll } from '@/utils/formatPoll'
import { NewPollForm, Poll } from '@/types'
import ContractArtifact from '../../../shared/contracts/GhostPolls.json'

type PollProps = {
    contract: Contract
    address: string
    pollId: number
    option: number
    question: NewPollForm['question']
    options: NewPollForm['options']
    pollType: NewPollForm['pollType']
    pollDuration: NewPollForm['pollDuration']
}

export const getReadContract = () => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_NODE) // o getDefaultProvider() si es testnet/mainnet
    return new ethers.Contract(
        ContractArtifact.address,
        ContractArtifact.abi,
        provider
    )
}

export const fetchPolls = async (): Promise<Poll[]> => {
    const contract = getReadContract()

    const ids: number[] = await contract.getPolls()
    const rawPolls = await Promise.all(ids.map((id) => contract.getPoll(id)))
    return rawPolls.map((p) => formatPoll(p))
}

export const votePoll = async ({
    contract,
    pollId,
    option,
}: Pick<PollProps, 'contract' | 'pollId' | 'option'>) => {
    const tx = await contract.vote(pollId, option)
    await tx.wait()
}

export const createPoll = async ({
    contract,
    question,
    options,
    pollType,
    pollDuration,
}: Pick<
    PollProps,
    'contract' | 'question' | 'options' | 'pollType' | 'pollDuration'
>) => {
    const tx = await contract.createPoll(
        question,
        options,
        pollType,
        pollDuration
    )
    await tx.wait()
}

export const hasVoted = async ({
    pollId,
    address,
}: Pick<PollProps, 'pollId' | 'address'>) => {
    const contract = getReadContract()

    return await contract.hasVoted(pollId, address)
}
