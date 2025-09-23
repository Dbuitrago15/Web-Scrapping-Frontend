import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"

interface FileUploaderCardProps {
  file: File | null
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onProcessFile: () => void
  isDisabled: boolean
}

export function FileUploaderCard({ 
  file, 
  onFileChange, 
  onProcessFile, 
  isDisabled 
}: FileUploaderCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t("upload.title")}
        </CardTitle>
        <CardDescription>{t("upload.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-file">{t("upload.selectFile")}</Label>
          <Input 
            id="csv-file" 
            type="file" 
            accept=".csv" 
            onChange={onFileChange} 
            disabled={isDisabled} 
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}

        <Button 
          onClick={onProcessFile} 
          disabled={!file || isDisabled} 
          className="w-full" 
          size="lg"
        >
          {isDisabled ? t("upload.uploading") : t("upload.button")}
        </Button>
      </CardContent>
    </Card>
  )
}