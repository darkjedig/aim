"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundImageGenerator } from '@/components/animated-background-image-generator'
import { ImageGeneratorForm } from './components/image-generator-form'
import { GeneratedImage } from './components/generated-image'

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('photo')
  const [aspectRatio, setAspectRatio] = useState('landscape')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    // Simulating API call to image generation service
    await new Promise(resolve => setTimeout(resolve, 3000))
    setGeneratedImage('/placeholder.svg?height=512&width=512')
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundImageGenerator />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Image Generator
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-white max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create stunning, unique images with the power of AI. Transform your ideas into visual masterpieces in seconds.
            </motion.p>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <ImageGeneratorForm
            prompt={prompt}
            setPrompt={setPrompt}
            style={style}
            setStyle={setStyle}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            uploadedImage={uploadedImage}
            handleImageUpload={handleImageUpload}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {generatedImage && (
            <GeneratedImage generatedImage={generatedImage} />
          )}
        </div>
      </main>
    </div>
  )
}