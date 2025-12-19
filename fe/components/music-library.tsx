"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Lock, Clock, Heart, MoreHorizontal, Search, Music, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMusic, type Song } from "@/contexts/music-context"
import { useWallet, type SubscriptionTier } from "@/contexts/wallet-context"
import { SongDetailModal } from "./song-detail-modal"
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

export function MusicLibrary() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { songs, playSong } = useMusic()
  const { subscription, isConnected, connectWallet } = useWallet()

  const genres = ["all", ...new Set(songs.map((s) => s.genre))]

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "all" || song.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

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

  const handlePlay = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isConnected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to play music",
      })
      connectWallet()
      return
    }
    if (canAccessSong(subscription, song.tier)) {
      playSong(song)
    } else {
      toast.error("Subscription required", {
        description: `Upgrade to ${getTierLabel(song.tier)} to play this song`,
        action: { label: "Upgrade", onClick: () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }) },
        style: { background: 'linear-gradient(to right, #FF006B, #7B61FF)' }
      })
    }
  }

  const handleSongClick = (song: Song) => {
    setSelectedSong(song)
    setIsModalOpen(true)
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

  return (
    <>
      <section ref={sectionRef} id="library" className="py-20 sm:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Music <span className="text-shimmer">Library</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover exclusive tracks from top Web3 artists. Click on any song to view details.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search songs or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-secondary/50 border-border rounded-xl"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={`whitespace-nowrap rounded-full ${selectedGenre === genre
                      ? "bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
                      : "bg-transparent border-border hover:border-sui-cyan/50"
                    }`}
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div
            className={`glass-card rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-border text-sm text-muted-foreground">
              <div className="w-12">#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="w-20 text-center">Tier</div>
              <div className="w-16 text-center">
                <Clock className="w-4 h-4 mx-auto" />
              </div>
              <div className="w-24"></div>
            </div>

            <div className="divide-y divide-border">
              {filteredSongs.map((song, index) => {
                const isLocked = !canAccessSong(subscription, song.tier)
                const isLiked = likedSongs.has(song.id)

                return (
                  <div
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className={`group grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-4 sm:px-6 py-4 hover:bg-secondary/30 transition-all duration-300 cursor-pointer ${isLocked ? "opacity-60" : ""
                      }`}
                  >
                    <div className="hidden sm:flex items-center w-12">
                      <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
                      <button
                        onClick={(e) => handlePlay(song, e)}
                        className="hidden group-hover:block"
                        disabled={isLocked && isConnected}
                      >
                        {isLocked && isConnected ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Play className="w-5 h-5 text-sui-cyan" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className={`w-full h-full object-cover ${isLocked ? "blur-sm" : ""}`}
                        />
                        {isLocked && (
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          onClick={(e) => handlePlay(song, e)}
                          className="sm:hidden absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isLocked && isConnected ? (
                            <Lock className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center">
                      <span className="text-muted-foreground truncate">{song.album}</span>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-20">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(
                          song.tier,
                        )} text-white`}
                      >
                        {getTierLabel(song.tier)}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-16 text-muted-foreground text-sm">
                      {song.duration}
                    </div>

                    <div className="hidden sm:flex items-center justify-end gap-2 w-24">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSongClick(song)
                        }}
                        className="p-2 rounded-full text-muted-foreground hover:text-sui-cyan transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => toggleLike(song.id, e)}
                        className={`p-2 rounded-full transition-colors ${isLiked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex sm:hidden items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(
                            song.tier,
                          )} text-white`}
                        >
                          {getTierLabel(song.tier)}
                        </span>
                        <span className="text-xs text-muted-foreground">{song.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleLike(song.id, e)}
                          className={isLiked ? "text-pink-500" : "text-muted-foreground"}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredSongs.length === 0 && (
              <div className="py-16 text-center">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No songs found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SongDetailModal song={selectedSong} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
