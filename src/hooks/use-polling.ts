import { useEffect, useRef } from 'react'
import { ApiService, BatchStatus } from '@/lib/api'

interface UsePollingOptions {
  batchId: string | null
  isActive: boolean
  interval?: number
  onStatusUpdate: (status: BatchStatus) => void
  onComplete: (status: BatchStatus) => void
  onError: (error: string) => void
}

/**
 * Hook personalizado para hacer polling del estado de un batch
 * Consulta el backend cada X segundos para obtener el progreso del procesamiento
 */
export function usePolling({
  batchId,
  isActive,
  interval = 3000, // 3 segundos por defecto
  onStatusUpdate,
  onComplete,
  onError,
}: UsePollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isPollingRef = useRef(false)

  useEffect(() => {
    // Solo iniciar polling si tenemos un batchId y está activo
    if (!batchId || !isActive || isPollingRef.current) {
      return
    }

    console.log(`Starting polling for batch: ${batchId}`)
    isPollingRef.current = true

    const pollStatus = async () => {
      try {
        const status = await ApiService.getBatchStatus(batchId)
        console.log('Polling status update:', status)
        
        // Siempre llamar onStatusUpdate para actualizar el progreso
        onStatusUpdate(status)

        // Verificar si el procesamiento ha terminado (nuevos estados del backend Node.js)
        if (status.status === 'completed') {
          console.log('Batch completed successfully')
          onComplete(status)
          stopPolling()
        } else if (status.status === 'completed_with_errors') {
          console.log('Batch completed with some errors')
          onComplete(status) // Aún mostrar resultados parciales
          stopPolling()
        }
      } catch (error) {
        console.error('Polling error:', error)
        onError('Failed to check processing status')
        stopPolling()
      }
    }

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      isPollingRef.current = false
    }

    // Hacer la primera consulta inmediatamente
    pollStatus()

    // Configurar el intervalo para consultas posteriores
    intervalRef.current = setInterval(pollStatus, interval)

    // Función de limpieza
    return () => {
      console.log('Cleaning up polling')
      stopPolling()
    }
  }, [batchId, isActive, interval, onStatusUpdate, onComplete, onError])

  // Función para detener manualmente el polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isPollingRef.current = false
  }

  return { stopPolling }
}