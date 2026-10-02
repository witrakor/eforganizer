import Image from "next/image";
import type { Content, Locale } from "@/lib/types";
import {
  Home,
  CTA,
  PageIntro,
  JournalCards,
  Detail,
  Contact,
  Markdown,
  text,
} from "./site";
import WorkGrid from "./work-grid";
import PhotoGallery from "./photo-gallery";
import { EventCategories } from "./event-categories";
import { ServiceDetail } from "./service-detail";
import {
  catalogServices,
  serviceCategory,
  serviceMenuItems,
} from "@/lib/service-catalog";
import { teamPhotos } from "@/lib/event-photos";
export default function ContentBody({
  page,
  locale: l,
  services,
  projects,
  posts,
  preview = false,
  designPreview = false,
}: {
  page: Content;
  locale: Locale;
  services: Content[];
  projects: Content[];
  posts: Content[];
  preview?: boolean;
  designPreview?: boolean;
}) {
  const displayServices = catalogServices(services);
  const additionalServices = services.filter(
    (service) => !serviceCategory(service.slug),
  );
  const menuItems = serviceMenuItems(services);
  let body;
  if (page.kind === "page" && page.slug === "home")
    body = (
      <Home
        preview={preview || designPreview}
        page={page}
        services={services}
        projects={projects}
        posts={posts}
        locale={l}
      />
    );
  else if (page.kind === "service")
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
  else if (page.kind !== "page")
    body = <Detail item={page} locale={l} related={[]} />;
  else
    switch (page.slug) {
      case "services":
        body = (
          <>
            <div className="service-directory-intro">
              <PageIntro item={page} locale={l} />
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
          <div inert={preview || undefined}>
            <Contact
              page={page}
              services={[...displayServices, ...additionalServices]}
              locale={l}
            />
          </div>
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
  return body;
}
