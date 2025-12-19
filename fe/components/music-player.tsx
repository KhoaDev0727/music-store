"use client"

import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Maximize2,
  X,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useMusic } from "@/contexts/music-context"

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    pauseSong,
    resumeSong,
    setProgress,
    setVolume,
    nextSong,
    prevSong,
  } = useMusic()

  // Sync audio element với state
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume / 100
    if (isPlaying) {
      audioRef.current.play().catch(console.error)
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, volume, isMuted])

  // Khi đổi bài hát → load src mới (bỏ record on-chain để không mở ví)
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = currentSong.audioUrl
    setProgress(0)
    if (isPlaying) {
      audioRef.current.play().catch(console.error)
    }
  }, [currentSong])

  // Cập nhật progress theo thời gian thực
  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const current = audioRef.current.currentTime
    const duration = audioRef.current.duration
    if (duration > 0) {
      setProgress((current / duration) * 100)
    }
  }

  // Khi bài hát kết thúc → next
  const handleEnded = () => {
    nextSong()
  }

  // Seek khi kéo slider
  const handleSeek = ([value]: number[]) => {
    if (!audioRef.current) return
    const duration = audioRef.current.duration
    if (duration > 0) {
      audioRef.current.currentTime = (value / 100) * duration
    }
    setProgress(value)
  }

  const formatTime = (percentage: number, durationStr: string) => {
    if (!durationStr || !audioRef.current) return "0:00"
    const [mins, secs] = durationStr.split(":").map(Number)
    const totalSeconds = mins * 60 + secs
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds)
    const currentMins = Math.floor(currentSeconds / 60)
    const currentSecs = currentSeconds % 60
    return `${currentMins}:${currentSecs.toString().padStart(2, "0")}`
  }

  if (!currentSong) return null

  return (
    <>
      {/* Mini Player */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${isExpanded ? "translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="glass-card border-t border-border">
          <div className="h-1 bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-sui-cyan to-sui-purple transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
                  onClick={() => setIsExpanded(true)}
                >
                  <img
                    src={currentSong.cover || "/placeholder.svg"}
                    alt={currentSong.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{currentSong.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={prevSong} className="p-2 text-muted-foreground hover:text-foreground hidden sm:block">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={isPlaying ? pauseSong : resumeSong}
                  className="p-3 rounded-full bg-gradient-to-r from-sui-cyan to-sui-purple text-background hover:opacity-90 transition-opacity"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={nextSong} className="p-2 text-muted-foreground hover:text-foreground hidden sm:block">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 transition-colors ${isLiked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <div className="flex items-center gap-2 w-32">
                  <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-muted-foreground hover:text-foreground">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([v]) => {
                      setVolume(v)
                      setIsMuted(false)
                    }}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Player */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${currentSong.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(100px)",
            }}
          />
          <div className="relative h-full flex flex-col items-center justify-center px-4 py-8">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8 animate-float">
              <img
                src={currentSong.cover || "/placeholder.svg"}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{currentSong.title}</h2>
              <p className="text-lg text-muted-foreground">{currentSong.artist}</p>
              <p className="text-sm text-muted-foreground/60 mt-1">{currentSong.album}</p>
            </div>
            <div className="w-full max-w-md mb-8">
              <Slider value={[progress]} onValueChange={handleSeek} max={100} step={0.1} className="w-full" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatTime(progress, currentSong.duration)}</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 transition-colors ${isShuffle ? "text-sui-cyan" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={prevSong} className="p-3 text-foreground hover:text-sui-cyan">
                <SkipBack className="w-7 h-7" />
              </button>
              <button
                onClick={isPlaying ? pauseSong : resumeSong}
                className="p-5 rounded-full bg-gradient-to-r from-sui-cyan to-sui-purple text-background hover:opacity-90 hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button onClick={nextSong} className="p-3 text-foreground hover:text-sui-cyan">
                <SkipForward className="w-7 h-7" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 transition-colors ${isRepeat ? "text-sui-cyan" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 transition-colors ${isLiked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"}`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-muted-foreground hover:text-foreground">
                  {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([v]) => {
                    setVolume(v)
                    setIsMuted(false)
                  }}
                  max={100}
                  step={1}
                  className="w-32"
                />
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground">
                <ListMusic className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        loop={isRepeat}
      />
    </>
  )
}