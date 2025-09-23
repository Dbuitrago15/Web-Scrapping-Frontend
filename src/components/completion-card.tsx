import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"

interface CompletionCardProps {
  resultCount: number
  onViewResults: () => void
}

export function CompletionCard({ resultCount, onViewResults }: CompletionCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {t("results.title")}
        </CardTitle>
        <CardDescription>
          {t("results.description", { count: resultCount })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onViewResults} size="lg" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          {t("results.viewButton")}
        </Button>
      </CardContent>
    </Card>
  )
}