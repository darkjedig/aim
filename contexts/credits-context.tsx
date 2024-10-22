"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface CreditsContextType {
  credits: number | null
  setCredits: React.Dispatch<React.SetStateAction<number | null>>
  updateCredits: (newCredits: number) => void
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user credits:', error)
        } else {
          setCredits(data.credits)
        }
      }
    }

    fetchCredits()
  }, [])

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits)
  }

  return (
    <CreditsContext.Provider value={{ credits, setCredits, updateCredits }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider')
  }
  return context
}
