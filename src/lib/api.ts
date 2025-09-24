import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { silentLog, silentError } from './debug'

// Base URL del backend - verificar que esté corriendo
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
  batch_id: string
  status: string
  message?: string
}

export interface BatchStatus {
  batch_id: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  progress: string // "1/2 tasks completed."
  results: ScrapingResult[] | null
}

// Interfaz para resultados exitosos de scraping
export interface ScrapingResult {
  // Core Business Information
  name: string | null
  address: string | null
  phone: string | null
  website: string | null
  rating: string | null
  reviews_count: string | null
  category: string | null

  // Daily Hours Breakdown (NEW - Main Feature)
  monday_hours: string | null
  tuesday_hours: string | null
  wednesday_hours: string | null
  thursday_hours: string | null
  friday_hours: string | null
  saturday_hours: string | null
  sunday_hours: string | null

  // Legacy Hours Object (for backward compatibility)
  hours: BusinessHours | null

  // Metadata
  search_query: string
  input_data: {
    name: string
    address: string
    city: string
    postal_code: string
  }
  
  // Error handling (for failed extractions)
  error?: string
  strategies_tried?: string[]
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

// Utilidad para parsear el progreso del backend
export function parseProgress(progressString: string): { completed: number; total: number } {
  // Parsear strings como "1/2 tasks completed." o "2/2 tasks completed."
  const match = progressString.match(/(\d+)\/(\d+)\s+tasks/)
  if (match) {
    return {
      completed: parseInt(match[1], 10),
      total: parseInt(match[2], 10)
    }
  }
  // Fallback si no se puede parsear
  return { completed: 0, total: 1 }
}

// Servicios API
export class ApiService {
  /**
   * Sube un archivo CSV al backend para procesamiento
   * @param file - Archivo CSV a procesar
   * @returns Respuesta con el batch_id
   */
  static async uploadFile(file: File): Promise<BatchUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      console.log('🚀 Starting file upload:')
      console.log('📄 File:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('🌐 Full URL will be:', `${API_BASE_URL}/batches`)
      console.log('🔗 Axios baseURL:', apiClient.defaults.baseURL)
      
      const response: AxiosResponse<BatchUploadResponse> = await apiClient.post('/batches', formData, {
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
        throw new Error('❌ Backend server is not running on port 8000. Please start your backend server with: docker-compose up --build -d')
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('⏱️ Upload timeout - file too large or connection slow')
      } else if (error.response?.status === 413) {
        throw new Error('📦 File too large')
      } else if (error.response?.status === 415) {
        throw new Error('📄 Invalid file type - only CSV files are allowed')
      } else if (error.response?.status === 404) {
        throw new Error('🔍 Backend endpoint not found. Make sure backend is running and accessible.')
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('🌐 Network error - backend may be down or unreachable')
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
      const response: AxiosResponse<BatchStatus> = await apiClient.get(`/batches/${batchId}`)
      return response.data
    } catch (error: any) {
      silentError('Error fetching batch status:', error)
      
      // Manejo específico para el error del worker
      if (error.response?.status === 404 && error.response?.data?.detail?.includes('Task group not found')) {
        throw new Error('🔄 Batch is being processed. The Celery worker may be starting up - please wait a moment.')
      } else if (error.response?.status === 404) {
        throw new Error('❓ Batch not found. It may have expired or been processed.')
      } else {
        throw new Error('Failed to fetch batch status')
      }
    }
  }

  /**
   * Verifica si el backend está disponible
   * @returns true si el backend responde
   */
  static async healthCheck(): Promise<boolean> {
    try {
      // Crear una instancia específica para health check al puerto base (sin /api/v1)
      const healthClient = axios.create({
        baseURL: 'http://localhost:8000',
        timeout: 5000,
      })
      
      // Intentar una petición OPTIONS al root del servidor
      const response = await healthClient.options('/')
      console.log('✅ Backend health check successful:', response.status)
      return true
    } catch (error: any) {
      // Si OPTIONS falla, intentar GET al root
      try {
        const healthClient = axios.create({
          baseURL: 'http://localhost:8000',
          timeout: 5000,
        })
        const response = await healthClient.get('/')
        console.log('✅ Backend health check successful (GET):', response.status)
        return true
      } catch (secondError) {
        console.log('🔴 Backend not available on port 8000')
        return false
      }
    }
  }
}