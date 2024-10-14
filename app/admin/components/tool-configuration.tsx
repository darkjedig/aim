import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'
import { cn } from "@/lib/utils"

const supabase = createClient()

interface ToolConfigurationProps {
  onAddTool: () => void;
}

interface Tool {
  id: number;
  name: string;
  credit_cost: number;
  ai_model: string;
  status: string;
}

function EditToolForm({ tool, onSave, onCancel }: { tool: Tool; onSave: (tool: Tool) => Promise<void>; onCancel: () => void }) {
  const [editedTool, setEditedTool] = useState(tool);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTool(prev => ({ ...prev, [name]: name === 'credit_cost' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTool);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">Tool Name</label>
        <Input 
          id="name"
          name="name" 
          value={editedTool.name} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="credit_cost" className="text-sm font-medium text-gray-300">Credit Cost</label>
        <Input 
          id="credit_cost"
          name="credit_cost" 
          type="number" 
          value={editedTool.credit_cost} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="ai_model" className="text-sm font-medium text-gray-300">AI Model</label>
        <Input 
          id="ai_model"
          name="ai_model" 
          value={editedTool.ai_model} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
        <p className="text-xs text-gray-400">Please enter the exact model name as specified by the API provider.</p>
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Save Tool
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ToolConfiguration({ onAddTool }: ToolConfigurationProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching tools:', error);
    } else {
      setTools(data || []);
    }
  };

  const toggleToolStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const { error } = await supabase
      .from('tools')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating tool status:', error);
    } else {
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, status: newStatus } : tool
      ));
    }
  }

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
  };

  const handleSaveTool = async (editedTool: Tool) => {
    const { data, error } = await supabase
      .from('tools')
      .update(editedTool)
      .eq('id', editedTool.id)
      .select();
    
    if (error) {
      console.error('Error updating tool:', error);
    } else if (data) {
      setTools(tools => tools.map(tool => tool.id === editedTool.id ? data[0] : tool));
      setEditingTool(null);
    }
  };

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Tool Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {editingTool ? (
          <EditToolForm 
            tool={editingTool} 
            onSave={handleSaveTool} 
            onCancel={() => setEditingTool(null)} 
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                  <TableHead className="text-gray-100">Tool Name</TableHead>
                  <TableHead className="text-gray-100">Credit Cost</TableHead>
                  <TableHead className="text-gray-100">AI Model</TableHead>
                  <TableHead className="text-gray-100">Status</TableHead>
                  <TableHead className="text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow 
                    key={tool.id}
                    className={cn(
                      "transition-colors hover:bg-purple-500/10",
                    )}
                  >
                    <TableCell className="font-medium text-gray-300">{tool.name}</TableCell>
                    <TableCell className="text-gray-300">{tool.credit_cost}</TableCell>
                    <TableCell className="text-gray-300">{tool.ai_model}</TableCell>
                    <TableCell className="text-gray-300">{tool.status}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={tool.status === 'Active'}
                          onCheckedChange={() => toggleToolStatus(tool.id, tool.status)}
                        />
                        <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white" onClick={() => handleEditTool(tool)}>
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={onAddTool}>Add New Tool</Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
