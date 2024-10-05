"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundOutrank() {
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

    const points: Array<{x: number; y: number}> = []
    const totalPoints = 10
    const animationDuration = 5000 // 5 seconds
    let startTime: number

    const initPoints = () => {
      points.length = 0
      for (let i = 0; i < totalPoints; i++) {
        points.push({
          x: (i / (totalPoints - 1)) * canvas.width,
          y: canvas.height - (i / (totalPoints - 1)) * canvas.height
        })
      }
    }

    const drawTrendLine = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        const point = points[i]
        ctx.lineTo(point.x, point.y + Math.sin(progress * Math.PI * 2 + i * 0.5) * 20)
      }

      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)' // Light purple color
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw glowing points
      points.forEach((point, index) => {
        const pointProgress = (progress + index / points.length) % 1
        const opacity = Math.sin(pointProgress * Math.PI)
        
        ctx.beginPath()
        ctx.arc(point.x, point.y + Math.sin(progress * Math.PI * 2 + index * 0.5) * 20, 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.fill()
      })
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / animationDuration

      drawTrendLine(progress % 1)

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initPoints()
    animate(0)

    window.addEventListener('resize', () => {
      resizeCanvas()
      initPoints()
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}