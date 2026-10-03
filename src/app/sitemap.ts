import type { MetadataRoute } from "next";
import { contents } from "@/lib/content";
import { catalogServices } from "@/lib/service-catalog";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stored = await contents();
  const services = stored.filter((item) => item.kind === "service");
  const catalog = catalogServices(services);
  const catalogSlugs = new Set(catalog.map((item) => item.slug));
  const list = [
    ...stored.filter((item) => item.kind !== "service"),
    ...catalog,
    ...services.filter((item) => !catalogSlugs.has(item.slug)),
  ];
  const base = process.env.SITE_URL || "http://localhost:3100";
  return list.flatMap((c) => {
    const prefix =
      c.kind === "post"
        ? "journal/"
        : c.kind === "project"
          ? "work/"
          : c.kind === "service"
            ? "services/"
            : "";
    const fixed = [
      "home",
      "about",
      "services",
      "work",
      "journal",
      "contact",
      "privacy",
    ];
    const slug =
      c.slug === "home"
        ? ""
        : c.kind === "page" && !fixed.includes(c.slug)
          ? "pages/" + c.slug
          : prefix + c.slug;
    return ["th", "en"].map((l) => ({
      url: `${base}/${l}${slug ? "/" + slug : ""}`,
      lastModified: c.updatedAt
        ? new Date(c.updatedAt + "Z")
        : new Date(c.date),
      changeFrequency: "weekly" as const,
      priority: c.slug === "home" ? 1 : 0.7,
    }));
  });
}
