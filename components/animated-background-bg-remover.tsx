"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundBgRemover() {
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

    const erasers: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      rotation: number;
      vr: number;
    }> = []

    const createEraser = (x: number, y: number) => {
      return {
        x,
        y,
        size: Math.random() * 30 + 20,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.1
      }
    }

    for (let i = 0; i < 15; i++) {
      erasers.push(createEraser(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    const drawErasers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      erasers.forEach((eraser) => {
        ctx.save()
        ctx.translate(eraser.x, eraser.y)
        ctx.rotate(eraser.rotation)
        
        // Draw eraser shape
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)' // Light pink color with low opacity
        ctx.beginPath()
        ctx.moveTo(-eraser.size / 2, -eraser.size / 4)
        ctx.lineTo(eraser.size / 2, -eraser.size / 4)
        ctx.lineTo(eraser.size / 2, eraser.size / 4)
        ctx.lineTo(-eraser.size / 2, eraser.size / 4)
        ctx.closePath()
        ctx.fill()

        // Draw eraser top
        ctx.fillStyle = 'rgba(236, 72, 153, 0.3)' // Slightly darker for the top
        ctx.beginPath()
        ctx.moveTo(-eraser.size / 2, -eraser.size / 4)
        ctx.lineTo(eraser.size / 2, -eraser.size / 4)
        ctx.lineTo(eraser.size / 2, -eraser.size / 3)
        ctx.lineTo(-eraser.size / 2, -eraser.size / 3)
        ctx.closePath()
        ctx.fill()

        ctx.restore()

        eraser.x += eraser.vx
        eraser.y += eraser.vy
        eraser.rotation += eraser.vr

        if (eraser.x < 0 || eraser.x > canvas.width) eraser.vx *= -1
        if (eraser.y < 0 || eraser.y > canvas.height) eraser.vy *= -1
      })

      animationFrameId = requestAnimationFrame(drawErasers)
    }

    resizeCanvas()
    drawErasers()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden="true" />
}