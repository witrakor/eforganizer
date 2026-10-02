import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { contents, content } from "@/lib/content";
import type { Locale } from "@/lib/types";
import Header from "@/components/site-header";
import {
  Home,
  Footer,
  CTA,
  PageIntro,
  JournalCards,
  Detail,
  Contact,
  Markdown,
  text,
} from "@/components/site";
import WorkGrid from "@/components/work-grid";
import PhotoGallery from "@/components/photo-gallery";
import { EventCategories } from "@/components/event-categories";
import { ServiceDetail } from "@/components/service-detail";
import {
  catalogServices,
  serviceCategory,
  serviceMenuItems,
  serviceCover,
} from "@/lib/service-catalog";
import { teamPhotos } from "@/lib/event-photos";
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
  const c = item[locale];
  const title =
    segments.length === 1 && segments[0] === "services"
      ? locale === "th"
        ? "งานที่เรารับจัด"
        : "Events we organize"
      : c.title.replace(/\n/g, " ");
  const suffix = segments.length ? "/" + segments.join("/") : "";
  return {
    title:
      segments.length === 1 && segments[0] === "services"
        ? title
        : c.seoTitle || title,
    description: c.seoDescription || c.description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: { th: `/th${suffix}`, en: `/en${suffix}` },
    },
    openGraph: {
      title,
      description: c.description,
      locale: locale === "th" ? "th_TH" : "en_US",
      images: item.image
        ? [
            item.kind === "service"
              ? serviceCover(item.slug) || item.image
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
  const displayServices = catalogServices(services);
  const additionalServices = services.filter(
    (service) => !serviceCategory(service.slug),
  );
  const menuItems = serviceMenuItems(services);
  let body;
  if (!segments.length)
    body = (
      <Home
        preview={process.env.SHOW_DESIGN_PREVIEW === "true"}
        page={page}
        services={services}
        projects={projects}
        posts={posts}
        locale={l}
      />
    );
  else if (segments.length === 2 && page.kind === "service")
    body = (
      <ServiceDetail
        item={page}
        locale={l}
        related={projects.filter((p) => p.category === page.slug)}
        number={
          menuItems.findIndex((service) => service.slug === page.slug) + 1
        }
        sketch={
          menuItems.find((service) => service.slug === page.slug)?.sketch ?? 11
        }
      />
    );
  else if (segments.length === 2)
    body = (
      <Detail
        item={page}
        locale={l}
        related={
          page.kind === "service"
            ? projects.filter((p) => p.category === page.slug)
            : []
        }
      />
    );
  else
    switch (segments[0]) {
      case "services":
        body = (
          <>
            <div className="service-directory-intro">
              <PageIntro
                item={{
                  ...page,
                  th: {
                    ...page.th,
                    title: "งานที่เรารับจัด",
                    eyebrow: "EVENTS WE CREATE",
                    description:
                      "สำรวจงานและบริการทั้งหมดที่เราดูแล เลือกหัวข้อที่ตรงกับสิ่งที่คุณกำลังวางแผน แล้วดูรายละเอียดได้เลย",
                  },
                  en: {
                    ...page.en,
                    title: "Events we organize",
                    eyebrow: "EVENTS WE CREATE",
                    description:
                      "Explore every event and service we offer. Choose what fits your plans to see the details.",
                  },
                }}
                locale={l}
              />
            </div>
            <EventCategories locale={l} showHeading={false} items={menuItems} />
            <CTA locale={l} />
          </>
        );
        break;
      case "work":
        body = (
          <>
            <PageIntro item={page} locale={l} />
            <section className="container section-tight">
              <WorkGrid items={projects} services={services} locale={l} />
            </section>
            <CTA locale={l} />
          </>
        );
        break;
      case "journal":
        body = (
          <>
            <PageIntro item={page} locale={l} />
            <section className="container section-tight">
              <JournalCards posts={posts} locale={l} />
            </section>
            <CTA locale={l} />
          </>
        );
        break;
      case "contact":
        body = (
          <Contact
            page={page}
            services={[...displayServices, ...additionalServices]}
            locale={l}
          />
        );
        break;
      case "about":
        body = (
          <>
            <PageIntro item={page} locale={l} />
            <div className="container about-cover">
              <Image
                src={page.image}
                fill
                priority
                sizes="(max-width:1150px) 100vw,1150px"
                alt="Elite Flow team"
              />
            </div>
            <section className="container section about-body">
              <div>
                <span className="eyebrow">OUR APPROACH</span>
                <h2>
                  {text(
                    l,
                    "ใส่ใจทุกช่วงเวลา\nทำงานด้วยความเข้าใจ",
                    "Every moment matters.\nEvery detail counts.",
                  )}
                </h2>
                <div className="values">
                  {page[l].items.map((v, i) => (
                    <div key={v}>
                      <span>0{i + 1}</span>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
              <Markdown body={page[l].body} />
            </section>
            <section className="container section-tight">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">BEHIND EVERY MOMENT</span>
                  <h2>
                    {text(
                      l,
                      "ทีมที่อยู่ในทุกรายละเอียด",
                      "The people making it happen.",
                    )}
                  </h2>
                </div>
              </div>
              <PhotoGallery
                images={page.gallery.length ? page.gallery : teamPhotos}
                title={text(l, "ทีมงานเบื้องหลัง", "Behind the scenes")}
                locale={l}
              />
            </section>
            <CTA locale={l} />
          </>
        );
        break;
      default:
        body = (
          <>
            <PageIntro item={page} locale={l} />
            <section className="container section-tight narrow">
              <Markdown body={page[l].body} />
            </section>
          </>
        );
    }
  return (
    <>
      <Header locale={l} />
      <main id="main-content">{body}</main>
      <Footer locale={l} contact={contactPage} />
    </>
  );
}
