"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "complete" | "exit">("loading")

  useEffect(() => {
    const duration = 2800
    const interval = 25
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(timer)
        setPhase("complete")
        setTimeout(() => {
          setPhase("exit")
          setTimeout(onLoadComplete, 800)
        }, 500)
      }
      setProgress(currentProgress)
    }, interval)

    return () => clearInterval(timer)
  }, [onLoadComplete])

  const hexagonPath = "M50,5 L90,27.5 L90,72.5 L50,95 L10,72.5 L10,27.5 Z"
  const hexagonPerimeter = 240 // Approximate perimeter
  const strokeDashoffset = hexagonPerimeter - (progress / 100) * hexagonPerimeter

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-800 ${
        phase === "exit" ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{ background: "linear-gradient(135deg, #020810 0%, #041020 50%, #020810 100%)" }}
    >
      {/* Background animated glow */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{
              background: `rgba(0, ${180 + i * 15}, 255, ${0.6 - i * 0.08})`,
              boxShadow: `0 0 15px rgba(0, ${180 + i * 15}, 255, 0.5)`,
              animation: `orbit ${4 + i * 0.5}s linear infinite`,
              transformOrigin: `${-80 - i * 20}px 0`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Logo with border loading effect */}
      <div className={`relative transition-all duration-700 ${phase === "complete" ? "scale-110" : "scale-100"}`}>
        {/* SVG Logo with animated border */}
        <svg viewBox="0 0 100 100" className="w-40 h-40 relative z-10">
          <defs>
            <linearGradient id="loadBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#00a0ff" />
              <stop offset="100%" stopColor="#0080ff" />
            </linearGradient>
            <linearGradient id="loadMKGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e0ff" />
              <stop offset="50%" stopColor="#00b0ff" />
              <stop offset="100%" stopColor="#0090ff" />
            </linearGradient>
            <filter id="loadGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background hexagon track */}
          <path d={hexagonPath} fill="rgba(0, 150, 255, 0.05)" stroke="rgba(0, 150, 255, 0.15)" strokeWidth="2" />

          {/* Animated loading border */}
          <path
            d={hexagonPath}
            fill="none"
            stroke="url(#loadBorderGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={hexagonPerimeter}
            strokeDashoffset={strokeDashoffset}
            filter="url(#strongGlow)"
            className="transition-all duration-100"
          />

          {/* Inner hexagon */}
          <path
            d="M50,15 L80,32.5 L80,67.5 L50,85 L20,67.5 L20,32.5 Z"
            fill="rgba(0, 100, 180, 0.1)"
            stroke="rgba(0, 180, 255, 0.3)"
            strokeWidth="1"
          />

          {/* M letter - stylized */}
          <g filter="url(#loadGlow)">
            <path
              d="M25 72 L25 32 L25 32 Q25 28 28 30 L42 52 Q44 55 46 52 L60 30 Q63 28 63 32 L63 72"
              stroke="url(#loadMKGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={phase === "complete" ? "opacity-100" : "opacity-90"}
            />
          </g>

          {/* K letter - stylized */}
          <g filter="url(#loadGlow)">
            <path d="M68 72 L68 28" stroke="url(#loadMKGradient)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M68 50 L82 30" stroke="url(#loadMKGradient)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M68 50 L85 72" stroke="url(#loadMKGradient)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          {/* Corner accent dots */}
          <circle cx="50" cy="5" r="3" fill="#00d4ff" filter="url(#loadGlow)" className="animate-pulse" />
          <circle
            cx="90"
            cy="50"
            r="2.5"
            fill="#00b0ff"
            filter="url(#loadGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <circle
            cx="50"
            cy="95"
            r="3"
            fill="#0090ff"
            filter="url(#loadGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <circle
            cx="10"
            cy="50"
            r="2.5"
            fill="#00c0ff"
            filter="url(#loadGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.9s" }}
          />

          {/* Sound wave bars at bottom */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={38 + i * 6}
              y={78}
              width="3"
              height="8"
              rx="1.5"
              fill={`rgba(0, ${200 + i * 10}, 255, 0.8)`}
              className="animate-sound-wave"
              style={{
                animationDelay: `${i * 0.15}s`,
                transformOrigin: `${39.5 + i * 6}px 82px`,
              }}
            />
          ))}
        </svg>

        {/* Glow behind logo */}
        <div
          className="absolute inset-0 -z-10 blur-2xl"
          style={{
            background: "radial-gradient(circle, rgba(0, 180, 255, 0.4) 0%, transparent 70%)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00d4ff 0%, #00a0ff 50%, #0080ff 100%)",
            boxShadow: "0 0 20px rgba(0, 180, 255, 0.5)",
          }}
        />
      </div>

      {/* Progress percentage */}
      <div className="mt-4 text-cyan-400/60 font-mono text-sm tabular-nums tracking-wider">{Math.round(progress)}%</div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(-80px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(-80px) rotate(-360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
