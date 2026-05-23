import type { Category, NewsArticle } from "./types";

const heroAi = "/news/hero-ai.jpg";
const rust = "/news/rust.jpg";
const security = "/news/security.jpg";
const startup = "/news/startup.jpg";
const neural = "/news/neural.jpg";
const devops = "/news/devops.jpg";
const programming = "/news/rust.jpg";
const openSource = "/news/neural.jpg";

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
  {
    slug: "claude-4-sonnet-supera-gpt4o-razonamiento-matematico",
    title: "Claude 4 Sonnet supera a GPT-4o en razonamiento matemático según el benchmark MATH-500",
    excerpt:
      "Anthropic publica resultados donde su nuevo modelo alcanza el 92,4% frente al 89,1% de OpenAI. Analizamos qué significa esto para los equipos que ya tienen IA en producción.",
    content: `Hay momentos en la industria en los que un número cambia la conversación. Esta semana Anthropic publicó los resultados de Claude 4 Sonnet en el benchmark MATH-500 y el resultado fue lo suficientemente claro como para que todo el mundo se detuviera a leerlo: 92,4% frente al 89,1% de GPT-4o. No es una diferencia astronómica, pero en un terreno donde cada décima cuenta, marca una dirección.

![Claude 4 Sonnet benchmark](/news/claude-benchmark.jpg)

Lo interesante no es solo el número en sí, sino lo que hay detrás de él. MATH-500 no es un benchmark de trivia; evalúa razonamiento matemático profundo, encadenamiento de pasos y la capacidad de detectar errores en el propio razonamiento. Eso lo hace especialmente relevante para casos de uso reales: código con lógica compleja, análisis financiero, modelado científico.

## ¿Qué ha cambiado en Claude 4 Sonnet?

Anthropic no ha publicado todos los detalles técnicos, como suele ser habitual, pero hay pistas claras en los comportamientos observados por quienes han tenido acceso anticipado. El modelo muestra una capacidad notablemente mejorada para **mantener coherencia a lo largo de razonamientos largos** sin perder el hilo en el quinto o sexto paso. También gestiona mejor las auto-correcciones: cuando detecta una contradicción en su propio output, la señala y la resuelve en lugar de continuar sobre una base rota.

> "Claude 4 Sonnet es el primer modelo que he usado donde tengo la sensación de que realmente revisa su trabajo antes de dármelo." — testimonio de un beta tester en el foro oficial de Anthropic.

Otro cambio notable es la mejora en el manejo de notación matemática ambigua. Algo tan aparentemente simple como interpretar correctamente \`2(3+4)\` en contextos donde la convención puede variar ha causado errores sorprendentes en modelos anteriores. Claude 4 Sonnet es significativamente más consistente en estos casos.

## El contexto de la carrera de benchmarks

Hay que ser honestos: los benchmarks son una foto fija y los modelos de frontera se optimizan para ellos. Eso no los invalida, pero sí invita a la cautela. Lo que sí es relevante es la tendencia que señalan. En los últimos 18 meses, el gap entre los modelos líderes y el resto se ha ido cerrando en tareas de lenguaje general, mientras que en razonamiento formal —matemáticas, código, lógica simbólica— el spread todavía existe y es competitivo.

## ¿Qué significa para los equipos en producción?

Si ya tienes Claude 3.5 Sonnet o GPT-4o integrado, la pregunta real no es "¿cuál gana en el benchmark?" sino "¿merece la pena migrar?". Algunos factores a considerar:

- **Coste por token**: Claude 4 Sonnet mantiene un precio competitivo con su predecesor.
- **Latencia**: el perfil de velocidad es comparable al de Sonnet 3.5, lo cual es buena noticia.
- **Compatibilidad de API**: si usas la API de Anthropic, el cambio de modelo es literalmente cambiar un string.
- **Evaluación en tu dominio**: siempre merece la pena correr tus propias evaluaciones con datos reales antes de migrar en producción.

## Lo que viene

OpenAI no va a quedarse quieto. El ritmo de lanzamientos en 2026 ha sido el más acelerado de la historia de la industria y ambas empresas están claramente en un ciclo de respuesta mutua. Para los desarrolladores, eso es una buena noticia: más competencia, mejores modelos y precios a la baja.

Lo que está quedando claro es que el razonamiento matemático y formal es el nuevo campo de batalla. Y tiene sentido: es el tipo de tarea donde la diferencia entre un modelo bueno y uno excelente se traduce directamente en menos errores de producción.`,
    image: "/news/claude-benchmark.jpg",
    category: "ai",
    tags: ["Claude", "Benchmarks", "LLMs", "Anthropic"],
    author: authors.noa,
    publishedAt: "2026-05-23T09:00:00Z",
    readingMinutes: 9,
    views: 3840,
    likes: 291,
    trending: true,
  },
  {
    slug: "alphaproof-2-deepmind-olimpiada-matematica",
    title: "AlphaProof 2 de DeepMind resuelve problemas de olimpiada matemática en tiempo real",
    excerpt:
      "La nueva versión combina razonamiento simbólico con búsqueda Monte Carlo. Un salto que pone en jaque lo que entendemos por inteligencia matemática artificial.",
    content: `Cuando en 2024 DeepMind anunció que AlphaProof había resuelto cuatro de los seis problemas de la Olimpiada Internacional de Matemáticas, muchos lo recibieron como una proeza puntual. Un año después, AlphaProof 2 llega con una diferencia fundamental: ya no necesita días para resolver. Lo hace en minutos.

![AlphaProof 2 DeepMind](/news/math-proof.jpg)

Eso cambia la naturaleza del logro. Pasar de "puede resolver problemas olímpicos si le das tiempo suficiente" a "puede resolverlos en tiempo real" es el tipo de salto que transforma una curiosidad de laboratorio en algo con aplicaciones prácticas reales.

## Cómo funciona AlphaProof 2

La arquitectura combina dos componentes que se complementan de forma elegante. Por un lado, un sistema de **razonamiento simbólico formal** que trabaja con el lenguaje de pruebas Lean 4 — lo que garantiza que cada paso sea verificable matemáticamente, no solo plausible. Por otro, una **búsqueda Monte Carlo Tree Search** profundamente refinada que guía la exploración del espacio de pruebas hacia las ramas más prometedoras.

Lo que ha mejorado respecto a la primera versión es la eficiencia de esa búsqueda. En AlphaProof 1, el sistema exploraba muchos callejones sin salida antes de encontrar el camino correcto. La versión 2 incorpora un componente de estimación de valor que aprende, a partir de millones de pruebas resueltas, a reconocer cuándo una línea de razonamiento va a funcionar antes de haberla completado. Es parecido a lo que hace un matemático experto cuando mira un problema: intuye si un enfoque tiene pinta de llegar a algún sitio.

> "No es que el modelo sea más rápido. Es que ha aprendido a no perder el tiempo." — investigador de DeepMind en el anuncio oficial.

## Los resultados concretos

En los problemas de la IMO 2025, AlphaProof 2 resolvió los seis problemas propuestos, incluyendo los dos de geometría que tradicionalmente han sido los más difíciles para sistemas automatizados. El tiempo medio de resolución fue de 8 minutos por problema, con el más complejo tardando 23 minutos.

Para contexto: los participantes humanos tienen 4,5 horas por sesión para tres problemas. Los mejores estudiantes del mundo resuelven dos o tres en ese tiempo. AlphaProof 2 los resuelve todos en el tiempo que tarda un humano en leerlos con calma.

## ¿Esto significa que las matemáticas están resueltas?

No, y es importante no exagerar. AlphaProof 2 es extraordinariamente bueno en un tipo específico de razonamiento: demostraciones formales en un espacio bien delimitado. Las matemáticas de investigación de frontera implican mucho más: intuición sobre qué problemas son interesantes, capacidad de reformular conceptos, conexiones inesperadas entre áreas distantes.

Lo que sí es cierto es que las herramientas de asistencia matemática van a cambiar profundamente en los próximos años. Un asistente que pueda verificar automáticamente si tu demostración es correcta, o sugerir pasos intermedios cuando estás atascado, está más cerca que nunca.

## Implicaciones para la industria del software

El razonamiento formal tiene aplicaciones directas en verificación de software, criptografía y sistemas críticos. Un sistema que puede construir y verificar pruebas matemáticamente correctas en tiempo real podría verificar que un algoritmo de consenso es correcto, o que un protocolo de seguridad no tiene huecos. Es un territorio fascinante y todavía muy abierto.`,
    image: "/news/math-proof.jpg",
    category: "ai",
    tags: ["DeepMind", "Razonamiento", "Matemáticas", "Agentes"],
    author: authors.noa,
    publishedAt: "2026-05-22T11:30:00Z",
    readingMinutes: 10,
    views: 5120,
    likes: 418,
    trending: true,
  },
  {
    slug: "typescript-58-decoradores-estables",
    title: "TypeScript 5.8 congela su API de decoradores y cierra la era experimental",
    excerpt:
      "Después de tres años en stage 3, los decoradores de TC39 entran en TypeScript como feature estable. Todo lo que necesitas saber para migrar sin romper nada.",
    content: `Si llevas tiempo usando TypeScript con decoradores, probablemente tienes en tu tsconfig.json la línea \`experimentalDecorators: true\` tan interiorizada que ni la ves. A partir de TypeScript 5.8, eso cambia. Los decoradores salen del modo experimental y pasan a ser una feature de primera clase del lenguaje, alineada con el estándar TC39 Stage 3.

![TypeScript decoradores estables](/news/typescript-code.jpg)

Es una noticia que muchos esperaban con una mezcla de alivio y cautela. Alivio porque llevar años usando algo marcado como "experimental" en producción siempre genera cierta incomodidad. Cautela porque el estándar TC39 tiene diferencias sutiles respecto a la implementación experimental de TypeScript, y eso significa que hay código que necesitará actualizarse.

## ¿Qué cambia exactamente?

La diferencia más relevante para la mayoría de proyectos está en cómo se invocan los decoradores de clase y método. En la versión experimental, los decoradores recibían el target de una forma; en el estándar TC39, la firma ha cambiado para ser más flexible y composable.

\`\`\`typescript
// Decorador experimental (viejo)
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Llamando \${key}\`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

// Decorador TC39 estándar (nuevo)
function log(target: Function, context: ClassMethodDecoratorContext) {
  return function (this: unknown, ...args: unknown[]) {
    console.log(\`Llamando \${String(context.name)}\`, args);
    return (target as (...a: unknown[]) => unknown).call(this, ...args);
  };
}
\`\`\`

La firma nueva es más tipada, más predecible y, una vez que te acostumbras, más clara. El contexto que recibe el decorador contiene metadatos útiles: el nombre del miembro, si es estático, si es privado y el tipo exacto de lo que se está decorando.

## ¿Afecta a Angular, NestJS o MobX?

Esta es la pregunta que más repite la comunidad. La respuesta honesta es: depende de la versión. Los frameworks que llevan años usando decoradores experimentales han estado preparándose para esta transición con distintos niveles de urgencia.

- **NestJS** ya tiene soporte experimental para los nuevos decoradores en su rama de desarrollo.
- **Angular** gestionará la transición internamente; los usuarios no deberían notar nada si actualizan Angular junto con TypeScript.
- **MobX** requiere atención manual: los decoradores de \`@observable\` y \`@action\` necesitarán actualización.

La buena noticia es que TypeScript 5.8 soporta ambas sintaxis simultáneamente durante un período de transición. Puedes seguir usando \`experimentalDecorators: true\` sin romper nada mientras planificas la migración.

## Por qué esto importa más allá de la sintaxis

La estabilización de los decoradores en TypeScript no es solo un cambio de API. Es una señal de madurez del ecosistema. Cuando una feature sale de experimental, el equipo de TypeScript se compromete a no romperla en futuras versiones. Eso baja la barrera de adopción para equipos que eran cautelosos con razón.

También abre la puerta a que más librerías adopten decoradores como mecanismo primario de extensión, sabiendo que el suelo bajo sus pies es sólido. En los próximos meses veremos un florecimiento de librerías que usaban decoradores de forma tímida y ahora pueden apostar por ellos con más confianza.`,
    image: "/news/typescript-code.jpg",
    category: "programming",
    tags: ["TypeScript", "Decorators", "ECMAScript"],
    author: authors.dax,
    publishedAt: "2026-05-21T08:45:00Z",
    readingMinutes: 11,
    views: 4230,
    likes: 347,
    trending: true,
  },
  {
    slug: "zig-014-compilacion-incremental-wasm-components",
    title: "Zig 0.14 llega con compilación incremental nativa y WASM Components de primera clase",
    excerpt:
      "El lenguaje que quería ser el C moderno alcanza un punto de madurez real en su toolchain. Comparativa de tiempos de build frente a Rust y Go.",
    content: `Zig siempre ha sido un lenguaje con una propuesta de valor clara: ser el sucesor espiritual de C, sin la complejidad de Rust y sin los compromisos de Go. Durante años, esa propuesta fue convincente en papel pero con una barrera importante: el toolchain era brillante en lo técnico pero rugoso en lo práctico. Zig 0.14 cambia eso de forma significativa.

![Zig lenguaje de programación](/news/zig-compile.jpg)

La versión 0.14 trae dos características que los usuarios llevaban pidiendo desde hace tiempo: **compilación incremental nativa** y **soporte de primera clase para WebAssembly Components**. Juntas, hacen que trabajar con Zig en proyectos grandes sea una experiencia cualitativamente diferente.

## Compilación incremental: el antes y el después

Hasta ahora, Zig recompilaba más de lo necesario en muchos escenarios. Para proyectos pequeños eso era invisible; para proyectos con decenas de módulos, el tiempo de compilación podía volverse incómodo. La compilación incremental de 0.14 resuelve esto de forma agresiva.

Los benchmarks del equipo de Zig muestran resultados que impresionan incluso siendo conservador con los números:

| Proyecto | Zig 0.13 | Zig 0.14 incremental | Reducción |
|----------|----------|----------------------|-----------|
| TigerBeetle | 18.4s | 2.1s | **89%** |
| Ghostty | 24.7s | 3.8s | **85%** |
| Proyecto medio (50 módulos) | 8.2s | 1.2s | **85%** |

\`\`\`bash
# El build incremental está activado por defecto en 0.14
zig build

# Para forzar rebuild completo
zig build --force-rebuild
\`\`\`

## WebAssembly Components: interoperabilidad sin fricciones

El soporte para **WASM Component Model** es el otro gran titular de esta versión. El Component Model permite que módulos WASM escritos en distintos lenguajes se comuniquen entre sí con tipos bien definidos, sin necesidad de pasar por strings JSON ni de gestionar memoria manualmente a través de la frontera.

Con Zig 0.14, puedes exportar e importar interfaces WASM Component directamente desde tu código, con generación automática de los bindings a partir de ficheros \`.wit\`. Esto abre la puerta a usar Zig como lenguaje de elección para componentes WASM que necesitan ser pequeños, rápidos y predecibles en memoria — tres cosas en las que Zig brilla de forma natural.

## ¿Cómo se compara con Rust y Go?

La respuesta honesta es que depende del caso de uso, pero en términos de tiempo de build en proyectos grandes, Zig 0.14 se pone por primera vez a la altura o por delante de ambos. En el benchmark de TigerBeetle (un proyecto Zig real en producción), los 2,1 segundos de build incremental son difíciles de batir.

En términos de ecosistema y madurez, Rust y Go siguen siendo más fáciles de adoptar para equipos sin experiencia previa en sistemas. Pero si ya tienes desarrolladores que disfrutan de C y quieren algo más seguro sin la curva de Rust, Zig 0.14 es la versión en la que tiene sentido evaluar seriamente el salto.`,
    image: "/news/zig-compile.jpg",
    category: "programming",
    tags: ["Zig", "WebAssembly", "Compiladores", "Build Tools"],
    author: authors.dax,
    publishedAt: "2026-05-20T14:30:00Z",
    readingMinutes: 10,
    views: 2890,
    likes: 234,
  },
  {
    slug: "vite-7-elimina-cjs-esm-nativo",
    title: "Vite 7 elimina CJS y apuesta todo por ESM nativo: guía de migración sin drama",
    excerpt:
      "El empaquetador más popular del ecosistema corta por lo sano con CommonJS. Qué rompe, qué mejora y cómo adaptar tu proyecto en menos de un día.",
    content: `Había una fecha marcada en el calendario de la comunidad JavaScript desde hace meses: el lanzamiento de Vite 7 y su decisión de eliminar el soporte para CommonJS (CJS) como formato de salida. Esa fecha llegó esta semana y, aunque la transición es más suave de lo que algunos temían, merece la pena entender bien qué significa y cómo prepararse.

![Vite 7 ESM nativo](/news/vite-esm.jpg)

La decisión no es caprichosa. ESM nativo lleva siendo el estándar oficial de JavaScript desde 2015 y el ecosistema lleva años en una transición lenta pero inexorable hacia él. Node.js tiene soporte completo desde la versión 12. Todos los navegadores modernos lo soportan sin polyfills. Deno y Bun nacieron directamente sobre ESM. Seguir manteniendo CJS en Vite implicaba un overhead de complejidad creciente para un beneficio que se reducía cada mes.

## ¿Qué cambia exactamente?

Lo que desaparece en Vite 7 es la opción de generar bundles en formato CJS cuando construyes librerías o aplicaciones con \`vite build\`. El dev server, que siempre ha trabajado con ESM nativo en el navegador, no cambia en nada.

Si construyes una aplicación web normal (SPA, SSR con Nuxt o SvelteKit), probablemente **no notes ninguna diferencia**. Los frameworks ya gestionan esta capa internamente y sus plugins para Vite ya están actualizados.

Donde sí hay trabajo es si:
- Publicas una **librería de npm** que genera salida CJS para compatibilidad con Node.js antiguo.
- Tienes **scripts de Node.js** que importan código de tu aplicación directamente.
- Usas **\`require()\`** en algún fichero de configuración de Vite.

## La migración en tres pasos

**Paso 1**: Asegúrate de que tu \`package.json\` tiene \`"type": "module"\`.

**Paso 2**: Si tienes partes del monorepo que no pueden ser ESM todavía, renombra \`vite.config.js\` a \`vite.config.mjs\` para que Vite lo trate como ESM sin afectar al resto.

**Paso 3**: Actualiza las entradas de tu librería en \`package.json\` para usar el campo \`"exports"\` en lugar de \`"main"\`.

\`\`\`json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
\`\`\`

## Lo que ganas a cambio

El beneficio más inmediato es **velocidad de build**. Al no tener que transformar ESM a CJS, Vite hace menos trabajo. En proyectos grandes, equipos que han migrado en preview reportan reducciones del 15-20% en tiempo de build de producción.

También mejora la experiencia de HMR en desarrollo. Algunos patrones de importación dinámica que antes tenían comportamientos inconsistentes entre dev y producción ahora se comportan igual en ambos entornos, lo que elimina una categoría entera de bugs difíciles de reproducir.

El ecosistema está listo: la gran mayoría de plugins de Vite populares ya tienen versiones compatibles. El equipo de Vite publicó una compatibility matrix semanas antes del lanzamiento para que los mantenedores de plugins pudieran prepararse. Si tienes dudas sobre alguna dependencia específica, ese documento es el primer lugar donde mirar.`,
    image: "/news/vite-esm.jpg",
    category: "web-dev",
    tags: ["Vite", "ESM", "Build Tools", "JavaScript"],
    author: authors.sara,
    publishedAt: "2026-05-19T10:00:00Z",
    readingMinutes: 9,
    views: 6340,
    likes: 511,
    trending: true,
  },
  {
    slug: "baseline-2026-apis-web-sin-polyfills",
    title: "Baseline 2026: las 12 APIs web que ya puedes usar sin polyfills en todos los navegadores",
    excerpt:
      "Desde View Transitions hasta la Temporal API. El resumen del proyecto Interop 2026 confirma qué ha aterrizado de forma segura en Chrome, Firefox y Safari.",
    content: `Una de las fricciones más persistentes del desarrollo web ha sido siempre la misma: encuentras una API que resuelve exactamente tu problema, compruebas el soporte en Can I Use, y te encuentras con ese amarillo angustiante que significa "sí, pero no en todos sitios". Baseline 2026 es el intento más organizado hasta la fecha de acabar con esa incertidumbre.

![Baseline 2026 Web APIs](/news/web-apis.jpg)

El proyecto Baseline, liderado conjuntamente por Google, Mozilla, Apple y Microsoft bajo el paraguas de la Web Platform Incubator CG, define una lista de APIs que han alcanzado soporte completo e interoperable en Chrome, Firefox, Edge y Safari. Cuando algo entra en Baseline, puedes usarlo sin polyfills, sin feature flags y sin mirar Can I Use dos veces.

Este año, doce APIs cruzaron esa línea. Aquí están las más relevantes para el trabajo del día a día.

## Las doce APIs que llegan a Baseline 2026

**View Transitions API** — Probablemente la más esperada. Permite crear transiciones animadas entre estados de la UI, incluyendo navegaciones entre páginas en MPAs, con una API sorprendentemente simple. Lo que antes requería librerías de animación complejas ahora se expresa en cuatro líneas:

\`\`\`javascript
document.startViewTransition(() => {
  updateDOM();
});
\`\`\`

**Popover API** — Un elemento HTML nativo con comportamiento de popover: gestión automática del z-index, cierre al hacer clic fuera, accesibilidad por defecto. Sin JavaScript para los casos básicos. Basta con \`popover\` como atributo HTML.

**CSS Anchor Positioning** — Posicionar un elemento relativo a otro de forma declarativa en CSS, sin JavaScript para calcular coordenadas. Ideal para tooltips, dropdowns y cualquier elemento que necesite "anclarse" a otro en el DOM.

**CSS \`@layer\`** — Las cascade layers llevan tiempo en los navegadores, pero 2026 marca el año en que puedes considerarlas completamente seguras para producción sin excepciones. Permiten organizar la especificidad de CSS de forma explícita y predecible.

**\`fetch()\` Streaming** — Procesar la respuesta de un fetch como un stream sin cargar todo en memoria. Fundamental para aplicaciones que muestran datos en tiempo real o descargan archivos grandes sin bloquear el hilo principal.

**\`structuredClone()\`** — El reemplazo definitivo del horrible \`JSON.parse(JSON.stringify(x))\` para clonar objetos. Maneja correctamente fechas, Map, Set, y referencias circulares. Es uno de esos añadidos que parece pequeño y cambia hábitos de golpe.

**Web Locks API** — Coordinación de recursos entre pestañas y workers con una API de locks limpia. Especialmente útil en aplicaciones offline-first o con Service Workers que necesitan evitar condiciones de carrera.

**CSS Container Queries (style)** — Las container queries de tamaño ya eran Baseline 2023. Las *style container queries*, que permiten reaccionar a propiedades CSS personalizadas del contenedor, alcanzan soporte completo en 2026.

**\`navigator.share()\`** — La Web Share API para invocar el diálogo nativo de compartir del sistema operativo. Ahora con soporte consistente incluyendo Safari en escritorio, que era el eslabón que faltaba.

**\`EventTarget\` en Workers** — Poder usar el patrón de eventos estándar en Web Workers y Service Workers sin workarounds. Una normalización larga tiempo esperada que simplifica el código de comunicación entre hilos.

**Temporal API** — La esperadísima sustitución de \`Date\`. Inmutable, timezone-aware, y con una API coherente para fechas, horas, duraciones e intervalos. Después de años en TC39, finalmente disponible en todos los motores sin polyfill.

**CSS \`@scope\`** — Estilos con ámbito nativo sin necesidad de CSS Modules o metodologías BEM. Puedes aplicar estilos solo dentro de un componente específico directamente en CSS estándar.

## Cómo usar Baseline en tu proyecto

La forma más práctica de incorporar Baseline a tu flujo de trabajo es configurar \`browserslist\` en tu proyecto:

\`\`\`
# .browserslistrc
baseline 2026
\`\`\`

Esto ajusta automáticamente qué polyfills y transpilaciones incluye tu bundler. Para equipos que todavía necesiten soportar navegadores más antiguos, Baseline tiene dos niveles: **Newly available** (recién llegada a todos los motores) y **Widely available** (disponible desde hace 30+ meses). Para producción conservadora, apunta a Widely available.

La web de Baseline tiene un buscador donde puedes pegar el nombre de cualquier API y ver exactamente en qué nivel está. Es la herramienta que debería reemplazar Can I Use para las decisiones de "¿puedo usarlo ya?".`,
    image: "/news/web-apis.jpg",
    category: "web-dev",
    tags: ["Web APIs", "Baseline", "CSS", "JavaScript", "Browser Compat"],
    author: authors.sara,
    publishedAt: "2026-05-18T09:15:00Z",
    readingMinutes: 12,
    views: 7890,
    likes: 634,
    trending: true,
  },
  {
    slug: "opentofu-2-estandar-iac-europa",
    title: "OpenTofu 2.0 se convierte en el estándar de IaC para empresas europeas",
    excerpt:
      "Tres grandes consultoras anuncian la migración desde Terraform. Analizamos el impacto en el ecosistema de providers y módulos, y qué significa para los equipos que todavía no han tomado posición.",
    content: `Hay momentos en los que lo que parecía una fragmentación del ecosistema resulta ser un cambio de estándar. El lanzamiento de OpenTofu 2.0 esta semana, acompañado del anuncio de que Capgemini, Atos y Deutsche Telekom migran su práctica de IaC desde Terraform, es uno de esos momentos.

![OpenTofu infraestructura como código](/news/opentofu-iac.jpg)

Para entender el contexto: cuando HashiCorp cambió la licencia de Terraform de MPL a BSL en agosto de 2023, generó un terremoto en la comunidad de infraestructura. La Linux Foundation respondió creando OpenTofu, un fork con la licencia original. Lo que no estaba claro entonces era si OpenTofu sería un proyecto de nicho para puristas del open source o si tendría tracción real en la industria. Dos años después, la respuesta es evidente.

## Qué trae OpenTofu 2.0

La versión 2.0 no es solo un fork al día de Terraform; incluye features propias que el proyecto original no ha implementado. Las más relevantes para equipos grandes:

**State encryption nativa**: OpenTofu 2.0 permite cifrar el estado de forma nativa, sin depender de que el backend remoto lo haga. Una feature muy pedida que HashiCorp nunca priorizó.

\`\`\`hcl
terraform {
  encryption {
    key_provider "pbkdf2" "my_passphrase" {
      passphrase = var.encryption_passphrase
    }
    method "aes_gcm" "default" {
      keys = key_provider.pbkdf2.my_passphrase
    }
    state {
      method = method.aes_gcm.default
    }
  }
}
\`\`\`

**For-each en módulos**: una de las limitaciones más molestas de HCL era la imposibilidad de iterar módulos completos. OpenTofu 2.0 lo resuelve de forma limpia y expresiva.

**Provider functions**: los providers ahora pueden exponer funciones que se usan directamente en expresiones HCL, no solo recursos y data sources. Esto abre la puerta a lógica más expresiva sin necesidad de scripts externos.

## La migración desde Terraform: ¿qué tan difícil es?

La buena noticia es que para la mayoría de configuraciones existentes, la migración es trivial. OpenTofu es compatible con la sintaxis HCL de Terraform 1.x, lo que significa que en muchos casos basta con instalar el binario y sustituirlo:

\`\`\`bash
brew install opentofu

# En tu directorio de proyecto — los ficheros .tf no cambian
tofu init
tofu plan
tofu apply
\`\`\`

El estado existente es compatible. El cambio principal es el binario: \`terraform\` pasa a ser \`tofu\`. Las complicaciones aparecen si usas providers privados distribuidos solo a través del registry de HashiCorp, o si dependes de features de Terraform Cloud/Enterprise que no tienen equivalente en OpenTofu todavía.

## ¿Por qué las empresas europeas lideran la transición?

El factor licencia importa más en Europa que en otras regiones, especialmente para empresas grandes. La BSL de HashiCorp incluye restricciones sobre el uso competitivo que generan ambigüedad legal en entornos empresariales conservadores. Los departamentos jurídicos prefieren la claridad de la MPL que mantiene OpenTofu.

También hay un factor de soberanía tecnológica: OpenTofu, al ser gobernado por la Linux Foundation, se percibe como menos dependiente de las decisiones de una empresa privada. En el contexto regulatorio europeo actual, eso tiene valor real.

## Qué significa para tu equipo

Si usas Terraform y estás contento con ello, no hay urgencia en migrar. La BSL no afecta a la mayoría de usos internos. Pero si tu empresa tiene una política de solo usar software con licencias permisivas, o si quieres features como state encryption que no están en Terraform, OpenTofu 2.0 es el momento de evaluar el salto.

El ecosistema de providers es esencialmente el mismo, los conocimientos de HCL son 100% transferibles, y la comunidad crece a buen ritmo. El riesgo de migrar es bajo; el riesgo de quedarse atrás si OpenTofu se consolida como estándar de facto es más difícil de cuantificar.`,
    image: "/news/opentofu-iac.jpg",
    category: "devops",
    tags: ["OpenTofu", "Terraform", "IaC", "Infraestructura"],
    author: authors.julian,
    publishedAt: "2026-05-17T13:00:00Z",
    readingMinutes: 11,
    views: 5670,
    likes: 442,
    trending: true,
  },
  {
    slug: "replit-200m-valoracion-2000m-desarrollador-no-tecnico",
    title: "Replit levanta 200M$ a 2.000M$ de valoración: la apuesta por el creador de software no-técnico",
    excerpt:
      "La startup de coding asistido por IA acelera su expansión con foco en pequeñas empresas y educación. Desglosamos el modelo de negocio y si la valoración tiene sentido.",
    content: `Hay rondas de financiación que confirman una tendencia y hay rondas que la aceleran. La de Replit esta semana es de las segundas. 200 millones de dólares a una valoración de 2.000 millones —el doble que hace dieciocho meses— con un giro estratégico claro: dejar de competir con los IDEs de desarrolladores profesionales y apostar a fondo por el mercado de personas que quieren crear software pero no saben programar.

![Replit ronda 200M startup](/news/replit-startup.jpg)

Es un cambio de narrativa significativo para una empresa que empezó siendo "el IDE online para aprender a programar" y luego intentó ser "el IDE online para desarrolladores serios". Esa segunda fase fue complicada: Cursor, GitHub Copilot y Windsurf se comen ese segmento con propuestas muy sólidas. Replit encontró que su ventaja diferencial no estaba ahí.

## El mercado que Replit quiere conquistar

La tesis de Replit es simple pero ambiciosa: hay cientos de millones de personas con ideas de software —propietarios de pequeños negocios, educadores, analistas, freelancers de otras disciplinas— que hoy no pueden convertir esas ideas en realidad porque la programación tradicional tiene una barrera de entrada demasiado alta. La IA generativa ha bajado esa barrera dramáticamente. Replit quiere ser la plataforma donde eso ocurra.

La interfaz principal ya no es un editor de código; es un chat donde describes lo que quieres construir y Replit lo genera, lo despliega y lo mantiene. El código existe pero está en segundo plano. Para el usuario final, es tan natural como pedirle a alguien que construya algo por ti.

> "No estamos construyendo herramientas para desarrolladores. Estamos construyendo la plataforma para la próxima generación de creadores de software." — Amjad Masad, CEO de Replit.

## Las métricas que justifican (o no) la valoración

2.000 millones de dólares es un número que pide explicación. Las métricas compartidas en el anuncio dan pistas:

- 23 millones de usuarios registrados, con crecimiento acelerado en el segmento de pequeñas empresas.
- ARR de 80 millones de dólares, principalmente de suscripciones y planes de teams.
- Retención mensual del 74% en el segmento no-técnico, notablemente alto para herramientas de productividad.
- Tiempo medio hasta primer deploy: **12 minutos** para usuarios nuevos sin experiencia técnica.

A 25x ARR, la valoración está en el rango alto pero no absurdo para una empresa con ese perfil de crecimiento en un mercado tan grande. El riesgo real no es financiero sino de ejecución: convertir usuarios curiosos en clientes de pago recurrentes es más difícil de lo que sugieren los números de registro.

## La competencia que se avecina

Replit no es el único que ha visto esta oportunidad. Vercel ha estado expandiendo su propuesta más allá del despliegue hacia la creación de apps. Bolt.new de StackBlitz es una propuesta directamente competidora. Y los modelos de frontera son cada vez más capaces de generar aplicaciones funcionales en conversaciones, lo que podría hacer que la capa de plataforma fuera prescindible.

El foso que Replit está intentando construir es la infraestructura de despliegue integrada: no solo generas el código, sino que vive en Replit, se escala en Replit y se actualiza desde Replit. Si consiguen que eso funcione bien para el segmento no-técnico, la inercia de cambio de plataforma es alta.

## Educación como motor de adquisición

Uno de los usos más interesantes del capital es la expansión en educación. Replit ya tiene acuerdos con más de 3.000 instituciones educativas. La estrategia es el mismo playbook que usó Microsoft con Office en las escuelas hace treinta años, adaptado a la era de la IA: si aprendes a crear software con Replit a los 16 años, es muy probable que cuando montes tu primer negocio recurras a lo que conoces.

El resultado de esta ronda no lo veremos en los próximos meses sino en los próximos años. Pero la dirección está tomada: Replit quiere ser la plataforma de software para todos, no solo para los que saben programar.`,
    image: "/news/replit-startup.jpg",
    category: "startups",
    tags: ["Replit", "Ronda", "AI-Dev Tools", "No-Code", "VC"],
    author: authors.iria,
    publishedAt: "2026-05-16T16:30:00Z",
    readingMinutes: 10,
    views: 8120,
    likes: 673,
    trending: true,
  },
  {
    slug: "linux-foundation-openagent-estandares-agentes-ia",
    title: "La Linux Foundation lanza OpenAgent: estándares abiertos para la interoperabilidad entre agentes IA",
    excerpt:
      "Veinte empresas, incluyendo Microsoft, Red Hat y Hugging Face, firman el charter fundacional. Primer vistazo a la especificación técnica.",
    content: `El ecosistema de agentes de IA tiene hoy el mismo problema que tenía el ecosistema de contenedores en 2013: docenas de implementaciones incompatibles, cada proveedor con su propio formato, y los usuarios atrapados en el medio. La Linux Foundation ha decidido que ya es momento de repetir lo que hizo con la OCI (Open Container Initiative) para Docker, pero esta vez para los agentes IA.

![Linux Foundation OpenAgent estándares abiertos](/news/open-agent.jpg)

El proyecto **OpenAgent** arranca con el respaldo de veinte empresas que cubren prácticamente todo el espectro del ecosistema: Microsoft, Red Hat, Hugging Face, Cohere, Mistral, Together AI, LangChain, Haystack y varios players de infraestructura cloud y seguridad. Es un lineup que da credibilidad inmediata al esfuerzo.

## El problema que OpenAgent quiere resolver

Si hoy quieres desplegar un agente IA en producción, te enfrentas a una decisión con consecuencias a largo plazo: ¿usas LangGraph? ¿AutoGen? ¿CrewAI? ¿Llamas directamente a la API del modelo? Cada elección crea dependencias que son difíciles de cambiar después. Y si quieres que dos agentes de distintos frameworks se comuniquen, estás en tierra de workarounds y adapters artesanales.

OpenAgent propone dos especificaciones interoperables:

**Agent Definition Format (ADF)**: un esquema JSON para describir qué puede hacer un agente — sus capacidades, los modelos que soporta, las herramientas que tiene disponibles, sus restricciones de seguridad. Piénsalo como el \`package.json\` de un agente.

**Agent Communication Protocol (ACP)**: un protocolo estándar para que agentes se invoquen entre sí, compartan contexto y coordinen tareas, independientemente del framework en el que estén implementados.

\`\`\`json
{
  "adf_version": "1.0",
  "name": "research-agent",
  "capabilities": ["web_search", "summarize", "cite_sources"],
  "models": ["claude-4-sonnet", "gpt-4o"],
  "tools": ["brave_search", "arxiv"],
  "safety": {
    "output_filter": "pii-redact",
    "max_iterations": 20
  }
}
\`\`\`

## ¿Qué diferencia a OpenAgent de MCP?

La pregunta inevitable. Model Context Protocol de Anthropic resuelve la comunicación entre un modelo y sus herramientas — la conexión "hacia abajo". OpenAgent resuelve la comunicación entre agentes — la conexión "horizontal". Son complementarios, no competidores, y la especificación de OpenAgent referencia explícitamente MCP como mecanismo de tool use dentro de un agente.

## El estado del arte: qué está resuelto y qué no

El charter fundacional es honesto sobre el alcance inicial. La versión 1.0 de las especificaciones cubre casos de uso síncronos: un agente llama a otro, espera respuesta, continúa. Los casos asíncronos — agentes que trabajan en paralelo durante horas y se coordinan intermitentemente — están en el roadmap pero no en la v1.

También quedan fuera de la v1 los aspectos de identidad y autenticación entre agentes. Si un agente malicioso se hace pasar por otro, la especificación actual no tiene mecanismos para detectarlo. Es una limitación reconocida que los grupos de trabajo de seguridad están abordando para la v1.1.

## Por qué esto importa aunque todavía no esté terminado

Los estándares no se adoptan cuando están completos; se adoptan cuando el dolor de no tenerlos supera el coste de cambiar. El ecosistema de agentes está llegando a ese punto. Las empresas que están construyendo sistemas multi-agente en producción están chocando con los límites de la fragmentación actual.

Que veinte empresas hayan firmado el charter —incluyendo algunas que compiten directamente entre sí— es una señal de que el sector reconoce que nadie gana con la fragmentación. El mismo argumento que funcionó con los contenedores, los kernels y los formatos de datos.

Si trabajas con agentes en producción, vale la pena seguir el repositorio de OpenAgent. Las especificaciones están en borrador público y los comentarios de la comunidad están dando forma activamente a la v1.`,
    image: "/news/open-agent.jpg",
    category: "open-source",
    tags: ["Linux Foundation", "Agentes", "Estándares", "Interoperabilidad"],
    author: authors.sara,
    publishedAt: "2026-05-15T10:00:00Z",
    readingMinutes: 11,
    views: 4340,
    likes: 368,
  },
  {
    slug: "cve-ssh-kex-openssh-99-millones-servidores",
    title: "CVE crítico en SSH: millones de servidores expuestos por un fallo en el handshake de intercambio de claves",
    excerpt:
      "Un fallo en la implementación del KEX de OpenSSH anterior a la versión 9.9 permite a un atacante en posición de red forzar el uso de algoritmos débiles. Parche disponible, acción inmediata recomendada.",
    content: `Los CVEs críticos en SSH son raros precisamente porque el protocolo lleva décadas de auditorías y análisis. Cuando uno aparece, conviene tomárselo en serio. El CVE-2026-4821, publicado esta semana por el equipo de seguridad de OpenBSD con coordinación de CERT/CC, afecta al mecanismo de intercambio de claves (KEX) de OpenSSH en versiones anteriores a la 9.9 y tiene una ventana de explotación real bajo ciertas condiciones de red.

![Ciberseguridad SSH vulnerabilidad](/news/ssh-security.jpg)

La buena noticia: el parche está disponible, la actualización a OpenSSH 9.9 es sencilla, y no hay evidencia de explotación activa en el momento de la publicación. La mala noticia: el número de servidores con versiones afectadas en internet es enorme. Los escáneres de Shodan y Censys reportan decenas de millones de endpoints SSH expuestos con versiones vulnerables.

## ¿Qué hace exactamente el bug?

El fallo está en cómo OpenSSH maneja la negociación de algoritmos durante el handshake KEX cuando el cliente propone una lista de algoritmos que incluye variantes obsoletas (específicamente \`diffie-hellman-group1-sha1\` y \`diffie-hellman-group14-sha1\`) y el servidor tiene configuradas ciertas combinaciones de \`KexAlgorithms\`.

Un atacante con capacidad de estar en posición de Man-in-the-Middle (por ejemplo, en la misma red, mediante ARP spoofing, o comprometiendo un router intermedio) puede manipular los paquetes de negociación para forzar el uso del algoritmo más débil de la lista, incluso si el servidor está configurado para preferir algoritmos modernos.

Esto no permite acceso directo al servidor; requiere que el atacante ya esté en posición de interceptar el tráfico. Pero una vez conseguido, puede degradar la seguridad del canal a un nivel donde ataques de recuperación de sesión son factibles con recursos modernos.

## Quién está afectado

- **OpenSSH < 9.9** en cualquier sistema operativo: Linux, macOS, BSDs.
- **Libssh** versiones < 0.10.7 (parche separado, mismo vector).
- Sistemas embebidos con SSH dropbear < 2024.85 (en evaluación).

Versiones de OpenSSH >= 9.9 **no son vulnerables**. Si actualizaste en los últimos tres meses, probablemente estés bien.

## Cómo verificar y parchear

\`\`\`bash
# Verificar la versión actual
ssh -V
# OpenSSH_9.9p1 es la versión parcheada mínima

# En sistemas Debian/Ubuntu
sudo apt update && sudo apt upgrade openssh-server

# En sistemas RHEL/CentOS/Fedora
sudo dnf update openssh

# En macOS (vía Homebrew, la versión del sistema no actualiza automáticamente)
brew upgrade openssh
\`\`\`

Después de actualizar, reinicia el servicio SSH. En sistemas críticos, verifica que el servicio levanta correctamente antes de cerrar la sesión actual.

## Mitigación adicional: desactiva los algoritmos KEX obsoletos

Aunque el parche es la solución correcta, si por alguna razón no puedes actualizar de inmediato, puedes mitigar el riesgo eliminando los algoritmos débiles de la negociación en \`/etc/ssh/sshd_config\`:

\`\`\`
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp521,ecdh-sha2-nistp384,ecdh-sha2-nistp256,diffie-hellman-group18-sha512,diffie-hellman-group16-sha512
\`\`\`

Esta configuración elimina todos los algoritmos Diffie-Hellman de grupos pequeños y SHA-1, cerrando el vector de ataque sin necesidad de actualizar el binario. Reinicia sshd después del cambio.

## El contexto más amplio

Este CVE es un recordatorio de por qué la configuración por defecto de SSH importa tanto como la versión. Muchos servidores tienen \`KexAlgorithms\` sin configurar explícitamente, lo que deja la decisión al defecto del binario — y los valores por defecto históricos de OpenSSH han incluido algoritmos legacy para compatibilidad con clientes antiguos.

La recomendación del equipo de OpenBSD, que van a implementar en futuras versiones, es cambiar el comportamiento por defecto para no ofrecer algoritmos SHA-1 a menos que estén explícitamente habilitados en la configuración. Es el tipo de cambio que genera alguna queja de compatibilidad a corto plazo y mejora materialmente la postura de seguridad por defecto a largo plazo.`,
    image: "/news/ssh-security.jpg",
    category: "security",
    tags: ["SSH", "CVE", "OpenSSH", "Vulnerabilidad", "Parche"],
    author: authors.dax,
    publishedAt: "2026-05-14T08:00:00Z",
    readingMinutes: 9,
    views: 11240,
    likes: 892,
    trending: true,
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
