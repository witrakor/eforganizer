import type { HomeSection, Relationship, HeroSelection } from "./home-content";
export type Locale = "th" | "en";
export type Translation = {
  title: string;
  subtitle: string;
  description: string;
  body: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  items: string[];
  [key: string]: string | string[];
};
export type Content = {
  id: string;
  kind: "page" | "service" | "project" | "post";
  slug: string;
  status: "draft" | "published";
  image: string;
  gallery: string[];
  category: string;
  featured: boolean;
  sortOrder: number;
  date: string;
  eventDate?: string;
  eventDateEnd?: string;
  sources?: { url: string; publishedAt: string; label: string }[];
  th: Translation;
  en: Translation;
  version?: number;
  updatedAt?: string;
  sections?: { id: HomeSection; enabled: boolean }[];
  selections?: Partial<Record<"service" | "project" | "post", string[]>>;
  relationships?: Relationship[];
  heroSlides?: HeroSelection[];
};
export type Media = {
  id: string;
  name: string;
  url: string;
  mime: string;
  size: number;
  alt: string;
  source: string;
  driver: string;
  storageKey: string;
  createdAt: string;
  deletedAt: string | null;
};
export const emptyTranslation = (): Translation => ({
  title: "",
  subtitle: "",
  description: "",
  body: "",
  eyebrow: "",
  seoTitle: "",
  seoDescription: "",
  items: [],
});
export function localize(c: Content, l: Locale) {
  return c[l];
}
