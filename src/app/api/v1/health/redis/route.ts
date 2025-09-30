import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/health/redis', {
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