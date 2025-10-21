import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Backend is running on port 3000 (Docker container scraper_api:3000:3000)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/health/redis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Redis health check failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Redis health check proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Redis service' },
      { status: 500 }
    )
  }
}