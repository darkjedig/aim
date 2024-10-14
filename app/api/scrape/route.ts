import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  const { url } = await request.json()

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script, style').remove()

    // Get the text content
    const text = $('body').text().trim()

    return NextResponse.json({ text })
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return NextResponse.json({ error: 'Failed to scrape URL', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
