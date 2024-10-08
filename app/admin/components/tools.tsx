import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

export function Tools() {
  const [tools, setTools] = useState([
    { id: 1, name: 'SEO Analyzer', status: true, usage: 1234 },
    { id: 2, name: 'Keyword Research', status: true, usage: 5678 },
    { id: 3, name: 'Backlink Checker', status: false, usage: 910 },
    // Add more mock tools as needed
  ])

  const toggleToolStatus = (id: number) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, status: !tool.status } : tool
    ))
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Tools</h2>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{tool.usage}</TableCell>
                <TableCell>
                  <Switch
                    checked={tool.status}
                    onCheckedChange={() => toggleToolStatus(tool.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}