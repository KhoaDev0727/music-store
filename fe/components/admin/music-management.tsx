"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, Edit, Play, Music } from "lucide-react"
import { useMusic } from "@/contexts/music-context"
import type { SubscriptionTier } from "@/contexts/wallet-context"

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

export function MusicManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set())
  const { songs, deleteSong, playSong } = useMusic()

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSelectSong = (id: string) => {
    setSelectedSongs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDeleteSelected = () => {
    selectedSongs.forEach((id) => deleteSong(id))
    setSelectedSongs(new Set())
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Manage <span className="text-shimmer">Library</span>
          </h1>
          <p className="text-muted-foreground">{songs.length} tracks in your library</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
          {selectedSongs.size > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected} className="whitespace-nowrap">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedSongs.size})
            </Button>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[auto_2fr_1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-border text-sm text-muted-foreground font-medium">
          <div className="w-8">
            <input
              type="checkbox"
              checked={selectedSongs.size === songs.length && songs.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSongs(new Set(songs.map((s) => s.id)))
                } else {
                  setSelectedSongs(new Set())
                }
              }}
              className="rounded"
            />
          </div>
          <div>Track</div>
          <div>Album</div>
          <div>Genre</div>
          <div className="w-20 text-center">Tier</div>
          <div className="w-24 text-center">Plays</div>
          <div className="w-24 text-center">Actions</div>
        </div>

        <div className="divide-y divide-border">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`grid grid-cols-1 lg:grid-cols-[auto_2fr_1fr_1fr_auto_auto_auto] gap-4 px-4 lg:px-6 py-4 hover:bg-secondary/30 transition-colors ${
                selectedSongs.has(song.id) ? "bg-sui-purple/5" : ""
              }`}
            >
              <div className="hidden lg:flex items-center w-8">
                <input
                  type="checkbox"
                  checked={selectedSongs.has(song.id)}
                  onChange={() => toggleSelectSong(song.id)}
                  className="rounded"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group">
                  <img src={song.cover || "/placeholder.svg"} alt={song.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => playSong(song)}
                    className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center">
                <span className="text-muted-foreground truncate">{song.album}</span>
              </div>

              <div className="hidden lg:flex items-center">
                <span className="text-muted-foreground">{song.genre}</span>
              </div>

              <div className="hidden lg:flex items-center justify-center w-20">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(
                    song.tier,
                  )} text-white`}
                >
                  {getTierLabel(song.tier)}
                </span>
              </div>

              <div className="hidden lg:flex items-center justify-center w-24 text-muted-foreground">
                {(song.plays / 1000).toFixed(1)}K
              </div>

              <div className="flex items-center justify-end lg:justify-center gap-2 w-full lg:w-24">
                <span
                  className={`lg:hidden px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(
                    song.tier,
                  )} text-white`}
                >
                  {getTierLabel(song.tier)}
                </span>
                <div className="flex items-center gap-1 ml-auto lg:ml-0">
                  <button className="p-2 text-muted-foreground hover:text-sui-cyan transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSong(song.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="py-16 text-center">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tracks found</p>
          </div>
        )}
      </div>
    </div>
  )
}
