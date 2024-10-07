"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Loader2 } from "lucide-react"

interface KeywordFinderFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function KeywordFinderForm({ onSubmit, isLoading }: KeywordFinderFormProps) {
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
        Find Your Perfect Keywords
      </motion.h2>
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="description" className="text-gray-200">Describe your product or service</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a brief description of your product, service, or ad campaign..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="industry" className="text-gray-200">Industry</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="e.g., Technology, Healthcare, E-commerce"
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="targetAudience" className="text-gray-200">Target Audience</Label>
          <Input
            id="targetAudience"
            name="targetAudience"
            placeholder="e.g., Small business owners, Millennials, Working professionals"
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="goal" className="text-gray-200">Campaign Goal</Label>
          <Select name="goal" required>
            <SelectTrigger id="goal" className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select your campaign goal" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="awareness">Brand Awareness</SelectItem>
              <SelectItem value="traffic">Website Traffic</SelectItem>
              <SelectItem value="leads">Lead Generation</SelectItem>
              <SelectItem value="sales">Sales / Conversions</SelectItem>
              <SelectItem value="retention">Customer Retention</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          {isLoading ? 'Generating Keywords...' : 'Find Keywords'}
        </Button>
      </motion.form>
    </motion.div>
  )
}