"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileDown, Download, Save } from "lucide-react"
import { TiptapEditor } from './tiptap-editor'

interface OutrankResultsProps {
  isLoading: boolean;
  generatedContent: {
    title: string;
    outline: string[];
    content: string;
    metaTitle: string;
    metaDescription: string;
  } | null;
  onEditorChange: (content: string) => void;
}

export function OutrankResults({ isLoading, generatedContent, onEditorChange }: OutrankResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!generatedContent) {
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
          <CardTitle className="text-2xl font-bold text-white">Generated Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="article-title" className="text-gray-200">Article Title</Label>
            <Input
              id="article-title"
              value={generatedContent.title}
              className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="content-outline" className="text-gray-200">Content Outline</Label>
            <Textarea
              id="content-outline"
              value={generatedContent.outline.join('\n')}
              className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
              rows={10}
            />
          </div>
          <div>
            <Label htmlFor="content-body" className="text-gray-200">Content Body</Label>
            <TiptapEditor content={generatedContent.content} onChange={onEditorChange} />
          </div>
          <div>
            <Label htmlFor="meta-title" className="text-gray-200">Meta Title</Label>
            <Input
              id="meta-title"
              value={generatedContent.metaTitle}
              className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="meta-description" className="text-gray-200">Meta Description</Label>
            <Textarea
              id="meta-description"
              value={generatedContent.metaDescription}
              className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            />
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <FileDown className="mr-2 h-4 w-4" />
          Export as Word
        </Button>
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <Save className="mr-2 h-4 w-4" />
          Save to Account
        </Button>
      </div>
    </motion.div>
  )
}