"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundSocialPostBuilder } from '@/components/animated-background-social-post-builder'
import { SocialPostBuilderForm } from './components/social-post-builder-form'
import { SocialPostResults } from './components/social-post-results'
import { Cpu, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export type SocialPost = {
  platform: string;
  title: string;
  content: string;
  hashtags: string[];
  imageUrl?: string;
}

export const platformInfo = {
  facebook: { maxLength: 63206, name: 'Facebook', icon: Facebook },
  instagram: { maxLength: 2200, name: 'Instagram', icon: Instagram },
  twitter: { maxLength: 280, name: 'Twitter', icon: Twitter },
  linkedin: { maxLength: 3000, name: 'LinkedIn', icon: Linkedin },
}

export default function SocialPostBuilderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('facebook')
  const [useEmojis, setUseEmojis] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const topic = formData.get('topic') as string
    const keywords = formData.get('keywords') as string
    const tone = formData.get('tone') as string
    const callToAction = formData.get('callToAction') as string

    try {
      // Simulating API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response
      const mockPost: SocialPost = {
        platform: selectedPlatform,
        title: `${useEmojis ? '🚀 ' : ''}Exciting News: ${topic}`,
        content: `${useEmojis ? '📢 ' : ''}We're thrilled to share our latest insights on ${topic}! Learn how this can transform your business. ${callToAction} ${useEmojis ? '🔥 ' : ''}Don't miss out!`,
        hashtags: keywords.split(',').map(k => k.trim()),
        imageUrl: '/placeholder.svg?height=300&width=400'
      }

      setGeneratedPosts([mockPost])
    } catch (err) {
      console.error('Error generating post:', err)
      setError('An error occurred while generating the post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundSocialPostBuilder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Social Post Builder
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create engaging, platform-optimized social media posts in seconds. Our AI analyzes best practices and trends to generate high-performing content tailored to your audience.
            </motion.p>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <SocialPostBuilderForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            useEmojis={useEmojis}
            setUseEmojis={setUseEmojis}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
              {error}
            </div>
          )}
          
          {generatedPosts.length > 0 && (
            <SocialPostResults posts={generatedPosts} />
          )}
        </div>
      </main>
    </div>
  )
}