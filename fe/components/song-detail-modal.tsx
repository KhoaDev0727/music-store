"use client"

import { useEffect, useState } from "react"
import { X, Play, Lock, Heart, Share2, Clock, Disc3, User, Crown, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Song, useMusic } from "@/contexts/music-context"
import { useWallet, type SubscriptionTier } from "@/contexts/wallet-context"
import { toast } from 'sonner'

interface SongDetailModalProps {
  song: Song | null
  isOpen: boolean
  onClose: () => void
}

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

export function SongDetailModal({ song, isOpen, onClose }: SongDetailModalProps) {
  const [isLiked, setIsLiked] = useState(false)
  const { playSong } = useMusic()
  const { subscription, isConnected, connectWallet } = useWallet()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !song) return null

  const isLocked = !canAccessSong(subscription, song.tier)

  const handlePlay = () => {
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to play this song",
      })
      connectWallet()
      return
    }
    if (!isLocked) {
      playSong(song)
      onClose()
    } else {
      toast.error("Subscription required", {
        description: `Upgrade to ${getTierLabel(song.tier)} to play this song`,
      })
    }
  }

  const scrollToPricing = () => {
    onClose()
    setTimeout(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="relative">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={song.cover || "/placeholder.svg"}
              alt={song.title}
              className={`w-full h-full object-cover ${isLocked ? "blur-lg scale-110" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
                <div className="w-20 h-20 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center mb-4 border border-border">
                  <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold mb-2">This song is locked</p>
                <p className="text-sm text-muted-foreground mb-4">Upgrade to {getTierLabel(song.tier)} to unlock</p>
                <Button
                  onClick={scrollToPricing}
                  className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r ${getTierColor(song.tier)} text-white text-sm font-bold flex items-center gap-1.5`}
          >
            <Crown className="w-4 h-4" />
            {getTierLabel(song.tier)}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden mx-auto sm:mx-0 shadow-2xl">
                <img
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  className={`w-full h-full object-cover ${isLocked ? "blur-md" : ""}`}
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              </div>
            </div>

            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{song.title}</h2>
              <p className="text-lg text-sui-cyan mb-4">{song.artist}</p>

              <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-4 h-4" />
                  <span>{song.album}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{song.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{song.genre}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {!isConnected ? (
                  <Button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect to Play
                  </Button>
                ) : isLocked ? (
                  <Button
                    onClick={scrollToPricing}
                    className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Play
                  </Button>
                ) : (
                  <Button onClick={handlePlay} className="bg-gradient-to-r from-sui-cyan to-sui-purple text-background">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`border-border bg-transparent ${isLiked ? "text-pink-500 border-pink-500/30" : ""}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>

                <Button variant="outline" className="border-border bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              About this track
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Experience the groundbreaking sounds of {song.artist} with "{song.title}" from the album {song.album}.
              This {song.genre.toLowerCase()} masterpiece showcases the artist's unique ability to blend traditional
              elements with cutting-edge Web3 music production.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
