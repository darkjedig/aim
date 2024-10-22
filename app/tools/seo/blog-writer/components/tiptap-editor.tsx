"use client"

import { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Heading from '@tiptap/extension-heading'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Undo, Redo, Bold, Italic, List, ListOrdered, Link as LinkIcon, FileText, Check, BrainCircuit, Loader2, X, ExternalLink, Trash2 } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useCredits } from '@/contexts/credits-context'

const supabase = createClient()

type TiptapProps = {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapProps) {
  const [sitemapUrls, setSitemapUrls] = useState('')
  const [internalLinks, setInternalLinks] = useState<string[]>([])
  const [suggestedLinks, setSuggestedLinks] = useState<{ url: string; anchorText: string; relevance: string }[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSitemapDialog, setShowSitemapDialog] = useState(false)
  const [showInternalLinkDropdown, setShowInternalLinkDropdown] = useState(false)
  const [internalLinkingMode, setInternalLinkingMode] = useState(false)
  const [highlightedText, setHighlightedText] = useState('')
  const [sitemapError, setSitemapError] = useState('')
  const [toolConfig, setToolConfig] = useState<{ credit_cost: number; ai_model: string } | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [isEditingLink, setIsEditingLink] = useState(false)
  const { credits, updateCredits } = useCredits()
  const [internalLinkToolConfig, setInternalLinkToolConfig] = useState<{ credit_cost: number; ai_model: string } | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image,
      TiptapLink.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 bg-gray-900 text-gray-300',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  useEffect(() => {
    fetchToolConfig()
    fetchUserCredits()
    checkUser()
    fetchInternalLinkToolConfig()
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
        .eq('name', 'Link Optimiser Editor')
        .single();

      if (error) {
        console.error('Error fetching tool config:', error);
        setToolConfig({
          credit_cost: 5, // Default credit cost
          ai_model: 'gpt-4o' // Default AI model
        });
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

  const fetchInternalLinkToolConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('credit_cost, ai_model')
        .eq('name', 'Link Optimiser Editor')
        .single();

      if (error) {
        console.error('Error fetching internal link tool config:', error);
        setInternalLinkToolConfig({
          credit_cost: 3, // Default credit cost
          ai_model: 'gpt-4o' // Default AI model
        });
      } else if (data) {
        setInternalLinkToolConfig(data);
      }
    } catch (error) {
      console.error('Unexpected error in fetchInternalLinkToolConfig:', error);
    }
  };

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

  const handleSitemapSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const urls = sitemapUrls.split('\n').filter(url => url.trim() !== '')
    if (urls.length === 0) {
      setSitemapError('Please enter at least one valid URL.')
      return
    }
    setInternalLinks(urls)
    setSitemapError('')
    setShowSitemapDialog(false)
  }

  const optimizeInternalLinks = useCallback(() => {
    if (!editor || !internalLinkingMode) return
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, "\n")
    if (!selectedText) {
      alert("Please select some text to optimize internal links.")
      return
    }
    setHighlightedText(selectedText)
    setShowInternalLinkDropdown(true)
    runInternalLinkAI(selectedText)
  }, [editor, internalLinkingMode])

  const runInternalLinkAI = async (selectedText: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this tool.",
        variant: "destructive",
      })
      return
    }

    if (credits === null || internalLinkToolConfig === null) {
      toast({
        title: "Error",
        description: "Unable to fetch user credits or tool configuration. Please try again later.",
        variant: "destructive",
      })
      return
    }

    if (credits < internalLinkToolConfig.credit_cost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${internalLinkToolConfig.credit_cost} credits to use this tool. You currently have ${credits} credits.`,
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)
    setSuggestedLinks([])
    try {
      const openaiKey = await fetchOpenAIKey()
      if (!openaiKey) {
        throw new Error('Failed to fetch OpenAI API key')
      }

      const internalLinkAIPrompt = `As an AI-powered SEO expert, analyze the following highlighted text and the provided sitemap URLs. Your task is to find the most relevant internal links that can be added to the blog post. 

Highlighted text:
${selectedText}

Sitemap URLs:
${internalLinks.join('\n')}

Analyze the text and URLs, then suggest relevant internal links. For each suggested link:
1. Use existing anchor text from the original content or create new contextually appropriate phrases.
2. Ensure the link adds value and relates to the surrounding content.
3. Prioritize linking to cornerstone or pillar content when relevant.
4. Provide a brief description of why each link is relevant to the highlighted text.

Ensure your suggestions follow SEO best practices:
- Use descriptive anchor text that includes target keywords for the linked page.
- Vary anchor text to avoid over-optimization, using synonyms where appropriate.
- Integrate links seamlessly without disrupting the flow of information.
- Avoid redundant links to the same page.

Format your response as follows:

Internal Link Suggestions:
1. URL: [URL]
   Anchor Text: [SUGGESTED_ANCHOR_TEXT]
   Relevance: [BRIEF_EXPLANATION]

2. URL: [URL]
   Anchor Text: [SUGGESTED_ANCHOR_TEXT]
   Relevance: [BRIEF_EXPLANATION]

3. URL: [URL]
   Anchor Text: [SUGGESTED_ANCHOR_TEXT]
   Relevance: [BRIEF_EXPLANATION]

If no relevant internal links can be found, respond with: "No relevant internal links found for the highlighted text."`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: internalLinkToolConfig.ai_model || 'gpt-4o',
          messages: [
            { role: "system", content: "You are an expert SEO internal link optimizer." },
            { role: "user", content: internalLinkAIPrompt }
          ]
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to optimize internal links')
      }

      const result = data.choices[0].message.content.trim()
      console.log("Full AI response:", result)
      const suggestions = parseSuggestions(result)
      setSuggestedLinks(suggestions)
      setShowInternalLinkDropdown(true) // Make sure to show the dropdown after getting suggestions

      await deductCredits(internalLinkToolConfig.credit_cost)

      toast({
        title: "Internal links optimized successfully",
        description: `${internalLinkToolConfig.credit_cost} credits have been deducted from your account.`,
      })
    } catch (error) {
      console.error('Error optimizing internal links:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const parseSuggestions = (result: string): { url: string; anchorText: string; relevance: string }[] => {
    if (result.includes("No relevant internal links found")) {
      return []
    }

    const suggestions = result.split(/\d+\./).slice(1).map(suggestion => {
      const [urlLine, anchorTextLine, relevanceLine] = suggestion.trim().split('\n')
      return {
        url: urlLine.split('URL:')[1]?.trim() || '',
        anchorText: anchorTextLine.split('Anchor Text:')[1]?.trim() || '',
        relevance: relevanceLine.split('Relevance:')[1]?.trim() || ''
      }
    })

    return suggestions.filter(s => s.url && s.anchorText && s.relevance)
  }

  const handleLinkButtonClick = useCallback(() => {
    if (editor?.isActive('link')) {
      setIsEditingLink(true)
      const attrs = editor.getAttributes('link')
      setLinkUrl(attrs.href || '')
    }
    setShowLinkDialog(true)
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }

    setLinkUrl('')
    setShowLinkDialog(false)
    setIsEditingLink(false)
  }, [editor, linkUrl])

  const removeLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setShowLinkDialog(false)
    setIsEditingLink(false)
  }, [editor])

  const visitLink = useCallback(() => {
    if (linkUrl) {
      window.open(linkUrl, '_blank')
    }
  }, [linkUrl])

  const applyInternalLinks = useCallback((selectedLinks: { url: string; anchorText: string }[]) => {
    if (!editor) return
    
    editor.chain().focus().run()

    selectedLinks.forEach(link => {
      const { from, to } = editor.state.selection
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .setLink({ href: link.url })
        .insertContent(link.anchorText)
        .run()
    })

    onChange(editor.getHTML())
  }, [editor, onChange])

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

  const insertInternalLink = useCallback((link: { url: string; anchorText: string }) => {
    if (!editor) return

    const { from, to } = editor.state.selection
    if (from === to) {
      // If no text is selected, insert the anchor text and make it a link
      editor
        .chain()
        .focus()
        .insertContent(link.anchorText)
        .setTextSelection({ from: from, to: from + link.anchorText.length })
        .setLink({ href: link.url })
        .run()
    } else {
      // If text is selected, just make it a link
      editor
        .chain()
        .focus()
        .setLink({ href: link.url })
        .run()
    }

    onChange(editor.getHTML())
  }, [editor, onChange])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-600 rounded-md overflow-hidden">
      <div className="bg-gray-800 p-2 flex items-center space-x-2 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('bold') ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('italic') ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('bulletList') ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('orderedList') ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLinkButtonClick}
              className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor?.isActive('link') ? 'bg-purple-500/20 text-purple-300' : ''}`}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle>{isEditingLink ? 'Edit Link' : 'Add Link'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-gray-700 text-gray-100 border-gray-600"
              />
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                {isEditingLink && (
                  <>
                    <Button onClick={removeLink} variant="destructive" className="mr-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={visitLink} variant="outline" className="mr-2 bg-green-600 hover:bg-green-700 hover:text-white text-white border-none">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={setLink} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isEditingLink ? 'Update' : 'Set'} Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('heading', { level: 1 }) ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          H1
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          H2
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-500/20 text-purple-300' : ''}`}
        >
          H3
        </Button>

        <div className="ml-auto flex items-center space-x-2 bg-purple-500/20 p-2 rounded-md">
          <Dialog open={showSitemapDialog} onOpenChange={setShowSitemapDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300">
                <FileText className="h-4 w-4 mr-2" />
                Add Sitemap
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Add Sitemap URLs</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Paste your list of sitemap URLs (one per line) to use for internal link optimization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSitemapSubmit} className="space-y-4">
                <Textarea
                  placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                  value={sitemapUrls}
                  onChange={(e) => setSitemapUrls(e.target.value)}
                  rows={5}
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
                {sitemapError && <p className="text-red-500">{sitemapError}</p>}
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Submit</Button>
              </form>
            </DialogContent>
          </Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal-linking-mode"
                    checked={internalLinkingMode}
                    onCheckedChange={(checked) => {
                      if (internalLinks.length === 0) {
                        alert("Please add your sitemap first to use internal linking.")
                        return
                      }
                      setInternalLinkingMode(checked as boolean)
                    }}
                    className="border-gray-400 text-purple-500"
                  />
                  <Label
                    htmlFor="internal-linking-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-300" />
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enable internal linking mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (internalLinks.length === 0) {
                  alert("Please add your sitemap first to use internal linking.")
                  return
                }
                const selectedText = editor?.state.doc.textBetween(
                  editor.state.selection.from,
                  editor.state.selection.to,
                  "\n"
                )
                if (selectedText) {
                  runInternalLinkAI(selectedText)
                } else {
                  alert("Please select some text to optimize internal links.")
                }
              }}
              disabled={isOptimizing || internalLinks.length === 0 || !internalLinkingMode}
              className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300"
            >
              {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
              Run Internal link AI
            </Button>
            {internalLinkToolConfig && (
              <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                cost: <span className="text-green-500">{internalLinkToolConfig.credit_cost}</span> credits | Model: <span className="text-green-500">{internalLinkToolConfig.ai_model || 'gpt-4o'}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {showInternalLinkDropdown && (
        <div className="bg-gray-800 p-4 border-t border-gray-600 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            onClick={() => setShowInternalLinkDropdown(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Internal Link Suggestions</h3>
          <p className="mb-4 text-gray-300">Selected text: {highlightedText}</p>
          {isOptimizing ? (
            <div className="flex items-center text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Analyzing...
            </div>
          ) : (
            <>
              {suggestedLinks.length > 0 ? (
                <div className="space-y-4">
                  {suggestedLinks.map((link, index) => (
                    <div key={index} className="flex items-start justify-between space-x-2">
                      <div>
                        <p className="text-gray-200">{link.anchorText}</p>
                        <p className="text-sm text-gray-400">{link.url}</p>
                        <p className="text-xs text-gray-500">{link.relevance}</p>
                      </div>
                      <Button 
                        onClick={() => insertInternalLink(link)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Insert
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No relevant internal links found for the selected text.</p>
              )}
            </>
          )}
        </div>
      )}
      
      <EditorContent 
        editor={editor} 
        className={`prose prose-invert max-w-none p-4 bg-gray-900 text-gray-300 ${internalLinkingMode ? 'internal-linking-mode' : ''}`}
      />
    </div>
  )
}
