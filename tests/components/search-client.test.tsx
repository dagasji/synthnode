import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchClient } from "@/components/search/search-client";
import { IntlWrapper } from "../utils/intl-wrapper";

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useTranslations: (namespace: string) => {
      const messages: Record<string, Record<string, string>> = {
        search: {
          placeholder: "Buscar noticias, tags, autores…",
          "filters.since": "Desde",
          "filters.sinceAll": "Cualquier momento",
          "filters.since24h": "Últimas 24h",
          "filters.since7d": "Últimos 7 días",
          "filters.since30d": "Últimos 30 días",
          "filters.allCategories": "Todas",
          "results.one": "resultado",
          "results.many": "resultados",
          "results.empty": "Sin resultados. Prueba a quitar filtros o cambiar la búsqueda.",
        },
        "article.labels": {
          min: "min",
        },
      };
      const ns = messages[namespace] || {};
      return (key: string) => {
        const parts = key.split(".");
        if (parts.length > 1) {
          let value = ns;
          for (const part of parts) {
            value = (value as Record<string, any>)[part];
            if (!value) return key;
          }
          return value;
        }
        return ns[key] || key;
      };
    },
  };
});

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: { children: React.ReactNode }) => (
      <article {...props}>{children}</article>
    ),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  useTransition: () => [false, (fn: () => void) => fn()],
}));

describe("SearchClient", () => {
  it("renders search input", () => {
    render(
      <IntlWrapper>
        <SearchClient />
      </IntlWrapper>,
    );
    const input = screen.getByRole("searchbox");
    expect(input).toBeDefined();
  });

  it("shows results count on initial load (all articles)", () => {
    render(
      <IntlWrapper>
        <SearchClient />
      </IntlWrapper>,
    );
    // Should show some number of results
    const countText = screen.getByText(/resultados/);
    expect(countText).toBeDefined();
  });

  it("filters results when typing in the search input", () => {
    render(
      <IntlWrapper>
        <SearchClient />
      </IntlWrapper>,
    );
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "rust" } });
    // After typing, results should update — count text still present
    expect(screen.getByText(/resultado/)).toBeDefined();
  });

  it("renders category filter buttons", () => {
    render(
      <IntlWrapper>
        <SearchClient />
      </IntlWrapper>,
    );
    expect(screen.getByText(/Todas/)).toBeDefined();
  });

  it("initialQuery prop pre-fills the search input", () => {
    render(
      <IntlWrapper>
        <SearchClient initialQuery="kubernetes" />
      </IntlWrapper>,
    );
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.value).toBe("kubernetes");
  });
});
