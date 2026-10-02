import { adminContentHref } from "./admin-content-url";
import type { Content } from "./types";
export const kindLabels: Record<string, string> = {
  all: "ทั้งหมด",
  page: "หน้าเว็บ",
  service: "บริการ",
  project: "ผลงาน",
  post: "บทความ",
};
export const pageLabels: Record<string, string> = {
  home: "หน้าแรก",
  about: "เกี่ยวกับเรา",
  services: "บริการทั้งหมด",
  work: "ผลงานทั้งหมด",
  journal: "บทความทั้งหมด",
  contact: "ติดต่อเรา",
  privacy: "นโยบายความเป็นส่วนตัว",
};
export function isSystemPage(item: { kind: string; slug: string }) {
  return item.kind === "page" && Object.hasOwn(pageLabels, item.slug);
}
export function contentName(item: Content) {
  return (
    (item.kind === "page" && pageLabels[item.slug]) ||
    item.th.title ||
    item.en.title ||
    "ยังไม่มีชื่อ"
  );
}
export function filterContent(
  items: Content[],
  kind: string,
  status: string,
  search: string,
  sort: string,
) {
  const term = search.trim().toLocaleLowerCase();
  return items
    .filter(
      (i) =>
        (kind === "all" || i.kind === kind) &&
        (status === "all" || i.status === status) &&
        [contentName(i), i.th.title, i.en.title, i.slug]
          .join(" ")
          .toLocaleLowerCase()
          .includes(term),
    )
    .sort((a, b) =>
      sort === "name"
        ? contentName(a).localeCompare(contentName(b), "th")
        : sort === "order"
          ? a.sortOrder - b.sortOrder
          : String(b.updatedAt || b.date).localeCompare(
              String(a.updatedAt || a.date),
            ),
    );
}
export function mediaUsage(items: Content[], url: string) {
  if (!url) return [];
  return items
    .filter(
      (c) =>
        c.image === url ||
        c.gallery.includes(url) ||
        JSON.stringify([c.th, c.en, c.relationships, c.heroSlides]).includes(
          JSON.stringify(url).slice(1, -1),
        ),
    )
    .map((c) => ({ id: c.id, title: contentName(c), href: adminContentHref(c) }));
}
export const homeGroups = [
  {
    id: "hero",
    label: "ภาพเปิดหน้า",
    keys: ["eyebrow", "heroTitle", "heroSubtitle", "heroDescription"],
  },
  {
    id: "experience",
    label: "ประสบการณ์",
    keys: ["experienceTitle", "experienceDescription"],
  },
  {
    id: "clients",
    label: "ลูกค้าของเรา",
    keys: ["clientSectionTitle", "clientSectionDescription"],
  },
  {
    id: "work",
    label: "ผลงานเด่น",
    keys: ["workTitle", "workDescription"],
  },
  {
    id: "journal",
    label: "บทความ",
    keys: ["journalTitle", "journalDescription"],
  },
  {
    id: "process",
    label: "ขั้นตอนทำงาน",
    keys: [
      "processTitle",
      "processDescription",
      "processDetail",
      ...[1, 2, 3, 4].flatMap((i) => [`step${i}Title`, `step${i}Description`]),
    ],
  },
  {
    id: "team",
    label: "ทีมงาน",
    keys: ["teamTitle", "teamDescription", "teamDetail"],
  },
  {
    id: "partners",
    label: "เครือข่ายพันธมิตร",
    keys: ["partnersTitle", "partnersDescription"],
  },
  {
    id: "testimonials",
    label: "เสียงจากลูกค้า",
    keys: ["testimonialsTitle"],
  },
  {
    id: "faq",
    label: "คำถามที่พบบ่อย",
    keys: [
      "faqTitle",
      ...[1, 2, 3].flatMap((i) => [`faq${i}Question`, `faq${i}Answer`]),
    ],
  },
  { id: "contact", label: "ชวนติดต่อ", keys: ["ctaTitle", "ctaDescription"] },
  { id: "layout", label: "ลำดับส่วนของหน้า", keys: [] },
  { id: "seo", label: "ข้อมูลหน้าและ SEO", keys: [] },
];
