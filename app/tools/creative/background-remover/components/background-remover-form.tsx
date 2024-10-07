"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Eraser } from "lucide-react"

interface BackgroundRemoverFormProps {
  uploadedImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveBackground: () => void;
  isLoading: boolean;
}

export function BackgroundRemoverForm({
  uploadedImage,
  handleImageUpload,
  handleRemoveBackground,
  isLoading
}: BackgroundRemoverFormProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Remove Image Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="image-upload" className="text-gray-200">Upload Image</Label>
          <div className="mt-1 flex items-center space-x-4">
            <Button
              variant="outline"
              className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {uploadedImage && <span className="text-gray-300">Image uploaded</span>}
          </div>
        </div>
        {uploadedImage && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-200">Original Image</Label>
              <div className="mt-2 relative w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
                <img src={uploadedImage} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={handleRemoveBackground}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing Background...
                </>
              ) : (
                <>
                  <Eraser className="mr-2 h-4 w-4" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}