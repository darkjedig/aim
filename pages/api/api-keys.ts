import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated and is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('account_level')
    .eq('user_id', user.id)
    .single()

  if (userError || userData?.account_level !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
    
    if (error) {
      return res.status(500).json({ error: 'Error fetching API keys' })
    }
    
    return res.status(200).json(data)
  } else if (req.method === 'POST') {
    const { key_name, key_value } = req.body
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({ key_name, key_value })
      .select()
    
    if (error) {
      return res.status(500).json({ error: 'Error adding new API key' })
    }
    
    return res.status(201).json(data[0])
  } else if (req.method === 'PUT') {
    const { id, key_value } = req.body
    
    const { data, error } = await supabase
      .from('api_keys')
      .update({ key_value })
      .eq('id', id)
      .select()
    
    if (error) {
      return res.status(500).json({ error: 'Error updating API key' })
    }
    
    return res.status(200).json(data[0])
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
