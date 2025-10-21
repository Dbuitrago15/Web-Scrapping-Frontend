/**
 * Application configuration
 * Centralized configuration for backend URLs and other settings
 */

export const config = {
  // Backend API URL
  // In development: Use Next.js proxy for better compatibility
  // In production: Use environment variable or relative path
  backend: {
    url: process.env.NEXT_PUBLIC_BACKEND_URL || '',
    apiPath: '/api/v1'
  },
  
  // SSE Configuration
  sse: {
    // Whether to use SSE or fallback to polling immediately
    enabled: true,
    // Polling fallback interval in milliseconds
    pollingInterval: 2000,
  },
  
  // Get full backend URL
  getBackendUrl(): string {
    return `${this.backend.url}${this.backend.apiPath}`
  }
} as const

export default config
