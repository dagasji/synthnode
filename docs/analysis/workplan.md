# Plan de Trabajo Frontend — SYNTHNODE

> Versión: 1.0
> Fecha: 2026-05-21
> Diseño técnico: docs/analysis/design.md
> Estimación total: 8 sesiones

---

## Convenciones

- **[BLOQUEANTE]**: debe completarse antes de la siguiente fase
- **[PARALELO]**: ejecutable en paralelo con otras de la misma fase
- **[OPCIONAL]**: mejora no crítica para MVP
- Cada tarea referencia `→ design.md §[N]`
- Verificación i18n tras cada tarea: claves nuevas añadidas a `es.json` Y `en.json`

---

## Fase 1: Mensajes i18n — Claves Nuevas

**Objetivo**: Añadir todas las claves faltantes a `es.json` y `en.json` antes de modificar componentes.

**Entregables**:
- `messages/es.json` con todas las claves nuevas
- `messages/en.json` con todas las claves nuevas (traducidas al inglés)
- `messages/pt-BR.json`, `messages/ja.json`, `messages/ko.json` scaffolded vacíos
- `src/middleware.ts` actualizado con los 5 locales

**Estimación**: 1 sesión

### Tareas

- [ ] **1.1** — Añadir claves nuevas a `messages/es.json` [BLOQUEANTE]
  - Sección `common.navigation`: añadir `openMenu`, `closeMenu`, `allCategories`
  - Sección `common.footer`: añadir `platformLabel`, `connectLabel`, `newsletterLink`, `rssLink`, `twitterLink`, `githubLink`
  - Sección `article.toc`: añadir `title`
  - Sección `article.share`: añadir `label`, `twitter`, `linkedin`, `copyLink`, `copied`
  - Sección `article.related`: añadir `title`
  - Sección `trending`: añadir `title`, `reads`
  - Sección `sidebar.toolbench`: añadir `title`
  - Sección `sidebar.tags`: añadir `title`
  - Sección `search`: añadir `loadingFallback`
  - Verificación: `node -e "require('./src/messages/es.json')"` → sin errores
  - `→ design.md §4.4`

- [ ] **1.2** — Añadir claves nuevas a `messages/en.json` [BLOQUEANTE]
  - Mismas claves que 1.1 con valores en inglés
  - `openMenu: "Open menu"`, `closeMenu: "Close menu"`, `allCategories: "All categories"`
  - `platformLabel: "Platform"`, `connectLabel: "Connect"`, etc.
  - `toc.title: "In this article"`, `share.label: "Share"`, `share.twitter: "Share on X"`, etc.
  - `related.title: "Related"`, `trending.title: "Trending"`, `trending.reads: "reads"`
  - `toolbench.title: "IA Toolbench"`, `tags.title: "Core Tags"`, `loadingFallback: "Loading…"`
  - Verificación: `diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)` → sin diferencias
  - `→ design.md §4.4`

- [ ] **1.3** — Crear scaffolds pt-BR, ja, ko [PARALELO]
  - Crear `src/messages/pt-BR.json` con contenido `{}`
  - Crear `src/messages/ja.json` con contenido `{}`
  - Crear `src/messages/ko.json` con contenido `{}`
  - Verificación: los 3 archivos existen y son JSON válido
  - `→ design.md §4.1`

- [ ] **1.4** — Actualizar `src/middleware.ts` con locales adicionales
  - Añadir `"pt-BR"`, `"ja"`, `"ko"` al array `locales`
  - Actualizar `src/i18n/request.ts` si hay validación de locales explícita
  - Test: `npm run dev` → `/pt-BR` devuelve 200 (aunque vacío)
  - `→ design.md §4.2`

**Verificación Fase 1**:
- `node -e "require('./src/messages/es.json')"` → OK
- `node -e "require('./src/messages/en.json')"` → OK
- `diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)` → sin diferencias

---

## Fase 2: lib/format.ts — Locale-Aware

**Objetivo**: `formatDate` y `relativeTime` aceptan parámetro `locale` y formatean correctamente para es/en.

**Entregables**:
- `src/lib/format.ts` actualizado
- Todos los call sites actualizados para pasar locale
- Tests unitarios de `format.ts` actualizados y pasando

**Estimación**: 1 sesión

### Tareas

- [ ] **2.1** — Actualizar `formatDate` en `src/lib/format.ts` [BLOQUEANTE]
  - Añadir parámetro `locale = "es"` (default mantiene comportamiento actual)
  - Mapear: `"en"` → `"en-US"`, cualquier otro → `"es-ES"`
  - Preservar opciones de formato existentes `{ day: "2-digit", month: "short", year: "numeric" }`
  - Test: `npm run type-check` → sin errores
  - `→ design.md §8 (formatDate)`

- [ ] **2.2** — Actualizar `relativeTime` en `src/lib/format.ts`
  - Añadir parámetro `locale = "es"`
  - Para strings "hace X...": condicionarlos por locale
    - ES: "hace Xm", "hace Xh", "hace Xd"
    - EN: "Xm ago", "Xh ago", "Xd ago"
  - Fallback a `formatDate(iso, locale)`
  - `→ design.md §8 (formatDate)`

- [ ] **2.3** — Actualizar call sites de `formatDate` y `relativeTime`
  - Buscar todos los usos: `grep -r "formatDate\|relativeTime" src/`
  - En Server Components: pasar `locale` desde `params.locale`
  - En Client Components: pasar `useLocale()` de next-intl
  - Test: `npm run type-check` → sin errores
  - Test: `npm run dev` → `/en/news/[slug]` muestra fechas en inglés

- [ ] **2.4** — Actualizar tests en `tests/unit/lib/format.test.ts`
  - Añadir casos: `formatDate("2024-01-15T00:00:00Z", "en")` → contiene "Jan"
  - Añadir casos: `formatDate("2024-01-15T00:00:00Z", "es")` → contiene mes en español
  - Añadir casos: `relativeTime` con locale "en" → contiene "ago"
  - Test: `npx vitest run tests/unit/lib/format.test.ts` → todos pasan
  - `→ design.md §20.1`

---

## Fase 3: Layout — JSON-LD y Error Pages

**Objetivo**: Inyectar JSON-LD WebSite correctamente. Corregir error.tsx y not-found.tsx con i18n.

**Estimación**: 0.5 sesiones

### Tareas

- [ ] **3.1** — Corregir JSON-LD WebSite en `src/app/[locale]/layout.tsx` [BLOQUEANTE]
  - Localizar `websiteSchema` en el archivo
  - Añadir `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />` al JSX del `<body>`
  - Test: `npm run dev && curl -s http://localhost:3000/en | grep 'application/ld+json'` → 2 ocurrencias (WebSite + WebSite de layout)
  - Test E2E: `npx playwright test e2e/seo.spec.ts` → WebSite JSON-LD test pasa
  - `→ design.md §11.2`

- [ ] **3.2** — Corregir `src/app/[locale]/error.tsx` con i18n
  - Añadir `"use client"` si no está
  - Usar `useTranslations("common.errors")` para `t("generic")`, `t("genericDescription")`, `t("retry")`
  - Test: build sin errores TypeScript
  - `→ design.md §18.2`

- [ ] **3.3** — Mover `not-found.tsx` a locale context [PARALELO]
  - Crear `src/app/[locale]/not-found.tsx` con i18n usando `getTranslations("common.errors")`
  - Usar `t("notFound")`, `t("notFoundDescription")`, `t("backToHome")`
  - Mantener o simplificar `src/app/not-found.tsx` global como fallback mínimo (texto hardcoded breve)
  - Test: `npm run dev` → navegar a `/ruta-inexistente` → página 404 correcta
  - Test: `npm run dev` → navegar a `/en/ruta-inexistente` → página 404 en inglés
  - `→ design.md §18.2`

- [ ] **3.4** — Corregir `generateMetadata` en `app/[locale]/page.tsx` (Home)
  - Reemplazar title/description hardcodeados por `getTranslations({ locale, namespace: "home.meta" })`
  - Test: `curl -s http://localhost:3000 | grep '<title>'` → "SYNTHNODE" (en español)
  - Test: `curl -s http://localhost:3000/en | grep '<title>'` → título en inglés
  - `→ design.md §11.1`

- [ ] **3.5** — Corregir `generateMetadata` en `app/[locale]/search/page.tsx`
  - Reemplazar title/description hardcodeados por `getTranslations({ locale, namespace: "search.meta" })`
  - Corregir Suspense fallback: `t("search.loadingFallback")`
  - Test: `npm run type-check` → sin errores
  - `→ design.md §7.2`

---

## Fase 4: Componentes Layout (Navbar, Footer, ThemeToggle)

**Objetivo**: i18n completo en componentes de layout. Navbar con 7 categorías.

**Estimación**: 0.5 sesiones

### Tareas

- [ ] **4.1** — Actualizar `<Navbar />` [BLOQUEANTE]
  - Añadir `{ slug: "web-dev", ... }` y `{ slug: "security", ... }` a `NAV_ITEMS`
  - Verificar que `common.navigation.categories.webDev` y `common.navigation.categories.security` existen en messages (ya existen)
  - Reemplazar `aria-label="Abrir menú"` por `t("common.navigation.openMenu")`
  - Reemplazar estado cerrado por `t("common.navigation.closeMenu")`
  - Test: `npm run dev` → nav muestra 7 categorías en `/` y 7 en `/en`
  - Test: `npm run lint` → sin errores
  - `→ design.md §8 (Navbar)`

- [ ] **4.2** — Actualizar `<Footer />` [PARALELO]
  - "Plataforma" → `t("common.footer.platformLabel")`
  - "Conecta" → `t("common.footer.connectLabel")`
  - Links de texto → claves correspondientes en `common.footer.*`
  - Test: `npm run dev` → footer en `/` muestra "Plataforma", footer en `/en` muestra "Platform"
  - `→ design.md §8 (Footer)`

- [ ] **4.3** — Actualizar `<ThemeToggle />` [PARALELO]
  - `aria-label="Cambiar tema"` → `t("common.theme.toggle")`
  - Añadir `"use client"` si falta, importar `useTranslations`
  - Test: `npm run type-check` → sin errores
  - `→ design.md §8 (ThemeToggle)`

---

## Fase 5: Componentes News (i18n hardcoded)

**Objetivo**: Eliminar todo texto hardcoded de componentes de noticias.

**Estimación**: 1 sesión

### Tareas

- [ ] **5.1** — `<FeaturedHero />` — i18n minRead [PARALELO]
  - "MIN READ" → `t("article.labels.minRead")` (clave existe)
  - Añadir `useTranslations("article.labels")` si no está
  - Test: `npm run dev` → hero muestra texto en locale correcto
  - `→ design.md §8 (FeaturedHero)`

- [ ] **5.2** — `<NewsCard />` — i18n minRead [PARALELO]
  - "min" → `t("article.labels.minRead")`
  - Test: render del componente muestra clave traducida
  - `→ design.md §8 (NewsCard)`

- [ ] **5.3** — `<ArticleContent />` — activar rehype-autolink-headings [PARALELO]
  - Importar `rehypeAutolinkHeadings` from `"rehype-autolink-headings"`
  - Añadir al array de plugins: `[rehypeAutolinkHeadings, { behavior: "wrap" }]`
  - Test: `npm run dev` → artículo muestra `#` links en headings
  - Test: `npm run type-check` → sin errores
  - `→ design.md §8 (ArticleContent)`

- [ ] **5.4** — `<TableOfContents />` — i18n título [PARALELO]
  - "EN ESTE ARTÍCULO" → `t("article.toc.title")`
  - Test: TOC muestra "En este artículo" en ES, "In this article" en EN
  - `→ design.md §8 (TableOfContents)`

- [ ] **5.5** — `<ShareBar />` — i18n completo [PARALELO]
  - "COMPARTIR" → `t("article.share.label")`
  - `aria-label="Compartir en X"` → `t("article.share.twitter")`
  - `aria-label="Compartir en LinkedIn"` → `t("article.share.linkedin")`
  - `aria-label="Copiar enlace"` → `t("article.share.copyLink")`
  - Feedback de copiado → `t("article.share.copied")`
  - Test: `npm run dev` → share bar muestra textos en locale correcto
  - `→ design.md §8 (ShareBar)`

- [ ] **5.6** — `<RelatedArticles />` — i18n título [PARALELO]
  - "// RELACIONADOS" → `getTranslations("article.related")` → `t("title")`
  - Test: sección muestra "Relacionados" en ES, "Related" en EN
  - `→ design.md §8 (RelatedArticles)`

- [ ] **5.7** — `<TrendingList />` — i18n completo [PARALELO]
  - "// TRENDING_NOW" → `getTranslations("trending")` → `t("title")`
  - "reads" → `t("reads")`
  - Test: `npm run dev` → lista muestra "Trending" en EN, "reads"/"lecturas" según locale
  - `→ design.md §8 (TrendingList)`

**Verificación Fase 5**:
- `npm run dev` → artículo en `/en/news/[slug]` muestra todos los textos en inglés
- `npm run lint` → sin errores
- `npm run type-check` → sin errores

---

## Fase 6: Sidebar (NewsletterForm, AIToolsList, PopularTags)

**Objetivo**: NewsletterForm reescrito con react-hook-form+zod+sonner+i18n. Sidebar sin hardcoded.

**Estimación**: 1 sesión

### Tareas

- [ ] **6.1** — Verificar `@hookform/resolvers` instalado [BLOQUEANTE]
  - Comando: `npm list @hookform/resolvers`
  - Si no está: `npm install @hookform/resolvers`
  - Test: `import { zodResolver } from "@hookform/resolvers/zod"` compila sin errores
  - `→ design.md §8 (NewsletterForm)`

- [ ] **6.2** — Reescribir `<NewsletterForm />` [BLOQUEANTE]
  - Implementar según spec de `design.md §8 (NewsletterForm)`
  - Schema zod: `z.object({ email: z.string().email() })`
  - `useForm` con `zodResolver`
  - Submit mock: `setTimeout(500)` → `toast.success(t("newsletter.success"))`
  - Error email → `role="alert"` con `t("newsletter.error")`
  - Todos los textos via `useTranslations("newsletter")`
  - Añadir `<Toaster />` de sonner al locale layout si no está
  - Test: `npm run dev` → submit con email inválido muestra error
  - Test: `npm run dev` → submit con email válido muestra toast de éxito
  - Test: `npm run type-check` → sin errores
  - `→ design.md §8 (NewsletterForm)`

- [ ] **6.3** — Actualizar `<AIToolsList />` — i18n [PARALELO]
  - "// IA TOOLBENCH" → `getTranslations("sidebar.toolbench")` → `t("title")`
  - Test: componente muestra "IA Toolbench" en ES y EN (mismo valor — nombre propio)
  - `→ design.md §8 (AIToolsList)`

- [ ] **6.4** — Actualizar `<PopularTags />` — i18n [PARALELO]
  - "// CORE TAGS" → `getTranslations("sidebar.tags")` → `t("title")`
  - Test: componente muestra "Core Tags" en ES y EN (mismo valor — nombre propio)
  - `→ design.md §8 (PopularTags)`

---

## Fase 7: SearchClient (i18n + date filter) y CategoryClient (nuevo)

**Objetivo**: SearchClient sin hardcoded y con filtro de fecha. CategoryClient nuevo con tag filter.

**Estimación**: 1.5 sesiones

### Tareas

- [ ] **7.1** — Actualizar `<SearchClient />` — i18n [BLOQUEANTE]
  - Input placeholder → `t("search.placeholder")` (clave existe)
  - Botón "Todas" → `t("common.actions.filterAll")` (clave existe)
  - Contador resultados → `t("search.results", { count })` (clave existe, ICU plural)
  - Mensaje vacío → `t("search.noResults")` (clave existe)
  - Test: `npm run dev` → `/search` en ES muestra textos en español
  - Test: `npm run dev` → `/en/search` muestra textos en inglés
  - `→ design.md §8 (SearchClient)`

- [ ] **7.2** — Añadir filtro de fecha a `<SearchClient />` [BLOQUEANTE para 7.3]
  - Añadir prop `initialSince?: number`
  - Añadir `useState<number | undefined>(initialSince)` para `sinceDays`
  - Añadir UI: `<select>` con `role="listbox"` o grupo de radio buttons
    - Opciones: `anyTime` (undefined), `last7Days` (7), `last30Days` (30), `last90Days` (90)
    - Textos: `t("search.filters.anyTime")`, etc. (claves existen)
  - Pasar `sinceDays` a `searchNews(query, { ..., sinceDays })`
  - Sincronizar `sinceDays` a URL via `router.replace` con param `since`
  - Test: `npm run dev` → seleccionar "Últimos 7 días" → resultados reducidos
  - `→ design.md §8 (SearchClient)`

- [ ] **7.3** — Actualizar `app/[locale]/search/page.tsx` — `initialSince` prop
  - Parsear `searchParams.since` como número
  - Pasar `initialSince={parsed}` a `<SearchClient />`
  - Test: `npm run dev` → `/search?since=7` → filtro de fecha pre-seleccionado en "7 días"
  - `→ design.md §7.2`

- [ ] **7.4** — Crear `<CategoryClient />` [BLOQUEANTE para 7.5]
  - Archivo: `src/components/category/category-client.tsx`
  - Props: `{ articles: NewsArticle[] }`
  - Estado: `selectedTag: string | null`
  - Lógica: extraer tags únicos de articles; filtrar por selectedTag si activo
  - UI: chips de tags clickeables + chip "Todos" → `t("category.filterAll")`
  - Renderizar `<NewsCard size="md" />` para artículos filtrados
  - Test: `npm run type-check` → sin errores
  - `→ design.md §8 (CategoryClient)`

- [ ] **7.5** — Actualizar `app/[locale]/category/[slug]/page.tsx`
  - Importar `<CategoryClient />`
  - Reemplazar renderizado directo de artículos por `<CategoryClient articles={articles} />`
  - Test: `npm run dev` → `/category/ai` muestra artículos con chips de tags
  - Test: `npm run dev` → click en tag → filtra artículos
  - `→ design.md §7.2`

---

## Fase 8: Dead Code + package.json + Verificación Final

**Objetivo**: Eliminar dead code, añadir @playwright/test a package.json, verificar build y tests completos.

**Estimación**: 0.5 sesiones

### Tareas

- [ ] **8.1** — Eliminar dead code [BLOQUEANTE]
  - Eliminar `src/lib/error-capture.ts`
  - Eliminar `src/lib/error-page.ts`
  - Verificar que ningún archivo los importa: `grep -r "error-capture\|error-page" src/` → sin resultados
  - Test: `npm run type-check` → sin errores
  - `→ design.md §6`

- [ ] **8.2** — Añadir `@playwright/test` a `package.json` [PARALELO]
  - Verificar versión instalada: `npm list @playwright/test`
  - Añadir a `devDependencies` en `package.json` con la versión instalada
  - Test: `npm install` → sin errores de resolución
  - `→ design.md §20.1`

- [ ] **8.3** — Crear `src/hooks/` directory con `use-mobile.tsx`
  - Crear `src/hooks/use-mobile.tsx`
  - Hook mínimo:
    ```typescript
    "use client";
    import { useState, useEffect } from "react";
    export function useMobile(breakpoint = 768) {
      const [isMobile, setIsMobile] = useState(false);
      useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
      }, [breakpoint]);
      return isMobile;
    }
    ```
  - Test: `npm run type-check` → sin errores
  - `→ design.md §6`

- [ ] **8.4** — Verificación build completo [BLOQUEANTE]
  - Comando: `npm run build`
  - Test: 0 errores, 0 warnings TypeScript en build
  - Test: `npm run lint` → 0 errores
  - Test: `npm run type-check` → 0 errores
  - `→ design.md §2`

- [ ] **8.5** — Verificación tests unitarios y componentes
  - Comando: `npm test`
  - Test: todos los tests pasan
  - Si algún test falla por los cambios de firma de `formatDate` → corregir en `tests/`
  - `→ design.md §20.1`

- [ ] **8.6** — Verificación E2E completa
  - Comando: `npm run build && npm run test:e2e`
  - Test: `e2e/navigation.spec.ts` → todos pasan
  - Test: `e2e/search.spec.ts` → todos pasan
  - Test: `e2e/seo.spec.ts` → todos pasan, incluido WebSite JSON-LD
  - `→ design.md §20.3`

- [ ] **8.7** — Verificación i18n final
  - Comando: `diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)` → sin diferencias
  - Test manual: `/` → todos los textos en español
  - Test manual: `/en` → todos los textos en inglés
  - Test manual: `/en/news/[slug]` → compartir, TOC, related, fechas en inglés
  - Test manual: `/en/search` → placeholder, contador, filtros en inglés
  - `→ design.md §4`

---

## Resumen de Dependencias

```
Fase 1 (Mensajes i18n) [BLOQUEANTE para todo]
    ↓
Fase 2 (format.ts locale-aware)
    |
    ├── Fase 3 (Layout: JSON-LD, error pages, metadata)
    ├── Fase 4 (Navbar, Footer, ThemeToggle)
    └── Fase 5 (Componentes News) ── [PARALELO con 3 y 4]
            ↓
        Fase 6 (Sidebar: NewsletterForm)
            ↓
        Fase 7 (SearchClient + CategoryClient)
            ↓
        Fase 8 (Dead code + build + tests)
```

Fases 3, 4 y 5 son ejecutables en paralelo una vez completada Fase 1 (y Fase 2 para call sites de formatDate).

---

## Checklist Final

**i18n**
- [ ] Cero texto hardcoded: `grep -r "aria-label=\"[^{]" src/components/` → solo valores dinámicos
- [ ] `diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)` → sin diferencias
- [ ] `/en` muestra contenido de UI en inglés
- [ ] Fechas en `/en/news/[slug]` en formato inglés

**SEO y archivos críticos**
- [ ] `curl http://localhost:3000/robots.txt` → 200, contiene "User-agent" y "Sitemap"
- [ ] `curl http://localhost:3000/sitemap.xml` → 200, XML válido con URLs
- [ ] `curl http://localhost:3000/ads.txt` → 200
- [ ] `curl -s http://localhost:3000/en | grep 'WebSite'` → presente (JSON-LD)
- [ ] `curl -s http://localhost:3000/en/news/[slug] | grep 'NewsArticle'` → presente (JSON-LD)

**Funcionalidad**
- [ ] Nav muestra 7 categorías (incluye web-dev y security)
- [ ] Filtro de fecha en `/search` funciona
- [ ] Filtro de tags en `/category/[slug]` funciona
- [ ] Newsletter: email inválido → error visible; email válido → toast éxito
- [ ] Headings de artículos tienen links anchor (`rehype-autolink-headings`)

**Calidad**
- [ ] `npm run type-check` → 0 errores
- [ ] `npm run lint` → 0 warnings
- [ ] `npm test` → todos pasan
- [ ] `npm run build && npm run test:e2e` → todos pasan
- [ ] `src/lib/error-capture.ts` y `src/lib/error-page.ts` eliminados
- [ ] `@playwright/test` en `package.json` devDependencies
