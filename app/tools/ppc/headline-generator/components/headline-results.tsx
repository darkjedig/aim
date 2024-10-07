"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { Headline, platformInfo } from '../page'

interface HeadlineResultsProps {
  headlines: Headline[];
}

export function HeadlineResults({ headlines }: HeadlineResultsProps) {
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

  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generated Headlines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {headlines.map((headline, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-4">
                    <h3 className="text-lg font-semibold text-purple-400">{headline.text}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Platform: {platformInfo[headline.platform as keyof typeof platformInfo].name} | 
                      Character Count: {headline.characterCount} / {platformInfo[headline.platform as keyof typeof platformInfo].maxLength}
                    </p>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{width: `${Math.min((headline.characterCount / platformInfo[headline.platform as keyof typeof platformInfo].maxLength) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(headline.text, index)}
                    className="text-gray-400 hover:text-white flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedIndex === index && (
                  <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}