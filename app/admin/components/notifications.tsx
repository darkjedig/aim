import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function Notifications() {
  const [systemNotifications, setSystemNotifications] = useState({
    lowCreditBalance: 10,
    subscriptionExpiration: 7,
    apiKeyError: true,
  })

  const [userAlert, setUserAlert] = useState({
    title: '',
    message: '',
  })

  const handleSystemNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSystemNotifications(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value),
    }))
  }

  const handleUserAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserAlert(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveSystemNotifications = () => {
    console.log('Saving system notifications:', systemNotifications)
    // Here you would typically save the settings to your backend
  }

  const handleSendUserAlert = () => {
    console.log('Sending user alert:', userAlert)
    // Here you would typically send the alert to all users
    setUserAlert({ title: '', message: '' })
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">System Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowCreditBalance" className="text-gray-300">Low user credit balance alert</Label>
              <Input
                id="lowCreditBalance"
                name="lowCreditBalance"
                type="number"
                value={systemNotifications.lowCreditBalance}
                onChange={handleSystemNotificationChange}
                className="w-20 bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="subscriptionExpiration" className="text-gray-300">Subscription expiration reminder (days before)</Label>
              <Input
                id="subscriptionExpiration"
                name="subscriptionExpiration"
                type="number"
                value={systemNotifications.subscriptionExpiration}
                onChange={handleSystemNotificationChange}
                className="w-20 bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="apiKeyError" className="text-gray-300">API key error notification</Label>
              <Input
                id="apiKeyError"
                name="apiKeyError"
                type="checkbox"
                checked={systemNotifications.apiKeyError}
                onChange={handleSystemNotificationChange}
                className="bg-gray-700 text-purple-500 border-gray-600"
              />
            </div>
          </div>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={handleSaveSystemNotifications}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">User Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alertTitle" className="text-gray-300">Alert Title</Label>
              <Input
                id="alertTitle"
                name="title"
                value={userAlert.title}
                onChange={handleUserAlertChange}
                className="w-full bg-gray-700 text-gray-300 border-gray-600"
                placeholder="Enter alert title"
              />
            </div>
            <div>
              <Label htmlFor="alertMessage" className="text-gray-300">Alert Message</Label>
              <Textarea
                id="alertMessage"
                name="message"
                value={userAlert.message}
                onChange={handleUserAlertChange}
                className="w-full h-24 bg-gray-700 text-gray-300 border-gray-600 resize-none"
                placeholder="Enter alert message"
              />
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={handleSendUserAlert}>Send Alert to All Users</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}