"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundHeadlineGenerator } from '@/components/animated-background-headline-generator'
import { HeadlineGeneratorForm } from './components/headline-generator-form'
import { HeadlineResults } from './components/headline-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export type Headline = {
  text: string;
  platform: string;
  characterCount: number;
}

export const platformInfo = {
  'google-search': { maxLength: 30, name: 'Google Search Ads' },
  'google-display': { maxLength: 90, name: 'Google Display Ads' },
  'facebook': { maxLength: 40, name: 'Facebook Ads' },
  'instagram': { maxLength: 40, name: 'Instagram Ads' },
  'twitter': { maxLength: 70, name: 'Twitter Ads' },
  'linkedin': { maxLength: 150, name: 'LinkedIn Ads' },
}

export default function HeadlineGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [headlines, setHeadlines] = useState<Headline[]>([])
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

    try {
      // Simulating API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response
      const mockHeadlines: Headline[] = [
        { text: "Revolutionary Product for You", platform: selectedPlatform, characterCount: 29 },
        { text: "Transform Your Life with Our Innovation", platform: selectedPlatform, characterCount: 38 },
        { text: "Discover the Power of [Product Name]", platform: selectedPlatform, characterCount: 35 },
        { text: "Unleash Your Potential Today", platform: selectedPlatform, characterCount: 28 },
        { text: "The Solution You've Been Waiting For", platform: selectedPlatform, characterCount: 36 },
      ]

      setHeadlines(mockHeadlines)
    } catch (err) {
      console.error('Error generating headlines:', err)
      setError('An error occurred while generating headlines. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundHeadlineGenerator />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              PPC Headline Generator
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create compelling headlines for your PPC campaigns across multiple platforms. Boost your click-through rates and conversions with AI-powered headline suggestions.
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
          <HeadlineGeneratorForm 
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
          
          {headlines.length > 0 && (
            <HeadlineResults headlines={headlines} />
          )}
        </div>
      </main>
    </div>
  )
}