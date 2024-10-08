import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'AI Marketer',
    contactEmail: 'contact@aimarketer.com',
    enableNotifications: true,
    darkMode: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the settings to your backend
    console.log('Settings saved:', settings)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={() => handleToggle('enableNotifications')}
              />
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}