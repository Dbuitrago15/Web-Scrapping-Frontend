# 🕷️ ### 🚀 **Perform### 🚀 **Performance and Architecture**
- ⚡ **Modern Backend**: Node.js + Fastify + BullMQ + Redis
- 🔄 **Asynchronous Processing**: Work queues with BullMQ
- 📊 **Real-Time Monitoring**: Service status (API:3000, Redis:6379, Worker)
- 🔍 **Smart Validation**: CSV validation before processing
- 📊 **Complete Dashboard**: Detailed progress trackingn### 🌍 **Complete Multilingual System**
- 🇺🇸 **English** - English (Primary language)
- 🇩🇪 **German** - Deutsch
- 🇫🇷 **French** - Français  
- 🇮🇹 **Italian** - Italiano
- 🔄 **Dynamic Switching**: Real-time flag selector
- 📅 **Localized Formatting**: Dates and timestamps by languaget### 📋 **CSV Validation and Processing**
- ✅ **Pre-validation**: Structure verification before processing
- 📥 **CSV Templates**: Download templates with correct format
- 🚨 **Detailed Feedback**: Errors, warnings, and information
- 📊 **Column Detection**: Automatic field recognition
- 🚨 **Error Handling**: Robust management of invalid files**
- ⚡ **Modern Backend**: Node.js + Fastify + BullMQ + Redis
- 🔄 **Asynchronous Processing**: Work queues with BullMQ
- 📊 **Real-Time Monitoring**: Service status (API:3000, Redis:6379, Worker)
- 🔍 **Smart Validation**: CSV validation before processing
- 📊 **Complete Dashboard**: Detailed progress trackingr### 🌍 **Complete Multilingual System**
- 🇺🇸 **English** - English (Primary language)
- 🇩🇪 **German** - Deutsch
- 🇫🇷 **French** - Français  
- 🇮🇹 **Italian** - Italiano
- 🔄 **Dynamic Switching**: Real-time flag selector
- 📅 **Localized Formatting**: Dates and timestamps by languager### 📋 **CSV Validation and Processing**
- ✅ **Pre-validation**: Structure verification before processing
- 📥 **CSV Templates**: Download templates with correct format
- 🚨 **Detailed Feedback**: Errors, warnings, and information
- 📊 **Column Detection**: Automatic field recognition
- 🚨 **Error Handling**: Robust management of invalid files

A modern and complete web application for massive business data web scraping from Google Maps, with multilingual support, real-time CSV validation, backend service monitoring, and advanced data export. Compatible with high-performance **Node.js/Fastify/BullMQ** backend.

## ✨ Key Features

### 🚀 **Rendimiento y Arquitectura**
- ⚡ **Backend Moderno**: Node.js + Fastify + BullMQ + Redis
- 🔄 **Procesamiento Asíncrono**: Colas de trabajo con BullMQ
- 📊 **Monitoreo en Tiempo Real**: Estado de servicios (API:3000, Redis:6379, Worker)
- 🔍 **Validación Inteligente**: Validación de CSV antes del procesamiento
- � **Dashboard Completo**: Seguimiento detallado del progreso

### 🌍 **Sistema Multiidioma Completo**
- 🇺🇸 **Inglés** - English (Idioma principal)
- 🇩🇪 **Alemán** - Deutsch
- �🇷 **Francés** - Français  
- �🇮🇹 **Italiano** - Italiano
- 🔄 **Cambio Dinámico**: Selector con banderas en tiempo real
- � **Formateo Localizado**: Fechas y timestamps según idioma

### � **Validación y Procesamiento CSV**
- ✅ **Validación Previa**: Verificación de estructura antes de procesar
- � **Plantillas CSV**: Descarga de templates con formato correcto
- 🚨 **Retroalimentación Detallada**: Errores, advertencias e información
- 📊 **Detección de Columnas**: Reconocimiento automático de campos
- � **Manejo de Errores**: Gestión robusta de archivos inválidos

### 📈 **Advanced Data Visualization**
- 📊 **Interactive Table**: TanStack React Table with advanced filters
- 🔍 **Smart Search**: Real-time filtering by multiple fields
- 📄 **Complete Export**: CSV with original and scraped data
- 🕐 **Schedule Formatting**: Automatic conversion to HH:MM - HH:MM format
- 📱 **Responsive Design**: Sticky headers and optimized scrolling
- 🎯 **Data Comparison**: Side-by-side view of original vs found data

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Table**: TanStack React Table v8
- **HTTP Client**: Axios
- **State**: React Context API
- **Internationalization**: Custom i18n system
- **Validation**: Zod + Custom CSV validation

### Backend Compatibility
- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **Work Queue**: BullMQ
- **Database**: Redis
- **Containers**: Docker + Docker Compose
- **API**: RESTful endpoints (/api/v1/*)

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js 18+** 
- **npm or yarn**
- **Docker & Docker Compose** (for backend)
- **Node.js/Fastify Backend** running on port 3000
- **Redis** on port 6379
- **Active worker processes**

### 🔧 Automatic Installation

**Windows:**
```bash
./setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### 📝 Manual Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dbuitrago15/Web-Scrapping-Frontend.git
cd Web-Scrapping-Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

4. **Start in development mode**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

## 🎯 Application Usage

### 1. **Verify System Status**
- Verify that all services are active in the top right panel
- **API (Port 3000)**: ✅ Connected
- **Redis (Port 6379)**: ✅ Connected  
- **Worker**: ✅ Active

### 2. **Prepare and Validate Data**
- Download CSV template by clicking "Download CSV Template"
- Create CSV file with required columns:
```csv
name,address,city
Restaurant ABC,123 Main St,New York
Coffee Shop XYZ,456 Oak Ave,Los Angeles
```

### 3. **Automatic Validation**
- Select CSV file
- **Automatic validation** will show:
  - ✅ **Valid/Invalid**
  - 📊 **Number of rows**
  - 🚨 **Errors** (if any)
  - ⚠️ **Warnings**
  - ℹ️ **Detected columns**

### 4. **Processing**
- Click "Process File" (only if file is valid)
- Monitor progress in real-time
- View processing statistics

### 5. **Explore Results**
- **Interactive table** with original and scraped data
- **Advanced filters** by name, address, phone, etc.
- **Real-time search**
- **Side-by-side comparison** of data
- **Formatted schedules** (HH:MM - HH:MM)

### 6. **Export Data**
- Click "Export Results" 
- Download complete CSV with:
  - Original input data
  - Scraped data from Google Maps
  - Ratings, reviews, phones, websites
  - Formatted operating hours

### 7. **Change Language**
- Use selector in top right corner
- Instant change without page reload
- Complete support in 4 languages

## 📊 Data Structure

### Input (Required CSV)
```csv
name,address,city
Restaurant ABC,123 Main St,New York
Coffee Shop XYZ,456 Oak Ave,Los Angeles
```

### Complete Output Structure
```typescript
interface BusinessData {
  // 📥 Original Data (from CSV)
  originalData: {
    name: string,
    address: string, 
    city: string
  },
  
  // 🔍 Scraped Data (from Google Maps)
  scrapedData: {
    name: string,                    // Found name
    rating: number,                  // 1.0 - 5.0
    reviewsCount: number,            // Number of reviews
    phone: string,                   // Phone number
    address: string,                 // Complete address
    website: string,                 // Website
    category: string,                // Business category
    
    // ⏰ Formatted Hours
    monday_hours: string,            // "09:00 - 17:00"
    tuesday_hours: string,
    wednesday_hours: string,
    thursday_hours: string,
    friday_hours: string,
    saturday_hours: string,
    sunday_hours: string,
    
    // 🎯 Metadata
    foundOnMaps: boolean,            // If found on Maps
    status: 'found' | 'not_found' | 'error'
  }
}
```

### CSV Validation
```typescript
interface CSVValidationResult {
  isValid: boolean,
  rowCount: number,
  columns: string[],               // Detected columns
  errors: string[],                // Critical errors
  warnings: string[],              // Warnings
  info: string[]                   // Additional information
}
```

## 🗂️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Main layout with providers
│   ├── page.tsx                 # Main page with state
│   └── globals.css              # Global styles + Tailwind
├── components/                   # React Components
│   ├── ui/                      # Base components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── data-table.tsx           # Advanced interactive table
│   ├── file-uploader-card.tsx   # CSV upload and validation
│   ├── backend-status-card.tsx  # Service monitoring
│   ├── processing-status-card.tsx # Real-time progress
│   ├── completion-card.tsx      # Completed results
│   ├── error-card.tsx          # Error handling
│   ├── language-selector.tsx    # Multilingual selector
│   ├── results-modal.tsx       # Results modal
│   └── business-card-detail.tsx # Business details
├── contexts/                    # React Contexts
│   └── language-context.tsx    # Language context
├── hooks/                       # Custom Hooks
│   └── use-translation.ts      # Complete i18n system
├── lib/                        # Utilities and APIs
│   ├── api.ts                  # API client with validation
│   ├── csv-export.ts           # CSV export
│   └── utils.ts                # General utilities
└── types/                      # TypeScript definitions
    └── index.ts                # Main interfaces
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Development server (port 3000 or next available)
npm run build        # Build for production  
npm run start        # Production server
npm run lint         # ESLint linter with TypeScript rules
npm run type-check   # Complete TypeScript verification
npm run clean        # Clean .next and node_modules
```

### Backend (Docker)
```bash
# Start all services
docker-compose up -d

# View logs in real-time
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Complete rebuild
docker-compose up --build -d
```

### Development
```bash
# Development with hot-reload
npm run dev & docker-compose up -d

# Verify services
curl http://localhost:3000/health
curl http://localhost:3000/health/redis
curl http://localhost:3000/health/worker
```

## 🌐 Backend API

The application connects with the Node.js/Fastify backend:

### 🔗 **Main Endpoints**
- **Base URL**: `http://localhost:3000/api/v1`
- **Architecture**: RESTful API

#### File Processing
```typescript
POST /api/v1/scraping-batch          # Create new batch
GET  /api/v1/scraping-batch/{id}     # Batch status
GET  /api/v1/scraping-batch/{id}/csv # Download results
```

#### Service Monitoring
```typescript
GET /health                    # General API status
GET /health/redis             # Redis status
GET /health/worker            # Worker status
```

#### Validation and Templates
```typescript
POST /api/v1/validate-csv     # Validate CSV file
GET  /api/v1/csv-template     # Download template
```

### 🏗️ **Backend Architecture**
- **API Server**: Fastify on port 3000
- **Message Broker**: Redis on port 6379
- **Queue System**: BullMQ for asynchronous processing
- **Worker Processes**: Multiple workers for scraping
- **Containerization**: Docker Compose for orchestration

## 🎯 Advanced Features

### 🔍 **Smart CSV Validation**
```typescript
// Automatic validations
✅ Correct column structure
✅ Valid file format  
✅ Encoding detection
✅ Required data validation
⚠️ Warnings for optional data
🚨 Critical errors preventing processing
```

### 📊 **Real-Time Service Monitoring**
- **Visual Status**: Connection indicators per service
- **Timestamps**: Last verification with relative time
- **Auto-refresh**: Verification every 30 seconds
- **Diagnostics**: Specific messages by error type

### 🌍 **Internationalization System**
```typescript
// i18n features
🔄 Dynamic change without reload
📅 Date formatting by locale
🕐 Localized relative time
🎯 Smart fallback to English
📝 Parameter interpolation
```

### 📈 **Advanced Data Table**
- **Virtual Scrolling**: Optimized performance for thousands of rows
- **Sticky Headers**: Improved navigation
- **Global Filters**: Real-time search
- **Multi-column Sorting**: Advanced classification
- **Visual Comparison**: Original vs scraped data

### ⏰ **Smart Schedule Formatting**
```typescript
// Automatic conversions
"Monday: 9:00 AM - 5:00 PM" → "09:00 - 17:00"
"Tue: 8:30 AM - 6:30 PM"    → "08:30 - 18:30"
"Closed"                     → "Closed"
"24 hours"                   → "24 hours"
```

## 🚨 Diagnostics and Troubleshooting

### Diagnostic Scripts

**Windows:**
```bash
./diagnose.bat
```

**macOS/Linux:**
```bash
chmod +x diagnose.sh
./diagnose.sh
```

### Common Issues

1. **🔴 Backend Services Unavailable**
   ```bash
   # Verify services
   docker-compose ps
   
   # Restart services
   docker-compose down
   docker-compose up --build -d
   ```
   - API must be on port 3000
   - Redis must be on port 6379
   - Worker processes must be active

2. **📄 CSV Validation Error**
   - Download official template from the application
   - Verify columns are: `name,address,city`
   - Check file encoding (UTF-8 recommended)
   - Remove empty rows or incomplete data

3. **🌍 Language Issues**
   - Clear browser cache
   - Verify language selector is visible
   - Reload page if there are context issues

4. **📊 Table Not Loading Data**
   - Verify CSV file was processed correctly
   - Check browser console for errors
   - Confirm there is valid data in the response

5. **⚡ Performance Issues**
   - Verify Redis is working correctly
   - Check worker logs for errors
   - Consider reducing CSV file size (< 1000 rows)

6. **🔧 TypeScript Errors**
   ```bash
   npm run type-check
   npm install --save-dev @types/node
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide](https://lucide.dev/) - Icons
- [TanStack Table](https://tanstack.com/table) - Data Table

