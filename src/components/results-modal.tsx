"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult } from "@/lib/api"
import { downloadCSV } from "@/lib/csv-export"
import { Download } from "lucide-react"

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  data: ScrapingResult[]
}

export function ResultsModal({ isOpen, onClose, data }: ResultsModalProps) {
  const { t } = useTranslation()

  const handleDownloadCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadCSV(data, `scraping-results-${timestamp}.csv`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {t("results.title")} ({data.length} {t("table.entries")})
            </DialogTitle>
            <Button onClick={handleDownloadCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('download_csv')}
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto min-h-0">
          <DataTable data={data} />
        </div>
      </DialogContent>
    </Dialog>
  )
}