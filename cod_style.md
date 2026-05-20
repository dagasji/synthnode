# Guía de Estilo para Aplicación Frontend (Next.js)

## 1. Principios Generales

- Aplicar principios SOLID adaptados a frontend (componentes desacoplados, reutilizables).
- Mantener arquitectura modular y escalable.
- Evitar duplicidad (DRY).
- Aplicar KISS y YAGNI.
- Priorizar legibilidad sobre complejidad.

---

## 2. Organización del Proyecto

- Usar estructura basada en Next.js (App Router).
- Separar:
  - app/ (rutas)
  - components/ (UI reutilizable)
  - lib/ (helpers, lógica)
  - hooks/ (custom hooks)
- Naming:
  - Componentes: PascalCase
  - Variables/funciones: camelCase

---

## 3. Componentes y Buenas Prácticas

- Componentes pequeños y reutilizables.
- Separar lógica de UI.
- Evitar props excesivas (usar composición).
- Diferenciar Server vs Client Components.
- Evitar lógica pesada en componentes.

---

## 4. Estado y Datos

- Preferir estado local.
- Usar hooks personalizados.
- Evitar over-engineering (Redux innecesario).
- Usar fetch/React Query si aplica.

---

## 5. Manejo de Errores

- Mostrar estados:
  - loading
  - error
  - empty
- No romper UI ante errores.
- Logs en consola solo en desarrollo.

---

## 6. Logging

- No usar console.log en producción.
- Usar herramientas de monitoring si escala.

---

## 7. Testing

- Tests con Jest/Testing Library.
- Patrón Given-When-Then.
- Testear componentes clave.
- No testear implementación interna.

---

## 8. SEO y Performance

- Usar metadata de Next.js.
- URLs limpias.
- Optimizar imágenes.
- Lazy loading.
- Evitar SSR innecesario.

---

## 9. Build y Deploy

- Usar Vercel.
- Revisar build antes de deploy.
- Evitar warnings.

---

## 10. Calidad

- Usar ESLint + Prettier.
- Mantener consistencia.
- Revisar código antes de merge.

---

## 11. Documentación

- README claro.
- Documentar componentes clave.
- Explicar decisiones importantes.

---

Fin del documento.
