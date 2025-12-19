"use client"

import { Music, Disc3, Headphones, Radio, Mic2, AudioLines } from "lucide-react"

const tickerItems = [
  { icon: Music, text: "NFT Music" },
  { icon: Disc3, text: "Exclusive Drops" },
  { icon: Headphones, text: "HiFi Audio" },
  { icon: Radio, text: "Live Radio" },
  { icon: Mic2, text: "Artist Collabs" },
  { icon: AudioLines, text: "Web3 Streaming" },
  { icon: Music, text: "Token Rewards" },
  { icon: Disc3, text: "Limited Edition" },
  { icon: Headphones, text: "Premium Access" },
  { icon: Radio, text: "Blockchain Beats" },
]

export function MusicTicker() {
  return (
    <div className="relative py-6 overflow-hidden border-y border-border bg-background/50 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex animate-ticker">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="flex items-center gap-3 mx-8 whitespace-nowrap">
            <item.icon className="w-5 h-5 text-sui-cyan" />
            <span className="text-sm font-medium text-muted-foreground">{item.text}</span>
            <span className="text-sui-purple">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
