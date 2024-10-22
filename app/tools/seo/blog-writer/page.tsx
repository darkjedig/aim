"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedBackgroundBlogWriter } from '@/components/animated-background-blog-writer'
import { BlogForm } from './components/blog-form'
import { BlogResults } from './components/blog-results'
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

interface BlogPost {
  title: string;
  content: string;
}

export default function BlogWriterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [error, setError] = useState<string | null>(null)
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
        .eq('name', 'Blog Writer')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.error('No tool configuration found for Blog Writer');
          setToolConfig({
            credit_cost: 15,
            ai_model: 'gpt-4o'
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

  const handleSubmit = async (formData: {
    blogTitle: string;
    tone: string;
    language: string;
    internalLinks: string[];
    nlpKeywords: string[];
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this tool.",
        variant: "destructive",
      })
      return
    }

    if (userCredits === null || toolConfig === null) {
      toast({
        title: "Error",
        description: "Unable to fetch user credits or tool configuration. Please try again later.",
        variant: "destructive",
      })
      return
    }

    if (userCredits < toolConfig.credit_cost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${toolConfig.credit_cost} credits to use this tool. You currently have ${userCredits} credits.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const openaiKey = await fetchOpenAIKey()
      if (!openaiKey) {
        throw new Error('Failed to fetch OpenAI API key')
      }

      const blogPrompt = `
Create an SEO-optimized blog article about "${formData.blogTitle}" following EEAT SEO guidelines. Write the article with lists, tables, and engaging content at a Flesch Kincaid reading level of 6th to 8th grade. The article should follow these steps IN ORDER:

1. Write a 1,000+ word article in blog format (title, introduction, body, conclusion) , with at least 100 words under each heading, on "${formData.blogTitle}" in language ${formData.language}, using passive voice. Follow these additional guidelines:
   - Introduction: Use the PAS (Problem-Agitate-Solution) formula to create an engaging, short introduction of no more than 100 words.
   - Body: Address FAQs, provide valuable insights, and use engaging storytelling elements. Use tables and lists to improve readability. Incorporate NLP keywords naturally, and make these keywords bold:
   ${formData.nlpKeywords.join(', ')}

2. Write in a ${formData.tone} tone. Use transition words and active voice throughout.

3. Incorporate internal links and ensure you follow these best practices:
   - Use descriptive anchor text including target keywords.
   - Place links naturally within the content.
   - Prioritize linking to cornerstone content.
   - Ensure links are evenly distributed throughout the content.
   - Include at least one link in the first or second paragraph.
   - Include at least 5 internal links from the provided list below.
   
Internal links to use (include at least 5):
${formData.internalLinks.join('\n')}

4. At the end, include a 'Meta Description' section with a meta description (120-155 characters).

5. Format the entire article in HTML, using appropriate tags (h1, h2, h3, p, ul, ol, li, table, tr, td, strong, em, a). Ensure proper nesting and structure of HTML elements. Use CSS classes for styling where appropriate (e.g., class="table" for tables).

6. Ensure proper spacing and formatting in the HTML for readability.

Return only the HTML content without any additional text or explanations. Do not include any markdown formatting, especially not any bolded text with asterix * symbols, only html bold tags, avoid these. Ensure the post is long enough to adhere to SEO standards, YOU MUST write a minimum of 1000 words.
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: toolConfig!.ai_model,
          messages: [
            { role: "system", content: "You are an expert SEO content writer. Output only in clean, properly formatted HTML." },
            { role: "user", content: blogPrompt }
          ]
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate blog post')
      }

      const content = data.choices[0].message.content.trim()

      // Remove ```html and ``` markers
      const cleanedContent = content.replace(/```html\n?|\n?```/g, '').trim()

      setBlogPost({
        title: formData.blogTitle,
        content: cleanedContent,
      })

      await deductCredits(toolConfig!.credit_cost)

      toast({
        title: "Blog post generated successfully",
        description: `${toolConfig!.credit_cost} credits have been deducted from your account.`,
      })
    } catch (error) {
      console.error('Error generating blog post:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  const handleSaveBlogPost = async () => {
    if (!user || !blogPost) return

    try {
      // Extract image URLs from the content
      const imageRegex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
      const images = [];
      let match;
      while ((match = imageRegex.exec(editorContent)) !== null) {
        const imageUrl = match[1];
        if (imageUrl.startsWith('data:')) {
          // This is a new image that needs to be uploaded
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
          const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, blob);
          
          if (error) throw error;
          
          const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(data.path);
          
          images.push(publicUrlData.publicUrl);
        } else {
          // This is an existing image URL
          images.push(imageUrl);
        }
      }

      const { data, error } = await supabase
        .from('saved_blog_posts')
        .insert({
          user_id: user.id,
          title: blogPost.title,
          content: editorContent,
          images: images
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Blog post saved successfully!",
      })
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-grow">
        <section className="relative overflow-hidden h-[400px]">
          <AnimatedBackgroundBlogWriter />
          <div className="relative z-10 container mx-auto px-4 py-20 text-center h-full flex flex-col justify-center">
            <motion.h1 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Blog Writer
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create SEO-optimized blog posts in minutes with our advanced AI technology. Generate engaging content that resonates with your audience and boosts your online presence.
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
          <BlogForm onSubmit={handleSubmit} isAuthenticated={!!user} toolConfig={toolConfig} />
          
          <BlogResults 
            isLoading={isLoading}
            error={error}
            blogPost={blogPost}
            onEditorChange={handleEditorChange}
            onSave={handleSaveBlogPost}
          />
        </div>
      </main>
    </div>
  )
}
