"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface GeneratedImageProps {
  generatedImage: string;
}

export function GeneratedImage({ generatedImage }: GeneratedImageProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = 'generated-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generated Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-gray-700 rounded-lg overflow-hidden">
            <img src={generatedImage} alt="Generated image" className="absolute inset-0 w-full h-full object-contain" />
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-gray-600 hover:bg-purple-500 hover:text-white transition-colors"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}