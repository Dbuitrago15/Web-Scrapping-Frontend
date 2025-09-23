"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Eye } from 'lucide-react'
import { ResultsModal } from "@/components/results-modal"
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

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ScrapingResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const { t } = useTranslation()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    }
  }

  const simulateProcessing = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Generate mock results
    const mockResults: ScrapingResult[] = Array.from({ length: 150 }, (_, index) => ({
      id: `result-${index + 1}`,
      name: `Business ${index + 1}`,
      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
      email: `contact${index + 1}@business.com`,
      phone: `+1-555-${String(index + 1).padStart(4, "0")}`,
      website: `https://business${index + 1}.com`,
      category: ["Restaurant", "Retail", "Service", "Technology", "Healthcare"][index % 5],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews: Math.floor(Math.random() * 500) + 10,
      address: `${index + 1} Main St, City, State 12345`,
    }))

    setResults(mockResults)
    setIsProcessing(false)
    setProgress(100)
  }

  const handleUpload = async () => {
    if (!file) return
    await simulateProcessing()
  }

  const handleViewResults = () => {
    setShowResults(true)
  }

  const handleCloseResults = () => {
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

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
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("processing.status")}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <Button onClick={handleUpload} disabled={!file || isProcessing} className="w-full" size="lg">
              {isProcessing ? t("processing.button") : t("upload.button")}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && !isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>{t("results.title")}</CardTitle>
              <CardDescription>{t("results.description", { count: results.length })}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleViewResults} size="lg" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                {t("results.viewButton")}
              </Button>
            </CardContent>
          </Card>
        )}

        <ResultsModal isOpen={showResults} onClose={handleCloseResults} data={results} />
      </div>
    </div>
  )
}