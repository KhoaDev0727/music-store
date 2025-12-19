"use client"

import { useState } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { AuroraBackground } from "@/components/aurora-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MusicTicker } from "@/components/music-ticker"
import { PricingSection } from "@/components/pricing-section"
import { MusicLibrary } from "@/components/music-library"
import { MyMusicSection } from "@/components/my-music-section"
import { AboutSection } from "@/components/about-section"
import { MusicPlayer } from "@/components/music-player"
import { Footer } from "@/components/footer"
import { WalletProvider } from "@/contexts/wallet-context"
import { MusicProvider } from "@/contexts/music-context"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <WalletProvider>
      <MusicProvider>
        {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
        <main
          className={`min-h-screen bg-[#050508] overflow-x-hidden transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <AuroraBackground />
          <Navbar />
          <HeroSection />
          <MusicTicker />
          <PricingSection />
          <MusicLibrary />
          <MyMusicSection />
          <AboutSection />
          <Footer />
          <MusicPlayer />
        </main>
      </MusicProvider>
    </WalletProvider>
  )
}
