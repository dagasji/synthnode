# Plan de Trabajo Frontend — Páginas Legales (synthnode.dev)

> Versión: 1.0
> Fecha: 2026-05-29
> Diseño técnico: `docs/analysis/design-paginas-legales.md`
> Estimación total: 3 sesiones

---

## Convenciones

- **[BLOQUEANTE]**: debe completarse antes de la tarea siguiente que lo referencia.
- **[PARALELO]**: ejecutable en paralelo con otras tareas de la misma fase.
- Cada tarea referencia `→ design §[N]`.

---

## Fase 1: i18n — Ficheros de mensajes

**Objetivo**: Todas las claves nuevas en los 5 locales. Sin texto hardcoded en ningún componente posterior.

**Entregables**:

- Namespaces `legal`, `privacy`, `cookies`, `contact` en `es.json`, `en.json`, `pt-BR.json`, `ja.json`, `ko.json`.
- Claves `common.footer.legalLabel/legal/privacy/cookies/contact` en los 5 ficheros.

**Estimación**: 1 sesión

### Tareas

- [ ] **1.1** — Añadir namespace `legal` a `src/messages/es.json` [BLOQUEANTE]
  - Contenido exacto: `→ design §4.3` (bloque `"legal": { ... }`)
  - Verificación: `node -e "const m=require('./src/messages/es.json'); console.log(m.legal.title)"` → `Aviso Legal`
  - `→ design §4.3`

- [ ] **1.2** — Añadir namespace `privacy` a `src/messages/es.json` [BLOQUEANTE]
  - Contenido exacto: `→ design §4.3` (bloque `"privacy": { ... }`)
  - Incluir `noDataCollection.items` como array JSON.
  - Verificación: `node -e "const m=require('./src/messages/es.json'); console.log(m.privacy.title)"` → `Política de Privacidad`
  - `→ design §4.3`

- [ ] **1.3** — Añadir namespace `cookies` a `src/messages/es.json` [BLOQUEANTE]
  - Contenido exacto: `→ design §4.3` (bloque `"cookies": { ... }`)
  - Incluir `thirdPartyCookies.items` como array JSON.
  - Verificación: `node -e "const m=require('./src/messages/es.json'); console.log(m.cookies.title)"` → `Política de Cookies`
  - `→ design §4.3`

- [ ] **1.4** — Añadir namespace `contact` a `src/messages/es.json` [BLOQUEANTE]
  - Contenido exacto: `→ design §4.3` (bloque `"contact": { ... }`)
  - Incluye claves de `contact.form.*`.
  - Verificación: `node -e "const m=require('./src/messages/es.json'); console.log(m.contact.form.submit)"` → `Enviar mensaje`
  - `→ design §4.3`

- [ ] **1.5** — Añadir claves `common.footer` nuevas a `src/messages/es.json`
  - Añadir: `legalLabel`, `legal`, `privacy`, `cookies`, `contact` dentro de `common.footer`.
  - Verificación: `node -e "const m=require('./src/messages/es.json'); console.log(m.common.footer.legal)"` → `Aviso Legal`
  - `→ design §4.2`

- [ ] **1.6** — Replicar todos los namespaces a `src/messages/en.json` [BLOQUEANTE para Fase 2]
  - Traducir al inglés los valores de 1.1–1.5.
  - Claves equivalentes:
    - `legal.title` → `Legal Notice`
    - `legal.meta.title` → `Legal Notice — Synthnode`
    - `privacy.title` → `Privacy Policy`
    - `privacy.meta.title` → `Privacy Policy — Synthnode`
    - `cookies.title` → `Cookie Policy`
    - `cookies.meta.title` → `Cookie Policy — Synthnode`
    - `contact.title` → `Contact`
    - `contact.form.submit` → `Send message`
    - `common.footer.legalLabel` → `Legal`
    - `common.footer.legal` → `Legal Notice`
    - `common.footer.privacy` → `Privacy`
    - `common.footer.cookies` → `Cookies`
    - `common.footer.contact` → `Contact`
  - Verificación: `node -e "const m=require('./src/messages/en.json'); console.log(m.legal.title)"` → `Legal Notice`
  - `→ design §4.2, §4.3`

- [ ] **1.7** — Replicar namespaces a `pt-BR.json`, `ja.json`, `ko.json` [PARALELO con 1.6]
  - Usar valores de `en.json` como base (traducción pendiente, aceptable para MVP).
  - Copiar exactamente el mismo JSON que `en.json` para los namespaces nuevos.
  - Verificación: los 3 ficheros son JSON válido (`node -e "require('./src/messages/pt-BR.json')"` sin error).
  - `→ design §4.4`

**Verificación final Fase 1**:

```bash
node -e "
const locales = ['es','en','pt-BR','ja','ko'];
locales.forEach(l => {
  const m = require('./src/messages/' + l + '.json');
  ['legal','privacy','cookies','contact'].forEach(ns => {
    if (!m[ns]) throw new Error('Missing namespace ' + ns + ' in ' + l);
  });
  console.log(l + ' OK');
});
"
```

---

## Fase 2: Páginas estáticas (legal, privacy, cookies)

**Objetivo**: Tres Server Components con layout correcto, secciones i18n, metadata SEO y hreflang.

**Prerequisito**: Fase 1 completada.

**Estimación**: 1 sesión

### Tareas

- [ ] **2.1** — Crear `src/app/[locale]/legal/page.tsx` [PARALELO con 2.2, 2.3]

  Estructura exacta:

  ```tsx
  import type { Metadata } from "next";
  import { getTranslations } from "next-intl/server";
  import { BASE_URL } from "@/lib/constants/site";

  interface Props {
    params: Promise<{ locale: string }>;
  }

  function localePath(locale: string, path: string): string {
    return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
  }

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "legal.meta" });
    return {
      title: t("title"),
      description: t("description"),
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
      },
      openGraph: { title: t("title"), description: t("description"), type: "website" },
    };
  }

  export default async function LegalPage() {
    const t = await getTranslations("legal");
    const sections = [
      "owner",
      "purpose",
      "liability",
      "intellectualProperty",
      "governing",
      "contact",
    ] as const;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <header className="space-y-2">
          <p className="label-mono text-brand">// LEGAL_NOTICE</p>
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
        </header>
        {sections.map((key) => (
          <section key={key} className="space-y-3">
            <h2 className="text-xl font-semibold">{t(`${key}.heading`)}</h2>
            <p className="text-muted-foreground leading-relaxed">{t(`${key}.body`)}</p>
          </section>
        ))}
      </div>
    );
  }
  ```

  Verificación:

  ```bash
  # En npm run dev:
  curl -s http://localhost:3000/legal | grep "Aviso Legal"          # → match
  curl -s http://localhost:3000/en/legal | grep "Legal Notice"      # → match
  curl -s http://localhost:3000/legal | grep 'hreflang'             # → 6 tags
  ```

  - `→ design §7.2, §5.3, §11.2`

- [ ] **2.2** — Crear `src/app/[locale]/privacy/page.tsx` [PARALELO con 2.1, 2.3]

  Misma estructura que 2.1. Diferencias:
  - Ruta: `/privacy`
  - Namespace: `privacy`
  - Label monospace: `// PRIVACY_POLICY`
  - Secciones: `intro`, `localProcessing`, `noDataCollection` (lista), `cookies`, `thirdParty`, `security`, `changes`, `contact`

  Sección `noDataCollection` con lista:

  ```tsx
  <section key="noDataCollection" className="space-y-3">
    <h2 className="text-xl font-semibold">{t("noDataCollection.heading")}</h2>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      {(t.raw("noDataCollection.items") as string[]).map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </section>
  ```

  Verificación:

  ```bash
  curl -s http://localhost:3000/privacy | grep "Política de Privacidad"  # → match
  curl -s http://localhost:3000/en/privacy | grep "Privacy Policy"       # → match
  ```

  - `→ design §7.3, §5.3, §11.2`

- [ ] **2.3** — Crear `src/app/[locale]/cookies/page.tsx` [PARALELO con 2.1, 2.2]

  Misma estructura. Diferencias:
  - Ruta: `/cookies`
  - Namespace: `cookies`
  - Label monospace: `// COOKIE_POLICY`
  - Secciones: `intro`, `ownCookies`, `thirdPartyCookies` (lista), `consent`, `howToDisable`, `contact`

  Sección `thirdPartyCookies` con lista: igual que `noDataCollection` en 2.2 pero con `t.raw("thirdPartyCookies.items")`.

  Verificación:

  ```bash
  curl -s http://localhost:3000/cookies | grep "Política de Cookies"   # → match
  curl -s http://localhost:3000/en/cookies | grep "Cookie Policy"      # → match
  ```

  - `→ design §7.4, §5.3, §11.2`

**Verificación final Fase 2**:

```bash
npm run type-check   # → sin errores
npm run lint         # → sin errores
npm run build        # → sin errores
```

---

## Fase 3: Contacto + Footer + Sitemap

**Objetivo**: Página de contacto funcional, footer actualizado, sitemap con rutas nuevas.

**Prerequisito**: Fases 1 y 2 completadas.

**Estimación**: 1 sesión

### Tareas

- [ ] **3.1** — Crear `src/components/contact/ContactForm.tsx` [BLOQUEANTE para 3.2]

  Componente completo según `→ design §8 <ContactForm />`:

  ```tsx
  "use client";

  import { useState } from "react";
  import { useTranslations } from "next-intl";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";

  type FormStatus = "idle" | "loading" | "success" | "error";

  interface FormData {
    name: string;
    email: string;
    message: string;
  }

  export function ContactForm() {
    const t = useTranslations("contact.form");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("loading");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
            ...formData,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => setStatus("idle"), 5000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    return (
      <form onSubmit={handleSubmit} aria-label={t("submit")} className="space-y-4">
        {status === "success" && (
          <div
            aria-live="polite"
            className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-md"
          >
            {t("success")}
          </div>
        )}
        {status === "error" && (
          <div
            aria-live="polite"
            className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-md"
          >
            {t("error")}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            {t("name")}
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            {t("email")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="message" className="text-sm font-medium">
            {t("message")}
          </label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? t("submitting") : t("submit")}
        </Button>
      </form>
    );
  }
  ```

  Verificación: `npm run type-check` → sin errores en este fichero.
  - `→ design §8 <ContactForm />`

- [ ] **3.2** — Crear `src/app/[locale]/contact/page.tsx`

  Estructura:

  ```tsx
  import type { Metadata } from "next";
  import { getTranslations } from "next-intl/server";
  import { BASE_URL } from "@/lib/constants/site";
  import { ContactForm } from "@/components/contact/ContactForm";

  // localePath helper igual que en otras páginas

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    /* ... contact.meta */
  }

  export default async function ContactPage() {
    const t = await getTranslations("contact");
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <header className="space-y-2">
          <p className="label-mono text-brand">// CONTACT</p>
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground leading-relaxed">{t("subtitle")}</p>
        </header>
        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-1">{t("bugCard.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("bugCard.description")}</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-1">{t("suggestionCard.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("suggestionCard.description")}</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4">{t("formCard.title")}</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    );
  }
  ```

  Verificación:

  ```bash
  curl -s http://localhost:3000/contact | grep "Contacto"          # → match
  curl -s http://localhost:3000/en/contact | grep "Contact"        # → match
  curl -s http://localhost:3000/contact | grep 'hreflang'          # → 6 tags
  ```

  - `→ design §7.5`

- [ ] **3.3** — Actualizar `src/components/layout/footer.tsx`

  Añadir columna "Legal" en el `<div className="grid cols-2 md:grid-cols-3">` (cambiar a `md:grid-cols-4` o añadir después del tercer bloque):

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

  Actualizar clase del grid: `grid-cols-2 md:grid-cols-4` (de 3 a 4 columnas).

  Verificación:

  ```bash
  curl -s http://localhost:3000 | grep "/legal"     # → match
  curl -s http://localhost:3000 | grep "/privacy"   # → match
  ```

  - `→ design §8 <Footer />`

- [ ] **3.4** — Actualizar `src/app/sitemap.ts`

  Añadir las 4 rutas al array `staticPaths` (o equivalente):

  ```typescript
  { path: "/legal", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/contact", priority: 0.5 },
  ```

  Verificación:

  ```bash
  npm run build && npm start &
  curl -s http://localhost:3000/sitemap.xml | grep "/legal"     # → match
  curl -s http://localhost:3000/sitemap.xml | grep "/privacy"   # → match
  curl -s http://localhost:3000/sitemap.xml | grep "/cookies"   # → match
  curl -s http://localhost:3000/sitemap.xml | grep "/contact"   # → match
  ```

  - `→ design §11.3`

- [ ] **3.5** — Añadir `NEXT_PUBLIC_WEB3FORMS_KEY` a `.env.local`

  ```bash
  echo "NEXT_PUBLIC_WEB3FORMS_KEY=" >> .env.local
  ```

  Anotar en el README o en documentación del proyecto que se necesita una key válida de [web3forms.com](https://web3forms.com) para que el formulario funcione.
  - `→ design §17`

**Verificación final Fase 3**:

```bash
npm run type-check   # → 0 errores
npm run lint         # → 0 errores
npm run build        # → build exitoso sin warnings críticos
```

Verificación manual (con `npm run dev`):

| URL                                | Comprobación                                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `http://localhost:3000/legal`      | Renderiza "Aviso Legal", 6 secciones                                   |
| `http://localhost:3000/en/legal`   | Renderiza "Legal Notice", 6 secciones                                  |
| `http://localhost:3000/privacy`    | Renderiza "Política de Privacidad", lista de items en noDataCollection |
| `http://localhost:3000/en/privacy` | Renderiza "Privacy Policy"                                             |
| `http://localhost:3000/cookies`    | Renderiza "Política de Cookies", lista en thirdPartyCookies            |
| `http://localhost:3000/en/cookies` | Renderiza "Cookie Policy"                                              |
| `http://localhost:3000/contact`    | Renderiza formulario con 3 campos + 2 cards de info                    |
| `http://localhost:3000/en/contact` | Renderiza en inglés                                                    |
| Footer en cualquier página         | Columna "Legal" con 4 links visibles                                   |

---

## Resumen de Dependencias

```
Fase 1 (i18n — mensajes)
    ↓ [BLOQUEANTE]
Fase 2 (páginas legal/privacy/cookies)  ← paralelas entre sí
    ↓ [BLOQUEANTE]
Fase 3 (contact + footer + sitemap)
```

---

## Checklist Final de Entrega

- [ ] `npm run type-check` → 0 errores
- [ ] `npm run lint` → 0 errores
- [ ] `npm run build` → build exitoso
- [ ] Las 4 páginas responden 200 en `es` y `en`
- [ ] Cada página tiene 6 tags `hreflang` en el `<head>` (es, en, pt-BR, ja, ko, x-default)
- [ ] `canonical` apunta a URL sin prefijo de locale para `es`
- [ ] Footer muestra columna "Legal" con 4 enlaces funcionales
- [ ] Sitemap incluye las 4 nuevas rutas
- [ ] `.env.local` contiene `NEXT_PUBLIC_WEB3FORMS_KEY`
- [ ] `NEXT_PUBLIC_WEB3FORMS_KEY` documentada en equipo (no commitear el valor)
