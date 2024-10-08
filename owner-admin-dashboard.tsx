"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, CreditCard, LogOut, Settings, User, Search, Zap, PenTool, Share2, Image as ImageIcon, Maximize, Database, BarChart, FileText, Cpu, Download, Trash2, Users, DollarSign, Activity, AlertTriangle, Ban, Edit, Wrench, ArrowLeft } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

// Mock data for demonstration
const mockData = {
  totalUsers: 5000,
  monthlyRevenue: 50000,
  totalCreditsConsumed: 100000,
  topTools: ['SEO Topic Finder', 'AI Content Writer', 'Strategy Builder'],
  usageData: [
    { name: 'Jan', usage: 4000 },
    { name: 'Feb', usage: 3000 },
    { name: 'Mar', usage: 5000 },
    { name: 'Apr', usage: 4500 },
    { name: 'May', usage: 6000 },
    { name: 'Jun', usage: 5500 },
  ],
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', credits: 500, lastLogin: '2023-09-28' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', credits: 0, lastLogin: '2023-08-15' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', credits: 250, lastLogin: '2023-09-27' },
  ],
}

const useRequireAuth = () => {
  const router = useRouter()
  const isAuthenticated = true // Replace with actual auth check

  if (!isAuthenticated) {
    router.push('/login')
  }

  return isAuthenticated
}

export default function OwnerAdminDashboard() {
  useRequireAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [activeForm, setActiveForm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Success",
      description: `New ${activeForm.replace('add-', '')} has been successfully added.`,
    })
    setActiveForm("")
  }

  const renderForm = () => {
    switch (activeForm) {
      case 'add-user':
        return (
          <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Add New User</CardTitle>
              <CardDescription className="text-gray-400">Create a new user account in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">Role</Label>
                  <Select required>
                    <SelectTrigger className="bg-gray-700 text-gray-300 border-gray-600">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-300 border-gray-600">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialCredits" className="text-gray-300">Initial Credits</Label>
                  <Input id="initialCredits" type="number" placeholder="100" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>
                  {isLoading ? "Adding User..." : "Add User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'add-plan':
        return (
          <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Add New Subscription Plan</CardTitle>
              <CardDescription className="text-gray-400">Create a new subscription plan for users.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Plan Name</Label>
                  <Input id="name" placeholder="Pro Plan" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Monthly Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="99.99" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-gray-300">Monthly Credits</Label>
                  <Input id="credits" type="number" placeholder="5000" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features" className="text-gray-300">Features (one per line)</Label>
                  <Textarea 
                    id="features" 
                    placeholder="Unlimited AI content generation&#10;24/7 customer support&#10;Advanced analytics" 
                    rows={5}
                    required 
                    className="bg-gray-700 text-gray-300 border-gray-600"
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>
                  {isLoading ? "Adding Plan..." : "Add Subscription Plan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'add-package':
        return (
          <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Add New Credit Package</CardTitle>
              <CardDescription className="text-gray-400">Create a new credit package for users to purchase.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Package Name</Label>
                  <Input id="name" placeholder="Starter Pack" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-gray-300">Number of Credits</Label>
                  <Input id="credits" type="number" placeholder="1000" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="49.99" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validityPeriod" className="text-gray-300">Validity Period (days)</Label>
                  <Input id="validityPeriod" type="number" placeholder="30" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>
                  {isLoading ? "Adding Package..." : "Add Credit Package"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'add-tool':
        return (
          <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Add New AI Tool</CardTitle>
              <CardDescription className="text-gray-400">Create a new AI tool for users to utilize.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Tool Name</Label>
                  <Input id="name" placeholder="AI Content Generator" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Generate high-quality content using advanced AI technology." 
                    rows={3}
                    required 
                    className="bg-gray-700 text-gray-300 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiModel" className="text-gray-300">AI Model</Label>
                  <Select required>
                    <SelectTrigger className="bg-gray-700 text-gray-300 border-gray-600">
                      <SelectValue placeholder="Select an AI model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-300 border-gray-600">
                      <SelectItem value="gpt3">GPT-3</SelectItem>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditCost" className="text-gray-300">Credit Cost per Use</Label>
                  <Input id="creditCost" type="number" placeholder="10" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="text-gray-300">Max Tokens</Label>
                  <Input id="maxTokens" type="number" placeholder="2000" required className="bg-gray-700 text-gray-300 border-gray-600" />
                </div>
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>
                  {isLoading ? "Adding Tool..." : "Add AI Tool"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <div className="flex items-center mb-6">
          <Cpu className="h-8 w-8 text-purple-500 mr-2" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Admin</span>
        </div>
        <nav>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("overview")}
          >
            <BarChart className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" /> User Management
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("subscriptions")}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Subscriptions & Credits
          
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("tools")}
          >
            <Wrench className="mr-2 h-4 w-4" /> Tool Configuration
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" /> System Settings
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Owner Admin Dashboard</h1>
        </div>

        {activeForm ? (
          <>
            <Button
              variant="ghost"
              onClick={() => setActiveForm("")}
              className="mb-4 text-gray-300 hover:text-white hover:bg-purple-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {renderForm()}
          </>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Active Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-100">{mockData.totalUsers}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-100">${mockData.monthlyRevenue}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Credits Consumed</CardTitle>
                    <Zap className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-100">{mockData.totalCreditsConsumed}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Top Tools</CardTitle>
                    <Wrench className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-300">
                      {mockData.topTools.map((tool, index) => (
                        <li key={index}>{tool}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Tool Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData.usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Line type="monotone" dataKey="usage" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <Input type="text" placeholder="Search users..." className="w-64 bg-gray-700 text-gray-300 border-gray-600" />
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setActiveForm("add-user")}>Add New User</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Credits</TableHead>
                        <TableHead className="text-gray-300">Last Login</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockData.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-gray-300">{user.status}</TableCell>
                          <TableCell className="text-gray-300">{user.credits}</TableCell>
                          <TableCell className="text-gray-300">{user.lastLogin}</TableCell>
                          <TableCell className="text-gray-300">
                            <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white mr-2">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-red-500 hover:text-white">
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Subscription Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Plan Name</TableHead>
                        <TableHead className="text-gray-300">Monthly Credits</TableHead>
                        <TableHead className="text-gray-300">Price</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">Basic</TableCell>
                        <TableCell className="text-gray-300">1000</TableCell>
                        <TableCell className="text-gray-300">$29.99</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">Pro</TableCell>
                        <TableCell className="text-gray-300">5000</TableCell>
                        <TableCell className="text-gray-300">$99.99</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setActiveForm("add-plan")}>Add New Plan</Button>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Credit Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Package Name</TableHead>
                        <TableHead className="text-gray-300">Credits</TableHead>
                        <TableHead className="text-gray-300">Price</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">Small</TableCell>
                        <TableCell className="text-gray-300">500</TableCell>
                        <TableCell className="text-gray-300">$19.99</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">Large</TableCell>
                        <TableCell className="text-gray-300">2000</TableCell>
                        <TableCell className="text-gray-300">$69.99</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setActiveForm("add-package")}>Add New Package</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Tool Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Tool Name</TableHead>
                        <TableHead className="text-gray-300">Credit Cost</TableHead>
                        <TableHead className="text-gray-300">AI Model</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">SEO Topic Finder</TableCell>
                        <TableCell className="text-gray-300">10</TableCell>
                        <TableCell className="text-gray-300">OpenAI GPT-3</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-300">AI Content Writer</TableCell>
                        <TableCell className="text-gray-300">20</TableCell>
                        <TableCell className="text-gray-300">Anthropic Claude</TableCell>
                        <TableCell className="text-gray-300">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setActiveForm("add-tool")}>Add New Tool</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">System Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Low user credit balance alert</span>
                      <Input type="number" className="w-20 bg-gray-700 text-gray-300 border-gray-600" defaultValue={10} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Subscription expiration reminder (days before)</span>
                      <Input type="number" className="w-20 bg-gray-700 text-gray-300 border-gray-600" defaultValue={7} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API key error notification</span>
                      <Input type="checkbox" className="bg-gray-700 text-purple-500 border-gray-600" defaultChecked />
                    </div>
                  </div>
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Save Settings</Button>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">User Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input type="text" placeholder="Alert Title" className="w-full bg-gray-700 text-gray-300 border-gray-600" />
                    <textarea
                      placeholder="Alert Message"
                      className="w-full h-24 p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md resize-none"
                    ></textarea>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">Send Alert to All Users</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">API Keys & Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="openai-key" className="text-gray-300">OpenAI API Key</Label>
                      <Input id="openai-key" type="password" className="bg-gray-700 text-gray-300 border-gray-600" value="••••••••••••••••" />
                    </div>
                    <div>
                      <Label htmlFor="anthropic-key" className="text-gray-300">Anthropic API Key</Label>
                      <Input id="anthropic-key" type="password" className="bg-gray-700 text-gray-300 border-gray-600" value="••••••••••••••••" />
                    </div>
                    <div>
                      <Label htmlFor="stripe-key" className="text-gray-300">Stripe API Key</Label>
                      <Input id="stripe-key" type="password" className="bg-gray-700 text-gray-300 border-gray-600" value="••••••••••••••••" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Update API Keys</Button>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gray-100">Backup & Restore</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">Create Backup</Button>
                    <div>
                      <Label htmlFor="restore-file" className="text-gray-300">Restore from Backup</Label>
                      <Input id="restore-file" type="file" className="bg-gray-700 text-gray-300 border-gray-600" />
                    </div>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">Restore System</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}