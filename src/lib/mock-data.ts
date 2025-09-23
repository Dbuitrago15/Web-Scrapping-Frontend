import { ScrapingResult } from '@/lib/api'

// Función para generar datos mock cuando el backend no esté disponible
export function generateMockResults(count: number = 50): ScrapingResult[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `mock-${index + 1}`,
    name: `Business ${index + 1}`,
    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"][index % 10],
    email: `contact${index + 1}@business${index + 1}.com`,
    phone: `+1-555-${String(index + 1).padStart(4, "0")}`,
    website: `https://business${index + 1}.com`,
    category: ["Restaurant", "Retail", "Service", "Technology", "Healthcare", "Finance", "Education", "Real Estate", "Manufacturing", "Consulting"][index % 10],
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    reviews: Math.floor(Math.random() * 500) + 10,
    address: `${index + 100} ${["Main St", "Oak Ave", "Pine St", "Elm Dr", "Park Blvd"][index % 5]}, ${["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5]}, ${["NY", "CA", "IL", "TX", "AZ"][index % 5]} ${String(10000 + index).padStart(5, "0")}`,
  }))
}

// Simular delay de procesamiento
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}