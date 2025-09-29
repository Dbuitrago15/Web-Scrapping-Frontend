import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"

interface ProcessingStatusCardProps {
  progress: {
    completed: number
    total: number
  }
}

export function ProcessingStatusCard({ progress }: ProcessingStatusCardProps) {
  const { t } = useTranslation()
  
  // Calcular porcentaje de progreso
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t("processing.status")}
        </CardTitle>
        <CardDescription>
          {progress.total > 0 
            ? t("processing.progress", { 
                completed: progress.completed, 
                total: progress.total 
              })
            : t("processing.button")
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("processing.status")}</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
        
        {progress.total > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {t('processing.records_processed', { 
              completed: progress.completed, 
              total: progress.total 
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}