"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundStrategyBuilder } from '@/components/animated-background-strategy-builder'
import { StrategyForm } from './components/strategy-form'
import { StrategyResults } from './components/strategy-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function StrategyBuilderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [strategy, setStrategy] = useState<Array<{
    cluster: string;
    keyword: string;
    intent: string;
    title: string;
    metaDescription: string;
  }>>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      setStrategy([
        {
          cluster: "Content Marketing",
          keyword: "content marketing strategy",
          intent: "Informational",
          title: "10 Steps to Create a Winning Content Marketing Strategy",
          metaDescription: "Learn how to develop an effective content marketing strategy in 10 easy steps. Boost your online presence and engage your audience today."
        },
        {
          cluster: "SEO Optimization",
          keyword: "on-page SEO techniques",
          intent: "Commercial",
          title: "Top 5 On-Page SEO Techniques to Boost Your Rankings",
          metaDescription: "Discover powerful on-page SEO techniques to improve your website's search engine rankings. Implement these strategies for better visibility."
        },
        {
          cluster: "Social Media Marketing",
          keyword: "social media engagement tips",
          intent: "Transactional",
          title: "7 Proven Social Media Engagement Tips to Grow Your Following",
          metaDescription: "Increase your social media engagement with these 7 expert tips. Learn how to grow your following and boost your online presence."
        }
      ])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundStrategyBuilder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Strategy Builder
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create comprehensive SEO content strategies tailored to your niche. Our AI analyses your main keyword and suggests Content hubs to help you build topical authority.
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
          <StrategyForm onSubmit={handleSubmit} />
          
          <StrategyResults isLoading={isLoading} strategy={strategy} />
        </div>
      </main>
    </div>
  )
}