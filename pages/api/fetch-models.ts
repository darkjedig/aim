import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiService, apiKey } = req.body;

  if (!apiService || !apiKey) {
    return res.status(400).json({ error: 'Missing apiService or apiKey' });
  }

  try {
    let models: string[] = [];

    if (apiService === 'OpenAI') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const data = await response.json();
      models = data.data.map((model: any) => model.id);
    } else if (apiService === 'Replicate') {
      const response = await fetch('https://api.replicate.com/v1/models', {
        headers: { 'Authorization': `Token ${apiKey}` }
      });
      const data = await response.json();
      models = data.results.map((model: any) => model.name);
    }

    res.status(200).json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Error fetching models' });
  }
}
