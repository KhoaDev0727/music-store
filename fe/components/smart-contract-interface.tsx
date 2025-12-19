"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  RefreshCw,
  Copy,
  Check,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Settings,
  Sparkles,
} from "lucide-react"

const contractFunctions = [
  { name: "transfer", description: "Transfer SUI tokens", type: "write" },
  { name: "mint", description: "Mint new tokens", type: "write" },
  { name: "burn", description: "Burn tokens", type: "write" },
  { name: "getBalance", description: "Check wallet balance", type: "read" },
  { name: "getTotalSupply", description: "Get total supply", type: "read" },
  { name: "getOwner", description: "Get contract owner", type: "read" },
]

const recentTransactions = [
  { hash: "0x7f3a...8e2b", type: "Transfer", amount: "150 SUI", status: "success", time: "2m ago" },
  { hash: "0x4c1d...9f3a", type: "Mint", amount: "500 SUI", status: "success", time: "5m ago" },
  { hash: "0x2e8b...1c4d", type: "Transfer", amount: "75 SUI", status: "pending", time: "8m ago" },
]

export function SmartContractInterface() {
  const [activeTab, setActiveTab] = useState<"interact" | "history">("interact")
  const [selectedFunction, setSelectedFunction] = useState(contractFunctions[0])
  const [inputValue, setInputValue] = useState("")
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText("0x7f3a...8e2b")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} id="smart-contract" className="py-16 sm:py-20 md:py-24 relative">
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-sui-cyan/5 blur-[100px] sm:blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-sui-purple/5 blur-[100px] sm:blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-foreground">Smart Contract </span>
            <span className="text-shimmer">Interface</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Interact with your Sui smart contracts through our intuitive and powerful interface.
          </p>
        </div>

        <div
          className={`glass-card rounded-3xl overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-border gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-sui-cyan to-sui-purple">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">SuiVerse Token</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">0x7f3a...8e2b</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-sui-cyan"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sui-cyan">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("interact")}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium transition-colors relative ${
                activeTab === "interact" ? "text-sui-cyan" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Interact
              </span>
              {activeTab === "interact" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sui-cyan to-sui-purple" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium transition-colors relative ${
                activeTab === "history" ? "text-sui-cyan" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <History className="w-4 h-4" />
                History
              </span>
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sui-cyan to-sui-purple" />
              )}
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "interact" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Contract Functions</h4>
                  <div className="space-y-2">
                    {contractFunctions.map((func, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFunction(func)}
                        className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                          selectedFunction.name === func.name
                            ? "bg-sui-cyan/10 border border-sui-cyan/30"
                            : "bg-secondary/50 border border-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 sm:p-2 rounded-lg ${
                              func.type === "write"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {func.type === "write" ? (
                              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{func.name}</p>
                            <p className="text-xs text-muted-foreground">{func.description}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            func.type === "write"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {func.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 sm:p-6 border border-border">
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-4">{selectedFunction.name}()</h4>

                  {selectedFunction.type === "write" && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Recipient Address</label>
                        <Input
                          placeholder="0x..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-sui-cyan/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Amount (SUI)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-secondary/50 border-border focus:border-sui-cyan/50"
                        />
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-gradient-to-r from-sui-cyan to-sui-purple hover:opacity-90 text-background font-semibold py-5 sm:py-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,255,223,0.3)]">
                    {selectedFunction.type === "write" ? (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Execute Transaction
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Read Contract
                      </>
                    )}
                  </Button>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Result</p>
                    <code className="text-xs sm:text-sm text-sui-cyan font-mono break-all">
                      {selectedFunction.type === "read" ? '{"balance": "1,250.50 SUI"}' : "Awaiting execution..."}
                    </code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border hover:border-sui-cyan/20 transition-colors gap-3 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          tx.type === "Transfer" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {tx.type === "Transfer" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.type}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:gap-6 pl-12 sm:pl-0">
                      <span className="text-sm font-medium text-foreground">{tx.amount}</span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{tx.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
