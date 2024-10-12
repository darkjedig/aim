import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from '@/utils/supabase/client'
import { Trash2, Edit } from 'lucide-react'
import { cn } from "@/lib/utils"

const supabase = createClient()

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

function EditNotificationForm({ notification, onSave, onCancel }: { notification: Notification; onSave: (notification: Notification) => Promise<void>; onCancel: () => void }) {
  const [editedNotification, setEditedNotification] = useState(notification);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedNotification);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-300">Title</Label>
        <Input 
          id="title"
          name="title" 
          value={editedNotification.title} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-300">Message</Label>
        <Textarea 
          id="message"
          name="message" 
          value={editedNotification.message} 
          onChange={handleChange} 
          className="bg-gray-700 text-gray-300 border-gray-600 focus:border-purple-500"
        />
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="text-gray-800 border-gray-600 hover:bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function Notifications() {
  const [systemNotifications, setSystemNotifications] = useState({
    lowCreditBalance: 10,
  })

  const [userAlert, setUserAlert] = useState({
    title: '',
    message: '',
  })

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)

  useEffect(() => {
    fetchNotifications()
    fetchSystemSettings()
    const interval = setInterval(checkLowCreditBalances, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching notifications:', error)
    } else {
      setNotifications(data || [])
    }
  }

  const handleSystemNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSystemNotifications(prev => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleUserAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserAlert(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchSystemSettings = async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', 'lowCreditBalance')
      .single()

    if (error) {
      console.error('Error fetching system settings:', error)
    } else if (data) {
      setSystemNotifications(prev => ({ ...prev, lowCreditBalance: data.value }))
    }
  }

  const handleSaveSystemNotifications = async () => {
    const { error } = await supabase
      .from('system_settings')
      .upsert({ key: 'lowCreditBalance', value: systemNotifications.lowCreditBalance })

    if (error) {
      console.error('Error saving system notifications:', error)
    } else {
      console.log('System notifications saved successfully')
      // Trigger an immediate check after saving
      checkLowCreditBalances()
    }
  }

  const handleSendUserAlert = async () => {
    try {
      const { error } = await supabase.from('notifications').insert({
        title: userAlert.title,
        message: userAlert.message,
        user_id: null, // null for system-wide notifications
      });

      if (error) throw error;

      console.log('User alert sent successfully');
      setUserAlert({ title: '', message: '' });
      fetchNotifications(); // Refresh the notifications list
    } catch (error) {
      console.error('Error sending user alert:', error);
    }
  }

  const handleDeleteNotification = async (id: number) => {
    try {
      // Only delete if it's a system-wide notification (user_id is null)
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .match({ id: id, user_id: null });

      if (error) throw error;

      if (data) {
        setNotifications(notifications.filter(notification => notification.id !== id));
      } else {
        console.log('Notification not deleted. It might be a user-specific notification.');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
  }

  const handleSaveNotification = async (editedNotification: Notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ title: editedNotification.title, message: editedNotification.message })
        .eq('id', editedNotification.id)
        .select();

      if (error) throw error;

      setNotifications(notifications.map(notification => 
        notification.id === editedNotification.id ? data[0] : notification
      ));
      setEditingNotification(null);
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  }

  const checkLowCreditBalances = async () => {
    console.log('Checking low credit balances...')
    const { data: users, error } = await supabase
      .from('users')
      .select('user_id, name, email, credits')
      .lte('credits', systemNotifications.lowCreditBalance)  // Changed from .eq to .lte

    if (error) {
      console.error('Error fetching users with low credit balance:', error)
      return
    }

    console.log('Users with low credit balance:', users)

    for (const user of users) {
      const notificationTitle = 'Low Credit Balance'
      const notificationMessage = `Your credit balance is low. You currently have ${user.credits} credits.`

      const { data: existingNotification, error: checkError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('title', notificationTitle)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing notification:', checkError)
        continue
      }

      if (!existingNotification) {
        const { error: insertError } = await supabase
          .from('notifications')
          .insert({
            user_id: user.user_id,
            title: notificationTitle,
            message: notificationMessage,
          })

        if (insertError) {
          console.error('Error inserting notification:', insertError)
        } else {
          console.log('Low credit balance notification sent to user:', user.user_id)
        }
      }
    }
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

      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Sent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {editingNotification ? (
            <EditNotificationForm 
              notification={editingNotification} 
              onSave={handleSaveNotification} 
              onCancel={() => setEditingNotification(null)} 
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700 hover:bg-purple-500/20 transition-colors">
                  <TableHead className="text-gray-100">Title</TableHead>
                  <TableHead className="text-gray-100">Message</TableHead>
                  <TableHead className="text-gray-100">Created At</TableHead>
                  <TableHead className="text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow 
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-purple-500/10",
                    )}
                  >
                    <TableCell className="font-medium text-gray-300">{notification.title}</TableCell>
                    <TableCell className="text-gray-300">{notification.message}</TableCell>
                    <TableCell className="text-gray-300">{new Date(notification.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-purple-500 hover:text-white mr-2"
                        onClick={() => handleEditNotification(notification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}