"use client";
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Play, Search, PenTool, BarChart, Zap, Database, Share2, Image, Maximize, FileText } from "lucide-react"
import { AnimatedBackground } from '@/components/animated-background'
import Link from 'next/link'

export default function HomePage() {
  const toolCards = [
    { icon: Search, title: "SEO Topic Finder", description: "Discover high-ranking topics and keywords for your content strategy." },
    { icon: PenTool, title: "AI Content Writer", description: "Generate SEO-optimized blog posts and articles with ease." },
    { icon: BarChart, title: "Strategy Builder", description: "Create data-driven content strategies to boost your online presence." },
    { icon: Zap, title: "Outrank", description: "Analyze and outperform your competitors' content." },
    { icon: Database, title: "Internal Link Optimizer", description: "Improve your site structure and boost SEO with smart internal linking." },
    { icon: Share2, title: "Social Media Manager", description: "Schedule and analyze your social media posts across platforms." },
    { icon: FileText, title: "Ad Copy Generator", description: "Create compelling ad copy for your PPC campaigns." },
    { icon: Image, title: "AI Image Generator", description: "Generate unique images for your content and ads." },
    { icon: Maximize, title: "Image Upscaler", description: "Enhance and upscale your images without losing quality." },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px] w-full">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-powered Marketing Suite
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Revolutionize your marketing strategy with our cutting-edge AI tools
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Play className="mr-2 h-4 w-4" />
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gray-800 w-full">
          <div className="container mx-auto px-4">
            <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardContent className="p-8">
                <motion.div 
                  className="max-w-3xl mx-auto text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Unlock the Power of AI in Your Marketing
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    AIMarketer combines advanced artificial intelligence with years of marketing expertise to deliver unparalleled results. Our suite of tools empowers you to create content, analyze competitors, and optimize your strategies with unprecedented efficiency and accuracy.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-purple-400">10x</h3>
                      <p className="text-sm text-gray-400">Faster Content Creation</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-pink-400">300%</h3>
                      <p className="text-sm text-gray-400">Increase in Engagement</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-purple-400">50%</h3>
                      <p className="text-sm text-gray-400">Cost Reduction</p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4 w-full">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Our AI-Powered Tools</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {toolCards.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { 
                      type: "spring", 
                      stiffness: 300,
                      damping: 10
                    }
                  }}
                >
                  <Card className="bg-gray-800 border-0 overflow-hidden relative group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:animate-pulse">
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors duration-300">{tool.title}</CardTitle>
                      <CardDescription className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-800 w-full">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Ready to supercharge your marketing?</h2>
            <p className="text-xl mb-8 text-gray-300">Join thousands of marketers who are already using AI Marketer to transform their strategies.</p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}