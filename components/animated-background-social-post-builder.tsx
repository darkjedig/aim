"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundSocialPostBuilder() {
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
      color: string;
      vx: number;
      vy: number;
      icon: string;
    }> = []

    const socialIcons = ['📱', '💬', '👍', '🔁', '❤️']

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        size: Math.random() * 20 + 10,
        color: `hsl(${Math.random() * 60 + 280}, 100%, 70%)`,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        icon: socialIcons[Math.floor(Math.random() * socialIcons.length)]
      }
    }

    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        ctx.font = `${particle.size}px Arial`
        ctx.fillText(particle.icon, particle.x, particle.y)

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    drawParticles()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}