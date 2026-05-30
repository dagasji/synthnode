# Requisitos: Páginas Legales — synthnode.dev

**Versión:** 1.0  
**Fecha:** 2026-05-29  
**Referencia:** Implementación análoga a `devtoolshub` adaptada a la arquitectura de synthnode

---

## 1. Descripción general

Crear cuatro páginas estáticas de contenido legal para el sitio `synthnode.dev`:

| Página | URL (es — default) | URL (en) |
|---|---|---|
| Aviso Legal | `/legal` | `/en/legal` |
| Política de Privacidad | `/privacy` | `/en/privacy` |
| Política de Cookies | `/cookies` | `/en/cookies` |
| Contacto | `/contact` | `/en/contact` |

El proyecto usa `next-intl` con `localePrefix: "as-needed"`, por lo que el locale por defecto (`es`) no lleva prefijo en la URL. Todos los textos deben estar externalizados en los ficheros de mensajes i18n (los 5 locales existentes: `es`, `en`, `pt-BR`, `ja`, `ko`).

---

## 2. Archivos a crear/modificar

### 2.1 Nuevas páginas

```
src/app/[locale]/legal/page.tsx
src/app/[locale]/privacy/page.tsx
src/app/[locale]/cookies/page.tsx
src/app/[locale]/contact/page.tsx
```

### 2.2 Nuevo componente (solo contacto)

```
src/components/contact/ContactForm.tsx       # "use client" — formulario de contacto
```

### 2.3 Ficheros i18n a actualizar (los 5 locales)

```
src/messages/es.json
src/messages/en.json
src/messages/pt-BR.json
src/messages/ja.json
src/messages/ko.json
```

Añadir los namespaces: `legal`, `privacy`, `cookies`, `contact`.

### 2.4 Footer — actualizar links

```
src/components/layout/footer.tsx
```

Añadir enlaces a las cuatro nuevas páginas en la sección correspondiente del footer.

---

## 3. Arquitectura y patrones de implementación

### 3.1 Estructura de cada página (Server Component)

Todas las páginas siguen el mismo patrón del proyecto:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/lib/constants/site";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.meta" });

  const localePath = (loc: string, path: string) =>
    `${BASE_URL}${loc === "es" ? "" : `/${loc}`}${path}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath(locale, "/legal"),
      languages: {
        es: localePath("es", "/legal"),
        en: localePath("en", "/legal"),
        "x-default": localePath("es", "/legal"),
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function LegalPage() {
  const t = await getTranslations("legal");
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">// LEGAL_NOTICE</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </header>
      {/* secciones */}
    </div>
  );
}
```

**Clases CSS a usar** (consistentes con el resto del proyecto):

| Elemento | Clases |
|---|---|
| Wrapper página | `max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10` |
| Label monospace | `label-mono text-brand` |
| H1 | `text-4xl font-bold tracking-tight` |
| H2 sección | `text-xl font-semibold mb-3` |
| Párrafos | `text-muted-foreground leading-relaxed` |
| Sección wrapper | `<section className="space-y-3">` |
| Listas `<ul>` | `list-disc list-inside space-y-1 text-muted-foreground` |
| Card destacada (contacto) | `bg-muted/50 p-6 rounded-lg border border-border` |

---

## 4. Contenido por página

### 4.1 Aviso Legal (`/legal`)

**Namespace i18n:** `legal`

| Clave | Contenido (es) |
|---|---|
| `meta.title` | `Aviso Legal — Synthnode` |
| `meta.description` | `Aviso legal del sitio synthnode.dev. Información sobre el titular, condiciones de uso y propiedad intelectual.` |
| `title` | `Aviso Legal` |
| `lastUpdated` | `Última actualización: mayo de 2026` |
| `owner.heading` | `Titular del sitio` |
| `owner.body` | `Synthnode es un proyecto de BinaryCore. Para cualquier consulta, utiliza la página de contacto del sitio.` |
| `purpose.heading` | `Finalidad del sitio` |
| `purpose.body` | `Synthnode es un medio de información tecnológica. Los contenidos se publican con fines informativos y no constituyen asesoramiento profesional.` |
| `liability.heading` | `Limitación de responsabilidad` |
| `liability.body` | `BinaryCore no garantiza la exactitud o idoneidad de los contenidos. El usuario asume la responsabilidad del uso que haga de la información publicada.` |
| `intellectualProperty.heading` | `Propiedad intelectual` |
| `intellectualProperty.body` | `El código, diseño y contenidos del sitio son propiedad de BinaryCore. Queda prohibida su reproducción sin autorización expresa.` |
| `governing.heading` | `Legislación aplicable` |
| `governing.body` | `Este aviso legal se rige por la legislación española. Para cualquier litigio, las partes se someten a los juzgados y tribunales de España.` |
| `contact.heading` | `Contacto` |
| `contact.body` | `Para cualquier consulta legal, utiliza el formulario de contacto disponible en este sitio.` |

---

### 4.2 Política de Privacidad (`/privacy`)

**Namespace i18n:** `privacy`

| Clave | Contenido (es) |
|---|---|
| `meta.title` | `Política de Privacidad — Synthnode` |
| `meta.description` | `Cómo tratamos tus datos en synthnode.dev. Sin recopilación de datos personales; procesamiento local en tu navegador.` |
| `title` | `Política de Privacidad` |
| `lastUpdated` | `Última actualización: mayo de 2026` |
| `intro.heading` | `Introducción` |
| `intro.body` | `En Synthnode la privacidad es una prioridad. Esta política explica cómo gestionamos la información de los usuarios.` |
| `localProcessing.heading` | `Procesamiento local de datos` |
| `localProcessing.body` | `Todo el contenido se sirve de forma estática. No enviamos ningún dato tuyo a servidores propios.` |
| `noDataCollection.heading` | `Datos que NO recopilamos` |
| `noDataCollection.items` | `["Contenido que leas o busques", "Tokens o credenciales", "Información de identificación personal", "Historial de navegación dentro del sitio"]` |
| `cookies.heading` | `Cookies y servicios de terceros` |
| `cookies.body` | `Utilizamos Google Analytics (GA4) y Google AdSense. Estos servicios instalan cookies propias. Consulta nuestra política de cookies para más detalle.` |
| `thirdParty.heading` | `Servicios de terceros` |
| `thirdParty.body` | `El proveedor de hosting puede registrar IPs y páginas visitadas por razones de seguridad. No compartimos datos con terceros con fines de marketing.` |
| `security.heading` | `Seguridad` |
| `security.body` | `Accede siempre mediante HTTPS. Mantén tu navegador actualizado para garantizar la seguridad de tu conexión.` |
| `changes.heading` | `Cambios en esta política` |
| `changes.body` | `Esta política puede actualizarse. Revisa la fecha de última actualización al inicio de esta página.` |
| `contact.heading` | `Contacto` |
| `contact.body` | `Para cualquier consulta sobre privacidad, usa el formulario de contacto del sitio.` |

---

### 4.3 Política de Cookies (`/cookies`)

**Namespace i18n:** `cookies`

| Clave | Contenido (es) |
|---|---|
| `meta.title` | `Política de Cookies — Synthnode` |
| `meta.description` | `Qué cookies usa synthnode.dev, para qué sirven y cómo gestionarlas.` |
| `title` | `Política de Cookies` |
| `lastUpdated` | `Última actualización: mayo de 2026` |
| `intro.heading` | `¿Qué son las cookies?` |
| `intro.body` | `Las cookies son pequeños ficheros de texto que los sitios web almacenan en tu navegador para guardar preferencias y analizar el uso.` |
| `ownCookies.heading` | `Cookies propias` |
| `ownCookies.body` | `Solo usamos \`localStorage\` para guardar tu preferencia de consentimiento de cookies. No se envía al servidor.` |
| `thirdPartyCookies.heading` | `Cookies de terceros` |
| `thirdPartyCookies.items` | `["Google Analytics (GA4): analítica de tráfico anonimizada.", "Google AdSense: publicidad personalizada basada en tu navegación."]` |
| `consent.heading` | `Tu consentimiento` |
| `consent.body` | `Al aceptar, habilitas GA y AdSense. Al rechazar, ambos servicios quedan bloqueados; el sitio sigue siendo completamente funcional.` |
| `howToDisable.heading` | `Cómo gestionar las cookies` |
| `howToDisable.body` | `Puedes modificar tu consentimiento en cualquier momento mediante el botón de configuración de cookies (esquina inferior derecha) o desde la configuración de tu navegador.` |
| `contact.heading` | `Contacto` |
| `contact.body` | `Para dudas sobre cookies, usa el formulario de contacto del sitio.` |

---

### 4.4 Contacto (`/contact`)

**Namespace i18n:** `contact`

Layout: `max-w-2xl` (más estrecho que las otras páginas, centrado).

| Clave | Contenido (es) |
|---|---|
| `meta.title` | `Contacto — Synthnode` |
| `meta.description` | `Contacta con el equipo de Synthnode. Reporta un error, propón contenido o envíanos un mensaje.` |
| `title` | `Contacto` |
| `subtitle` | `¿Tienes algo que decirnos? Estamos encantados de escucharte.` |
| `bugCard.title` | `Reportar un error` |
| `bugCard.description` | `Describe el problema y los pasos para reproducirlo.` |
| `suggestionCard.title` | `Proponer contenido` |
| `suggestionCard.description` | `Cuéntanos qué temas o artículos te gustaría ver en Synthnode.` |
| `formCard.title` | `Formulario de contacto` |
| `form.name` | `Nombre` |
| `form.email` | `Correo electrónico` |
| `form.message` | `Mensaje` |
| `form.submit` | `Enviar mensaje` |
| `form.submitting` | `Enviando...` |
| `form.success` | `Mensaje enviado correctamente. Te responderemos pronto.` |
| `form.error` | `Ha ocurrido un error. Por favor, inténtalo de nuevo.` |

#### Componente ContactForm

```
src/components/contact/ContactForm.tsx
```

- `"use client"` — componente cliente
- Campos: `name` (text, requerido), `email` (email, requerido), `message` (textarea, requerido)
- Estados del formulario: `idle | loading | success | error`
- Envío mediante `fetch` a `https://api.web3forms.com/submit` (mismo servicio que devtoolshub)
  - Se requiere variable de entorno: `NEXT_PUBLIC_WEB3FORMS_KEY`
- Muestra banner verde en success y rojo en error
- Auto-reset a `idle` tras 5 segundos en estado success
- Usar primitivas de `src/components/ui/` para inputs, botones, etc. (Button, Input, Textarea)
- Usar `useTranslations("contact.form")` para los textos

---

## 5. Actualización del Footer

Modificar `src/components/layout/footer.tsx` para añadir los enlaces a las nuevas páginas.

Añadir una nueva columna o sección "Legal" con los siguientes enlaces:

```tsx
// Usar Link de next-intl para que el prefijo de locale se aplique automáticamente
import Link from "next/link";  // o el Link del proyecto si ya es locale-aware

<Link href="/legal">{t("footer.legal")}</Link>
<Link href="/privacy">{t("footer.privacy")}</Link>
<Link href="/cookies">{t("footer.cookies")}</Link>
<Link href="/contact">{t("footer.contact")}</Link>
```

Añadir las claves i18n correspondientes al namespace `common.footer`:

```json
{
  "legal": "Aviso Legal",
  "privacy": "Privacidad",
  "cookies": "Cookies",
  "contact": "Contacto"
}
```

---

## 6. Variables de entorno

| Variable | Propósito | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key de [web3forms.com](https://web3forms.com) para el formulario de contacto | Sí (solo para contacto) |

Añadir a `.env.local` y documentar en `.env.example` si existe.

---

## 7. SEO y metadatos

Cada página debe implementar `generateMetadata` con:

- `title` y `description` desde i18n
- `alternates.canonical` apuntando a la URL canónica (`es` sin prefijo)
- `alternates.languages` con los 5 locales: `es`, `en`, `pt-BR`, `ja`, `ko`, más `x-default` → `es`
- `openGraph.type: "website"`

Patrón helper (a definir inline en cada página o extraer a `src/lib/utils.ts`):

```ts
const localePath = (locale: string, path: string) =>
  `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
```

---

## 8. Criterios de aceptación

- [ ] Las cuatro páginas renderizan sin errores en local (`npm run dev`)
- [ ] La build de producción pasa sin errores (`npm run build`)
- [ ] Cada página devuelve el contenido correcto para `es` y `en` (verificar cambiando locale en navbar)
- [ ] El formulario de contacto envía correctamente (requiere `NEXT_PUBLIC_WEB3FORMS_KEY` válida)
- [ ] El footer incluye enlaces funcionales a las cuatro páginas
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Las etiquetas `<link rel="alternate" hreflang>` están presentes en el `<head>` de cada página
- [ ] Los 5 ficheros de mensajes tienen los namespaces añadidos (`es`, `en`, `pt-BR`, `ja`, `ko`)

---

## 9. Notas de implementación

- **No usar `generateStaticParams`** para estas páginas — son estáticas por naturaleza y no dependen de datos dinámicos.
- **No crear nuevos tipos** en `src/lib/types.ts` — no hay entidades de datos nuevas.
- **No crear nuevas rutas de API** — el formulario de contacto usa directamente web3forms (servicio externo).
- El componente `ContactForm` es el único componente nuevo `"use client"`. Las cuatro páginas en sí son Server Components.
- Seguir el patrón de `await params` para recibir el locale, tal como hacen `category/[slug]/page.tsx` y `news/[slug]/page.tsx`.
- Los textos para `pt-BR`, `ja` y `ko` pueden quedar en inglés inicialmente si no hay traducción disponible — marcar con un comentario `// TODO: translate`.
