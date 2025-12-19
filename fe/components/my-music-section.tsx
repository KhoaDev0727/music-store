"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Music, Crown, Clock, Heart, Wallet, Sparkles, Star, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMusic, type Song } from "@/contexts/music-context"
import { useWallet, type SubscriptionTier } from "@/contexts/wallet-context"
import { SongDetailModal } from "./song-detail-modal"
import { ConnectButton } from '@mysten/dapp-kit'
import { toast } from 'sonner'

const tierOrder: Record<SubscriptionTier, number> = { free: 0, premium: 1, vip: 2 }

function canAccessSong(userTier: SubscriptionTier, songTier: SubscriptionTier): boolean {
  return tierOrder[userTier] >= tierOrder[songTier]
}

function getTierColor(tier: SubscriptionTier): string {
  switch (tier) {
    case "vip":
      return "from-yellow-400 to-orange-500"
    case "premium":
      return "from-sui-purple to-pink-500"
    default:
      return "from-gray-500 to-gray-600"
  }
}

function getTierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case "vip":
      return "VIP"
    case "premium":
      return "Premium"
    default:
      return "Free"
  }
}

function getMemberCardStyles(tier: SubscriptionTier) {
  switch (tier) {
    case "vip":
      return {
        cardClass:
          "relative bg-gradient-to-r from-yellow-500/20 via-orange-500/15 to-yellow-500/20 border-2 border-yellow-500/60 animate-vip-glow",
        iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50",
        icon: <Crown className="w-7 h-7 text-white drop-shadow-lg" />,
        title: "VIP ELITE MEMBER",
        titleClass: "font-black text-yellow-400 tracking-wider drop-shadow-glow",
        decorations: true,
      }
    case "premium":
      return {
        cardClass:
          "relative bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-purple-500/15 border-2 border-purple-500/50 animate-premium-glow",
        iconBg: "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/40",
        icon: <Gem className="w-7 h-7 text-white" />,
        title: "Premium Member",
        titleClass: "font-bold text-purple-400 tracking-wide",
        decorations: false,
      }
    default:
      return {
        cardClass: "glass-card",
        iconBg: "bg-gradient-to-br from-sui-cyan/50 to-sui-purple/50",
        icon: <Music className="w-7 h-7 text-white" />,
        title: "Free Member",
        titleClass: "font-bold text-foreground",
        decorations: false,
      }
  }
}

export function MyMusicSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { songs, playSong } = useMusic()
  const { subscription, isConnected, connectWallet } = useWallet()

  const accessibleSongs = songs.filter((song) => canAccessSong(subscription, song.tier))
  const memberStyles = getMemberCardStyles(subscription)

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

  const handlePlay = (song: Song) => {
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to access your music",
      })
      connectWallet()
      return
    }
    if (canAccessSong(subscription, song.tier)) {
      playSong(song)
    } else {
      toast.error("Subscription required", {
        description: `Upgrade to ${getTierLabel(song.tier)} to play this song`,
      })
    }
  }

  const toggleLike = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedSongs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(songId)) {
        newSet.delete(songId)
      } else {
        newSet.add(songId)
      }
      return newSet
    })
  }

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const getSongCardStyles = (songTier: SubscriptionTier) => {
    if (subscription === "vip" && songTier === "vip") {
      return "group glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 border-2 border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/20"
    }
    if (subscription === "premium" && songTier === "premium") {
      return "group glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
    }
    return "group glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300"
  }

  return (
    <>
      <section ref={sectionRef} id="my-music" className="py-20 sm:py-32 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sui-purple/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sui-cyan/10 rounded-full blur-3xl" />
          {subscription === "vip" && (
            <>
              <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sui-cyan/20 to-sui-purple/20 border border-sui-cyan/30 mb-6">
              <Sparkles className="w-4 h-4 text-sui-cyan" />
              <span className="text-sm font-medium">Your Personal Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-shimmer">Music</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isConnected
                ? `You have access to ${accessibleSongs.length} songs with your ${getTierLabel(subscription)} subscription.`
                : "Connect your wallet to see your accessible music collection."}
            </p>
          </div>

          {!isConnected ? (
            <div
              className={`glass-card rounded-3xl p-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sui-cyan/20 to-sui-purple/20 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-sui-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Connect your wallet to access your music collection and start listening to exclusive tracks.
              </p>
              <ConnectButton
                connectText={
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </>
                }
                className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background font-semibold hover:opacity-90"
              />
            </div>
          ) : accessibleSongs.length === 0 ? (
            <div
              className={`glass-card rounded-3xl p-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sui-cyan/20 to-sui-purple/20 flex items-center justify-center mx-auto mb-6">
                <Music className="w-12 h-12 text-sui-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Songs Available</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Upgrade your subscription to unlock exclusive tracks from top Web3 artists.
              </p>
              <Button
                onClick={scrollToPricing}
                size="lg"
                className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
              >
                <Crown className="w-5 h-5 mr-2" />
                View Plans
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: "0.1s" }}
              >
                <div
                  className={`${memberStyles.cardClass} rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden`}
                >
                  {/* VIP decorations */}
                  {memberStyles.decorations && (
                    <>
                      <Sparkles className="absolute top-3 right-3 w-5 h-5 text-yellow-400 animate-sparkle" />
                      <Star
                        className="absolute top-3 left-3 w-4 h-4 text-yellow-400/60 animate-sparkle"
                        style={{ animationDelay: "0.3s" }}
                      />
                      <Star
                        className="absolute bottom-3 right-8 w-3 h-3 text-yellow-400/40 animate-sparkle"
                        style={{ animationDelay: "0.6s" }}
                      />
                      <Star
                        className="absolute bottom-4 left-8 w-4 h-4 text-orange-400/50 animate-sparkle"
                        style={{ animationDelay: "0.9s" }}
                      />
                    </>
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${memberStyles.iconBg} flex items-center justify-center`}>
                      {memberStyles.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg ${memberStyles.titleClass}`}>{memberStyles.title}</h3>
                      <p className="text-muted-foreground text-sm">{accessibleSongs.length} songs unlocked</p>
                    </div>
                  </div>
                  {subscription !== "vip" && (
                    <Button
                      onClick={scrollToPricing}
                      variant="outline"
                      className="border-sui-cyan/30 text-sui-cyan hover:bg-sui-cyan/10 bg-transparent relative z-10"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                  {subscription === "vip" && (
                    <div className="relative z-10 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-background font-bold text-sm flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      MAXIMUM TIER
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: "0.2s" }}
              >
                {accessibleSongs.map((song, index) => {
                  const isLiked = likedSongs.has(song.id)

                  return (
                    <div
                      key={song.id}
                      onClick={() => {
                        setSelectedSong(song)
                        setIsModalOpen(true)
                      }}
                      className={getSongCardStyles(song.tier)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlay(song)
                          }}
                          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-sui-cyan to-sui-purple flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                        >
                          <Play className="w-5 h-5 text-background ml-0.5" />
                        </button>

                        <span
                          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(song.tier)} text-white`}
                        >
                          {getTierLabel(song.tier)}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-semibold truncate mb-1">{song.title}</h4>
                        <p className="text-sm text-muted-foreground truncate mb-3">{song.artist}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{song.duration}</span>
                          </div>
                          <button
                            onClick={(e) => toggleLike(song.id, e)}
                            className={`p-1.5 rounded-full transition-colors ${isLiked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
                              }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <SongDetailModal song={selectedSong} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
