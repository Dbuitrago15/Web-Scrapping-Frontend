import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/health/worker', {
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