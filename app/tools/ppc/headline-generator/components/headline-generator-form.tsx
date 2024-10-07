"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Zap } from "lucide-react"
import { platformInfo } from '../page'

interface HeadlineGeneratorFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
}

export function HeadlineGeneratorForm({ onSubmit, isLoading, selectedPlatform, setSelectedPlatform }: HeadlineGeneratorFormProps) {
  return (
    <motion.div 
      className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Generate Your PPC Headlines
      </motion.h2>
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="platform" className="text-gray-200">Select Platform</Label>
          <Select 
            name="platform" 
            value={selectedPlatform} 
            onValueChange={setSelectedPlatform}
          >
            <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
              {Object.entries(platformInfo).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="productName" className="text-gray-200">Product or Service Name</Label>
          <Input
            id="productName"
            name="productName"
            placeholder="Enter your product or service name"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="productDescription" className="text-gray-200">Brief Product Description</Label>
          <Textarea
            id="productDescription"
            name="productDescription"
            placeholder="Briefly describe your product or service..."
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            rows={3}
            required
          />
        </div>
        <div>
          <Label htmlFor="targetAudience" className="text-gray-200">Target Audience</Label>
          <Input
            id="targetAudience"
            name="targetAudience"
            placeholder="Describe your target audience"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="uniqueSellingPoint" className="text-gray-200">Unique Selling Point</Label>
          <Input
            id="uniqueSellingPoint"
            name="uniqueSellingPoint"
            placeholder="What makes your product/service unique?"
            className="mt-1 bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          {isLoading ? 'Generating Headlines...' : 'Generate Headlines'}
        </Button>
      </motion.form>
    </motion.div>
  )
}