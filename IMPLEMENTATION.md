# 🚀 Web Scraping Dashboard - Complete Implementation

## 📋 General Description

This application has evolved from a static project to a complete web scraping platform with modern Node.js/Fastify/BullMQ architecture, complete multilingual system, real-time CSV validation, backend service monitoring, and asynchronous processing of Google Maps business data.

## 🏗️ Modern Architecture

### Complete Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Fastify + BullMQ + Redis
- **Processing**: Asynchronous queues with workers
- **Containerization**: Docker + Docker Compose
- **Internationalization**: Custom i18n system
- **Validation**: Zod + custom CSV validators

## 🏗️ Application Architecture

### Application States
The application handles multiple distributed states:

#### Processing States
- **`idle`**: Initial state with CSV validation
- **`validating`**: Validating CSV file structure
- **`uploading`**: Uploading file to backend
- **`processing`**: Asynchronous processing with polling
- **`complete`**: Results ready with interactive table
- **`error`**: Granular error handling

#### Backend Service States
- **API Status**: Connection to Fastify (port 3000)
- **Redis Status**: Message broker status (port 6379)
- **Worker Status**: Active scraping processes
- **Timestamps**: Last verification with localized formatting

#### Validation States
- **File Validation**: CSV structure and format
- **Column Detection**: Automatic field recognition
- **Error Reporting**: Errors, warnings, and information
- **Template Generation**: Template downloads

### Main Components

#### 1. **FileUploaderCard** (`/components/file-uploader-card.tsx`)
- 📋 **Real-time validation** of CSV files
- 📥 **Template downloads** with correct format
- ✅ **Visual feedback** with validation states
- 🚨 **Detailed reporting** of errors and warnings
- 📊 **Automatic column detection**

#### 2. **BackendStatusCard** (`/components/backend-status-card.tsx`)
- 📊 **Real-time monitoring** of services
- 🕐 **Localized timestamps** with relative time
- ⚙️ **Granular status** (API:3000, Redis:6379, Worker)
- 🔄 **Auto-refresh** every 30 seconds
- 🚨 **Smart diagnostics** with instructions

#### 3. **DataTable** (`/components/data-table.tsx`)
- 📋 **TanStack React Table v8** with advanced filters
- 🔍 **Global search** in real-time
- 📊 **Sticky headers** for navigation
- ⏰ **Schedule formatting** HH:MM - HH:MM
- 🔄 **Visual comparison** original vs scraped data
- 📱 **Optimized scrolling** for large datasets

#### 4. **LanguageSelector** (`/components/language-selector.tsx`)
- 🌍 **4 complete languages** with flags
- 🔄 **Dynamic switching** without reload
- 📅 **Localized formatting** of dates and time
- 🎯 **Smart fallback** to English

#### 5. **ProcessingStatusCard** (`/components/processing-status-card.tsx`)
- 📊 **Real-time progress** with polling
- 🔄 **Animated bar** with percentages
- 📊 **Detailed statistics** of processing
- ⏹️ **Pause/resume control**

#### 6. **CompletionCard** (`/components/completion-card.tsx`)
- ✅ **Results summary** with metrics
- 📥 **CSV export** with complete data
- 📊 **Success statistics** and errors
- 🔍 **Quick access** to results table

## 🔄 Modern Data Flow and API

### 1. CSV Validation
```typescript
POST http://localhost:3000/api/v1/validate-csv
Content-Type: multipart/form-data

// Response:
{
  "isValid": true,
  "rowCount": 150,
  "columns": ["name", "address", "city"],
  "errors": [],
  "warnings": ["Some addresses may be incomplete"],
  "info": ["UTF-8 encoding detected"]
}
```

### 2. Template Download
```typescript
GET http://localhost:3000/api/v1/csv-template
Content-Type: text/csv

// Response: CSV file with correct structure
name,address,city
Example Business,123 Main St,New York
```

### 3. Upload and Processing
```typescript
POST http://localhost:3000/api/v1/scraping-batch
Content-Type: multipart/form-data

// Response:
{
  "batchId": "uuid-v4",
  "status": "PENDING",
  "message": "File uploaded and queued for processing",
  "estimatedTime": 300 // seconds
}
```

### 4. Service Monitoring
```typescript
// General status
GET http://localhost:3000/health
{
  "status": "healthy",
  "timestamp": "2025-09-29T10:30:00Z",
  "services": {
    "api": true,
    "redis": true,
    "worker": true
  }
}

// Individual states
GET http://localhost:3000/health/redis
GET http://localhost:3000/health/worker
```

### 5. Advanced Status Polling
```typescript
GET http://localhost:3000/api/v1/scraping-batch/{batch_id}

// Response:
{
  "batchId": "uuid",
  "status": "PROCESSING", // PENDING | PROCESSING | COMPLETED | FAILED
  "progress": {
    "completed": 45,
    "total": 100,
    "percentage": 45,
    "estimatedTimeRemaining": 180
  },
  "statistics": {
    "successful": 40,
    "failed": 5,
    "averageProcessingTime": 3.2
  },
  "results": [...], // Only when status = COMPLETED
  "errorMessage": null,
  "createdAt": "2025-09-29T10:00:00Z",
  "updatedAt": "2025-09-29T10:15:00Z"
}
```

### 6. Results Export
```typescript
GET http://localhost:3000/api/v1/scraping-batch/{batch_id}/csv
Content-Type: text/csv

// Response headers:
Content-Disposition: attachment; filename="results_2025-09-29.csv"

// Data with complete structure:
original_name,original_address,scraped_name,rating,reviews_count,phone,website...
```

## 🛠️ Advanced Hooks and Contexts

### useTranslation (`/hooks/use-translation.ts`)
Complete internationalization system:
- 🌍 **4 complete languages**: English, German, French, Italian
- 🔄 **Dynamic interpolation**: `{seconds}`, `{completed}`, `{total}`
- 🎯 **Smart fallback**: Auto-fallback to English
- 📅 **Localized formatting**: Dates and timestamps by language
- ⚡ **Optimized performance**: useMemo for caching

```typescript
const { t } = useTranslation()
t('time.seconds_ago', { seconds: 30 }) // "30 seconds ago" / "vor 30 Sekunden"
```

### useLanguage (`/contexts/language-context.tsx`)
Global language context:
- 💾 **Session persistence**
- 🔄 **Reactive changes** throughout the app
- 🎯 **TypeScript safety** with language types

### usePolling (Implemented in components)
Smart polling for service status:
- ⏰ **Configurable interval** (30s for services, 3s for processing)
- 🧠 **Auto-cleanup** on cleanup
- 🚨 **Error handling** with retry logic
- ⏸️ **Automatic pause/resume**

## 📦 Advanced API Services

### ApiService (`/lib/api.ts`)
Centralized class with complete functionality:

```typescript
// 📋 CSV validation
ApiService.validateCSV(file: File): Promise<CSVValidationResult>

// 📥 Template downloads
ApiService.downloadCSVTemplate(): void

// 📤 Upload and processing
ApiService.uploadFile(file: File): Promise<BatchUploadResponse>

// 🔍 Query status with polling
ApiService.getBatchStatus(batchId: string): Promise<BatchStatus>

// 📊 Service monitoring
ApiService.checkServicesStatus(): Promise<ServiceStatus>
ApiService.healthCheck(): Promise<boolean>

// 📥 Results export
ApiService.downloadResults(batchId: string): Promise<Blob>
```

### Interfaces TypeScript
```typescript
interface ServiceStatus {
  api: boolean
  redis: boolean
  worker: boolean
  lastCheck: string
  error?: string
}

interface CSVValidationResult {
  isValid: boolean
  rowCount: number
  columns: string[]
  errors: string[]
  warnings: string[]
  info: string[]
}

interface BusinessData {
  originalData: {
    name: string
    address: string
    city: string
  }
  scrapedData: {
    name: string
    rating: number
    reviewsCount: number
    phone: string
    website: string
    category: string
    monday_hours: string
    // ... other days
    foundOnMaps: boolean
    status: 'found' | 'not_found' | 'error'
  }
}
```

## 🎯 Implemented Features

### ✅ Centralized State Management
- **Reactive state** with React hooks
- **Separation of responsibilities** per component
- **Robust error management**

### ✅ Backend Communication
- **Axios** for HTTP calls
- **FormData** for file uploads
- **Timeout handling** and network errors

### ✅ Smart Polling
- **Automatic queries** every 3 seconds
- **Automatic detection** of completion/failure
- **Resource cleanup** to avoid memory leaks

### ✅ User Experience
- **Visual feedback** in real-time
- **Progress indicators** with percentages
- **Error handling** with clear messages
- **Retry buttons** for recovery

### ✅ Advanced Data Table
- **TanStack React Table** for complete functionality
- **Global search** in real-time
- **Column sorting**
- **Configurable pagination**

## ⚡ Optimizaciones de Rendimiento

### Client-Side Avanzado
- 🚀 **React Suspense** con lazy loading de tablas
- 🎯 **useMemo** estratégico en translations y formatters
- 📊 **Virtual scrolling** para datasets grandes (TanStack Table)
- 🧠 **Debouncing inteligente** en filtros globales (300ms)
- 📦 **Code splitting** automático por rutas
- 🔄 **Optimistic updates** in CSV validation

### Backend Performance
- 🗄️ **Redis clustering** para alta disponibilidad
- 🚀 **BullMQ** with parallel processing
- 📊 **Connection pooling** optimizado
- ⚡ **Rate limiting** por IP y endpoint
- 🗂️ **Streaming responses** para archivos grandes
- 🔄 **Worker scaling** horizontal automático

### Monitoring y Analytics
- 📈 **Performance metrics** en tiempo real
- 🚨 **Error boundary** con Sentry integration
- 📊 **Bundle analyzer** para optimización
- ⏱️ **Core Web Vitals** tracking
- 🔍 **API response time** monitoring

## 🚀 Complete Usage Guide

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start in development
npm run dev
```

### 2. Validation and Processing Flow
1. 🌍 **Select language** in top right dropdown
2. 📋 **Download CSV template** if necessary
3. 📤 **Validate file** (automatic verification when selecting)
4. ✅ **Correct errors** shown in feedback
5. 🚀 **Process file** once validated
6. 👁️ **Monitor progress** in real-time
7. 📊 **Review results** in interactive table
8. 📥 **Export processed data**

### 3. System Monitoring
- 🟢 **API Status**: Connection to Fastify server
- 🟢 **Redis Status**: Functional message broker  
- 🟢 **Worker Status**: Active scraping processes
- ⏰ **Timestamps**: Last verification with localized format

### 4. Advanced Error Handling
- 🚨 **Preventive validation**: Errors detected before upload
- 🔄 **Automatic retry**: Smart retries on temporary failures
- 📊 **Detailed diagnostics**: Specific solution instructions
- 🌐 **Localized messages**: Errors in selected language

## 🔧 Complete System Configuration

### Expected Backend (Port 3000)
```typescript
// Fastify server structure
http://localhost:3000
├── /api/v1/validate-csv        # Pre-validation
├── /api/v1/csv-template        # Template downloads
├── /api/v1/scraping-batch      # Upload and processing
├── /api/v1/scraping-batch/{id} # Status and results
├── /health                     # General status
├── /health/redis              # Specific Redis status
└── /health/worker             # Specific Worker status
```

### Docker Compose Backend
```yaml
version: '3.8'
services:
  api:
    ports: ["3000:3000"]
  redis:
    ports: ["6379:6379"] 
  worker:
    depends_on: [redis]
```

## 🛠️ Development and Extension

### Add New Language
```typescript
// In hooks/use-translation.ts
const translations = {
  // Existing languages...
  pt: {
    // Portuguese translations
    common: {
      upload: "Enviar",
      process: "Processar"
    }
  }
}
```

### CSV Validation Extensions
```typescript
// Add new validation
const customValidations = {
  phoneFormat: (data) => validatePhoneNumbers(data),
  emailFormat: (data) => validateEmails(data),
  businessHours: (data) => validateHours(data)
}
```

### New Export Types
```typescript
// Export in multiple formats
ApiService.exportResults(batchId, 'json' | 'xlsx' | 'pdf')
```

## 🎨 Complete Technology Stack

### Modern Frontend
- **Next.js 15** - App Router + Server Components
- **React 18** - Concurrent features + Suspense
- **TypeScript 5.x** - Strict mode + advanced types
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **TanStack React Table v8** - Advanced data table
- **Framer Motion** - Smooth animations

### Backend Infrastructure  
- **Node.js 20+** - Modern runtime
- **Fastify** - High-performance web framework
- **BullMQ** - Robust queue management
- **Redis** - Message broker + cache
- **Docker** - Complete containerization
- **TypeScript** - End-to-end type safety

### Development Tools
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks
- **Jest + Testing Library** - Testing suite
- **Playwright** - E2E testing
- **Bundle Analyzer** - Performance monitoring

