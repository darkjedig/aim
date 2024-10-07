"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Upload, ZoomIn, Loader2 } from "lucide-react"

interface ImageUpscalerFormProps {
  uploadedImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  scale: number;
  setScale: (scale: number) => void;
  faceEnhance: boolean;
  setFaceEnhance: (enhance: boolean) => void;
  handleUpscale: () => void;
  isLoading: boolean;
}

export function ImageUpscalerForm({
  uploadedImage,
  handleImageUpload,
  scale,
  setScale,
  faceEnhance,
  setFaceEnhance,
  handleUpscale,
  isLoading
}: ImageUpscalerFormProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Upscale Your Image</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="scale" className="text-gray-200">Scale Factor</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="scale"
                  min={1}
                  max={10}
                  step={0.1}
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                  className="flex-grow"
                />
                <span className="text-gray-200 w-12 text-center">{scale.toFixed(1)}x</span>
              </div>
              <p className="text-sm text-gray-400">Factor to scale image by (Default: 2)</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="face-enhance"
                checked={faceEnhance}
                onCheckedChange={setFaceEnhance}
              />
              <Label htmlFor="face-enhance" className="text-gray-200">Face Enhancement</Label>
            </div>
            <p className="text-sm text-gray-400">Run GFPGAN face enhancement along with upscaling (Default: false)</p>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={handleUpscale}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upscaling Image...
                </>
              ) : (
                <>
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Upscale Image
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}