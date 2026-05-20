# Plan de Trabajo Frontend — SYNTHNODE (Migración Next.js)

> Versión: 1.0
> Fecha: 2026-05-19
> Diseño técnico: `docs/analysis/design.md`
> Estimación total: 9 fases / ~11 sesiones

---

## Convenciones

- **[BLOQUEANTE]**: completar antes de continuar con la siguiente fase.
- **[PARALELO]**: ejecutable en paralelo con otras tareas de la misma fase.
- **[OPCIONAL]**: mejora no crítica para MVP.
- Cada tarea referencia `→ design.md §[N]`.
- Verificación i18n obligatoria al final de cada fase que añada textos.

---

## Fase 1: Setup + i18n Base + SEO Obligatorio

**Objetivo**: Proyecto Next.js 15 + TypeScript + next-intl + robots.txt + sitemap.xml + ads.txt funcionando en `localhost:3000`.

**Entregables**:

- `next dev` arranca sin errores.
- `/` y `/en` responden 200.
- `messages/es.json` y `messages/en.json` creados (vacíos inicialmente).
- `/robots.txt`, `/sitemap.xml`, `/ads.txt` responden 200.

**Estimación**: 1 sesión

### Tareas

- [ ] **1.1** — Inicializar Next.js 15 con App Router + TypeScript
  - Rama: `feature/migrate-nextjs`
  - Comando: `npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --skip-install`
  - No sobreescribir: `src/components/`, `src/lib/`, `src/hooks/`, carpetas de assets.
  - Test: `npm install && npm run dev` → `localhost:3000` carga.
  - `→ design.md §3`

- [ ] **1.2** — Instalar dependencias del proyecto [BLOQUEANTE]
  - Comando:
    ```bash
    npm install next-intl framer-motion fuse.js next-themes react-markdown remark-gfm rehype-slug rehype-autolink-headings date-fns react-hook-form @hookform/resolvers zod sonner lucide-react class-variance-authority clsx tailwind-merge
    ```
  - Test: `npm run build` → sin errores de módulos no encontrados.

- [ ] **1.3** — Configurar path aliases en `tsconfig.json`
  - Verificar que `"@/*": ["./src/*"]` está en `compilerOptions.paths`.
  - Test: `import X from '@/lib/utils'` compila sin errores (`npx tsc --noEmit`).

- [ ] **1.4** — Instalar y configurar next-intl [BLOQUEANTE]
  - Comando: `npm install next-intl`
  - Crear `src/middleware.ts` con el código exacto de `design.md §4.2`.
  - Crear `src/app/[locale]/layout.tsx` con `NextIntlClientProvider`.
  - Mover/crear `src/app/[locale]/page.tsx` (placeholder `export default function Page() { return <p>ok</p> }`).
  - Test: `npm run dev` → `/` y `/en` devuelven 200.
  - `→ design.md §4.1, §4.2`

- [ ] **1.5** — Crear `messages/es.json` y `messages/en.json` [BLOQUEANTE]
  - Crear `src/messages/es.json` con estructura completa de `design.md §4.3`.
  - Crear `src/messages/en.json` con misma estructura y valores traducidos al inglés.
  - Test: `node -e "JSON.parse(require('fs').readFileSync('src/messages/es.json','utf8'))"` → sin errores.
  - Test: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8'))"` → sin errores.
  - `→ design.md §4.3`

- [ ] **1.6** — Implementar `robots.txt` [BLOQUEANTE]
  - Crear `src/app/robots.ts` con código de `design.md §12`.
  - Añadir `NEXT_PUBLIC_BASE_URL=http://localhost:3000` a `.env.local`.
  - Crear `.env.example` con `NEXT_PUBLIC_BASE_URL=` y `ADS_TXT_CONTENT=`.
  - Test: `curl http://localhost:3000/robots.txt` → 200, contiene `User-agent: *` y `Sitemap:`.
  - `→ design.md §12`

- [ ] **1.7** — Implementar `sitemap.xml` [BLOQUEANTE]
  - Crear `src/app/sitemap.ts` con código de `design.md §13`.
  - Solo rutas estáticas por ahora (home + search en es/en). Artículos y categorías se añaden en Fase 4-5.
  - Test: `curl http://localhost:3000/sitemap.xml` → 200, XML válido.
  - Test: `curl http://localhost:3000/sitemap.xml | grep -c "<url>"` → 4 (2 rutas × 2 locales).
  - `→ design.md §13`

- [ ] **1.8** — Implementar `ads.txt` [BLOQUEANTE]
  - Crear `src/app/ads.txt/route.ts` con código de `design.md §14`.
  - Test: `curl http://localhost:3000/ads.txt` → 200.
  - `→ design.md §14`

- [ ] **1.9** — Crear estructura de carpetas completa
  - Crear directorios vacíos (con `.gitkeep`): `src/components/search/`, `src/messages/`.
  - Verificar que la estructura de `design.md §6` existe.
  - Test: `ls src/components/` muestra `layout/`, `news/`, `sidebar/`, `search/`, `ui/`.

- [ ] **1.10** — Configurar ESLint + Prettier
  - Mantener `eslint.config.js` existente + añadir regla `no-console: warn` para producción.
  - Mantener `.prettierrc` existente.
  - Test: `npm run lint` → 0 errores.

**Verificación final Fase 1**:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/          # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en        # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/robots.txt   # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/sitemap.xml  # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ads.txt      # 200
```

---

## Fase 2: Migración de Assets e Imágenes

**Objetivo**: Imágenes disponibles en `public/news/` y referencias actualizadas en `mock-data.ts`.

**Entregables**:

- 6 imágenes en `public/news/`.
- `src/lib/mock-data.ts` usa rutas `/news/*.jpg`.
- Sin imports de Vite (`import heroAi from "@/assets/..."`) en `mock-data.ts`.

**Estimación**: 0.5 sesiones

### Tareas

- [ ] **2.1** — Mover imágenes a `public/news/`
  - Comando: `mkdir -p public/news && cp src/assets/news/*.jpg public/news/`
  - Test: `ls public/news/` → 6 archivos JPG.

- [ ] **2.2** — Actualizar `src/lib/mock-data.ts`
  - Eliminar los 6 imports de imágenes al inicio del archivo.
  - Reemplazar referencias de variable (`heroAi`, `rust`, etc.) por rutas absolutas (`"/news/hero-ai.jpg"`, `"/news/rust.jpg"`, etc.) en cada artículo.
  - Test: `npx tsc --noEmit` → sin errores.
  - Test: `npm run dev` → imágenes cargan en `/` (verificar en browser o con curl).
  - `→ design.md §10.2`

---

## Fase 3: Layout Global + Theming + Fuentes

**Objetivo**: Root layout, `app/[locale]/layout.tsx` con ThemeProvider, Navbar, Footer, fuentes y hreflang.

**Entregables**:

- `app/layout.tsx` (root) con html/body base.
- `app/[locale]/layout.tsx` con Providers, Navbar, Footer, JSON-LD WebSite, hreflang.
- Tema claro/oscuro funcional.
- Fuentes Space Grotesk + JetBrains Mono cargadas con `next/font`.
- `globals.css` con tokens de Tailwind v4.

**Estimación**: 1 sesión

### Tareas

- [ ] **3.1** — Crear `src/app/globals.css` [BLOQUEANTE]
  - Copiar contenido de `src/styles.css`.
  - Actualizar directivas `@source` para apuntar a `../components/**/*.tsx` y `../app/**/*.tsx`.
  - Importar en `src/app/layout.tsx`.
  - Test: `npm run dev` → tokens CSS visibles en DevTools.
  - `→ design.md §16`

- [ ] **3.2** — Crear `src/app/layout.tsx` (Root Layout)
  - Contenido: `<html>` + `<body>` + import de `globals.css`.
  - Sin ThemeProvider aquí (va en `[locale]/layout.tsx`).
  - Fuentes con `next/font/google`: `Space_Grotesk` + `JetBrains_Mono`.
  - Test: `npm run dev` → fuentes aplicadas.
  - `→ design.md §6, §15.2`

- [ ] **3.3** — Migrar `ThemeProvider` a Client Component
  - Verificar que `src/components/theme-provider.tsx` tiene `"use client"` y usa `next-themes`.
  - Si no lo tiene, añadir `"use client"` al inicio.
  - Test: importar en layout sin error.

- [ ] **3.4** — Migrar `Navbar` a Client Component [PARALELO]
  - Archivo: `src/components/layout/navbar.tsx`.
  - Añadir `"use client"` al inicio.
  - Reemplazar `useNavigate` de TanStack Router por `useRouter` de `next/navigation`.
  - Reemplazar `<Link to="..." params={...}>` de TanStack Router por `<Link href="...">` de `next/link`.
  - Reemplazar `activeProps` por comparación con `usePathname()`.
  - Textos: obtener categorías de i18n con `useTranslations('common.navigation.categories')`.
  - Test: `npx tsc --noEmit` → sin errores.
  - `→ design.md §8`

- [ ] **3.5** — Migrar `ThemeToggle` a Client Component [PARALELO]
  - Archivo: `src/components/layout/theme-toggle.tsx`.
  - Añadir `"use client"`.
  - Verificar que usa `useTheme()` de `next-themes`. Si usa algo de TanStack, reemplazar.
  - Test: toggle cambia clase en `<html>`.
  - `→ design.md §8`

- [ ] **3.6** — Migrar `Footer` [PARALELO]
  - Archivo: `src/components/layout/footer.tsx`.
  - Sin `"use client"` — Server Component.
  - Reemplazar `<Link>` de TanStack por `<Link>` de `next/link`.
  - Textos: `getTranslations('common.footer')`.
  - Test: `npx tsc --noEmit` → sin errores.

- [ ] **3.7** — Crear `src/app/[locale]/layout.tsx` completo [BLOQUEANTE]
  - Contenido: `ThemeProvider`, `NextIntlClientProvider`, `Navbar`, `Footer`, hreflang, JSON-LD WebSite.
  - Estructura:
    ```tsx
    export default async function LocaleLayout({ children, params }) {
      const { locale } = await params;
      const messages = (await import(`@/messages/${locale}.json`)).default;
      return (
        <html lang={locale} suppressHydrationWarning>
          <head>
            <link rel="alternate" hrefLang="es" href={`${BASE_URL}/`} />
            <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en`} />
            <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/`} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
          </head>
          <body>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ThemeProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ThemeProvider>
            </NextIntlClientProvider>
          </body>
        </html>
      );
    }
    ```
  - Test: `curl -s http://localhost:3000 | grep hreflang` → 3 tags.
  - Test: `curl -s http://localhost:3000 | grep 'application/ld+json'` → presente.
  - `→ design.md §4.6, §4.7, §11.2, §11.3`

- [ ] **3.8** — Crear `src/app/not-found.tsx`
  - Usar textos de `common.errors.notFound` y `common.errors.notFoundDescription`.
  - Nota: en este archivo usar texto directo o importar desde mensajes vía función auxiliar (no hooks, es Server Component).
  - Test: navegar a ruta inexistente → 404 con mensaje correcto.

- [ ] **3.9** — Crear `src/app/[locale]/error.tsx`
  - `"use client"` obligatorio (Next.js requiere).
  - Botón "Reintentar" con `reset()` prop.
  - Test: `npx tsc --noEmit` → sin errores.

**Verificación i18n Fase 3**:

```bash
diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) \
     <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)
# → sin diferencias
```

---

## Fase 4: Migrar Componentes de News y Sidebar

**Objetivo**: Todos los componentes de `src/components/news/` y `src/components/sidebar/` funcionando sin dependencias de TanStack.

**Entregables**:

- Todos los componentes migrados con `"use client"` donde corresponde.
- Sin imports de `@tanstack/*` en componentes.
- `shadcn/ui` actualizado con `rsc: true`.

**Estimación**: 1.5 sesiones

### Tareas

- [ ] **4.1** — Actualizar `components.json`
  - Cambiar `"rsc": false` → `"rsc": true`.
  - Cambiar `"aliases.utils"` a `"@/lib/utils"` si no es así.
  - Test: `cat components.json | grep rsc` → `"rsc": true`.
  - `→ design.md §3`

- [ ] **4.2** — Migrar `FeaturedHero` a Client Component
  - Archivo: `src/components/news/featured-hero.tsx`.
  - Añadir `"use client"`.
  - Reemplazar `<Link>` de TanStack por `<Link>` de `next/link`.
  - Test: `npx tsc --noEmit` → sin errores.
  - `→ design.md §8`

- [ ] **4.3** — Migrar `NewsCard` a Client Component
  - Archivo: `src/components/news/news-card.tsx`.
  - Añadir `"use client"`.
  - Reemplazar `<Link>` de TanStack por `<Link href="/news/[slug]">`.
  - Reemplazar texto `min read` por i18n key `article.labels.minRead`.
  - Test: `npx tsc --noEmit` → sin errores.
  - `→ design.md §8`

- [ ] **4.4** — Migrar componentes Server de News [PARALELO]
  - Archivos: `category-badge.tsx`, `related-articles.tsx`, `author-card.tsx`, `trending-list.tsx`.
  - Reemplazar `<Link>` de TanStack por `<Link>` de `next/link` en cada uno.
  - Sin `"use client"` — son Server Components.
  - Test: `npx tsc --noEmit` → sin errores.

- [ ] **4.5** — Migrar `ArticleContent` y `TableOfContents` [PARALELO]
  - Archivos: `article-content.tsx`, `table-of-contents.tsx`.
  - Server Components. Verificar que `react-markdown` funciona en Server Component.
  - Nota: `react-markdown` v10 es compatible con Server Components si no usa hooks internos. Verificar en runtime.
  - Test: `npm run dev` + navegar a artículo → contenido renderizado.

- [ ] **4.6** — Migrar `ShareBar` a Client Component
  - Archivo: `src/components/news/share-bar.tsx`.
  - Añadir `"use client"` (usa `navigator.share` / clipboard).
  - Test: botones de compartir visibles.

- [ ] **4.7** — Migrar `NewsletterForm` a Client Component
  - Archivo: `src/components/sidebar/newsletter-form.tsx`.
  - Añadir `"use client"`.
  - Verificar uso de `react-hook-form`. Sin cambios de lógica.
  - Textos del formulario → i18n (añadir claves a `messages/`).
  - `→ design.md §8`

- [ ] **4.8** — Migrar `Sidebar` a Server Component
  - Archivo: `src/components/sidebar/sidebar.tsx`.
  - Sin `"use client"`.
  - Reemplazar `<Link>` de TanStack por `<Link>` de `next/link`.
  - Test: `npx tsc --noEmit` → sin errores.

- [ ] **4.9** — Crear `CategoryClient` (nuevo componente)
  - Archivo: `src/components/news/category-client.tsx`.
  - Extraer lógica de filtros y paginación de la ruta `category.$slug.tsx` actual.
  - `"use client"` — usa `useState`.
  - Props: `articles: NewsArticle[]`.
  - Renderiza: filtros de tags, grid de `<NewsCard />`, paginación.
  - Test: `npx tsc --noEmit` → sin errores.
  - `→ design.md §8`

- [ ] **4.10** — Crear `SearchClient` (nuevo componente)
  - Archivo: `src/components/search/search-client.tsx`.
  - `"use client"` — usa `useSearchParams`, `useRouter`, `useState`.
  - Extraer toda la lógica de `src/routes/search.tsx`.
  - Props: ninguna (lee desde `useSearchParams`).
  - Incluye: input con debounce 200ms → `router.replace`, filtros categoría/tag/fecha, resultados con `<NewsCard />`.
  - Test: `npx tsc --noEmit` → sin errores.
  - `→ design.md §8, §9`

**Verificación i18n Fase 4**:

```bash
diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) \
     <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)
# → sin diferencias
```

---

## Fase 5: Migrar Páginas (Routes)

**Objetivo**: Las 4 páginas del portal funcionando en Next.js App Router.

**Entregables**:

- `/` y `/en` → Home con hero, grid de noticias, sidebar.
- `/news/[slug]` y `/en/news/[slug]` → Artículo completo.
- `/category/[slug]` y `/en/category/[slug]` → Listado con filtros.
- `/search` y `/en/search` → Búsqueda funcional.
- `generateStaticParams` en rutas dinámicas.
- `generateMetadata` en todas las rutas.

**Estimación**: 2 sesiones

### Tareas

- [ ] **5.1** — Implementar `app/[locale]/page.tsx` (Home) [BLOQUEANTE]
  - Server Component async.
  - Obtener datos: `getFeatured()`, `getAllNews()`, `getTrending(5)`, `categories`.
  - Renderizar: `FeaturedHero`, `NewsCard` x6, filtros de categoría, `TrendingList`, `Sidebar`.
  - `generateMetadata()` con `design.md §7.2`.
  - Test: `curl -s http://localhost:3000 | grep '<h1'` → artículo destacado visible.
  - Test: `curl -s http://localhost:3000/en | grep 'lang="en"'` → OK.
  - `→ design.md §7.2`

- [ ] **5.2** — Implementar `app/[locale]/news/[slug]/page.tsx` (Artículo) [BLOQUEANTE]
  - `generateStaticParams()`: todos los slugs × `['es', 'en']`.
  - `dynamicParams = false`.
  - Obtener datos: `getNewsBySlug(params.slug)` + `notFound()` si null + `getRelated(article, 3)`.
  - Imagen principal con `next/image` (fill o width/height).
  - JSON-LD `Article` via `<script dangerouslySetInnerHTML>`.
  - `generateMetadata()` con `design.md §7.2`.
  - Test: `curl -I http://localhost:3000/news/beyond-llms-arquitecturas-cognitivas` → 200.
  - Test: `curl -s http://localhost:3000/news/beyond-llms-arquitecturas-cognitivas | grep 'ld+json'` → presente.
  - `→ design.md §7.2, §11.2`

- [ ] **5.3** — Implementar `app/[locale]/category/[slug]/page.tsx` (Categoría) [PARALELO con 5.2]
  - `generateStaticParams()`: todos los category slugs × `['es', 'en']`.
  - `dynamicParams = false`.
  - Obtener datos: `getCategoryBySlug(params.slug)` + `notFound()` + `getNewsByCategory(params.slug)`.
  - Renderizar: header de categoría + `<CategoryClient articles={articles} />`.
  - `generateMetadata()` con i18n.
  - Test: `curl -I http://localhost:3000/category/ai` → 200.
  - Test: `curl -I http://localhost:3000/en/category/ai` → 200.
  - `→ design.md §7.2`

- [ ] **5.4** — Implementar `app/[locale]/search/page.tsx` (Búsqueda) [PARALELO con 5.2]
  - Server Component shell que renderiza `<SearchClient />` envuelto en `<Suspense>`.
  - `metadata` estática con `robots: { index: false }`.
  - Test: `curl -I http://localhost:3000/search` → 200.
  - Test: `curl -s http://localhost:3000/search | grep 'noindex'` → presente.
  - `→ design.md §7.2`

- [ ] **5.5** — Actualizar `sitemap.ts` con todas las rutas dinámicas
  - Añadir rutas de artículos (`/news/[slug]`) y categorías (`/category/[slug]`) para ambos locales.
  - Test: `curl http://localhost:3000/sitemap.xml | grep -c "<url>"` → ≥ 34.
  - Test: `curl http://localhost:3000/sitemap.xml | grep "news/"` → slugs de artículos presentes.
  - `→ design.md §13`

**Verificación completa Fase 5**:

```bash
# Todas las rutas principales 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/                           # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en                         # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/news/beyond-llms-arquitecturas-cognitivas  # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/news/beyond-llms-arquitecturas-cognitivas  # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/category/ai                # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/category/ai             # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/search                     # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/search                  # 200
# Ruta inexistente → 404
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/no-existe                  # 404
# Sitemap completo
curl http://localhost:3000/sitemap.xml | grep -c "<url>"                                # ≥ 34
```

---

## Fase 6: Limpieza y Eliminación de Dependencias TanStack

**Objetivo**: Cero imports de `@tanstack/*` en el código. Eliminar dependencias obsoletas.

**Entregables**:

- `package.json` sin dependencias de TanStack ni Vite ni Cloudflare.
- `src/routes/` eliminado.
- `vite.config.ts`, `wrangler.jsonc` eliminados.
- `npm run build` sin warnings sobre dependencias no usadas.

**Estimación**: 0.5 sesiones

### Tareas

- [ ] **6.1** — Verificar que no quedan imports de TanStack en código fuente
  - Comando: `grep -r "@tanstack" src/ --include="*.tsx" --include="*.ts"` → 0 resultados.
  - Si hay resultados, corregir antes de continuar.

- [ ] **6.2** — Eliminar archivos de TanStack Router
  - Eliminar: `src/routes/` (directorio completo), `src/routeTree.gen.ts`, `src/router.tsx`, `src/server.ts`, `src/start.ts`.
  - Test: `ls src/routes/` → "No such file or directory".

- [ ] **6.3** — Eliminar archivos de Vite/Cloudflare
  - Eliminar: `vite.config.ts`, `wrangler.jsonc`, `bunfig.toml`, `bun.lock`.
  - Mantener `package-lock.json`.

- [ ] **6.4** — Desinstalar dependencias obsoletas
  - Comando:
    ```bash
    npm uninstall @tanstack/react-start @tanstack/react-router @tanstack/react-query @tanstack/router-plugin @cloudflare/vite-plugin @lovable.dev/vite-tanstack-config vite @vitejs/plugin-react vite-tsconfig-paths @tailwindcss/vite
    ```
  - Nota: `wrangler` puede no estar en `package.json` directamente; verificar antes.
  - Test: `cat package.json | grep tanstack` → sin resultados.

- [ ] **6.5** — Actualizar `package.json` scripts
  - Scripts finales:
    ```json
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write ."
    ```
  - Test: `npm run dev` → arranca correctamente.
  - Test: `npm run type-check` → 0 errores.

- [ ] **6.6** — Build de verificación [BLOQUEANTE]
  - Comando: `npm run build`
  - Test: sin errores ni warnings críticos.
  - Test: `npm start` + verificar que todas las rutas de Fase 5 siguen respondiendo 200.

---

## Fase 7: SEO Avanzado y Performance

**Objetivo**: Hreflang auditado, OG images, fuentes optimizadas, Lighthouse > 90/95.

**Estimación**: 1 sesión

### Tareas

- [ ] **7.1** — Verificar hreflang en todas las páginas públicas
  - Comando para cada ruta:
    ```bash
    curl -s http://localhost:3000/        | grep -c 'hreflang'  # 3
    curl -s http://localhost:3000/en      | grep -c 'hreflang'  # 3
    curl -s http://localhost:3000/news/[slug] | grep -c 'hreflang'  # 3
    ```
  - Si alguna falla, actualizar `generateMetadata()` de esa página.
  - `→ design.md §11.3`

- [ ] **7.2** — Verificar `next/image` en artículo
  - La imagen principal de `news/[slug]/page.tsx` usa `<Image>` con `priority`, `width`, `height` o `fill`.
  - Test: Lighthouse en `/news/[slug]` → CLS < 0.1.
  - `→ design.md §15.2`

- [ ] **7.3** — Auditar bundle con `@next/bundle-analyzer` [OPCIONAL]
  - Comando: `ANALYZE=true npm run build`
  - Identificar si Fuse.js solo carga en `/search`.
  - Corregir si se filtra al bundle inicial.
  - `→ design.md §15.2`

- [ ] **7.4** — Lighthouse en páginas clave
  - Páginas: `/`, `/en`, `/news/[slug]`, `/category/ai`, `/search`.
  - Objetivo: Performance > 90, SEO > 95.
  - Comando: `npx lighthouse http://localhost:3000 --output=json --quiet | jq '.categories.performance.score, .categories.seo.score'`
  - Corregir cualquier issue crítico identificado.
  - `→ design.md §15.1`

- [ ] **7.5** — Verificar Open Graph
  - `curl -s http://localhost:3000/news/[slug] | grep 'og:image'` → URL presente.
  - URL apunta a imagen en `/news/*.jpg`.
  - Test: Facebook Sharing Debugger (o herramienta local) → imagen visible.

---

## Fase 8: Testing

**Objetivo**: Cobertura según `design.md §20`. Tests i18n + SEO files + flujos críticos.

**Estimación**: 2 sesiones

### Tareas

- [ ] **8.1** — Configurar entorno de testing
  - Instalar: `npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom`
  - Instalar: `npm install -D @playwright/test`
  - Crear `vitest.config.ts` con entorno jsdom + alias `@/*`.
  - Crear `tests/utils/intl-wrapper.tsx` con el código de `design.md §20.2`.
  - Test: `npx vitest run` → ejecuta sin errores (0 tests por ahora está bien).
  - `→ design.md §20.1`

- [ ] **8.2** — Tests unitarios de lib
  - Archivo: `tests/unit/lib/format.test.ts` — testear `formatDate`.
  - Archivo: `tests/unit/lib/search.test.ts` — testear `searchNews` con filtros.
  - Archivo: `tests/unit/lib/mock-data.test.ts` — testear `getFeatured`, `getNewsBySlug`, `getCategoryBySlug`.
  - Patrón: Given-When-Then (`cod_style.md §7`).
  - Test: `npx vitest run tests/unit/` → todos pasan.

- [ ] **8.3** — Tests de componentes con i18n
  - Archivo: `tests/components/navbar.test.tsx` — renderiza nav con links; menú móvil toggle.
  - Archivo: `tests/components/news-card.test.tsx` — renderiza título, imagen, categoría.
  - Archivo: `tests/components/search-client.test.tsx` — input actualiza resultados.
  - Usar wrapper de `design.md §20.2`.
  - Test: `npx vitest run tests/components/` → todos pasan.
  - `→ design.md §20.2`

- [ ] **8.4** — Tests E2E: navegación y i18n
  - Archivo: `e2e/navigation.spec.ts`:
    - `/` carga y muestra artículo destacado.
    - Click en artículo → navega a `/news/[slug]`.
    - Click en categoría → navega a `/category/[slug]`.
    - `/en` carga en inglés.
    - Cambio de tema → persiste en recarga.
  - Test: `npx playwright test e2e/navigation.spec.ts` → todos pasan.

- [ ] **8.5** — Tests E2E: búsqueda
  - Archivo: `e2e/search.spec.ts`:
    - `/search?q=llm` → muestra resultados.
    - Filtro por categoría → filtra resultados.
    - Sin resultados → mensaje correcto.
  - Test: `npx playwright test e2e/search.spec.ts` → todos pasan.

- [ ] **8.6** — Tests E2E: archivos SEO
  - Archivo: `e2e/seo.spec.ts` con código de `design.md §20.3`.
  - Test: `npx playwright test e2e/seo.spec.ts` → todos pasan.
  - `→ design.md §20.3`

**Verificación completa Fase 8**:

```bash
npx vitest run          # todos pasan; cobertura > 70% en lib/
npx playwright test     # todos pasan en Chromium
```

---

## Fase 9: Deploy y Validación Final

**Objetivo**: Deploy en Vercel. Todas las validaciones en producción.

**Estimación**: 1 sesión

### Tareas

- [ ] **9.1** — Configurar proyecto en Vercel
  - Conectar repositorio (rama `feature/migrate-nextjs` o `main` tras merge).
  - Variables de entorno: `NEXT_PUBLIC_BASE_URL`, `ADS_TXT_CONTENT`.
  - Dominio configurado.
  - Test: deploy exitoso sin errores en Vercel dashboard.
  - `→ design.md §19, cod_style.md §9`

- [ ] **9.2** — Validación post-deploy

  ```bash
  BASE="https://[dominio]"
  # Archivos SEO obligatorios
  curl -I $BASE/robots.txt       # 200
  curl -s $BASE/robots.txt | grep Sitemap   # OK
  curl -I $BASE/sitemap.xml      # 200
  curl -s $BASE/sitemap.xml | grep -c "<url>"  # ≥ 34
  curl -I $BASE/ads.txt          # 200

  # Rutas principales en ambos locales
  for path in "/" "/en" "/news/beyond-llms-arquitecturas-cognitivas" "/en/news/beyond-llms-arquitecturas-cognitivas" "/category/ai" "/en/category/ai" "/search" "/en/search"; do
    echo -n "$path: " && curl -s -o /dev/null -w "%{http_code}\n" "$BASE$path"
  done
  # todas → 200

  # Hreflang
  curl -s $BASE/ | grep -c hreflang      # 3
  curl -s $BASE/en | grep -c hreflang    # 3
  ```

- [ ] **9.3** — Lighthouse en producción
  - `/` → Performance > 90, SEO > 95.
  - `/en` → Performance > 90, SEO > 95.
  - `/news/[slug]` → Performance > 90, SEO > 95.
  - Herramienta: [PageSpeed Insights](https://pagespeed.web.dev) o `npx lighthouse [url]`.

- [ ] **9.4** — Google Search Console [OPCIONAL]
  - Enviar `https://[dominio]/sitemap.xml`.
  - Verificar sin errores de indexación tras 24-48h.

- [ ] **9.5** — Eliminar rama de TanStack / merge a main
  - PR revisado y aprobado por al menos 1 revisor técnico (`requirements_nextjs.md §DoD`).
  - Merge a `main`.

---

## Resumen de Dependencias entre Fases

```
Fase 1 (Setup + i18n + SEO files)
    ↓
Fase 2 (Assets/Imágenes)
    ↓
Fase 3 (Layout + Theming + Fuentes)
    ↓
Fase 4 (Componentes) ─────────────────┐
    ↓                                  │
Fase 5 (Páginas/Routes)               │
    ↓                                  │
Fase 6 (Limpieza TanStack + build)    │
    ↓                                  │
Fase 7 (SEO avanzado + Performance)   │
    ↓                                  │
Fase 8 (Testing) ←────────────────────┘
    ↓
Fase 9 (Deploy)
```

---

## Checklist Final

### i18n

- [ ] `grep -r '">' src/components/ src/app/ | grep -v i18n | grep -v className` → cero texto hardcoded visible.
- [ ] `diff <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/es.json | sort) <(jq -Sr 'paths(scalars) as $p | $p | join(".")' src/messages/en.json | sort)` → sin diferencias.
- [ ] `/` → contenido en español.
- [ ] `/en` → contenido en inglés.
- [ ] Hreflang en todas las páginas públicas.

### SEO y archivos críticos

- [ ] `curl https://[dominio]/robots.txt` → 200, válido.
- [ ] `curl https://[dominio]/sitemap.xml` → 200, todas las rutas × locales.
- [ ] `curl https://[dominio]/ads.txt` → 200.
- [ ] Lighthouse SEO > 95 en todas las páginas públicas.

### URLs funcionando

- [ ] Todas las rutas del sitemap accesibles:
  ```bash
  for url in $(curl -s https://[dominio]/sitemap.xml | grep -oP '(?<=<loc>)[^<]+'); do
    echo -n "$url: " && curl -s -o /dev/null -w "%{http_code}\n" "$url"
  done
  # → todas 200
  ```

### Build y calidad

- [ ] `npm run build` → 0 errores, 0 warnings críticos.
- [ ] `npm run type-check` → 0 errores.
- [ ] `npm run lint` → 0 warnings.
- [ ] `npx vitest run` → todos pasan.
- [ ] `npx playwright test` → todos pasan.
- [ ] Lighthouse Performance > 90 en páginas clave.
- [ ] Responsive verificado: 375px, 768px, 1280px.
- [ ] Sin `console.error` de hidratación en browser DevTools.

### DoD de la historia de usuario

- [ ] `next build` sin errores.
- [ ] Todas las rutas responden 200.
- [ ] Meta tags SEO presentes en HTML del servidor.
- [ ] Toggle de tema funcional.
- [ ] Búsqueda filtra artículos con parámetros de URL.
- [ ] PR revisado y aprobado por al menos 1 revisor técnico.
