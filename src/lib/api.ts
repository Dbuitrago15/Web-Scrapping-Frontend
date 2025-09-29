import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { silentLog, silentError } from './debug'

// Base URL del backend - usar proxy de Next.js en desarrollo para evitar CORS
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1')
  : '/api/v1' // Usar proxy de Next.js en desarrollo

console.log('🔧 API Configuration:')
console.log('📍 Base URL:', API_BASE_URL)
console.log('🌍 Environment:', process.env.NODE_ENV)
console.log('📝 Next Public API URL:', process.env.NEXT_PUBLIC_API_URL)

// Configurar instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 segundos para uploads grandes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Para evitar problemas de CORS
})

// Interceptor para debug de requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔍 Request Debug:')
    console.log('📍 URL:', config.url)
    console.log('🌐 Base URL:', config.baseURL)
    console.log('🎯 Full URL:', `${config.baseURL}${config.url}`)
    console.log('📝 Method:', config.method?.toUpperCase())
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para debug de responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response Success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ Response Error:')
    console.error('📍 URL:', error.config?.url)
    console.error('🌐 Base URL:', error.config?.baseURL)
    console.error('🎯 Full URL:', `${error.config?.baseURL}${error.config?.url}`)
    console.error('📊 Status:', error.response?.status)
    console.error('📄 Response:', error.response?.data)
    return Promise.reject(error)
  }
)

// Interfaces para las respuestas del backend
export interface BatchUploadResponse {
  batchId: string
  jobsCreated: number
  message: string
}

export interface BatchStatus {
  batchId: string
  status: 'queued' | 'processing' | 'completed' | 'completed_with_errors'
  progress: {
    total: number
    completed: number
    failed: number
    processing: number
    waiting: number
    percentage: number
  }
  timing: {
    createdAt: string
    lastProcessedAt: string
    estimatedTimeRemaining: string | null
  }
  results: ScrapingResult[]
  summary: {
    totalBusinesses: number
    successfulScrapes: number
    partialScrapes: number
    failedScrapes: number
  }
}

// Interface for successful scraping results (Updated for Node.js backend)
export interface ScrapingResult {
  jobId: string
  
  // INPUT DATA - Original data from CSV file
  originalData: {
    name: string
    address?: string
    city?: string
    postal_code?: string
  }
  
  // SCRAPED DATA - Real data found on Google Maps (Updated with new fields)
  scrapedData: {
    fullName?: string
    fullAddress?: string
    phone?: string | null
    rating?: string | null                    // ⭐ NEW: Rating/Calificación
    reviewsCount?: string | null              // 📊 NEW: Número de reseñas
    website?: string | null                   // 🌐 NEW: Sitio web oficial
    category?: string | null                  // 🏷️ NEW: Categoría/tipo de negocio
    socialMedia?: {
      facebook?: string | null
      instagram?: string | null
      twitter?: string | null
      linkedin?: string | null
      youtube?: string | null
    }
    openingHours?: {
      [day: string]: string
    }
    status: 'success' | 'partial' | 'failed'
    scrapedAt: string
    error?: string | null
  } | null
  
  // PROCESSING INFO
  processingTime: number
  processedAt: string
  worker?: number
  error?: string
}

export interface BusinessHours {
  monday: string | null
  tuesday: string | null
  wednesday: string | null
  thursday: string | null
  friday: string | null
  saturday: string | null
  sunday: string | null
}

// Utilidad para obtener el progreso del backend (simplificada para Node.js backend)
export function getProgress(batchStatus: BatchStatus): { completed: number; total: number; percentage: number } {
  // El nuevo backend ya proporciona toda la información de progreso estructurada
  return {
    completed: batchStatus.progress.completed,
    total: batchStatus.progress.total,
    percentage: batchStatus.progress.percentage
  }
}

// Servicios API
export class ApiService {
  /**
   * Sube un archivo CSV al backend para procesamiento
   * @param file - Archivo CSV a procesar
   * @returns Respuesta con el batchId
   */
  static async uploadFile(file: File): Promise<BatchUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      console.log('🚀 Starting file upload:')
      console.log('📄 File:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('🌐 Full URL will be:', `${API_BASE_URL}/scraping-batch`)
      console.log('🔗 Axios baseURL:', apiClient.defaults.baseURL)
      
      const response: AxiosResponse<BatchUploadResponse> = await apiClient.post('/scraping-batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutos para uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log('Upload progress:', percentCompleted + '%')
          }
        }
      })
      
      console.log('Upload successful:', response.data)
      return response.data
    } catch (error: any) {
      silentError('Upload error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      // Manejo específico de errores
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('❌ Backend server is not running on port 3000. Please start your backend server with: docker-compose up --build -d')
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('⏱️ Upload timeout - file too large or connection slow')
      } else if (error.response?.status === 413) {
        throw new Error('📦 File too large')
      } else if (error.response?.status === 415) {
        throw new Error('📄 Invalid file type - only CSV files are allowed')
      } else if (error.response?.status === 404) {
        throw new Error('🔍 Backend endpoint not found. Make sure backend is running and accessible.')
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
        throw new Error('🌐 CORS Error: Backend needs CORS configuration. The backend is running but blocking browser requests.')
      } else if (error.name === 'AxiosError' && !error.response) {
        throw new Error('🔒 Connection blocked - possible CORS issue. Backend is running but not accessible from browser.')
      } else {
        throw new Error(error.response?.data?.message || `🚫 Upload failed: ${error.message}`)
      }
    }
  }

  /**
   * Obtiene el estado actual de un batch de procesamiento
   * @param batchId - ID del batch a consultar
   * @returns Estado actual del batch
   */
  static async getBatchStatus(batchId: string): Promise<BatchStatus> {
    try {
      const response: AxiosResponse<BatchStatus> = await apiClient.get(`/scraping-batch/${batchId}`)
      return response.data
    } catch (error: any) {
      silentError('Error fetching batch status:', error)
      
      if (error.response?.status === 404) {
        throw new Error('❓ Batch not found. It may have expired or been processed.')
      } else {
        throw new Error(`Failed to fetch batch status: ${error.response?.data?.message || error.message}`)
      }
    }
  }

  /**
   * 🆕 Exporta y descarga CSV limpio desde el backend
   * @param batchId - ID del batch a exportar
   * @returns void - Inicia descarga automática del archivo
   */
  static async exportCleanCSV(batchId: string): Promise<void> {
    try {
      console.log('🎯 Starting CSV export for batch:', batchId)
      
      const response = await apiClient.get(`/scraping-batch/${batchId}/export`, {
        responseType: 'blob', // Importante para archivos binarios
        headers: {
          'Accept': 'text/csv',
        },
        timeout: 60000, // 60 segundos para exportación
      })

      // Crear un blob y generar descarga automática
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      
      // Crear elemento de descarga temporal
      const link = document.createElement('a')
      link.href = url
      
      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      link.download = `scraping-results-${timestamp}.csv`
      
      // Agregar al DOM temporalmente y hacer click
      document.body.appendChild(link)
      link.click()
      
      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('✅ CSV exported successfully')
    } catch (error: any) {
      silentError('CSV export error:', error)
      
      if (error.response?.status === 404) {
        throw new Error('❓ Batch not found or expired')
      } else if (error.response?.status === 400) {
        throw new Error('🚫 Batch not ready for export yet')
      } else {
        throw new Error(`🚫 Export failed: ${error.response?.data?.message || error.message}`)
      }
    }
  }

  /**
   * Verifica si el backend está disponible
   * @returns true si el backend responde
   */
  static async healthCheck(): Promise<boolean> {
    try {
      // Usar proxy de Next.js en desarrollo, directo en producción
      const healthUrl = process.env.NODE_ENV === 'production' 
        ? 'http://localhost:3000/health'
        : '/health'
      
      const healthClient = axios.create({
        timeout: 5000,
      })
      
      // Usar endpoint /health según documentación del nuevo backend
      const response = await healthClient.get(healthUrl)
      console.log('✅ Backend health check successful:', response.status, response.data)
      return response.data?.status === 'ok'
    } catch (error: any) {
      console.log('🔴 Backend health check failed')
      console.log('Error details:', error.message)
      return false
    }
  }
}