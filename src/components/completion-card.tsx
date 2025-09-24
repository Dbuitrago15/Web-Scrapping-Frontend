import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult } from "@/lib/api"
import { ResultsStats } from "@/components/results-stats"

interface CompletionCardProps {
  results: ScrapingResult[]
  onViewResults: () => void
}

export function CompletionCard({ results, onViewResults }: CompletionCardProps) {
  const { t } = useTranslation()
  const successful = results.filter(r => !r.error).length
  const failed = results.filter(r => r.error).length
  const total = results.length
  const successRate = total > 0 ? ((successful / total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <ResultsStats results={results} />
      
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Processing Complete!
          </CardTitle>
          <CardDescription>
            Successfully processed {total} businesses with {successRate.toFixed(1)}% success rate
            ({successful} successful, {failed} failed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onViewResults} size="lg" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Detailed Results
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}