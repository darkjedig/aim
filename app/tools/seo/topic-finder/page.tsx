"use client"

import { useState, useEffect } from 'react'
import { AnimatedBackgroundTopicFinder } from '@/components/animated-background-topic-finder'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Play, PenTool, Save, Download } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import { useCredits } from '@/contexts/credits-context'

const supabase = createClient()

interface ToolConfig {
  credit_cost: number;
  ai_model: string;
}

interface Topic {
  title: string;
  description: string;
  keywords: string[];
}

export default function TopicFinder() {
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [urls, setUrls] = useState('')
  const [niche, setNiche] = useState('')
  const [topicCount, setTopicCount] = useState(5)
  const [toolConfig, setToolConfig] = useState<ToolConfig | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { credits, updateCredits } = useCredits()

  useEffect(() => {
    fetchToolConfig()
    fetchUserCredits()
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  const fetchToolConfig = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('credit_cost, ai_model')
      .eq('name', 'SEO Topic Finder')
      .single()

    if (error) {
      console.error('Error fetching tool config:', error)
    } else {
      setToolConfig(data)
    }
  }

  const fetchUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user credits:', error)
          throw error
        }

        if (data) {
          setUserCredits(data.credits)
        } else {
          console.error('User credits not found')
          setUserCredits(null)
        }
      }
    } catch (error) {
      console.error('Error fetching user credits:', error)
      setUserCredits(null)
    }
  }

  const fetchOpenAIKey = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'Open AI')
      .single()

    if (error) {
      console.error('Error fetching OpenAI API key:', error)
      return null
    }

    return data.key_value
  }

  const extractTextFromUrls = async (urls: string[]) => {
    const texts: string[] = []

    for (const url of urls) {
      try {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        texts.push(data.text)
      } catch (error) {
        console.error(`Error scraping ${url}:`, error)
      }
    }

    return texts.join(' ')
  }

  const generateTopics = async (text: string, niche: string, count: number) => {
    const openaiKey = await fetchOpenAIKey()
    if (!openaiKey) {
      throw new Error('Failed to fetch OpenAI API key')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: toolConfig?.ai_model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO content strategist. Your task is to generate informative, catchy, and SEO-optimized topic ideas based on the provided text and niche. Respond with a markdown table."
          },
          {
            role: "user",
            content: `Generate ${count} SEO-optimized topic ideas for the ${niche} niche based on the following text: ${text}. For each topic, provide a title, a brief description, and relevant keywords. Respond with a markdown table with columns for Title, Description, and Keywords. Do not include any explanatory text outside the table.`
          }
        ]
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate topics')
    }

    const content = data.choices[0].message.content.trim()
    const parsedTopics = parseMarkdownTable(content)
    
    // Remove markdown formatting from titles
    const cleanedTopics = parsedTopics.map(topic => ({
      ...topic,
      title: topic.title.replace(/\*\*/g, '')
    }))

    localStorage.setItem('topicFinderResults', JSON.stringify(cleanedTopics))
    return cleanedTopics
  }

  const parseMarkdownTable = (markdown: string): Topic[] => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '')
    const topics: Topic[] = []

    // Skip the header row and separator row
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell !== '')
      if (cells.length === 3) {
        topics.push({
          title: cells[0],
          description: cells[1],
          keywords: cells[2].split(',').map(keyword => keyword.trim())
        })
      }
    }

    return topics
  }

  const deductCredits = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update({ credits: credits! - amount })
        .eq('user_id', user.id)
        .select('credits')
        .single()

      if (error) {
        console.error('Error deducting credits:', error)
      } else {
        updateCredits(data.credits)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this tool.",
        variant: "destructive",
      })
      return
    }

    if (credits === null) {
      toast({
        title: "Error",
        description: "Unable to fetch your credits. Please try again later.",
        variant: "destructive",
      })
      return
    }

    if (toolConfig === null) {
      toast({
        title: "Error",
        description: "Unable to fetch tool configuration. Please try again later.",
        variant: "destructive",
      })
      return
    }

    if (credits < toolConfig.credit_cost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${toolConfig.credit_cost} credits to use this tool. You currently have ${credits} credits.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const urlList = urls.split('\n').filter(url => url.trim() !== '')
      const extractedText = await extractTextFromUrls(urlList)
      const generatedTopics = await generateTopics(extractedText, niche, topicCount)
      setTopics(generatedTopics)

      await deductCredits(toolConfig!.credit_cost)

      toast({
        title: "Topics generated successfully",
        description: `${toolConfig!.credit_cost} credits have been deducted from your account.`,
      })
    } catch (error) {
      console.error('Error generating topics:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWatchVideo = () => {
    // Implement the video watching functionality here
    console.log("Watch video clicked")
  }

  const handleSaveTopics = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save topics.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const generationId = uuidv4();
      const savedTopics = topics.map(topic => ({
        user_id: user.id,
        title: topic.title,
        description: topic.description,
        keywords: topic.keywords,
        tool: 'SEO Topic Finder',
        generation_id: generationId,
      }))

      const { data, error } = await supabase
        .from('saved_topics')
        .insert(savedTopics)

      if (error) throw error

      toast({
        title: "Success",
        description: "Topics saved to your dashboard!",
      })
    } catch (error) {
      console.error('Error saving topics:', error)
      toast({
        title: "Error",
        description: "Failed to save topics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadTopics = () => {
    setIsDownloading(true)
    try {
      const csvContent = topics.map(topic => 
        `"${topic.title}","${topic.description}","${topic.keywords.join(', ')}"`
      ).join('\n')

      const blob = new Blob([`Title,Description,Keywords\n${csvContent}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `generated_topics_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Topics downloaded successfully!",
      })
    } catch (error) {
      console.error('Error downloading topics:', error)
      toast({
        title: "Error",
        description: "Failed to download topics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundTopicFinder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AI-Powered Topic Finder
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Discover high-ranking topics and keywords for your content strategy
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={handleWatchVideo}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Find Your Next Winning Topic
            </h2>
            {toolConfig && (
              <p className="text-gray-300 mb-4">
                Credit Cost: {toolConfig.credit_cost} | AI Model: {toolConfig.ai_model}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="urls" className="text-gray-200">Source URLs</Label>
                <Textarea
                  id="urls"
                  placeholder="Enter Source URLs here... (one per line)"
                  className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
                  rows={5}
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="niche" className="text-gray-200">Your Niche/Company Type</Label>
                <Input
                  id="niche"
                  placeholder="Enter your niche or company type"
                  className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="topicCount" className="text-gray-200">Number of Topics (5-30)</Label>
                <Input
                  id="topicCount"
                  type="number"
                  min={5}
                  max={30}
                  className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-purple-500"
                  value={topicCount}
                  onChange={(e) => setTopicCount(Number(e.target.value))}
                />
              </div>
              {user ? (
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? 'Finding Topics...' : 'Find Topics'}
                </Button>
              ) : (
                <Card className="bg-gray-700 border-0 shadow-lg shadow-purple-500/10 p-4">
                  <CardTitle className="text-xl font-bold text-white mb-2">Authentication Required</CardTitle>
                  <p className="text-gray-300 mb-4">Please sign in to use the Topic Finder tool.</p>
                  <div className="flex space-x-4">
                    <Link href="/sign-in">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="bg-pink-600 hover:bg-pink-700 text-white">Sign Up</Button>
                    </Link>
                  </div>
                </Card>
              )}
            </form>
          </div>
          
          {topics.length > 0 && (
            <div className="mt-12 max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Suggested Topics</h2>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveTopics}
                    className="bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Topics'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadTopics}
                    className="bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-white"
                    disabled={isDownloading}
                  >
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {isDownloading ? 'Downloading...' : 'Download Topics'}
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800 hover:bg-gray-700">
                    <TableHead className="text-gray-100">Title</TableHead>
                    <TableHead className="text-gray-100">Description</TableHead>
                    <TableHead className="text-gray-100">Keywords</TableHead>
                    <TableHead className="text-gray-100">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((topic, index) => (
                    <TableRow 
                      key={index}
                      className="border-b border-gray-700 hover:bg-purple-500/10 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-300">{topic.title}</TableCell>
                      <TableCell className="text-gray-300">{topic.description}</TableCell>
                      <TableCell className="text-gray-300">{topic.keywords.join(', ')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-purple-500 hover:text-white transition-colors"
                          onClick={() => console.log(`Write about: ${topic.title}`)}
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
          )}
        </div>
      </main>
    </div>
  )
}
