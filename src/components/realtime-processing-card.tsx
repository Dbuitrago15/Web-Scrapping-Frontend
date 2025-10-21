"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertCircle, Eye, Maximize2, Minimize2, Upload } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult } from "@/lib/api"
import { useSSEStream } from "@/hooks/use-sse-stream"
import { DataTable } from "@/components/data-table"

interface RealtimeProcessingCardProps {
  batchId: string | null
  progress: {
    completed: number
    total: number
  }
  onProgressUpdate?: (completed: number, total: number) => void
  onComplete?: (completeData?: { completed: number; total: number }) => void
  onNewSearch?: () => void
}

export function RealtimeProcessingCard({ 
  batchId, 
  progress: initialProgress,
  onProgressUpdate,
  onComplete,
  onNewSearch
}: RealtimeProcessingCardProps) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(initialProgress)
  const [realtimeResults, setRealtimeResults] = useState<ScrapingResult[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasReceivedData, setHasReceivedData] = useState(false)
  const [showStuckWarning, setShowStuckWarning] = useState(false)
  const [isProcessingComplete, setIsProcessingComplete] = useState(false)
  const processedBusinessIdsRef = useRef<Set<string>>(new Set()) // Track processed businesses to avoid duplicates
  const previousBatchIdRef = useRef<string | null>(null)
  
  // Reset processed IDs ONLY when batchId actually changes (not when initialProgress changes)
  useEffect(() => {
    if (batchId !== previousBatchIdRef.current) {
      console.log('🔄 Batch ID changed, resetting processed results')
      previousBatchIdRef.current = batchId
      processedBusinessIdsRef.current.clear()
      setRealtimeResults([])
      setProgress(initialProgress)
      setHasReceivedData(false)
      setShowStuckWarning(false)
      setIsProcessingComplete(false)
    }
  }, [batchId, initialProgress])
  
  // Show "stuck" warning after 5 seconds if no data received
  useEffect(() => {
    if (!hasReceivedData && batchId) {
      const timer = setTimeout(() => {
        if (!hasReceivedData) {
          console.log('⚠️ No data received after 5 seconds, showing warning')
          setShowStuckWarning(true)
        }
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [hasReceivedData, batchId])
  
  // Connect to SSE stream (uses Next.js proxy)
  const { isConnected, error: sseError } = useSSEStream({
    batchId,
    onProgress: (progressData) => {
      // Backend sends progress updates
      setHasReceivedData(true) // We have data
      
      // Update total if we receive it from backend
      if (progressData.total && progressData.total > 0) {
        setProgress(prev => ({
          completed: processedBusinessIdsRef.current.size,
          total: progressData.total
        }))
        
        if (onProgressUpdate) {
          onProgressUpdate(processedBusinessIdsRef.current.size, progressData.total)
        }
      }
    },
    onResult: (result) => {
      // Deduplicate results using jobId as unique identifier
      const businessId = result.jobId || 
                        result.originalData?.name || 
                        `${result.originalData?.address}-${result.originalData?.city}`
      
      if (processedBusinessIdsRef.current.has(businessId)) {
        // Silently skip duplicates (backend sends all results on each progress event)
        return
      }
      
      console.log('✅ New result added:', result.originalData?.name || businessId)
      processedBusinessIdsRef.current.add(businessId)
      setRealtimeResults((prev) => [result, ...prev])
      
      // Update progress with new result count
      const newCompleted = processedBusinessIdsRef.current.size
      
      // Update completed count only, KEEP the total from initialProgress
      setProgress(prev => {
        const currentTotal = prev.total // Use the total from upload (7 jobs)
        
        console.log(`📊 Progress: ${newCompleted}/${currentTotal}`)
        
        // Check if we've received all results
        if (newCompleted >= currentTotal && currentTotal > 0 && !isProcessingComplete) {
          console.log('✅ All results received, marking as complete')
          setIsProcessingComplete(true)
          
          // Trigger parent completion
          if (onComplete) {
            setTimeout(() => {
              onComplete({
                completed: newCompleted,
                total: currentTotal
              })
            }, 500) // Small delay to ensure UI updates
          }
        }
        
        return {
          completed: newCompleted,
          total: currentTotal // NEVER change the total
        }
      })
    },
    onComplete: (completeData) => {
      console.log('✅ Processing complete:', completeData)
      
      // Use the actual number of results we received as the total
      const finalCompleted = processedBusinessIdsRef.current.size
      const finalTotal = Math.max(completeData.total, finalCompleted)
      
      // Update local progress state with final values
      setProgress({
        completed: finalCompleted,
        total: finalTotal
      })
      setHasReceivedData(true) // We have data
      setIsProcessingComplete(true) // Mark as complete
      
      // Call parent's onComplete with results
      if (onComplete) {
        onComplete({
          completed: finalCompleted,
          total: finalTotal
        })
      }
    },
    onError: (error) => {
      console.error('❌ SSE Error:', error)
    }
  })

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isProcessingComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            <CardTitle>
              {isProcessingComplete ? 'Processing Complete' : 'Real-Time Processing'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && !isProcessingComplete && (
              <Badge variant="outline" className="text-xs">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
                Live
              </Badge>
            )}
            {isProcessingComplete && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Done
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardDescription>
          {progress.total > 0 
            ? isProcessingComplete
              ? `Successfully processed ${progress.completed} of ${progress.total} businesses`
              : `Processing ${progress.completed} of ${progress.total} businesses`
            : 'Starting scraping process...'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              {!hasReceivedData ? 'Connecting...' : `${progressPercentage}%`}
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full h-3" />
        </div>

        {/* Connection Status */}
        {sseError && (
          <div className="text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200">
            ⚠️ {sseError}
          </div>
        )}

        {/* Stuck batch warning - only show after 5 seconds if no data */}
        {showStuckWarning && progress.total === 0 && !isConnected && !sseError && batchId && (
          <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Processing Stuck or Already Completed
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This batch might have been processed already. Click below to start a new search.
                </p>
              </div>
            </div>
            {onNewSearch && (
              <Button 
                onClick={onNewSearch}
                size="sm"
                variant="outline"
                className="w-full bg-white hover:bg-yellow-50 border-yellow-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New CSV
              </Button>
            )}
          </div>
        )}

        {/* Real-time Results DataTable */}
        {realtimeResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {isProcessingComplete ? 'Final Results' : 'Live Results'} ({realtimeResults.length} / {progress.total})
              </h3>
              {!isProcessingComplete && (
                <Badge variant="outline" className="text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
                  Processing
                </Badge>
              )}
            </div>

            <DataTable data={realtimeResults} />
          </div>
        )}

        {/* Stats Summary */}
        {progress.total > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.total - progress.completed}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{progress.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        )}

        {/* New Search Button */}
        {onNewSearch && progress.total === 0 && (
          <div className="pt-4 border-t">
            <Button 
              onClick={onNewSearch}
              variant="outline"
              className="w-full"
            >
              🔄 Start New Search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
