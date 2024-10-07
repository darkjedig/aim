"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundDescriptionWriter } from '@/components/animated-background-description-writer'
import { DescriptionWriterForm } from './components/description-writer-form'
import { DescriptionResults } from './components/description-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export type Description = {
  text: string;
  platform: string;
  characterCount: number;
}

export const platformInfo = {
  'google-search': { maxLength: 90, name: 'Google Search Ads' },
  'google-display': { maxLength: 90, name: 'Google Display Ads' },
  'facebook': { maxLength: 125, name: 'Facebook Ads' },
  'instagram': { maxLength: 125, name: 'Instagram Ads' },
  'twitter': { maxLength: 280, name: 'Twitter Ads' },
  'linkedin': { maxLength: 150, name: 'LinkedIn Ads' },
}

export default function DescriptionWriterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [descriptions, setDescriptions] = useState<Description[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('google-search')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const productName = formData.get('productName') as string
    const productDescription = formData.get('productDescription') as string
    const targetAudience = formData.get('targetAudience') as string
    const uniqueSellingPoint = formData.get('uniqueSellingPoint') as string
    const callToAction = formData.get('callToAction') as string

    try {
      // Simulating API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response
      const mockDescriptions: Description[] = [
        { text: `Discover ${productName}: The ultimate solution for ${targetAudience}. ${uniqueSellingPoint} ${callToAction}`, platform: selectedPlatform, characterCount: 85 },
        { text: `Transform your experience with ${productName}. Designed for ${targetAudience}, it offers ${uniqueSellingPoint}. Don't wait, ${callToAction} today!`, platform: selectedPlatform, characterCount: 120 },
        { text: `${productName}: Empowering ${targetAudience} with innovative solutions. ${uniqueSellingPoint} Experience the difference - ${callToAction} now!`, platform: selectedPlatform, characterCount: 110 },
        { text: `Unlock your potential with ${productName}. Perfect for ${targetAudience}, it provides ${uniqueSellingPoint}. Ready to transform? ${callToAction}`, platform: selectedPlatform, characterCount: 115 },
        { text: `${targetAudience}, meet your match: ${productName}. With ${uniqueSellingPoint}, success is just a click away. ${callToAction} and see the results!`, platform: selectedPlatform, characterCount: 125 },
      ]

      setDescriptions(mockDescriptions)
    } catch (err) {
      console.error('Error generating descriptions:', err)
      setError('An error occurred while generating descriptions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundDescriptionWriter />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              PPC Description Writer
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Craft compelling ad descriptions for your PPC campaigns across multiple platforms. Maximize your ad effectiveness with AI-powered description suggestions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <DescriptionWriterForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
              {error}
            </div>
          )}
          
          {descriptions.length > 0 && (
            <DescriptionResults descriptions={descriptions} />
          )}
        </div>
      </main>
    </div>
  )
}