"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, LinkIcon, FileDown, Download, Save } from "lucide-react"
import { TiptapEditor } from './tiptap-editor'

interface BlogResultsProps {
  isLoading: boolean;
  error: string | null;
  blogPost: { title: string; content: string; metaDescription: string } | null;
  onEditorChange: (content: string) => void;
}

export function BlogResults({ isLoading, error, blogPost, onEditorChange }: BlogResultsProps) {
  const handleSendToInternalLinkOptimizer = () => {
    console.log("Sending to Internal Link Optimizer:", blogPost?.content)
    // Implement the logic to send the content to the Internal Link Optimizer
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
        {error}
      </div>
    )
  }

  if (!blogPost) {
    return null
  }

  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generated Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TiptapEditor content={blogPost.content} onChange={onEditorChange} />
          <div>
            <Label htmlFor="generated-meta-description" className="text-gray-200">Meta Description</Label>
            <Textarea
              id="generated-meta-description"
              value={blogPost.metaDescription}
              className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            />
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col items-center space-y-4">
        <Button 
          onClick={handleSendToInternalLinkOptimizer}
          className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg"
        >
          <LinkIcon className="mr-2 h-5 w-5" />
          Send to Internal Link Optimizer
        </Button>
        <div className="flex justify-center space-x-4 w-full">
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
    </motion.div>
  )
}