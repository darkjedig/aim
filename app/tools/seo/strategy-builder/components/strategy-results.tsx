"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileDown, Loader2, PenTool, RefreshCw, Save } from "lucide-react"

interface Strategy {
  cluster: string;
  keyword: string;
  intent: string;
  title: string;
  metaDescription: string;
}

interface StrategyResultsProps {
  isLoading: boolean;
  strategy: Strategy[];
  onSave: () => void;
}

export function StrategyResults({ isLoading, strategy, onSave }: StrategyResultsProps) {
  const handleWriteAboutThis = (title: string) => {
    console.log("Writing about:", title)
    // Implement navigation to blog writer page or open modal
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (strategy.length === 0) {
    return null
  }

  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Generated SEO Strategy</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Strategy
          </Button>
          <Button variant="outline" size="sm" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Keyword Cluster</TableHead>
              <TableHead className="text-gray-300">Keyword</TableHead>
              <TableHead className="text-gray-300">Search Intent</TableHead>
              <TableHead className="text-gray-300">Content Title</TableHead>
              <TableHead className="text-gray-300">Meta Description</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategy.map((item, index) => (
              <TableRow key={index} className="border-t border-gray-700 hover:bg-purple-500/10 transition-colors">
                <TableCell className="text-gray-300">{item.cluster}</TableCell>
                <TableCell className="text-gray-300">{item.keyword}</TableCell>
                <TableCell className="text-gray-300">{item.intent}</TableCell>
                <TableCell className="text-gray-300">{item.title}</TableCell>
                <TableCell className="text-gray-300">{item.metaDescription}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleWriteAboutThis(item.title)}
                    className="bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-300 flex items-center justify-center"
                    size="sm"
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Write about this
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 flex justify-end">
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refine Strategy
        </Button>
      </div>
    </motion.div>
  )
}
