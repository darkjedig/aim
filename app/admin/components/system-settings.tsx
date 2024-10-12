import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
}

export function SystemSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyValue, setNewKeyValue] = useState('')
  const [isAddingKey, setIsAddingKey] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleApiKeyChange = (id: string, value: string) => {
    setApiKeys(prev => prev.map(key => key.id === id ? { ...key, key_value: value } : key))
  }

  const handleUpdateApiKeys = async () => {
    for (const key of apiKeys) {
      try {
        const response = await fetch('/api/api-keys', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: key.id, key_value: key.key_value }),
        });

        if (!response.ok) {
          throw new Error(`Error updating API key ${key.key_name}`);
        }
      } catch (error) {
        console.error(`Error updating API key ${key.key_name}:`, error);
      }
    }
    fetchApiKeys();
  }

  const handleAddNewKey = async () => {
    if (newKeyName && newKeyValue) {
      try {
        const response = await fetch('/api/api-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key_name: newKeyName, key_value: newKeyValue }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add new API key');
        }

        setNewKeyName('');
        setNewKeyValue('');
        setIsAddingKey(false);
        fetchApiKeys();
      } catch (error) {
        console.error('Error adding new API key:', error);
      }
    }
  }

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  }

  const handleCreateBackup = () => {
    console.log('Creating backup')
    // Here you would typically trigger a backup creation process
  }

  const handleRestoreSystem = () => {
    console.log('Restoring system')
    // Here you would typically trigger a system restore process
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">API Keys & Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map(key => (
              <div key={key.id} className="flex items-center space-x-2">
                <div className="flex-grow">
                  <Label htmlFor={key.key_name} className="text-gray-300">{key.key_name}</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={key.key_name}
                      type="password"
                      value={key.key_value}
                      onChange={(e) => handleApiKeyChange(key.id, e.target.value)}
                      className="bg-gray-700 text-gray-300 border-gray-600 w-1/2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={handleUpdateApiKeys}>Update API Keys</Button>
          <Button className="mt-4 ml-4 bg-green-500 hover:bg-green-600 text-white" onClick={() => setIsAddingKey(true)}>Add New API Key</Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={handleCreateBackup}>Create Backup</Button>
            <div>
              <Label htmlFor="restore-file" className="text-gray-300">Restore from Backup</Label>
              <Input
                id="restore-file"
                type="file"
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={handleRestoreSystem}>Restore System</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingKey} onOpenChange={setIsAddingKey}>
        <DialogContent className="bg-gray-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Add New API Key</DialogTitle>
            <DialogDescription>
              Enter the details for the new API key.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-key-name" className="text-gray-300">Key Name</Label>
              <Input
                id="new-key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="new-key-value" className="text-gray-300">Key Value</Label>
              <Input
                id="new-key-value"
                type="password"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingKey(false)} className="text-gray-800 border-gray-600 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={handleAddNewKey} className="bg-green-500 hover:bg-green-600 text-white">
              Add Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
