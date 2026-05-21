# Diseño Técnico Frontend — SYNTHNODE

> Versión: 1.0
> Fecha: 2026-05-21
> Basado en: análisis funcional del módulo actual + cod_style.md + generate-design.md

---

## 1. Resumen del Proyecto

**Problema**: Portal de noticias tecnológicas con i18n incompleta — ~60% de componentes tiene texto hardcoded en español. Fechas siempre en locale `es-ES`. Filtros incompletos. Dead code de migración previa. Formulario newsletter sin validación robusta.

**Solución**: Completar i18n en todos los componentes, implementar locale-aware date formatting, añadir filtro de fecha en búsqueda, filtros en página de categoría, newsletter con react-hook-form+zod+sonner, eliminar dead code, añadir categorías faltantes en nav, e inyectar correctamente JSON-LD WebSite.

**Alcance**: Refactoring y completado del módulo existente. Sin cambio de stack. Sin nuevas páginas. Sin migración de contenido a otro idioma (contenido de mock-data permanece en español — out of scope).

---

## 2. Objetivos del Frontend

1. Cero texto hardcoded en cualquier componente — 100% vía i18n
2. Fechas y tiempos relativos locale-aware (es/en)
3. Formulario newsletter con react-hook-form + zod + sonner
4. Filtro de fecha en SearchClient
5. Filtro de tags en CategoryClient (client-side)
6. Nav muestra las 7 categorías completas
7. JSON-LD WebSite inyectado correctamente en locale layout
8. Dead code eliminado (error-capture.ts, error-page.ts)
9. `@playwright/test` en package.json devDependencies
10. `rehype-autolink-headings` activo en ArticleContent
11. Lighthouse SEO > 95 mantenido
12. `npm run type-check` + `npm run lint` sin errores tras cambios

---

## 3. Stack Tecnológico

| Tecnología               | Versión actual       | Estado                                      |
| ------------------------ | -------------------- | ------------------------------------------- |
| Next.js                  | ^15.0.0 (App Router) | Sin cambio                                  |
| React                    | ^19.2.0              | Sin cambio                                  |
| TypeScript               | ^5.8.3               | Sin cambio                                  |
| next-intl                | ^3.26.5              | Sin cambio — completar uso                  |
| next-themes              | ^0.4.6               | Sin cambio                                  |
| framer-motion            | ^12.38.0             | Sin cambio                                  |
| fuse.js                  | ^7.3.0               | Sin cambio                                  |
| react-markdown           | ^10.1.0              | Sin cambio                                  |
| react-hook-form          | ^7.71.2              | Instalado — activar en NewsletterForm       |
| zod                      | ^3.24.2              | Instalado — activar en NewsletterForm       |
| sonner                   | ^2.0.7               | Instalado — activar en NewsletterForm       |
| date-fns                 | ^4.1.0               | Instalado — activar para locale-aware dates |
| Tailwind CSS             | ^3.4.19              | Sin cambio                                  |
| shadcn/ui (`rsc: false`) | componentes ui/      | Sin cambio                                  |

**No se añaden dependencias nuevas.** Todo lo necesario ya está instalado.

---

## 4. Internacionalización (i18n)

> Obligatorio. Cero hardcoded.

### 4.1 Locales

| Locale  | Idioma       | Estado                        | URL base |
| ------- | ------------ | ----------------------------- | -------- |
| `es`    | Español      | Default activo                | `/`      |
| `en`    | English      | Secundario activo             | `/en`    |
| `pt-BR` | Portugués BR | Scaffolded (out of scope MVP) | `/pt-BR` |
| `ja`    | Japonés      | Scaffolded (out of scope MVP) | `/ja`    |
| `ko`    | Coreano      | Scaffolded (out of scope MVP) | `/ko`    |

Locales pt-BR, ja, ko: no implementar contenido. Scaffoldear únicamente `messages/` vacíos y añadirlos al array de locales en middleware para no bloquear futuras implementaciones.

### 4.2 Routing i18n

Sin cambios en `src/middleware.ts` para es/en. Añadir pt-BR, ja, ko al array.

```typescript
// src/middleware.ts — locales actualizados
createMiddleware({
  locales: ["es", "en", "pt-BR", "ja", "ko"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});
```

### 4.3 Estructura de Traducciones

```
src/messages/
├── es.json     # Completo — idioma base
├── en.json     # Completo — traducción
├── pt-BR.json  # Scaffold vacío: {}
├── ja.json     # Scaffold vacío: {}
└── ko.json     # Scaffold vacío: {}
```

### 4.4 Claves Nuevas Requeridas

Las siguientes claves NO existen actualmente y deben añadirse a `es.json` y `en.json`:

```json
{
  "common": {
    "navigation": {
      "openMenu": "Abrir menú",
      "closeMenu": "Cerrar menú",
      "allCategories": "Todas las categorías"
    },
    "theme": {
      "toggle": "Cambiar tema"
    },
    "footer": {
      "platformLabel": "Plataforma",
      "connectLabel": "Conecta",
      "newsletterLink": "Newsletter",
      "rssLink": "RSS Feed",
      "twitterLink": "Twitter",
      "githubLink": "GitHub"
    }
  },
  "article": {
    "toc": {
      "title": "En este artículo"
    },
    "share": {
      "label": "Compartir",
      "twitter": "Compartir en X",
      "linkedin": "Compartir en LinkedIn",
      "copyLink": "Copiar enlace",
      "copied": "Enlace copiado"
    },
    "related": {
      "title": "Relacionados"
    }
  },
  "trending": {
    "title": "Trending",
    "reads": "lecturas"
  },
  "sidebar": {
    "toolbench": {
      "title": "IA Toolbench"
    },
    "tags": {
      "title": "Core Tags"
    }
  },
  "search": {
    "loadingFallback": "Cargando…"
  }
}
```

**Claves existentes sin usar** (ya están definidas, solo falta consumirlas):

- `common.theme.toggle` → `ThemeToggle` aria-label
- `article.labels.minRead` → `FeaturedHero`, `NewsCard`
- `newsletter.*` → `NewsletterForm` todos los textos
- `search.placeholder` → `SearchClient` input
- `search.results` → `SearchClient` contador
- `search.noResults` → `SearchClient` mensaje vacío
- `home.meta.title`, `home.meta.description` → `generateMetadata` en home/page.tsx
- `search.meta.title`, `search.meta.description` → `generateMetadata` en search/page.tsx
- `common.errors.*` → `error.tsx` y `not-found.tsx`
- `category.articles` (ICU plural) → `category/[slug]/page.tsx`

### 4.5 Rutas Localizadas (sin cambios)

| Página    | ES                 | EN                    |
| --------- | ------------------ | --------------------- |
| Home      | `/`                | `/en`                 |
| Artículo  | `/news/[slug]`     | `/en/news/[slug]`     |
| Categoría | `/category/[slug]` | `/en/category/[slug]` |
| Búsqueda  | `/search`          | `/en/search`          |

### 4.6 Metadata SEO — locale-aware

```typescript
// Patrón para todas las páginas con metadata hardcodeada
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    // ... alternates sin cambios
  };
}
```

---

## 5. Arquitectura

### 5.1 Rendering por Página (sin cambios)

| Página                      | Estrategia                 | Estado     |
| --------------------------- | -------------------------- | ---------- |
| `/[locale]`                 | SSG                        | Sin cambio |
| `/[locale]/news/[slug]`     | SSG + generateStaticParams | Sin cambio |
| `/[locale]/category/[slug]` | SSG + generateStaticParams | Sin cambio |
| `/[locale]/search`          | CSR shell + `SearchClient` | Sin cambio |

### 5.2 Flujo de Datos (sin cambios)

```
Usuario → Next.js → mock-data.ts (SSG) / Fuse.js (CSR)
```

### 5.3 Patrones de Cambio

- **i18n propagation**: Pasar `locale` a `formatDate` / `relativeTime` desde Server Components; en Client Components usar `useLocale()` de next-intl.
- **Form pattern**: `react-hook-form` + `zod` schema → `resolver(zodSchema)` → `sonner.toast` en submit.
- **Client filter pattern**: `useState` local en `CategoryClient` para tag seleccionado y página activa.

---

## 6. Estructura de Carpetas

Cambios respecto al estado actual:

```
src/
├── hooks/                          # CREAR — actualmente vacío/inexistente
│   └── use-mobile.tsx              # Hook para detectar breakpoint mobile
├── lib/
│   ├── format.ts                   # MODIFICAR — añadir locale param
│   ├── error-capture.ts            # ELIMINAR — dead code
│   └── error-page.ts               # ELIMINAR — dead code
├── components/
│   ├── layout/
│   │   ├── navbar.tsx              # MODIFICAR — i18n completo, 7 cats
│   │   ├── footer.tsx              # MODIFICAR — i18n completo
│   │   └── theme-toggle.tsx        # MODIFICAR — i18n aria-label
│   ├── news/
│   │   ├── featured-hero.tsx       # MODIFICAR — i18n minRead
│   │   ├── news-card.tsx           # MODIFICAR — i18n minRead
│   │   ├── article-content.tsx     # MODIFICAR — activar rehype-autolink-headings
│   │   ├── table-of-contents.tsx   # MODIFICAR — i18n "EN ESTE ARTÍCULO"
│   │   ├── share-bar.tsx           # MODIFICAR — i18n todos los textos
│   │   ├── related-articles.tsx    # MODIFICAR — i18n "RELACIONADOS"
│   │   └── trending-list.tsx       # MODIFICAR — i18n "TRENDING_NOW", "reads"
│   ├── sidebar/
│   │   ├── newsletter-form.tsx     # REESCRIBIR — react-hook-form+zod+sonner+i18n
│   │   ├── ai-tools-list.tsx       # MODIFICAR — i18n "IA TOOLBENCH"
│   │   └── popular-tags.tsx        # MODIFICAR — i18n "CORE TAGS"
│   ├── search/
│   │   └── search-client.tsx       # MODIFICAR — i18n completo + date filter
│   └── category/                   # CREAR directorio
│       └── category-client.tsx     # CREAR — tag filter + pagination
├── app/
│   ├── not-found.tsx               # MODIFICAR — usar i18n (con fallback)
│   └── [locale]/
│       ├── layout.tsx              # MODIFICAR — inyectar JSON-LD WebSite correctamente
│       ├── page.tsx                # MODIFICAR — generateMetadata con i18n
│       ├── error.tsx               # MODIFICAR — usar useTranslations
│       ├── search/page.tsx         # MODIFICAR — generateMetadata con i18n
│       └── category/[slug]/
│           └── page.tsx            # MODIFICAR — usar CategoryClient
└── messages/
    ├── es.json                     # MODIFICAR — añadir claves nuevas
    ├── en.json                     # MODIFICAR — añadir claves nuevas (traducidas)
    ├── pt-BR.json                  # CREAR — scaffold {}
    ├── ja.json                     # CREAR — scaffold {}
    └── ko.json                     # CREAR — scaffold {}
```

---

## 7. Routing y Páginas

### 7.1 Mapa de Rutas (sin cambios estructurales)

| Ruta ES            | Ruta EN               | Archivo                                 | Tipo | Auth | Indexable |
| ------------------ | --------------------- | --------------------------------------- | ---- | ---- | --------- |
| `/`                | `/en`                 | `app/[locale]/page.tsx`                 | SSG  | No   | Sí        |
| `/news/[slug]`     | `/en/news/[slug]`     | `app/[locale]/news/[slug]/page.tsx`     | SSG  | No   | Sí        |
| `/category/[slug]` | `/en/category/[slug]` | `app/[locale]/category/[slug]/page.tsx` | SSG  | No   | Sí        |
| `/search`          | `/en/search`          | `app/[locale]/search/page.tsx`          | CSR  | No   | No        |

### 7.2 Cambios por Página

#### `app/[locale]/page.tsx` (Home)

**Cambio**: `generateMetadata` → usar `getTranslations({ locale, namespace: "home.meta" })` en lugar de strings hardcodeados.

#### `app/[locale]/layout.tsx`

**Cambio**: Inyectar JSON-LD WebSite via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />` en el `<body>` del layout, no solo exportarlo como variable.

#### `app/[locale]/error.tsx`

**Cambio**: Añadir `"use client"`. Usar `useTranslations("common.errors")` para todos los textos. Usar `t("generic")` y `t("genericDescription")` y `t("retry")`.

#### `app/not-found.tsx`

**Cambio**: Archivo global sin contexto de locale. Usar texto español hardcoded con comentario explicativo, O mover a `app/[locale]/not-found.tsx`. Decisión: mover a `[locale]` para poder usar i18n. Eliminar el global `not-found.tsx` o dejarlo como fallback mínimo.

#### `app/[locale]/search/page.tsx`

**Cambio**:

1. `generateMetadata` → usar `getTranslations({ locale, namespace: "search.meta" })`.
2. Pasar `initialSince` prop (parseado de `searchParams.since`) a `SearchClient`.
3. Fallback de Suspense → usar clave i18n `search.loadingFallback`.

#### `app/[locale]/category/[slug]/page.tsx`

**Cambio**: Delegar renderizado de artículos a `<CategoryClient articles={articles} />` para habilitar filtrado client-side de tags.

---

## 8. Catálogo de Componentes — Cambios

### `<Navbar />`

**Archivo**: `src/components/layout/navbar.tsx`
**Tipo**: Client Component
**Cambios**:

- Añadir `web-dev` y `security` a `NAV_ITEMS` → 7 categorías total.
- `aria-label` del botón mobile menu → `t("common.navigation.openMenu")` / `t("common.navigation.closeMenu")` según estado.

**Claves i18n añadidas**: `common.navigation.openMenu`, `common.navigation.closeMenu`

### `<Footer />`

**Archivo**: `src/components/layout/footer.tsx`
**Tipo**: Server Component
**Cambios**:

- "Plataforma" → `t("common.footer.platformLabel")`
- "Conecta" → `t("common.footer.connectLabel")`
- Links newsletter/RSS/social → usar claves `common.footer.newsletterLink`, `common.footer.rssLink`, etc.

**Claves i18n añadidas**: `common.footer.platformLabel`, `common.footer.connectLabel`, `common.footer.newsletterLink`, `common.footer.rssLink`, `common.footer.twitterLink`, `common.footer.githubLink`

### `<ThemeToggle />`

**Archivo**: `src/components/layout/theme-toggle.tsx`
**Tipo**: Client Component
**Cambio**: `aria-label="Cambiar tema"` → `t("common.theme.toggle")` (clave ya existe, solo falta usarla).

### `<FeaturedHero />`

**Archivo**: `src/components/news/featured-hero.tsx`
**Tipo**: Client Component
**Cambio**: "MIN READ" → `t("article.labels.minRead")` (clave existe).

### `<NewsCard />`

**Archivo**: `src/components/news/news-card.tsx`
**Tipo**: Client Component
**Cambio**: "min" → `t("article.labels.minRead")` (clave existe).

### `<ArticleContent />`

**Archivo**: `src/components/news/article-content.tsx`
**Tipo**: Server Component
**Cambio**: Añadir `rehypeAutolinkHeadings` al array de `rehypePlugins` junto a `rehypeSlug`. Plugin ya instalado.

```typescript
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// plugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
```

### `<TableOfContents />`

**Archivo**: `src/components/news/table-of-contents.tsx`
**Tipo**: Client Component
**Cambio**: "EN ESTE ARTÍCULO" → `t("article.toc.title")`.

**Clave nueva**: `article.toc.title`

### `<ShareBar />`

**Archivo**: `src/components/news/share-bar.tsx`
**Tipo**: Client Component
**Cambio**: Todos los textos y aria-labels → `useTranslations("article.share")`.

**Claves nuevas**: `article.share.label`, `article.share.twitter`, `article.share.linkedin`, `article.share.copyLink`, `article.share.copied`

### `<RelatedArticles />`

**Archivo**: `src/components/news/related-articles.tsx`
**Tipo**: Server Component
**Cambio**: "// RELACIONADOS" → `t("article.related.title")` via `getTranslations`.

**Clave nueva**: `article.related.title`

### `<TrendingList />`

**Archivo**: `src/components/news/trending-list.tsx`
**Tipo**: Server Component
**Cambio**:

- "// TRENDING_NOW" → `t("trending.title")`
- "reads" → `t("trending.reads")`

**Claves nuevas**: `trending.title`, `trending.reads`

### `<NewsletterForm />`

**Archivo**: `src/components/sidebar/newsletter-form.tsx`
**Tipo**: Client Component
**Reescritura completa**:

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const schema = z.object({
  email: z.string().email(),
});
type FormData = z.infer<typeof schema>;

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(_data: FormData) {
    // mock submit — no API
    await new Promise((r) => setTimeout(r, 500));
    toast.success(t("success"));
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3>{t("title")}</h3>
      <p>{t("subtitle")}</p>
      <input
        type="email"
        placeholder={t("emailPlaceholder")}
        {...register("email")}
        aria-invalid={!!errors.email}
      />
      {errors.email && <span role="alert">{t("error")}</span>}
      <button type="submit" disabled={isSubmitting}>{t("submit")}</button>
    </form>
  );
}
```

**Props**: ninguna
**Dependencias**: `react-hook-form`, `@hookform/resolvers/zod`, `zod`, `sonner`

**Verificar**: `@hookform/resolvers` instalado. Si no → `npm install @hookform/resolvers`.

### `<AIToolsList />`

**Archivo**: `src/components/sidebar/ai-tools-list.tsx`
**Tipo**: Server Component
**Cambio**: "// IA TOOLBENCH" → `t("sidebar.toolbench.title")`.

**Clave nueva**: `sidebar.toolbench.title`

### `<PopularTags />`

**Archivo**: `src/components/sidebar/popular-tags.tsx`
**Tipo**: Server Component
**Cambio**: "// CORE TAGS" → `t("sidebar.tags.title")`.

**Clave nueva**: `sidebar.tags.title`

### `<SearchClient />`

**Archivo**: `src/components/search/search-client.tsx`
**Tipo**: Client Component
**Cambios**:

1. Input placeholder: `t("search.placeholder")` (existe, sin usar).
2. "Todas" button: `t("common.actions.filterAll")` (existe, sin usar).
3. Resultados count: `t("search.results", { count })` (existe, sin usar).
4. Sin resultados: `t("search.noResults")` (existe, sin usar).
5. Añadir `initialSince?: number` prop.
6. Añadir `sinceDays` state con valor inicial desde prop.
7. Añadir UI de filtro de fecha: radio/select con opciones `anyTime / last7Days / last30Days / last90Days`.
8. Pasar `sinceDays` a `searchNews()`.

**Props actualizadas**:

```typescript
interface SearchClientProps {
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
  initialSince?: number; // NUEVO
}
```

**Claves usadas**: `search.filters.date`, `search.filters.anyTime`, `search.filters.last7Days`, `search.filters.last30Days`, `search.filters.last90Days` (todas existen en messages).

### `<CategoryClient />` (NUEVO)

**Archivo**: `src/components/category/category-client.tsx`
**Tipo**: Client Component
**Responsabilidad**: Recibe todos los artículos de una categoría. Permite filtrar por tag. Renderiza paginación simple (opcional para MVP).

**Props**:

```typescript
interface CategoryClientProps {
  articles: NewsArticle[];
}
```

**Estado**:

- `selectedTag: string | null` — tag activo
- `currentPage: number` — página actual (opcional)

**Comportamiento**:

1. Extraer tags únicos de `articles`.
2. Mostrar chips de tags clickeables.
3. Filtrar `articles` por `selectedTag` si hay uno seleccionado.
4. Renderizar `<NewsCard size="md" />` para cada artículo filtrado.
5. "Todos los tags" chip para limpiar filtro → texto `t("category.filter")` / `t("category.filterAll")` (claves existen).

**Claves usadas**: `category.filter`, `category.filterAll`, `category.otherTagsLabel`

### `formatDate` y `relativeTime` (lib/format.ts)

**Cambio**: Añadir parámetro `locale: string` a ambas funciones.

```typescript
// Antes
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { ... });
}

// Después
export function formatDate(iso: string, locale = "es"): string {
  const dateLocale = locale === "en" ? "en-US" : "es-ES";
  return new Date(iso).toLocaleDateString(dateLocale, { ... });
}
```

Para `relativeTime`: misma firma, pasar `locale` a llamada interna de `formatDate`. Strings de relativeTime también deben condicionarse por locale, o usar `date-fns` con locale explícito.

**Opción elegida**: Usar `date-fns/locale` para `relativeTime` (package ya instalado). `formatDate` usa `toLocaleDateString` con locale mapeado.

**Impacto**: Todos los call sites de `formatDate` y `relativeTime` deben pasar el locale. En Server Components: obtener locale de params. En Client Components: `useLocale()`.

---

## 9. Gestión de Estado

| Estado               | Alcance           | Tecnología                    | Ubicación        |
| -------------------- | ----------------- | ----------------------------- | ---------------- |
| Locale activo        | Global            | next-intl auto                | middleware       |
| Tema                 | Global persistido | next-themes                   | `ThemeProvider`  |
| Search query/filters | URL + local       | `useState` + `router.replace` | `SearchClient`   |
| Category tag filter  | Local             | `useState`                    | `CategoryClient` |
| Newsletter form      | Local             | react-hook-form               | `NewsletterForm` |

Sin cambios de arquitectura de estado. Sin stores globales nuevos.

---

## 10. Fetching de Datos

Sin cambios. Todo viene de `mock-data.ts` via funciones síncronas en Server Components.

`formatDate` y `relativeTime` reciben `locale` del Server Component que los llama:

```typescript
// En Server Component
const { locale } = await params;
const formattedDate = formatDate(article.publishedAt, locale);
```

En Client Components donde se usan fechas:

```typescript
const locale = useLocale(); // next-intl
const formattedDate = formatDate(article.publishedAt, locale);
```

---

## 11. SEO

### 11.1 Metadata por Página — Estado Objetivo

| Página   | Cambio                                                                                   |
| -------- | ---------------------------------------------------------------------------------------- |
| Home     | `generateMetadata` usa `home.meta.title`, `home.meta.description`                        |
| Search   | `generateMetadata` usa `search.meta.title`, `search.meta.description`                    |
| Category | Nombres de categorías → siempre en español (mock-data constraint) — sin cambio funcional |
| Article  | Sin cambio — ya correcto                                                                 |

### 11.2 JSON-LD WebSite — Corrección

Estado actual: `websiteSchema` definido en `layout.tsx` pero no inyectado en JSX.

Estado objetivo:

```typescript
// app/[locale]/layout.tsx — en el return JSX
<body>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
  />
  {/* resto del layout */}
</body>
```

### 11.3 Hreflang (sin cambios)

Ya implementado correctamente via `alternates.languages` en `generateMetadata` de todas las páginas públicas.

---

## 12. robots.txt (sin cambios)

`app/robots.ts` — implementación correcta. Pasa E2E tests.

---

## 13. sitemap.xml (sin cambios)

`app/sitemap.ts` — implementación correcta, multilocale, con alternates. Pasa E2E tests.

---

## 14. ads.txt (sin cambios)

`app/ads.txt/route.ts` — implementación correcta. Pasa E2E tests.

---

## 15. Performance

### 15.1 Métricas Objetivo

| Métrica                | Target          |
| ---------------------- | --------------- |
| LCP                    | < 2.5s          |
| CLS                    | < 0.1           |
| Lighthouse Performance | > 90            |
| Lighthouse SEO         | > 95 (mantener) |

### 15.2 Impacto de Cambios

- `rehype-autolink-headings`: impacto mínimo — solo añade `<a>` a headings en artículos.
- `CategoryClient` (nuevo Client Component): hidratación solo al entrar en la categoría — OK.
- `react-hook-form` en newsletter: bundle mínimo, ya instalado.
- date-fns locales: importar solo `es` y `en` — tree-shakeable.

---

## 16. Estilos

Sin cambios en sistema de estilos. Tailwind CSS + shadcn CSS variables en `src/styles.css`. Convenciones de `cod_style.md`:

- PascalCase para componentes.
- camelCase para variables/funciones.
- Clases Tailwind directamente en JSX — sin CSS modules adicionales.
- Sin estilos inline.

`CategoryClient` usa clases Tailwind existentes del proyecto (mismo patrón que `SearchClient`).

---

## 17. Accesibilidad

| Componente           | Cambio A11y                                                   |
| -------------------- | ------------------------------------------------------------- |
| `<Navbar />`         | aria-label mobile button → locale-aware                       |
| `<ThemeToggle />`    | aria-label → `t("common.theme.toggle")`                       |
| `<ShareBar />`       | aria-labels → i18n                                            |
| `<NewsletterForm />` | `aria-invalid`, `role="alert"` en error, noValidate           |
| `<SearchClient />`   | date filter → `role="radiogroup"` o `<select>` con label i18n |

WCAG 2.1 AA — mantener nivel actual.

---

## 18. Gestión de Errores

### 18.1 Error Boundaries (sin cambios estructurales)

```
app/layout.tsx (root)
└── app/[locale]/layout.tsx
    └── app/[locale]/error.tsx  ← MODIFICAR para usar i18n
```

### 18.2 Tipos de Error

| Tipo            | Componente                   | Cambio                                    |
| --------------- | ---------------------------- | ----------------------------------------- |
| 404             | `app/[locale]/not-found.tsx` | Mover a locale context, usar i18n         |
| Crítico         | `app/[locale]/error.tsx`     | Usar `useTranslations("common.errors")`   |
| Form validation | `NewsletterForm`             | `react-hook-form` errors + `role="alert"` |

---

## 19. APIs

Sin cambios. Toda la data es mock estático.

---

## 20. Testing

### 20.1 Estrategia

| Nivel     | Tool            | Cambios necesarios                                                                           |
| --------- | --------------- | -------------------------------------------------------------------------------------------- |
| Unit      | Vitest          | Actualizar tests de `format.ts` para nuevo parámetro `locale`                                |
| Component | Testing Library | Añadir tests para `NewsletterForm` (rhf+zod), `CategoryClient`, `SearchClient` (date filter) |
| E2E       | Playwright      | Añadir `@playwright/test` a package.json devDependencies                                     |

### 20.2 Tests Nuevos Requeridos

**Unit: `format.test.ts`** — añadir casos para locale `"en"`:

```typescript
it("formatDate en locale en retorna formato en-US", () => {
  const result = formatDate("2024-01-15T00:00:00Z", "en");
  expect(result).toMatch(/Jan/);
});
```

**Component: `newsletter-form.test.tsx`**:

```
Given: NewsletterForm renderizado con locale es
When: submit con email inválido
Then: muestra mensaje de error
When: submit con email válido
Then: llama toast.success con t("newsletter.success")
```

**Component: `category-client.test.tsx`**:

```
Given: CategoryClient con 3 artículos de 2 tags distintos
When: click en tag X
Then: solo muestra artículos con tag X
When: click en "filterAll"
Then: muestra todos los artículos
```

### 20.3 Tests E2E Existentes

No deben romperse. Verificar tras cada cambio:

- `e2e/navigation.spec.ts` — sin cambios esperados
- `e2e/search.spec.ts` — verificar que filtro de fecha no rompe tests actuales
- `e2e/seo.spec.ts` — verificar JSON-LD WebSite test pasa correctamente tras corrección

---

## 21. Variables de Entorno (sin cambios)

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADS_TXT_CONTENT=
```

---

## 22. Decisiones Técnicas

| Decisión                  | Alternativas                                 | Elegida                                                                   | Por qué                                                                |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Locale en formatDate      | date-fns completo, Intl.DateTimeFormat       | `toLocaleDateString` con locale mapeado + date-fns solo para relativeTime | date-fns ya instalado; `toLocaleDateString` suficiente para formatDate |
| not-found.tsx             | Mantener global hardcoded, mover a [locale]  | Mover a `[locale]/not-found.tsx`                                          | Permite i18n real; elimina texto hardcoded                             |
| CategoryClient pagination | Paginación real SSG, infinite scroll, simple | Filtro de tags únicamente (sin paginación)                                | KISS — máx 13 artículos por categoría actualmente                      |
| pt-BR/ja/ko               | No añadir, añadir vacíos                     | Scaffold vacíos + añadir a locales                                        | No bloquear futura impl.; costo mínimo                                 |

---

## 23. Fuera de Alcance

- Traducción de contenido de artículos/categorías/autores a inglés — razón: mock-data es single-language by design.
- Implementación real de newsletter API — razón: proyecto es mock/demo, sin backend.
- Links sociales/newsletter/RSS reales — razón: son placeholders de diseño.
- Localización de slugs de artículos y categorías — razón: requeriría duplicar todo el mock-data.
- Implementar locales pt-BR, ja, ko — razón: solo scaffolding; sin traducciones disponibles.
- Autenticación, dashboard privado — razón: no existe en el proyecto.
- `use-mobile.tsx` hook complejo — razón: no hay componente que lo necesite actualmente.
