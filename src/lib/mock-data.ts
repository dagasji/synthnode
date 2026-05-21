import type { Category, NewsArticle } from "./types";

const heroAi = "/news/hero-ai.jpg";
const rust = "/news/rust.jpg";
const security = "/news/security.jpg";
const startup = "/news/startup.jpg";
const neural = "/news/neural.jpg";
const devops = "/news/devops.jpg";

export const categories: Category[] = [
  {
    slug: "ai",
    name: "Inteligencia Artificial",
    description: "Modelos, investigación y producto en IA.",
    accent: "indigo",
  },
  {
    slug: "programming",
    name: "Programación",
    description: "Lenguajes, paradigmas y craft.",
    accent: "indigo",
  },
  {
    slug: "web-dev",
    name: "Web Development",
    description: "Frameworks, runtimes y plataformas.",
    accent: "indigo",
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "Infraestructura, CI/CD y observabilidad.",
    accent: "indigo",
  },
  {
    slug: "startups",
    name: "Startups",
    description: "Producto, capital y founders técnicos.",
    accent: "indigo",
  },
  {
    slug: "open-source",
    name: "Open Source",
    description: "Proyectos, comunidad y gobernanza.",
    accent: "indigo",
  },
  {
    slug: "security",
    name: "Ciberseguridad",
    description: "Vulnerabilidades, criptografía y defensa.",
    accent: "indigo",
  },
];

const authors = {
  julian: {
    name: "Julián Vega",
    role: "Editor de Infraestructura",
    avatarColor: "oklch(0.7 0.15 30)",
  },
  sara: { name: "Sara Köhler", role: "Análisis de Producto", avatarColor: "oklch(0.7 0.15 277)" },
  noa: { name: "Noa Levi", role: "Investigación IA", avatarColor: "oklch(0.7 0.15 160)" },
  dax: { name: "Dax Reyes", role: "Sistemas y Kernel", avatarColor: "oklch(0.7 0.15 90)" },
  iria: { name: "Iria Castro", role: "Capital y Mercados", avatarColor: "oklch(0.7 0.15 320)" },
};

const longBody = (intro: string) => `${intro}

## El contexto

La industria atraviesa un punto de inflexión. Lo que hasta hace 18 meses era un campo dominado por publicaciones académicas hoy define la hoja de ruta de las plataformas más relevantes del mundo. Conviene mirar con cuidado qué está cambiando y qué se mantiene.

> "Cada vez que el coste marginal de la inteligencia cae un orden de magnitud, la forma del software se reescribe."

Los equipos están reorganizando su stack alrededor de tres principios claros: latencia baja, datos cerca del modelo y observabilidad de extremo a extremo.

## Lo que hay debajo

A nivel de infraestructura, varios patrones se repiten:

- Inferencia desplegada con **autoscaling agresivo** y aceleradores compartidos por tenant.
- Vector stores integrados directamente en la base de datos transaccional.
- Capas de *guardrails* declarativas que permiten auditar cada llamada al modelo.
- Migración progresiva de scripts de despliegue hacia *agentic workflows* parametrizados.

\`\`\`ts
// Ejemplo simplificado de una llamada con guardrails
const result = await ai.generate({
  model: "frontier-1",
  input,
  guardrails: ["pii-redact", "tool-allowlist"],
});
\`\`\`

## Implicaciones para el producto

El cambio no es solo técnico. Los equipos de producto están descubriendo que las funcionalidades más útiles aparecen cuando se elimina la fricción entre el dato y la decisión. Eso obliga a repensar UX, modelos mentales y, sobre todo, ciclos de feedback.

### Tres preguntas para tu equipo

1. ¿Dónde vive tu *source of truth* y a qué distancia está del modelo?
2. ¿Cuántos saltos de red mete tu pipeline antes de devolver una respuesta?
3. ¿Tienes una métrica clara de calidad por intención de usuario?

## Qué viene

Si la tendencia se mantiene, los próximos doce meses traerán consolidación de plataformas, una segunda ola de herramientas open source y, probablemente, regulación específica para el despliegue en sectores críticos. Conviene prepararse, no reaccionar.`;

export const news: NewsArticle[] = [
  {
    slug: "codegraph-grafo-conocimiento-94-menos-tool-calls",
    title:
      "CodeGraph: El grafo de conocimiento que reduce en un 92% las llamadas de herramientas en agentes de código",
    excerpt:
      "Pre-indexa tu codebase con un grafo semántico local. Claude Code, Cursor, Codex y OpenCode ganan 71% de velocidad en exploración.",
    content: `Explorar un codebase con OpenCode, Windsurf o Claude Code puede convertirse muy rápido en una pequeña búsqueda del tesoro: el agente va probando con grep, glob y Read mientras consume tokens en cada paso. Antes de llegar a la parte útil, primero toca encontrar dónde vive cada cosa.

Si alguna vez has pasado 20 minutos preguntándole a un agente "¿dónde está esta función?", ya sabes de qué va el problema. CodeGraph intenta quitarle fricción a ese momento y convertir la conversación en algo mucho más directo: menos arqueología, más respuestas.

Y no es un proyecto que haya pasado desapercibido. En muy poco tiempo ya supera las 7.300 estrellas en GitHub, una señal bastante clara de que el dolor era real.

## El problema

Sin una estructura pre-indexada, los agentes de IA pasan la mayor parte del tiempo en descubrimiento:
- \`find\` y \`ls\` para listar archivos
- \`grep\` para buscar patrones
- \`Read\` para cargar contenido
- Repetición de llamadas para cada rama de exploración

En codebases grandes (VS Code con 4,000 archivos), un solo Explore agent puede hacer 52 tool calls y tardar 1m 37s en responder una pregunta. Más tiempo buscando, menos tiempo construyendo.

> "Un agente sin contexto es como un desarrollador nuevo sin onboarding: va a preguntar por todo."

## La solución: CodeGraph

CodeGraph construye un grafo de conocimiento pre-indexado de tu codebase:
- **Símbolos**: funciones, clases, variables, imports
- **Relaciones**: call graphs, referencias, herencia
- **Estructura**: módulos, paquetes, archivos

Los agentes consultan el grafo instantáneamente vía MCP en lugar de escanear archivos. El resultado medio: 92% menos tool calls y 71% más velocidad en exploración. El cambio se nota en la primera petición larga.

## Benchmarks reales

| Codebase | Con CodeGraph | Sin CodeGraph | Mejora |
|----------|---------------|---------------|--------|
| VS Code (TypeScript) | 3 calls, 17s | 52 calls, 1m 37s | **94% menos · 82% más rápido** |
| Excalidraw (TypeScript) | 3 calls, 29s | 47 calls, 1m 45s | **94% menos · 72% más rápido** |
| Claude Code (Python+Rust) | 3 calls, 39s | 40 calls, 1m 8s | **93% menos · 43% más rápido** |
| Alamofire (Swift) | 3 calls, 22s | 32 calls, 1m 39s | **91% menos · 78% más rápido** |
| Swift Compiler (Swift/C++) | 6 calls, 35s | 37 calls, 2m 8s | **84% menos · 73% más rápido** |

El benchmark más impresionante: Swift Compiler con 25,874 archivos y 272,898 nodos indexados en menos de 4 minutos. El agent respondió una pregunta compleja cross-cutting con 6 explore calls y cero file reads en 35 segundos.

## Instalación en OpenCode

\`\`\`bash
# 1. Ejecutar el instalador interactivo
npx @colbymchenry/codegraph

# 2. El instalador detecta OpenCode automáticamente y configura MCP
# 3. Reiniciar OpenCode
# 4. Inicializar tu proyecto
cd tu-proyecto
codegraph init -i
\`\`\`

El instalador es interactivo y auto-detecta los agentes instalados: Claude Code, Cursor, Codex CLI, y OpenCode. Configura el servidor MCP y los archivos de instrucciones automáticamente.

## Características clave

- **Smart Context Building**: un solo tool call retorna entry points, símbolos relacionados y snippets de código — no necesitas agentes de exploración costosos.
- **Full-Text Search**: busca código por nombre instantáneamente en todo tu codebase, powered por SQLite FTS5.
- **Impact Analysis**: traza callers, callees y el radio de impacto completo de cualquier símbolo antes de hacer cambios.
- **Always-on freshness**: un watcher nativo actualiza el grafo sin pedir nada.
- **Framework-aware Routes**: reconoce archivos de routing en 13 frameworks web y emite nodos \`route\` vinculados a sus handlers:
- Django, Flask, FastAPI
- Express
- Laravel, Rails
- Spring
- Gin, chi, gorilla, mux
- Axum, actix, Rocket
- ASP.NET
- Vapor
- React Router, SvelteKit

### 100% Local
No data sale de tu máquina. No API keys. No servicios externos. Solo SQLite.

### Qué opiniones deja

Lo que más repiten quienes lo prueban:
- El agente siente que "ya conoce" la base de código.
- Las preguntas largas ("cómo fluye X") llegan con fragmentos completos a la primera.
- No depende de proveedores externos ni cuotas adicionales.

## Cómo funciona bajo el hood

CodeGraph usa MCP (Model Context Protocol) para exponer herramientas a los agentes. Puedes llamarlas manualmente o dejar que el agente las dispare cuando detecta la carpeta \`.codegraph/\`:

| Herramienta | Propósito |
|-------------|----------|
| \`codegraph_search\` | Buscar símbolos por nombre |
| \`codegraph_callers\` / \`codegraph_callees\` | Trazar flujo de llamadas |
| \`codegraph_impact\` | Analizar impacto antes de editar |
| \`codegraph_node\` | Obtener detalles de un símbolo |
| \`codegraph_explore\` | Exploración semántica completa |

Un file watcher con eventos nativos del OS (FSEvents/inotify/ReadDirectoryChangesW) mantiene el grafo actualizado mientras codificas — zero config.

## Soporte de lenguajes

TypeScript, JavaScript, Python, Go, Rust, Java, C#, PHP, Ruby, C, C++, Swift, Kotlin, Dart, Svelte, Liquid, Pascal/Delphi — 19+ lenguajes y contando.

## Qué viene

El roadmap incluye soporte para más lenguajes, integración con más editores y herramientas avanzadas de análisis estático. Ya hay PRs de la comunidad añadiendo nuevos frameworks y lenguajes.

Si trabajas con Claude Code, Cursor, Codex u OpenCode y te toca explicar "cómo se engancha este módulo" todos los días, CodeGraph es una mejora obligatoria: menos tokens, más velocidad y conversaciones que van al grano.`,
    image: "/news/codegraph.png",
    category: "programming",
    tags: ["CodeGraph", "MCP", "Claude Code", "OpenCode", "Semantic Search", "Code Intelligence"],
    author: authors.dax,
    publishedAt: "2026-05-20T10:00:00Z",
    readingMinutes: 8,
    views: 1250,
    likes: 89,
    featured: true,
    trending: true,
  },
  {
    slug: "beyond-llms-arquitecturas-cognitivas",
    title: "Beyond LLMs: La era de las arquitecturas cognitivas autónomas",
    excerpt:
      "Los nuevos frameworks pasan del prompt-respuesta a la memoria agéntica persistente. Así está reconfigurando el panorama DevOps.",
    content: `Durante años pensamos en los LLMs como funciones puras: entrada, salida, sin memoria. Esa abstracción está rota.

![Arquitectura cognitiva](/news/hero-ai.jpg)

## El contexto

La industria atraviesa un punto de inflexión. Lo que hasta hace 18 meses era un campo dominado por publicaciones académicas hoy define la hoja de ruta de las plataformas más relevantes del mundo. Conviene mirar con cuidado qué está cambiando y qué se mantiene.

> "Cada vez que el coste marginal de la inteligencia cae un orden de magnitud, la forma del software se reescribe."

Los equipos están reorganizando su stack alrededor de tres principios claros: latencia baja, datos cerca del modelo y observabilidad de extremo a extremo.

## Lo que hay debajo

A nivel de infraestructura, varios patrones se repiten:

- Inferencia desplegada con **autoscaling agresivo** y aceleradores compartidos por tenant.
- Vector stores integrados directamente en la base de datos transaccional.
- Capas de *guardrails* declarativas que permiten auditar cada llamada al modelo.
- Migración progresiva de scripts de despliegue hacia *agentic workflows* parametrizados.

\`\`\`ts
// Ejemplo simplificado de una llamada con guardrails
const result = await ai.generate({
  model: "frontier-1",
  input,
  guardrails: ["pii-redact", "tool-allowlist"],
});
\`\`\`

## Implicaciones para el producto

El cambio no es solo técnico. Los equipos de producto están descubriendo que las funcionalidades más útiles aparecen cuando se elimina la fricción entre el dato y la decisión. Eso obliga a repensar UX, modelos mentales y, sobre todo, ciclos de feedback.

### Tres preguntas para tu equipo

1. ¿Dónde vive tu *source of truth* y a qué distancia está del modelo?
2. ¿Cuántos saltos de red mete tu pipeline antes de devolver una respuesta?
3. ¿Tienes una métrica clara de calidad por intención de usuario?

## Qué viene

Si la tendencia se mantiene, los próximos doce meses traerán consolidación de plataformas, una segunda ola de herramientas open source y, probablemente, regulación específica para el despliegue en sectores críticos. Conviene prepararse, no reaccionar.`,
    image: heroAi,
    category: "ai",
    tags: ["LLMs", "Agentes", "Arquitectura"],
    author: authors.noa,
    publishedAt: "2026-05-12T08:00:00Z",
    readingMinutes: 12,
    views: 8420,
    likes: 612,
    featured: true,
    trending: true,
  },
  {
    slug: "memory-safety-prioridad-nacional",
    title: "Por qué la memory safety se ha convertido en prioridad de seguridad nacional",
    excerpt:
      "Agencias federales empujan a la industria hacia lenguajes con garantías. Rust y los kernels modernos están en el centro.",
    content: longBody(
      "Cuando la CISA publica una hoja de ruta, las grandes plataformas escuchan. El último informe pone foco en el coste real de la corrupción de memoria.",
    ),
    image: rust,
    category: "programming",
    tags: ["Rust", "Security", "Kernel"],
    author: authors.dax,
    publishedAt: "2026-05-11T07:30:00Z",
    readingMinutes: 8,
    views: 5210,
    likes: 401,
    trending: true,
  },
  {
    slug: "zero-day-runtimes-webassembly",
    title: "Zero-day crítico encontrado en runtimes populares de WebAssembly",
    excerpt:
      "El bug afecta a aislamiento sandbox y ya tiene parches disponibles. Repasamos el alcance y el plan de mitigación.",
    content: longBody(
      "Un investigador independiente reportó la vulnerabilidad hace 72 horas. Hoy repasamos qué hace, a quién afecta y cómo mitigarlo.",
    ),
    image: security,
    category: "security",
    tags: ["WebAssembly", "CVE", "Sandbox"],
    author: authors.dax,
    publishedAt: "2026-05-10T15:10:00Z",
    readingMinutes: 6,
    views: 9120,
    likes: 770,
    trending: true,
  },
  {
    slug: "yc-pivota-hard-tech-robotica",
    title: "Y Combinator pivota de nuevo hacia hard-tech y robótica",
    excerpt:
      "La fatiga del SaaS es real. Una nueva generación de fundadores construye átomos, no solo bits.",
    content: longBody(
      "El último batch ha cambiado de composición. Más empresas con hardware, más equipos con doctorado, menos clones de productividad.",
    ),
    image: startup,
    category: "startups",
    tags: ["YC", "Hardware", "Capital"],
    author: authors.iria,
    publishedAt: "2026-05-09T09:00:00Z",
    readingMinutes: 9,
    views: 4310,
    likes: 322,
  },
  {
    slug: "open-weights-vs-open-source",
    title: "Open-Weights vs Open-Source: la guerra de definiciones se calienta",
    excerpt:
      "La OSI ultima un borrador final para definir IA abierta y los grandes labs presionan en sentido contrario.",
    content: longBody(
      "El debate ya no es semántico. Una definición restrictiva podría dejar fuera a buena parte del ecosistema actual.",
    ),
    image: neural,
    category: "open-source",
    tags: ["OSI", "Foundation Models", "Licensing"],
    author: authors.sara,
    publishedAt: "2026-05-08T11:30:00Z",
    readingMinutes: 10,
    views: 3890,
    likes: 281,
  },
  {
    slug: "kubernetes-substrato-invisible-inferencia",
    title: "Kubernetes se está convirtiendo en el substrato invisible de la inferencia IA",
    excerpt:
      "Los operadores específicos para GPU y los schedulers conscientes del modelo cambian la economía del despliegue.",
    content: longBody(
      "Lo que empezó como una pieza de infraestructura para microservicios web es hoy la pieza más estratégica de cualquier stack de IA serio.",
    ),
    image: devops,
    category: "devops",
    tags: ["Kubernetes", "GPU", "Inferencia"],
    author: authors.julian,
    publishedAt: "2026-05-07T13:45:00Z",
    readingMinutes: 11,
    views: 6210,
    likes: 489,
    trending: true,
  },
  {
    slug: "react-server-components-migracion",
    title: "React Server Components: la cola larga de la migración",
    excerpt:
      "Cómo los grandes equipos están abordando el cambio a arquitecturas streaming sin romper sus pipelines existentes.",
    content: longBody(
      "Migrar a RSC no es flip-the-switch. Es repensar dónde vive el estado, quién lo posee y cómo se serializa.",
    ),
    image: neural,
    category: "web-dev",
    tags: ["React", "RSC", "Streaming"],
    author: authors.sara,
    publishedAt: "2026-05-06T10:00:00Z",
    readingMinutes: 9,
    views: 5040,
    likes: 388,
  },
  {
    slug: "post-quantum-roadmap-empresa",
    title: "El roadmap de criptografía post-cuántica para DevOps empresarial",
    excerpt:
      "Los estándares nacionales están cambiando. Así puedes preparar tu infraestructura para la próxima década de amenazas.",
    content: longBody(
      "NIST ha cerrado los primeros estándares. Toca planificar la rotación de algoritmos como un proyecto de varios años.",
    ),
    image: security,
    category: "security",
    tags: ["PQC", "Criptografía", "DevOps"],
    author: authors.dax,
    publishedAt: "2026-05-05T08:20:00Z",
    readingMinutes: 7,
    views: 2980,
    likes: 217,
  },
  {
    slug: "rust-kernel-linux-mainline",
    title: "Los drivers Rust del kernel de Linux alcanzan estado estable en mainline",
    excerpt:
      "Tras años de discusión, los primeros subsystems escritos en Rust se integran de forma definitiva.",
    content: longBody(
      "Es un cambio simbólico tan importante como técnico. El kernel deja de ser exclusivamente C después de tres décadas.",
    ),
    image: rust,
    category: "open-source",
    tags: ["Rust", "Linux", "Kernel"],
    author: authors.dax,
    publishedAt: "2026-05-04T14:10:00Z",
    readingMinutes: 6,
    views: 7340,
    likes: 612,
  },
  {
    slug: "context-windows-10m-tokens",
    title: "Las ventanas de contexto LLM llegan a 10M de tokens vía sparse attention",
    excerpt:
      "Una técnica clásica vuelve a ser noticia: cómo se puede mantener calidad sin disparar el coste de cómputo.",
    content: longBody(
      "Sparse attention no es nuevo. Lo nuevo es la combinación con caché agresivo y hardware específico para reducir coste por token.",
    ),
    image: neural,
    category: "ai",
    tags: ["Attention", "Long Context", "Eficiencia"],
    author: authors.noa,
    publishedAt: "2026-05-03T09:50:00Z",
    readingMinutes: 8,
    views: 6480,
    likes: 502,
  },
  {
    slug: "edge-runtimes-comparativa-2026",
    title: "Comparativa 2026 de edge runtimes: Workers, Deno Deploy y Vercel Functions",
    excerpt:
      "Latencias, límites, primitivas y precio real. Una guía práctica para decidir dónde correr tu backend.",
    content: longBody(
      "Hicimos pruebas reales en cinco regiones durante dos semanas. Los resultados desmontan algunos mitos persistentes.",
    ),
    image: devops,
    category: "web-dev",
    tags: ["Edge", "Workers", "Deno"],
    author: authors.julian,
    publishedAt: "2026-05-02T07:15:00Z",
    readingMinutes: 12,
    views: 4150,
    likes: 312,
  },
  {
    slug: "founders-tecnicos-ronda-seed",
    title: "Founders técnicos: cómo está cambiando la ronda seed en 2026",
    excerpt:
      "Tickets más pequeños, expectativas más altas y una nueva generación de inversores con background ingeniero.",
    content: longBody(
      "El seed ha cambiado de forma. Menos teatro, más métricas. Hablamos con seis fondos para entender qué buscan hoy.",
    ),
    image: startup,
    category: "startups",
    tags: ["Seed", "VC", "Founders"],
    author: authors.iria,
    publishedAt: "2026-05-01T16:00:00Z",
    readingMinutes: 10,
    views: 3620,
    likes: 268,
  },
];

export function getAllNews(): NewsArticle[] {
  return [...news].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeatured(): NewsArticle {
  return news.find((n) => n.featured) ?? news[0];
}

export function getTrending(limit = 5): NewsArticle[] {
  return [...news]
    .filter((n) => n.trending)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return news.find((n) => n.slug === slug);
}

export function getNewsByCategory(slug: string): NewsArticle[] {
  return getAllNews().filter((n) => n.category === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRelated(article: NewsArticle, limit = 3): NewsArticle[] {
  return news
    .filter((n) => n.slug !== article.slug)
    .map((n) => {
      const sameCategory = n.category === article.category ? 2 : 0;
      const sharedTags = n.tags.filter((t) => article.tags.includes(t)).length;
      return { n, score: sameCategory + sharedTags };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.n);
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const n of news) for (const t of n.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export const aiTools = [
  { name: "Cursor", description: "Editor con IA nativa", badge: "Popular" },
  { name: "Perplexity", description: "Buscador conversacional" },
  { name: "LangChain", description: "Framework de agentes" },
  { name: "Ollama", description: "LLMs locales por CLI", badge: "Nuevo" },
  { name: "Modal", description: "Compute serverless GPU" },
];
