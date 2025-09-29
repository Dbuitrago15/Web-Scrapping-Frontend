import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye, Download, Loader2 } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult, ApiService } from "@/lib/api"
import { ResultsStats } from "@/components/results-stats"
import { downloadCSV } from "@/lib/csv-export" // Fallback para compatibilidad

interface CompletionCardProps {
  results: ScrapingResult[]
  batchId?: string // 🆕 Added batchId for new backend export
  onViewResults: () => void
}

export function CompletionCard({ results, batchId, onViewResults }: CompletionCardProps) {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)
  const successful = results.filter(r => !r.error).length
  const failed = results.filter(r => r.error).length
  const total = results.length
  const successRate = total > 0 ? ((successful / total) * 100) : 0

  const handleDownloadCSV = async () => {
    if (!batchId) {
      // Fallback to old method if no batchId
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadCSV(results, `scraping-results-${timestamp}.csv`)
      return
    }

    try {
      setIsExporting(true)
      // 🆕 Use new backend CSV export endpoint
      await ApiService.exportCleanCSV(batchId)
      console.log('✅ CSV exported successfully using backend endpoint')
    } catch (error: any) {
      console.error('❌ Failed to export CSV from backend:', error)
      // Fallback to old method
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadCSV(results, `scraping-results-${timestamp}.csv`)
    } finally {
      setIsExporting(false)
    }
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
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {batchId ? 'Download Clean CSV' : t('download_csv')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}