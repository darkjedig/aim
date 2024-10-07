"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface ProcessedImageProps {
  processedImage: string;
}

export function ProcessedImage({ processedImage }: ProcessedImageProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'upscaled-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="mt-8 bg-gray-800 border-gray-700">
      <CardContent className="space-y-4">
        <div>
          <Label className="text-gray-200">Upscaled Image</Label>
          <div className="mt-2 relative w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
            <img src={processedImage} alt="Upscaled" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Upscaled Image
        </Button>
      </CardContent>
    </Card>
  )
}