"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Copy } from "lucide-react"
import { Description, platformInfo } from '../page'

interface DescriptionResultsProps {
  descriptions: Description[];
}

export function DescriptionResults({ descriptions }: DescriptionResultsProps) {
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
          <CardTitle className="text-2xl font-bold text-white">Generated Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {descriptions.map((description, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-4">
                    <h3 className="text-lg font-semibold text-purple-400">{description.text}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Platform: {platformInfo[description.platform as keyof typeof platformInfo].name} | 
                      Character Count: {description.characterCount} / {platformInfo[description.platform as keyof typeof platformInfo].maxLength}
                    </p>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{width: `${Math.min((description.characterCount / platformInfo[description.platform as keyof typeof platformInfo].maxLength) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(description.text, index)}
                    className="text-gray-400 hover:text-white flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {description.characterCount > platformInfo[description.platform as keyof typeof platformInfo].maxLength && (
                  <div className="mt-2 flex items-center text-yellow-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">This description exceeds the character limit for the selected platform.</span>
                  </div>
                )}
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