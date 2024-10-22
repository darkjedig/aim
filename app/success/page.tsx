"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'

export default function SuccessPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchSessionAndUpdateUser = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id')
      console.log('Session ID from URL:', sessionId);
      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout-session?session_id=${sessionId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          console.log('Checkout session data:', data)
          setSession(data)

          // No need to update user data here, as it's handled by the webhook
        } catch (err) {
          console.error('Error fetching session:', err)
          setError('Failed to load session data. Please contact support.')
        } finally {
          setLoading(false)
        }
      } else {
        console.error('No session ID found in URL')
        setLoading(false)
        setError('No session ID found. Please contact support.')
      }
    }

    fetchSessionAndUpdateUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Processing Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-purple-500/20 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-4">Thank you for your purchase.</p>
          {session && (
            <p className="text-gray-300 mb-4">
              {session.mode === 'subscription'
                ? `Your ${session.metadata?.plan_name || 'subscription'} is now active.`
                : `You have purchased ${session.metadata?.credits || 0} credits.`}
            </p>
          )}
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
