"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supabase = createClient()

interface SavedTopic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  created_at: string;
  tool: string;
  generation_id: string;
}

interface SavedStrategy {
  id: string;
  primary_keyword: string;
  language: string;
  keyword_count: number;
  strategy: {
    cluster: string;
    keyword: string;
    intent: string;
    title: string;
    metaDescription: string;
  }[];
  created_at: string;
  tool: string;
  generation_id: string;
}

type SavedContent = SavedTopic | SavedStrategy;

export function ContentLibrary() {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchSavedContent()
  }, [])

  const fetchSavedContent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: topicsData, error: topicsError } = await supabase
        .from('saved_topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const { data: strategiesData, error: strategiesError } = await supabase
        .from('saved_strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (topicsError) {
        console.error('Error fetching saved topics:', topicsError)
      }
      if (strategiesError) {
        console.error('Error fetching saved strategies:', strategiesError)
      }

      const allContent = [
        ...(topicsData || []).map(topic => ({ ...topic, tool: 'Topic Finder' })),
        ...(strategiesData || []).map(strategy => ({ ...strategy, tool: 'Strategy Builder' }))
      ]

      setSavedContent(allContent)
    }
  }

  const handleDelete = async (generationId: string, tool: string) => {
    const tableName = tool === 'Topic Finder' ? 'saved_topics' : 'saved_strategies'
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('generation_id', generationId)

    if (error) {
      console.error(`Error deleting ${tool} content:`, error)
    } else {
      setSavedContent(savedContent.filter(content => content.generation_id !== generationId))
    }
  }

  const filteredAndSortedContent = savedContent
    .filter(content => 
      (selectedTool ? content.tool === selectedTool : true) &&
      (content.tool === 'Topic Finder' 
        ? (content as SavedTopic).title.toLowerCase().includes(searchTerm.toLowerCase())
        : (content as SavedStrategy).primary_keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const uniqueTools = Array.from(new Set(savedContent.map(content => content.tool)))

  const handleDownload = (contents: SavedContent[]) => {
    let csvContent: string;
    if (contents[0].tool === 'Topic Finder') {
      csvContent = (contents as SavedTopic[]).map((content) => 
        `"${content.title}","${content.description}","${content.keywords.join(', ')}"`
      ).join('\n')
      csvContent = `Title,Description,Keywords\n${csvContent}`
    } else {
      const strategies = contents as SavedStrategy[]
      csvContent = strategies.flatMap(strategy => 
        strategy.strategy.map(item => 
          `"${strategy.primary_keyword}","${item.cluster}","${item.keyword}","${item.intent}","${item.title}","${item.metaDescription}"`
        )
      ).join('\n')
      csvContent = `Primary Keyword,Keyword Cluster,Keyword,Search Intent,Title,Meta Description\n${csvContent}`
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${contents[0].tool}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderContentTable = (tool: string) => {
    const toolContent = filteredAndSortedContent.filter(content => content.tool === tool)
    const groupedContent = toolContent.reduce((acc, content) => {
      if (!acc[content.generation_id]) {
        acc[content.generation_id] = []
      }
      acc[content.generation_id].push(content)
      return acc
    }, {} as Record<string, SavedContent[]>)

    if (tool === 'Topic Finder') {
      return (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Title</th>
              <th className="pb-2">Description</th>
              <th className="pb-2">Keywords</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {Object.entries(groupedContent).map(([generationId, contents]) => (
              <React.Fragment key={generationId}>
                <tr className="bg-gray-700">
                  <td colSpan={5} className="py-2 px-4 font-semibold">
                    Generation from {new Date(contents[0].created_at).toLocaleDateString()}
                  </td>
                </tr>
                {(contents as SavedTopic[]).map((content, index) => (
                  <tr key={content.id} className="hover:bg-gray-700 transition-colors">
                    <td className="py-2">{content.title}</td>
                    <td>{content.description}</td>
                    <td>{content.keywords.join(', ')}</td>
                    <td>{new Date(content.created_at).toLocaleDateString()}</td>
                    {index === 0 && (
                      <td rowSpan={contents.length}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-purple-500 hover:text-white mr-2"
                          onClick={() => handleDownload(contents)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(generationId, content.tool)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )
    } else if (tool === 'Strategy Builder') {
      return (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Primary Keyword</th>
              <th className="pb-2">Keyword Cluster</th>
              <th className="pb-2">Keyword</th>
              <th className="pb-2">Search Intent</th>
              <th className="pb-2">Title</th>
              <th className="pb-2">Meta Description</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {Object.entries(groupedContent).map(([generationId, contents]) => (
              <React.Fragment key={generationId}>
                <tr className="bg-gray-700">
                  <td colSpan={8} className="py-2 px-4 font-semibold">
                    Generation from {new Date(contents[0].created_at).toLocaleDateString()}
                  </td>
                </tr>
                {(contents as SavedStrategy[]).flatMap((content, contentIndex) => 
                  content.strategy.map((item, index) => (
                    <tr key={`${content.id}-${index}`} className="hover:bg-gray-700 transition-colors">
                      <td className="py-2">{content.primary_keyword}</td>
                      <td>{item.cluster}</td>
                      <td>{item.keyword}</td>
                      <td>{item.intent}</td>
                      <td>{item.title}</td>
                      <td>{item.metaDescription}</td>
                      <td>{new Date(content.created_at).toLocaleDateString()}</td>
                      {contentIndex === 0 && index === 0 && (
                        <td rowSpan={contents.length * content.strategy.length}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-purple-500 hover:text-white mr-2"
                            onClick={() => handleDownload(contents)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-500 hover:text-white"
                            onClick={() => handleDelete(generationId, content.tool)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )
    }
  }

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gray-100">Content Generation Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input 
            type="text" 
            placeholder="Search content..." 
            className="w-64 bg-gray-700 text-gray-300 border-gray-600" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center">
            <span className="text-gray-300 mr-2">Choose Tool:</span>
            <Select value={selectedTool || ''} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-gray-300 border-gray-600">
                <SelectValue placeholder="Select tool" />
              </SelectTrigger>
              <SelectContent>
                {uniqueTools.map(tool => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedTool ? renderContentTable(selectedTool) : uniqueTools.map(tool => (
          <div key={tool}>
            <h3 className="text-xl font-bold text-gray-100 mt-8 mb-4">{tool}</h3>
            {renderContentTable(tool)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
