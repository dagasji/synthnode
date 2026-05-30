# Diseño Técnico Frontend — Páginas Legales (synthnode.dev)

> Versión: 1.0
> Fecha: 2026-05-29
> Basado en: `docs/specs/02 - Paginas legales/requirements_paginas_legales.md` + `cod_style.md`

---

## 1. Resumen del Proyecto

**Problema**: synthnode.dev carece de páginas legales obligatorias (aviso legal, privacidad, cookies) y de un canal de contacto.

**Solución**: Cuatro páginas estáticas Server Components bajo `src/app/[locale]/`. Contenido en i18n. Un único componente cliente (`ContactForm`) para el formulario de contacto.

**Alcance**: Legal, Privacy, Cookies, Contact. Actualización del footer con enlaces. Sin backend propio — formulario vía web3forms.

---

## 2. Objetivos del Frontend

1. Cuatro rutas nuevas accesibles en todos los locales (es, en, pt-BR, ja, ko).
2. Cero texto hardcoded — todo en `messages/*.json`.
3. Metadata SEO completa con hreflang en los 5 locales.
4. `npm run build` sin errores ni warnings.
5. `npm run type-check` y `npm run lint` pasan.
6. Footer actualizado con los 4 enlaces.

---

## 3. Stack Tecnológico

Sin cambios respecto al proyecto. Dependencias existentes cubren todo el alcance.

| Tecnología   | Versión   | Uso en este módulo                                              |
| ------------ | --------- | --------------------------------------------------------------- |
| Next.js 15   | existente | App Router, Server Components, `generateMetadata`               |
| next-intl 3  | existente | `getTranslations` server-side, `useTranslations` en ContactForm |
| Tailwind CSS | existente | Estilos de todas las páginas                                    |
| shadcn/ui    | existente | `Button`, `Input`, `Textarea` en ContactForm                    |
| web3forms    | externo   | Envío del formulario de contacto (sin backend propio)           |

**Dependencia nueva**: ninguna. Solo se añade `NEXT_PUBLIC_WEB3FORMS_KEY` como env var.

---

## 4. Internacionalización (i18n)

### 4.1 Locales

| Locale  | Estado     | URL base          |
| ------- | ---------- | ----------------- |
| `es`    | Default    | `/` (sin prefijo) |
| `en`    | Secundario | `/en`             |
| `pt-BR` | Secundario | `/pt-BR`          |
| `ja`    | Secundario | `/ja`             |
| `ko`    | Secundario | `/ko`             |

Configuración existente en `src/middleware.ts` — no se modifica.

### 4.2 Namespaces nuevos

Añadir a los 5 ficheros `src/messages/*.json`:

```
legal      → página /legal
privacy    → página /privacy
cookies    → página /cookies
contact    → página /contact + componente ContactForm
```

Claves del namespace `common.footer` a añadir:

```json
{
  "common": {
    "footer": {
      "legalLabel": "Legal",
      "legal": "Aviso Legal",
      "privacy": "Privacidad",
      "cookies": "Cookies",
      "contact": "Contacto"
    }
  }
}
```

### 4.3 Estructura completa de claves nuevas (es.json)

```json
{
  "legal": {
    "meta": {
      "title": "Aviso Legal — Synthnode",
      "description": "Aviso legal del sitio synthnode.dev. Información sobre el titular, condiciones de uso y propiedad intelectual."
    },
    "title": "Aviso Legal",
    "lastUpdated": "Última actualización: mayo de 2026",
    "owner": {
      "heading": "Titular del sitio",
      "body": "Synthnode es un proyecto de BinaryCore. Para cualquier consulta, utiliza la página de contacto del sitio."
    },
    "purpose": {
      "heading": "Finalidad del sitio",
      "body": "Synthnode es un medio de información tecnológica. Los contenidos se publican con fines informativos y no constituyen asesoramiento profesional."
    },
    "liability": {
      "heading": "Limitación de responsabilidad",
      "body": "BinaryCore no garantiza la exactitud o idoneidad de los contenidos. El usuario asume la responsabilidad del uso que haga de la información publicada."
    },
    "intellectualProperty": {
      "heading": "Propiedad intelectual",
      "body": "El código, diseño y contenidos del sitio son propiedad de BinaryCore. Queda prohibida su reproducción sin autorización expresa."
    },
    "governing": {
      "heading": "Legislación aplicable",
      "body": "Este aviso legal se rige por la legislación española. Para cualquier litigio, las partes se someten a los juzgados y tribunales de España."
    },
    "contact": {
      "heading": "Contacto",
      "body": "Para cualquier consulta legal, utiliza el formulario de contacto disponible en este sitio."
    }
  },
  "privacy": {
    "meta": {
      "title": "Política de Privacidad — Synthnode",
      "description": "Cómo tratamos tus datos en synthnode.dev. Sin recopilación de datos personales; procesamiento local en tu navegador."
    },
    "title": "Política de Privacidad",
    "lastUpdated": "Última actualización: mayo de 2026",
    "intro": {
      "heading": "Introducción",
      "body": "En Synthnode la privacidad es una prioridad. Esta política explica cómo gestionamos la información de los usuarios."
    },
    "localProcessing": {
      "heading": "Procesamiento local de datos",
      "body": "Todo el contenido se sirve de forma estática. No enviamos ningún dato tuyo a servidores propios."
    },
    "noDataCollection": {
      "heading": "Datos que NO recopilamos",
      "items": [
        "Contenido que leas o busques",
        "Tokens o credenciales",
        "Información de identificación personal",
        "Historial de navegación dentro del sitio"
      ]
    },
    "cookies": {
      "heading": "Cookies y servicios de terceros",
      "body": "Utilizamos Google Analytics (GA4) y Google AdSense. Estos servicios instalan cookies propias. Consulta nuestra política de cookies para más detalle."
    },
    "thirdParty": {
      "heading": "Servicios de terceros",
      "body": "El proveedor de hosting puede registrar IPs y páginas visitadas por razones de seguridad. No compartimos datos con terceros con fines de marketing."
    },
    "security": {
      "heading": "Seguridad",
      "body": "Accede siempre mediante HTTPS. Mantén tu navegador actualizado para garantizar la seguridad de tu conexión."
    },
    "changes": {
      "heading": "Cambios en esta política",
      "body": "Esta política puede actualizarse. Revisa la fecha de última actualización al inicio de esta página."
    },
    "contact": {
      "heading": "Contacto",
      "body": "Para cualquier consulta sobre privacidad, usa el formulario de contacto del sitio."
    }
  },
  "cookies": {
    "meta": {
      "title": "Política de Cookies — Synthnode",
      "description": "Qué cookies usa synthnode.dev, para qué sirven y cómo gestionarlas."
    },
    "title": "Política de Cookies",
    "lastUpdated": "Última actualización: mayo de 2026",
    "intro": {
      "heading": "¿Qué son las cookies?",
      "body": "Las cookies son pequeños ficheros de texto que los sitios web almacenan en tu navegador para guardar preferencias y analizar el uso."
    },
    "ownCookies": {
      "heading": "Cookies propias",
      "body": "Solo usamos localStorage para guardar tu preferencia de consentimiento de cookies. No se envía al servidor."
    },
    "thirdPartyCookies": {
      "heading": "Cookies de terceros",
      "items": [
        "Google Analytics (GA4): analítica de tráfico anonimizada.",
        "Google AdSense: publicidad personalizada basada en tu navegación."
      ]
    },
    "consent": {
      "heading": "Tu consentimiento",
      "body": "Al aceptar, habilitas GA y AdSense. Al rechazar, ambos servicios quedan bloqueados; el sitio sigue siendo completamente funcional."
    },
    "howToDisable": {
      "heading": "Cómo gestionar las cookies",
      "body": "Puedes modificar tu consentimiento en cualquier momento mediante el botón de configuración de cookies (esquina inferior derecha) o desde la configuración de tu navegador."
    },
    "contact": {
      "heading": "Contacto",
      "body": "Para dudas sobre cookies, usa el formulario de contacto del sitio."
    }
  },
  "contact": {
    "meta": {
      "title": "Contacto — Synthnode",
      "description": "Contacta con el equipo de Synthnode. Reporta un error, propón contenido o envíanos un mensaje."
    },
    "title": "Contacto",
    "subtitle": "¿Tienes algo que decirnos? Estamos encantados de escucharte.",
    "bugCard": {
      "title": "Reportar un error",
      "description": "Describe el problema y los pasos para reproducirlo."
    },
    "suggestionCard": {
      "title": "Proponer contenido",
      "description": "Cuéntanos qué temas o artículos te gustaría ver en Synthnode."
    },
    "formCard": {
      "title": "Formulario de contacto"
    },
    "form": {
      "name": "Nombre",
      "email": "Correo electrónico",
      "message": "Mensaje",
      "submit": "Enviar mensaje",
      "submitting": "Enviando...",
      "success": "Mensaje enviado correctamente. Te responderemos pronto.",
      "error": "Ha ocurrido un error. Por favor, inténtalo de nuevo."
    }
  }
}
```

### 4.4 Regla i18n

Textos para `pt-BR`, `ja`, `ko`: traducir desde `en.json`. Si no hay traducción disponible, usar el valor en inglés y marcar con comentario `// TODO: translate` en el fichero de tareas (los JSON no admiten comentarios).

### 4.5 Uso en páginas (Server Components)

```typescript
import { getTranslations } from "next-intl/server";

// En generateMetadata:
const t = await getTranslations({ locale, namespace: "legal.meta" });

// En el componente:
const t = await getTranslations("legal");
t("title"); // → "Aviso Legal"
t("owner.heading"); // → "Titular del sitio"
```

### 4.6 Uso en ContactForm (Client Component)

```typescript
"use client";
import { useTranslations } from "next-intl";
const t = useTranslations("contact.form");
t("submit"); // → "Enviar mensaje"
```

---

## 5. Arquitectura

### 5.1 Rendering

| Página     | Estrategia                        | Justificación                                                                                                                                  |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/legal`   | SSG estático                      | Contenido invariante, no hay `generateStaticParams` necesario — Next.js lo renderiza como estático automáticamente al no tener datos dinámicos |
| `/privacy` | SSG estático                      | Idem                                                                                                                                           |
| `/cookies` | SSG estático                      | Idem                                                                                                                                           |
| `/contact` | SSG estático (shell) + CSR (form) | Página estática; `ContactForm` es client component                                                                                             |

**Nota**: Sin `generateStaticParams` explícito. Las páginas `[locale]/*/page.tsx` sin datos dinámicos se comportan como estáticas en build.

### 5.2 Patrón de URL localizada

Función `localePath` — definida inline en cada `page.tsx` (patrón existente en el proyecto):

```typescript
function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}
```

Importar `BASE_URL` desde `@/lib/constants/site`.

### 5.3 Locales en alternates

Incluir los 5 locales en cada `generateMetadata`:

```typescript
alternates: {
  canonical: localePath("es", "/legal"),
  languages: {
    es: localePath("es", "/legal"),
    en: localePath("en", "/legal"),
    "pt-BR": localePath("pt-BR", "/legal"),
    ja: localePath("ja", "/legal"),
    ko: localePath("ko", "/legal"),
    "x-default": localePath("es", "/legal"),
  },
}
```

---

## 6. Estructura de Archivos

### Nuevos archivos

```
src/
  app/
    [locale]/
      legal/
        page.tsx                          # Server Component — Aviso Legal
      privacy/
        page.tsx                          # Server Component — Política de Privacidad
      cookies/
        page.tsx                          # Server Component — Política de Cookies
      contact/
        page.tsx                          # Server Component — shell de Contacto
  components/
    contact/
      ContactForm.tsx                     # Client Component — formulario web3forms
```

### Archivos modificados

```
src/messages/es.json                      # +4 namespaces + common.footer.legalLabel/legal/privacy/cookies/contact
src/messages/en.json                      # idem en inglés
src/messages/pt-BR.json                   # idem (traducción desde en)
src/messages/ja.json                      # idem (traducción desde en)
src/messages/ko.json                      # idem (traducción desde en)
src/components/layout/footer.tsx          # +columna Legal con 4 enlaces
.env.local                                # +NEXT_PUBLIC_WEB3FORMS_KEY=
```

---

## 7. Routing y Páginas

### 7.1 Mapa de rutas

| Ruta ES    | Ruta EN       | Archivo                         | Indexable |
| ---------- | ------------- | ------------------------------- | --------- |
| `/legal`   | `/en/legal`   | `app/[locale]/legal/page.tsx`   | Sí        |
| `/privacy` | `/en/privacy` | `app/[locale]/privacy/page.tsx` | Sí        |
| `/cookies` | `/en/cookies` | `app/[locale]/cookies/page.tsx` | Sí        |
| `/contact` | `/en/contact` | `app/[locale]/contact/page.tsx` | Sí        |

### 7.2 Especificación: `/legal`

**Propósito**: Aviso legal obligatorio.

**Layout**:

```
max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10
  <header>
    <p class="label-mono text-brand">// LEGAL_NOTICE</p>
    <h1>t("title")</h1>
    <p class="text-sm text-muted-foreground">t("lastUpdated")</p>
  </header>
  <section> × 6  (owner, purpose, liability, intellectualProperty, governing, contact)
    <h2>t("*.heading")</h2>
    <p>t("*.body")</p>
```

**Metadata**: namespace `legal.meta`. Canonical → `/legal` (es sin prefijo).

**Estado**: ninguno.

### 7.3 Especificación: `/privacy`

**Propósito**: Política de privacidad RGPD.

**Layout**: igual que `/legal`.

**Secciones** (8): intro, localProcessing, noDataCollection (con `<ul>`), cookies, thirdParty, security, changes, contact.

La sección `noDataCollection` renderiza una lista:

```tsx
<ul className="list-disc list-inside space-y-1 text-muted-foreground">
  {/* t.raw("noDataCollection.items") as string[] → map → <li> */}
</ul>
```

**Metadata**: namespace `privacy.meta`.

### 7.4 Especificación: `/cookies`

**Propósito**: Política de cookies RGPD.

**Layout**: igual que `/legal`.

**Secciones** (6): intro, ownCookies, thirdPartyCookies (con `<ul>`), consent, howToDisable, contact.

La sección `thirdPartyCookies` renderiza una lista igual que `noDataCollection`.

**Metadata**: namespace `cookies.meta`.

### 7.5 Especificación: `/contact`

**Propósito**: Canal de contacto.

**Layout**:

```
max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-10
  <header>
    <p class="label-mono text-brand">// CONTACT</p>
    <h1>t("title")</h1>
    <p class="text-muted-foreground">t("subtitle")</p>
  </header>
  <div class="space-y-6">
    <!-- Card: bugCard -->
    <div class="bg-muted/50 p-6 rounded-lg border border-border">
      <h2 class="text-lg font-semibold mb-1">t("bugCard.title")</h2>
      <p class="text-sm text-muted-foreground">t("bugCard.description")</p>
    </div>
    <!-- Card: suggestionCard -->
    <div class="bg-muted/50 p-6 rounded-lg border border-border"> ... </div>
    <!-- Card: formulario -->
    <div class="bg-muted/50 p-6 rounded-lg border border-border">
      <h2 class="text-lg font-semibold mb-4">t("formCard.title")</h2>
      <ContactForm />
    </div>
  </div>
```

**Metadata**: namespace `contact.meta`.

---

## 8. Catálogo de Componentes

### `<ContactForm />`

**Ubicación**: `src/components/contact/ContactForm.tsx`
**Tipo**: Client Component (`"use client"`)
**Responsabilidad**: Formulario de 3 campos con envío a web3forms y feedback visual.

**Props**: ninguna.

**Estado interno**:

```typescript
type FormStatus = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<FormStatus>("idle");
```

**Campos**:

```typescript
interface FormData {
  name: string; // <Input type="text" required />
  email: string; // <Input type="email" required />
  message: string; // <Textarea required />
}
```

**Lógica de envío**:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setStatus("loading");
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  } catch {
    setStatus("error");
  }
};
```

**Feedback visual**:

- `success`: banner verde (`bg-green-50 border-green-200 text-green-800`) con `t("success")`
- `error`: banner rojo (`bg-red-50 border-red-200 text-red-800`) con `t("error")`
- `loading`: botón disabled, texto `t("submitting")`

**Textos i18n**: `useTranslations("contact.form")` → `name`, `email`, `message`, `submit`, `submitting`, `success`, `error`.

**Dependencias**: `Button`, `Input`, `Textarea` de `src/components/ui/`.

**A11y**: `<form>` con `aria-label`, labels visibles para cada campo (`<label htmlFor>`), `aria-live="polite"` en el banner de feedback.

**Manejo de errores**: estado `error` → banner visible. No rompe la UI. Sin `console.log` en producción.

---

### `<Footer />` (modificado)

**Ubicación**: `src/components/layout/footer.tsx`
**Cambio**: añadir columna "Legal" con 4 enlaces.

**Nueva columna**:

```tsx
<div>
  <h4 className="label-mono text-foreground mb-3">{t("footer.legalLabel")}</h4>
  <ul className="space-y-2 text-sm text-muted-foreground">
    <li>
      <Link href="/legal" className="hover:text-foreground">
        {t("footer.legal")}
      </Link>
    </li>
    <li>
      <Link href="/privacy" className="hover:text-foreground">
        {t("footer.privacy")}
      </Link>
    </li>
    <li>
      <Link href="/cookies" className="hover:text-foreground">
        {t("footer.cookies")}
      </Link>
    </li>
    <li>
      <Link href="/contact" className="hover:text-foreground">
        {t("footer.contact")}
      </Link>
    </li>
  </ul>
</div>
```

**Nota**: el footer usa `import Link from "next/link"` (ya existente). `next-intl` gestiona el prefijo de locale automáticamente vía middleware — no se necesita un `Link` de next-intl para rutas sin prefijo.

---

## 9. Gestión de Estado

| Estado      | Alcance | Tecnología | Ubicación         |
| ----------- | ------- | ---------- | ----------------- |
| Form status | Local   | `useState` | `ContactForm.tsx` |
| Form data   | Local   | `useState` | `ContactForm.tsx` |

Sin estado global nuevo.

---

## 10. Fetching de Datos

No hay fetching de datos en estas páginas. Todo el contenido viene de i18n (traducción estática).

`ContactForm` hace un `fetch` POST a `https://api.web3forms.com/submit` en el evento `submit`. Sin cache, sin React Query.

---

## 11. SEO

### 11.1 Metadata por página

| Página     | `title` (es)                         | `robots`      |
| ---------- | ------------------------------------ | ------------- |
| `/legal`   | `Aviso Legal — Synthnode`            | index, follow |
| `/privacy` | `Política de Privacidad — Synthnode` | index, follow |
| `/cookies` | `Política de Cookies — Synthnode`    | index, follow |
| `/contact` | `Contacto — Synthnode`               | index, follow |

### 11.2 Hreflang

Cada página incluye `alternates` con los 5 locales + `x-default`. Ver patrón en §5.3.

`x-default` → siempre apunta a la URL en `es` (sin prefijo de locale).

### 11.3 Sitemap

Actualizar `src/app/sitemap.ts` para incluir las 4 nuevas rutas estáticas:

```typescript
const staticPaths = [
  // existentes...
  { path: "/legal", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/contact", priority: 0.5 },
];
```

Cada ruta genera una entrada por locale con `alternates.languages` completos.

---

## 12. robots.txt

Sin cambios. Las nuevas páginas son públicas e indexables — ya cubiertas por la regla `allow: "/"`.

---

## 13. Performance

Sin impacto significativo. Páginas puramente estáticas + i18n. `ContactForm` es el único JS adicional (client bundle mínimo).

---

## 14. Estilos

Convenciones `cod_style.md` aplicadas:

- Tailwind CSS. Sin estilos inline.
- Clases definidas como literales — sin interpolación dinámica en clases (riesgo de purge).
- Variantes de estado (loading, error, success) con clases condicionales explícitas, no generadas.

**Clases de referencia**:

| Elemento                               | Clases                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Wrapper página (legal/privacy/cookies) | `max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10`                           |
| Wrapper página (contact)               | `max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-10`                           |
| Label monospace                        | `label-mono text-brand`                                                     |
| H1                                     | `text-4xl font-bold tracking-tight`                                         |
| H2 sección                             | `text-xl font-semibold mb-3`                                                |
| Párrafos                               | `text-muted-foreground leading-relaxed`                                     |
| Sección                                | `space-y-3`                                                                 |
| Lista `<ul>`                           | `list-disc list-inside space-y-1 text-muted-foreground`                     |
| Card info                              | `bg-muted/50 p-6 rounded-lg border border-border`                           |
| Banner success                         | `bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-md` |
| Banner error                           | `bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-md`       |

---

## 15. Accesibilidad

| Elemento          | Requisito A11y                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `<ContactForm />` | `<form aria-label>`, `<label htmlFor>` en cada campo, `aria-live="polite"` en banner feedback |
| Páginas legales   | Estructura semántica `<header>`, `<section>`, `<h1>`, `<h2>`                                  |
| Footer links      | Texto descriptivo (no "click aquí")                                                           |

---

## 16. Gestión de Errores

| Tipo                                        | Componente          | Acción                                                       |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------ |
| Error envío formulario                      | `ContactForm`       | Banner rojo con mensaje i18n. Sin `console.log`.             |
| Env var `NEXT_PUBLIC_WEB3FORMS_KEY` ausente | ContactForm runtime | El fetch falla → estado `error`. Documentar en `.env.local`. |

Páginas legales: sin errores posibles (contenido estático).

---

## 17. Variables de Entorno

| Variable                    | Propósito                   | Obligatoria                            |
| --------------------------- | --------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key de web3forms.com | Sí (solo para funcionar el formulario) |

Añadir a `.env.local` (no commitear el valor real).

---

## 18. Decisiones Técnicas

| Decisión                               | Alternativas                                       | Elegida                        | Por qué                                                      |
| -------------------------------------- | -------------------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| Servicio formulario                    | Formspree, EmailJS, backend propio                 | web3forms                      | Mismo servicio que devtoolshub — coherencia; sin backend     |
| `localePath`                           | Centralizar en `src/lib/seo/hreflang.ts`           | inline en cada `page.tsx`      | Patrón existente del proyecto; evitar refactor no solicitado |
| Footer columna "Legal"                 | Añadir al pie del copyright, nueva columna en grid | Nueva columna en el grid 3-col | Visibilidad y coherencia con estructura existente            |
| Listas i18n (`noDataCollection.items`) | Claves numeradas (`item0`, `item1`), array JSON    | Array JSON + `t.raw()`         | Más mantenible para listas variables                         |

---

## 19. Fuera de Alcance

- Gestión de consentimiento de cookies (banner CookieConsent) — no solicitado en este módulo.
- Internacionalización del contenido de las páginas legales a `pt-BR`, `ja`, `ko` con traducción real — se deja en inglés con `// TODO: translate` como nota en workplan.
- Backend propio para formulario de contacto.
- Tests unitarios o E2E para estas páginas — no solicitados en los requisitos.
- Página `/about` u otras páginas estáticas — no están en el alcance.
