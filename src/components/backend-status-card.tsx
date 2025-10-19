"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Database, Cog, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { ApiService, ServiceStatus, ServiceHealth } from "@/lib/api"

export function BackendStatusCard() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [status, setStatus] = useState<ServiceStatus>({
    api: { status: 'unhealthy', service: 'api' },
    redis: { status: 'unhealthy', service: 'redis' }, 
    worker: { status: 'unhealthy', service: 'worker' },
    lastCheck: new Date().toISOString()
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkBackendServices = async () => {
    setIsChecking(true)
    
    try {
      // 🆕 Usar la nueva función de verificación de servicios
      const serviceStatus = await ApiService.checkServicesStatus()
      setStatus(serviceStatus)
    } catch (error) {
      console.error('Error checking services:', error)
      setStatus({
        api: { status: 'unhealthy', service: 'api' },
        redis: { status: 'unhealthy', service: 'redis' },
        worker: { status: 'unhealthy', service: 'worker' },
        lastCheck: new Date().toISOString(),
        error: 'Error conectando con el backend'
      })
    }
    
    setIsChecking(false)
  }

  useEffect(() => {
    checkBackendServices()
    const interval = setInterval(checkBackendServices, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (service: ServiceHealth | null, label: string, port?: string) => {
    if (!service) {
      return (
        <div className="flex items-center justify-between p-2 rounded border">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-400" />
            {label === 'API' && <Server className="h-4 w-4 text-muted-foreground" />}
            {label === 'Redis' && <Database className="h-4 w-4 text-muted-foreground" />}
            {label === 'Worker' && <Cog className="h-4 w-4 text-muted-foreground" />}
            <div>
              <span className="font-medium">{label}</span>
              {port && <span className="text-xs text-muted-foreground">:{port}</span>}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Unknown
          </Badge>
        </div>
      )
    }

    const isHealthy = service.status === 'healthy'
    const isDegraded = service.status === 'degraded'
    
    return (
      <div className="flex items-center justify-between p-2 rounded border">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : isDegraded ? (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          {label === 'API' && <Server className="h-4 w-4 text-muted-foreground" />}
          {label === 'Redis' && <Database className="h-4 w-4 text-muted-foreground" />}
          {label === 'Worker' && <Cog className="h-4 w-4 text-muted-foreground" />}
          <div>
            <span className="font-medium">{label}</span>
            {port && <span className="text-xs text-muted-foreground">:{port}</span>}
          </div>
        </div>
        <Badge 
          variant={isHealthy ? "default" : isDegraded ? "secondary" : "destructive"} 
          className="text-xs"
        >
          {isHealthy ? t('status.connected') : isDegraded ? t('status.degraded') : t('status.disconnected')}
        </Badge>
      </div>
    )
  }

  const formatLastCheck = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    
    if (diffSeconds < 60) return t('time.seconds_ago', { seconds: diffSeconds })
    if (diffSeconds < 3600) return t('time.minutes_ago', { minutes: Math.floor(diffSeconds / 60) })
    
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'de': 'de-DE', 
      'fr': 'fr-FR',
      'it': 'it-IT'
    }
    const locale = localeMap[language] || 'en-US'
    
    return date.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          {t('backend_services_status')}
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
        {getStatusBadge(status.api, "API", "3000")}
        {getStatusBadge(status.redis, "Redis", "6379")}
        {getStatusBadge(status.worker, "Worker")}
        
        {/* Última verificación */}
        <div className="text-xs text-muted-foreground">
          {t('status.last_check')} {formatLastCheck(status.lastCheck)}
        </div>
        
        {/* Mensaje de error */}
        {status.error && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <AlertCircle className="h-4 w-4" />
            {status.error || t('status.error_connecting')}
          </div>
        )}
        
        {/* Instrucciones según el estado */}
        {status.api?.status !== 'healthy' && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            💡 {t('status.start_backend_instruction')} <code className="bg-gray-200 px-1 rounded">docker-compose up --build -d</code>
          </div>
        )}
        
        {status.api?.status === 'healthy' && (status.redis?.status !== 'healthy' || status.worker?.status !== 'healthy') && (
          <div className="text-xs text-muted-foreground p-2 bg-yellow-50 border border-yellow-200 rounded">
            ⚠️ {t('status.partial_services')}
          </div>
        )}

        {status.api?.status === 'healthy' && status.redis?.status === 'healthy' && status.worker?.status === 'healthy' && (
          <div className="text-xs text-green-700 p-2 bg-green-50 border border-green-200 rounded">
            ✅ {t('status.all_services_ok')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}