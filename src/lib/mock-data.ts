import type { Category, NewsArticle } from "./types";

const heroAi = "/news/hero-ai.jpg";
const rust = "/news/rust.jpg";
const security = "/news/security.jpg";
const startup = "/news/startup.jpg";
const neural = "/news/neural.jpg";
const devops = "/news/devops.jpg";
const programming = "/news/rust.jpg";
const openSource = "/news/neural.jpg";
const cloudFreeTier = "/news/cloud-free-tier.png";

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

export const news: NewsArticle[] = [
  {
    slug: "agentes-ia-produccion-patrones-arquitectura",
    title: "Agentes IA en producción: los 5 patrones de arquitectura que realmente funcionan",
    excerpt:
      "Del prototipo al sistema estable: los patrones concretos que separan los agentes que escalan de los que explotan en producción.",
    content: `Montar un agente de IA que funcione en un notebook es sencillo. Que ese agente funcione de forma fiable en producción, bajo carga real, con usuarios reales y sin que explote cada vez que el modelo alucina, es otra historia completamente distinta.

Llevamos dos años viendo cómo equipos de todo tamaño pasan por el mismo ciclo: prototipo impresionante, demo que funciona, deploy que colapsa. El problema casi nunca es el modelo. El problema es la arquitectura que rodea al modelo.

Estos son los cinco patrones que, tras revisar docenas de sistemas en producción, realmente marcan la diferencia.

## 1. ReAct con memoria episódica acotada

El patrón ReAct (Reasoning + Acting) es el punto de partida de casi todos los agentes. El agente razona, actúa, observa el resultado, y vuelve a razonar. El problema en producción es que la ventana de contexto crece sin control.

La solución que funciona es la **memoria episódica acotada**: en lugar de pasar todo el historial al modelo, pasas solo los últimos N pasos relevantes más un resumen comprimido del estado anterior. El agente sigue teniendo continuidad, pero el coste por llamada no crece indefinidamente.

\`\`\`python
def build_context(history: list[Step], max_steps: int = 10) -> str:
    recent = history[-max_steps:]
    summary = summarize(history[:-max_steps]) if len(history) > max_steps else ""
    return format_context(summary, recent)
\`\`\`

## 2. Tool calling con contrato explícito

El mayor error en tool calling no es el modelo: es que los desarrolladores definen las herramientas de forma ambigua. Si el modelo puede interpretar la herramienta de dos maneras distintas, lo hará, y eligirá la incorrecta justo cuando no debes.

El patrón correcto es tratar cada tool como un contrato: nombre inequívoco, descripción que incluye cuándo NO usar la herramienta, ejemplos de input/output, y validación de esquema en ambas direcciones.

Los sistemas que usan Pydantic o Zod para validar los argumentos antes de ejecutar la tool tienen tasas de error hasta 60% menores que los que confían ciegamente en el output del modelo.

## 3. Supervisor-Worker para tareas largas

Cuando la tarea requiere más de 5-6 pasos, el patrón de agente único empieza a degradarse. El contexto se llena, el modelo pierde el hilo, y los errores se acumulan.

El patrón **Supervisor-Worker** divide el trabajo: un agente supervisor descompone la tarea en subtareas atómicas y delega en agentes worker especializados. Cada worker tiene un scope acotado y un contexto limpio.

Lo importante es que el supervisor no intenta ejecutar nada directamente: su único trabajo es planificar, delegar, y agregar resultados. La separación de responsabilidades es lo que hace que el sistema sea debuggeable.

## 4. Checkpointing y reanudación

Los agentes de larga duración fallan. El modelo tiene un error transitorio, la API externa devuelve un 503, el usuario cierra la sesión. Sin checkpointing, todo el trabajo previo se pierde.

El patrón es simple pero pocas implementaciones lo tienen desde el principio: serializa el estado del agente (qué pasos completó, qué observaciones tiene, qué plan sigue) después de cada paso significativo. Si algo falla, reanuda desde el último checkpoint válido.

\`\`\`python
@dataclass
class AgentCheckpoint:
    task_id: str
    completed_steps: list[Step]
    current_plan: Plan
    observations: dict[str, Any]
    created_at: datetime

async def run_with_checkpoint(task: Task, storage: CheckpointStorage):
    checkpoint = await storage.load(task.id) or AgentCheckpoint.new(task)
    async for step in agent.run(task, resume_from=checkpoint):
        await storage.save(step.checkpoint)
        yield step
\`\`\`

## 5. Evaluación continua en el loop

El quinto patrón es el menos glamuroso y el más importante: un evaluador automático que corre dentro del loop de ejecución, no solo al final.

En lugar de ejecutar toda la cadena y ver el resultado al final, el evaluador revisa cada paso intermediario: ¿la acción tiene sentido dado el objetivo? ¿el output de la tool es plausible? ¿el agente está en bucle?

Los equipos que implementan esto detectan el 80% de los fallos antes de que el agente llegue a cometer un error visible al usuario. El coste es una llamada adicional al modelo por paso —normalmente con un modelo más pequeño y barato—, que compensa con creces.

## El patrón que no está en esta lista

Hay un patrón que todo el mundo menciona y pocos usan bien: **human-in-the-loop**. No como fallback cuando todo falla, sino como decisión de diseño deliberada para acciones de alto impacto.

Los sistemas de producción más robustos no intentan automatizar el 100%. Identifican con precisión qué decisiones deben pasar siempre por un humano y construyen el flujo alrededor de eso desde el principio, en lugar de añadirlo como parche después.

Eso, más que cualquier patrón técnico, es lo que separa los agentes que dan vergüenza mostrar de los que dan orgullo.`,
    image: "/news/ai-agents-architecture.jpg",
    category: "ai",
    tags: ["Agentes IA", "Arquitectura", "Producción", "LLMs", "Patrones"],
    author: authors.noa,
    publishedAt: "2026-06-03T09:00:00Z",
    readingMinutes: 9,
    views: 2100,
    likes: 187,
    featured: false,
    trending: true,
  },
  {
    slug: "postgres-vectorial-pgvector-produccion",
    title: "pgvector en producción: PostgreSQL como base de datos vectorial sin abandonar tu stack",
    excerpt:
      "Búsqueda semántica, RAG y embeddings directamente en tu Postgres. Cuándo pgvector es suficiente y cuándo necesitas algo más.",
    content: `La mayoría de equipos que empiezan a construir aplicaciones con RAG hacen lo mismo: buscan una base de datos vectorial, evalúan Pinecone, Weaviate o Qdrant, y acaban añadiendo una dependencia nueva a su stack. A veces tiene sentido. Muchas veces, no.

Si ya tienes PostgreSQL en producción —y la mayoría de aplicaciones lo tienen—, pgvector te da búsqueda vectorial sin salir de tu stack actual. La pregunta no es si puedes usarlo: la pregunta es cuándo es suficiente y cuándo no lo es.

## Qué es pgvector y qué problema resuelve

pgvector es una extensión de PostgreSQL que añade un tipo de dato \`vector\` y operadores para calcular similitud entre vectores. Esto te permite almacenar embeddings directamente en tus tablas y hacer búsquedas de similitud (nearest neighbor) con SQL normal.

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documentos (
  id BIGSERIAL PRIMARY KEY,
  contenido TEXT,
  embedding vector(1536),  -- dimensiones del modelo de embeddings
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Búsqueda por similitud coseno
SELECT contenido, 1 - (embedding <=> $1) AS similitud
FROM documentos
ORDER BY embedding <=> $1
LIMIT 10;
\`\`\`

## El índice que importa: HNSW vs IVFFlat

pgvector soporta dos tipos de índice para búsqueda aproximada. Elegir mal aquí es el error más común en producción.

**IVFFlat** divide los vectores en listas (clusters) y busca solo en los más cercanos al query. Es rápido de construir y funciona bien para colecciones estáticas, pero degrada mucho si insertas datos frecuentemente porque el índice no se rebalancea.

**HNSW** (Hierarchical Navigable Small World) construye un grafo multicapa que permite búsqueda logarítmica. Es más lento de construir y consume más memoria, pero mantiene la precisión bajo inserciones continuas y escala mejor en producción.

\`\`\`sql
-- HNSW: mejor para datos dinámicos
CREATE INDEX ON documentos USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- IVFFlat: mejor para colecciones grandes y estáticas
CREATE INDEX ON documentos USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);
\`\`\`

Regla práctica: si insertas más de 1000 documentos al día, HNSW. Si cargas un corpus de una vez y rara vez actualizas, IVFFlat.

## RAG con pgvector: el flujo completo

\`\`\`python
import asyncpg
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def rag_query(pregunta: str, conn: asyncpg.Connection) -> str:
    # 1. Generar embedding de la pregunta
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=pregunta
    )
    query_embedding = response.data[0].embedding

    # 2. Recuperar documentos relevantes
    docs = await conn.fetch("""
        SELECT contenido, 1 - (embedding <=> $1) AS score
        FROM documentos
        WHERE 1 - (embedding <=> $1) > 0.7
        ORDER BY embedding <=> $1
        LIMIT 5
    """, query_embedding)

    # 3. Construir contexto y llamar al LLM
    contexto = "\\n\\n".join(doc["contenido"] for doc in docs)
    completion = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"Contexto:\\n{contexto}"},
            {"role": "user", "content": pregunta}
        ]
    )
    return completion.choices[0].message.content
\`\`\`

## Cuándo pgvector es suficiente

pgvector cubre bien estos escenarios:
- Colecciones de hasta ~10 millones de vectores con HNSW
- Equipos que ya operan PostgreSQL y quieren evitar otra dependencia
- Aplicaciones donde los vectores conviven con datos relacionales (filtros por usuario, fecha, categoría)
- Startups que quieren velocidad de iteración sin complejidad operacional

La ventaja clave frente a bases de datos vectoriales especializadas no es el rendimiento: es la **colocación de datos**. Puedes hacer JOINs entre tus vectores y tu tabla de usuarios, filtrar por permisos antes de buscar, o actualizar un documento y su embedding en la misma transacción.

## Cuándo necesitas algo más

pgvector tiene límites reales que importan en ciertos contextos:
- **Más de 10-15M de vectores**: el rendimiento de HNSW empieza a degradar con colecciones muy grandes
- **Multi-tenancy masivo**: si tienes miles de tenants con colecciones separadas, la gestión de índices se complica
- **Latencia P99 muy estricta (<10ms)**: las bases de datos vectoriales especializadas tienen ventaja aquí
- **Búsqueda híbrida compleja**: combinaciones de vectores + text search + facets a escala

En esos casos, Qdrant o Weaviate tienen sentido. Pero para el 80% de las aplicaciones RAG que se construyen hoy, pgvector es más que suficiente.

## Configuración de producción que no puedes olvidar

\`\`\`sql
-- Ajustar trabajo de memoria para construcción de índices
SET maintenance_work_mem = '1GB';

-- Para búsqueda HNSW en tiempo de query
SET hnsw.ef_search = 100;  -- más alto = más preciso, más lento

-- Monitorizar tamaño del índice
SELECT pg_size_pretty(pg_relation_size('documentos_embedding_idx'));
\`\`\`

La configuración de \`maintenance_work_mem\` es especialmente importante: construir un índice HNSW con la configuración por defecto (64MB) en una colección de 1M de vectores puede tardar horas. Con 1-4GB, el mismo proceso tarda minutos.`,
    image: "/news/pgvector-database.jpg",
    category: "programming",
    tags: ["PostgreSQL", "pgvector", "RAG", "Embeddings", "Bases de Datos"],
    author: authors.dax,
    publishedAt: "2026-06-03T08:00:00Z",
    readingMinutes: 10,
    views: 1850,
    likes: 163,
    trending: true,
  },
  {
    slug: "ollama-vs-lmstudio-llms-locales-2026",
    title:
      "Ollama vs LM Studio en 2026: cómo elegir tu entorno de LLMs locales según tu caso de uso",
    excerpt:
      "Dos formas distintas de correr modelos en tu máquina. Una comparativa práctica para desarrolladores que quieren privacidad, velocidad o simplemente control total.",
    content: `Correr un LLM en tu propia máquina dejó de ser un ejercicio de masoquismo técnico. Con Ollama y LM Studio, cualquier desarrollador con una GPU razonable —o incluso con solo CPU— puede tener un modelo funcionando en minutos. El problema ya no es si puedes hacerlo: es cuál de los dos usar y para qué.

Esta no es una comparativa de benchmarks. Es una guía para elegir según lo que realmente vas a hacer con el modelo.

## Qué son y qué hacen diferente

**Ollama** es una herramienta de línea de comandos que expone una API REST compatible con OpenAI. Está pensada para desarrolladores: descargas un modelo con un comando, lo sirves en localhost:11434, y cualquier cliente que hable con la API de OpenAI funciona sin cambios. Nada de interfaz gráfica, todo en terminal.

**LM Studio** es una aplicación de escritorio con interfaz visual. Tiene un chat integrado, explorador de modelos, configuración de parámetros con sliders, y también expone una API REST local. Está pensada para ser usable por alguien que no quiere tocar la terminal.

La diferencia fundamental no es de capacidades técnicas —ambos pueden correr los mismos modelos— sino de filosofía: Ollama es una pieza de infraestructura, LM Studio es una aplicación de usuario.

## Ollama: para integrar modelos en tu flujo de desarrollo

Si vas a usar el modelo desde código, Ollama es la opción correcta. La API es compatible con el cliente oficial de OpenAI, lo que significa que cambiar de GPT-4 a un modelo local es literalmente cambiar la URL base:

\`\`\`python
from openai import OpenAI

# Antes: cliente contra OpenAI
# client = OpenAI(api_key="sk-...")

# Con Ollama: exactamente lo mismo, distinta URL
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # cualquier string, no se valida
)

response = client.chat.completions.create(
    model="llama3.2:8b",
    messages=[{"role": "user", "content": "Explica qué es un closure en JavaScript"}],
)
print(response.choices[0].message.content)
\`\`\`

Descargar y servir un modelo:

\`\`\`bash
ollama pull llama3.2:8b        # descarga ~4.7GB
ollama pull qwen2.5-coder:7b   # modelo especializado en código
ollama serve                   # inicia el servidor (o corre automáticamente)
ollama list                    # modelos descargados
\`\`\`

Ollama también gestiona automáticamente la cuantización, la memoria GPU/CPU y las capas de offload. Si tu GPU tiene 8GB de VRAM y el modelo necesita 12GB, Ollama distribuye automáticamente lo que no cabe en GPU hacia RAM del sistema.

## LM Studio: para explorar modelos y experimentar rápido

LM Studio brilla cuando quieres probar un modelo sin escribir código. Descarga el modelo desde su interfaz, ajusta temperatura, top-p y longitud de contexto con sliders, y chatea directamente. Para evaluar si un modelo sirve para un caso de uso concreto antes de integrarlo, es más rápido que cualquier alternativa.

También tiene ventajas prácticas para no-técnicos del equipo: un PM o un diseñador puede explorar capacidades del modelo sin necesidad de terminal. Y el servidor local que expone es también compatible con la API de OpenAI, así que la integración posterior es igual de directa.

## Comparativa directa

| Aspecto | Ollama | LM Studio |
|---|---|---|
| Instalación | \`brew install ollama\` / script | Instalador GUI |
| Interfaz | Terminal + API REST | GUI + API REST |
| Compatibilidad API | OpenAI-compatible | OpenAI-compatible |
| Gestión de modelos | CLI (\`ollama pull\`) | Explorador visual |
| Automatización / CI | Excelente | Limitado |
| Ajuste de parámetros | Via Modelfile o API | Sliders en UI |
| Soporte GPU | NVIDIA, AMD, Apple Silicon | NVIDIA, AMD, Apple Silicon |
| Sistema operativo | macOS, Linux, Windows | macOS, Windows (Linux beta) |
| Multimodal (visión) | Sí (llava, etc.) | Sí |

## Qué modelos usar en 2026

La elección del entorno importa, pero la elección del modelo importa más. Algunos que funcionan bien en local en 2026:

- **Código**: \`qwen2.5-coder:7b\` o \`deepseek-coder-v2:16b\` si tienes GPU con más VRAM
- **Propósito general**: \`llama3.2:8b\` para balance velocidad/calidad, \`llama3.1:70b\` si tienes hardware potente
- **Razonamiento**: \`qwq:32b\` para tareas que requieren chain-of-thought
- **Embeddings**: \`nomic-embed-text\` (Ollama) para RAG local

## La respuesta corta

Usa **Ollama** si vas a integrarlo en código, automatizarlo, o usarlo en un servidor.

Usa **LM Studio** si quieres explorar modelos visualmente, hacer demos, o necesitas que alguien sin experiencia técnica interactúe con el modelo.

Y si ya tienes Ollama funcionando, no necesitas LM Studio: puedes conectar Open WebUI a tu instancia local de Ollama y tener la interfaz visual sin duplicar la infraestructura.`,
    image: "/news/local-llm-terminal.jpg",
    category: "ai",
    tags: ["Ollama", "LM Studio", "LLMs Locales", "Privacidad", "Modelos"],
    author: authors.noa,
    publishedAt: "2026-06-03T07:00:00Z",
    readingMinutes: 8,
    views: 1620,
    likes: 141,
    featured: true,
    trending: true,
  },
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
    content: `Cuando la CISA publica una hoja de ruta, las grandes plataformas escuchan. El último informe de la Cybersecurity and Infrastructure Security Agency dedica un capítulo entero a un problema que lleva décadas acumulándose en silencio: el coste real de la corrupción de memoria en software escrito en C y C++.

![Memory safety Rust kernel](/news/rust.jpg)

La cifra que más circula en el sector es que entre el 60 y el 70% de las vulnerabilidades críticas reportadas en los últimos años tienen su origen en errores de gestión de memoria. Buffer overflows, use-after-free, double frees. Bugs que un compilador moderno podría detectar antes de que el código llegara a producción.

## Por qué ahora

La pregunta razonable es: si este problema existe desde hace décadas, ¿por qué es una prioridad nacional ahora? La respuesta tiene varias capas.

Primero, la superficie de ataque ha crecido exponencialmente. El software embebido en infraestructura crítica —redes eléctricas, sistemas de control industrial, dispositivos médicos— está escrito en gran medida en C. A medida que más de esa infraestructura se conecta a internet, los bugs de memoria que antes eran solo un problema de estabilidad se convierten en vectores de ataque reales.

Segundo, la computación cuántica presiona a los equipos de seguridad a renovar stacks completos en los próximos años de todas formas. Si ya tienes que tocar el código, tiene sentido hacerlo con el lenguaje correcto.

## Rust como respuesta técnica

El informe de la CISA no menciona Rust por su nombre, pero la dirección es inequívoca: lenguajes con garantías de seguridad de memoria en tiempo de compilación. Rust es hoy el único candidato serio para sistemas de bajo nivel.

\`\`\`rust
// En Rust, el compilador detecta use-after-free antes de ejecutar
let s = String::from("hello");
let r = &s;
drop(s); // Error: no puedes mover s mientras r tiene una referencia
println!("{}", r);
\`\`\`

El kernel de Linux ya acepta drivers en Rust en mainline. Google lleva dos años reescribiendo partes de Android con Rust. Microsoft ha anunciado que nuevos componentes del sistema operativo se escribirán en Rust por defecto.

## La realidad de la migración

Reescribir código existente en C no es realista en la mayoría de casos. La estrategia que está funcionando es incremental: los módulos nuevos se escriben en Rust, los módulos críticos existentes se van reemplazando cuando se reescriben por otras razones, y los bindings de interoperabilidad permiten que ambos mundos coexistan.

Para equipos que trabajan en infraestructura crítica, el mensaje del informe es claro: la pregunta no es si migrar, sino cuándo y con qué plan.`,
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
    content: `Un investigador independiente reportó la vulnerabilidad hace 72 horas a través del programa de divulgación responsable de Bytecode Alliance. Hoy, con el parche ya disponible, repasamos qué hace exactamente, a quién afecta y cómo mitigarlo si todavía no has actualizado.

![WebAssembly zero-day sandbox](/news/security.jpg)

El bug, registrado como CVE-2026-3179, afecta a Wasmtime en versiones anteriores a la 18.0.3 y a Wasmer antes de la 4.3.1. Ambos runtimes son ampliamente utilizados en entornos de servidor para ejecutar módulos WASM de forma aislada, y ese aislamiento es precisamente lo que este bug compromete.

## Qué hace el bug

El fallo está en la validación de índices de tabla durante la compilación JIT. Bajo ciertas condiciones con módulos WASM malformados, un atacante puede conseguir que el runtime escriba fuera de los límites del sandbox de memoria asignado al módulo.

En la práctica, esto significa que un módulo WASM malicioso podría leer o escribir memoria del proceso anfitrión — rompiendo el aislamiento que es la promesa central de WebAssembly como plataforma de plugins y ejecución segura de código no confiable.

\`\`\`bash
# Verificar versión de Wasmtime
wasmtime --version
# wasmtime 18.0.3 es la versión segura mínima

# Actualizar vía cargo
cargo install wasmtime-cli
\`\`\`

## Quién está en riesgo

El vector de ataque requiere que el runtime ejecute módulos WASM provenientes de fuentes no confiables. Los casos más expuestos son:

- **Plataformas de plugins** que permiten a terceros subir módulos WASM
- **CDNs y edge runtimes** que ejecutan código de usuario en WASM
- **Sandboxes de evaluación** de código en entornos educativos o de CI

Si usas Wasmtime o Wasmer exclusivamente para ejecutar tu propio código compilado, el riesgo es bajo pero la actualización sigue siendo recomendada.

## Mitigación inmediata

Actualizar a Wasmtime 18.0.3 o Wasmer 4.3.1 es la única mitigación completa. No hay workaround de configuración para este bug específico. El parche corrige la validación de índices en el compilador Cranelift que usa Wasmtime y en el motor Singlepass de Wasmer.

Bytecode Alliance ha publicado un advisory completo con los hashes de commits afectados para quienes necesiten hacer backport a versiones antiguas por restricciones de entorno.`,
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
    content: `El último batch de Y Combinator ha cambiado de composición de forma llamativa. Más empresas con hardware, más equipos con doctorado, notablemente menos clones de productividad con una capa de IA encima. Hablamos con tres partners de YC para entender qué está cambiando y por qué ahora.

![Y Combinator hard tech batch](/news/startup.jpg)

Durante varios años, la narrativa dominante en Silicon Valley fue que el software tenía ventajas estructurales sobre el hardware: márgenes mejores, escalado más rápido, menos capital inicial. Esa narrativa no ha desaparecido, pero se está matizando. Y YC, que siempre ha sido un barómetro razonablemente fiable de hacia dónde va el dinero, lo está reflejando.

## Los números del giro

En el batch de invierno 2026, alrededor del 28% de las empresas trabajan con componentes físicos de algún tipo: robótica, biotech, semiconductores, energía, manufactura avanzada. Hace cuatro años ese porcentaje rondaba el 12%. No es un movimiento brusco, pero la dirección es consistente batch tras batch.

Lo que también llama la atención es la formación de los equipos fundadores. Los PhDs en ingeniería, física o biología son más frecuentes que en cualquier momento anterior de la historia de YC. Los fundadores que vienen directamente de laboratorios de investigación de Stanford, MIT o ETH están siendo aceptados con más regularidad.

## La fatiga del SaaS de nicho

> "Hay una generación de fundadores que no quieren construir otra herramienta de gestión de tareas con IA. Quieren construir cosas que existan en el mundo físico." — partner de YC en entrevista.

El SaaS B2B sigue siendo un modelo perfectamente válido y seguirá siéndolo. Pero la percepción de que ese espacio está saturado en las categorías más accesibles está empujando a fundadores ambiciosos hacia problemas más difíciles y menos concurridos.

## Por qué el capital está siguiendo el movimiento

La otra cara del cambio es que el capital riesgo también ha rotado. Después de varios años de corrección de valoraciones en SaaS, los fondos generalistas están más abiertos a hard tech de lo que estaban en 2021. La tesis es que los ciclos de hardware son más largos pero los fosos competitivos son mucho más profundos una vez establecidos.

Para los fundadores técnicos con formación en ingeniería, el momento actual puede ser una ventana interesante: más apetito inversor hacia problemas físicos complejos, y menos competencia directa que en el software puro.`,
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
    content: `El debate sobre qué significa que un modelo de IA sea verdaderamente open source ya no es semántico. La OSI está a punto de publicar su borrador final para definir IA abierta, y la discusión ha llegado a un punto en el que una definición restrictiva podría dejar fuera a buena parte del ecosistema actual —incluyendo modelos que hoy se presentan como abiertos.

![Open weights vs open source debate](/news/neural.jpg)

El problema de fondo es que el término "open source" tiene una definición muy clara para el software: acceso al código fuente y libertad para modificarlo y distribuirlo. Pero los modelos de IA añaden una capa que el software tradicional no tiene: los datos de entrenamiento y el proceso de entrenamiento son tan importantes como el código.

## La distinción que importa

La OSI propone distinguir entre tres niveles de apertura:

**Open weights**: el modelo entrenado está disponible para descargar y ejecutar, pero no el código de entrenamiento ni los datos. Es lo que ofrecen hoy Llama, Mistral y la mayoría de modelos "abiertos" populares.

**Open training**: además de los pesos, el código de entrenamiento es público y reproducible. Pocos modelos llegan aquí.

**Fully open source**: pesos, código de entrenamiento y datos de entrenamiento, todo bajo licencias que permiten uso, modificación y distribución sin restricciones. Prácticamente ningún modelo frontier llega a este nivel.

## La presión de los grandes labs

Meta, Mistral y Stability AI han presionado activamente para que la definición sea más laxa y permita que "open weights" cuente como open source. El argumento es pragmático: si la OSI adopta una definición muy estricta, casi nada en el ecosistema actual calificaría, lo que reduciría la relevancia de la certificación.

El contragolpe de la comunidad más purista es igualmente directo: si la certificación no significa nada exigente, no sirve de nada tenerla.

## Qué está en juego

La decisión de la OSI importa más allá del debate académico. Reguladores en Europa y Estados Unidos están usando el término "modelo abierto" en textos legales. Si no hay una definición técnica clara, las empresas pueden hacer lobbying para que sus modelos semi-abiertos reciban el mismo trato regulatorio que el software verdaderamente libre. Eso tiene consecuencias reales en competencia, auditoría y rendición de cuentas.`,
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
    content: `Lo que empezó como una pieza de infraestructura para microservicios web es hoy la pieza más estratégica de cualquier stack de IA serio. Kubernetes no fue diseñado pensando en GPUs ni en inferencia de modelos, pero la comunidad lo ha ido adaptando hasta convertirlo en el plano de control de facto para cargas de trabajo de IA a escala.

![Kubernetes inferencia GPU](/news/devops.jpg)

El cambio no es trivial. Orquestar contenedores de aplicaciones web y orquestar pods de inferencia con acceso a GPUs son problemas con características muy distintas: tiempos de arranque, afinidad de hardware, patrones de consumo de memoria, scheduling de lotes. Kubernetes ha tenido que evolucionar, y lo ha hecho a través de una capa de operadores y extensiones que en 2026 ya forman un ecosistema robusto.

## Los operadores que están cambiando el juego

**KEDA (Kubernetes Event-Driven Autoscaling)** se ha convertido en la pieza estándar para escalar réplicas de inferencia basándose en métricas de cola: número de requests pendientes, latencia p95, tokens por segundo. El autoscaler nativo de Kubernetes basado en CPU no era suficiente para este tipo de cargas.

**GPU Operator de NVIDIA** automatiza todo lo que antes requería configuración manual: drivers, runtime de contenedor, exportador de métricas, time-slicing de GPUs. En clusters grandes, la diferencia entre gestionarlo a mano y usar el operador es de días de operaciones por semana.

**Kueue** resuelve el scheduling de batch jobs de entrenamiento: prioridades, cuotas por equipo, gestión de la cola cuando no hay recursos disponibles. Es el pilar de los sistemas de entrenamiento distribuido sobre Kubernetes.

\`\`\`yaml
# Ejemplo de NodePool con afinidad de GPU
apiVersion: karpenter.sh/v1
kind: NodePool
spec:
  template:
    spec:
      requirements:
        - key: karpenter.k8s.aws/instance-gpu-name
          operator: In
          values: ["h100", "a100"]
\`\`\`

## El problema del cold start

El talón de Aquiles de la inferencia sobre Kubernetes sigue siendo el tiempo de arranque. Cargar un modelo de 70B en una GPU puede tardar varios minutos, lo que hace que el autoscaling reactivo sea poco práctico para endpoints con baja latencia. Las soluciones actuales van desde mantener réplicas mínimas calientes hasta sistemas de precarga predictiva basados en patrones de tráfico histórico.

Knative Serving, combinado con técnicas de snapshot de memoria de GPU, está reduciendo esos tiempos en algunos entornos a menos de 30 segundos. Todavía lejos del ideal, pero la dirección es la correcta.`,
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
    content: `Migrar a React Server Components no es flip-the-switch. Es repensar dónde vive el estado, quién lo posee y cómo se serializa. Los equipos que lo están haciendo bien están tardando meses, no semanas, y los que lo están haciendo mal están acumulando deuda técnica que tendrán que pagar más tarde.

![React Server Components migración](/news/neural.jpg)

Después de más de un año desde que RSC llegó a producción estable con Next.js App Router, el ecosistema tiene suficiente experiencia acumulada como para hablar de patrones que funcionan y antipatrones que se repiten. Eso es exactamente lo que hemos recopilado hablando con equipos de distintos tamaños.

## El modelo mental que más ayuda

La forma más práctica de pensar en la migración es separar el árbol de componentes en dos preguntas independientes:

1. **¿Necesita este componente estado interactivo del usuario?** Si sí, es un Client Component. Si no, probablemente puede ser Server Component.
2. **¿Necesita datos que solo están disponibles en el servidor?** Si sí, Server Component. Si esos datos vienen de una API externa que también tienes en el cliente, Client Component.

El error más común es intentar convertir todo a Server Components de golpe. El resultado es inevitablemente una cadena de errores de "you cannot use hooks in a server component" que frustra al equipo y genera regresiones.

## El patrón que funciona: composición

\`\`\`tsx
// Server Component — accede a la DB directamente
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id); // Sin fetch, sin API
  return (
    <div>
      <ProductDetails product={product} />
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}
\`\`\`

El Server Component hace el trabajo pesado de datos; el Client Component solo gestiona la interactividad. La clave está en pasar datos serializables (objetos planos, strings, números) desde el servidor al cliente — no instancias de clases ni funciones.

## Lo que más complica la migración

- **Context API**: los contextos de React no funcionan en Server Components. Los datos globales que vivían en contexto tienen que subir a la URL, a cookies o a un store de servidor.
- **Librerías de terceros**: muchas librerías de UI asumen que están en el cliente. Necesitan ser importadas desde Client Components o envueltas en wrappers.
- **Suspense y streaming**: la ganancia real de RSC viene de streaming con Suspense, pero requiere refactorizar cómo se cargan los datos y cómo se muestran los estados de carga.

La buena noticia es que la migración es incremental. Puedes tener un directorio con App Router y otro con Pages Router simultáneamente mientras migras rutas una a una.`,
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
    content: `NIST ha cerrado los primeros estándares de criptografía post-cuántica y la pregunta que tenían aparcada los equipos de infraestructura ya no puede esperar: ¿cuándo empezamos la migración? La respuesta corta es que si no has empezado a inventariar, ya vas tarde.

![Criptografía post-cuántica infraestructura](/news/security.jpg)

Los tres algoritmos estandarizados —ML-KEM (antes Kyber), ML-DSA (antes Dilithium) y SLH-DSA (antes SPHINCS+)— tienen implementaciones maduras en todas las plataformas principales. El problema no es técnico. Es de escala y de planificación.

## Por qué la urgencia

El argumento para actuar ahora, incluso cuando los ordenadores cuánticos capaces de romper RSA-2048 están todavía a años vista, es la amenaza "harvest now, decrypt later". Actores adversariales con suficientes recursos ya están almacenando tráfico cifrado hoy con la intención de descifrarlo cuando tengan la capacidad cuántica para hacerlo.

Para datos con vida útil larga —registros médicos, secretos comerciales, comunicaciones diplomáticas— eso significa que la ventana de riesgo ya está abierta.

## El inventario como primer paso

Antes de migrar nada, el paso obligatorio es saber qué tienes. En organizaciones de tamaño mediano, el número de lugares donde se usa criptografía asimétrica es sorprendentemente alto:

- Certificados TLS en APIs, webs y microservicios
- Claves SSH para acceso a infraestructura
- Firmas de código y artefactos de CI/CD
- Tokens JWT y cookies de sesión
- Comunicación entre servicios (mTLS)
- Almacenamiento de secretos (Vault, AWS KMS, etc.)

\`\`\`bash
# Auditar certificados TLS en tu infraestructura
openssl s_client -connect tu-servicio.com:443 2>/dev/null \
  | openssl x509 -noout -text \
  | grep "Public Key Algorithm"
\`\`\`

## El roadmap práctico

La estrategia que está funcionando en empresas que ya están en proceso es la hibridación: usar algoritmos clásicos y post-cuánticos en paralelo durante un período de transición. TLS 1.3 ya soporta cipher suites híbridas como \`X25519Kyber768\`.

Para DevOps, el roadmap realista es de tres a cinco años, con las APIs públicas y los certificados de mayor visibilidad como primera prioridad, seguidos de la infraestructura interna y finalmente los sistemas legacy que requieren más esfuerzo de integración.`,
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
    content: `Es un cambio simbólico tan importante como técnico. Los primeros drivers Rust del kernel de Linux han alcanzado estado estable en mainline, lo que significa que el kernel deja de ser exclusivamente C después de más de tres décadas. Para quienes llevan siguiendo este proceso desde los primeros parches de Linus aceptando Rust en 2022, el momento tiene cierto peso histórico.

![Rust kernel Linux mainline drivers](/news/rust.jpg)

Los drivers que han llegado a stable son el driver para dispositivos de entrada NovaStar y el driver de red para Apple Silicon de Asahi Linux — este último especialmente significativo porque es un driver de producción que ya usa gente real en hardware real.

## Qué ha tardado tanto

El camino desde "Rust está en el árbol del kernel" hasta "los drivers Rust son estables" ha sido más largo de lo que muchos esperaban, y vale la pena entender por qué.

El proceso de revisión del kernel de Linux es extremadamente riguroso, con razón. Un bug en un driver que corra en millones de máquinas tiene consecuencias muy reales. Los maintainers tuvieron que desarrollar no solo el soporte de Rust en sí, sino también abstracciones seguras sobre las APIs internas del kernel — que fueron diseñadas para C y no siempre tienen una traducción directa limpia a Rust.

\`\`\`rust
// Abstracción segura sobre una API del kernel en Rust
use kernel::prelude::*;
use kernel::net::{self, Device, Namespace};

#[vtable]
impl net::DeviceOperations for MyNetDevice {
    fn open(dev: &Device) -> Result {
        // El compilador garantiza que dev es válido aquí
        dev.start_queue();
        Ok(())
    }
}
\`\`\`

## El camino por delante

Este hito abre la puerta a más contribuciones. Ahora que hay un precedente de drivers Rust en mainline stable, otros maintainers tienen más confianza para empezar nuevos drivers en Rust en lugar de C. El subsistema de drivers de GPU y el de almacenamiento son los que más interés están generando en la comunidad.

Lo que no va a pasar es una migración masiva del código existente. Los drivers C funcionan y nadie va a reescribirlos solo por el placer de usar Rust. El cambio será gradual, dirigido por casos donde la seguridad de memoria sea especialmente crítica o donde los drivers sean nuevos de todas formas.`,
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
    content: `Sparse attention no es nuevo. Lo nuevo es la combinación de sparse attention con caché agresivo de KV y hardware específico para gestionar ventanas de contexto de 10 millones de tokens a un coste que empieza a ser viable en producción. Esta semana varios labs publicaron simultáneamente benchmarks sobre esta combinación y los números merecen atención.

![LLM contexto largo sparse attention](/news/neural.jpg)

La ventana de contexto ha sido uno de los caballos de batalla de los LLMs desde el principio. Los primeros modelos GPT trabajaban con ventanas de 2.048 tokens. GPT-4 llegó a 128K. Claude 3 escaló a 200K. Y ahora varios modelos de investigación están demostrando 10 millones de tokens con calidad razonable en las tareas de recuperación de información.

## El problema con los contextos largos clásicos

El mecanismo de atención estándar ("full attention") tiene un coste cuadrático respecto al largo del contexto: doblar la longitud cuadruplica el cómputo. A 10 millones de tokens, eso es computacionalmente imposible con hardware actual incluso para inferencia de un solo usuario.

Sparse attention resuelve esto haciendo que cada token solo atienda a un subconjunto del contexto — no a todos los demás tokens. El truco está en qué subconjunto elegir: si el sistema es bueno eligiendo qué partes son relevantes, la calidad no cae significativamente.

## La combinación que está funcionando

\`\`\`
Contexto largo eficiente = Sparse Attention + KV Cache comprimido + Hardware consciente
\`\`\`

**Sparse Attention por bloques**: en lugar de atención completamente aleatoria, se usa una combinación de atención local (tokens cercanos), atención global (tokens especiales designados como "summary tokens") y atención aleatoria esparsa. Este patrón preserva la mayor parte de la calidad.

**KV Cache comprimido**: almacenar el caché de claves y valores de todos los tokens de 10M en memoria GPU es inviable. Las técnicas de cuantización del caché a 4 bits y la paginación del caché con offloading a CPU permiten gestionar ventanas enormes con presupuestos de VRAM razonables.

**Hardware específico**: los nuevos aceleradores de Cerebras y los últimos dies de NVIDIA incluyen unidades específicas para operaciones de sparse attention que reducen drásticamente el tiempo de procesamiento.

## Para qué sirve realmente

La aplicación más inmediata no es el chat, sino el análisis de documentos completos: repositorios de código enteros, datasets de investigación, libros, bases de conocimiento corporativas. Poder enviar un repo completo al contexto y preguntar sobre él sin chunking ni RAG es un cambio cualitativo en cómo se construyen las aplicaciones.`,
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
    content: `Hicimos pruebas reales en cinco regiones durante dos semanas comparando Cloudflare Workers, Deno Deploy y Vercel Functions en condiciones de carga similares a las de una API de producción. Los resultados desmontan algunos mitos persistentes y confirman otros. Aquí está lo que encontramos.

![Edge runtimes comparativa 2026](/news/devops.jpg)

La premisa del edge computing para aplicaciones web es atractiva: en lugar de tener tu API en us-east-1 y que usuarios de Tokyo paguen 200ms de latencia extra, el código corre cerca del usuario. Pero "cerca del usuario" tiene matices importantes dependiendo de la plataforma.

## Metodología

Probamos desde cinco regiones: Tokio, São Paulo, Frankfurt, Lagos y Chicago. Cada plataforma recibió el mismo código: un handler que lee de KV, hace una operación de transformación de datos y devuelve JSON. Medimos p50, p95 y p99 de latencia desde el cliente, tiempo de cold start y comportamiento bajo carga sostenida de 1.000 req/s.

## Resultados por plataforma

**Cloudflare Workers** ganó en latencia p50 en todas las regiones excepto Lagos, donde su cobertura es más escasa. El cold start es virtualmente inexistente (< 5ms) gracias a V8 Isolates. El límite de 128MB de memoria por worker es restrictivo para algunas cargas. El ecosistema de bindings (KV, R2, D1, Queues) es el más maduro.

**Deno Deploy** sorprendió con la mejor latencia p99 en Frankfurt y Tokio. La integración con el ecosistema npm es más fluida de lo que esperábamos. El punto débil es la cobertura de regiones: 35 regiones frente a 310+ de Cloudflare. En Lagos, los números eran malos.

**Vercel Functions** (Edge Runtime) tiene la integración más fluida si ya usas Next.js — el DX es difícil de batir. En latencia pura quedó tercero en la mayoría de escenarios, pero la diferencia práctica en p50 era de menos de 10ms en los mercados principales. Donde sí perdió claramente fue en p99 bajo carga alta.

## El mito que más se repite

La idea de que "edge siempre es más rápido" es falsa en muchos casos reales. Si tus datos viven en una base de datos centralizada en us-east-1, el edge solo mueve la latencia de red del cliente al servidor — pero luego el worker todavía tiene que ir a buscar los datos a us-east-1. Para cargas donde la mayor parte del tiempo es I/O a una DB centralizada, el edge puede ser incluso más lento que una región normal bien elegida.`,
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
    content: `El seed ha cambiado de forma. Menos teatro, más métricas. Los decks con slides de "visión" sin tracción ya no abren puertas en los fondos que importan. Hablamos con seis fondos de seed para entender exactamente qué están buscando en 2026 y qué ha dejado de funcionar.

![Seed round founders técnicos 2026](/news/startup.jpg)

La corrección del mercado de 2022-2023 dejó una cicatriz permanente en cómo los VCs piensan el riesgo en etapas tempranas. Los que sufrieron más fueron los fondos que apostaron a valuaciones infladas en pre-seed con poca más que una idea bien articulada. El resultado es que el listón para levantar seed se ha movido de forma estructural.

## Lo que buscan hoy los fondos de seed

**Evidencia de retención, no solo de adquisición.** El número de usuarios que se registran es fácil de hinchar con un poco de marketing. Lo que los fondos miran primero ahora es qué porcentaje de los usuarios que se registraron hace tres meses siguen activos. Una retención del 40% a 30 días en B2C o del 60% en B2B a 90 días es el tipo de señal que abre conversaciones.

**Fundadores que conocen el problema desde dentro.** La narrativa del "outsider con perspectiva fresca" ha perdido atractivo. Los fondos prefieren fundadores que vengan del sector que quieren disrumpir —que hayan sentido el problema en su propio trabajo antes de decidir resolverlo.

**Velocidad de iteración demostrable.** No "vamos a iterar rápido", sino evidencia de que ya lo estás haciendo: cuántas veces has cambiado el producto en los últimos 60 días basándote en feedback de usuarios reales.

> "En 2021 invertíamos en la visión. En 2026 invertimos en la evidencia de que alguien está pagando por resolver este problema." — partner de un fondo de seed europeo.

## Los tickets y las valoraciones

El ticket promedio de seed en Europa se ha estabilizado entre 1,5M y 3M€ para rondas pre-producto con equipo sólido, y entre 3M y 7M€ para startups con primeros ingresos recurrentes. Las valoraciones han bajado respecto al pico de 2021 pero son más razonables y más sostenibles para las siguientes rondas.

En Estados Unidos los números son el doble aproximadamente, pero la dinámica es similar: más exigencia de tracción, menor tolerancia a la falta de claridad sobre el modelo de negocio.

## El consejo que más se repite

Todos los fondos con los que hablamos dijeron alguna versión de lo mismo: construye algo que funcione aunque sea para diez personas, y que esas diez personas no puedan vivir sin ello. Eso es suficiente para una conversación de seed en 2026.`,
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
    title:
      "Baseline 2026: las 12 APIs web que ya puedes usar sin polyfills en todos los navegadores",
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
    title:
      "Replit levanta 200M$ a 2.000M$ de valoración: la apuesta por el creador de software no-técnico",
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
    title:
      "La Linux Foundation lanza OpenAgent: estándares abiertos para la interoperabilidad entre agentes IA",
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
    title:
      "CVE crítico en SSH: millones de servidores expuestos por un fallo en el handshake de intercambio de claves",
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
  {
    slug: "free-tier-aws-gcp-azure-comparativa-2026",
    title: "AWS, GCP o Azure gratis: qué puedes hacer de verdad con cada plan free tier en 2026",
    excerpt:
      "Las tres grandes clouds ofrecen capas gratuitas, pero no todas son iguales. Comparamos en detalle qué incluye cada una, para qué tipo de proyectos encaja mejor y dónde están los límites reales.",
    content: `Cuando empiezas un proyecto nuevo —ya sea un side project, una startup en fase embrionaria o simplemente quieres aprender— la primera pregunta que te haces es: ¿cuánto me va a costar esto? La buena noticia es que AWS, Google Cloud y Azure tienen planes gratuitos bastante generosos. La mala es que no son equivalentes, y elegir el que no encaja con tu caso de uso puede costarte una sorpresa en la factura a final de mes.

Este artículo es una guía práctica. Sin tecnicismos innecesarios. Con ejemplos reales de qué puedes montar gratis, y con las advertencias que normalmente no aparecen en los folletos.

![Comparativa free tier AWS GCP Azure 2026](/news/cloud-free-tier.png)

---

## La diferencia entre "siempre gratis" y "gratis durante 12 meses"

Antes de entrar en detalles por plataforma, hay un concepto que tienes que tener clarísimo: **no todo el free tier dura para siempre**.

Las tres plataformas mezclan dos tipos de gratuidad:

- **Always free**: servicios que son gratuitos indefinidamente, aunque pasen los primeros 12 meses.
- **Free trial (12 meses)**: recursos gratuitos durante el primer año desde que creas la cuenta. Pasado ese tiempo, empiezan a cobrar.

Confundir estas dos categorías es el error más común que comete la gente. Monta algo en un recurso "gratis", lo olvida, y a los 13 meses llega una factura.

---

## AWS Free Tier: el más conocido, pero con trampas

![AWS Lambda serverless infraestructura](/news/aws.png)

AWS fue el primero en popularizar el concepto de free tier y sigue siendo el de mayor ecosistema. Su capa gratuita es generosa en servicios, pero requiere que estés atento a los límites.

### Recursos always free en AWS

- **Lambda**: 1 millón de invocaciones y 400.000 GB-segundo de cómputo al mes, para siempre. Esto es mucho. Una función que se llame 100 veces al día tardando medio segundo en ejecutar con 128 MB no te costará nada nunca.
- **DynamoDB**: 25 GB de almacenamiento y capacidad de lectura/escritura suficiente para aplicaciones de carga baja. Permanente.
- **S3**: ojo, el almacenamiento de S3 **no** es always free; solo los primeros 5 GB son gratuitos durante 12 meses.
- **SNS y SQS**: 1 millón de peticiones al mes de cada uno, para siempre.
- **CloudWatch Logs**: 5 GB de ingestión y 5 GB de almacenamiento al mes, permanentes.

### Recursos gratuitos solo los primeros 12 meses en AWS

- **EC2**: 750 horas/mes de instancias t2.micro o t3.micro (equivale a una máquina virtual corriendo 24/7 durante un mes).
- **RDS**: 750 horas/mes en instancia db.t2.micro o db.t3.micro, con 20 GB de almacenamiento.
- **Elastic Load Balancing**: 750 horas/mes.
- **Elastic Beanstalk**, **CodeBuild**, **CodePipeline**: con límites durante el primer año.

### Para qué tipo de proyecto encaja mejor AWS

AWS brilla especialmente cuando necesitas **arquitecturas serverless** y no quieres preocuparte por servidores. Si tu app puede vivir en Lambda + API Gateway + DynamoDB + S3, puedes tener algo funcionando en producción real de forma gratuita durante mucho tiempo.

También es la mejor opción si ya sabes que en el futuro vas a escalar: el ecosistema de AWS es el más maduro, con más documentación, más comunidad y más integraciones de terceros que cualquier otro cloud.

**Ideal para**: APIs REST serverless, bots, webhooks, aplicaciones JAMstack, proyectos de aprendizaje de arquitecturas cloud.

**Cuidado con**: las transferencias de datos de salida (egress) en AWS son caras. Si tu aplicación transfiere muchos datos desde S3 o EC2 hacia internet, el free tier se acaba rápido y empieza a cobrar.

---

## Google Cloud Platform (GCP): el always free más generoso en cómputo

![Google Cloud Platform infraestructura como código](/news/gcp.png)

GCP tiene algo que AWS y Azure no ofrecen de la misma forma: **instancias de máquinas virtuales always free**. Es decir, puedes tener una VM corriendo indefinidamente sin pagar nada. Eso cambia bastante el panorama.

### Recursos always free en GCP

- **Compute Engine (e2-micro)**: 1 instancia e2-micro al mes en us-east1, us-central1 o us-west1. Son máquinas pequeñas (2 vCPU, 1 GB RAM), pero suficientes para un servidor web, un bot, un cron job o un entorno de staging.
- **Cloud Storage**: 5 GB en la región estándar de Estados Unidos. Permanente.
- **Cloud Run**: 2 millones de peticiones al mes y 360.000 vCPU-segundos. Ideal para contenedores serverless.
- **BigQuery**: 10 GB de almacenamiento y 1 TB de consultas al mes. Una ganga brutal si trabajas con datos.
- **Cloud Functions**: 2 millones de invocaciones al mes. Permanente.
- **Firestore**: 1 GB de almacenamiento, 50.000 lecturas y 20.000 escrituras al día. Para siempre.
- **Secret Manager**: 6 secretos activos y 10.000 operaciones al mes.
- **Cloud Build**: 120 minutos de build al día.

### Trial inicial de GCP: $300 durante 90 días

GCP en lugar de 12 meses de free trial ofrece **$300 de crédito durante 90 días**. Eso te permite probar prácticamente cualquier servicio de la plataforma sin restricciones durante ese periodo.

### Para qué tipo de proyecto encaja mejor GCP

GCP es la opción más interesante si necesitas **persistencia de larga duración con cómputo siempre activo**. El e2-micro always free es perfecto para proyectos que necesitan un proceso corriendo 24/7: un servidor Discord, un scraper con cron, un servidor de desarrollo al que conectarte por SSH.

Además, para proyectos que trabajan con **datos y analytics**, BigQuery con 1 TB de consultas gratuitas al mes es difícilmente superable. Ninguna otra plataforma ofrece algo parecido en el free tier.

**Ideal para**: servidores siempre activos de bajo consumo, proyectos de datos y analytics, contenedores con Cloud Run, proyectos que usan Firebase (que se integra con GCP de forma nativa).

**Cuidado con**: los $300 de crédito se pueden gastar rápido si pruebas servicios de ML o instancias grandes. Cuando se acaben los créditos y pasen los 90 días, solo quedan los recursos always free.

---

## Azure Free Tier: el que más equilibrio ofrece con servicios enterprise

![Microsoft Azure DevOps pipelines enterprise](/news/azure.png)

Microsoft Azure tiene una propuesta interesante porque combina un free tier con créditos iniciales y una gama de servicios always free orientados a casos enterprise y de desarrollo continuo.

### Recursos always free en Azure

- **Azure Functions**: 1 millón de ejecuciones y 400.000 GB-segundos al mes. Equivalente a AWS Lambda.
- **Azure Blob Storage**: 5 GB (con LRS) al mes siempre gratuitos.
- **Azure Cosmos DB**: 1.000 unidades de solicitud por segundo y 25 GB de almacenamiento. Permanente. Muy generoso para una base de datos NoSQL distribuida globalmente.
- **Azure App Service**: 10 web apps en plan F1 (gratuito), aunque con limitaciones de CPU (60 minutos/día) y sin dominio personalizado.
- **Azure DevOps**: 5 usuarios gratis con pipelines ilimitadas para proyectos públicos y 1.800 minutos de build al mes para privados. Para siempre.
- **Azure Container Registry**: 10 webhooks, 100 GB de almacenamiento.
- **Azure Active Directory**: hasta 50.000 usuarios y autenticaciones al mes.
- **GitHub Actions** (aunque es de GitHub, se integra con Azure de forma nativa y tiene 2.000 minutos gratis al mes).

### Recursos gratuitos solo los primeros 12 meses en Azure

- **Virtual Machines**: 750 horas/mes de B1s (1 vCPU, 1 GB RAM).
- **Azure SQL Database**: 250 GB con instancia S0.
- **Azure Kubernetes Service (AKS)**: gestión de cluster gratis (solo pagas los nodos).

Además, al crear la cuenta recibes **$200 de crédito durante los primeros 30 días**.

### Para qué tipo de proyecto encaja mejor Azure

Azure tiene ventaja clara en dos escenarios: si ya usas herramientas del ecosistema Microsoft (Visual Studio, .NET, Teams, Active Directory) o si necesitas **CI/CD y DevOps desde el día uno**. Azure DevOps gratuito con pipelines y repos es difícil de superar para equipos pequeños.

También es una opción sólida para startups que anticipan vender a empresas medianas y grandes, ya que Azure tiene la mayor penetración en ese segmento y el ecosistema de integraciones enterprise es muy maduro.

**Ideal para**: proyectos .NET y C#, startups con perfil enterprise, pipelines CI/CD, proyectos que usan autenticación con Azure AD (ahora Microsoft Entra ID), equipos que ya usan GitHub y quieren integración con Actions.

**Cuidado con**: el plan F1 de App Service tiene limitaciones reales de CPU (60 minutos de cómputo al día) que lo hacen insuficiente para producción con tráfico real.

---

## Comparativa directa: ¿qué me llevo gratis a largo plazo?

| Recurso | AWS | GCP | Azure |
|---|---|---|---|
| VM siempre gratis | ❌ | ✅ e2-micro | ❌ |
| Serverless always free | ✅ Lambda (1M req) | ✅ Cloud Run + Functions | ✅ Azure Functions |
| Base de datos NoSQL always free | ✅ DynamoDB (25 GB) | ✅ Firestore (1 GB) | ✅ Cosmos DB (25 GB) |
| Almacenamiento always free | ❌ (solo 12 meses) | ✅ 5 GB | ✅ 5 GB |
| Analytics gratis | ❌ | ✅ BigQuery (1 TB/mes) | ❌ |
| CI/CD always free | ✅ CodePipeline (1 pipeline) | ✅ Cloud Build (120 min/día) | ✅ Azure DevOps (1.800 min/mes) |
| Créditos iniciales | $0 extra | $300 / 90 días | $200 / 30 días |
| Free trial | 12 meses | 90 días + créditos | 12 meses |

---

## ¿Cuál elijo según mi caso?

Aquí va la respuesta directa, sin rodeos:

**Elige AWS si...**
Quieres construir una arquitectura serverless escalable desde el principio y prefieres el ecosistema más consolidado. Lambda + DynamoDB + S3 + API Gateway es probablemente la combinación más documentada y con más ejemplos en internet. Si tu objetivo es aprender cloud para el mercado laboral, AWS sigue siendo el curriculum más valioso.

**Elige GCP si...**
Necesitas un servidor que esté siempre encendido y no quieres pagar nada. La VM e2-micro always free es la joya oculta del free tier entre las tres plataformas. También es la opción obvia si vas a trabajar con datos, ML o Big Data; BigQuery gratuito es un recurso enorme. Y si usas Firebase, ya estás en el ecosistema GCP.

**Elige Azure si...**
Tu stack es Microsoft o planeas vender a empresas. Azure DevOps con pipelines gratuitas es una ventaja real para proyectos que necesitan CI/CD desde el primer día. Y si tu aplicación necesita autenticación de usuarios a escala, Azure AD gratuito hasta 50.000 usuarios es una propuesta difícil de igualar.

---

## El caso que aplica al 80% de los proyectos que se crean hoy

Hay una combinación que se repite una y otra vez en los proyectos modernos: **frontend en Vercel + backend pequeño que necesita vivir en algún sitio**. Un SaaS con autenticación, un portfolio con formulario de contacto, una app con unos pocos endpoints de API. No hace falta nada enorme. Solo un backend que responda, escale y no te cobre nada mientras el proyecto está arrancando.

Para ese caso —que encaja con una mayoría aplastante de lo que se construye hoy en día— la respuesta es **GCP Cloud Run**.

![GCP Cloud Run backend serverless Vercel](/news/gcp.png)

### Por qué Cloud Run es la opción obvia

Cloud Run ejecuta contenedores Docker de forma serverless. Eso significa que no hay servidor que mantener, no hay que preocuparse por actualizaciones del sistema operativo ni por configurar Nginx. Subes tu contenedor, apuntas tu dominio y listo. Y lo más importante: **escala a cero cuando no hay tráfico**. Si tu proyecto no recibe visitas durante la noche, no consume recursos y no te cobra nada.

El free tier de Cloud Run incluye **2 millones de peticiones al mes y 360.000 vCPU-segundos**, todo ello always free, sin fecha de expiración. Para una web o SaaS en fase inicial es prácticamente imposible superarlo.

La arquitectura quedaría así:

\`\`\`
Usuario → Vercel (frontend Next.js)
              ↓
         Cloud Run (API backend — Node, Python, Go...)
              ↓
         Firestore (base de datos — también gratis)
\`\`\`

Con esta combinación tienes **todo el stack gratuito para siempre** en condiciones normales de arranque: frontend, backend, base de datos y almacenamiento.

### ¿Y si el backend es todavía más ligero?

Si solo necesitas unos pocos endpoints sin lógica compleja —un webhook, un formulario, una integración con una API externa— **AWS Lambda** compite de igual a igual. También es serverless, también escala a cero y tiene 1 millón de invocaciones always free. La diferencia práctica es que Cloud Run acepta cualquier contenedor y cualquier lenguaje sin restricciones, mientras que Lambda tiene sus propios runtimes y un modelo de despliegue algo más específico.

Para la mayoría de proyectos ambas opciones funcionan. Si ya tienes un \`Dockerfile\` en el proyecto, Cloud Run es la opción sin fricción. Si prefieres no dockerizar y solo quieres subir una función, Lambda puede ser más directo.

### Lo que no tiene sentido para este caso

La VM e2-micro de GCP es gratuita para siempre, pero te convierte en administrador de sistemas: tienes que instalar el runtime, configurar el proceso para que no muera, gestionar los logs, aplicar parches de seguridad. Para un proyecto que acaba de arrancar, ese tiempo vale más que cualquier ahorro. Y Azure App Service en plan gratuito tiene un límite de 60 minutos de CPU al día, lo que lo hace inviable para producción con cualquier tráfico real.

> La regla simple: si tu web necesita un backend y estás en fase de lanzamiento, **Vercel + Cloud Run + Firestore** te da un stack de producción real, escalable y gratuito. Cuando el proyecto crezca y empiece a generar ingresos, ya tendrás margen para pagar la infraestructura.

---

## El consejo final que nadie te da

Configura alertas de facturación **desde el primer día** en cualquiera de las tres plataformas. Las tres tienen esta opción y es gratuita. Ponla en 1€ o 1$ para que te avise en cuanto empiece a generarse cualquier coste. Así evitas la sorpresa clásica de "pensaba que era gratis" que le ha pasado a todo el mundo alguna vez.

Y una cosa más: no tengas miedo de usar las tres. Nada te impide tener tu servidor siempre activo en GCP, tu pipeline de CI/CD en Azure DevOps y tus funciones Lambda en AWS. El multi-cloud en el free tier es perfectamente viable y una forma excelente de aprender las diferencias entre plataformas con proyectos reales.`,
    image: cloudFreeTier,
    category: "devops",
    tags: ["AWS", "GCP", "Azure", "Free Tier", "Cloud", "DevOps", "Infraestructura"],
    author: authors.julian,
    publishedAt: "2026-05-25T09:00:00Z",
    readingMinutes: 14,
    views: 1820,
    likes: 134,
    featured: true,
    trending: true,
  },
  {
    slug: "webwright-microsoft-agente-navegador-terminal",
    title:
      "Webwright: Microsoft convierte tu agente de código en un experto del navegador con un solo plugin",
    excerpt:
      "Un terminal, un browser, un modelo. Así funciona el framework de Microsoft que alcanza el estado del arte en tareas web de larga duración — y que puedes instalar en Claude Code o Codex en dos comandos.",
    content: `La mayoría de los agentes web de hoy funcionan así: el modelo recibe el estado actual de la página, predice la siguiente acción — un clic, un campo de texto, un selector DOM — y espera al siguiente turno. Uno a uno. Acción por acción. Cuando la tarea tiene veinte pasos, eso son veinte turnos, veinte oportunidades para que algo salga mal y sin ninguna posibilidad de reutilizar el trabajo la próxima vez.

Microsoft Research ha publicado **Webwright**, y la propuesta es exactamente la contraria.

## La idea que lo cambia todo: el navegador como herramienta, no como estado

El insight central de Webwright es tan sencillo que cuesta creer que no sea la norma: en vez de que el agente *viva dentro* de la sesión del navegador, que el agente *controle* el navegador desde fuera. Como un desarrollador que escribe un script de Playwright, lo prueba, lo corrige y lo reutiliza.

> "No multi-agent system, no graph engine, no plugin layer, no hidden orchestration — just a terminal, a browser, and a model."

El artefacto persistente no es la sesión del navegador, que se cierra al terminar. El artefacto persistente es el **código Python que describe la tarea completa**. Un único archivo reejectable, depurable, compartible.

## Cómo funciona el bucle interno

El flujo de Webwright en la práctica:

1. El modelo recibe la tarea en lenguaje natural y el contexto del workspace.
2. Escribe un script de Python con Playwright que resuelve la tarea de principio a fin.
3. Ejecuta el script en el terminal. Si hay un error, lee los logs y la captura de pantalla del momento del fallo.
4. Corrige el script y lo vuelve a ejecutar.
5. Cuando el script completa sin errores, verifica visualmente el resultado contra las capturas guardadas.

No hay un agente mirando cada clic. No hay un orquestador decidiendo cuándo capturar la pantalla. El modelo decide *él mismo* cuándo necesita ver el estado del navegador y lo hace lanzando las herramientas adecuadas en el script.

\`\`\`python
# Ejemplo simplificado de lo que genera Webwright
from playwright.sync_api import sync_playwright

def search_flights(origin: str, destination: str, depart_date: str) -> dict:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://www.google.com/flights")
        page.fill('[data-placeholder="Where from?"]', origin)
        page.fill('[data-placeholder="Where to?"]', destination)
        # ... lógica completa de la tarea
        results = page.query_selector_all(".gws-flights__li")
        return {"flights": [r.inner_text() for r in results[:5]]}
\`\`\`

El resultado: un script parametrizable con argparse que puedes ejecutar mañana con diferentes fechas sin que el agente tenga que "redescubrir" cómo funciona Google Flights.

## Los benchmarks que justifican el enfoque

Los números son los que han llamado la atención:

| Benchmark | Resultado | Contexto |
|---|---|---|
| Online-Mind2Web (300 tareas) | **86,7%** con GPT-5.4 | Mejor entre harnesses open-source en categoría AutoEval |
| Odysseys (200 tareas largas) | **60,1%** con GPT-5.4 | +15,6 puntos sobre el anterior SOTA |
| Base GPT-5.4 (coordenadas XY) | 33,5% | Sin Webwright, mismo modelo |

La comparación más reveladora es la última: el mismo modelo GPT-5.4, con el enfoque clásico de predecir coordenadas en pantalla, llega al 33,5%. Con Webwright, al 60,1%. El framework importa más que el modelo en tareas de larga duración.

El dato de Odysseys es especialmente significativo porque mide exactamente donde los agentes clásicos fallan: tareas con 70-100 pasos donde el error se acumula y no hay forma de volver atrás. Webwright puede relanzar el script desde el principio si algo falla en el paso 60, porque el estado vive en el código, no en el historial de clics.

## Por qué el código es mejor que los clics

Los agentes clásicos basados en acciones atómicas tienen tres problemas fundamentales:

**Fragilidad**: si el botón se mueve un píxel o el selector DOM cambia, la acción falla y hay que empezar de nuevo. Un script de Playwright usa waits explícitos, reintentos y selectores semánticos — es inherentemente más robusto.

**No-reutilización**: cada ejecución redescubre los mismos pasos. Webwright en modo \`/webwright:craft\` produce una función parametrizada que acepta argumentos como \`--origin JFK --destination LAX --depart-date 2026-07-01\`. La próxima vez que busques vuelos, el script ya existe.

**Eficiencia en contexto largo**: comprimir veinte acciones de navegación en un bloque de código consume muchos menos tokens que describir cada estado de página. Menos tokens, menos latencia, menos coste.

## Instalación en Claude Code: dos comandos

\`\`\`bash
# 1. Añadir el repo de Microsoft como marketplace de plugins
/plugin marketplace add microsoft/Webwright

# 2. Instalar el plugin
/plugin install webwright@webwright
\`\`\`

Reinicia la sesión y ya puedes usarlo en lenguaje natural o con los slash commands:

\`\`\`
/webwright:run busca vuelos de MAD a JFK del 15 al 22 de agosto
/webwright:craft busca un vuelo en Google Flights de MAD a NYC ida y vuelta
\`\`\`

La diferencia entre \`:run\` y \`:craft\`: el primero genera un script para esa tarea concreta; el segundo genera un script reutilizable con parámetros configurables por línea de comandos.

## Instalación en OpenCode

OpenCode descubre skills buscando archivos \`SKILL.md\` en rutas predefinidas. Webwright incluye su skill en la carpeta \`skills/webwright/\`, así que solo hay que colocarla donde OpenCode la encuentre.

**Opción A — global** (disponible en todos tus proyectos):

\`\`\`bash
# Clona el repo
git clone https://github.com/microsoft/Webwright

# Copia o enlaza la skill en la ruta global de OpenCode
mkdir -p ~/.config/opencode/skills
ln -s /ruta/a/Webwright/skills/webwright ~/.config/opencode/skills/webwright

# (Opcional) Instala los slash commands en la carpeta commands de OpenCode
mkdir -p ~/.config/opencode/commands
cp /ruta/a/Webwright/skills/webwright/commands/*.md ~/.config/opencode/commands/

# Instala las dependencias de Webwright (una sola vez)
cd /ruta/a/Webwright && pip install -e . && playwright install chromium
\`\`\`

**Opción B — local al proyecto** (solo en el repo actual):

\`\`\`bash
mkdir -p .opencode/skills
ln -s /ruta/a/Webwright/skills/webwright .opencode/skills/webwright

# (Opcional) Instala los slash commands localmente
mkdir -p .opencode/commands
cp /ruta/a/Webwright/skills/webwright/commands/*.md .opencode/commands/
\`\`\`

OpenCode también reconoce \`.agents/skills/\` y \`.claude/skills/\` si ya usas esas rutas.

Una vez instalada, OpenCode detecta la skill automáticamente. Puedes pedírsela en lenguaje natural o usar los slash commands si los copiaste:

\`\`\`
busca vuelos de MAD a JFK del 15 al 22 de agosto en Google Flights
# o si instalaste los commands:
/webwright run busca vuelos de MAD a JFK del 15 al 22 de agosto
\`\`\`

El agente cargará la skill \`webwright\`, generará un script de Playwright y lo ejecutará en el terminal, exactamente igual que en Claude Code o Codex.

## Soporte en más agentes

Webwright funciona como plugin en cuatro agentes de codificación:

- **Claude Code** — via \`/plugin install\`
- **Codex CLI** — via \`codex /plugins\`
- **OpenClaw** — via \`openclaw plugins install\`
- **Hermes Agent** — misma carpeta \`skills/webwright/\`

Una vez instalado, el host agent usa su propia suscripción al modelo — no necesitas una API key adicional. Los agentes que leen capturas de pantalla nativas (como Claude Code) se saltan las herramientas auxiliares \`image_qa\` y \`self_reflection\`.

## Arquitectura: minimalismo deliberado

El núcleo del framework son menos de 1.200 líneas de código en total:

- **Bucle del agente**: ~450 líneas en \`agents/default.py\`
- **Entorno Playwright**: ~570 líneas
- **CLI**: ~150 líneas
- **Backends de modelos**: 150-200 líneas cada uno (OpenAI, Anthropic, OpenRouter)

Dependencias externas: \`httpx\`, \`pydantic\`, \`playwright\`, \`typer\`. Nada más. Sin frameworks de orquestación, sin bases de datos vectoriales, sin capas de abstracción entre el prompt y el resultado.

> "If you want a minimal, easy-to-debug starting point for browser-using agents instead of another heavyweight platform, this is it."

## Task Showcase: un dashboard para tareas repetibles

Webwright incluye una pequeña aplicación Flask que actúa de dashboard para tareas que se ejecutan regularmente: búsqueda de ofertas, comprobación de inventario, seguimiento de precios, bolsas de empleo, tiempo. Cada tarea produce dos archivos — \`task.json\` y \`report.json\` — y el dashboard los renderiza genéricamente.

\`\`\`bash
pip install flask
python assets/task_showcase/app.py  # http://127.0.0.1:5005
\`\`\`

Es una forma elegante de convertir tareas web recurrentes en reportes automáticos sin infraestructura adicional.

## Qué significa esto para el ecosistema

Webwright es open source (MIT), viene de Microsoft Research y ya tiene manifests para los cuatro agentes de codificación más usados. El timing es relevante: justo cuando los modelos frontier están alcanzando el nivel en el que realmente pueden escribir y depurar scripts complejos, un framework que explota exactamente esa capacidad alcanza el estado del arte en benchmarks públicos.

El mensaje de fondo es que la arquitectura importa más de lo que parece. Tomar el mismo modelo y cambiar el harness de "predice el siguiente clic" a "escribe y ejecuta código" da +26 puntos porcentuales en tareas largas. Ese es el tipo de mejora que normalmente asociamos a un salto de generación de modelo, no a un cambio de framework.

Para equipos que automatizan flujos web, procesos de data gathering o integraciones con webs sin API, Webwright es probablemente el punto de partida más limpio que existe hoy.`,
    image: "/news/webwright.png",
    category: "ai",
    tags: ["Webwright", "Microsoft", "Browser Agent", "Claude Code", "Playwright", "Agentes"],
    author: authors.noa,
    publishedAt: "2026-05-27T09:00:00Z",
    readingMinutes: 10,
    views: 2140,
    likes: 198,
    featured: true,
    trending: true,
  },
  {
    slug: "claude-opus-4-8-subagentes-paralelos-claude-code",
    title:
      "Claude Opus 4.8: subagentes en paralelo, modo rápido 3× más barato y control de esfuerzo",
    excerpt:
      "Anthropic lanza su nuevo flagship con mejoras en coding y razonamiento. Claude Code gana workflows dinámicos con subagentes paralelos para tareas a gran escala.",
    content: `Anthropic ha lanzado Claude Opus 4.8, la actualización de su modelo flagship, con mejoras medibles en coding, tareas agénticas, razonamiento y trabajo con conocimiento. El lanzamiento incluye tres novedades que cambian el uso diario del modelo en contextos de desarrollo.

## Control de esfuerzo en claude.ai

La primera es el *effort control*, disponible directamente en claude.ai. Los usuarios pueden ahora indicar explícitamente cuánto esfuerzo computacional quieren que el modelo dedique a una respuesta. Para preguntas rápidas, el modo ligero responde en menos tiempo y consume menos créditos. Para tareas complejas —análisis de código, debugging profundo, razonamiento encadenado— el modo máximo aplica más capacidad y más tokens de razonamiento interno antes de responder.

Es un cambio conceptualmente importante: el modelo deja de ser una función de entrada-salida fija y pasa a ser un recurso con throttle controlable por el usuario.

## Workflows dinámicos en Claude Code

La segunda novedad es la más relevante para equipos de ingeniería: **dynamic workflows en Claude Code** con subagentes paralelos.

Hasta ahora, Claude Code ejecutaba tareas de forma secuencial. Opus 4.8 introduce la capacidad de lanzar subagentes especializados que trabajan en paralelo sobre partes independientes de una tarea compleja. El agente principal coordina, los subagentes ejecutan en paralelo y los resultados se sintetizan al final.

Un ejemplo concreto: refactorizar un módulo grande con tests, documentación y cambios en múltiples archivos puede dividirse en subagentes que trabajan simultáneamente sobre cada parte, con el agente principal controlando la coherencia global.

\`\`\`bash
# En Claude Code, las tareas largas ahora pueden delegar automáticamente
# a subagentes paralelos según la complejidad detectada
claude "Refactoriza el módulo de autenticación, actualiza los tests y 
documenta los cambios en el CHANGELOG"
# → Subagente 1: refactoring del código
# → Subagente 2: actualización de tests
# → Subagente 3: redacción de CHANGELOG
# → Agente principal: síntesis y coherencia
\`\`\`

## Modo rápido: 3× más barato que los modelos anteriores

La tercera novedad es la que más impacta en el coste operativo: un *fast mode* que es **tres veces más barato** que los modelos flagship previos, manteniendo la calidad de Opus 4.8 en tareas estándar. Para pipelines de producción con alto volumen de llamadas, el ahorro puede ser significativo.

## Benchmarks

Anthropic no ha publicado aún los benchmarks completos en el momento del lanzamiento, pero los números internos citados muestran mejoras en SWE-bench Verified, GPQA Diamond y los benchmarks propios de coding de la empresa frente a Opus 4.7.

El lanzamiento de Opus 4.8 consolida la estrategia de Anthropic: modelos con más capacidad agéntica, mejor control de recursos y precios competitivos para despliegue en producción. La combinación de subagentes paralelos en Claude Code y el modo rápido económico apunta directamente a casos de uso empresariales donde el coste por tarea y la velocidad de ejecución son los factores críticos.`,
    image: "/news/claude-opus-4-8.jpg",
    category: "ai",
    tags: ["Anthropic", "Claude", "Claude Code", "Agentes", "LLMs"],
    author: authors.noa,
    publishedAt: "2026-05-28T10:00:00Z",
    readingMinutes: 7,
    views: 3840,
    likes: 291,
    featured: true,
    trending: true,
  },
  {
    slug: "openrouter-113m-serie-b-capitalg-nvidia-1300m-valoracion",
    title:
      "OpenRouter recauda 113M$ en Serie B: CapitalG y Nvidia respaldan el routing multi-modelo",
    excerpt:
      "La plataforma que unifica el acceso a cientos de modelos de IA alcanza 1.300M$ de valoración y procesa 25 billones de tokens por semana.",
    content: `OpenRouter, la plataforma que ofrece una API unificada para acceder y enrutar peticiones entre cientos de modelos de IA, ha cerrado una ronda Serie B de 113 millones de dólares liderada por CapitalG, el fondo de crecimiento de Alphabet. La ronda incluye participación de NVentures (el brazo inversor de Nvidia), ServiceNow Ventures y otros inversores institucionales.

La valoración resultante es de 1.300 millones de dólares, más del doble de los 547 millones de la ronda anterior.

## Qué es OpenRouter y por qué importa ahora

OpenRouter resuelve un problema de infraestructura que se ha vuelto cada vez más relevante conforme el ecosistema de modelos se fragmenta: no quieres estar atado a un único proveedor cuando hay docenas de modelos compitiendo en benchmarks distintos cada semana.

La plataforma permite a los desarrolladores enviar una petición a la API de OpenRouter y que esta decida automáticamente —o según reglas configurables— qué modelo responde. Las políticas de routing pueden basarse en precio, latencia, disponibilidad, capacidades específicas del modelo o cualquier combinación de estas.

\`\`\`typescript
// Una sola integración, acceso a cientos de modelos
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.OPENROUTER_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "anthropic/claude-opus-4-8", // o cualquier otro modelo disponible
    messages: [{ role: "user", content: "Hola" }],
  }),
});
\`\`\`

## Los números que explican la inversión

- **25 billones de tokens procesados por semana** en el momento del cierre de la ronda.
- **Más de 8 millones de usuarios activos**.
- Crecimiento acelerado en adopción enterprise, especialmente en equipos que despliegan agentes con múltiples modelos especializados.

El crecimiento del uso agéntico es la clave aquí. Cuando un sistema agéntico necesita razonar, generar código, analizar imágenes y ejecutar herramientas en el mismo pipeline, la capacidad de enrutar cada subtarea al modelo más adecuado (y más económico) es una ventaja competitiva real.

## Participación de Nvidia: una señal estratégica

La presencia de NVentures en la ronda no es cosmética. Nvidia tiene un interés directo en que la demanda de inferencia se escale correctamente: más volumen de tokens procesados significa más demanda de GPUs. Respaldar la infraestructura de routing que facilita ese escale tiene sentido estratégico.

El respaldo de CapitalG, con su conexión directa a los proyectos de IA de Alphabet, añade otra capa de interés: Google tiene sus propios modelos en el catálogo de OpenRouter y se beneficia de una plataforma de distribución neutral que no favorece a ningún proveedor específico.

## Qué viene

Con 113 millones adicionales, OpenRouter puede escalar su infraestructura, añadir más modelos al catálogo (actualmente más de 300), mejorar las capacidades de observabilidad y análisis para equipos enterprise, y posiblemente expandir el producto hacia herramientas de evaluación y fine-tuning. La apuesta de que el futuro de la IA en producción es multi-modelo parece más sólida que nunca.`,
    image: "/news/openrouter.jpg",
    category: "startups",
    tags: ["OpenRouter", "Startups", "LLMs", "IA", "Inversión", "API"],
    author: authors.iria,
    publishedAt: "2026-05-28T12:00:00Z",
    readingMinutes: 6,
    views: 2910,
    likes: 187,
    featured: false,
    trending: true,
  },
  {
    slug: "google-io-2026-antigravity-2-subagentes-managed-agents-gemini",
    title:
      "Google I/O 2026: Antigravity 2.0, subagentes en CLI y managed agents en la API de Gemini",
    excerpt:
      "Google presenta su apuesta agéntica completa: un CLI con sandboxing nativo, subagentes especializados, deploy one-click a Cloud Run y soporte Kotlin en AI Studio.",
    content: `Google I/O 2026 marcó el punto más claro hasta la fecha en la estrategia agéntica de la compañía. Bajo el paraguas de Antigravity, Google presentó una suite de herramientas para desarrolladores orientada a construir, desplegar y gestionar agentes de IA en producción.

## Antigravity 2.0 y el nuevo CLI

La novedad más destacada para desarrolladores es **Antigravity 2.0** junto con el **Antigravity CLI**, una interfaz de línea de comandos diseñada para lanzar subagentes especializados que trabajan en paralelo sobre workflows complejos.

El CLI incluye por defecto:
- **Cross-platform terminal sandboxing**: los agentes ejecutan código en entornos aislados independientemente del sistema operativo.
- **Credential masking**: las credenciales no se exponen en los logs ni en los contextos enviados al modelo.
- **Hardened Git policies**: control granular sobre qué operaciones de Git puede ejecutar un agente sin confirmación humana.

\`\`\`bash
# Ejemplo: lanzar un subagente especializado desde Antigravity CLI
antigravity run --agent code-reviewer --sandbox --repo ./my-project
\`\`\`

La posibilidad de orquestar múltiples subagentes desde el CLI, con cada uno trabajando en una parte independiente de un workflow, es el cambio arquitectónico más relevante del anuncio.

## Managed Agents en la API de Gemini

Para equipos que no quieren gestionar su propia infraestructura de agentes, Google anunció **Managed Agents en la API de Gemini**: una sola llamada a la API provisiona un agente completamente equipado con un sandbox remoto, sin configuración de infraestructura.

\`\`\`python
# Una llamada API = agente con sandbox, herramientas y memoria
import google.generativeai as genai

agent = genai.create_managed_agent(
    model="gemini-3-pro",
    tools=["code_execution", "web_search"],
    sandbox=True,
)
response = agent.run("Analiza este repositorio y genera un informe de deuda técnica")
\`\`\`

El concepto de *managed agent* elimina la fricción de infraestructura que actualmente frena a muchos equipos: no hace falta gestionar la ejecución de código, la memoria temporal ni el aislamiento de seguridad. Google lo gestiona como servicio.

## Google AI Studio: Kotlin nativo, Workspace y deploy a Cloud Run

Google AI Studio, la herramienta de prototipado de Google, recibió varias actualizaciones que acercan el gap entre prototipo y producción:

- **Soporte nativo de Kotlin** para construir apps Android directamente desde el entorno de AI Studio.
- **Integración con Google Workspace**: acceso directo a Docs, Sheets y Drive desde el contexto del agente.
- **Deploy one-click a Cloud Run**: pasar de un prototipo funcional en AI Studio a un servicio productivo en Cloud Run sin salir del entorno.
- **Exportación completa del estado del proyecto a Antigravity**: continuar desarrollando desde el CLI sin perder contexto.

## Antigravity SDK: control programático del agente harness

Para casos más avanzados, Google publicó el **Antigravity SDK**, que expone el harness del agente de forma programática. Los equipos pueden personalizar completamente el comportamiento del agente y desplegarlo en su propia infraestructura.

\`\`\`typescript
import { AntigravityAgent } from "@google/antigravity-sdk";

const agent = new AntigravityAgent({
  model: "gemini-3-pro",
  sandbox: { type: "docker", image: "node:22-alpine" },
  maxIterations: 50,
  tools: ["bash", "read_file", "write_file"],
});

await agent.run("Implementa los tests unitarios para el módulo de pagos");
\`\`\`

Google I/O 2026 deja claro que la apuesta de Google en el espacio agéntico es completa: desde el prototipo en AI Studio hasta el despliegue en producción en Cloud Run, pasando por el control total en infraestructura propia con el SDK. La integración vertical con el ecosistema de Google (Workspace, Cloud Run, Android) es el diferenciador que Anthropic y OpenAI no pueden replicar fácilmente.`,
    image: "/news/google-io-antigravity.jpg",
    category: "ai",
    tags: ["Google", "Gemini", "Antigravity", "Agentes", "Google I/O", "Cloud Run"],
    author: authors.sara,
    publishedAt: "2026-05-20T09:00:00Z",
    readingMinutes: 9,
    views: 4120,
    likes: 334,
    featured: true,
    trending: true,
  },
  {
    slug: "nano-banana-2-google-gemini-generacion-imagenes-video-input",
    title:
      "Google lanza Nano Banana 2 en GA: generación de imágenes con vídeo como input y adopción enterprise",
    excerpt:
      "Gemini 3.1 Flash Image y Gemini 3 Pro Image llegan a disponibilidad general. Adobe, Shopify y WPP ya los integran en workflows creativos y comerciales.",
    content: `Google Cloud ha anunciado la disponibilidad general (GA) de **Nano Banana 2** —el nombre interno de Gemini 3.1 Flash Image— y **Nano Banana Pro** —Gemini 3 Pro Image—, sus modelos de generación y edición de imágenes de grado enterprise, disponibles a través del Gemini Enterprise Agent Platform.

El anuncio incluye una feature en preview que cambia significativamente las posibilidades de los modelos: **Nano Banana 2 acepta ahora archivos de vídeo como input** para generación de imágenes con contexto derivado del vídeo.

## Qué cambia con el input de vídeo

Hasta ahora, los modelos de generación de imágenes trabajaban con prompts de texto o imágenes de referencia. La capacidad de procesar vídeo como input abre casos de uso que no eran posibles antes:

- **Extracción de frames clave**: el modelo puede analizar un vídeo y generar imágenes coherentes con el estilo visual, la iluminación y los sujetos del vídeo original.
- **Storyboarding automatizado**: a partir de un vídeo de referencia, generar variaciones de escenas con consistencia visual garantizada.
- **Productización de contenido**: marcas con catálogos de vídeo pueden generar assets de imagen para campañas manteniendo coherencia con el material original.

\`\`\`python
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

vertexai.init(project="my-project", location="us-central1")

model = ImageGenerationModel.from_pretrained("nano-banana-2")

# Generar imagen usando vídeo como contexto
response = model.generate_images(
    prompt="Producto en uso en exteriores, misma paleta de color",
    video_context="gs://my-bucket/product-demo.mp4",
    number_of_images=4,
)
\`\`\`

## Adopción enterprise: Adobe, Shopify, WPP, URBN

El anuncio en Google I/O destaca cuatro empresas que ya tienen los modelos integrados en producción:

- **Adobe**: integración en flujos de edición creativa, con Nano Banana Pro para generación de assets de alta calidad.
- **Shopify**: generación automatizada de imágenes de producto para catálogos de merchants.
- **WPP**: automatización de producción de assets para campañas publicitarias a escala global.
- **URBN** (Urban Outfitters, Anthropologie, Free People): personalización de imágenes de producto para diferentes mercados y contextos.

La adopción simultánea en retail, publicidad y herramientas creativas sugiere que los modelos han alcanzado el nivel de calidad necesario para workflows de producción real, no solo para prototipos.

## Nano Banana 2 vs Nano Banana Pro

| | Nano Banana 2 (Gemini 3.1 Flash Image) | Nano Banana Pro (Gemini 3 Pro Image) |
|---|---|---|
| **Velocidad** | Alta (flash) | Media |
| **Calidad** | Alta | Muy alta |
| **Input vídeo** | ✓ (preview) | En roadmap |
| **Caso de uso** | Producción a volumen | Assets premium |
| **Disponibilidad** | GA | GA |

La estrategia de Google con estos modelos sigue el patrón Flash/Pro: un modelo rápido y económico para alto volumen y un modelo premium para casos donde la calidad es prioritaria sobre el coste.

## Disponibilidad y precios

Ambos modelos están disponibles a través del Gemini Enterprise Agent Platform. Los precios de producción no se han publicado oficialmente en el momento del lanzamiento; Google está gestionando el acceso enterprise con acuerdos específicos. El acceso para desarrolladores individuales está disponible a través de Vertex AI con créditos de prueba.`,
    image: "/news/nano-banana-2.jpg",
    category: "ai",
    tags: ["Google", "Gemini", "Generación de imágenes", "IA", "Enterprise", "Google I/O"],
    author: authors.sara,
    publishedAt: "2026-05-28T14:00:00Z",
    readingMinutes: 7,
    views: 1870,
    likes: 143,
    featured: false,
    trending: true,
  },
  {
    slug: "meta-suscripciones-instagram-facebook-whatsapp-meta-ai-19-99",
    title:
      "Meta lanza suscripciones globales: Instagram Plus, WhatsApp Plus y Meta One Premium con IA avanzada",
    excerpt:
      "Meta oficializa su modelo de suscripción en Instagram (3,99$/mes), Facebook y WhatsApp. Meta One Premium añade razonamiento profundo y mayor capacidad generativa por 19,99$/mes.",
    content: `Meta ha lanzado oficialmente sus planes de suscripción de pago a nivel global, completando una estrategia que llevaba meses en pruebas en mercados seleccionados. El movimiento transforma el modelo de ingresos de la compañía, que hasta ahora dependía casi exclusivamente de la publicidad, añadiendo una línea de suscripciones directas al consumidor.

## Los planes disponibles

**Instagram Plus** — 3,99$/mes
- Verificación de cuenta con badge.
- Mayor visibilidad en comentarios y búsqueda.
- Protección proactiva frente a suplantación.

**Facebook Plus** — 3,99$/mes
- Verificación de cuenta.
- Mayor alcance para publicaciones personales.
- Acceso anticipado a nuevas funcionalidades.

**WhatsApp Plus** — 2,99$/mes
- Verificación de número.
- Funciones avanzadas de privacidad.
- Mayor capacidad de almacenamiento en la nube.

## Meta One: el tier de IA

La novedad más relevante desde el punto de vista tecnológico es la **familia Meta One**, aún en pruebas pero con lanzamiento anunciado:

- **Meta One para negocios**: herramientas de automatización y análisis para páginas y cuentas profesionales.
- **Meta One para creadores**: analítica avanzada y herramientas de monetización.
- **Meta One Premium** — 19,99$/mes: acceso a **razonamiento profundo** en Meta AI y **mayor capacidad generativa**, incluyendo generación de imágenes de mayor calidad y conversaciones más largas con el modelo.

El tier Premium es el más interesante desde la perspectiva del ecosistema de IA: Meta está apostando por monetizar directamente la capacidad de su modelo de IA en lugar de limitarla a una herramienta gratuita de retención.

\`\`\`
Modelo de ingresos por IA:
- Gratuito: Meta AI básico, respuestas estándar
- Meta One Premium ($19.99/mes): razonamiento extendido, más tokens, 
  generación de imágenes de mayor resolución
\`\`\`

## Por qué esto importa más allá de Meta

El movimiento de Meta establece un precedente en el ecosistema de redes sociales: la capacidad de IA avanzada pasa a ser un argumento de venta de una suscripción premium, no solo un beneficio gratuito para retener usuarios.

Esto tiene implicaciones directas para el resto del sector:

1. **Snapchat, TikTok y X** tendrán que responder con sus propias ofertas de IA premium o arriesgarse a perder usuarios dispuestos a pagar por capacidades avanzadas.
2. **El precio de 19,99$/mes** para un tier de IA conversacional con razonamiento avanzado establece un benchmark de mercado que otros competidores tendrán que considerar.
3. **La distribución de Meta** —más de 3.000 millones de usuarios en sus plataformas— le da una ventaja única para monetizar IA a escala masiva, algo que modelos puros como ChatGPT o Claude no pueden igualar en cobertura global.

La pregunta que el sector estará observando es cuántos usuarios de las 3.000 millones de personas en el ecosistema Meta están dispuestos a pagar por el tier Premium. Si la conversión es incluso del 0,1%, estamos hablando de 3 millones de suscriptores premium adicionales.`,
    image: "/news/meta-subscriptions.jpg",
    category: "startups",
    tags: ["Meta", "Instagram", "WhatsApp", "IA", "Startups", "Suscripciones"],
    author: authors.iria,
    publishedAt: "2026-05-27T16:00:00Z",
    readingMinutes: 6,
    views: 2560,
    likes: 176,
    featured: false,
    trending: true,
  },
  {
    slug: "google-android-cli-estable-android-bench-migration-agent-kotlin",
    title:
      "Android CLI estable en Google I/O: agentes externos controlan Android Studio y Migration Agent convierte apps en horas",
    excerpt:
      "Google estabiliza el Android CLI, lanza Android Bench como leaderboard de LLMs para desarrollo Android y presenta un agente que migra React Native o iOS a Kotlin nativo.",
    content: `Google I/O 2026 trajo un conjunto de anuncios específicamente orientados a desarrollo Android que cambia la relación entre los agentes de IA y el ecosistema de herramientas de Google. El elemento central es la estabilización del **Android CLI**, pero el anuncio más llamativo es el **Migration Agent**: una herramienta que convierte apps React Native, web frameworks o iOS en apps Kotlin nativas en horas en lugar de semanas.

## Android CLI: estable y open source

El **Android CLI** pasa de preview a estado estable. Su función es exponer las capacidades "pesadas" de Android Studio —descarga del SDK, ejecución en dispositivos físicos o emuladores, compilación, análisis de errores— a cualquier agente de IA externo, no solo a los de Google.

Esto significa que Claude Code, Cursor, Windsurf o cualquier agente compatible con herramientas puede ahora invocar operaciones reales de Android Studio sin que el usuario tenga que hacerlo manualmente:

\`\`\`bash
# El agente puede ejecutar esto directamente a través del Android CLI
android-cli run --device pixel-9 --debug
android-cli install-sdk --version 36
android-cli test --module :app --variant debugUnitTest
\`\`\`

Google también ha **publicado como open source los Android Skills**: un conjunto de instrucciones estructuradas que enseñan a los LLMs a ejecutar correctamente workflows complejos de Android, como migrar a Jetpack Compose o actualizar a Jetpack Navigation 3. Los Skills actúan como contexto especializado que mejora la calidad de las respuestas de cualquier modelo cuando trabaja con código Android.

## Android Bench: el leaderboard de LLMs para Android

Para entender qué modelos son realmente buenos desarrollando Android, Google ha creado **Android Bench**, un leaderboard de benchmarks específico para tareas de desarrollo Android. En el lanzamiento ya incluye modelos open-weight como **Gemma 4**, además de los modelos frontier habituales.

Los benchmarks evalúan tareas reales: completar una migración a Compose, implementar un feature con Navigation 3, corregir un bug en código Kotlin con Coroutines. Diferente de benchmarks genéricos de código, Android Bench mide conocimiento específico del ecosistema Android.

## Migration Agent: de React Native o iOS a Kotlin nativo

El anuncio más impactante del bloque Android es el **Migration Agent**, disponible como preview en Android Studio. El agente analiza el código fuente de una app existente —React Native, un web framework o iOS Swift/SwiftUI— y genera una versión Kotlin nativa para Android.

El proceso:
1. El agente analiza el código fuente completo, arquitectura y dependencias.
2. Genera un plan de migración por componentes.
3. Produce el código Kotlin equivalente, respetando las convenciones modernas de Android (Compose UI, ViewModel, Coroutines, Hilt).
4. Genera tests básicos para los componentes migrados.

\`\`\`
Migración típica (estimación de Google):
- Antes del Migration Agent: 4-8 semanas para una app mediana
- Con el Migration Agent: 4-8 horas para el 80% del código base
- Revisión humana estimada: 1-3 días para completar y ajustar
\`\`\`

La demo mostrada en Google I/O convirtió una app React Native de tamaño mediano en Kotlin con Compose UI en menos de dos horas. El agente no produce código perfecto —hay patrones de React Native sin equivalente directo en Android— pero el punto de partida es vastamente superior a una migración manual.

## Qué significa para el ecosistema

La combinación de Android CLI estable, Android Skills open source y Migration Agent pone a los desarrolladores Android en un punto diferente: los agentes de IA pueden ahora hacer operaciones reales en el entorno de desarrollo, no solo sugerir código. El agente puede compilar, probar en dispositivo, detectar el error y proponer el fix en el mismo turno de conversación.

Para empresas con apps React Native o web que quieren presencia nativa en Android, el Migration Agent elimina el argumento de "es demasiado costoso migrar". La pregunta deja de ser si migrar y pasa a ser cuándo revisar el output del agente.`,
    image: "/news/android-cli.jpg",
    category: "programming",
    tags: ["Android", "Google", "Kotlin", "React Native", "Google I/O", "LLMs", "Agentes"],
    author: authors.dax,
    publishedAt: "2026-05-20T11:00:00Z",
    readingMinutes: 8,
    views: 1490,
    likes: 118,
    featured: false,
    trending: false,
  },
];

export function getAllNews(): NewsArticle[] {
  return [...news].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeatured(): NewsArticle {
  return (
    [...news]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .find((n) => n.featured) ?? news[0]
  );
}

export function getTrending(limit = 5): NewsArticle[] {
  return [...news]
    .filter((n) => n.trending)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
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
