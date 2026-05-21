// Global fallback - locale-specific 404 is in app/[locale]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <Link href="/" className="mt-6 inline-block text-sm text-muted-foreground underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
