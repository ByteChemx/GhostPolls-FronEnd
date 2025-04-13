import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

interface EthereumProvider extends ethers.Eip1193Provider {
    isMetaMask?: boolean
}

declare global {
    interface Window {
        ethereum?: EthereumProvider
    }
}
export function useWallet() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState<boolean>(true)
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(
        null
    )

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                const _provider = new ethers.BrowserProvider(window.ethereum)
                const accounts = await _provider.send('eth_accounts', [])
                setProvider(_provider)
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0])
                }
            }
            setIsChecking(false)
        }

        checkConnection()
    }, [])

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Por favor instala MetaMask desde https://metamask.io')
            return
        }

        try {
            const _provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await _provider.send('eth_requestAccounts', [])
            setProvider(_provider)
            if (accounts.length > 0) {
                setWalletAddress(accounts[0])
            }
        } catch (error) {
            console.error('Error al conectar la wallet:', error)
        }
    }

    const getSigner = async () => {
        if (!provider) return null
        return await provider.getSigner()
    }

    return {
        walletAddress,
        isChecking,
        connectWallet,
        provider,
        getSigner,
    }
}
