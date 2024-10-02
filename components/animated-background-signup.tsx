"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundSignup() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const pens: { x: number; y: number; angle: number; color: string }[] = []
    const penCount = 50

    for (let i = 0; i < penCount; i++) {
      pens.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * 360,
        color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.2})`
      })
    }

    const drawPen = (x: number, y: number, angle: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle * Math.PI / 180)
      ctx.fillStyle = color
      ctx.beginPath()
      
      // Pencil body
      ctx.moveTo(-2, -15)
      ctx.lineTo(2, -15)
      ctx.lineTo(3, 10)
      ctx.lineTo(-3, 10)
      ctx.closePath()
      ctx.fill()
      
      // Pencil tip
      ctx.beginPath()
      ctx.moveTo(-3, 10)
      ctx.lineTo(0, 15)
      ctx.lineTo(3, 10)
      ctx.closePath()
      ctx.fillStyle = '#FFD700' // Gold color for the tip
      ctx.fill()
      
      // Eraser
      ctx.beginPath()
      ctx.rect(-3, -18, 6, 3)
      ctx.fillStyle = '#FFC0CB' // Pink color for the eraser
      ctx.fill()
      
      ctx.restore()
    }

    const animatePens = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      pens.forEach((pen) => {
        drawPen(pen.x, pen.y, pen.angle, pen.color)
        pen.y += 0.5
        pen.angle += 0.2
        if (pen.y > canvas.height) {
          pen.y = -20
          pen.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(animatePens)
    }

    resizeCanvas()
    animatePens()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}