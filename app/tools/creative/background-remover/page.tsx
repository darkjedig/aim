"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundBgRemover } from '@/components/animated-background-bg-remover'
import { BackgroundRemoverForm } from './components/background-remover-form'
import { ProcessedImage } from './components/processed-image'

export default function BackgroundRemoverPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return

    setIsLoading(true)
    // Simulating API call to background removal service
    await new Promise(resolve => setTimeout(resolve, 3000))
    // For demonstration, we're just using the same image. In a real scenario, this would be the processed image.
    setProcessedImage(uploadedImage)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundBgRemover />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Background Remover
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Remove backgrounds from your images with just one click. Our AI-powered tool makes it quick and easy to create professional-looking images.
            </motion.p>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <BackgroundRemoverForm
            uploadedImage={uploadedImage}
            handleImageUpload={handleImageUpload}
            handleRemoveBackground={handleRemoveBackground}
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