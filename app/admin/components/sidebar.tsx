import { Home, Users, CreditCard, Wrench, Bell, Settings } from 'lucide-react'

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { name: 'Overview', icon: Home, section: 'overview' },
    { name: 'Users', icon: Users, section: 'users' },
    { name: 'Subscriptions', icon: CreditCard, section: 'subscriptions' },
    { name: 'Tools', icon: Wrench, section: 'tools' },
    { name: 'Notifications', icon: Bell, section: 'notifications' },
    { name: 'Settings', icon: Settings, section: 'settings' },
  ]

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>
      <ul className="flex flex-col py-4">
        {menuItems.map((item) => (
          <li key={item.section}>
            <a
              href="#"
              className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                activeSection === item.section ? 'text-gray-100' : 'text-gray-400'
              }`}
              onClick={() => setActiveSection(item.section)}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <item.icon />
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}