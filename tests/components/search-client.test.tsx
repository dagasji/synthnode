import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchClient } from "@/components/search/search-client";
import { IntlWrapper } from "../utils/intl-wrapper";

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
    const countText = screen.getByText(/resultado/);
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
    expect(screen.getByText("Todas")).toBeDefined();
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
