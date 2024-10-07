"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundDescriptionWriter() {
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

    const words = ['Compelling', 'Engaging', 'Persuasive', 'Effective', 'Powerful', 'PPC', 'Clicks', 'CTR', 'Leads', 'Conversions', 'ROI', 'Ad Copy', 'Keywords']
    const particles: Array<{
      x: number;
      y: number;
      word: string;
      opacity: number;
      speed: number;
    }> = []

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        word: words[Math.floor(Math.random() * words.length)],
        opacity: Math.random() * 0.2 + 0.1, // Reduced opacity range
        speed: Math.random() * 0.5 + 0.1
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        ctx.font = '16px Arial'
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fillText(particle.word, particle.x, particle.y)

        particle.y -= particle.speed
        if (particle.y < 0) {
          particle.y = canvas.height
          particle.x = Math.random() * canvas.width
        }
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