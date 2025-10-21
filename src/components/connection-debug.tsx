"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import config from '@/lib/config'

export function ConnectionDebug() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [sseStatus, setSSEStatus] = useState<'checking' | 'supported' | 'not-supported'>('checking')

  useEffect(() => {
    // Check backend connection
    fetch(`${config.getBackendUrl()}/health`)
      .then(res => {
        if (res.ok) {
          setBackendStatus('connected')
        } else {
          setBackendStatus('error')
        }
      })
      .catch(() => {
        setBackendStatus('error')
      })

    // Check SSE support
    if (typeof EventSource !== 'undefined') {
      setSSEStatus('supported')
    } else {
      setSSEStatus('not-supported')
    }
  }, [])

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">🔍 Connection Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Backend URL:</span>
          <code className="text-xs bg-white px-2 py-1 rounded">{config.getBackendUrl()}</code>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Backend Status:</span>
          {backendStatus === 'checking' && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          )}
          {backendStatus === 'connected' && (
            <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
          )}
          {backendStatus === 'error' && (
            <Badge variant="outline" className="gap-1 border-red-200 bg-red-50 text-red-700">
              <XCircle className="h-3 w-3" />
              Error
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">SSE Support:</span>
          {sseStatus === 'supported' ? (
            <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
              <CheckCircle className="h-3 w-3" />
              Supported
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
              <XCircle className="h-3 w-3" />
              Not Supported
            </Badge>
          )}
        </div>

        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs text-gray-500">
            💡 If backend shows error, check if Docker containers are running
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
