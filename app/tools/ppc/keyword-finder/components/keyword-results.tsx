"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Search, DollarSign, Target, FileDown, Save } from "lucide-react"

type Keyword = {
  text: string;
  score: number;
  volume: number;
  cpc: number;
  competition: number;
}

interface KeywordResultsProps {
  keywords: Keyword[];
}

export function KeywordResults({ keywords }: KeywordResultsProps) {
  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generated Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="list" className="data-[state=active]:bg-gray-600">List View</TabsTrigger>
              <TabsTrigger value="table" className="data-[state=active]:bg-gray-600">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <ul className="space-y-4">
                {keywords.map((keyword, index) => (
                  <li key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-400">{keyword.text}</h3>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                        Score: {keyword.score}
                      </span>
                      <span className="flex items-center">
                        <Search className="mr-1 h-4 w-4 text-blue-500" />
                        Volume: {keyword.volume}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-green-500" />
                        CPC: ${keyword.cpc.toFixed(2)}
                      </span>
                      <span className="flex items-center">
                        <Target className="mr-1 h-4 w-4 text-red-500" />
                        Competition: {(keyword.competition * 100).toFixed(0)}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-2 border border-gray-600">Keyword</th>
                      <th className="p-2 border border-gray-600">Score</th>
                      <th className="p-2 border border-gray-600">Volume</th>
                      <th className="p-2 border border-gray-600">CPC</th>
                      <th className="p-2 border border-gray-600">Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr key={index} className="bg-gray-700 hover:bg-gray-600">
                        <td className="p-2 border border-gray-600">{keyword.text}</td>
                        <td className="p-2 border border-gray-600">{keyword.score}</td>
                        <td className="p-2 border border-gray-600">{keyword.volume}</td>
                        <td className="p-2 border border-gray-600">${keyword.cpc.toFixed(2)}</td>
                        <td className="p-2 border border-gray-600">{(keyword.competition * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-center space-x-4">
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20">
          <Save className="mr-2 h-4 w-4" />
          Save to Account
        </Button>
      </div>
    </motion.div>
  )
}