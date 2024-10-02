"use client"

import { useRef, useEffect } from 'react'

export const AnimatedBackgroundTopicFinder = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const words = ['SEO', 'Content', 'Keywords', 'Rankings', 'Strategy', 'Topics', 'Research', 'Analytics', 'Optimization', 'Traffic']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let wordObjects: Array<{
      text: string
      x: number
      y: number
      dx: number
      dy: number
      fontSize: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = canvas.parentElement?.offsetHeight || 400
      initWords()
    }

    const initWords = () => {
      wordObjects = words.map(word => ({
        text: word,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        fontSize: Math.random() * 20 + 14
      }))
    }

    const drawWords = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      
      wordObjects.forEach((word) => {
        ctx.font = `${word.fontSize}px Arial`
        ctx.fillText(word.text, word.x, word.y)

        word.x += word.dx
        word.y += word.dy

        if (word.x < 0 || word.x > canvas.width - ctx.measureText(word.text).width) word.dx = -word.dx
        if (word.y < word.fontSize || word.y > canvas.height) word.dy = -word.dy
      })

      animationFrameId = requestAnimationFrame(drawWords)
    }

    resizeCanvas()
    drawWords()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}