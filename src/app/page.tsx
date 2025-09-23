"use client"

import React, { useState, useCallback } from "react"
import { ApiService, ScrapingResult, BatchStatus } from "@/lib/api"
import { FileUploaderCard } from "@/components/file-uploader-card"
import { ProcessingStatusCard } from "@/components/processing-status-card"
import { CompletionCard } from "@/components/completion-card"
import { ErrorCard } from "@/components/error-card"
import { ResultsModal } from "@/components/results-modal"
import { ConnectionStatus } from "@/components/connection-status"
import { useTranslation } from "@/hooks/use-translation"
import { usePolling } from "@/hooks/use-polling"

// Estados posibles de la aplicación
type AppStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error'

// Interfaz para el progreso
interface Progress {
  completed: number
  total: number
}

export default function HomePage() {
  // ===============================
  // ESTADO CENTRALIZADO
  // ===============================
  const [status, setStatus] = useState<AppStatus>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress>({ completed: 0, total: 0 })
  const [results, setResults] = useState<ScrapingResult[]>([])
  const [error, setError] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  
  const { t } = useTranslation()

  // ===============================
  // MANEJO DE ARCHIVO
  // ===============================
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      // Limpiar estados anteriores al seleccionar nuevo archivo
      setError('')
      setResults([])
      setProgress({ completed: 0, total: 0 })
    } else if (selectedFile) {
      setError(t('error.upload'))
    }
  }, [t])

  // ===============================
  // CARGA DE ARCHIVO (UPLOAD)
  // ===============================
  const handleProcessFile = useCallback(async () => {
    if (!file) return

    setStatus('uploading')
    setError('')

    try {
      console.log('Uploading file:', file.name)
      
      // Verificar si el backend está disponible primero
      const isBackendAvailable = await ApiService.healthCheck()
      
      if (!isBackendAvailable) {
        console.warn('Backend not available, using mock data mode')
        // Modo de desarrollo con datos mock
        setBatchId('mock-batch-id')
        setStatus('processing')
        
        // Simular progreso de procesamiento
        simulateMockProcessing()
        return
      }
      
      const response = await ApiService.uploadFile(file)
      
      console.log('Upload successful, batch ID:', response.batch_id)
      setBatchId(response.batch_id)
      setStatus('processing')
      
    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || t('error.upload'))
      setStatus('error')
    }
  }, [file, t])

  // Función para simular procesamiento cuando el backend no está disponible
  const simulateMockProcessing = async () => {
    const { generateMockResults, delay } = await import('@/lib/mock-data')
    
    // Simular progreso
    for (let i = 0; i <= 100; i += 10) {
      setProgress({ completed: i, total: 100 })
      await delay(300)
    }
    
    // Generar resultados mock
    const mockResults = generateMockResults(75)
    setResults(mockResults)
    setStatus('complete')
  }

  // ===============================
  // CALLBACKS PARA POLLING
  // ===============================
  const handleStatusUpdate = useCallback((batchStatus: BatchStatus) => {
    console.log('Status update received:', batchStatus)
    setProgress(batchStatus.progress)
  }, [])

  const handleProcessingComplete = useCallback((batchStatus: BatchStatus) => {
    console.log('Processing completed:', batchStatus)
    if (batchStatus.results) {
      setResults(batchStatus.results)
      setStatus('complete')
    } else {
      setError(t('error.processing'))
      setStatus('error')
    }
  }, [t])

  const handleProcessingError = useCallback((errorMessage: string) => {
    console.error('Processing error:', errorMessage)
    setError(errorMessage || t('error.processing'))
    setStatus('error')
  }, [t])

  // ===============================
  // HOOK DE POLLING
  // ===============================
  usePolling({
    batchId,
    isActive: status === 'processing',
    interval: 3000, // Polling cada 3 segundos
    onStatusUpdate: handleStatusUpdate,
    onComplete: handleProcessingComplete,
    onError: handleProcessingError,
  })

  // ===============================
  // MANEJO DE MODAL DE RESULTADOS
  // ===============================
  const handleViewResults = useCallback(() => {
    setShowResults(true)
  }, [])

  const handleCloseResults = useCallback(() => {
    setShowResults(false)
  }, [])

  // ===============================
  // REINTENTAR PROCESO
  // ===============================
  const handleRetry = useCallback(() => {
    setStatus('idle')
    setError('')
    setBatchId(null)
    setProgress({ completed: 0, total: 0 })
    setResults([])
  }, [])

  // ===============================
  // RENDERIZADO CONDICIONAL
  // ===============================
  const renderContent = () => {
    switch (status) {
      case 'idle':
      case 'uploading':
        return (
          <FileUploaderCard
            file={file}
            onFileChange={handleFileChange}
            onProcessFile={handleProcessFile}
            isDisabled={status === 'uploading'}
          />
        )
      
      case 'processing':
        return (
          <ProcessingStatusCard progress={progress} />
        )
      
      case 'complete':
        return (
          <CompletionCard
            resultCount={results.length}
            onViewResults={handleViewResults}
          />
        )
      
      case 'error':
        return (
          <ErrorCard
            errorMessage={error}
            onRetry={handleRetry}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center">
          <ConnectionStatus />
        </div>

        {/* Contenido principal basado en el estado */}
        {renderContent()}

        {/* Modal de resultados */}
        <ResultsModal 
          isOpen={showResults} 
          onClose={handleCloseResults} 
          data={results} 
        />
      </div>
    </div>
  )
}