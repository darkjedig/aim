"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

interface BlogFormProps {
  onSubmit: (formData: {
    blogTitle: string;
    tone: string;
    language: string;
    internalLinks: string[];
    nlpKeywords: string[];
  }) => void;
  isAuthenticated: boolean;
  toolConfig: { credit_cost: number; ai_model: string } | null;
}

export function BlogForm({ onSubmit, isAuthenticated, toolConfig }: BlogFormProps) {
  const [blogTitle, setBlogTitle] = useState('')
  const [tone, setTone] = useState('')
  const [language, setLanguage] = useState('')
  const [internalLinks, setInternalLinks] = useState('')
  const [nlpKeywords, setNlpKeywords] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!blogTitle.trim()) newErrors.blogTitle = 'Blog title is required'
    if (!tone) newErrors.tone = 'Tone is required'
    if (!language) newErrors.language = 'Language is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      blogTitle,
      tone,
      language,
      internalLinks: internalLinks.split('\n').filter(url => url.trim() !== ''),
      nlpKeywords: nlpKeywords.split('\n').filter(keyword => keyword.trim() !== '')
    })
  }

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
        Create Your Blog Post
      </motion.h2>
      {toolConfig && (
        <p className="text-md mb-8 text-gray-400">
          Credit Cost: {toolConfig.credit_cost} | AI Model: {toolConfig.ai_model}
        </p>
      )}
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="blog-title" className="text-gray-200">Blog Title</Label>
          <Input
            id="blog-title"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Enter your blog title..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
          />
          {errors.blogTitle && <Alert variant="destructive"><AlertDescription>{errors.blogTitle}</AlertDescription></Alert>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tone" className="text-gray-200">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
            {errors.tone && <Alert variant="destructive"><AlertDescription>{errors.tone}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="language" className="text-gray-200">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
            {errors.language && <Alert variant="destructive"><AlertDescription>{errors.language}</AlertDescription></Alert>}
          </div>
        </div>
        <div>
          <Label htmlFor="internal-links" className="text-gray-200">Internal Links (Optional)</Label>
          <Textarea
            id="internal-links"
            value={internalLinks}
            onChange={(e) => setInternalLinks(e.target.value)}
            placeholder="Paste a list of URLs from your site for internal linking..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="nlp-keywords" className="text-gray-200">NLP Keywords (Optional)</Label>
          <Textarea
            id="nlp-keywords"
            value={nlpKeywords}
            onChange={(e) => setNlpKeywords(e.target.value)}
            placeholder="Enter NLP keywords to be incorporated into the blog post..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            rows={3}
          />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          Generate Blog Post
        </Button>
      </motion.form>
    </motion.div>
  )
}
