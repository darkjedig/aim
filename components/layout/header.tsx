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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Cpu, ChevronDown, User as UserIcon, Settings, LogOut, Shield, Bell, Trash2, Coins } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCredits } from "@/contexts/credits-context";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  user_id: string | null;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [hiddenNotifications, setHiddenNotifications] = useState<number[]>([])

  const { credits } = useCredits()
  const [prevCredits, setPrevCredits] = useState<number | null>(null)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [pathname]); // Add pathname as a dependency

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data || []);
          setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        }
      }
    };

    fetchNotifications();

    // Set up real-time listener for new notifications
    const notificationsSubscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        if (payload.new.user_id === user?.id || payload.new.user_id === null) {
          setNotifications(prev => [payload.new, ...prev].slice(0, 5));
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [user]);

  useEffect(() => {
    if (credits !== null && prevCredits !== null && credits !== prevCredits) {
      // Credits have changed, trigger animation
      setPrevCredits(credits)
    } else if (credits !== null && prevCredits === null) {
      // Initial credits set
      setPrevCredits(credits)
    }
  }, [credits, prevCredits])

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setUnreadCount(prev => Math.max(prev - 1, 0));
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    }
  };

  const deleteNotification = async (id: number) => {
    // Instead of deleting from the database, we just hide it for the current user
    setHiddenNotifications(prev => [...prev, id]);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  // Filter out hidden notifications
  const visibleNotifications = notifications.filter(n => !hiddenNotifications.includes(n.id));

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setUser(null);
        router.push("/");
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
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AIM</span>
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
                  <DropdownMenuItem>
                    <Link href="/tools/seo/strategy-builder">Strategy Builder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/seo/blog-writer">Blog Writer</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/seo/outrank">Outrank</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/seo/internal-link-optimizer">Internal Link Optimizer</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>PPC Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link href="/tools/ppc/keyword-finder">Keyword Finder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/ppc/headline-generator">Headline Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/ppc/description-writer">Description Writer</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Social Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link href="/tools/social/topic-finder">Topic Finder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/social/post-builder">Post Builder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Post Scheduler</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Creative Tools</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link href="/tools/creative/image-generator">Image Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/creative/background-remover">Background Remover</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/creative/image-upscaler">Image Upscaler</Link>
                  </DropdownMenuItem>
                  {/* Add more creative tools here */}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/pricing" className="text-sm font-medium text-gray-200 hover:text-purple-400 transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-2">
                <Bell className="h-5 w-5 text-purple-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700">
              <DropdownMenuLabel className="text-gray-300">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {visibleNotifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="text-gray-300 hover:bg-gray-700 flex justify-between items-start group"
                >
                  <div onClick={() => markAsRead(notification.id)} className="cursor-pointer flex-grow group-hover:text-white">
                    <div className="font-semibold">{notification.title}</div>
                    <div className="text-sm text-gray-400 group-hover:text-white">{notification.message}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-500 hover:text-white ml-2"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              {!user && (
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 group">
                  <div className="p-1 rounded-full group-hover:bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300">
                    <UserIcon className="h-6 w-6 text-purple-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  {user && <span className="text-sm text-white">{user.email}</span>}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border border-gray-700">
                  {user ? (
                    <>
                      <DropdownMenuItem className="text-gray-200 hover:bg-gray-700 hover:text-white">
                        <Link href="/dashboard" className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Account Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-200 hover:bg-gray-700 hover:text-white" onSelect={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="text-gray-200 hover:bg-gray-700 hover:text-white">
                        <Link href="/sign-in" className="flex items-center w-full">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log In</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-200 hover:bg-gray-700 hover:text-white">
                        <Link href="/sign-up" className="flex items-center w-full">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Sign Up</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {/* Credits display */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
            <Coins className="h-4 w-4 text-yellow-500" />
            <AnimatePresence>
              <motion.span
                key={credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="font-medium text-yellow-500"
              >
                {credits}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
