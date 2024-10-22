"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundStrategyBuilder } from '@/components/animated-background-strategy-builder'
import { StrategyForm } from './components/strategy-form'
import { StrategyResults } from './components/strategy-results'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useCredits } from '@/contexts/credits-context'

const supabase = createClient()

interface ToolConfig {
  credit_cost: number;
  ai_model: string;
}

interface Strategy {
  cluster: string;
  keyword: string;
  intent: string;
  title: string;
  metaDescription: string;
}

export default function StrategyBuilderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [strategy, setStrategy] = useState<Strategy[]>([])
  const [toolConfig, setToolConfig] = useState<ToolConfig | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()
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
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('credit_cost, ai_model')
        .eq('name', 'Strategy Builder')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.error('No tool configuration found for Strategy Builder');
          // Set a default configuration or handle the absence of configuration
          setToolConfig({
            credit_cost: 8, // Set a default credit cost
            ai_model: 'gpt-4o-mini' // Set a default AI model
          });
        } else {
          console.error('Error fetching tool config:', error);
        }
      } else if (data) {
        console.log('Tool configuration fetched successfully:', data);
        setToolConfig(data);
      } else {
        console.error('No data returned from tool config query');
      }
    } catch (error) {
      console.error('Unexpected error in fetchToolConfig:', error);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setUserCredits(data.credits)
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

  const handleSubmit = async (formData: { keyword: string; keywordCount: number; language: string }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this tool.",
        variant: "destructive",
      })
      return
    }

    if (credits === null || toolConfig === null) {
      toast({
        title: "Error",
        description: "Unable to fetch user credits or tool configuration. Please try again later.",
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
      const openaiKey = await fetchOpenAIKey()
      if (!openaiKey) {
        throw new Error('Failed to fetch OpenAI API key')
      }

      const promptTemplate = `I want you to act as a market research expert that speaks and writes fluent ${formData.language}. You have the most accurate and detailed information about keywords available. You are able to develop a full SEO content plan in fluent ${formData.language}. I will give you the target keyword ${formData.keyword}. From this keyword create a markdown table with a keyword list for an SEO content strategy plan on the topic ${formData.keyword}. Cluster the keywords according to the top ${formData.keywordCount} super categories and name the super category in the first column called keyword cluster. For each cluster, generate one specific long-tail keyword. List in another column the human searcher intent for the keyword. Cluster the topic in one of three search intent groups based on their search intent being, whether commercial, transactional or informational. Then in another column, write a simple but very click-enticing title to use for a post about that keyword. Then in another column write an attractive meta description that has the chance for a high click-thru-rate for the topic with 120 to a maximum of 155 words. The meta description shall be value based, so mention value of the article and have a simple call to action to cause the searcher to click. Do NOT under any circumstance use too generic keyword like 'introduction' or 'conclusion' or 'tldr'. Focus on the most specific keywords. Do not use single quotes, double quotes or any other enclosing characters in any of the columns you fill in. Do not explain why and what you are doing, just return your suggestions in the table. The markdown table shall be in ${formData.language} language and have the following columns: keyword cluster, keyword, search intent, title, meta description. Here is the keyword to start again: ${formData.keyword}. Do not add any disclaimers or additional text after the table.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: toolConfig.ai_model,
          messages: [
            { role: "system", content: "You are an expert SEO strategist." },
            { role: "user", content: promptTemplate }
          ]
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate strategy')
      }

      const content = data.choices[0].message.content.trim()
      const parsedStrategy = parseMarkdownTable(content)
      setStrategy(parsedStrategy)

      await deductCredits(toolConfig.credit_cost)

      toast({
        title: "Strategy generated successfully",
        description: `${toolConfig.credit_cost} credits have been deducted from your account.`,
      })
    } catch (error) {
      console.error('Error generating strategy:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const parseMarkdownTable = (markdown: string): Strategy[] => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '')
    const strategy: Strategy[] = []

    // Skip the header row and separator row
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell !== '')
      // Skip rows that are just separators (contain only dashes)
      if (cells.every(cell => /^-+$/.test(cell))) {
        continue;
      }
      if (cells.length === 5) {
        strategy.push({
          cluster: cells[0],
          keyword: cells[1],
          intent: cells[2],
          title: cells[3],
          metaDescription: cells[4]
        })
      }
    }

    return strategy
  }

  const handleSaveStrategy = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save the strategy.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('saved_strategies')
        .insert({
          user_id: user.id,
          primary_keyword: strategy[0].keyword,
          language: 'en', // You might want to store this in the state
          keyword_count: strategy.length,
          strategy: strategy
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Strategy saved successfully!",
      })
    } catch (error) {
      console.error('Error saving strategy:', error)
      toast({
        title: "Error",
        description: "Failed to save strategy. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundStrategyBuilder />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Strategy Builder
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create comprehensive SEO content strategies tailored to your niche. Our AI analyses your main keyword and suggests Content hubs to help you build topical authority.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <StrategyForm 
            onSubmit={handleSubmit} 
            isAuthenticated={!!user} 
            toolConfig={toolConfig}
          />
          {user && (
            <StrategyResults 
              isLoading={isLoading} 
              strategy={strategy} 
              onSave={handleSaveStrategy}
            />
          )}
        </div>
      </main>
    </div>
  )
}
