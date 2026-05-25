# Mejoras propuestas — SYNTHNODE

## Contenido y datos

### 1. Migrar mock-data a un CMS o ficheros MDX

Todo el contenido vive hardcodeado en `src/lib/mock-data.ts`. Migrar los artículos a ficheros `.mdx` por slug (o a un CMS headless como Sanity/Contentful) permitiría añadir contenido sin tocar código y desplegar solo los datos.

### 2. Sistema de paginación en listados de categoría

Las páginas de categoría muestran todos los artículos de golpe. Añadir paginación o scroll infinito mejoraría el rendimiento percibido y la UX cuando el volumen de artículos crezca.

### 3. Página de perfil de autor

`AuthorCard` muestra nombre y rol pero no enlaza a ningún sitio. Crear una ruta `/author/[slug]` con todos los artículos del autor daría más contexto y ayudaría al SEO interno.

---

## Funcionalidades mockeadas que no funcionan

### 4. Likes reales en artículos

El campo `likes` en `mock-data.ts` es un número estático. Conectarlo a un backend ligero (Vercel KV, Upstash Redis) con un endpoint `POST /api/like/[slug]` daría feedback real al usuario y métricas de engagement.

### 5. Contador de vistas real

`views` también es un valor fijo en el mock. Un hit counter con Vercel KV o una tabla en Supabase/Turso registraría visitas reales sin necesidad de analítica de terceros.

### 6. Newsletter funcional con doble opt-in

`NewsletterForm` llama a web3forms y guarda el email, pero no hay flujo de confirmación ni lista de suscriptores gestionable. Integrar Resend + una tabla de suscriptores añadiría confirmación por email y control total sobre los envíos.

### 7. Links reales en AI Tools List

Los items de `aiTools` en la sidebar apuntan todos a `href="#"`. Añadir la URL real de cada herramienta y abrir en nueva pestaña convertiría el widget en un recurso útil en lugar de decorativo.

---

## Búsqueda

### 8. Búsqueda con filtros por categoría y fecha

El buscador actual usa Fuse.js sobre todos los artículos sin filtros. Añadir chips de categoría y un selector de rango de fechas junto al input haría la búsqueda mucho más precisa.

### 9. Historial de búsquedas recientes

Guardar las últimas búsquedas en `localStorage` y mostrarlas como sugerencias al abrir el buscador reduciría la fricción para usuarios que vuelven a buscar lo mismo.

---

## Rendimiento e infraestructura

### 10. Optimización de imágenes con `next/image`

Las imágenes de artículos se sirven con `<img>` estándar. Migrar a `next/image` activaría lazy loading automático, redimensionado en el servidor y soporte de formatos modernos (WebP/AVIF), reduciendo el LCP.

### 11. ISR (Incremental Static Regeneration) en páginas de artículo

Las rutas de artículo son completamente estáticas. Configurar `revalidate` permitiría actualizar el contenido sin rebuild completo cuando se migren los datos a una fuente externa.

---

## UX y accesibilidad

### 12. Modo lectura / ajuste de tipografía

Para un portal de artículos largos, ofrecer al usuario control sobre el tamaño de fuente o activar un modo lectura sin distracciones mejoraría la experiencia, especialmente en móvil.

### 13. Progreso de lectura en artículos

Una barra de progreso fina en la parte superior de la página que avance mientras el usuario hace scroll daría feedback visual de cuánto queda del artículo, algo habitual en medios de referencia.

### 14. Skeleton loaders en búsqueda y listados

Al navegar entre categorías o ejecutar una búsqueda, actualmente no hay estado de carga visible. Añadir skeletons evitaría el CLS (Cumulative Layout Shift) y haría la transición más fluida.

---

## Internacionalización

### 15. Contenido de artículos traducido

La i18n actual cubre la UI (etiquetas, botones, menús) pero el contenido de los artículos en `mock-data.ts` solo existe en español. Definir una estructura de datos multilingüe y añadir versiones en inglés (idioma ya configurado) completaría la experiencia para usuarios de `/en/`.
