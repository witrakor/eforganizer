import type { Content } from "./types";

const segments: Record<Content["kind"], string> = {
  page: "pages",
  service: "services",
  project: "projects",
  post: "articles",
};

export function adminContentHref(item: Pick<Content, "kind" | "slug">) {
  return `/admin/content/${segments[item.kind]}/${encodeURIComponent(item.slug)}`;
}

export function adminContentKind(segment: string): Content["kind"] | null {
  return (
    (Object.keys(segments) as Content["kind"][]).find(
      (kind) => segments[kind] === segment,
    ) || null
  );
}
