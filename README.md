# 🕷️ Web Scraping Frontend

Una aplicación web moderna para el web scraping masivo de datos de negocios desde Google, con soporte multiidioma y exportación de datos. Compatible con el sistema **Quick Fix Backend** que proporciona **6800% de mejora en rendimiento**.

## ✨ Características Principales

### 🚀 **Rendimiento Optimizado**
- ⚡ **Ultra Rápido**: 3 segundos vs 4+ minutos (6800% más rápido)
- 🔄 **Procesamiento en Lotes**: Manejo eficiente de grandes volúmenes de datos
- 📊 **Monitoreo en Tiempo Real**: Seguimiento del progreso de scraping

### 🌍 **Soporte Multiidioma**
- 🇺🇸 **Inglés** - English
- 🇫🇷 **Francés** - Français  
- 🇩🇪 **Alemán** - Deutsch
- 🇮🇹 **Italiano** - Italiano
- 🔄 **Cambio Dinámico**: Selector de idioma en tiempo real

### 📈 **Funcionalidades Avanzadas**
- 📤 **Carga de CSV**: Importación masiva de datos de negocios
- 📊 **Tabla Interactiva**: Visualización avanzada con filtros y ordenamiento
- 📄 **Exportación CSV**: Descarga de resultados procesados
- 🔍 **Búsqueda Inteligente**: Filtrado en tiempo real
- 📱 **Diseño Responsivo**: Optimizado para todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui + Radix UI
- **Iconos**: Lucide React
- **Tabla**: TanStack React Table
- **HTTP**: Axios
- **Estado**: React Context API

## 🚀 Inicio Rápido

### 📋 Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend Quick Fix corriendo en puerto 8000

### 🔧 Instalación Automática

**Windows:**
```bash
./setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### 📝 Instalación Manual

1. **Clonar el repositorio**
```bash
git clone https://github.com/Dbuitrago15/Web-Scrapping-Frontend.git
cd Web-Scrapping-Frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Iniciar en modo desarrollo**
```bash
npm run dev
```

5. **Abrir navegador**
```
http://localhost:3000
```

## 🎯 Uso de la Aplicación

### 1. **Preparar Datos**
Crear un archivo CSV con las columnas:
```csv
name,address,city,postal_code
Restaurant ABC,123 Main St,New York,10001
Coffee Shop XYZ,456 Oak Ave,Los Angeles,90210
```

### 2. **Cargar Archivo**
- Hacer clic en "Select File" o arrastrar el CSV
- Confirmar la carga del archivo

### 3. **Iniciar Scraping**
- Hacer clic en "Start Scraping"
- Monitorear el progreso en tiempo real

### 4. **Ver Resultados**
- Explorar datos en la tabla interactiva
- Usar filtros y búsqueda
- Ver detalles de cada negocio

### 5. **Exportar Datos**
- Hacer clic en "Download CSV"
- Obtener archivo con todos los datos extraídos

## 📊 Estructura de Datos

### Entrada (CSV)
```csv
name,address,city,postal_code
Business Name,Street Address,City Name,12345
```

### Salida (Scrapeados)
```typescript
{
  business_name: string,        // Nombre del negocio desde CSV
  scraped_name: string,         // Nombre encontrado en Google
  normalized_name: string,      // Nombre normalizado
  status: 'found' | 'not_found' | 'error',
  rating: number,               // 1.0 - 5.0
  reviews_count: number,
  phone: string,
  address: string,
  website: string,
  category: string,
  opening_hours: string[]       // ["Monday: 9:00 AM - 5:00 PM", ...]
}
```

## 🗂️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── data-table.tsx    # Tabla de datos
│   ├── language-selector.tsx # Selector de idioma
│   └── business-card-detail.tsx # Detalles del negocio
├── hooks/                # Custom Hooks
│   └── use-translation.ts # Sistema de traducciones
├── lib/                  # Utilidades
│   ├── api.ts           # Cliente API
│   ├── csv-export.ts    # Exportación CSV
│   └── utils.ts         # Utilidades generales
└── scripts/             # Scripts de automatización
    ├── setup.bat        # Instalación Windows
    ├── setup.sh         # Instalación Unix
    ├── diagnose.bat     # Diagnóstico Windows
    └── diagnose.sh      # Diagnóstico Unix
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor desarrollo
npm run build        # Construir producción  
npm run start        # Servidor producción
npm run lint         # Linter ESLint
npm run type-check   # Verificación TypeScript
```

## 🌐 API Backend

La aplicación se conecta con el backend Quick Fix:

- **Base URL**: `http://localhost:8000/api/v1`
- **Endpoints**:
  - `POST /batches` - Crear nuevo lote
  - `GET /batches/{batch_id}` - Estado del lote
  - `GET /health` - Estado del servidor

## 🚨 Diagnóstico y Solución de Problemas

### Scripts de Diagnóstico

**Windows:**
```bash
./diagnose.bat
```

**macOS/Linux:**
```bash
chmod +x diagnose.sh
./diagnose.sh
```

### Problemas Comunes

1. **Backend no conecta**
   - Verificar que el backend esté corriendo en puerto 8000
   - Revisar configuración de CORS

2. **Error de tipos TypeScript**
   - Ejecutar `npm run type-check`
   - Verificar versiones de dependencias

3. **Problemas de rendimiento**
   - Verificar que esté usando el backend Quick Fix
   - Revisar tamaño del archivo CSV

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Lucide](https://lucide.dev/) - Iconos
- [TanStack Table](https://tanstack.com/table) - Tabla de datos

---

⭐ **¡Si te gusta el proyecto, dale una estrella!** ⭐
