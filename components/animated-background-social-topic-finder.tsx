"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundSocialTopicFinder() {
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

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      color: string;
    }> = []

    const createParticles = () => {
      const particleCount = 20
      const minSize = 10
      const maxSize = 30

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speed: Math.random() * 0.5 + 0.1,
          angle: Math.random() * Math.PI * 2,
          color: `hsl(${Math.random() * 60 + 240}, 70%, 70%)`
        })
      }
    }

    const drawMagnifyingGlass = (x: number, y: number, size: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.strokeStyle = color
      ctx.lineWidth = size / 10

      // Draw circle
      ctx.beginPath()
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
      ctx.stroke()

      // Draw handle
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2)
      ctx.lineTo(size, size)
      ctx.stroke()

      ctx.restore()
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        drawMagnifyingGlass(particle.x, particle.y, particle.size, particle.color)

        particle.x += Math.cos(particle.angle) * particle.speed
        particle.y += Math.sin(particle.angle) * particle.speed

        if (particle.x < 0 || particle.x > canvas.width) particle.angle = Math.PI - particle.angle
        if (particle.y < 0 || particle.y > canvas.height) particle.angle = -particle.angle
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    createParticles()
    drawParticles()

    window.addEventListener('resize', () => {
      resizeCanvas()
      particles.length = 0
      createParticles()
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}