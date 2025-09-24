import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye, Download } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult } from "@/lib/api"
import { ResultsStats } from "@/components/results-stats"
import { downloadCSV } from "@/lib/csv-export"

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

  const handleDownloadCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadCSV(results, `scraping-results-${timestamp}.csv`)
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <ResultsStats results={results} />
      
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t('processing_complete')}
          </CardTitle>
          <CardDescription>
            {t('successfully_processed')} {total} {t('businesses_with')} {successRate.toFixed(1)}% {t('success_rate_with_details')}
            ({successful} {t('successful')}, {failed} {t('failed')})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onViewResults} size="lg" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            {t('view_detailed_results')}
          </Button>
          
          <Button 
            onClick={handleDownloadCSV} 
            variant="outline" 
            size="lg" 
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('download_csv')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}