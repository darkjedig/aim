import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('account_level')
    .eq('user_id', user.id)
    .single()

  if (userError || userData?.account_level !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: 'Error fetching API keys' }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('account_level')
    .eq('user_id', user.id)
    .single()

  if (userError || userData?.account_level !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { key_name, key_value } = await request.json()
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({ key_name, key_value })
    .select()
  
  if (error) {
    return NextResponse.json({ error: 'Error adding new API key' }, { status: 500 })
  }
  
  return NextResponse.json(data[0], { status: 201 })
}

export async function PUT(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('account_level')
    .eq('user_id', user.id)
    .single()

  if (userError || userData?.account_level !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, key_value } = await request.json()
  
  const { data, error } = await supabase
    .from('api_keys')
    .update({ key_value })
    .eq('id', id)
    .select()
  
  if (error) {
    return NextResponse.json({ error: 'Error updating API key' }, { status: 500 })
  }
  
  return NextResponse.json(data[0])
}

export async function DELETE(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('account_level')
    .eq('user_id', user.id)
    .single()

  if (userError || userData?.account_level !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing API key ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Error deleting API key' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
