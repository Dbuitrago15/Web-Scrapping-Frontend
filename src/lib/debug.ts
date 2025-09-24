// Utilidad para manejar errores sin mostrar en overlays de desarrollo
export function silentLog(message: string, ...args: any[]) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Solo log en consola, no throw errors
    console.log(`[DEBUG] ${message}`, ...args)
  }
}

export function silentError(message: string, error?: any) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Solo log en consola, no throw errors
    console.warn(`[ERROR] ${message}`, error)
  }
}