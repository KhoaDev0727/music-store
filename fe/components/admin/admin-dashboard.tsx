"use client"

import { useState, useEffect, useRef } from "react"
import { Music, Users, DollarSign, TrendingUp, Crown, Sparkles, Zap, BarChart3 } from "lucide-react"
import { useMusic } from "@/contexts/music-context"

const stats = [
  {
    label: "Total Tracks",
    value: "1,234",
    change: "+12%",
    icon: Music,
    gradient: "from-sui-cyan to-blue-500",
  },
  {
    label: "Total Listeners",
    value: "56.7K",
    change: "+23%",
    icon: Users,
    gradient: "from-sui-purple to-pink-500",
  },
  {
    label: "Revenue (SUI)",
    value: "12,450",
    change: "+8%",
    icon: DollarSign,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    label: "Streams Today",
    value: "8,901",
    change: "+45%",
    icon: TrendingUp,
    gradient: "from-green-400 to-emerald-500",
  },
]

const subscriptionStats = [
  { tier: "Free", count: 45000, icon: Zap, color: "text-gray-400" },
  { tier: "Premium", count: 8500, icon: Sparkles, color: "text-sui-purple" },
  { tier: "VIP", count: 3200, icon: Crown, color: "text-yellow-400" },
]

export function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { songs } = useMusic()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const topSongs = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 5)

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      <div
        className={`mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Welcome back, <span className="text-shimmer">Admin</span>
        </h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your music platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`glass-card rounded-2xl p-6 transition-all duration-700 hover:scale-[1.02] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Songs */}
        <div
          className={`lg:col-span-2 glass-card rounded-2xl p-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sui-cyan" />
              Top Performing Tracks
            </h2>
          </div>

          <div className="space-y-4">
            {topSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
              >
                <span className="w-6 text-center font-bold text-muted-foreground">#{index + 1}</span>
                <img
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sui-cyan">{(song.plays / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground">plays</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Stats */}
        <div
          className={`glass-card rounded-2xl p-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Subscriptions
          </h2>

          <div className="space-y-6">
            {subscriptionStats.map((sub) => (
              <div key={sub.tier} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <sub.icon className={`w-5 h-5 ${sub.color}`} />
                    <span className="font-medium">{sub.tier}</span>
                  </div>
                  <span className="text-muted-foreground">{sub.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      sub.tier === "VIP"
                        ? "from-yellow-400 to-orange-500"
                        : sub.tier === "Premium"
                          ? "from-sui-purple to-pink-500"
                          : "from-gray-500 to-gray-600"
                    }`}
                    style={{ width: `${(sub.count / 45000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-sui-cyan/10 to-sui-purple/10 border border-sui-cyan/20">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-sui-cyan">156,700 SUI</p>
            <p className="text-xs text-green-400 mt-1">+15.3% from last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
