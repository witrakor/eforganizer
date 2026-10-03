import { adminContentHref } from "@/lib/admin-content-url";
import PublicAdminBar from "@/components/public-admin-bar";
import ContentBody from "@/components/content-body";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contents, content } from "@/lib/content";
import type { Locale } from "@/lib/types";
import { seoCopy } from "@/lib/seo-copy";
import Header from "@/components/site-header";
import { Footer } from "@/components/site";
import {
  catalogServices,
  serviceCategory,
  serviceCover,
} from "@/lib/service-catalog";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; segments?: string[] }> };
async function resolve(segments: string[]) {
  if (!segments.length) return content("page", "home");
  if (segments.length === 1)
    return [
      "about",
      "services",
      "work",
      "journal",
      "contact",
      "privacy",
    ].includes(segments[0])
      ? content("page", segments[0])
      : null;
  if (segments.length === 2) {
    if (segments[0] === "services" && serviceCategory(segments[1])) {
      const existing = await content("service", segments[1]);
      return (
        catalogServices(existing ? [existing] : []).find(
          (service) => service.slug === segments[1],
        ) || null
      );
    }
    const kinds: Record<string, string> = {
      services: "service",
      work: "project",
      journal: "post",
      pages: "page",
    };
    return kinds[segments[0]] ? content(kinds[segments[0]], segments[1]) : null;
  }
  return null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments = [] } = await params;
  if (locale !== "th" && locale !== "en") return {};
  const item = await resolve(segments);
  if (!item) return {};
  const copy = seoCopy(item, locale);
  const suffix = segments.length ? "/" + segments.join("/") : "";
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: { th: `/th${suffix}`, en: `/en${suffix}` },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      locale: locale === "th" ? "th_TH" : "en_US",
      images: item.image
        ? [
            item.kind === "service"
              ? item.coverOverride
                ? item.image
                : serviceCover(item.slug) || item.image
              : item.image,
          ]
        : [],
    },
  };
}
export default async function Page({ params }: Props) {
  const { locale, segments = [] } = await params;
  if (locale !== "th" && locale !== "en") notFound();
  const l = locale as Locale;
  const [page, contactPage, services, projects, posts] = await Promise.all([
    resolve(segments),
    content("page", "contact"),
    contents("service"),
    contents("project"),
    contents("post"),
  ]);
  if (!page || !contactPage) notFound();

  return (
    <>
      <PublicAdminBar
        key={page.id}
        editHref={
          page.kind !== "service" ||
          services.some((service) => service.id === page.id)
            ? adminContentHref(page)
            : null
        }
        kind={page.kind}
        listKind={
          segments.length === 1 && segments[0] === "journal"
            ? "post"
            : segments.length === 1 && segments[0] === "work"
              ? "project"
              : null
        }
      />
      <Header locale={l} />
      <main id="main-content">
        <ContentBody
          page={page}
          locale={l}
          services={services}
          projects={projects}
          posts={posts}
          designPreview={process.env.SHOW_DESIGN_PREVIEW === "true"}
        />
      </main>
      <Footer locale={l} contact={contactPage} />
    </>
  );
}
