"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundImageUpscaler() {
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

    const icons: Array<{
      x: number;
      y: number;
      size: number;
      maxSize: number;
      growthRate: number;
      speedX: number;
      speedY: number;
    }> = []

    const createIcon = () => {
      const size = Math.random() * 20 + 10
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        maxSize: size * 2,
        growthRate: 0.2,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1
      }
    }

    for (let i = 0; i < 20; i++) {
      icons.push(createIcon())
    }

    const drawIcon = (x: number, y: number, size: number) => {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)' // pink-500 with low opacity
      ctx.lineWidth = 2

      // Outer square
      ctx.strokeRect(x - size/2, y - size/2, size, size)

      // Inner dotted square
      ctx.setLineDash([2, 2])
      ctx.strokeRect(x - size/4, y - size/4, size/2, size/2)
      ctx.setLineDash([])
    }

    const drawIcons = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      icons.forEach((icon) => {
        drawIcon(icon.x, icon.y, icon.size)

        icon.x += icon.speedX
        icon.y += icon.speedY
        icon.size += icon.growthRate

        if (icon.size > icon.maxSize || icon.size < icon.maxSize / 2) {
          icon.growthRate *= -1
        }

        if (icon.x < 0 || icon.x > canvas.width) icon.speedX *= -1
        if (icon.y < 0 || icon.y > canvas.height) icon.speedY *= -1
      })

      animationFrameId = requestAnimationFrame(drawIcons)
    }

    resizeCanvas()
    drawIcons()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}