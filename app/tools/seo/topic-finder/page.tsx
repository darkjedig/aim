"use client"

import { useState } from 'react'
import { AnimatedBackgroundTopicFinder } from '@/components/animated-background-topic-finder'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Download, Loader2, Save, PenTool, Play } from "lucide-react"

export default function TopicFinder() {
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<Array<{ title: string; description: string }>>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      setTopics([
        { title: "The Future of SEO in 2024", description: "Explore upcoming trends and technologies shaping the future of search engine optimization." },
        { title: "Content Optimization Strategies", description: "Learn effective techniques to optimize your content for better search engine rankings and user engagement." },
        { title: "Keyword Research Mastery", description: "Discover advanced methods for finding high-value keywords that drive traffic and conversions." },
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleWriteAboutThis = (topic: string) => {
    console.log("Writing about:", topic)
    // Implement navigation to blog writer page or open modal
  }

  const handleWatchVideo = () => {
    // Implement the video watching functionality here
    console.log("Watch video clicked")
    // You can open a modal, redirect to a video page, or implement any other video viewing logic
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundTopicFinder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AI-Powered Topic Finder
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Discover high-ranking topics and keywords for your content strategy
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={handleWatchVideo}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Find Your Next Winning Topic
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="urls" className="text-gray-200">Source URLs</Label>
                <Textarea
                  id="urls"
                  placeholder="Enter Source URLs here... (one per line)"
                  className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="niche" className="text-gray-200">Select Your Niche</Label>
                  <Select>
                    <SelectTrigger id="niche" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select a niche" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range" className="text-gray-200">Date Range</Label>
                  <Select>
                    <SelectTrigger id="date-range" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="competitor-analysis" className="border-gray-400 text-purple-500" />
                  <Label htmlFor="competitor-analysis" className="text-gray-200">Use competitor analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="trending-topics" className="border-gray-400 text-purple-500" />
                  <Label htmlFor="trending-topics" className="text-gray-200">Focus on trending topics</Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">Find Topics</Button>
            </form>
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          )}
          
          {topics.length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">Suggested Topics</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, index) => (
                  <Card key={index} className="bg-gray-800 border-0 overflow-hidden relative group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/20 flex flex-col h-full">
                    <CardHeader className="pb-4 px-6">
                      <CardTitle className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 break-words">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pb-4 px-6">
                      <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{topic.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 px-6 pb-6">
                      <Button 
                        onClick={() => handleWriteAboutThis(topic.title)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-300 flex items-center justify-center"
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Write about this
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
                  <Save className="mr-2 h-4 w-4" />
                  Save Topics
                </Button>
                <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
                  <Download className="mr-2 h-4 w-4" />
                  Export Topics
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}