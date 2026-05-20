# Diseño Técnico Frontend — SYNTHNODE (Migración Next.js)

> Versión: 1.0
> Fecha: 2026-05-19
> Basado en: `docs/specs/00 - Migrate nextjs/requirements_nextjs.md` + `cod_style.md`

---

## 1. Resumen del Proyecto

**Problema**: SYNTHNODE corre sobre TanStack Start + Cloudflare Workers. El stack es no estándar, complejo de mantener y dificulta incorporar nuevos desarrolladores.

**Solución**: Migrar a Next.js 15 App Router. Mismo producto, mismo contenido, mismo diseño visual. Zero feature regression.

**Alcance**: Migración 1:1 de las 4 rutas existentes (`/`, `/news/[slug]`, `/category/[slug]`, `/search`) al App Router de Next.js. Incluye i18n (es/en), robots.txt, sitemap.xml y ads.txt. No incluye backend ni base de datos.

---

## 2. Objetivos del Frontend

1. `next build` sin errores ni warnings críticos.
2. TTFB < 200ms en páginas SSG.
3. Lighthouse SEO > 95 en todas las rutas públicas.
4. Lighthouse Performance > 90.
5. WCAG 2.1 AA — navbar y toggle de tema accesibles por teclado.
6. i18n ES (default) + EN desde día 1. Añadir locales sin refactoring.
7. Zero texto hardcoded en componentes.
8. `npm run type-check` → 0 errores. TypeScript strict.

---

## 3. Stack Tecnológico

| Tecnología                  | Versión           | Por qué                                              |
| --------------------------- | ----------------- | ---------------------------------------------------- |
| Next.js                     | 15.x (App Router) | SSG/SSR nativos, generateMetadata, Server Components |
| React                       | 19.x              | Versión ya usada en el proyecto                      |
| TypeScript                  | 5.8 strict        | Ya configurado; mantener consistencia                |
| next-intl                   | 3.x               | i18n con App Router, SSR/SSG, tipos estrictos        |
| Tailwind CSS                | 4.x               | Ya configurado; CSS-first, sin tailwind.config.js    |
| shadcn/ui                   | latest            | Ya presente (46 componentes); actualizar rsc: true   |
| Framer Motion               | 12.x              | Ya usado en NewsCard y FeaturedHero; mantener        |
| Fuse.js                     | 7.x               | Búsqueda fuzzy client-side; mantener                 |
| next-themes                 | 0.4.x             | Ya en el proyecto; compatible con Next.js App Router |
| react-markdown + remark-gfm | latest            | Renderizado de artículos en markdown; mantener       |
| zod                         | 3.x               | Validación de search params; mantener                |
| react-hook-form             | 7.x               | Newsletter form; mantener                            |
| Vitest + Testing Library    | latest            | Tests unitarios y de componentes                     |
| Playwright                  | latest            | Tests E2E                                            |

**Dependencias eliminadas**: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/router-plugin`, `@cloudflare/vite-plugin`, `@lovable.dev/vite-tanstack-config`, `vite`, `wrangler`.

---

## 4. Internacionalización (i18n)

### 4.1 Locales

| Locale  | Idioma             | Estado     | URL base          |
| ------- | ------------------ | ---------- | ----------------- |
| `es`    | Español            | Default    | `/` (sin prefijo) |
| `en`    | English            | Secundario | `/en`             |
| `pt-BR` | Portugués (Brasil) | Preparado  | `/pt-BR`          |
| `ja`    | Japonés            | Preparado  | `/ja`             |
| `ko`    | Coreano            | Preparado  | `/ko`             |

MVP implementa `es` + `en`. Los demás locales se añaden sin refactoring (solo mensajes + entrada en config).

### 4.2 Routing i18n

**Librería**: `next-intl@3`

```typescript
// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "en", "pt-BR", "ja", "ko"],
  defaultLocale: "es",
  localePrefix: "as-needed", // /es sin prefijo, /en con prefijo
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### 4.3 Estructura de Traducciones

```
messages/
├── es.json   # idioma base — siempre completo
├── en.json
├── pt-BR.json
├── ja.json
└── ko.json
```

**Formato de claves**:

```json
{
  "common": {
    "navigation": {
      "home": "Inicio",
      "search": "Buscar",
      "categories": {
        "ai": "Inteligencia Artificial",
        "programming": "Programación",
        "webDev": "Web Development",
        "devops": "DevOps",
        "startups": "Startups",
        "openSource": "Open Source",
        "security": "Ciberseguridad"
      }
    },
    "actions": {
      "backToHome": "Volver al inicio",
      "retry": "Reintentar",
      "exploreAll": "Explorar todo",
      "filterBy": "FILTER BY:",
      "filterAll": "Todos"
    },
    "errors": {
      "notFound": "Página no encontrada",
      "notFoundDescription": "La ruta que buscas no existe o ha sido movida.",
      "generic": "Algo ha ido mal",
      "genericDescription": "Error inesperado."
    },
    "footer": {
      "tagline": "Publicación independiente sobre IA, programación y la próxima infraestructura.",
      "copyright": "© 2026 SYNTHNODE"
    },
    "meta": {
      "siteName": "SYNTHNODE",
      "siteDescription": "Publicación independiente sobre IA, machine learning, DevOps, ciberseguridad, open source y startups técnicas."
    }
  },
  "home": {
    "meta": {
      "title": "SYNTHNODE — Noticias de IA, programación y la próxima infraestructura",
      "description": "El portal independiente de noticias sobre IA, machine learning, DevOps, ciberseguridad, open source y startups técnicas."
    },
    "sections": {
      "recentLabel": "// RECENT",
      "recentTitle": "Últimas noticias",
      "categoriesLabel": "// SECCIONES"
    }
  },
  "article": {
    "meta": {
      "titleSuffix": "— SYNTHNODE"
    },
    "labels": {
      "minRead": "min read",
      "views": "vistas",
      "likes": "likes",
      "tags": "TAGS",
      "category": "CATEGORÍA"
    }
  },
  "category": {
    "label": "// CATEGORÍA",
    "articles": "{count, plural, one {# artículo} other {# artículos}}",
    "filter": "FILTRAR:",
    "filterAll": "Todos",
    "noArticles": "No hay artículos en esta categoría todavía.",
    "otherTagsLabel": "// OTROS TAGS POPULARES"
  },
  "search": {
    "meta": {
      "title": "Buscar — SYNTHNODE",
      "description": "Búsqueda en tiempo real sobre todo el archivo de SYNTHNODE."
    },
    "label": "// SEARCH",
    "title": "Explora el archivo",
    "subtitle": "Búsqueda fuzzy en tiempo real sobre títulos, descripciones y tags.",
    "placeholder": "Buscar noticias, tags, autores…",
    "results": "{count, plural, one {# resultado} other {# resultados}}",
    "noResults": "Sin resultados. Prueba a quitar filtros o cambiar la búsqueda.",
    "filters": {
      "category": "CATEGORÍA",
      "allCategories": "Todas",
      "tags": "TAGS",
      "allTags": "todos",
      "date": "FECHA",
      "anyTime": "Cualquier momento",
      "last7Days": "Últimos 7 días",
      "last30Days": "Últimos 30 días",
      "last90Days": "Últimos 90 días"
    }
  }
}
```

**Reglas de claves:**

- `camelCase`
- Máx 3 niveles: `[página].[sección].[elemento]`
- Variables: `{variableName}`
- Plurales: `{count, plural, one {# item} other {# items}}`

### 4.4 Uso en Componentes

**Server Component:**

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home');
  return <h1>{t('sections.recentTitle')}</h1>;
}
```

**Client Component:**

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function SearchInput() {
  const t = useTranslations('search');
  return <input placeholder={t('placeholder')} />;
}
```

### 4.5 Rutas Localizadas

| Página    | ES                 | EN                    |
| --------- | ------------------ | --------------------- |
| Home      | `/`                | `/en`                 |
| Artículo  | `/news/[slug]`     | `/en/news/[slug]`     |
| Categoría | `/category/[slug]` | `/en/category/[slug]` |
| Búsqueda  | `/search`          | `/en/search`          |

Los slugs de artículos y categorías no se localizan (son técnicos/kebab-case). Los slugs de categorías son constantes en todos los locales.

### 4.6 Metadata SEO con i18n

```typescript
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${params.locale === "es" ? "/" : `/${params.locale}`}`,
      languages: {
        es: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        en: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
      },
    },
  };
}
```

### 4.7 Hreflang

En `app/[locale]/layout.tsx`:

```tsx
<link rel="alternate" hrefLang="es" href={`${baseUrl}/`} />
<link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
<link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
```

---

## 5. Arquitectura

### 5.1 Rendering por Página

| Página                      | Estrategia                          | Por qué                                                             |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `/[locale]` (Home)          | SSG                                 | Contenido estático (mock-data); sin revalidación necesaria          |
| `/[locale]/news/[slug]`     | SSG + `generateStaticParams`        | SEO crítico; todos los slugs conocidos en build time                |
| `/[locale]/category/[slug]` | SSG + `generateStaticParams`        | SEO; categorías finitas y estáticas                                 |
| `/[locale]/search`          | Client-side (sin SSR de resultados) | Búsqueda fuzzy en tiempo real con Fuse.js; no indexable (`noindex`) |

### 5.2 Flujo de Datos

```
Build time → src/lib/mock-data.ts → generateStaticParams → HTML estático
Runtime   → Client Component Search → Fuse.js (in-memory) → resultados
```

No hay API externa. Toda la data viene de `src/lib/mock-data.ts` (in-memory).

### 5.3 Patrones

- **Server Components por defecto**: Solo añadir `"use client"` cuando sea estrictamente necesario (estado, eventos, hooks de browser).
- **Separación UI/lógica**: Lógica de búsqueda en `src/lib/search.ts`. Componentes solo consumen.
- **Composition pattern**: `SearchPage` = Server Component shell + `SearchClient` Client Component hijo.
- **Error boundaries**: `app/[locale]/error.tsx` + `app/not-found.tsx`.

---

## 6. Estructura de Carpetas

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Layout por locale: next-intl, ThemeProvider, Navbar, Footer
│   │   ├── page.tsx                # Home (SSG, Server Component)
│   │   ├── news/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Artículo (SSG + generateStaticParams)
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Categoría (SSG + generateStaticParams)
│   │   └── search/
│   │       └── page.tsx            # Búsqueda (shell Server + SearchClient)
│   ├── sitemap.ts                  # OBLIGATORIO — dinámico, multilocale
│   ├── robots.ts                   # OBLIGATORIO
│   ├── ads.txt/
│   │   └── route.ts                # OBLIGATORIO — dinámico vía env
│   ├── layout.tsx                  # Root layout (solo html/body/head base)
│   ├── not-found.tsx               # 404 global
│   └── globals.css                 # Tailwind v4 + tokens (de src/styles.css)
├── components/
│   ├── layout/
│   │   ├── navbar.tsx              # "use client" — useState menú móvil, usePathname
│   │   ├── footer.tsx              # Server Component
│   │   └── theme-toggle.tsx        # "use client" — useTheme
│   ├── news/
│   │   ├── featured-hero.tsx       # "use client" — framer-motion
│   │   ├── news-card.tsx           # "use client" — framer-motion (motion.article)
│   │   ├── article-content.tsx     # Server Component (react-markdown)
│   │   ├── table-of-contents.tsx   # Server Component (parse markdown)
│   │   ├── share-bar.tsx           # "use client" — navigator.share / clipboard
│   │   ├── related-articles.tsx    # Server Component
│   │   ├── author-card.tsx         # Server Component
│   │   ├── category-badge.tsx      # Server Component
│   │   └── trending-list.tsx       # Server Component
│   ├── sidebar/
│   │   ├── sidebar.tsx             # Server Component (contenedor)
│   │   └── newsletter-form.tsx     # "use client" — react-hook-form
│   ├── search/
│   │   └── search-client.tsx       # "use client" — Fuse.js, useSearchParams, useState
│   ├── theme-provider.tsx          # "use client" — ThemeProvider next-themes
│   └── ui/                         # shadcn/ui (sin cambios de código)
├── hooks/
│   └── use-mobile.tsx              # "use client" — useEffect + window
├── lib/
│   ├── types.ts                    # Sin cambios
│   ├── mock-data.ts                # Actualizar: imports de imágenes → rutas /news/*
│   ├── search.ts                   # Sin cambios
│   ├── format.ts                   # Sin cambios
│   └── utils.ts                    # Sin cambios
├── middleware.ts                   # next-intl routing
└── messages/
    ├── es.json
    ├── en.json
    ├── pt-BR.json
    ├── ja.json
    └── ko.json

public/
└── news/
    ├── hero-ai.jpg
    ├── rust.jpg
    ├── security.jpg
    ├── startup.jpg
    ├── neural.jpg
    └── devops.jpg
```

---

## 7. Routing y Páginas

### 7.1 Mapa de Rutas

| Ruta ES            | Ruta EN               | Archivo                                 | Tipo   | Indexable      |
| ------------------ | --------------------- | --------------------------------------- | ------ | -------------- |
| `/`                | `/en`                 | `app/[locale]/page.tsx`                 | SSG    | Sí             |
| `/news/[slug]`     | `/en/news/[slug]`     | `app/[locale]/news/[slug]/page.tsx`     | SSG    | Sí             |
| `/category/[slug]` | `/en/category/[slug]` | `app/[locale]/category/[slug]/page.tsx` | SSG    | Sí             |
| `/search`          | `/en/search`          | `app/[locale]/search/page.tsx`          | Client | No (`noindex`) |

### 7.2 Especificación por Página

#### `/[locale]` (Home)

**Propósito**: Portada del portal. Muestra artículo destacado, grid de recientes, filtros por categoría y sidebar.

**Componentes**:

- `<FeaturedHero article={featured} />` — Client (framer-motion)
- `<NewsCard article={a} index={i} />` — Client (framer-motion)
- `<TrendingList items={trending} />` — Server
- `<Sidebar />` — Server (contenedor; `<NewsletterForm />` es Client)

**Datos**:

```typescript
// En page.tsx (Server Component async)
const featured = getFeatured();
const all = getAllNews();
const recent = all.filter((n) => n.slug !== featured.slug).slice(0, 6);
const trending = getTrending(5);
```

**Metadata SEO**:

```typescript
export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description"), url: "/" },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: `${BASE_URL}/`,
      languages: { es: `${BASE_URL}/`, en: `${BASE_URL}/en` },
    },
  };
}
```

**JSON-LD**: `WebSite` + `SearchAction` — inyectado en `app/[locale]/layout.tsx`.

---

#### `/[locale]/news/[slug]`

**Propósito**: Artículo completo con contenido markdown, autor, tags, TOC y artículos relacionados.

**Componentes**:

- `<CategoryBadge slug={article.category} />` — Server
- `<ArticleContent markdown={article.content} />` — Server (react-markdown)
- `<TableOfContents markdown={article.content} />` — Server
- `<ShareBar title={article.title} />` — Client
- `<RelatedArticles articles={related} />` — Server
- `<AuthorCard author={article.author} />` — Server
- `next/image` para imagen principal del artículo

**Datos**:

```typescript
// generateStaticParams
export async function generateStaticParams() {
  return getAllNews().flatMap((article) =>
    ["es", "en"].map((locale) => ({ locale, slug: article.slug })),
  );
}

// page component
const article = getNewsBySlug(params.slug);
if (!article) notFound();
const related = getRelated(article, 3);
```

**Metadata SEO**:

```typescript
export async function generateMetadata({ params }: Props) {
  const article = getNewsBySlug(params.slug);
  if (!article) return {};
  const t = await getTranslations({ locale: params.locale, namespace: "article.meta" });
  return {
    title: `${article.title} ${t("titleSuffix")}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [{ url: `/news/${article.image.split("/").pop()}` }],
    },
    twitter: { card: "summary_large_image", images: [`/news/${article.image.split("/").pop()}`] },
    alternates: {
      canonical: `${BASE_URL}/news/${params.slug}`,
      languages: {
        es: `${BASE_URL}/news/${params.slug}`,
        en: `${BASE_URL}/en/news/${params.slug}`,
      },
    },
  };
}
```

**JSON-LD**: `Article` schema — inyectado vía `<script type="application/ld+json">` en el componente de página.

---

#### `/[locale]/category/[slug]`

**Propósito**: Listado de artículos por categoría con filtro de tags y paginación.

**Componentes**:

- `<NewsCard />` — Client (framer-motion)
- Filtros de tags y paginación: Client Component hijo (`<CategoryClient />`)

**Datos**:

```typescript
export async function generateStaticParams() {
  return categories.flatMap((cat) => ["es", "en"].map((locale) => ({ locale, slug: cat.slug })));
}

const category = getCategoryBySlug(params.slug);
if (!category) notFound();
const articles = getNewsByCategory(params.slug);
```

**Nota**: El estado de filtros (`tag`, `page`) es local a `CategoryClient` (Client Component). No se almacena en URL en esta migración. → `[DECISIÓN]` Mantener paridad con el comportamiento actual.

---

#### `/[locale]/search`

**Propósito**: Búsqueda fuzzy en tiempo real. No indexable.

**Componentes**:

- `<SearchClient />` — Client Component. Contiene: input, filtros de categoría/tag/fecha, resultados con `<NewsCard />`.

**Datos**: Fuse.js sobre `getAllNews()` (in-memory). Toda la lógica en `src/lib/search.ts`.

**Params URL** (leídos con `useSearchParams` en `SearchClient`):

- `q` (string)
- `category` (string, default `"all"`)
- `tag` (string)
- `since` (number | undefined)

**Metadata**:

```typescript
export const metadata: Metadata = {
  title: "Buscar — SYNTHNODE",
  robots: { index: false, follow: false },
};
```

---

## 8. Catálogo de Componentes

### `<Navbar />`

**Ubicación**: `src/components/layout/navbar.tsx`
**Tipo**: Client Component
**Responsabilidad**: Navegación principal, buscador inline, menú móvil, ThemeToggle.

**Props**: ninguna

**Textos i18n**: `common.navigation.categories.*`, `common.actions.search`

**Comportamiento**:

- Menú móvil togglable con `useState`.
- Input de búsqueda: `useRouter` de `next/navigation` para navegar a `/search?q=…`.
- `usePathname` para active links.

**A11y**: `role="banner"`, `role="navigation"`, `aria-label="Menú principal"`, `aria-label="Abrir menú"`.

---

### `<Footer />`

**Ubicación**: `src/components/layout/footer.tsx`
**Tipo**: Server Component
**Responsabilidad**: Pie de página con links de categorías y tagline.

**Props**: ninguna

**Textos i18n**: `common.footer.*`, `common.navigation.categories.*`

---

### `<ThemeToggle />`

**Ubicación**: `src/components/layout/theme-toggle.tsx`
**Tipo**: Client Component
**Responsabilidad**: Alternar tema claro/oscuro.

**Props**: ninguna

**Comportamiento**: `useTheme()` de `next-themes`. Renderiza icono Sol/Luna.

**A11y**: `aria-label` con texto traducido.

---

### `<FeaturedHero />`

**Ubicación**: `src/components/news/featured-hero.tsx`
**Tipo**: Client Component (framer-motion)
**Responsabilidad**: Artículo destacado con animación de entrada.

**Props**:

```typescript
interface FeaturedHeroProps {
  article: NewsArticle;
}
```

**Textos i18n**: ninguno propio (datos del artículo).

---

### `<NewsCard />`

**Ubicación**: `src/components/news/news-card.tsx`
**Tipo**: Client Component (framer-motion `motion.article`)
**Responsabilidad**: Tarjeta de artículo con imagen, badge de categoría, título, excerpt y autor.

**Props**:

```typescript
interface NewsCardProps {
  article: NewsArticle;
  size?: "sm" | "md"; // default: 'md'
  index?: number; // default: 0, usado para delay de animación
}
```

**Textos i18n**: `article.labels.minRead`

---

### `<ArticleContent />`

**Ubicación**: `src/components/news/article-content.tsx`
**Tipo**: Server Component
**Responsabilidad**: Renderizar contenido markdown del artículo.

**Props**:

```typescript
interface ArticleContentProps {
  markdown: string;
}
```

---

### `<SearchClient />`

**Ubicación**: `src/components/search/search-client.tsx`
**Tipo**: Client Component
**Responsabilidad**: Input de búsqueda, filtros (categoría, tag, fecha), listado de resultados.

**Props**:

```typescript
interface SearchClientProps {
  initialQ?: string;
  initialCategory?: string;
  initialTag?: string;
  initialSince?: number;
}
```

**Textos i18n**: `search.*`

**Comportamiento**:

- Lee params iniciales desde `useSearchParams`.
- Debounce 200ms en input → actualiza URL con `router.replace`.
- Fuse.js sobre `getAllNews()`.

---

### `<NewsletterForm />`

**Ubicación**: `src/components/sidebar/newsletter-form.tsx`
**Tipo**: Client Component
**Responsabilidad**: Formulario de suscripción al newsletter.

**Props**: ninguna

**Textos i18n**: _(claves a definir en Fase 2)_

**Comportamiento**: `react-hook-form` + `zod`. Submit → toast de confirmación (sonner).

---

### `<CategoryClient />`

**Ubicación**: `src/components/news/category-client.tsx`
**Tipo**: Client Component (nuevo — extraído de la lógica de filtros)
**Responsabilidad**: Filtros de tags y paginación en la página de categoría.

**Props**:

```typescript
interface CategoryClientProps {
  articles: NewsArticle[];
}
```

**Comportamiento**: Estado local para `tag` y `page`. Sin sincronización con URL (paridad con comportamiento actual).

---

## 9. Gestión de Estado

| Estado                      | Alcance             | Tecnología                       | Ubicación                 |
| --------------------------- | ------------------- | -------------------------------- | ------------------------- |
| Locale activo               | Global              | next-intl auto                   | middleware                |
| Tema claro/oscuro           | Global persistido   | next-themes                      | `ThemeProvider` en layout |
| Menú móvil                  | Local               | useState                         | `Navbar`                  |
| Búsqueda query              | URL params          | useSearchParams + router.replace | `SearchClient`            |
| Filtros categoría/tag/fecha | URL params (search) | useSearchParams                  | `SearchClient`            |
| Filtro tag categoría        | Local               | useState                         | `CategoryClient`          |
| Paginación categoría        | Local               | useState                         | `CategoryClient`          |
| Newsletter form             | Local               | react-hook-form                  | `NewsletterForm`          |

No se usa Redux ni Zustand. Estado global mínimo. → `cod_style.md §4`: preferir estado local.

---

## 10. Fetching de Datos

No hay fetch de red. Toda la data es síncrona desde `src/lib/mock-data.ts`.

### 10.1 Funciones de datos (sin cambios)

```typescript
// src/lib/mock-data.ts — funciones existentes, sin modificar
getFeatured(): NewsArticle
getAllNews(): NewsArticle[]
getNewsBySlug(slug: string): NewsArticle | undefined
getNewsByCategory(slug: string): NewsArticle[]
getCategoryBySlug(slug: string): Category | undefined
getTrending(n: number): NewsArticle[]
getAllTags(): { tag: string; count: number }[]
getRelated(article: NewsArticle, n: number): NewsArticle[]
```

### 10.2 Imágenes

Las imágenes se mueven de `src/assets/news/*.jpg` a `public/news/*.jpg`.

En `mock-data.ts`, cambiar imports estáticos de Vite por rutas absolutas:

```typescript
// Antes (Vite)
import heroAi from "@/assets/news/hero-ai.jpg";
// image: heroAi,

// Después (Next.js)
// image: "/news/hero-ai.jpg",
```

---

## 11. SEO

### 11.1 Metadata por Página

| Página             | `title` (ES)                                                            | `robots`            |
| ------------------ | ----------------------------------------------------------------------- | ------------------- |
| `/`                | `SYNTHNODE — Noticias de IA, programación y la próxima infraestructura` | `index, follow`     |
| `/news/[slug]`     | `{article.title} — SYNTHNODE`                                           | `index, follow`     |
| `/category/[slug]` | `{category.name} — SYNTHNODE`                                           | `index, follow`     |
| `/search`          | `Buscar — SYNTHNODE`                                                    | `noindex, nofollow` |

### 11.2 JSON-LD

- `app/[locale]/layout.tsx` → `WebSite` schema (nombre, descripción del sitio)
- `app/[locale]/news/[slug]/page.tsx` → `Article` schema (headline, description, image, datePublished, author)

### 11.3 Hreflang

Todas las páginas públicas incluyen:

```html
<link rel="alternate" hreflang="es" href="https://[dominio]/[ruta-es]" />
<link rel="alternate" hreflang="en" href="https://[dominio]/en/[ruta-en]" />
<link rel="alternate" hreflang="x-default" href="https://[dominio]/[ruta-es]" />
```

---

## 12. robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://synthnode.dev";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      { userAgent: "Googlebot", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

**Test**: `curl localhost:3000/robots.txt` → 200, contiene `Sitemap:`.

---

## 13. sitemap.xml

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllNews, categories } from "@/lib/mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://synthnode.dev";
const LOCALES = ["es", "en"] as const;

function localePath(locale: string, path: string) {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFreq: "daily" as const },
    { path: "/search", priority: 0.3, changeFreq: "monthly" as const },
  ];

  const categoryRoutes = categories.map((c) => ({
    path: `/category/${c.slug}`,
    priority: 0.7,
    changeFreq: "weekly" as const,
  }));

  const articleRoutes = getAllNews().map((a) => ({
    path: `/news/${a.slug}`,
    priority: 0.8,
    changeFreq: "monthly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes].flatMap((route) =>
    LOCALES.map((locale) => ({
      url: localePath(locale, route.path),
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l, route.path)])),
      },
    })),
  );
}
```

**Test**: `curl localhost:3000/sitemap.xml | grep -c "<url>"` → ≥ 34 (17 rutas × 2 locales).

---

## 14. ads.txt

```typescript
// src/app/ads.txt/route.ts
import { NextResponse } from "next/server";

export function GET() {
  const content = process.env.ADS_TXT_CONTENT ?? "";
  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

**Env var**: `ADS_TXT_CONTENT=` en `.env.local` y `.env.example`.

**Test**: `curl localhost:3000/ads.txt` → 200.

---

## 15. Performance

### 15.1 Métricas Objetivo

| Métrica                | Target  |
| ---------------------- | ------- |
| LCP                    | < 2.5s  |
| CLS                    | < 0.1   |
| INP                    | < 100ms |
| Lighthouse Performance | > 90    |
| Lighthouse SEO         | > 95    |

### 15.2 Optimizaciones

| Técnica                                         | Aplicación                                             | Impacto esperado        |
| ----------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| `next/image`                                    | `app/[locale]/news/[slug]/page.tsx` (imagen principal) | Reducir CLS + LCP       |
| `loading="lazy"` en `<img>` de NewsCard         | Ya presente; mantener                                  | Reducir TTI             |
| SSG para todas las páginas públicas             | Home, artículos, categorías                            | TTFB < 200ms            |
| Bundle splitting                                | `SearchClient` solo carga en `/search`                 | Reducir bundle inicial  |
| `next/font` para Space Grotesk + JetBrains Mono | `app/layout.tsx`                                       | Eliminar CLS de fuentes |

---

## 16. Estilos

### 16.1 Configuración

Tailwind CSS v4 — CSS-first. No existe `tailwind.config.js`. Toda la configuración está en `globals.css` (migrado desde `src/styles.css`).

```css
/* src/app/globals.css */
@import "tailwindcss";
@source "../components/**/*.tsx";
@source "../app/**/*.tsx";

@theme inline {
  /* tokens existentes de src/styles.css — sin cambios */
}
```

### 16.2 Convenciones (`cod_style.md §2`)

- Clases Tailwind directamente en JSX. Sin CSS inline. Sin CSS Modules (no necesarios con Tailwind v4).
- Utilidad `cn()` de `src/lib/utils.ts` (clsx + tailwind-merge) para clases condicionales.
- Variantes de componentes con `class-variance-authority` (CVA) cuando hay 3+ variantes.

---

## 17. Accesibilidad

### 17.1 Requisitos por Componente

| Componente                    | Requisitos A11y                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `<Navbar />`                  | `role="banner"`, `<nav role="navigation" aria-label="Menú principal">`, `aria-expanded` en menú móvil |
| `<ThemeToggle />`             | `aria-label="Cambiar tema"` actualizado por locale                                                    |
| `<SearchClient />`            | `role="search"`, label visible, `aria-live="polite"` en contador de resultados                        |
| `<NewsCard />`                | Imagen con `alt` descriptivo, link de título descriptivo                                              |
| `<Navbar />` — input búsqueda | `aria-label="Buscar noticias"`                                                                        |

### 17.2 Target

WCAG 2.1 AA. Verificar con axe DevTools y teclado manual.

---

## 18. Gestión de Errores

### 18.1 Error Boundaries

```
app/layout.tsx (root)
└── app/[locale]/layout.tsx
    ├── app/[locale]/error.tsx       # Error de renderizado en páginas
    └── app/not-found.tsx            # 404 global
```

### 18.2 Tipos de Error

| Tipo                 | Componente                 | Acción                               |
| -------------------- | -------------------------- | ------------------------------------ |
| Ruta no encontrada   | `app/not-found.tsx`        | Mensaje i18n + link a home           |
| Slug inválido        | `notFound()` en page.tsx   | Redirige a `not-found.tsx`           |
| Error de renderizado | `app/[locale]/error.tsx`   | Botón "Reintentar" + mensaje i18n    |
| Form validation      | Inline en `NewsletterForm` | Mensaje bajo campo (react-hook-form) |

Todos los mensajes de error usan i18n. Sin texto hardcoded.

---

## 19. Variables de Entorno

```bash
# .env.local y .env.example
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADS_TXT_CONTENT=
```

---

## 20. Testing

### 20.1 Estrategia

| Nivel     | Tool                        | Target         | Qué testear                                     |
| --------- | --------------------------- | -------------- | ----------------------------------------------- |
| Unit      | Vitest                      | utils, lib     | `formatDate`, `searchNews`, `getFeatured`       |
| Component | Testing Library + next-intl | > 70%          | Render correcto, textos i18n, interacciones     |
| E2E       | Playwright                  | Rutas críticas | Navegación, búsqueda, cambio de tema, SEO files |

### 20.2 Wrapper i18n para Tests

```typescript
// tests/utils/intl-wrapper.tsx
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/es.json';

export const IntlWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="es" messages={messages}>
    {children}
  </NextIntlClientProvider>
);
```

### 20.3 Tests SEO (Playwright)

```typescript
// e2e/seo.spec.ts
test("robots.txt", async ({ page }) => {
  const r = await page.goto("/robots.txt");
  expect(r?.status()).toBe(200);
  expect(await page.textContent("body")).toContain("User-agent");
});
test("sitemap.xml", async ({ page }) => {
  const r = await page.goto("/sitemap.xml");
  expect(r?.status()).toBe(200);
  expect(await page.textContent("body")).toContain("<url>");
});
test("ads.txt", async ({ page }) => {
  const r = await page.goto("/ads.txt");
  expect(r?.status()).toBe(200);
});
```

---

## 21. Decisiones Técnicas

| Decisión                     | Alternativas               | Elegida                        | Por qué                                                        |
| ---------------------------- | -------------------------- | ------------------------------ | -------------------------------------------------------------- |
| i18n                         | react-i18next, lingui      | next-intl                      | Integración nativa App Router; SSR/SSG; tipos estrictos        |
| Deploy                       | Cloudflare, AWS            | Vercel                         | `cod_style.md §9`; zero config con Next.js                     |
| Estado global                | Redux, Zustand, Context    | ninguno                        | Toda la data es estática; estado local suficiente              |
| Slugs localizados            | `/es/noticias/[slug]`      | `/news/[slug]` (sin localizar) | Slugs son técnicos; paridad con URLs actuales; evita redirects |
| CategoryClient vs URL params | Sincronizar filtros en URL | Estado local                   | Paridad con comportamiento actual; `search` ya usa URL         |
| Framer Motion en NewsCard    | CSS animations             | Mantener framer-motion         | Ya integrado; paridad visual                                   |

---

## 22. Fuera de Alcance

- Backend API / base de datos — el proyecto usa mock-data; no se introduce persistencia.
- CMS — `[OUT OF SCOPE]`
- Autenticación — `[OUT OF SCOPE]`
- Dashboard de administración — `[OUT OF SCOPE]`
- Despliegue en Cloudflare Workers — se migra a Vercel; Cloudflare queda fuera.
- Locales pt-BR, ja, ko — estructura lista desde día 1; traducción del contenido fuera del MVP.
- Monetización real (ads) — `ads.txt` preparado vía env var; integración real fuera de alcance.
