import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function SystemSettings() {
  const [apiKeys, setApiKeys] = useState({
    openai: '••••••••••••••••',
    anthropic: '••••••••••••••••',
    stripe: '••••••••••••••••',
  })

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateApiKeys = () => {
    console.log('Updating API keys:', apiKeys)
    // Here you would typically save the API keys to your backend
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
            <div>
              <Label htmlFor="openai-key" className="text-gray-300">OpenAI API Key</Label>
              <Input
                id="openai-key"
                name="openai"
                type="password"
                value={apiKeys.openai}
                onChange={handleApiKeyChange}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="anthropic-key" className="text-gray-300">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                name="anthropic"
                type="password"
                value={apiKeys.anthropic}
                onChange={handleApiKeyChange}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="stripe-key" className="text-gray-300">Stripe API Key</Label>
              <Input
                id="stripe-key"
                name="stripe"
                type="password"
                value={apiKeys.stripe}
                onChange={handleApiKeyChange}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
          </div>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={handleUpdateApiKeys}>Update API Keys</Button>
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
    </div>
  )
}