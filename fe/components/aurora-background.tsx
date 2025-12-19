"use client"

import { useEffect, useRef } from "react"

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const drawEarth = (ctx: CanvasRenderingContext2D, time: number, w: number, h: number) => {
      const centerX = w / 2
      const centerY = h / 2
      const earthRadius = Math.min(w, h) * 0.25

      ctx.save()

      // Multiple outer glow layers for ocean blue effect
      const glowLayers = [
        { radius: earthRadius + 80, alpha: 0.03, color: "0, 150, 255" },
        { radius: earthRadius + 60, alpha: 0.05, color: "0, 180, 255" },
        { radius: earthRadius + 40, alpha: 0.08, color: "0, 200, 255" },
        { radius: earthRadius + 25, alpha: 0.12, color: "0, 220, 255" },
        { radius: earthRadius + 15, alpha: 0.18, color: "100, 200, 255" },
      ]

      glowLayers.forEach((layer) => {
        const glowGradient = ctx.createRadialGradient(centerX, centerY, earthRadius, centerX, centerY, layer.radius)
        glowGradient.addColorStop(0, `rgba(${layer.color}, ${layer.alpha})`)
        glowGradient.addColorStop(0.5, `rgba(${layer.color}, ${layer.alpha * 0.5})`)
        glowGradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(centerX, centerY, layer.radius, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()
      })

      // Animated pulse glow
      const pulseIntensity = 0.1 + Math.sin(time * 2) * 0.05
      const pulseGlow = ctx.createRadialGradient(centerX, centerY, earthRadius, centerX, centerY, earthRadius + 100)
      pulseGlow.addColorStop(0, `rgba(0, 200, 255, ${pulseIntensity})`)
      pulseGlow.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(centerX, centerY, earthRadius + 100, 0, Math.PI * 2)
      ctx.fillStyle = pulseGlow
      ctx.fill()

      // Earth base - dark core
      const earthGradient = ctx.createRadialGradient(
        centerX - earthRadius * 0.3,
        centerY - earthRadius * 0.3,
        0,
        centerX,
        centerY,
        earthRadius,
      )
      earthGradient.addColorStop(0, "#1a3a52")
      earthGradient.addColorStop(0.3, "#0f2840")
      earthGradient.addColorStop(0.7, "#0a1628")
      earthGradient.addColorStop(1, "#050d15")

      ctx.beginPath()
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2)
      ctx.fillStyle = earthGradient
      ctx.fill()

      // Ocean glow edge
      ctx.beginPath()
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 180, 255, 0.4)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Inner edge glow
      const edgeGlow = ctx.createRadialGradient(centerX, centerY, earthRadius - 10, centerX, centerY, earthRadius)
      edgeGlow.addColorStop(0, "transparent")
      edgeGlow.addColorStop(0.7, "rgba(0, 200, 255, 0.1)")
      edgeGlow.addColorStop(1, "rgba(0, 220, 255, 0.3)")
      ctx.beginPath()
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2)
      ctx.fillStyle = edgeGlow
      ctx.fill()

      // Rotating continents/land masses (simplified geometric shapes)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(time * 0.1)

      // Land masses with gradient
      const landColor = ctx.createLinearGradient(-earthRadius, 0, earthRadius, 0)
      landColor.addColorStop(0, "rgba(30, 80, 60, 0.6)")
      landColor.addColorStop(0.5, "rgba(40, 100, 70, 0.7)")
      landColor.addColorStop(1, "rgba(25, 70, 50, 0.6)")

      // Continent shapes
      const continents = [
        { x: -0.3, y: -0.2, w: 0.35, h: 0.3, rotation: 0.2 },
        { x: 0.2, y: 0.1, w: 0.25, h: 0.35, rotation: -0.3 },
        { x: -0.1, y: 0.35, w: 0.3, h: 0.2, rotation: 0.1 },
        { x: 0.4, y: -0.3, w: 0.2, h: 0.25, rotation: 0.4 },
        { x: -0.5, y: 0.1, w: 0.2, h: 0.15, rotation: -0.2 },
      ]

      continents.forEach((cont) => {
        ctx.save()
        ctx.rotate(cont.rotation)

        const x = cont.x * earthRadius
        const y = cont.y * earthRadius
        const w = cont.w * earthRadius
        const h = cont.h * earthRadius

        // Check if continent is visible (not on back side of Earth)
        const distFromCenter = Math.sqrt(x * x + y * y)
        if (distFromCenter < earthRadius * 0.85) {
          ctx.beginPath()
          ctx.ellipse(x, y, w / 2, h / 2, cont.rotation, 0, Math.PI * 2)
          ctx.fillStyle = landColor
          ctx.fill()
        }
        ctx.restore()
      })

      ctx.restore()

      // Connection lines from Earth
      const numConnections = 8
      for (let i = 0; i < numConnections; i++) {
        const angle = (i / numConnections) * Math.PI * 2 + time * 0.3
        const startX = centerX + Math.cos(angle) * (earthRadius + 5)
        const startY = centerY + Math.sin(angle) * (earthRadius + 5)
        const length = 50 + Math.sin(time * 2 + i) * 20
        const endX = centerX + Math.cos(angle) * (earthRadius + length)
        const endY = centerY + Math.sin(angle) * (earthRadius + length)

        const lineGradient = ctx.createLinearGradient(startX, startY, endX, endY)
        lineGradient.addColorStop(0, "rgba(0, 200, 255, 0.5)")
        lineGradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = lineGradient
        ctx.lineWidth = 1.5
        ctx.stroke()

        // End node
        ctx.beginPath()
        ctx.arc(endX, endY, 2 + Math.sin(time * 3 + i) * 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 220, 255, ${0.5 + Math.sin(time * 3 + i) * 0.3})`
        ctx.fill()
      }

      // Orbiting rings
      const drawOrbitRing = (radiusOffset: number, opacity: number, speed: number, dashLength: number) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(time * speed)

        ctx.beginPath()
        ctx.ellipse(0, 0, earthRadius + radiusOffset, (earthRadius + radiusOffset) * 0.3, Math.PI / 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 200, 255, ${opacity})`
        ctx.lineWidth = 1.5
        ctx.setLineDash([dashLength, dashLength * 2])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }

      drawOrbitRing(40, 0.3, 0.2, 10)
      drawOrbitRing(60, 0.2, -0.15, 15)
      drawOrbitRing(80, 0.15, 0.1, 20)

      // Satellite dots on orbits
      for (let i = 0; i < 3; i++) {
        const orbitRadius = earthRadius + 40 + i * 20
        const satelliteAngle = time * (0.3 - i * 0.05) + i * 2
        const satelliteX = centerX + Math.cos(satelliteAngle) * orbitRadius
        const satelliteY = centerY + Math.sin(satelliteAngle) * orbitRadius * 0.3

        // Satellite glow
        const satGlow = ctx.createRadialGradient(satelliteX, satelliteY, 0, satelliteX, satelliteY, 15)
        satGlow.addColorStop(0, "rgba(0, 220, 255, 0.8)")
        satGlow.addColorStop(0.5, "rgba(0, 180, 255, 0.3)")
        satGlow.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(satelliteX, satelliteY, 15, 0, Math.PI * 2)
        ctx.fillStyle = satGlow
        ctx.fill()

        ctx.beginPath()
        ctx.arc(satelliteX, satelliteY, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#00e0ff"
        ctx.fill()
      }

      ctx.restore()
    }

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.strokeStyle = "rgba(0, 150, 255, 0.03)"
      ctx.lineWidth = 1

      const gridSize = 60

      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
    }

    const drawMeshGradient = (ctx: CanvasRenderingContext2D, time: number, w: number, h: number) => {
      const blobs = [
        { x: 0.15, y: 0.2, r: 350, color: "0, 100, 180", speedX: 0.2, speedY: 0.15 },
        { x: 0.85, y: 0.3, r: 300, color: "0, 80, 150", speedX: -0.18, speedY: 0.12 },
        { x: 0.2, y: 0.8, r: 280, color: "20, 60, 120", speedX: 0.15, speedY: -0.2 },
        { x: 0.8, y: 0.75, r: 320, color: "0, 120, 200", speedX: -0.22, speedY: -0.15 },
      ]

      blobs.forEach((blob, i) => {
        const x = blob.x * w + Math.sin(time * blob.speedX + i * 1.5) * 60
        const y = blob.y * h + Math.cos(time * blob.speedY + i * 1.2) * 50

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.r)
        gradient.addColorStop(0, `rgba(${blob.color}, 0.08)`)
        gradient.addColorStop(0.5, `rgba(${blob.color}, 0.03)`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(x, y, blob.r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })
    }

    const animate = () => {
      time += 0.008

      // Clear with dark blue-ish background
      ctx.fillStyle = "#020810"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw layers
      drawGrid(ctx, canvas.width, canvas.height)
      drawMeshGradient(ctx, time, canvas.width, canvas.height)
      drawEarth(ctx, time, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </>
  )
}
