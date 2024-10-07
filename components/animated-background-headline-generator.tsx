"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundHeadlineGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 400 // Set to 400px as requested
    }

    const words = ['Headline', 'PPC', 'Ads', 'Copy', 'Convert', 'Click', 'Engage']
    const particles: Array<{
      x: number;
      y: number;
      word: string;
      speed: number;
      size: number;
      color: string;
    }> = []

    const createParticles = () => {
      particles.length = 0 // Clear existing particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          word: words[Math.floor(Math.random() * words.length)],
          speed: 0.2 + Math.random() * 0.5,
          size: 10 + Math.random() * 20,
          color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        ctx.font = `${particle.size}px Arial`
        ctx.fillStyle = particle.color
        ctx.fillText(particle.word, particle.x, particle.y)

        particle.y += particle.speed
        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    handleResize()
    drawParticles()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}