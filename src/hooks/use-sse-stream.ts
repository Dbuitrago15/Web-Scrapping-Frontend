import { useEffect, useRef, useState, useCallback } from 'react'
import { ScrapingResult } from '@/lib/api'

interface SSEProgress {
  batchId: string
  completed: number
  total: number
  percentage: number
  timestamp: string
}

interface SSEResult extends ScrapingResult {
  timestamp: string
}

interface SSEComplete {
  batchId: string
  completed: number
  total: number
  message: string
  timestamp: string
}

interface SSEError {
  message: string
  error?: string
}

interface UseSSEStreamOptions {
  batchId: string | null
  onProgress?: (progress: SSEProgress) => void
  onResult?: (result: SSEResult) => void
  onComplete?: (complete: SSEComplete) => void
  onError?: (error: SSEError) => void
  backendUrl?: string
}

export function useSSEStream({
  batchId,
  onProgress,
  onResult,
  onComplete,
  onError,
  backendUrl = 'http://localhost:3000/api/v1' // Connect DIRECTLY to backend for SSE (proxy doesn't work)
}: UseSSEStreamOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCompletedRef = useRef(false)
  const isConnectingRef = useRef(false) // Prevent multiple connections
  
  // Stable refs for callbacks to avoid reconnection loops
  const onProgressRef = useRef(onProgress)
  const onResultRef = useRef(onResult)
  const onCompleteRef = useRef(onComplete)
  const onErrorRef = useRef(onError)
  
  // Update refs when callbacks change
  useEffect(() => {
    onProgressRef.current = onProgress
    onResultRef.current = onResult
    onCompleteRef.current = onComplete
    onErrorRef.current = onError
  }, [onProgress, onResult, onComplete, onError])

  // Polling fallback function
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current || hasCompletedRef.current) {
      return // Already polling or completed
    }

    console.log('🔄 Starting polling fallback (every 2 seconds)')
    setIsConnected(true) // Show as connected even with polling
    
    pollingIntervalRef.current = setInterval(async () => {
      if (!batchId || hasCompletedRef.current) {
        stopPolling()
        return
      }

      try {
        const response = await fetch(`/api/v1/scraping-batch/${batchId}`)
        const data = await response.json()
        
        console.log('📊 Polling update - Status:', data.status, 'Results:', data.results?.length || 0)
        
        // Update progress
        if (onProgressRef.current && data.progress) {
          onProgressRef.current({
            batchId: data.batchId,
            completed: data.progress.completed,
            total: data.progress.total,
            percentage: data.progress.percentage,
            timestamp: new Date().toISOString()
          })
        }
        
        // Send all results (the parent component will deduplicate)
        if (onResultRef.current && data.results && Array.isArray(data.results)) {
          data.results.forEach((result: any) => {
            if (onResultRef.current) {
              onResultRef.current({
                ...result,
                timestamp: new Date().toISOString()
              })
            }
          })
        }

        // Check if completed
        if (data.status === 'completed') {
          console.log('✅ Batch completed (detected via polling)')
          hasCompletedRef.current = true
          
          if (onCompleteRef.current) {
            onCompleteRef.current({
              batchId: data.batchId,
              completed: data.progress?.completed || 0,
              total: data.progress?.total || 0,
              message: 'Batch processing completed',
              timestamp: new Date().toISOString()
            })
          }
          
          stopPolling()
        }
      } catch (err) {
        console.error('❌ Polling error:', err)
      }
    }, 2000) // Poll every 2 seconds
  }, [batchId])

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('⏹️ Stopping polling')
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!batchId || isConnectingRef.current || hasCompletedRef.current) {
      console.log('⚠️ Skipping connection - batchId:', batchId, 'connecting:', isConnectingRef.current, 'completed:', hasCompletedRef.current)
      return
    }

    isConnectingRef.current = true
    console.log('🔌 Connecting to SSE stream for batch:', batchId)
    console.log('📡 Backend URL:', backendUrl)
    
    // Check if we're behind a proxy/CDN (Cloudflare, etc)
    const isProxied = typeof window !== 'undefined' && 
                     (window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1')
    
    if (isProxied) {
      console.log('🌐 Detected proxy/CDN, using polling instead of SSE')
      isConnectingRef.current = false
      startPolling()
      return
    }
    
    // First, check if the batch is already complete
    fetch(`/api/v1/scraping-batch/${batchId}`)
      .then(res => res.json())
      .then(data => {
        console.log('📋 Batch status:', data.status)
        
        // If batch is completed, still connect to SSE to get the results
        // But store the total so we know when to auto-complete
        const isAlreadyCompleted = data.status === 'completed'
        const totalFromBatch = data.progress?.total || data.totalJobs || 0
        
        if (isAlreadyCompleted) {
          console.log('✅ Batch already completed, connecting to SSE to fetch results. Total:', totalFromBatch)
          
          // Update progress with the total so the component knows how many to expect
          if (onProgressRef.current && totalFromBatch > 0) {
            onProgressRef.current({
              batchId: data.batchId,
              completed: 0, // Will be updated as results come in
              total: totalFromBatch,
              percentage: 0,
              timestamp: new Date().toISOString()
            })
          }
        }
        
        // If not complete, connect to SSE
        try {
          const url = `${backendUrl}/scraping-batch/${batchId}/stream`
          console.log('🔗 SSE URL:', url)
          const eventSource = new EventSource(url)
          eventSourceRef.current = eventSource

          // Connected event
          eventSource.addEventListener('connected', (event) => {
            const data = JSON.parse(event.data)
            console.log('✅ SSE Connected:', data)
            setIsConnected(true)
            setError(null)
            isConnectingRef.current = false
          })

          // Progress event
          eventSource.addEventListener('progress', (event) => {
            const data: SSEProgress = JSON.parse(event.data)
            console.log('📊 Progress data received:', data)
            // Only log progress updates, not every 2-second ping
            if (onProgressRef.current) {
              onProgressRef.current(data)
            }
          })

          // Result event (individual business result)
          eventSource.addEventListener('result', (event) => {
            const result: SSEResult = JSON.parse(event.data)
            console.log('📦 Result received:', result.originalData?.name)
            // Don't log every result (backend sends duplicates on each progress event)
            if (onResultRef.current) {
              onResultRef.current(result)
            }
          })

          // Complete event
          eventSource.addEventListener('complete', (event) => {
            const data: SSEComplete = JSON.parse(event.data)
            console.log('✅ SSE Complete:', data)
            hasCompletedRef.current = true
            if (onCompleteRef.current) {
              onCompleteRef.current(data)
            }
            disconnect()
          })

          // Error event
          eventSource.addEventListener('error', (event: any) => {
            if (event.data) {
              const errorData: SSEError = JSON.parse(event.data)
              console.error('❌ SSE Error event:', errorData)
              setError(errorData.message)
              if (onErrorRef.current) {
                onErrorRef.current(errorData)
              }
            }
          })

          // Generic error handler with polling fallback
          eventSource.onerror = (error) => {
            console.error('❌ SSE Connection error:', error)
            setIsConnected(false)
            setError('Connection lost. Switching to polling...')
            
            // If connection is closed, fallback to polling
            if (eventSource.readyState === EventSource.CLOSED) {
              console.log('🔄 SSE closed, starting polling fallback')
              disconnect()
              startPolling()
            }
          }

        } catch (err) {
          console.error('❌ Failed to create SSE connection:', err)
          setError('Failed to establish connection, using polling')
          setIsConnected(false)
          isConnectingRef.current = false
          startPolling()
        }
      })
      .catch(err => {
        console.error('❌ Failed to check batch status:', err)
        setError('Failed to check batch status')
        isConnectingRef.current = false
        startPolling() // Fallback to polling if status check fails
      })
  }, [batchId, backendUrl, startPolling])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('🔌 Disconnecting SSE stream')
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
    stopPolling()
    isConnectingRef.current = false
    hasCompletedRef.current = false
  }, [stopPolling])

  useEffect(() => {
    if (batchId) {
      connect()
    }

    return () => {
      // Only disconnect when unmounting or batchId actually changes
      if (eventSourceRef.current) {
        console.log('🔌 Cleanup: Disconnecting SSE stream')
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
    // Only reconnect when batchId changes, not when callbacks change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId])

  return {
    isConnected,
    error,
    disconnect
  }
}
