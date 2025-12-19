"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, Upload, ImageIcon, Loader2, Check, Disc3 } from "lucide-react"
import { useMusic } from "@/contexts/music-context"
import type { SubscriptionTier } from "@/contexts/wallet-context"

const genres = [
  "Electronic",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Classical",
  "Jazz",
  "R&B",
  "Indie",
  "House",
  "Techno",
  "Ambient",
  "Blues",
  "Funk",
  "Wave",
]

export function AddMusicForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    genre: "Electronic",
    tier: "free" as SubscriptionTier,
    cover: "",
    audioUrl: "",
  })

  const { addSong } = useMusic()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addSong({
      ...formData,
      cover: formData.cover || "/abstract-album-cover.png",
      audioUrl: formData.audioUrl || "/audio/new-track.mp3",
    })

    setIsLoading(false)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        title: "",
        artist: "",
        album: "",
        duration: "",
        genre: "Electronic",
        tier: "free",
        cover: "",
        audioUrl: "",
      })
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sui-purple to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Add New <span className="text-shimmer">Track</span>
        </h1>
        <p className="text-muted-foreground">Upload a new song to the SuiBeats library</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Song Title *</Label>
            <Input
              id="title"
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Artist */}
          <div className="space-y-2">
            <Label htmlFor="artist">Artist Name *</Label>
            <Input
              id="artist"
              placeholder="Enter artist name"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Album */}
          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="Enter album name"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              placeholder="e.g. 3:45"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre *</Label>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 8).map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setFormData({ ...formData, genre })}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    formData.genre === genre
                      ? "bg-gradient-to-r from-sui-cyan to-sui-purple text-background"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Tier */}
          <div className="space-y-2">
            <Label>Access Tier *</Label>
            <div className="flex gap-2">
              {[
                { id: "free", label: "Free", color: "from-gray-500 to-gray-600" },
                { id: "premium", label: "Premium", color: "from-sui-purple to-pink-500" },
                { id: "vip", label: "VIP", color: "from-yellow-400 to-orange-500" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, tier: tier.id as SubscriptionTier })}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.tier === tier.id
                      ? `bg-gradient-to-r ${tier.color} text-white`
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-sui-cyan/50 transition-colors cursor-pointer">
              <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Drop image or click to upload</p>
              <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Audio File</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-sui-purple/50 transition-colors cursor-pointer">
              <Disc3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Drop audio or click to upload</p>
              <p className="text-xs text-muted-foreground/60 mt-1">MP3, WAV up to 50MB</p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full mt-8 py-6 bg-gradient-to-r from-sui-purple to-pink-500 text-white font-semibold hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading to Blockchain...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Track Added Successfully!
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Add Track to Library
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
