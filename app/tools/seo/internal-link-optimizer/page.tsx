"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundInternalLinkOptimizer } from '@/components/animated-background-internal-link-optimizer'
import { TiptapEditor } from './components/tiptap-editor'
import { Button } from "@/components/ui/button"
import { FileDown, Download, Save, Play } from "lucide-react"

export default function InternalLinkOptimizerPage() {
  const [editorContent, setEditorContent] = useState('')

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  const handleWatchDemo = () => {
    // Implement the video watching functionality here
    console.log("Watch demo clicked")
    // You can open a modal, redirect to a video page, or implement any other video viewing logic
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundInternalLinkOptimizer />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Internal Link Optimizer
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Optimize your content's internal linking structure with AI-powered suggestions. Improve your site's SEO and user experience effortlessly.
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
          <motion.div 
            className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Optimize Your Content
            </motion.h2>
            <TiptapEditor content={editorContent} onChange={handleEditorChange} />
          </motion.div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-purple-300">
              <FileDown className="mr-2 h-4 w-4" />
              Export as Word
            </Button>
            <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-purple-300">
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-purple-300">
              <Save className="mr-2 h-4 w-4" />
              Save to Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}