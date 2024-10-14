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

export function ContentLibrary() {
  const [savedTopics, setSavedTopics] = useState<SavedTopic[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchSavedTopics()
  }, [])

  const fetchSavedTopics = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('saved_topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching saved topics:', error)
      } else {
        setSavedTopics(data || [])
      }
    }
  }

  const handleDelete = async (generationId: string) => {
    const { error } = await supabase
      .from('saved_topics')
      .delete()
      .eq('generation_id', generationId)

    if (error) {
      console.error('Error deleting topics:', error)
    } else {
      setSavedTopics(savedTopics.filter(topic => topic.generation_id !== generationId))
    }
  }

  const filteredAndSortedTopics = savedTopics
    .filter(topic => 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || topic.tool === filter)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === 'tool') {
        return a.tool.localeCompare(b.tool)
      }
      return 0
    })

  const uniqueTools = Array.from(new Set(savedTopics.map(topic => topic.tool)))
  const groupedTopics = filteredAndSortedTopics.reduce((acc, topic) => {
    if (!acc[topic.generation_id]) {
      acc[topic.generation_id] = []
    }
    acc[topic.generation_id].push(topic)
    return acc
  }, {} as Record<string, SavedTopic[]>)

  const handleDownload = (topics: SavedTopic[]) => {
    const csvContent = topics.map(topic => 
      `"${topic.title}","${topic.description}","${topic.keywords.join(', ')}"`
    ).join('\n')

    const blob = new Blob([`Title,Description,Keywords\n${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `generated_topics_${topics[0].created_at.split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-gray-700 text-gray-300 border-gray-600">
              <SelectValue placeholder="Filter by tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              {uniqueTools.map(tool => (
                <SelectItem key={tool} value={tool}>{tool}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-gray-700 text-gray-300 border-gray-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Title</th>
              <th className="pb-2">Description</th>
              <th className="pb-2">Keywords</th>
              <th className="pb-2">Tool</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {Object.entries(groupedTopics).map(([generationId, topics]) => (
              <React.Fragment key={generationId}>
                <tr className="bg-gray-700">
                  <td colSpan={6} className="py-2 px-4 font-semibold">
                    Generation from {new Date(topics[0].created_at).toLocaleDateString()}
                  </td>
                </tr>
                {topics.map((topic, index) => (
                  <tr key={topic.id} className="hover:bg-gray-700 transition-colors">
                    <td className="py-2">{topic.title}</td>
                    <td>{topic.description}</td>
                    <td>{topic.keywords.join(', ')}</td>
                    <td>{topic.tool}</td>
                    <td>{new Date(topic.created_at).toLocaleDateString()}</td>
                    {index === 0 && (
                      <td rowSpan={topics.length}>
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white mr-2" onClick={() => handleDownload(topics)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(generationId)}
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
      </CardContent>
    </Card>
  );
}
