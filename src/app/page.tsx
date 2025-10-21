"use client"

import React, { useState, useCallback, useEffect } from "react"
import { ApiService, ScrapingResult as ApiScrapingResult, BatchStatus } from "@/lib/api"
import { FileUploaderCard } from "@/components/file-uploader-card"
import { RealtimeProcessingCard } from "@/components/realtime-processing-card"
import { CompletionCard } from "@/components/completion-card"
import { ErrorCard } from "@/components/error-card"
import { ResultsModal } from "@/components/results-modal"
import { ConnectionStatus } from "@/components/connection-status"
import { BackendStatusCard } from "@/components/backend-status-card"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/hooks/use-translation"

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
  const [isRestoringSession, setIsRestoringSession] = useState(true)
  
  const { t } = useTranslation()

  // ===============================
  // RESTORE SESSION ON MOUNT
  // ===============================
  useEffect(() => {
    const savedBatchId = localStorage.getItem('currentBatchId')
    const savedStatus = localStorage.getItem('currentStatus') as AppStatus
    
    if (savedBatchId && savedStatus === 'processing') {
      console.log('🔄 Restoring session for batch:', savedBatchId)
      setBatchId(savedBatchId)
      setStatus('processing')
      
      // Fetch current batch status immediately
      ApiService.getBatchStatus(savedBatchId)
        .then(batchStatus => {
          console.log('📊 Restored batch status:', batchStatus)
          if (batchStatus.progress) {
            setProgress({
              completed: batchStatus.progress.completed,
              total: batchStatus.progress.total
            })
          }
        })
        .catch(err => {
          console.error('❌ Failed to restore batch status:', err)
        })
    }
    
    setIsRestoringSession(false)
  }, [])

  // ===============================
  // SAVE SESSION TO LOCALSTORAGE
  // ===============================
  useEffect(() => {
    if (batchId) {
      localStorage.setItem('currentBatchId', batchId)
    } else {
      localStorage.removeItem('currentBatchId')
    }
    
    if (status !== 'idle') {
      localStorage.setItem('currentStatus', status)
    } else {
      localStorage.removeItem('currentStatus')
    }
  }, [batchId, status])

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
      
      console.log('Upload successful, batch ID:', response.batchId, 'Jobs created:', response.jobsCreated)
      setBatchId(response.batchId)
      
      // Set initial progress with total from upload response
      setProgress({ 
        completed: 0, 
        total: response.jobsCreated || 0 
      })
      
      setStatus('processing')
      
    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || t('error.upload'))
      setStatus('error')
    }
  }, [file, t])

  // Esta función ya no es necesaria - usamos solo datos reales del backend

  // ===============================
  // CALLBACKS PARA SSE STREAMING
  // ===============================
  const handleProgressUpdate = useCallback((completed: number, total: number) => {
    console.log('📊 Progress update:', completed, '/', total)
    setProgress({ completed, total })
  }, [])

  const handleProcessingComplete = useCallback(async (completeData?: { completed: number; total: number }) => {
    console.log('✅ Processing completed, fetching final results...', completeData)
    
    // Update progress if provided
    if (completeData) {
      setProgress({ 
        completed: completeData.completed, 
        total: completeData.total 
      })
    }
    
    // Fetch final results from backend
    if (batchId) {
      try {
        const batchStatus = await ApiService.getBatchStatus(batchId)
        if (batchStatus.results) {
          setResults(batchStatus.results)
          setStatus('complete')
          
          // Update progress with actual batch data if not already set
          if (!completeData && batchStatus.progress) {
            setProgress({
              completed: batchStatus.progress.completed,
              total: batchStatus.progress.total
            })
          }
        } else {
          setError(t('error.processing'))
          setStatus('error')
        }
      } catch (error: any) {
        console.error('Failed to fetch final results:', error)
        setError(error.message || t('error.processing'))
        setStatus('error')
      }
    } else {
      setStatus('complete')
    }
  }, [batchId, t])

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
    console.log('🔄 Retrying - clearing session')
    localStorage.removeItem('currentBatchId')
    localStorage.removeItem('currentStatus')
    setStatus('idle')
    setError('')
    setBatchId(null)
    setProgress({ completed: 0, total: 0 })
    setResults([])
  }, [])

  // ===============================
  // 🆕 NUEVA BÚSQUEDA (UPLOAD ANOTHER CSV)
  // ===============================
  const handleNewSearch = useCallback(() => {
    console.log('🔄 Starting new search - clearing session')
    localStorage.removeItem('currentBatchId')
    localStorage.removeItem('currentStatus')
    
    // Force page reload to clear all state
    window.location.reload()
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
          <RealtimeProcessingCard 
            batchId={batchId}
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onComplete={handleProcessingComplete}
            onNewSearch={handleNewSearch}
          />
        )
      
      case 'complete':
        return (
          <CompletionCard
            results={results}
            batchId={batchId || undefined}
            onViewResults={handleViewResults}
            onNewSearch={handleNewSearch}
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