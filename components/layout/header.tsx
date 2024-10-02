"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cpu, ChevronDown } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Cpu className="h-8 w-8 text-purple-500" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AIMarketer</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
  <Link href="/" className="text-sm font-medium text-gray-200 hover:text-purple-400 transition-colors">
    Home
  </Link>
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-200 hover:text-purple-400 transition-colors">
      Tools <ChevronDown className="ml-1 h-4 w-4" />
    </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>SEO Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link href="/tools/seo/topic-finder">Topic Finder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Strategy Builder</DropdownMenuItem>
                  <DropdownMenuItem>Blog Writer</DropdownMenuItem>
                  <DropdownMenuItem>Outrank</DropdownMenuItem>
                  <DropdownMenuItem>Internal Link Optimizer</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>PPC Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Keyword Finder</DropdownMenuItem>
                  <DropdownMenuItem>Headline Generator</DropdownMenuItem>
                  <DropdownMenuItem>Description Writer</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Social Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Topic Finder</DropdownMenuItem>
                  <DropdownMenuItem>Post Builder</DropdownMenuItem>
                  <DropdownMenuItem>Post Scheduler</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Creative Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Image Generator</DropdownMenuItem>
                  <DropdownMenuItem>BG Remover</DropdownMenuItem>
                  <DropdownMenuItem>Image Upscaler</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
            </DropdownMenu>
  <Link href="/pricing" className="text-sm font-medium text-gray-200 hover:text-purple-400 transition-colors">
    Pricing
  </Link>
</nav>
        <div className="flex items-center space-x-4">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-white">Welcome, {user.email}</span>
              <Button onClick={handleLogout} variant="outline" className="bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-white">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline" className="bg-gray-800 text-white border-purple-500 hover:bg-purple-500/20 hover:text-white">Log In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}