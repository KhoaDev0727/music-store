"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Menu, X, LogOut } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletDisplay } from "@/components/wallet-display"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { ConnectButton } from '@mysten/dapp-kit'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isConnected, connectWallet, disconnectWallet } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-[#050508]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Library", "Pricing", "My Music", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative text-white/60 hover:text-white transition-colors duration-300 text-sm font-medium group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#00D9FF] to-[#7B61FF] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <WalletDisplay variant="desktop" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={disconnectWallet}
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <ConnectButton 
                connectText="Connect Wallet"
                className="bg-gradient-to-r from-[#00D9FF] via-[#7B61FF] to-[#FF006B] text-white font-semibold hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(123,97,255,0.4)]"
              />
            )}
          </div>

          <button className="md:hidden p-2 text-white/60" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-4">
              {["Library", "Pricing", "My Music", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-white/60 hover:text-white transition-colors px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              {isConnected ? (
                <div className="flex flex-col gap-3 mt-2">
                  <WalletDisplay variant="mobile" />
                  <Button
                    variant="outline"
                    onClick={disconnectWallet}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full bg-transparent"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <ConnectButton connectText="Connect Wallet" className="..." />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
