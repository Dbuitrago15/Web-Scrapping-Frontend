"use client"

import { useMemo } from "react"

type TranslationKey =
  | "title"
  | "subtitle"
  | "upload.title"
  | "upload.description"
  | "upload.selectFile"
  | "upload.button"
  | "upload.uploading"
  | "processing.status"
  | "processing.button"
  | "processing.progress"
  | "results.title"
  | "results.description"
  | "results.viewButton"
  | "error.title"
  | "error.upload"
  | "error.processing"
  | "error.network"
  | "error.retry"
  | "table.search"
  | "table.noResults"
  | "table.showing"
  | "table.of"
  | "table.entries"
  | "table.previous"
  | "table.next"
  | "table.page"
  | "table.rowsPerPage"
  | "columns.name"
  | "columns.city"
  | "columns.email"
  | "columns.phone"
  | "columns.website"
  | "columns.category"
  | "columns.rating"
  | "columns.reviews"
  | "columns.address"

const translations: Record<TranslationKey, string> = {
  title: "Web Scraping Dashboard",
  subtitle: "Upload your CSV file and get enhanced business data",
  "upload.title": "Upload CSV File",
  "upload.description": "Select a CSV file containing business information to process and enhance.",
  "upload.selectFile": "Select CSV File",
  "upload.button": "Process File",
  "upload.uploading": "Uploading file...",
  "processing.status": "Processing your file...",
  "processing.button": "Processing...",
  "processing.progress": "Processing {completed} of {total} records",
  "results.title": "Processing Complete",
  "results.description": "Successfully processed {count} records from your CSV file.",
  "results.viewButton": "View Results",
  "error.title": "Error",
  "error.upload": "Failed to upload file. Please check the file and try again.",
  "error.processing": "An error occurred while processing your file.",
  "error.network": "Cannot connect to server. Using demo mode with sample data.",
  "error.retry": "Try Again",
  "table.search": "Search...",
  "table.noResults": "No results found.",
  "table.showing": "Showing",
  "table.of": "of",
  "table.entries": "entries",
  "table.previous": "Previous",
  "table.next": "Next",
  "table.page": "Page",
  "table.rowsPerPage": "Rows per page",
  "columns.name": "Name",
  "columns.city": "City",
  "columns.email": "Email",
  "columns.phone": "Phone",
  "columns.website": "Website",
  "columns.category": "Category",
  "columns.rating": "Rating",
  "columns.reviews": "Reviews",
  "columns.address": "Address",
}

export function useTranslation() {
  const t = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, any>) => {
      let translation = translations[key] || key

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value))
        })
      }

      return translation
    }
  }, [])

  return { t }
}