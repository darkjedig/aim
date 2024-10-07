"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PenTool, Save, Download } from "lucide-react"
import { SocialTopic } from '../page'

interface SocialTopicResultsProps {
  topics: SocialTopic[];
  onCreatePost: (topic: SocialTopic) => void;
}

export function SocialTopicResults({ topics, onCreatePost }: SocialTopicResultsProps) {
  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Suggested Social Media Topics</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 border-0 overflow-hidden relative group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/20 flex flex-col h-full">
              <CardHeader className="pb-4 px-6">
                <CardTitle className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 break-words">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pb-4 px-6">
                <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{topic.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>Platform: {topic.platform}</span>
                  <span>Engagement Score: {topic.engagement}%</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Button 
                  onClick={() => onCreatePost(topic)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-300 flex items-center justify-center"
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
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
    </motion.div>
  )
}