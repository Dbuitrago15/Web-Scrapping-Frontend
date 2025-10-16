import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { silentLog, silentError } from './debug'
import { TranslationKey } from '@/hooks/use-translation'

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
    latitude?: string | null                  // 📍 NEW: GPS Latitude coordinate
    longitude?: string | null                 // 📍 NEW: GPS Longitude coordinate
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

// 🆕 Interfaces para validaciones y estado de servicios
export interface RedisHealthDetails {
  status: string
  service: string
  timestamp: string
  responseTime: string
  connection: {
    status: string
    queue_accessible: boolean
  }
  operations: {
    queue_stats: string
    job_creation: string
    job_removal: string
  }
  queue_stats: {
    waiting: number
    active: number
    completed: number
    failed: number
    paused: number
  }
  waiting_jobs: number
}

export interface WorkerHealthDetails {
  status: string
  service: string
  timestamp: string
  responseTime: string
  reason: string
  queue_statistics: {
    waiting: number
    active: number
    completed: number
    failed: number
    delayed: number
  }
  active_jobs: {
    count: number
    jobs: any[]
  }
  recent_activity: {
    completed_last_5min: number
    last_completed: {
      id: string
      completedAt: string
      processingTime: number
    } | null
    last_failed: any | null
  }
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  service: string
  responseTime?: string
  reason?: string
  details?: RedisHealthDetails | WorkerHealthDetails | any
}

export interface ServiceStatus {
  api: ServiceHealth
  redis: ServiceHealth
  worker: ServiceHealth
  lastCheck: string
  error?: string
}

export interface CSVValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  columns: string[]
  requiredColumns: string[]
  missingColumns: string[]
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
      console.log('🌐 Using proxy endpoint: /api/v1/scraping-batch')
      
      const response = await fetch('/api/v1/scraping-batch', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data: BatchUploadResponse = await response.json()
      console.log('Upload successful:', data)
      return data
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
      } else if (error.message?.includes('HTTP 404')) {
        throw new Error('🔍 Backend endpoint not found. Make sure backend is running and accessible.')
      } else if (error.message?.includes('CORS')) {
        throw new Error('🌐 CORS Error: Backend needs CORS configuration. The backend is running but blocking browser requests.')
      } else if (error.message?.includes('Failed to fetch')) {
        throw new Error('🔒 Connection blocked - possible CORS issue. Backend is running but not accessible from browser.')
      } else {
        throw new Error(`🚫 Upload failed: ${error.message}`)
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
      const response = await fetch(`/api/v1/scraping-batch/${batchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('❓ Batch not found. It may have expired or been processed.')
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch batch status`)
      }
      
      const data: BatchStatus = await response.json()
      return data
    } catch (error: any) {
      silentError('Error fetching batch status:', error)
      throw new Error(`Failed to fetch batch status: ${error.message}`)
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
   * 🆕 Valida el formato y contenido del archivo CSV
   * @param file - Archivo CSV a validar
   * @param t - Función de traducción (opcional)
   * @returns Resultado de la validación
   */
  static async validateCSV(file: File, t?: (key: TranslationKey, params?: Record<string, string | number>) => string): Promise<CSVValidationResult> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          resolve({
            isValid: false,
            errors: [t ? t('csv.file_empty') : 'File is empty'],
            warnings: [],
            rowCount: 0,
            columns: [],
            requiredColumns: ['name', 'address', 'city'],
            missingColumns: ['name', 'address', 'city']
          })
          return
        }
        
        // Parse header
        const header = lines[0].split(',').map(col => col.trim().replace(/["']/g, ''))
        const requiredColumns = ['name', 'address', 'city']
        const optionalColumns = ['postal_code']
        const allValidColumns = [...requiredColumns, ...optionalColumns]
        
        // Validaciones
        const errors: string[] = []
        const warnings: string[] = []
        const missingColumns = requiredColumns.filter(col => 
          !header.some(h => h.toLowerCase().includes(col.toLowerCase()))
        )
        
        // Validar columnas requeridas
        if (missingColumns.length > 0) {
          errors.push(t ? t('csv.required_columns_missing', { columns: missingColumns.join(', ') }) : `Missing required columns: ${missingColumns.join(', ')}`)
        }
        
        // Validar número mínimo de filas
        if (lines.length < 2) {
          errors.push(t ? t('csv.minimum_rows_required') : 'CSV must have at least one data row besides the header')
        }
        
        // Validar número máximo de filas (límite recomendado)
        if (lines.length > 1001) { // 1000 + header
          warnings.push(t ? t('csv.maximum_rows_warning', { count: lines.length - 1 }) : `File has ${lines.length - 1} rows. Maximum 1000 recommended for better performance`)
        }
        
        // Validar formato de datos (muestra de las primeras 5 filas)
        const sampleRows = lines.slice(1, 6)
        sampleRows.forEach((row, index) => {
          const cells = row.split(',')
          if (cells.length !== header.length) {
            errors.push(t ? t('csv.column_mismatch', { row: index + 2, actual: cells.length, expected: header.length }) : `Row ${index + 2}: Number of columns does not match header (${cells.length} vs ${header.length})`)
          }
          
          // Validar que el nombre no esté vacío
          const nameIndex = header.findIndex(h => h.toLowerCase().includes('name'))
          if (nameIndex >= 0 && (!cells[nameIndex] || cells[nameIndex].trim().replace(/["']/g, '') === '')) {
            errors.push(t ? t('csv.empty_business_name', { row: index + 2 }) : `Row ${index + 2}: Business name cannot be empty`)
          }
        })
        
        resolve({
          isValid: errors.length === 0,
          errors,
          warnings,
          rowCount: lines.length - 1,
          columns: header,
          requiredColumns,
          missingColumns
        })
      }
      
      reader.onerror = () => {
        resolve({
          isValid: false,
          errors: [t ? t('csv.file_read_error') : 'Error reading file'],
          warnings: [],
          rowCount: 0,
          columns: [],
          requiredColumns: ['name', 'address', 'city'],
          missingColumns: ['name', 'address', 'city']
        })
      }
      
      reader.readAsText(file)
    })
  }

  /**
   * 🆕 Genera y descarga una plantilla CSV de ejemplo
   * @returns void - Inicia descarga del archivo plantilla
   */
  static downloadCSVTemplate(): void {
    const template = [
      'name,address,city,postal_code',
      'McDonald\'s Bahnhofstrasse,"Bahnhofstrasse 120",Zürich,8001',
      'Starbucks Paradeplatz,"Paradeplatz 4",Zürich,8001',
      'Burger King Limmatquai,"Limmatquai 66",Zürich,8001'
    ].join('\n')
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'plantilla-scraping.csv'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('✅ Plantilla CSV descargada')
  }

  /**
   * 🆕 Verifica el estado real de todos los servicios del backend
   * @returns Estado detallado de cada servicio
   */
  static async checkServicesStatus(): Promise<ServiceStatus> {
    const result: ServiceStatus = {
      api: {
        status: 'unhealthy',
        service: 'api'
      },
      redis: {
        status: 'unhealthy',
        service: 'redis'
      },
      worker: {
        status: 'unhealthy',
        service: 'worker'
      },
      lastCheck: new Date().toISOString(),
      error: undefined
    }
    
    try {
      // 1. Verificar API general (puerto 3000)  
      const startTime = Date.now()
      const apiResponse = await fetch('/api/v1/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        result.api = {
          status: 'healthy',
          service: 'api',
          responseTime: `${Date.now() - startTime}ms`,
          details: apiData
        }
        
        // 2. Verificar Redis a través de endpoint específico
        try {
          const redisResponse = await fetch('/api/v1/health/redis', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          if (redisResponse.ok) {
            const redisData: RedisHealthDetails = await redisResponse.json()
            result.redis = {
              status: redisData.status as 'healthy' | 'degraded' | 'unhealthy',
              service: 'redis',
              responseTime: redisData.responseTime,
              details: redisData
            }
          } else {
            result.redis = {
              status: 'unhealthy',
              service: 'redis',
              reason: `HTTP ${redisResponse.status}`
            }
          }
        } catch (error) {
          result.redis = {
            status: 'unhealthy',
            service: 'redis',
            reason: 'Connection failed'
          }
        }
        
        // 3. Verificar Worker a través de endpoint específico
        try {
          const workerResponse = await fetch('/api/v1/health/worker', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          if (workerResponse.ok) {
            const workerData: WorkerHealthDetails = await workerResponse.json()
            result.worker = {
              status: workerData.status as 'healthy' | 'degraded' | 'unhealthy',
              service: 'worker',
              responseTime: workerData.responseTime,
              reason: workerData.reason,
              details: workerData
            }
          } else {
            result.worker = {
              status: 'unhealthy',
              service: 'worker',
              reason: `HTTP ${workerResponse.status}`
            }
          }
        } catch (error) {
          result.worker = {
            status: 'unhealthy',
            service: 'worker',
            reason: 'Connection failed'
          }
        }
      } else {
        result.api = {
          status: 'unhealthy',
          service: 'api',
          reason: `HTTP ${apiResponse.status}`,
          responseTime: `${Date.now() - startTime}ms`
        }
      }
      
    } catch (error: any) {
      result.error = error.message
      result.api = {
        status: 'unhealthy',
        service: 'api',
        reason: error.message
      }
      console.error('Error checking services:', error)
    }
    
    return result
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