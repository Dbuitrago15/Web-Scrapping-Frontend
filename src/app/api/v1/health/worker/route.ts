import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Backend is running on port 3000 (Docker container scraper_api:3000:3000)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/health/worker`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Worker health check failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Worker health check proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Worker service' },
      { status: 500 }
    )
  }
}