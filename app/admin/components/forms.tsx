import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface FormProps {
  onClose: () => void;
}

export function AddUserForm({ onClose }: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Success",
      description: "New user has been successfully added.",
    })
    onClose()
  }

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
}

export function AddPlanForm({ onClose }: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Success",
      description: "New subscription plan has been successfully added.",
    })
    onClose()
  }

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
}

export function AddPackageForm({ onClose }: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Success",
      description: "New credit package has been successfully added.",
    })
    onClose()
  }

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
}

export function AddToolForm({ onClose }: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Success",
      description: "New AI tool has been successfully added.",
    })
    onClose()
  }

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
}