# ⚡ Autofolio - Portafolio Dinámico con LinkedIn & GitHub

![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Apify](https://img.shields.io/badge/Apify-Scraper-00A67E?style=for-the-badge&logo=apify&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

**Autofolio** es una plataforma de portafolio web moderna, ultra rápida y automatizada. Sincroniza los datos profesionales de **LinkedIn** (titular, biografía completa, habilidades, foto HD y ubicación) y los proyectos de **GitHub** mediante archivos de especificación **`autofolio.yaml`** y documentación en Markdown.

---

## ✨ Características Principales

- 💼 **Extracción de Perfil de LinkedIn (Sin Cookies)**: Integración con Apify Cloud (`harvestapi/linkedin-profile-scraper`) para extraer automáticamente tu titular, biografía multi-párrafo, habilidades, ubicación y foto de alta resolución sin exponer contraseñas ni cookies.
- 🐙 **Showcase de Repositorios de GitHub**: Inspecciona tus repositorios públicos y renderiza como proyectos aquellos que contengan un archivo `autofolio.yaml`.
- ⚡ **Carga Instantánea y Cero Rate Limits**: Los datos se compilan de forma estática en `src/data/profile.json` y `src/data/repositories.json`, logrando tiempos de carga inmediatos y sin llamadas lentas de API en el cliente.
- 🔍 **Búsqueda & Filtrado por Tags**: Buscador en tiempo real y filtrado interactivo por etiquetas y tecnologías.
- 🎨 **Preview Modal con Markdown**: Modal interactivo para visualizar la documentación completa del proyecto (`README.md`), imágenes de la galería y enlaces a demos en vivo.
- 🤖 **Actualización Automática Mensual**: GitHub Action programado para sincronizar perfil y repositorios el 1 de cada mes.
- 🚀 **Despliegue Continuo**: Integración con GitHub Pages (`.github/workflows/deploy.yml`) con Node 22.

---

## 📁 Estructura del Proyecto

```plaintext
Autofolio/
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Despliegue automático en GitHub Pages
│       └── update-profile.yml         # Sincronización mensual de datos (día 1 de cada mes)
├── scripts/
│   └── fetch-data.ts                  # Script CLI para sincronizar LinkedIn y GitHub
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                 # Barra de navegación con accesos y contador
│   │   ├── HeroSection.tsx            # Hero con perfil de LinkedIn y llamadas a la acción
│   │   ├── ProjectGrid.tsx            # Cuadrícula responsive de tarjetas de proyectos
│   │   ├── ProjectCard.tsx            # Tarjeta individual con badges, tags y métricas
│   │   ├── ProjectPreviewModal.tsx    # Modal interactivo con visor de Markdown
│   │   ├── ContactSection.tsx         # Sección de contacto y enlaces
│   │   └── Footer.tsx                 # Pie de página
│   ├── config/
│   │   └── portfolioConfig.ts         # Configuración de usuarios y overrides manuales
│   ├── data/
│   │   ├── profile.json               # Datos cacheados del perfil de LinkedIn
│   │   └── repositories.json          # Datos cacheados de los proyectos de GitHub
│   ├── services/
│   │   └── githubService.ts           # Parsers YAML y utilidades de GitHub
│   ├── types.ts                       # Tipos TypeScript de la aplicación
│   ├── App.tsx                        # Componente principal
│   └── main.tsx                       # Punto de entrada
├── autofolio.yaml                     # Configuración del proyecto para el showcase
├── .env.example                       # Plantilla de variables de entorno
├── package.json
└── vite.config.ts
```

---

## 🛠️ Cómo Configurar Proyectos (`autofolio.yaml`)

Para que cualquier repositorio público aparezca automáticamente en tu portafolio, crea un archivo **`autofolio.yaml`** en la raíz de ese repositorio:

```yaml
title: "Nombre del Proyecto"
description: "Breve descripción de 1-2 oraciones para la tarjeta del portafolio."
badge: "⭐ Proyecto Destacado"
status: "Completado"
tags:
  - "React 19"
  - "TypeScript"
  - "Tailwind CSS"
images:
  - "assets/preview.png"
  - "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
publicUrl: "https://mi-demo-en-vivo.com"
```

> **Nota**: El contenido del archivo `README.md` del repositorio se utilizará automáticamente como la documentación detallada dentro del **Preview Modal**.

---

## ⚙️ Configuración del Perfil (`src/config/portfolioConfig.ts`)

Define los usuarios de tus cuentas:

```typescript
export const githubUsername = 'LucasFerrenti';
export const linkedinUsername = 'ferrenti-lucas';

// Opcional: Sobredefinir manualmente algún campo si lo deseas
export const configOverride = {
  profile: {
    name: '',       // Dejar vacío para usar LinkedIn dinámico
    headline: '',   // Dejar vacío para usar LinkedIn dinámico
    summary: '',    // Dejar vacío para usar LinkedIn dinámico
    email: 'lukasferrenti@hotmail.com',
  }
};
```

---

## 🔐 Variables de Entorno (`.env`)

Crea tu archivo `.env` a partir de `.env.example`:

```env
# Apify API Token para extracción directa de LinkedIn (sin cookies)
APIFY_API_TOKEN="apify_api_XXXXXXXXXXXX"

# GitHub Personal Access Token (opcional, para 5,000 req/hora en local)
GITHUB_TOKEN=""
```

---

## 🚀 Comandos Disponibles

### 1. Sincronizar datos (LinkedIn & GitHub)
Descarga y genera `src/data/profile.json` y `src/data/repositories.json`:
```bash
npm run fetch-data
```

### 2. Iniciar en modo desarrollo
```bash
npm run dev
```
Abre `http://localhost:3000` en tu navegador.

### 3. Compilar para producción
```bash
npm run build
```

### 4. Vista previa de producción
```bash
npm run preview
```

---

## 🤖 Automatización en GitHub Actions

### 1. Sincronización Automática de Datos (`.github/workflows/update-profile.yml`)
- Se ejecuta automáticamente el **1 de cada mes a las 00:00 UTC** o de forma manual desde la pestaña **Actions**.
- Ejecuta `scripts/fetch-data.ts` y hace commit automático de `src/data/profile.json` y `src/data/repositories.json`.

#### Configuración de Secretos en GitHub:
1. Ve a tu repositorio en GitHub $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
2. Haz clic en **New repository secret**:
   - **Name**: `APIFY_API_TOKEN`
   - **Secret**: Tu token de Apify (`apify_api_...`)

### 2. Despliegue Automático en GitHub Pages (`.github/workflows/deploy.yml`)
- Se dispara automáticamente al hacer `push` a la rama `main` o `master`.
- Compila la aplicación con **Node 22** y publica el directorio `dist` en GitHub Pages.

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
