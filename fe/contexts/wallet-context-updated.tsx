// /music-store/fe/contexts/wallet-context-updated.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { 
  ConnectButton, 
  useCurrentAccount, 
  useSignAndExecuteTransaction,
  useSuiClient 
} from '@mysten/dapp-kit'
import { subscribeToTier, fetchSubscription, TIER_PRICES } from '@/lib/sui-service'

export type SubscriptionTier = "free" | "premium" | "vip"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  subscription: SubscriptionTier
  connectWallet: () => void
  disconnectWallet: () => void
  subscribe: (tier: SubscriptionTier) => Promise<boolean>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const currentAccount = useCurrentAccount()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()
  
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [subscription, setSubscription] = useState<SubscriptionTier>("free")

  // Update connection status
  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true)
      const shortAddress = `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
      setAddress(shortAddress)
      
      // Fetch balance
      suiClient.getBalance({
        owner: currentAccount.address
      }).then(result => {
        const suiBalance = Number(result.totalBalance) / 1_000_000_000 // Convert MIST to SUI
        setBalance(Math.floor(suiBalance))
      }).catch(console.error)

      // Fetch subscription
      fetchSubscription(currentAccount.address)
        .then(data => {
          if (data.active) {
            setSubscription(data.tier)
          } else {
            setSubscription('free')
          }
        })
        .catch(console.error)
    } else {
      setIsConnected(false)
      setAddress(null)
      setBalance(0)
      setSubscription('free')
    }
  }, [currentAccount, suiClient])

  const connectWallet = () => {
    // The ConnectButton component handles wallet connection
    // This function is kept for compatibility with existing code
    console.log('Use ConnectButton component to connect wallet')
  }

  const disconnectWallet = () => {
    // Handled by @mysten/dapp-kit
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setSubscription("free")
  }

  const subscribe = async (tier: SubscriptionTier): Promise<boolean> => {
    if (!currentAccount) {
      throw new Error('Wallet not connected')
    }

    if (tier === 'free') {
      setSubscription('free')
      return true
    }

    try {
      // Check if user has enough balance
      const requiredBalance = Number(TIER_PRICES[tier]) / 1_000_000_000
      if (balance < requiredBalance) {
        throw new Error(`Insufficient balance. Required: ${requiredBalance} SUI`)
      }

      // Execute subscription transaction
      await subscribeToTier(
        currentAccount,
        tier,
        signAndExecuteTransaction
      )

      // Update local state
      setSubscription(tier)
      
      // Refresh balance
      const newBalance = await suiClient.getBalance({
        owner: currentAccount.address
      })
      setBalance(Math.floor(Number(newBalance.totalBalance) / 1_000_000_000))

      return true
    } catch (error) {
      console.error('Subscription error:', error)
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        subscription,
        connectWallet,
        disconnectWallet,
        subscribe,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}