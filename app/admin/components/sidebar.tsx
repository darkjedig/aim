import { Home, Users, CreditCard, Wrench, Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { name: 'Overview', icon: Home, section: 'overview' },
    { name: 'Users', icon: Users, section: 'users' },
    { name: 'Subscriptions/Credit', icon: CreditCard, section: 'subscriptions' },
    { name: 'Tools', icon: Wrench, section: 'tools' },
    { name: 'Notifications', icon: Bell, section: 'notifications' },
    { name: 'Settings', icon: Settings, section: 'settings' },
  ]

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Button
            key={item.section}
            variant="ghost"
            className={`w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors ${
              activeSection === item.section ? 'text-gray-100' : 'text-gray-400'
            }`}
            onClick={() => setActiveSection(item.section)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
    </div>
  )
}