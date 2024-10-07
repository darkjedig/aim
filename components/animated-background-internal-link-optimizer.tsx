"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundInternalLinkOptimizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 400 // Fixed height for the hero section
    }

    const linkIcons: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    const iconCount = 20

    for (let i = 0; i < iconCount; i++) {
      linkIcons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 20 + 10,
      })
    }

    const drawLinkIcons = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(76, 29, 149, 0.1)') // Dark purple with low opacity
      gradient.addColorStop(1, 'rgba(155, 39, 176, 0.1)') // Light purple with low opacity
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      linkIcons.forEach((icon) => {
        // Move the icon
        icon.x += icon.vx
        icon.y += icon.vy

        // Bounce off the edges
        if (icon.x < 0 || icon.x > canvas.width) icon.vx *= -1
        if (icon.y < 0 || icon.y > canvas.height) icon.vy *= -1

        // Draw the link icon
        ctx.save()
        ctx.translate(icon.x, icon.y)
        ctx.rotate(Math.atan2(icon.vy, icon.vx))
        ctx.fillStyle = 'rgba(147, 51, 234, 0.6)'
        ctx.beginPath()
        ctx.arc(0, 0, icon.size / 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-icon.size / 4, -icon.size / 4)
        ctx.lineTo(icon.size / 4, icon.size / 4)
        ctx.moveTo(-icon.size / 4, icon.size / 4)
        ctx.lineTo(icon.size / 4, -icon.size / 4)
        ctx.stroke()
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(drawLinkIcons)
    }

    resizeCanvas()
    drawLinkIcons()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}