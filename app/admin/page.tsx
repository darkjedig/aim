"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, BarChart, Users, CreditCard, Wrench, Bell, Settings, ArrowLeft } from "lucide-react"
import { Overview } from './components/overview'
import { UserManagement } from './components/user-management'
import { SubscriptionsAndCredits } from './components/subscriptions-and-credits'
import { ToolConfiguration } from './components/tool-configuration'
import { Notifications } from './components/notifications'
import { SystemSettings } from './components/system-settings'
import { AddUserForm, AddPlanForm, AddPackageForm, AddToolForm } from './components/forms'

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

  const renderForm = () => {
    switch (activeForm) {
      case 'add-user':
        return <AddUserForm onClose={() => setActiveForm("")} />
      case 'add-plan':
        return <AddPlanForm onClose={() => setActiveForm("")} />
      case 'add-package':
        return <AddPackageForm onClose={() => setActiveForm("")} />
      case 'add-tool':
        return <AddToolForm onClose={() => setActiveForm("")} />
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
            <TabsContent value="overview">
              <Overview />
            </TabsContent>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            <TabsContent value="subscriptions">
              <SubscriptionsAndCredits 
                onAddPlan={() => setActiveForm("add-plan")} 
                onAddPackage={() => setActiveForm("add-package")} 
              />
            </TabsContent>
            <TabsContent value="tools">
              <ToolConfiguration onAddTool={() => setActiveForm("add-tool")} />
            </TabsContent>
            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>
            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}