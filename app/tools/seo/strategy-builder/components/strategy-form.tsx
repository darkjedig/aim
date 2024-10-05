"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StrategyFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

export function StrategyForm({ onSubmit }: StrategyFormProps) {
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
        Build Your SEO Strategy
      </motion.h2>
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="keyword" className="text-gray-200">Primary Keyword</Label>
          <Input
            id="keyword"
            placeholder="Enter your primary keyword..."
            className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="keyword-count" className="text-gray-200">Number of Long-tail Keywords</Label>
            <Select>
              <SelectTrigger id="keyword-count" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select keyword count" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="3">3 keywords</SelectItem>
                <SelectItem value="5">5 keywords</SelectItem>
                <SelectItem value="8">8 keywords</SelectItem>
                <SelectItem value="10">10 keywords</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language" className="text-gray-200">Language</Label>
            <Select>
              <SelectTrigger id="language" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">Generate Strategy</Button>
      </motion.form>
    </motion.div>
  )
}