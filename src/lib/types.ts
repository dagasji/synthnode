export type CategorySlug =
  | "ai"
  | "programming"
  | "web-dev"
  | "devops"
  | "startups"
  | "open-source"
  | "security";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  accent: string; // tailwind text-* token name (used as label)
}

export interface Author {
  name: string;
  role: string;
  avatarColor: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  image: string;
  category: CategorySlug;
  tags: string[];
  author: Author;
  publishedAt: string; // ISO
  readingMinutes: number;
  views: number;
  likes: number;
  featured?: boolean;
  trending?: boolean;
}
