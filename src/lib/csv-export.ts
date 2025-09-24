import { ScrapingResult } from '@/lib/api'

// Función para formatear horarios en formato HH:MM - HH:MM
export function formatHours(hours: string | null): string {
  if (!hours) return ''
  
  // Si ya está en el formato correcto, devolverlo
  if (hours.match(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/)) {
    return hours
  }
  
  // Si contiene múltiples rangos (ej: "09:00-12:00,14:00-18:00")
  if (hours.includes(',')) {
    return hours.split(',')
      .map(range => range.trim())
      .map(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(t => t.trim())
          return `${formatTime(start)} - ${formatTime(end)}`
        }
        return range
      })
      .join(' & ')
  }
  
  // Si contiene un solo rango
  if (hours.includes('-')) {
    const [start, end] = hours.split('-').map(t => t.trim())
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
  if (results.length === 0) return ''
  
  // Encabezados CSV
  const headers = [
    'Name',
    'Rating',
    'Reviews Count',
    'Phone',
    'Address', 
    'Website',
    'Category',
    'Monday Hours',
    'Tuesday Hours',
    'Wednesday Hours',
    'Thursday Hours',
    'Friday Hours',
    'Saturday Hours',
    'Sunday Hours',
    'Status',
    'Error'
  ]
  
  // Convertir datos
  const csvRows = [
    headers.join(','), // Encabezados
    ...results.map(result => [
      escapeCSV(result.name || ''),
      result.rating?.toString() || '',
      result.reviews_count?.toString() || '',
      escapeCSV(result.phone || ''),
      escapeCSV(result.address || ''),
      escapeCSV(result.website || ''),
      escapeCSV(result.category || ''),
      escapeCSV(formatHours(result.monday_hours)),
      escapeCSV(formatHours(result.tuesday_hours)),
      escapeCSV(formatHours(result.wednesday_hours)),
      escapeCSV(formatHours(result.thursday_hours)),
      escapeCSV(formatHours(result.friday_hours)),
      escapeCSV(formatHours(result.saturday_hours)),
      escapeCSV(formatHours(result.sunday_hours)),
      result.error ? 'Failed' : 'Success',
      escapeCSV(result.error || '')
    ].join(','))
  ]
  
  return csvRows.join('\n')
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
export function downloadCSV(results: ScrapingResult[], filename = 'scraping-results.csv') {
  const csvContent = convertToCSV(results)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}