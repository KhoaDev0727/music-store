"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit"
import { subscribeToTier, fetchSubscription } from "@/lib/sui-service"

export type SubscriptionTier = "free" | "premium" | "vip"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  subscription: SubscriptionTier
  connectWallet: () => void // Giữ để tương thích cũ, thực tế dùng ConnectButton
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

  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true)
      setAddress(
        `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
      )

      // Fetch balance
      suiClient
        .getBalance({ owner: currentAccount.address })
        .then((res) => {
          const suiBalance = Number(res.totalBalance) / 1_000_000_000
          setBalance(Math.floor(suiBalance * 100) / 100) // 2 decimal places
        })
        .catch(console.error)

      // Fetch subscription from backend
      fetchSubscription(currentAccount.address)
        .then((data) => {
          setSubscription(data.active ? data.tier : "free")
        })
        .catch(() => setSubscription("free"))
    } else {
      setIsConnected(false)
      setAddress(null)
      setBalance(0)
      setSubscription("free")
    }
  }, [currentAccount, suiClient])

  const connectWallet = () => {
    console.log("Use ConnectButton to connect wallet")
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setSubscription("free")
  }

  const subscribe = async (tier: SubscriptionTier): Promise<boolean> => {
    if (!currentAccount) throw new Error("Wallet not connected")
    if (tier === "free") {
      setSubscription("free")
      return true
    }

    try {
      await subscribeToTier(currentAccount, tier, signAndExecuteTransaction)

      // Update subscription state
      setSubscription(tier)

      // Refresh balance
      const res = await suiClient.getBalance({ owner: currentAccount.address })
      const suiBalance = Number(res.totalBalance) / 1_000_000_000
      setBalance(Math.floor(suiBalance * 100) / 100)

      return true
    } catch (error) {
      console.error("Subscription failed:", error)
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