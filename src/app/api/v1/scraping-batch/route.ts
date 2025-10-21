import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward the request to the backend
    // Backend is running on port 3000 (Docker container scraper_api:3000:3000)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/api/v1/scraping-batch`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Backend error:', response.status, errorData)
      return NextResponse.json(
        { error: 'Backend processing failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Scraping batch proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    )
  }
}