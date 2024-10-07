"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, AlertCircle, Cpu } from "lucide-react"
import { SocialPost, platformInfo } from '../page'

interface SocialPostResultsProps {
  posts: SocialPost[];
}

export function SocialPostResults({ posts }: SocialPostResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  const renderSocialPost = (post: SocialPost, index: number) => {
    const PlatformIcon = platformInfo[post.platform as keyof typeof platformInfo]?.icon || Cpu

    return (
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardHeader className="bg-gray-750 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlatformIcon className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg font-semibold text-white">
                {platformInfo[post.platform as keyof typeof platformInfo]?.name || 'Unknown Platform'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(`${post.title}\n\n${post.content}\n\n${post.hashtags.map(tag => `#${tag}`).join(' ')}`, index)}
              className="text-gray-400 hover:text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-xl font-bold text-white">{post.title}</h3>
          <p className="text-gray-300">{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post visual" className="w-full h-48 object-cover rounded-md" />
          )}
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          {platformInfo[post.platform as keyof typeof platformInfo] && (
            <>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full" 
                  style={{width: `${Math.min((post.content.length / platformInfo[post.platform as keyof typeof platformInfo].maxLength) * 100, 100)}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                Character Count: {post.content.length} / {platformInfo[post.platform as keyof typeof platformInfo].maxLength}
              </p>
              {post.content.length > platformInfo[post.platform as keyof typeof platformInfo].maxLength && (
                <div className="flex items-center text-yellow-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">This post exceeds the character limit for the selected platform.</span>
                </div>
              )}
            </>
          )}
          {copiedIndex === index && (
            <p className="text-green-400 text-sm">Copied to clipboard!</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-6">Generated Social Media Posts</h2>
      {posts.map((post, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {renderSocialPost(post, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}