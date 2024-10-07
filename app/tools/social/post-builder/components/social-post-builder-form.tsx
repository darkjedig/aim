"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Zap } from "lucide-react"
import { platformInfo } from '../page'

interface SocialPostBuilderFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  useEmojis: boolean;
  setUseEmojis: (use: boolean) => void;
}

export function SocialPostBuilderForm({ 
  onSubmit, 
  isLoading, 
  selectedPlatform, 
  setSelectedPlatform, 
  useEmojis, 
  setUseEmojis 
}: SocialPostBuilderFormProps) {
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
        Generate Your Social Media Post
      </motion.h2>
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="platform" className="text-gray-200">Select Platform</Label>
          <Select 
            name="platform" 
            value={selectedPlatform} 
            onValueChange={setSelectedPlatform}
          >
            <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
              {Object.entries(platformInfo).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="topic" className="text-gray-200">Post Topic</Label>
          <Input
            id="topic"
            name="topic"
            placeholder="Enter the main topic of your post"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="keywords" className="text-gray-200">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            name="keywords"
            placeholder="Enter relevant keywords"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="tone" className="text-gray-200">Tone of Voice</Label>
          <Select name="tone">
            <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="callToAction" className="text-gray-200">Call to Action</Label>
          <Input
            id="callToAction"
            name="callToAction"
            placeholder="e.g., 'Learn more', 'Sign up now', 'Shop today'"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="use-emojis"
            checked={useEmojis}
            onCheckedChange={setUseEmojis}
          />
          <Label htmlFor="use-emojis" className="text-gray-200">Use Emojis</Label>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          {isLoading ? 'Generating Post...' : 'Generate Post'}
        </Button>
      </motion.form>
    </motion.div>
  )
}