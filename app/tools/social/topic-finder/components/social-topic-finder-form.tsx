"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Search } from "lucide-react"

interface SocialTopicFinderFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function SocialTopicFinderForm({ onSubmit, isLoading }: SocialTopicFinderFormProps) {
  return (
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
        Find Your Next Viral Social Post
      </motion.h2>
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="urls" className="text-gray-200">Source URLs</Label>
          <Textarea
            id="urls"
            placeholder="Enter URLs of popular social media posts or articles in your niche... (one per line)"
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            rows={5}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="platform" className="text-gray-200">Target Platform</Label>
            <Select>
              <SelectTrigger id="platform" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content-type" className="text-gray-200">Content Type</Label>
            <Select>
              <SelectTrigger id="content-type" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="text">Text Post</SelectItem>
                <SelectItem value="image">Image Post</SelectItem>
                <SelectItem value="video">Video Idea</SelectItem>
                <SelectItem value="story">Story/Reel Idea</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="keywords" className="text-gray-200">Target Keywords (optional)</Label>
          <Input
            id="keywords"
            placeholder="Enter keywords related to your content..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="trending-analysis" />
            <Label htmlFor="trending-analysis" className="text-gray-200">Analyze trending topics</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="competitor-analysis" />
            <Label htmlFor="competitor-analysis" className="text-gray-200">Include competitor analysis</Label>
          </div>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          {isLoading ? 'Analyzing Topics...' : 'Find Trending Topics'}
        </Button>
      </motion.form>
    </motion.div>
  )
}