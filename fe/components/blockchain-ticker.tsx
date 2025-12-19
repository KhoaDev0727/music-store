"use client"

import { Boxes, Coins, Shield, Zap, Globe, Code, Lock, Database } from "lucide-react"

const blockchainItems = [
  { name: "Sui", icon: Zap, color: "text-sui-cyan" },
  { name: "Move Language", icon: Code, color: "text-sui-purple" },
  { name: "DeFi", icon: Coins, color: "text-yellow-400" },
  { name: "NFTs", icon: Boxes, color: "text-pink-400" },
  { name: "Security", icon: Shield, color: "text-green-400" },
  { name: "Web3", icon: Globe, color: "text-blue-400" },
  { name: "Smart Contracts", icon: Lock, color: "text-orange-400" },
  { name: "Object Storage", icon: Database, color: "text-cyan-400" },
  { name: "Sui", icon: Zap, color: "text-sui-cyan" },
  { name: "Move Language", icon: Code, color: "text-sui-purple" },
  { name: "DeFi", icon: Coins, color: "text-yellow-400" },
  { name: "NFTs", icon: Boxes, color: "text-pink-400" },
  { name: "Security", icon: Shield, color: "text-green-400" },
  { name: "Web3", icon: Globe, color: "text-blue-400" },
  { name: "Smart Contracts", icon: Lock, color: "text-orange-400" },
  { name: "Object Storage", icon: Database, color: "text-cyan-400" },
]

export function BlockchainTicker() {
  return (
    <section className="relative py-6 sm:py-8 bg-card/50 border-y border-border overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex animate-ticker">
        {blockchainItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 whitespace-nowrap">
            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
            <span className="text-sm sm:text-base font-medium text-muted-foreground">{item.name}</span>
            <span className="text-muted-foreground/30">•</span>
          </div>
        ))}
      </div>
    </section>
  )
}
