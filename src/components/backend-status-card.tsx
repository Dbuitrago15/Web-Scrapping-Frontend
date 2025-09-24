"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Database, Cog } from "lucide-react"

interface ServiceStatus {
  api: boolean
  redis: boolean
  worker: boolean
}

export function BackendStatusCard() {
  const [status, setStatus] = useState<ServiceStatus>({
    api: false,
    redis: false, 
    worker: false
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkBackendServices = async () => {
    setIsChecking(true)
    
    // Check API
    let apiStatus = false
    try {
      const response = await fetch('http://localhost:8000/', { 
        method: 'GET',
        timeout: 5000 
      } as any)
      apiStatus = response.ok
    } catch {
      apiStatus = false
    }

    // Note: We can't directly check Redis and Celery from frontend
    // These would need backend endpoints to report their status
    
    setStatus({
      api: apiStatus,
      redis: false, // Would need backend endpoint
      worker: false  // Would need backend endpoint
    })
    
    setIsChecking(false)
  }

  useEffect(() => {
    checkBackendServices()
    const interval = setInterval(checkBackendServices, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (isUp: boolean, label: string) => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        {label === 'API' && <Server className="h-4 w-4" />}
        {label === 'Redis' && <Database className="h-4 w-4" />}
        {label === 'Worker' && <Cog className="h-4 w-4" />}
        {label}
      </span>
      <Badge variant={isUp ? "default" : "destructive"}>
        {isUp ? "✅ Up" : "❌ Down"}
      </Badge>
    </div>
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Backend Services Status
          <Button 
            variant="ghost" 
            size="sm"
            onClick={checkBackendServices}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {getStatusBadge(status.api, "API")}
        {getStatusBadge(status.redis, "Redis")}
        {getStatusBadge(status.worker, "Worker")}
        
        {!status.api && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            💡 Start backend: <code>docker-compose up --build -d</code>
          </div>
        )}
        
        {status.api && (!status.redis || !status.worker) && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            ⚠️ API is running but Redis/Worker status unknown. 
            Check <code>docker-compose ps</code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}