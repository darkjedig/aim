import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolConfigurationProps {
  onAddTool: () => void;
}

export function ToolConfiguration({ onAddTool }: ToolConfigurationProps) {
  const [tools, setTools] = useState([
    { id: 1, name: 'SEO Topic Finder', creditCost: 10, aiModel: 'OpenAI GPT-3', status: true },
    { id: 2, name: 'AI Content Writer', creditCost: 20, aiModel: 'Anthropic Claude', status: true },
    { id: 3, name: 'Backlink Checker', creditCost: 5, aiModel: 'Custom ML Model', status: false },
  ])

  const toggleToolStatus = (id: number) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, status: !tool.status } : tool
    ))
  }

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Tool Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Tool Name</TableHead>
              <TableHead className="text-gray-300">Credit Cost</TableHead>
              <TableHead className="text-gray-300">AI Model</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow 
                key={tool.id}
                className={cn(
                  "transition-colors hover:bg-purple-500/10",
                  "data-[state=selected]:bg-purple-500/20"
                )}
              >
                <TableCell className="font-medium text-gray-300">{tool.name}</TableCell>
                <TableCell className="text-gray-300">{tool.creditCost}</TableCell>
                <TableCell className="text-gray-300">{tool.aiModel}</TableCell>
                <TableCell className="text-gray-300">{tool.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell className="text-gray-300">
                  <Switch
                    checked={tool.status}
                    onCheckedChange={() => toggleToolStatus(tool.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddTool}>Add New Tool</Button>
      </CardContent>
    </Card>
  )
}