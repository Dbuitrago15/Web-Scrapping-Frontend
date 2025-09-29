"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Search, BarChart3 } from "lucide-react"
import { ScrapingResult } from "@/lib/api"
import { useTranslation } from "@/hooks/use-translation"

interface ResultsStatsProps {
  results: ScrapingResult[]
}

export function ResultsStats({ results }: ResultsStatsProps) {
  const { t } = useTranslation()
  const successful = results.filter(r => !r.error).length
  const failed = results.filter(r => r.error).length
  const total = results.length
  const successRate = total > 0 ? ((successful / total) * 100) : 0

  // Analyze common error types
  const errorTypes = results
    .filter(r => r.error)
    .reduce((acc, result) => {
      const error = result.error || 'Unknown error'
      if (error.includes('No search results')) {
        acc['not_found'] = (acc['not_found'] || 0) + 1
      } else if (error.includes('All search strategies failed')) {
        acc['strategies_failed'] = (acc['strategies_failed'] || 0) + 1
      } else if (error.includes('Timeout')) {
        acc['timeout'] = (acc['timeout'] || 0) + 1
      } else {
        acc['other'] = (acc['other'] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

  // Get success rate color
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600"
    if (rate >= 50) return "text-yellow-600"
    if (rate >= 30) return "text-orange-600"
    return "text-red-600"
  }

  const getSuccessRateBadgeVariant = (rate: number) => {
    if (rate >= 70) return "default"
    if (rate >= 50) return "secondary"
    return "destructive"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Success Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            <span className={getSuccessRateColor(successRate)}>
              {successRate.toFixed(1)}%
            </span>
            <Badge variant={getSuccessRateBadgeVariant(successRate)} className="text-xs">
              {successRate >= 50 ? "Good" : successRate >= 30 ? "Fair" : "Low"}
            </Badge>
          </div>
          <Progress value={successRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Industry average: ~50%
          </p>
        </CardContent>
      </Card>

      {/* Successful Extractions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {successful}
          </div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((successful / total) * 100).toFixed(0)}% of total` : '0% of total'}
          </p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">✅ Complete data extracted</span>
          </div>
        </CardContent>
      </Card>

      {/* Failed Extractions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {failed}
          </div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((failed / total) * 100).toFixed(0)}% of total` : '0% of total'}
          </p>
          <div className="mt-2 text-xs">
            <span className="text-red-600">❌ No data found</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Processed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Total Processed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {total}
          </div>
          <p className="text-xs text-muted-foreground">
            Businesses searched
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Google Maps queries</span>
              <span className="font-medium">{total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Breakdown - Only show if there are errors */}
      {failed > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Error Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {errorTypes.not_found && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {errorTypes.not_found}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Not found on Google Maps
                  </div>
                </div>
              )}
              {errorTypes.strategies_failed && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {errorTypes.strategies_failed}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All search strategies failed
                  </div>
                </div>
              )}
              {errorTypes.timeout && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">
                    {errorTypes.timeout}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Timeout errors
                  </div>
                </div>
              )}
              {errorTypes.other && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-600">
                    {errorTypes.other}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Other errors
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Success rates vary by business type and location accuracy. 
                More specific addresses typically yield better results.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}