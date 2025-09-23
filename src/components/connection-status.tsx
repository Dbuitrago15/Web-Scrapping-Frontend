import React, { useState, useEffect } from 'react'
import { ApiService } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await ApiService.healthCheck()
        setIsConnected(connected)
      } catch {
        setIsConnected(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkConnection()
    
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (isChecking) {
    return (
      <Badge variant="secondary" className="mb-4">
        <Wifi className="h-3 w-3 mr-1 animate-pulse" />
        Checking connection...
      </Badge>
    )
  }

  return (
    <Badge 
      variant={isConnected ? "default" : "secondary"} 
      className="mb-4"
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          Connected to backend
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          Demo mode (backend offline)
        </>
      )}
    </Badge>
  )
}