import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NewsCard } from "@/components/news/news-card";
import { IntlWrapper } from "../utils/intl-wrapper";
import type { NewsArticle } from "@/lib/types";

// Mock next/link and next/image for jsdom
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

const mockArticle: NewsArticle = {
  slug: "test-article",
  title: "Test Article Title",
  excerpt: "Short description of the article.",
  content: "## Heading\n\nContent here.",
  image: "/news/hero-ai.jpg",
  category: "ai",
  tags: ["LLMs", "Agentes"],
  author: {
    name: "Test Author",
    role: "Editor",
    avatarColor: "oklch(0.7 0.15 30)",
  },
  publishedAt: "2026-05-12T08:00:00Z",
  readingMinutes: 5,
  views: 1000,
  likes: 80,
};

describe("NewsCard", () => {
  it("renders article title", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} />
      </IntlWrapper>,
    );
    expect(screen.getByText("Test Article Title")).toBeDefined();
  });

  it("renders article image with correct alt text", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} />
      </IntlWrapper>,
    );
    const img = screen.getByAltText("Test Article Title");
    expect(img).toBeDefined();
  });

  it("renders a link to the article slug", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} />
      </IntlWrapper>,
    );
    const links = screen.getAllByRole("link");
    const slugLink = links.find((l) => l.getAttribute("href")?.includes("test-article"));
    expect(slugLink).toBeDefined();
  });

  it("renders reading time", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} />
      </IntlWrapper>,
    );
    expect(screen.getByText(/5/)).toBeDefined();
  });

  it("renders excerpt in md size", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} size="md" />
      </IntlWrapper>,
    );
    expect(screen.getByText("Short description of the article.")).toBeDefined();
  });

  it("does not render excerpt in sm size", () => {
    render(
      <IntlWrapper>
        <NewsCard article={mockArticle} size="sm" />
      </IntlWrapper>,
    );
    expect(screen.queryByText("Short description of the article.")).toBeNull();
  });
});
