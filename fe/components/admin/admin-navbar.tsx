"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Music, LayoutDashboard, PlusCircle, ListMusic, ArrowLeft, Wallet, LogOut } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import Link from "next/link"

interface AdminNavbarProps {
  activeTab: "dashboard" | "add" | "manage"
  setActiveTab: (tab: "dashboard" | "add" | "manage") => void
}

export function AdminNavbar({ activeTab, setActiveTab }: AdminNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "add" as const, label: "Add Music", icon: PlusCircle },
    { id: "manage" as const, label: "Manage", icon: ListMusic },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to App</span>
            </Link>

            <div className="w-px h-8 bg-border hidden sm:block" />

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sui-purple to-pink-500 flex items-center justify-center">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold">Admin Panel</span>
                <p className="text-xs text-muted-foreground hidden sm:block">SuiBeats Management</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-sui-purple to-pink-500 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="glass-card px-3 py-1.5 rounded-lg hidden sm:block">
                  <span className="text-sm font-mono text-foreground">{address}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={disconnectWallet}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-sui-purple to-pink-500 text-white font-semibold hover:opacity-90"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-sui-purple to-pink-500 text-white"
                  : "text-muted-foreground hover:text-foreground bg-secondary/30"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
