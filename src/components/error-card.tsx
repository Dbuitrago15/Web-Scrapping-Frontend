import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"

interface ErrorCardProps {
  errorMessage: string
  onRetry: () => void
}

export function ErrorCard({ errorMessage, onRetry }: ErrorCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="mb-8 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {t("error.title")}
        </CardTitle>
        <CardDescription className="text-red-600">
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry} size="lg" className="w-full" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("error.retry")}
        </Button>
      </CardContent>
    </Card>
  )
}