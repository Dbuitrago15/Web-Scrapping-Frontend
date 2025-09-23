"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { useTranslation } from "@/hooks/use-translation"

interface ScrapingResult {
  id: string
  name: string
  city: string
  email: string
  phone: string
  website: string
  category: string
  rating: number
  reviews: number
  address: string
}

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  data: ScrapingResult[]
}

export function ResultsModal({ isOpen, onClose, data }: ResultsModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("results.title")} ({data.length} {t("table.entries")})
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <DataTable data={data} />
        </div>
      </DialogContent>
    </Dialog>
  )
}