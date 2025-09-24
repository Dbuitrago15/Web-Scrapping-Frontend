import React, { useState, useEffect } from 'react'
import { ApiService } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(false)
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

    // Solo hacer el check inicial
    checkConnection()
    
    // Verificar conexión cada 60 segundos (menos frecuente)
    const interval = setInterval(checkConnection, 60000)
    
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
          <Wifi className="h-3 w-3 mr-1 text-green-600" />
          Backend Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1 text-orange-600" />
          Demo Mode
        </>
      )}
    </Badge>
  )
}