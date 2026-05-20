# Historia de Usuario: Migrar el proyecto actual a Next.js

## Descripción

Como desarrollador del proyecto **SYNTHNODE** (portal de noticias tecnológicas), necesito migrar la aplicación actual —construida con TanStack Start + TanStack Router sobre Cloudflare Workers— a **Next.js 15 (App Router)**, con el objetivo de estandarizar el stack, aprovechar el ecosistema de Next.js y simplificar el despliegue y mantenimiento a largo plazo.

---

## Contexto técnico actual

| Aspecto        | Stack actual                                  |
| -------------- | --------------------------------------------- |
| Meta-framework | TanStack Start (`@tanstack/react-start`)      |
| Router         | TanStack Router v1 (file-based, SSR)          |
| Data fetching  | TanStack Query v5 + `loader` por ruta         |
| Build          | Vite 7 + `@lovable.dev/vite-tanstack-config`  |
| Deploy         | Cloudflare Workers (`wrangler.jsonc`)         |
| Estilos        | Tailwind CSS v4 (config CSS-first)            |
| UI             | shadcn/ui "new-york" (46 componentes)         |
| Datos          | Mock data en memoria (`src/lib/mock-data.ts`) |
| Lenguaje       | TypeScript 5.8 strict                         |

---

## Stack objetivo

| Aspecto        | Stack Next.js                                                          |
| -------------- | ---------------------------------------------------------------------- |
| Meta-framework | Next.js 15 (App Router)                                                |
| Router         | App Router (file-based, Server Components)                             |
| Data fetching  | Server Components + fetch nativo / TanStack Query opcional para client |
| Build          | Next.js CLI / Turbopack                                                |
| Deploy         | Vercel (recomendado) o Cloudflare via `@cloudflare/next-on-pages`      |
| Estilos        | Tailwind CSS v4 (sin cambios en tokens)                                |
| UI             | shadcn/ui (actualizar `components.json` con `rsc: true`)               |
| Datos          | Mantener `src/lib/mock-data.ts` sin cambios                            |
| Lenguaje       | TypeScript 5.8 strict                                                  |

---

## Criterios de aceptación

### 1. Estructura de directorios

- [ ] Crear estructura `app/` siguiendo las convenciones de Next.js App Router.
- [ ] `src/routes/__root.tsx` → `app/layout.tsx` (shell global: providers, Navbar, Footer).
- [ ] `src/routes/index.tsx` → `app/page.tsx`.
- [ ] `src/routes/news.$slug.tsx` → `app/news/[slug]/page.tsx`.
- [ ] `src/routes/category.$slug.tsx` → `app/category/[slug]/page.tsx`.
- [ ] `src/routes/search.tsx` → `app/search/page.tsx`.
- [ ] El directorio `src/routes/` y `src/routeTree.gen.ts` son eliminados.

### 2. Metadata / SEO

- [ ] Cada `page.tsx` exporta `generateMetadata()` en lugar de la función `head()` de TanStack Start.
- [ ] Los metadatos incluyen: `title`, `description`, `openGraph` (título, descripción, imagen), `twitter` card y `canonical`.
- [ ] Las páginas de artículo (`app/news/[slug]/page.tsx`) incluyen JSON-LD (`Article` schema) inyectado vía `<script type="application/ld+json">` en el componente, o mediante `metadata.other`.
- [ ] El schema `WebSite` (sitelinks searchbox) se mantiene en `app/layout.tsx`.

### 3. Server Components y fetching de datos

- [ ] Las páginas que solo leen datos (`mock-data.ts`) son Server Components por defecto (sin `"use client"`).
- [ ] Los loaders de TanStack Router son eliminados; la lógica de obtención de datos se mueve al cuerpo del `page.tsx` (async Server Component).
- [ ] Si un slug no existe, se lanza `notFound()` de `next/navigation` (equivalente al `throw notFound()` actual).
- [ ] `generateStaticParams()` es implementado en rutas dinámicas para permitir SSG/ISR si se desea.

### 4. Client Components

Los siguientes componentes deben marcarse con `"use client"` porque usan hooks, animaciones o APIs del navegador:

| Componente                                  | Motivo                                  |
| ------------------------------------------- | --------------------------------------- |
| `src/components/news/FeaturedHero.tsx`      | Usa `framer-motion`                     |
| `src/components/sidebar/NewsletterForm.tsx` | Usa `react-hook-form` + estado          |
| `src/components/layout/Navbar.tsx`          | Usa estado de menú móvil, `usePathname` |
| `src/components/layout/ThemeToggle.tsx`     | Usa `next-themes` (`useTheme`)          |
| `app/search/page.tsx` o su componente hijo  | Usa `useSearchParams`, Fuse.js          |
| `src/hooks/use-mobile.tsx`                  | Usa `useEffect` + `window`              |

### 5. Theming (`next-themes`)

- [ ] `ThemeProvider` de `next-themes` se mueve a `app/layout.tsx`, envolviendo el contenido con `suppressHydrationWarning` en `<html>`.
- [ ] El toggle de tema (`ThemeToggle.tsx`) permanece como Client Component.

### 6. Estilos (Tailwind CSS v4)

- [ ] `src/styles.css` se importa en `app/layout.tsx` (o en `app/globals.css` renombrado).
- [ ] La directiva `@source` se actualiza para apuntar a los directorios correctos en la nueva estructura (`app/`, `src/components/`).
- [ ] No se requiere `tailwind.config.js`; la configuración CSS-first se mantiene intacta.

### 7. shadcn/ui

- [ ] `components.json` se actualiza:
  - `rsc: true` (habilitar soporte React Server Components).
  - `aliases.utils` apunta a `@/lib/utils`.
- [ ] Los 46 componentes en `src/components/ui/` no requieren cambios de código.

### 8. Imágenes

- [ ] Las imágenes estáticas en `src/assets/news/` se mueven a `public/news/`.
- [ ] Las referencias en `mock-data.ts` se actualizan a rutas absolutas (`/news/imagen.jpg`).
- [ ] Los componentes que renderizan imágenes de artículos usan `next/image` (`<Image>`) con `width`, `height` o `fill` según corresponda.

### 9. Búsqueda

- [ ] La página de búsqueda (`app/search/page.tsx`) es un Server Component que renderiza un Client Component hijo que contiene la lógica con `useSearchParams` y Fuse.js.
- [ ] Los parámetros de URL (`q`, `category`, `tag`, `since`) se leen con `useSearchParams` en el Client Component.

### 10. Eliminación de dependencias obsoletas

Las siguientes dependencias son eliminadas del `package.json`:

```
@tanstack/react-start
@tanstack/react-router
@tanstack/router-plugin
@cloudflare/vite-plugin
@lovable.dev/vite-tanstack-config
vite (reemplazado por Next.js build)
wrangler (si no se despliega en Cloudflare)
```

Las siguientes dependencias se añaden:

```
next@15
@types/node (si no está)
```

### 11. Configuración del proyecto

- [ ] Crear `next.config.ts` con configuración base (TypeScript config, rutas de imágenes si aplica).
- [ ] Actualizar `tsconfig.json`:
  - `"moduleResolution": "bundler"` o `"node16"`.
  - Path alias `@/*` apuntando a `./src/*`.
  - Incluir `"next-env.d.ts"`.
- [ ] Actualizar scripts en `package.json`:
  ```json
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
  ```
- [ ] Eliminar `vite.config.ts` y `wrangler.jsonc` (si el deploy target cambia).

---

## Archivos a modificar / crear

| Acción    | Archivo                                                             |
| --------- | ------------------------------------------------------------------- |
| Crear     | `app/layout.tsx`                                                    |
| Crear     | `app/page.tsx`                                                      |
| Crear     | `app/news/[slug]/page.tsx`                                          |
| Crear     | `app/category/[slug]/page.tsx`                                      |
| Crear     | `app/search/page.tsx`                                               |
| Crear     | `app/globals.css` (renombrar `src/styles.css`)                      |
| Crear     | `next.config.ts`                                                    |
| Modificar | `tsconfig.json`                                                     |
| Modificar | `package.json`                                                      |
| Modificar | `components.json`                                                   |
| Modificar | `src/lib/mock-data.ts` (rutas de imágenes)                          |
| Modificar | `src/components/layout/Navbar.tsx` (añadir `"use client"`)          |
| Modificar | `src/components/layout/ThemeToggle.tsx` (añadir `"use client"`)     |
| Modificar | `src/components/news/FeaturedHero.tsx` (añadir `"use client"`)      |
| Modificar | `src/components/sidebar/NewsletterForm.tsx` (añadir `"use client"`) |
| Eliminar  | `src/routes/` (directorio completo)                                 |
| Eliminar  | `src/routeTree.gen.ts`                                              |
| Eliminar  | `src/router.tsx`                                                    |
| Eliminar  | `src/server.ts`                                                     |
| Eliminar  | `src/start.ts`                                                      |
| Eliminar  | `vite.config.ts`                                                    |
| Mover     | `src/assets/news/*.jpg` → `public/news/`                            |

---

## Pasos de implementación

1. **Inicializar Next.js** en el mismo repositorio (o rama nueva):

   ```bash
   npx create-next-app@latest --typescript --tailwind --app --src-dir --import-alias "@/*" .
   ```

   _(Ajustar flags; no sobreescribir archivos existentes de lógica/componentes.)_

2. **Configurar Tailwind v4** adaptando `globals.css` desde `src/styles.css`.

3. **Crear `app/layout.tsx`** con Providers (ThemeProvider), Navbar y Footer.

4. **Migrar rutas** una a una: index → category → news → search.

5. **Marcar Client Components** con `"use client"` donde sea necesario.

6. **Actualizar imágenes** a `public/news/` y usar `next/image`.

7. **Actualizar `components.json`** y verificar shadcn/ui.

8. **Eliminar dependencias obsoletas** y actualizar `package.json`.

9. **Verificar build**: `next build` sin errores.

10. **Verificar SEO**: comprobar que `generateMetadata` genera los tags correctos con una herramienta como `curl` o DevTools.

---

## Requisitos no funcionales

- **Rendimiento**: Las páginas de artículo y categoría deben ser elegibles para SSG (`generateStaticParams`). El bundle cliente debe ser mínimo (no cargar Fuse.js en páginas que no son búsqueda).
- **SEO**: Todos los meta tags actuales (OG, Twitter, JSON-LD) deben estar presentes en la versión Next.js. El HTML generado debe ser idéntico a nivel semántico.
- **Accesibilidad**: No degradar el nivel de accesibilidad actual. El Navbar y el ThemeToggle deben seguir siendo accesibles por teclado.
- **TypeScript**: Mantener `strict: true`. No introducir `any` implícitos.
- **Tests**: Si existen tests, actualizarlos para reflejar los nuevos paths y exports. Si no existen, crear al menos un smoke test por ruta principal.
- **Zero downtime**: La migración se realiza en una rama separada (`feature/migrate-nextjs`); no afecta `main` hasta QA completado.

---

## Definición de hecho (DoD)

- [ ] `next build` completa sin errores ni warnings críticos.
- [ ] Todas las rutas (`/`, `/news/[slug]`, `/category/[slug]`, `/search`) responden con 200.
- [ ] Los meta tags SEO están presentes en el HTML renderizado del servidor.
- [ ] El toggle de tema (claro/oscuro) funciona correctamente.
- [ ] La búsqueda filtra artículos correctamente con los parámetros de URL.
- [ ] No hay `console.error` de hidratación en el navegador.
- [ ] El PR de migración ha sido revisado y aprobado por al menos un revisor técnico.
