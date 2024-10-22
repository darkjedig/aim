"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileDown, Save } from "lucide-react"
import { TiptapEditor } from './tiptap-editor'
import { useToast } from "@/components/ui/use-toast"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

interface BlogResultsProps {
  isLoading: boolean;
  error: string | null;
  blogPost: { title: string; content: string } | null;
  onEditorChange: (content: string) => void;
  onSave: () => Promise<void>;
}

export function BlogResults({ isLoading, error, blogPost, onEditorChange, onSave }: BlogResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExportWord = async () => {
    setIsExporting(true)
    try {
      const content = document.querySelector('.ProseMirror')
      if (!content) {
        throw new Error('No content to export')
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: convertHtmlToDocxElements(content)
        }],
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${blogPost?.title || 'blog-post'}.docx`)

      toast({
        title: "Success",
        description: "Blog post exported as Word document.",
      })
    } catch (error) {
      console.error('Error exporting to Word:', error)
      toast({
        title: "Error",
        description: "Failed to export blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const convertHtmlToDocxElements = (element: Element): any[] => {
    const children: any[] = []

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        children.push(new TextRun(node.textContent || ''))
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        switch (el.tagName.toLowerCase()) {
          case 'h1':
            children.push(new Paragraph({
              text: el.textContent || '',
              heading: HeadingLevel.HEADING_1
            }))
            break
          case 'h2':
            children.push(new Paragraph({
              text: el.textContent || '',
              heading: HeadingLevel.HEADING_2
            }))
            break
          case 'h3':
            children.push(new Paragraph({
              text: el.textContent || '',
              heading: HeadingLevel.HEADING_3
            }))
            break
          case 'p':
            children.push(new Paragraph({
              children: convertHtmlToDocxElements(el)
            }))
            break
          case 'strong':
            children.push(new TextRun({
              text: el.textContent || '',
              bold: true
            }))
            break
          case 'em':
            children.push(new TextRun({
              text: el.textContent || '',
              italics: true
            }))
            break
          case 'a':
            children.push(new TextRun({
              text: el.textContent || '',
              color: '0000FF',
              underline: {}
            }))
            break
          case 'ul':
          case 'ol':
            el.childNodes.forEach((li) => {
              if (li.nodeType === Node.ELEMENT_NODE && li.nodeName.toLowerCase() === 'li') {
                children.push(new Paragraph({
                  text: (li as Element).textContent || '',
                  bullet: {
                    level: 0
                  }
                }))
              }
            })
            break
          case 'table':
            const rows: TableRow[] = []
            el.querySelectorAll('tr').forEach((tr) => {
              const cells: TableCell[] = []
              tr.querySelectorAll('td, th').forEach((td) => {
                cells.push(new TableCell({
                  children: [new Paragraph(td.textContent || '')]
                }))
              })
              rows.push(new TableRow({
                children: cells
              }))
            })
            children.push(new Table({
              rows: rows
            }))
            break
          default:
            children.push(...convertHtmlToDocxElements(el))
        }
      }
    })

    return children
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      toast({
        title: "Success",
        description: "Blog post saved to account.",
      })
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
        {error}
      </div>
    )
  }

  if (!blogPost) {
    return null
  }

  return (
    <motion.div 
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generated Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TiptapEditor content={blogPost.content} onChange={onEditorChange} />
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-end space-x-4">
        <Button 
          variant="outline" 
          className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-purple-300"
          onClick={handleExportWord}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
          {isExporting ? 'Exporting...' : 'Export as Word'}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-purple-300" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save to Account'}
        </Button>
      </div>
    </motion.div>
  )
}
