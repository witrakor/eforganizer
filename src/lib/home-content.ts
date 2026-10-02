import type { Content, Locale } from "./types";
export const homeSections = [
  "work",
  "process",
  "team",
  "testimonials",
  "partners",
  "journal",
  "faq",
  "contact",
] as const;
export type HomeSection = (typeof homeSections)[number];
export const sectionLabels: Record<HomeSection, string> = {
  work: "ผลงานเด่น",
  process: "ขั้นตอนทำงาน",
  team: "ทีมงาน",
  testimonials: "เสียงจากลูกค้า",
  partners: "เครือข่ายพันธมิตร",
  journal: "บทความ",
  faq: "คำถามที่พบบ่อย",
  contact: "ชวนติดต่อ",
};
export type Relationship = {
  id: string;
  kind: "client" | "partner" | "testimonial";
  image: string;
  href: string;
  published: boolean;
  th: { name: string; detail: string };
  en: { name: string; detail: string };
};
export function homeOrder(page: Content) {
  return page.sections?.length
    ? page.sections.filter((section) => homeSections.includes(section.id))
    : homeSections.map((id) => ({ id, enabled: true }));
}
export function selectedContent(
  page: Content,
  kind: "service" | "project" | "post",
  items: Content[],
  limit: number,
) {
  const selected = page.selections?.[kind];
  if (selected?.length)
    return selected
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is Content => !!item)
      .slice(0, limit);
  const featured = items.filter((item) => item.featured);
  return (featured.length ? featured : items).slice(0, limit);
}
export function homeText(
  page: Content,
  locale: Locale,
  key: string,
  th: string,
  en: string,
) {
  return String(page[locale][key] || (locale === "th" ? th : en));
}

/** Editorial covers for existing stories; future CMS cover changes take precedence. */
export function homeProjectImage(project: Content) {
  const selections: Record<string, { original: string; galleryIndex: number }> =
    {
      "miss-universe-khon-kaen": {
        original: "/api/media/c9ff40d3-e81f-450d-adc6-561b6e24f30b",
        galleryIndex: 0,
      },
      "isan-creative": {
        original: "/api/media/321a8e38-0404-4f18-acc3-5615052c07c9",
        galleryIndex: 0,
      },
      "sme-reboost": {
        original: "/api/media/5691b242-27bf-437c-a234-63857a6cfa85",
        galleryIndex: 1,
      },
      "min-chat-wedding": {
        original: "/api/media/d1bba85b-040f-41ed-af9e-3d711c85ab4a",
        galleryIndex: 8,
      },
    };
  const selected = selections[project.slug];
  return selected && project.image === selected.original
    ? project.gallery[selected.galleryIndex] || project.image
    : project.image;
}

export type HeroSelection = {
  /** contentId/contentKind are used by new slides; projectId keeps saved slides working. */
  contentId?: string;
  contentKind?: "project" | "post";
  projectId?: string;
  image: string;
  x: number;
  y: number;
  mobileX: number;
  mobileY: number;
};
export type HeroSlide = HeroSelection & {
  title: string;
  role: string;
  href: string;
};

/** A stable, curated opening sequence. Never sample unpublished or unrelated images. */
export function defaultHeroSelections(projects: Content[]): HeroSelection[] {
  const curated = [
    { slug: "sme-reboost", index: 3, y: 48 },
    { slug: "min-chat-wedding", index: 0, y: 48 },
    { slug: "miss-universe-khon-kaen", index: -1, y: 40 },
    { slug: "isan-creative", index: 1, y: 45 },
  ];
  return curated.flatMap(({ slug, index, y }) => {
    const project = projects.find(
      (p) =>
        p.kind === "project" && p.status === "published" && p.slug === slug,
    );
    if (!project) return [];
    const image = project.gallery[index] || project.image;
    return image
      ? [{ projectId: project.id, image, x: 50, y, mobileX: 50, mobileY: 50 }]
      : [];
  });
}
export function heroSlides(
  page: Content,
  sources: Content[],
  locale: Locale,
): HeroSlide[] {
  const projects = sources.filter((item) => item.kind === "project");
  const workImages = new Set(
    selectedContent(page, "project", projects, 4).map(homeProjectImage),
  );
  return (page.heroSlides ?? defaultHeroSelections(projects))
    .slice(0, 6)
    .flatMap((selection) => {
      const kind = selection.contentKind ?? "project";
      const sourceId = selection.contentId ?? selection.projectId;
      const source = sources.find(
        (item) =>
          item.id === sourceId &&
          item.kind === kind &&
          item.status === "published",
      );
      if (
        !source ||
        !selection.image ||
        workImages.has(selection.image) ||
        ![source.image, ...source.gallery].includes(selection.image)
      )
        return [];
      return [
        {
          ...selection,
          contentId: source.id,
          contentKind: kind,
          title: source[locale].title,
          role: String(source[locale].role || source[locale].subtitle || ""),
          href: `/${locale}/${kind === "project" ? "work" : "journal"}/${source.slug}`,
        },
      ];
    });
}
