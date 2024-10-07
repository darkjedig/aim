"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundImageUpscaler } from '@/components/animated-background-image-upscaler'
import { ImageUpscalerForm } from './components/image-upscaler-form'
import { ProcessedImage } from './components/processed-image'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function ImageUpscalerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scale, setScale] = useState(2)
  const [faceEnhance, setFaceEnhance] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setProcessedImage(null) // Reset processed image when a new image is uploaded
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpscale = async () => {
    if (!uploadedImage) return

    setIsLoading(true)
    // Simulating API call to image upscaling service
    await new Promise(resolve => setTimeout(resolve, 3000))
    // For demonstration, we're just using the same image. In a real scenario, this would be the upscaled image.
    setProcessedImage(uploadedImage)
    setIsLoading(false)
  }

  const handleWatchDemo = () => {
    console.log("Playing demo video")
    // Here you would typically open a modal or navigate to a video player page
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundImageUpscaler />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Image Upscaler
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Enhance your images with our cutting-edge AI technology. Upscale and improve image quality with just a few clicks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <ImageUpscalerForm
            uploadedImage={uploadedImage}
            handleImageUpload={handleImageUpload}
            scale={scale}
            setScale={setScale}
            faceEnhance={faceEnhance}
            setFaceEnhance={setFaceEnhance}
            handleUpscale={handleUpscale}
            isLoading={isLoading}
          />
          
          {processedImage && (
            <ProcessedImage processedImage={processedImage} />
          )}
        </div>
      </main>
    </div>
  )
}