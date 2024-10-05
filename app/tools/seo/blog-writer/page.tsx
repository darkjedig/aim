"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundBlogWriter } from '@/components/animated-background-blog-writer'
import { BlogForm } from './components/blog-form'
import { BlogResults } from './components/blog-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function BlogWriterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [blogPost, setBlogPost] = useState<{ title: string; content: string; metaDescription: string } | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setBlogPost({
        title: "10 Effective SEO Strategies for Small Businesses",
        content: `
          <h1>10 Effective SEO Strategies for Small Businesses</h1>
          
          <p>In today's digital landscape, having a strong online presence is crucial for small businesses. Search Engine Optimization (SEO) plays a pivotal role in improving visibility and attracting potential customers. This blog post will explore 10 effective SEO strategies that small businesses can implement to boost their online presence and drive organic traffic.</p>
          
          <h2>1. Conduct Thorough Keyword Research</h2>
          <p>Start by identifying relevant keywords for your business. Use tools like Google Keyword Planner or SEMrush to find high-volume, low-competition keywords.</p>
          
          <h2>2. Optimize On-Page Elements</h2>
          <p>Ensure your website's meta titles, descriptions, headers, and content are optimized with your target keywords.</p>
          
          <h2>3. Create High-Quality, Relevant Content</h2>
          <p>Regularly publish valuable content that addresses your audience's needs and incorporates your target keywords naturally.</p>
          
          <h2>4. Improve Website Speed and Mobile Responsiveness</h2>
          <p>Optimize your website's loading speed and ensure it's mobile-friendly to improve user experience and search engine rankings.</p>
          
          <h2>5. Build High-Quality Backlinks</h2>
          <p>Develop a link-building strategy to acquire backlinks from reputable websites in your industry.</p>
          
          <h2>Conclusion</h2>
          <p>Implementing these SEO strategies can significantly improve your small business's online visibility and attract more potential customers. Remember that SEO is an ongoing process, and consistency is key to achieving long-term success. Start applying these tactics today and watch your online presence grow!</p>
        `,
        metaDescription: "Discover 10 effective SEO strategies for small businesses to improve online visibility, attract more customers, and boost organic traffic. Start optimizing today!"
      })
    } catch (err) {
      console.error('Error generating blog post:', err)
      setError('An error occurred while generating the blog post. Please try again.')
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
          <AnimatedBackgroundBlogWriter />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Blog Writer
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create SEO-optimized blog posts in minutes with our advanced AI technology. Generate engaging content that resonates with your audience and boosts your online presence.
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
          <BlogForm onSubmit={handleSubmit} />
          
          <BlogResults 
            isLoading={isLoading}
            error={error}
            blogPost={blogPost}
            onEditorChange={handleEditorChange}
          />
        </div>
      </main>
    </div>
  )
}