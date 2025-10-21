import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  const { batchId } = params

  if (!batchId) {
    return NextResponse.json(
      { error: 'Batch ID is required' },
      { status: 400 }
    )
  }

  try {
    const backendUrl = `${BACKEND_URL}/api/v1/scraping-batch/${batchId}/stream`
    console.log(`📡 Proxying SSE request to: ${backendUrl}`)

    // Create a readable stream for SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
              Accept: 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          })

          if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`)
          }

          if (!response.body) {
            throw new Error('No response body from backend')
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              console.log('✅ SSE stream ended')
              controller.close()
              break
            }

            // Forward the SSE data chunk to the client
            const chunk = decoder.decode(value, { stream: true })
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error: any) {
          console.error('❌ SSE Proxy Error:', error)
          
          // Send error event to client
          const errorEvent = `event: error\ndata: ${JSON.stringify({ 
            message: error.message || 'Stream connection failed' 
          })}\n\n`
          controller.enqueue(encoder.encode(errorEvent))
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable buffering for Nginx
      },
    })
  } catch (error: any) {
    console.error('❌ Error creating SSE proxy:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to connect to backend stream' },
      { status: 500 }
    )
  }
}
