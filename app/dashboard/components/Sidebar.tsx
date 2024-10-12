"use client"

import { Button } from "@/components/ui/button"
import { User, CreditCard, Zap, FileText, Cpu } from "lucide-react"

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

export function Sidebar({ setActiveSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 p-4 z-10">
      <nav className="mt-5">
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={() => setActiveSection("overview")}
        >
          <User className="mr-2 h-4 w-4" /> Overview
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={() => setActiveSection("subscription")}
        >
          <CreditCard className="mr-2 h-4 w-4" /> Subscription
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={() => setActiveSection("credits")}
        >
          <Zap className="mr-2 h-4 w-4" /> Credits
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={() => setActiveSection("library")}
        >
          <FileText className="mr-2 h-4 w-4" /> Content Library
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          onClick={() => setActiveSection("tools")}
        >
          <Cpu className="mr-2 h-4 w-4" /> Tools
        </Button>
      </nav>
    </aside>
  )
}
