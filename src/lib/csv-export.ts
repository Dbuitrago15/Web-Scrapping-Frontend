import { ScrapingResult } from '@/lib/api'

// ⚠️ DEPRECATED: Este archivo se mantiene para compatibilidad
// El backend ahora genera CSV limpio directamente con el endpoint /export
// Ver ApiService.exportCleanCSV() en api.ts para la nueva funcionalidad

// Función para extraer horarios de un día específico del objeto opening_hours
export function extractDayHours(openingHours: { [day: string]: string } | null | undefined, dayName: string): string {
  if (!openingHours || typeof openingHours !== 'object') return ''
  
  // Buscar el día exacto o variaciones comunes
  const dayVariations = {
    'Monday': ['Monday', 'monday', 'Mon', 'mon'],
    'Tuesday': ['Tuesday', 'tuesday', 'Tue', 'tue'], 
    'Wednesday': ['Wednesday', 'wednesday', 'Wed', 'wed'],
    'Thursday': ['Thursday', 'thursday', 'Thu', 'thu'],
    'Friday': ['Friday', 'friday', 'Fri', 'fri'],
    'Saturday': ['Saturday', 'saturday', 'Sat', 'sat'],
    'Sunday': ['Sunday', 'sunday', 'Sun', 'sun']
  }
  
  const variations = dayVariations[dayName as keyof typeof dayVariations] || [dayName]
  
  for (const variation of variations) {
    if (openingHours[variation]) {
      return openingHours[variation]
    }
  }
  
  return ''
}

// Función para formatear horarios en formato HH:MM - HH:MM
export function formatHours(hours: string | null): string {
  if (!hours) return ''
  
  // Si ya está en el formato correcto, devolverlo
  if (hours.match(/^\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}$/)) {
    return hours
  }
  
  // Si contiene múltiples rangos (ej: "09:00-12:00,14:00-18:00")
  if (hours.includes(',')) {
    return hours.split(',')
      .map(range => range.trim())
      .map(range => {
        if (range.includes('-') || range.includes('–')) {
          const separator = range.includes('–') ? '–' : '-'
          const [start, end] = range.split(separator).map(t => t.trim())
          return `${formatTime(start)} - ${formatTime(end)}`
        }
        return range
      })
      .join(' & ')
  }
  
  // Si contiene un solo rango
  if (hours.includes('-') || hours.includes('–')) {
    const separator = hours.includes('–') ? '–' : '-'
    const [start, end] = hours.split(separator).map(t => t.trim())
    return `${formatTime(start)} - ${formatTime(end)}`
  }
  
  // Si es texto descriptivo (ej: "Closed", "Open 24 hours")
  return hours
}

// Función auxiliar para formatear tiempo individual
function formatTime(time: string): string {
  if (!time) return ''
  
  // Si ya está en formato HH:MM, devolverlo
  if (time.match(/^\d{2}:\d{2}$/)) {
    return time
  }
  
  // Si está en formato H:MM, agregar cero inicial
  if (time.match(/^\d:\d{2}$/)) {
    return `0${time}`
  }
  
  // Intentar convertir formatos de 12 horas a 24 horas
  if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
    try {
      const [timePart, period] = time.toLowerCase().split(/\s*(am|pm)/)
      const [hours, minutes] = timePart.split(':').map(n => parseInt(n))
      
      let hour24 = hours
      if (period === 'pm' && hours !== 12) {
        hour24 += 12
      } else if (period === 'am' && hours === 12) {
        hour24 = 0
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    } catch {
      return time
    }
  }
  
  return time
}

// Función para convertir resultados a CSV
export function convertToCSV(results: ScrapingResult[]): string {
  console.log('🔍 Converting to CSV, results count:', results.length)
  console.log('📊 Sample result:', results[0])
  
  if (results.length === 0) {
    console.warn('⚠️ No results to convert to CSV')
    return ''
  }
  
  // CSV Headers - Simplified to essential fields only
  const headers = [
    'Input Name',
    'Found Name',
    'Address',
    'Phone',
    'Website',
    'Category',
    'Latitude',
    'Longitude',
    'Monday Hours',
    'Tuesday Hours',
    'Wednesday Hours',
    'Thursday Hours',
    'Friday Hours',
    'Saturday Hours',
    'Sunday Hours'
  ]  // Convert data - Simplified to essential fields only
  const csvRows = [
    headers.join(','), // Headers
    ...results.map(result => [
      // Essential fields only
      escapeCSV(result.originalData.name || ''),                               // Input Name
      escapeCSV(result.scrapedData?.fullName || ''),                           // Found Name
      escapeCSV(result.scrapedData?.fullAddress || ''),                        // Address
      escapeCSV(result.scrapedData?.phone || ''),                              // Phone
      escapeCSV(result.scrapedData?.website || ''),                            // Website
      escapeCSV(result.scrapedData?.category || ''),                           // Category
      escapeCSV(result.scrapedData?.latitude || ''),                           // Latitude
      escapeCSV(result.scrapedData?.longitude || ''),                          // Longitude
      
      // Operating Hours
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Monday'))),    // Monday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Tuesday'))),   // Tuesday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Wednesday'))), // Wednesday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Thursday'))),  // Thursday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Friday'))),    // Friday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Saturday'))),  // Saturday
      escapeCSV(formatHours(extractDayHours(result.scrapedData?.openingHours, 'Sunday')))     // Sunday
    ].join(','))
  ]
  
  const csvContent = csvRows.join('\n')
  console.log('📄 Generated CSV preview:', csvContent.substring(0, 500) + '...')
  console.log('📊 CSV rows count:', csvRows.length)
  
  return csvContent
}

// Función para escapar valores CSV (manejar comas, comillas, etc.)
function escapeCSV(value: string): string {
  if (!value) return ''
  
  // Si contiene comas, comillas o saltos de línea, envolver en comillas
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    // Escapar comillas duplicándolas
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }
  
  return value
}

// Función para descargar CSV
export function downloadCSV(results: ScrapingResult[], filename?: string) {
  if (!filename) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    filename = `scraping-results-${timestamp}.csv`
  }
  
  const csvContent = convertToCSV(results)
  
  if (!csvContent) {
    console.error('No data to export')
    return
  }
  
  // Add UTF-8 BOM for proper character encoding in Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Limpiar memoria
  }
}