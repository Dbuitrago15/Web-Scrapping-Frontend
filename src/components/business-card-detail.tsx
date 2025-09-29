"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, Globe, MapPin, Clock, Search, AlertCircle, CheckCircle } from "lucide-react"
import { ScrapingResult } from "@/lib/api"

interface BusinessCardDetailProps {
  business: ScrapingResult
}

export function BusinessCardDetail({ business }: BusinessCardDetailProps) {
  // Handle different status types
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Success</Badge>
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠️ Partial</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Failed</Badge>
      default:
        return <Badge variant="secondary">Processing</Badge>
    }
  }

  // Handle failed or not found results
  if (!business.scrapedData || business.scrapedData.status !== 'success') {
    return (
      <Card className={`border-2 ${
        business.status === 'error' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {business.originalData.name || 'Unknown Business'}
            </div>
            {getStatusBadge(business.scrapedData?.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <strong>Business Name:</strong> {business.originalData.name || 'N/A'}
            </div>
            <div>
              <strong>Address:</strong> {business.originalData.address || 'N/A'}
            </div>
            <div>
              <strong>Error:</strong> {business.scrapedData?.error || business.error || 'Processing...'}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Extract hours from opening_hours object
  const extractDayHours = (dayIndex: number): string => {
    if (!business.scrapedData?.openingHours) return 'N/A'
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const targetDay = dayNames[dayIndex]
    
    // Try different variations of day names
    const dayVariations = [targetDay, targetDay.slice(0, 3)]; // Full name and 3-letter abbreviation
    
    for (const variation of dayVariations) {
      if (business.scrapedData.openingHours[variation]) {
        return business.scrapedData.openingHours[variation]
      }
    }
    
    return 'N/A'
  }

  const formatHours = (hours: string) => {
    if (!hours || hours === 'N/A') return "N/A"
    if (hours.toLowerCase().includes('cerrado') || hours.toLowerCase().includes('closed')) {
      return "🔴 Closed"
    }
    if (hours.includes('24')) return "🟢 24h"
    return hours
  }

  const weekDays = [
    { index: 1, label: 'Monday' },
    { index: 2, label: 'Tuesday' },
    { index: 3, label: 'Wednesday' },
    { index: 4, label: 'Thursday' },
    { index: 5, label: 'Friday' },
    { index: 6, label: 'Saturday' },
    { index: 0, label: 'Sunday' },
  ]

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-lg">
              {business.scrapedData?.fullName || business.originalData.name || 'Unknown Business'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(business.scrapedData?.status)}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input vs Scraped Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-muted-foreground">Input Data (CSV):</h4>
            <div>
              <strong>Business Name:</strong> {business.originalData.name || 'N/A'}
            </div>
            <div>
              <strong>Address:</strong> {business.originalData.address || 'N/A'}
            </div>
            <div>
              <strong>City:</strong> {business.originalData.city || 'N/A'}
            </div>
            <div>
              <strong>Postal Code:</strong> {business.originalData.postal_code || 'N/A'}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-green-600">Scraped from Google Maps:</h4>
            <div>
              <strong>Found Name:</strong> {business.scrapedData?.fullName || 'N/A'}
            </div>
            <div>
              <strong>Found Address:</strong> {business.scrapedData?.fullAddress || 'N/A'}
            </div>
            <div>
              <strong>Status:</strong> {getStatusBadge(business.scrapedData?.status)}
            </div>
            {business.scrapedData?.status === 'success' && (
              <div className="text-xs text-green-600 mt-2">
                ✅ Successfully scraped real data from Google Maps
              </div>
            )}
          </div>
        </div>

        {/* Contact Information - From Google Maps */}
        <div className="space-y-2">
          {(business.scrapedData?.fullAddress || business.originalData.address) && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {business.scrapedData?.fullAddress || business.originalData.address || 'Address not found'}
                </div>
                {business.scrapedData?.fullAddress && business.scrapedData.fullAddress !== business.originalData.address && (
                  <div className="text-xs text-muted-foreground">
                    Input: {business.originalData.address}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {business.scrapedData?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${business.scrapedData.phone}`} className="text-blue-600 hover:underline">
                {business.scrapedData.phone}
              </a>
            </div>
          )}
          
          {/* Social Media Links */}
          {business.scrapedData?.socialMedia && Object.values(business.scrapedData.socialMedia).some(link => link) && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {business.scrapedData.socialMedia.facebook && (
                  <a href={business.scrapedData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">Facebook</a>
                )}
                {business.scrapedData.socialMedia.instagram && (
                  <a href={business.scrapedData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">Instagram</a>
                )}
                {business.scrapedData.socialMedia.twitter && (
                  <a href={business.scrapedData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">Twitter</a>
                )}
              </div>
            </div>
          )}

          {/* 🆕 NEW FIELDS: Rating & Reviews */}
          {(business.scrapedData?.rating || business.scrapedData?.reviewsCount) && (
            <div className="flex items-center gap-4 text-sm">
              {business.scrapedData?.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{business.scrapedData.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
              )}
              {business.scrapedData?.reviewsCount && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{business.scrapedData.reviewsCount}</span>
                  <span className="text-muted-foreground">reviews</span>
                </div>
              )}
            </div>
          )}

          {/* 🆕 NEW FIELD: Website */}
          {business.scrapedData?.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={business.scrapedData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {business.scrapedData.website}
              </a>
            </div>
          )}

          {/* 🆕 NEW FIELD: Category */}
          {business.scrapedData?.category && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">🏷️</span>
              <Badge variant="outline" className="font-normal">
                {business.scrapedData.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Weekly Hours */}
        {business.scrapedData?.openingHours && Object.keys(business.scrapedData.openingHours).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Weekly Hours</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              {weekDays.map(({ index, label }) => {
                const hours = extractDayHours(index)
                return (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-muted-foreground min-w-20">{label}:</span>
                    <span className="font-medium">
                      {formatHours(hours)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Raw Opening Hours */}
        {business.scrapedData?.openingHours && Object.keys(business.scrapedData.openingHours).length > 0 && (
          <div className="pt-2 border-t space-y-2 text-xs text-muted-foreground">
            <div>
              <strong>Raw Hours Data:</strong>
            </div>
            <div className="bg-muted p-2 rounded space-y-1">
              {Object.entries(business.scrapedData.openingHours).map(([day, hours]) => (
                <div key={day}><strong>{day}:</strong> {hours}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}