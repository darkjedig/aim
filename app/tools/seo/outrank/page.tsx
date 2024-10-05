"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundOutrank } from '@/components/animated-background-outrank'
import { OutrankForm } from './components/outrank-form'
import { OutrankResults } from './components/outrank-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function OutrankPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    outline: string[];
    content: string;
    metaTitle: string;
    metaDescription: string;
  } | null>(null)
  const [editorContent, setEditorContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      setGeneratedContent({
        title: "10 Advanced SEO Strategies to Boost Your Website's Rankings in 2024",
        outline: [
          "1. Implement AI-powered content optimization",
          "2. Leverage natural language processing (NLP) for better keyword targeting",
          "3. Optimize for voice search and featured snippets",
          "4. Utilize schema markup for enhanced SERP features",
          "5. Improve Core Web Vitals for better user experience",
          "6. Implement a comprehensive internal linking strategy",
          "7. Create topic clusters and pillar pages",
          "8. Optimize for Google's E-A-T guidelines",
          "9. Leverage user-generated content for SEO",
          "10. Implement advanced local SEO tactics"
        ],
        content: `
          <h2>1. Implement AI-powered content optimization</h2>
          <p>Artificial Intelligence (AI) is revolutionizing the way we approach SEO. By leveraging AI-powered tools, you can analyze top-ranking content, identify gaps in your competitors' strategies, and create more comprehensive, targeted content that addresses user intent more effectively.</p>

          <h2>2. Leverage natural language processing (NLP) for better keyword targeting</h2>
          <p>Natural Language Processing allows search engines to better understand the context and intent behind search queries. By optimizing your content for NLP, you can improve your rankings for long-tail keywords and voice search queries, which are becoming increasingly important in the SEO landscape.</p>

          <h3>Key NLP optimization techniques:</h3>
          <ul>
            <li>Use semantically related keywords</li>
            <li>Focus on topic modeling rather than keyword density</li>
            <li>Implement structured data markup</li>
          </ul>

          <h2>3. Optimize for voice search and featured snippets</h2>
          <p>With the rise of voice-activated devices, optimizing for voice search has become crucial. Additionally, securing featured snippets can significantly increase your visibility in search results. Focus on providing clear, concise answers to common questions in your niche.</p>

          <!-- More content for other sections would go here -->
        `,
        metaTitle: "10 Advanced SEO Strategies for 2024: Boost Your Rankings | YourSite",
        metaDescription: "Discover 10 cutting-edge SEO strategies to skyrocket your website's rankings in 2024. Learn how to leverage AI, NLP, and advanced tactics for unparalleled results.",
      })
    } catch (err) {
      console.error('Error generating content:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundOutrank />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Outrank Your Competitors
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create content that outranks your competitors by improving on their top pages. Our AI-powered tool analyzes competitor content and generates superior, SEO-optimized articles.
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
          <OutrankForm onSubmit={handleSubmit} />
          
          <OutrankResults 
            isLoading={isLoading}
            generatedContent={generatedContent}
            onEditorChange={handleEditorChange}
          />
        </div>
      </main>
    </div>
  )
}