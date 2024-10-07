"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackgroundImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 400
    }

    const images: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      type: 'icon' | 'frame';
    }> = []

    const createImage = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: Math.random() > 0.5 ? 'icon' : 'frame'
      }
    }

    for (let i = 0; i < 20; i++) {
      images.push(createImage())
    }

    const drawImage = (image: typeof images[0]) => {
      ctx.beginPath()
      if (image.type === 'icon') {
        ctx.moveTo(image.x, image.y)
        ctx.lineTo(image.x + image.size, image.y + image.size / 2)
        ctx.lineTo(image.x, image.y + image.size)
        ctx.closePath()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
      } else {
        ctx.rect(image.x, image.y, image.size, image.size)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.stroke()
      }
    }

    const animateImages = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      images.forEach((image) => {
        drawImage(image)

        image.x += image.vx
        image.y += image.vy

        if (image.x < 0 || image.x > canvas.width - image.size) image.vx *= -1
        if (image.y < 0 || image.y > canvas.height - image.size) image.vy *= -1
      })

      animationFrameId = requestAnimationFrame(animateImages)
    }

    resizeCanvas()
    animateImages()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}