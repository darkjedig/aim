"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundStrategyBuilder() {
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

    const lines: {
      x: number;
      y: number;
      length: number;
      speed: number;
      thickness: number;
      color: string;
    }[] = []
    const lineCount = 50

    const initLines = () => {
      for (let i = 0; i < lineCount; i++) {
        lines.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 50 + 50,
          speed: Math.random() * 2 + 1,
          thickness: Math.random() * 2 + 1,
          color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 255}, 0.5)`
        })
      }
    }

    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      lines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.length, line.y)
        ctx.strokeStyle = line.color
        ctx.lineWidth = line.thickness
        ctx.stroke()

        line.x += line.speed
        if (line.x > canvas.width) {
          line.x = -line.length
          line.y = Math.random() * canvas.height
        }
      })

      animationFrameId = requestAnimationFrame(drawLines)
    }

    resizeCanvas()
    initLines()
    drawLines()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initLines()
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}