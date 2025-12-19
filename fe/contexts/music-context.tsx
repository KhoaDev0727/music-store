"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SubscriptionTier } from "./wallet-context"
import { useWallet } from "./wallet-context"
import { toast } from 'sonner'

export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  audioUrl: string
  tier: SubscriptionTier
  plays: number
  genre: string
}

interface MusicContextType {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  volume: number
  playSong: (song: Song) => void
  pauseSong: () => void
  resumeSong: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  nextSong: () => void
  prevSong: () => void
  addSong: (song: Omit<Song, "id" | "plays">) => void
  deleteSong: (id: string) => void
  refreshSongs: () => Promise<void>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const { subscription } = useWallet()

  // Load songs từ API khi mount
  useEffect(() => {
    refreshSongs()
  }, [])

  const refreshSongs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/songs')
      const data = await response.json()
      setSongs(data.songs)
    } catch (error) {
      console.error('Error loading songs:', error)
    }
  }

  const canAccessSong = (song: Song) => {
    const tierOrder = { free: 0, premium: 1, vip: 2 }
    return tierOrder[subscription] >= tierOrder[song.tier]
  }

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)
  }

  const pauseSong = () => {
    setIsPlaying(false)
  }

  const resumeSong = () => {
    setIsPlaying(true)
  }

  const nextSong = () => {
    if (!currentSong || songs.length === 0) return

    let currentIndex = songs.findIndex((s) => s.id === currentSong.id)
    let nextIndex = (currentIndex + 1) % songs.length
    let attempts = 0
    let found = false

    while (attempts < songs.length) {
      const potentialSong = songs[nextIndex]
      if (canAccessSong(potentialSong)) {
        playSong(potentialSong)
        found = true
        break
      }
      nextIndex = (nextIndex + 1) % songs.length
      attempts++
    }

    if (!found) {
      toast.warning("End of accessible playlist", {
        description: "No more songs available with your current subscription",
        action: {
          label: "Upgrade Plan",
          onClick: () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
        },
        duration: 5000, // Hiển thị lâu hơn một chút để user kịp đọc
      })
    }
  }

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return

    let currentIndex = songs.findIndex((s) => s.id === currentSong.id)
    let prevIndex = (currentIndex - 1 + songs.length) % songs.length
    let attempts = 0
    let found = false

    while (attempts < songs.length) {
      const potentialSong = songs[prevIndex]
      if (canAccessSong(potentialSong)) {
        playSong(potentialSong)
        found = true
        break
      }
      prevIndex = (prevIndex - 1 + songs.length) % songs.length
      attempts++
    }

    if (!found) {
      toast.warning("Start of accessible playlist", {
        description: "No previous songs available with your current subscription",
        action: {
          label: "Upgrade Plan",
          onClick: () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
        },
        duration: 5000,
      })
    }
  }

  const addSong = (song: Omit<Song, "id" | "plays">) => {
    const newSong: Song = {
      ...song,
      id: Date.now().toString(),
      plays: 0,
    }
    setSongs((prev) => [newSong, ...prev])
  }

  const deleteSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    if (currentSong?.id === id) {
      setCurrentSong(null)
      setIsPlaying(false)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        progress,
        volume,
        playSong,
        pauseSong,
        resumeSong,
        setProgress,
        setVolume,
        nextSong,
        prevSong,
        addSong,
        deleteSong,
        refreshSongs,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
