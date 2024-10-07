"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundSocialTopicFinder } from '@/components/animated-background-social-topic-finder'
import { SocialTopicFinderForm } from './components/social-topic-finder-form'
import { SocialTopicResults } from './components/social-topic-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Loader2 } from "lucide-react"

export type SocialTopic = {
  title: string;
  description: string;
  platform: string;
  engagement: number;
}

export default function SocialTopicFinderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<SocialTopic[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTopics([
      { 
        title: "5 AI Tools Revolutionizing Social Media Marketing", 
        description: "Explore cutting-edge AI tools that are transforming how brands engage with their audience on social media.",
        platform: "LinkedIn",
        engagement: 89
      },
      { 
        title: "The Rise of Video Content: Why Your Brand Needs to Embrace It Now", 
        description: "Discover why video content is dominating social media and how your brand can leverage it for maximum impact.",
        platform: "Instagram",
        engagement: 95
      },
      { 
        title: "Sustainable Marketing: How to Build an Eco-Friendly Brand Image", 
        description: "Learn strategies to incorporate sustainability into your marketing efforts and appeal to environmentally conscious consumers.",
        platform: "Twitter",
        engagement: 82
      },
    ])
    setIsLoading(false)
  }

  const handleCreatePost = (topic: SocialTopic) => {
    // This function will be implemented to send the topic to the post builder page
    console.log("Creating post for:", topic)
    // Here you would typically use a router or state management to navigate to the post builder page
    // and set the post title and content with the selected topic
  }

  const handleWatchDemo = () => {
    // This function will be implemented to play the demo video
    console.log("Playing demo video")
    // Here you would typically open a modal or navigate to a video player page
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundSocialTopicFinder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Social Topic Finder
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover trending topics and create engaging social media content that resonates with your audience. Our AI analyzes popular posts and your competitors to suggest the most impactful ideas for your social strategy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
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
          <SocialTopicFinderForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex justify-center items-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          )}
          
          {topics.length > 0 && (
            <SocialTopicResults topics={topics} onCreatePost={handleCreatePost} />
          )}
        </div>
      </main>
    </div>
  )
}