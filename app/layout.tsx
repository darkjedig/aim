"use client"

import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreditsProvider } from '@/contexts'

export default function RootLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const message = searchParams?.get('message');
    if (message === 'email_changed') {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CreditsProvider>
          <Header />
          <main className="flex-grow w-full max-w-full">
            {showMessage && (
              <div className="bg-green-500 text-white p-4 text-center">
                Your email address has been successfully changed
              </div>
            )}
            {children}
          </main>
          <Footer />
          <Toaster />
        </CreditsProvider>
      </body>
    </html>
  );
}
