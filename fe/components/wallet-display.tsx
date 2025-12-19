"use client"

import { Crown, Sparkles, Star, Gem, Wallet, Zap } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

interface WalletDisplayProps {
  variant?: "desktop" | "mobile"
}

export function WalletDisplay({ variant = "desktop" }: WalletDisplayProps) {
  const { address, balance, subscription } = useWallet()

  const getWalletStyles = () => {
    switch (subscription) {
      case "vip":
        return {
          cardClass: "wallet-card-vip",
          badgeClass: "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 shadow-lg shadow-yellow-500/50",
          icon: <Crown className="w-4 h-4 text-yellow-900" />,
          label: "VIP",
          labelClass: "vip-text-shimmer font-black tracking-widest text-yellow-900",
          balanceClass: "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]",
          addressClass: "text-yellow-200/80",
          decorations: true,
          extraIcons: [
            <Zap key="zap1" className="absolute -top-2 left-1/4 w-3 h-3 text-yellow-400 animate-sparkle" />,
            <Sparkles key="sp1" className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-sparkle" />,
            <Star
              key="st1"
              className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400/60 animate-sparkle"
              style={{ animationDelay: "0.5s" }}
            />,
            <Star
              key="st2"
              className="absolute top-1/2 -right-3 w-3 h-3 text-yellow-400/40 animate-sparkle"
              style={{ animationDelay: "1s" }}
            />,
          ],
        }
      case "premium":
        return {
          cardClass: "wallet-card-premium",
          badgeClass: "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/40",
          icon: <Gem className="w-4 h-4 text-white" />,
          label: "PREMIUM",
          labelClass: "premium-text-glow font-bold tracking-wide text-white",
          balanceClass: "text-purple-400 drop-shadow-[0_0_8px_rgba(123,97,255,0.4)]",
          addressClass: "text-purple-200/70",
          decorations: false,
          extraIcons: [
            <Sparkles key="sp1" className="absolute -top-1 -right-1 w-4 h-4 text-purple-400/60 animate-pulse" />,
          ],
        }
      default:
        return {
          cardClass: "wallet-card-free",
          badgeClass: "bg-secondary/80",
          icon: <Wallet className="w-4 h-4 text-white/60" />,
          label: "FREE",
          labelClass: "text-muted-foreground font-medium",
          balanceClass: "text-sui-cyan",
          addressClass: "text-foreground",
          decorations: false,
          extraIcons: [],
        }
    }
  }

  const styles = getWalletStyles()

  if (variant === "mobile") {
    return (
      <div className={`${styles.cardClass} px-4 py-4 rounded-2xl relative overflow-hidden`}>
        {styles.extraIcons}

        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div
            className={`${styles.badgeClass} px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 relative overflow-hidden`}
          >
            {styles.icon}
            <span className={styles.labelClass}>{styles.label}</span>
            {subscription === "vip" && <div className="badge-shine" />}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground mb-1">Balance</p>
          <p className={`text-lg font-bold ${styles.balanceClass}`}>{balance} SUI</p>
          <p className={`text-sm font-mono mt-2 ${styles.addressClass}`}>{address}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.cardClass} px-5 py-3 rounded-2xl flex items-center gap-4 relative overflow-hidden`}>
      {styles.extraIcons}

      <div
        className={`${styles.badgeClass} px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 relative z-10 overflow-hidden`}
      >
        {styles.icon}
        <span className={styles.labelClass}>{styles.label}</span>
        {subscription === "vip" && <div className="badge-shine" />}
      </div>

      <div className="w-px h-10 bg-border/50 relative z-10" />

      <div className="text-right relative z-10">
        <p className="text-xs text-muted-foreground">Balance</p>
        <p className={`text-sm font-bold ${styles.balanceClass}`}>{balance} SUI</p>
      </div>

      <div className="w-px h-10 bg-border/50 relative z-10" />

      <span className={`text-sm font-mono relative z-10 ${styles.addressClass}`}>{address}</span>
    </div>
  )
}
