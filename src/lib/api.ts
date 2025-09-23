import axios, { AxiosResponse } from 'axios'

// Base URL del backend - verificar que esté corriendo
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

console.log('API Base URL:', API_BASE_URL)

// Configurar instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 segundos para uploads grandes
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Para evitar problemas de CORS
})

// Interfaces para las respuestas del backend
export interface BatchUploadResponse {
  batch_id: string
  status: string
  message: string
}

export interface BatchStatus {
  batch_id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: {
    completed: number
    total: number
  }
  results?: ScrapingResult[]
  error_message?: string
  created_at: string
  updated_at: string
}

export interface ScrapingResult {
  id: string
  name: string
  city: string
  email: string
  phone: string
  website: string
  category: string
  rating: number
  reviews: number
  address: string
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
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)
      
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
      console.error('Upload error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      // Manejo específico de errores
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout - file too large or connection slow')
      } else if (error.response?.status === 413) {
        throw new Error('File too large')
      } else if (error.response?.status === 415) {
        throw new Error('Invalid file type - only CSV files are allowed')
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error - backend may be down')
      } else {
        throw new Error(error.response?.data?.message || 'Failed to upload file')
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
    } catch (error) {
      console.error('Error fetching batch status:', error)
      throw new Error('Failed to fetch batch status')
    }
  }

  /**
   * Verifica si el backend está disponible
   * @returns true si el backend responde
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get('/health')
      return true
    } catch (error) {
      console.error('Backend health check failed:', error)
      return false
    }
  }
}