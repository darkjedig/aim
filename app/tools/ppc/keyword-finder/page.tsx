"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundKeywordFinder } from '@/components/animated-background-keyword-finder'
import { KeywordFinderForm } from './components/keyword-finder-form'
import { KeywordResults } from './components/keyword-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

type Keyword = {
  text: string;
  score: number;
  volume: number;
  cpc: number;
  competition: number;
}

export default function KeywordFinderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const description = formData.get('description') as string
    const industry = formData.get('industry') as string
    const targetAudience = formData.get('targetAudience') as string
    const goal = formData.get('goal') as string

    try {
      // Simulating API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response
      const mockKeywords: Keyword[] = [
        { text: "affordable digital marketing", score: 85, volume: 1000, cpc: 2.5, competition: 0.65 },
        { text: "small business SEO services", score: 78, volume: 800, cpc: 3.2, competition: 0.72 },
        { text: "local PPC management", score: 72, volume: 600, cpc: 2.8, competition: 0.58 },
        { text: "social media marketing agency", score: 80, volume: 1200, cpc: 3.5, competition: 0.8 },
        { text: "content marketing strategy", score: 75, volume: 900, cpc: 2.7, competition: 0.62 },
        { text: "email marketing services", score: 70, volume: 700, cpc: 2.3, competition: 0.55 },
        { text: "website optimization company", score: 68, volume: 500, cpc: 3.0, competition: 0.7 },
        { text: "online advertising experts", score: 82, volume: 1100, cpc: 3.8, competition: 0.75 },
        { text: "digital marketing consultation", score: 77, volume: 850, cpc: 3.3, competition: 0.68 },
        { text: "ROI-focused marketing services", score: 73, volume: 650, cpc: 2.9, competition: 0.6 },
      ]

      setKeywords(mockKeywords)
    } catch (err) {
      console.error('Error generating keywords:', err)
      setError('An error occurred while generating keywords. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundKeywordFinder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              PPC Keyword Finder
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover high-performing keywords for your PPC campaigns with our AI-powered tool. Boost your ad relevance and maximize your ROI.
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
          <KeywordFinderForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
              {error}
            </div>
          )}
          
          {keywords.length > 0 && (
            <KeywordResults keywords={keywords} />
          )}
        </div>
      </main>
    </div>
  )
}