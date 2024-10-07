"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"

interface ImageGeneratorFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  aspectRatio: string;
  setAspectRatio: (aspectRatio: string) => void;
  uploadedImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

export function ImageGeneratorForm({
  prompt,
  setPrompt,
  style,
  setStyle,
  aspectRatio,
  setAspectRatio,
  uploadedImage,
  handleImageUpload,
  handleGenerate,
  isLoading
}: ImageGeneratorFormProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Generate Your Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="prompt" className="text-white">Descriptive Text Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500 placeholder-gray-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="style" className="text-white">Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="animation">Animation</SelectItem>
              <SelectItem value="3d">3D</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="sketch">Sketch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white">Aspect Ratio</Label>
          <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex space-x-4 mt-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="landscape" id="landscape" className="border-white text-white" />
              <Label htmlFor="landscape" className="text-white">Landscape</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="portrait" id="portrait" className="border-white text-white" />
              <Label htmlFor="portrait" className="text-white">Portrait</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="image-upload" className="text-white">Upload Reference Image (optional)</Label>
          <div className="mt-1 flex items-center space-x-4">
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-gray-600 hover:bg-purple-500 hover:text-white transition-colors"
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
            {uploadedImage && <span className="text-white">Image uploaded</span>}
          </div>
        </div>
        {uploadedImage && (
          <div>
            <Label className="text-white">Uploaded Image Preview</Label>
            <div className="mt-2 relative w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
              <img src={uploadedImage} alt="Uploaded reference" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>
        )}
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}