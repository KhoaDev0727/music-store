"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, Crown, Sparkles, Zap, Loader2 } from "lucide-react"
import { useWallet, type SubscriptionTier } from "@/contexts/wallet-context"
import { toast } from 'sonner'

const plans = [
  {
    id: "free" as SubscriptionTier,
    name: "Free",
    price: "0",
    period: "forever",
    description: "Get started with basic access",
    features: ["Access to free tracks", "Standard audio quality", "Ads supported", "Limited skips"],
    icon: Zap,
    gradient: "from-gray-500 to-gray-600",
    popular: false,
  },
  {
    id: "premium" as SubscriptionTier,
    name: "Premium",
    price: "1",
    period: "month",
    description: "Unlock premium content",
    features: [
      "All Free features",
      "Access to Premium tracks",
      "High quality audio",
      "Ad-free experience",
      "Unlimited skips",
      "Offline downloads",
    ],
    icon: Sparkles,
    gradient: "from-sui-purple to-pink-500",
    popular: true,
  },
  {
    id: "vip" as SubscriptionTier,
    name: "VIP",
    price: "2",
    period: "month",
    description: "Ultimate music experience",
    features: [
      "All Premium features",
      "Exclusive VIP tracks",
      "Lossless audio quality",
      "Early access to new releases",
      "Artist meet & greets",
      "NFT airdrops",
      "Priority support",
    ],
    icon: Crown,
    gradient: "from-yellow-400 to-orange-500",
    popular: false,
  },
]

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionTier | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { isConnected, subscription, connectWallet, subscribe } = useWallet()

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

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to subscribe",
      })
      return
    }
    setLoadingPlan(tier)
    try {
      await subscribe(tier)
      toast.success(`Successfully subscribed to ${tier.charAt(0).toUpperCase() + tier.slice(1)}! 🎉`, {
        description: "Enjoy your new music access",
      })
    } catch (error) {
      toast.error("Subscription failed", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  const getButtonText = (planId: SubscriptionTier) => {
    if (!isConnected) return "Connect Wallet"
    if (subscription === planId) return "Current Plan"
    if (planId === "free") return "Free Plan"
    return `Subscribe for ${plans.find((p) => p.id === planId)?.price} SUI`
  }

  return (
    <section ref={sectionRef} id="pricing" className="py-20 sm:py-32 px-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sui-purple/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-shimmer">Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock exclusive music and features with our subscription plans. Pay with SUI tokens.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-sui-purple to-pink-500 text-xs font-bold text-white">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`glass-card rounded-2xl p-6 sm:p-8 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] ${plan.popular ? "ring-2 ring-sui-purple/50" : ""
                  } ${subscription === plan.id ? "ring-2 ring-sui-cyan" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}
                >
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">SUI / {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loadingPlan === plan.id || (isConnected && subscription === plan.id)}
                  className={`w-full py-6 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                    ? "bg-gradient-to-r from-sui-purple to-pink-500 hover:opacity-90 text-white"
                    : subscription === plan.id
                      ? "bg-sui-cyan/20 text-sui-cyan border border-sui-cyan/30"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    getButtonText(plan.id)
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
