"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { User, CreditCard, Zap, FileText, Cpu } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 z-10">
      <nav className="mt-5">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <User className="mr-2 h-4 w-4" /> Overview
          </Button>
        </Link>
        <Link href="/dashboard/subscription">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Subscription
          </Button>
        </Link>
        <Link href="/dashboard/credits">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <Zap className="mr-2 h-4 w-4" /> Credits
          </Button>
        </Link>
        <Link href="/dashboard/library">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" /> Content Library
          </Button>
        </Link>
        <Link href="/dashboard/tools">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <Cpu className="mr-2 h-4 w-4" /> Tools
          </Button>
        </Link>
      </nav>
    </aside>
  )
}
