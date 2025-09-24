"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, Globe, MapPin, Clock, Search, AlertCircle } from "lucide-react"
import { ScrapingResult } from "@/lib/api"

interface BusinessCardDetailProps {
  business: ScrapingResult
}

export function BusinessCardDetail({ business }: BusinessCardDetailProps) {
  // Handle failed extraction
  if (business.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {business.input_data.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-red-600 text-sm">
            ❌ <strong>Error:</strong> {business.error}
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <Search className="h-4 w-4 inline mr-1" />
              <strong>Search Query:</strong> {business.search_query}
            </div>
            
            {business.strategies_tried && (
              <div>
                <strong>Strategies Tried:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {business.strategies_tried.map((strategy, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {strategy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-muted p-2 rounded text-xs">
              <strong>Original Data:</strong> {business.input_data.name}, {business.input_data.address}, {business.input_data.city}, {business.input_data.postal_code}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle successful extraction
  const formatHours = (hours: string | null) => {
    if (!hours) return "N/A"
    if (hours.toLowerCase().includes('cerrado') || hours.toLowerCase().includes('closed')) {
      return "🔴 Closed"
    }
    if (hours.includes('24')) return "🟢 24h"
    return hours
  }

  const weekDays = [
    { key: 'monday_hours', label: 'Monday' },
    { key: 'tuesday_hours', label: 'Tuesday' },
    { key: 'wednesday_hours', label: 'Wednesday' },
    { key: 'thursday_hours', label: 'Thursday' },
    { key: 'friday_hours', label: 'Friday' },
    { key: 'saturday_hours', label: 'Saturday' },
    { key: 'sunday_hours', label: 'Sunday' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{business.name || 'Unknown Business'}</span>
          {business.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              {business.reviews_count && (
                <span className="text-sm text-muted-foreground ml-1">
                  {business.reviews_count}
                </span>
              )}
            </div>
          )}
        </CardTitle>
        {business.category && (
          <Badge variant="secondary" className="w-fit">
            {business.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {business.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>{business.address}</span>
            </div>
          )}
          
          {business.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                {business.phone}
              </a>
            </div>
          )}
          
          {business.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {business.website}
              </a>
            </div>
          )}
        </div>

        {/* Weekly Hours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Weekly Hours</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            {weekDays.map(({ key, label }) => {
              const hours = business[key as keyof ScrapingResult] as string | null
              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-muted-foreground min-w-20">{label}:</span>
                  <span className="font-medium">
                    {formatHours(hours)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-2 border-t space-y-2 text-xs text-muted-foreground">
          <div>
            <Search className="h-3 w-3 inline mr-1" />
            <strong>Found with:</strong> {business.search_query}
          </div>
          <div>
            <strong>Original input:</strong> {business.input_data.name}, {business.input_data.city}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}