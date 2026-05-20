import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-mono text-brand mb-4">// 404 / NOT_FOUND</p>
        <h1 className="text-4xl font-bold tracking-tight">Página no encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La ruta que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
