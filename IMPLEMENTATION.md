# 🚀 Web Scraping Dashboard - Implementación Funcional

## 📋 Descripción General

Esta aplicación ha sido transformada de un proyecto estático a una aplicación completamente funcional que se conecta con un backend para el procesamiento de archivos CSV y web scraping de datos de empresas.

## 🏗️ Arquitectura de la Aplicación

### Estados de la Aplicación
La aplicación maneja 5 estados principales:
- **`idle`**: Estado inicial, mostrando el cargador de archivos
- **`uploading`**: Subiendo archivo al backend
- **`processing`**: Procesando archivo en el backend (con polling)
- **`complete`**: Procesamiento completado, mostrando resultados
- **`error`**: Error en cualquier parte del proceso

### Componentes Principales

#### 1. **FileUploaderCard** (`/components/file-uploader-card.tsx`)
- Maneja la selección y visualización de archivos CSV
- Valida que el archivo sea de tipo CSV
- Botón para iniciar el procesamiento

#### 2. **ProcessingStatusCard** (`/components/processing-status-card.tsx`)
- Muestra el progreso del procesamiento en tiempo real
- Barra de progreso animada
- Contador de registros procesados

#### 3. **CompletionCard** (`/components/completion-card.tsx`)
- Mostrado cuando el procesamiento se completa exitosamente
- Botón para ver los resultados en modal

#### 4. **ErrorCard** (`/components/error-card.tsx`)
- Maneja y muestra errores de upload o procesamiento
- Botón para reintentar el proceso

## 🔄 Flujo de Datos y API

### 1. Upload de Archivo
```typescript
POST http://localhost:8000/api/v1/batches
Content-Type: multipart/form-data

// Respuesta:
{
  "batch_id": "uuid",
  "status": "PENDING",
  "message": "File uploaded successfully"
}
```

### 2. Polling de Estado
```typescript
GET http://localhost:8000/api/v1/batches/{batch_id}

// Respuesta:
{
  "batch_id": "uuid",
  "status": "PROCESSING", // PENDING | PROCESSING | COMPLETED | FAILED
  "progress": {
    "completed": 45,
    "total": 100
  },
  "results": [...], // Solo cuando status = COMPLETED
  "error_message": null,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 🛠️ Hooks Personalizados

### usePolling (`/hooks/use-polling.ts`)
Hook personalizado que maneja el polling automático del estado del batch:
- **Intervalo configurable** (default: 3 segundos)
- **Auto-limpieza** cuando el componente se desmonta
- **Manejo de errores** integrado
- **Callbacks** para actualizaciones de estado

### useTranslation (`/hooks/use-translation.ts`)
Hook para internacionalización con soporte para:
- **Interpolación de variables** (ej: `{count}`, `{completed}`)
- **Mensajes de error** localizados
- **Extensibilidad** para múltiples idiomas

## 📦 Servicios API

### ApiService (`/lib/api.ts`)
Clase centralizada para todas las llamadas al backend:

```typescript
// Upload de archivo
ApiService.uploadFile(file: File): Promise<BatchUploadResponse>

// Consultar estado
ApiService.getBatchStatus(batchId: string): Promise<BatchStatus>

// Health check del backend
ApiService.healthCheck(): Promise<boolean>
```

## 🎯 Características Implementadas

### ✅ Manejo de Estado Centralizado
- **Estado reactivo** con React hooks
- **Separación de responsabilidades** por componente
- **Gestión de errores** robusta

### ✅ Comunicación con Backend
- **Axios** para llamadas HTTP
- **FormData** para upload de archivos
- **Manejo de timeouts** y errores de red

### ✅ Polling Inteligente
- **Consultas automáticas** cada 3 segundos
- **Detección automática** de completado/fallo
- **Limpieza de recursos** para evitar memory leaks

### ✅ Experiencia de Usuario
- **Feedback visual** en tiempo real
- **Indicadores de progreso** con porcentajes
- **Manejo de errores** con mensajes claros
- **Botones de retry** para recuperación

### ✅ Tabla de Datos Avanzada
- **TanStack React Table** para funcionalidad completa
- **Búsqueda global** en tiempo real
- **Ordenamiento** por columnas
- **Paginación** configurable

## 🚀 Cómo Usar

### 1. Iniciar la Aplicación
```bash
npm run dev
```

### 2. Flujo de Usuario
1. **Seleccionar archivo CSV** en el FileUploader
2. **Hacer clic en "Process File"** para subir al backend
3. **Observar el progreso** en tiempo real durante el procesamiento
4. **Ver resultados** en la tabla modal cuando se complete

### 3. Manejo de Errores
- Si falla el upload, se mostrará mensaje de error con botón retry
- Si falla el procesamiento, se detendrá el polling automáticamente
- Todos los errores incluyen mensajes descriptivos

## 🔧 Configuración del Backend

La aplicación espera que el backend esté corriendo en:
```
http://localhost:8000
```

### Endpoints Requeridos:
- `POST /api/v1/batches` - Upload de archivos
- `GET /api/v1/batches/{id}` - Estado del batch
- `GET /api/v1/health` - Health check (opcional)

## 📝 Notas de Desarrollo

### Optimizaciones Implementadas
- **useCallback** para evitar re-renders innecesarios
- **Debouncing** en el polling para eficiencia
- **Cleanup automático** de intervalos
- **Manejo de memoria** eficiente

### Extensibilidad
- Fácil adición de nuevos idiomas en `useTranslation`
- Configuración flexible del polling interval
- Arquitectura modular para nuevas funcionalidades

## 🎨 Tecnologías Utilizadas

- **React 18** con hooks modernos
- **TypeScript** para type safety
- **Next.js 15** como framework
- **Tailwind CSS** para styling
- **shadcn/ui** para componentes
- **Axios** para HTTP requests
- **TanStack React Table** para tablas avanzadas
- **Lucide React** para iconos

---

## 👨‍💻 Implementado por el Equipo Frontend

Esta implementación transforma completamente la aplicación de estática a funcional, siguiendo las mejores prácticas de React y proporcionando una experiencia de usuario robusta y profesional.