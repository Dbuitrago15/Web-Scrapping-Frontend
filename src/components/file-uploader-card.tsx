import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ApiService, CSVValidationResult } from "@/lib/api"

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
  const [validation, setValidation] = useState<CSVValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Validar archivo cuando cambie
  useEffect(() => {
    if (file) {
      setIsValidating(true)
      ApiService.validateCSV(file, t)
        .then(setValidation)
        .catch(error => {
          console.error('Error validating CSV:', error)
          setValidation({
            isValid: false,
            errors: [t('csv.validation_error')],
            warnings: [],
            rowCount: 0,
            columns: [],
            requiredColumns: ['name', 'address', 'city'],
            missingColumns: ['name', 'address', 'city']
          })
        })
        .finally(() => setIsValidating(false))
    } else {
      setValidation(null)
    }
  }, [file, t])

  const handleDownloadTemplate = () => {
    ApiService.downloadCSVTemplate()
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t("upload.title")}
        </CardTitle>
        <CardDescription>
          {t("upload.description")}
          <br />
          <span className="text-xs text-muted-foreground">
            {t('csv.required_columns')}: <code>name</code>, <code>address</code>, <code>city</code>. {t('csv.optional')}: <code>postal_code</code>
          </span>
          <br />
          <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <CheckCircle className="h-3 w-3" />
            {t('csv.utf8_support')}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botón de plantilla */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('csv.download_template')}
          </Button>
        </div>

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
          <div className="space-y-3">
            {/* Información del archivo */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
              {isValidating && <span className="text-xs text-blue-600">{t('csv.validating')}</span>}
            </div>

            {/* Resultados de validación */}
            {validation && (
              <div className="space-y-2">
                {/* Estado general */}
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ✅ {t('csv.valid')}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ❌ {t('csv.invalid')}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {validation.rowCount} {t('csv.rows_data')}
                  </span>
                </div>

                {/* Errores */}
                {validation.errors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">{t('csv.errors')}</p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Advertencias */}
                {validation.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">{t('csv.warnings')}</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Información de columnas */}
                {validation.columns.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      <Info className="h-4 w-4 inline mr-1" />
                      {t('csv.columns_detected')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {validation.columns.map((col, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={onProcessFile} 
          disabled={!file || isDisabled || (validation && !validation.isValid) || false} 
          className="w-full" 
          size="lg"
        >
          {isDisabled ? t("upload.uploading") : 
           !file ? t("upload.button") :
           validation && !validation.isValid ? `❌ ${t('csv.invalid_file')}` :
           t("upload.button")}
        </Button>
      </CardContent>
    </Card>
  )
}