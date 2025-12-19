"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  showText?: boolean
}

export function Logo({ size = "md", animated = false, showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-16 h-16", text: "text-3xl" },
    xl: { icon: "w-28 h-28", text: "text-5xl" },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`${s.icon} relative`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="mkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e0ff" />
                <stop offset="50%" stopColor="#00a0ff" />
                <stop offset="100%" stopColor="#0060ff" />
              </linearGradient>
              <linearGradient id="mkGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0080ff" />
                <stop offset="50%" stopColor="#00b0ff" />
                <stop offset="100%" stopColor="#00e0ff" />
              </linearGradient>
              <filter id="mkGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="mkGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer hexagon frame */}
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="url(#mkGradient)"
              strokeWidth="2.5"
              filter="url(#mkGlow)"
              className={animated ? "animate-pulse" : ""}
            />

            {/* Inner geometric shape */}
            <polygon
              points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
              fill="rgba(0, 150, 255, 0.1)"
              stroke="url(#mkGradient2)"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* M letter - stylized music wave design */}
            <g filter="url(#mkGlowStrong)">
              {/* M - Left vertical with curve */}
              <path
                d="M24 68 L24 38 Q24 32 28 35 L40 50"
                stroke="url(#mkGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* M - Center peak */}
              <path
                d="M40 50 Q44 56 48 50"
                stroke="url(#mkGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* M - Right side */}
              <path
                d="M48 50 L60 35 Q64 32 64 38 L64 68"
                stroke="url(#mkGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>

            {/* K letter - dynamic design */}
            <g filter="url(#mkGlowStrong)">
              {/* K - Vertical stroke */}
              <path d="M70 68 L70 32" stroke="url(#mkGradient2)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* K - Upper diagonal with arrow tip */}
              <path d="M70 50 L84 32" stroke="url(#mkGradient2)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* K - Lower diagonal */}
              <path d="M70 50 L86 68" stroke="url(#mkGradient2)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Music equalizer bars */}
            {animated && (
              <g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect
                    key={i}
                    x={32 + i * 9}
                    y={78}
                    width="4"
                    height="10"
                    rx="2"
                    fill={`rgba(0, ${180 + i * 15}, 255, 0.8)`}
                    className="animate-sound-wave"
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      transformOrigin: `${34 + i * 9}px 83px`,
                    }}
                  />
                ))}
              </g>
            )}

            {/* Corner energy dots */}
            <circle
              cx="50"
              cy="5"
              r="3"
              fill="#00e0ff"
              filter="url(#mkGlow)"
              className={animated ? "animate-pulse" : ""}
            />
            <circle
              cx="90"
              cy="50"
              r="2.5"
              fill="#00b0ff"
              filter="url(#mkGlow)"
              className={animated ? "animate-pulse" : ""}
              style={{ animationDelay: "0.3s" }}
            />
            <circle
              cx="50"
              cy="95"
              r="3"
              fill="#0080ff"
              filter="url(#mkGlow)"
              className={animated ? "animate-pulse" : ""}
              style={{ animationDelay: "0.6s" }}
            />
            <circle
              cx="10"
              cy="50"
              r="2.5"
              fill="#00c0ff"
              filter="url(#mkGlow)"
              className={animated ? "animate-pulse" : ""}
              style={{ animationDelay: "0.9s" }}
            />
          </svg>

          {/* Glow effect behind logo */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-[#00e0ff]/30 via-[#00a0ff]/20 to-[#0060ff]/30 blur-xl -z-10 ${animated ? "animate-pulse" : ""}`}
          />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${s.text} font-black bg-gradient-to-r from-[#00e0ff] via-[#00a0ff] to-[#0060ff] bg-clip-text text-transparent tracking-tight`}
          >
            MKhoa
          </span>
          {size === "xl" && <span className="text-sm text-cyan-300/50 tracking-[0.3em] uppercase">Web3 Music</span>}
        </div>
      )}
    </div>
  )
}
