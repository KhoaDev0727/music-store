"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Headphones, Play, Disc3 } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { isConnected, connectWallet } = useWallet()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_50s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-white/5 animate-[spin_40s_linear_infinite]" />
        </div>

        {/* Floating music notes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          >
            <Disc3
              className={`w-${4 + (i % 3) * 2} h-${4 + (i % 3) * 2} ${
                i % 3 === 0 ? "text-[#00D9FF]/20" : i % 3 === 1 ? "text-[#7B61FF]/20" : "text-[#FF006B]/20"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            <span className="text-sm text-white/70 font-medium">Web3 Music Platform on Sui Blockchain</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
            <span className="text-white">Music for the</span>
            <br />
            <span className="bg-gradient-to-r from-[#00D9FF] via-[#7B61FF] to-[#FF006B] bg-clip-text text-transparent">
              Decentralized Era
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Own your music. Support artists directly. Subscribe with crypto and unlock unlimited streaming on the
            blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00D9FF] via-[#7B61FF] to-[#FF006B] text-white font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(123,97,255,0.4)]"
                onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Headphones className="w-5 h-5 mr-2" />
                Explore Library
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={connectWallet}
                className="w-full sm:w-auto bg-gradient-to-r from-[#00D9FF] via-[#7B61FF] to-[#FF006B] text-white font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(123,97,255,0.4)]"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Listening
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/10 hover:border-white/30 hover:bg-white/5 px-8 py-6 text-base rounded-xl transition-all duration-300 bg-transparent text-white"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Plans
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-24 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "10K+", label: "Tracks" },
              { value: "50K+", label: "Listeners" },
              { value: "500+", label: "Artists" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#7B61FF] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-white/30 tracking-widest">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
