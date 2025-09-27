"use client"

import React, { useState, useCallback } from "react"
import { ApiService, ScrapingResult as ApiScrapingResult, BatchStatus, getProgress } from "@/lib/api"
import { FileUploaderCard } from "@/components/file-uploader-card"
import { ProcessingStatusCard } from "@/components/processing-status-card"
import { CompletionCard } from "@/components/completion-card"
import { ErrorCard } from "@/components/error-card"
import { ResultsModal } from "@/components/results-modal"
import { ConnectionStatus } from "@/components/connection-status"
import { BackendStatusCard } from "@/components/backend-status-card"
import { LanguageSelector } from "@/components/language-selector"
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
  const [results, setResults] = useState<ApiScrapingResult[]>([])
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
      console.log('🚀 Starting upload process for:', file.name)
      
      // Intentar upload directamente - si falla, el error nos dirá por qué
      const response = await ApiService.uploadFile(file)
      
      console.log('Upload successful, batch ID:', response.batchId)
      setBatchId(response.batchId)
      setStatus('processing')
      
    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || t('error.upload'))
      setStatus('error')
    }
  }, [file, t])

  // Esta función ya no es necesaria - usamos solo datos reales del backend

  // ===============================
  // CALLBACKS PARA POLLING
  // ===============================
  const handleStatusUpdate = useCallback((batchStatus: BatchStatus) => {
    console.log('Status update received:', batchStatus)
    // Obtener el progreso del backend (nueva estructura)
    const progressData = getProgress(batchStatus)
    setProgress({ completed: progressData.completed, total: progressData.total })
    
    // Actualizar estado si está procesando
    if (batchStatus.status === 'processing' || batchStatus.status === 'queued') {
      setStatus('processing')
    }
    
    // Si hay resultados parciales, mostrarlos
    if (batchStatus.results && batchStatus.results.length > 0) {
      setResults(batchStatus.results)
    }
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
            results={results}
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
      {/* Language selector in top-right corner */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
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
        <div className="flex justify-center gap-4">
          <ConnectionStatus />
          <BackendStatusCard />
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