"use client"

import { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Undo, Redo, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, FileText, Check, BrainCircuit, Loader2 } from "lucide-react"

type TiptapProps = {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapProps) {
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [internalLinks, setInternalLinks] = useState<string[]>([])
  const [suggestedLinks, setSuggestedLinks] = useState<string[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSuggestedLinks, setShowSuggestedLinks] = useState(false)
  const [internalLinkingMode, setInternalLinkingMode] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && internalLinkingMode) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: 'prose prose-invert max-w-none p-4 bg-gray-900 selection:bg-pink-500/50 text-gray-300',
          },
        },
      })
    } else if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: 'prose prose-invert max-w-none p-4 bg-gray-900 text-gray-300',
          },
        },
      })
    }
  }, [editor, internalLinkingMode])

  const addImage = useCallback(() => {
    const url = window.prompt('URL')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleSitemapSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically fetch and parse the sitemap
    // For this example, we'll just set some dummy internal links
    setInternalLinks([
      'https://example.com/page1',
      'https://example.com/page2',
      'https://example.com/page3',
    ])
  }

  const optimizeInternalLinks = useCallback(() => {
    if (!editor || !internalLinkingMode) return
    const selectedText = editor.state.selection.content().content?.textBetween(0, 10000, "\n")
    if (!selectedText) {
      alert("Please select some text to optimize internal links.")
      return
    }

    setIsOptimizing(true)
    // Here you would typically call your OpenAI API to get suggested links
    // For this example, we'll just use dummy data
    setTimeout(() => {
      setSuggestedLinks(internalLinks)
      setShowSuggestedLinks(true)
      setIsOptimizing(false)
    }, 1000)
  }, [editor, internalLinks, internalLinkingMode])

  const applySelectedLinks = useCallback((selectedLinks: string[]) => {
    if (!editor) return
    editor.chain().focus().setLink({ href: selectedLinks[0] }).run()
    setShowSuggestedLinks(false)
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-600 rounded-md overflow-hidden">
      <div className="bg-gray-800 p-2 flex items-center space-x-2">
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
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('bold') ? 'bg-gray-700' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('italic') ? 'bg-gray-700' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('bulletList') ? 'bg-gray-700' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('orderedList') ? 'bg-gray-700' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={`text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 ${editor.isActive('link') ? 'bg-gray-700' : ''}`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={addImage}
          className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300">
              <FileText className="h-4 w-4 mr-2" />
              Add Sitemap
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sitemap URL</DialogTitle>
              <DialogDescription>
                Enter the URL of your sitemap to use for internal link optimization.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSitemapSubmit} className="space-y-4">
              <Input
                placeholder="https://example.com/sitemap.xml"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
              />
              <Button type="submit">Submit</Button>
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
                  onCheckedChange={(checked) => setInternalLinkingMode(checked as boolean)}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={optimizeInternalLinks}
          disabled={isOptimizing || internalLinks.length === 0 || !internalLinkingMode}
          className="text-gray-300 hover:bg-purple-500/20 hover:text-purple-300"
        >
          {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
          Internal link AI
        </Button>
      </div>
      <EditorContent editor={editor} />
      {showSuggestedLinks && (
        <div className="p-4 bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Suggested Links</h3>
          <ul className="space-y-2">
            {suggestedLinks.map((link, index) => (
              <li key={index} className="flex items-center">
                <input type="checkbox" id={`link-${index}`} className="mr-2" />
                <label htmlFor={`link-${index}`}>{link}</label>
              </li>
            ))}
          </ul>
          <Button onClick={() => applySelectedLinks(suggestedLinks)} className="mt-4">
            <Check className="h-4 w-4 mr-2" />
            Apply Selected Links
          </Button>
        </div>
      )}
    </div>
  )
}