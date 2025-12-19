"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Users, Blocks, Activity } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "$97,097,765",
    label: "Total Value Locked",
    change: "+12.5%",
    gradient: "from-sui-cyan to-sui-blue",
  },
  {
    icon: Users,
    value: "523,806",
    label: "Active Users",
    change: "+8.2%",
    gradient: "from-sui-purple to-pink-500",
  },
  {
    icon: Blocks,
    value: "3,353",
    label: "Smart Contracts",
    change: "+24.1%",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Activity,
    value: "25,276",
    label: "Daily Transactions",
    change: "+15.7%",
    gradient: "from-green-400 to-emerald-500",
  },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-4 sm:p-6 transition-all duration-700 hover:scale-105 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3 sm:mb-4`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="text-xs sm:text-sm text-green-400 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
