import { ethers } from 'ethers'
import { useWallet } from '@/hooks/useWallet'
import Contract from '../../../shared/contracts/GhostPolls.json'

export function usePollContract() {
    const { getSigner } = useWallet()

    const getContract = async () => {
        const signer = await getSigner()
        if (!signer) throw new Error('No signer disponible')
        return new ethers.Contract(Contract.address, Contract.abi, signer)
    }

    return { getContract }
}
