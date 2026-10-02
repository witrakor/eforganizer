import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "./site-link";
import { homeText } from "@/lib/home-content";
import { eventPhotos } from "@/lib/event-photos";
import type { Content, Locale } from "@/lib/types";

const groups = [
  {
    id: "corporate",
    th: "องค์กรและแบรนด์",
    en: "Corporate & brand events",
    thNote: "วางแผนและประสานทุกฝ่าย ให้งานสะท้อนภาพลักษณ์องค์กร",
    enNote: "Bring people, ideas and your brand together.",
    slugs: [
      "meetings-conferences",
      "ceremonies-launches",
      "corporate-celebrations",
      "exhibitions-activations",
    ],
  },
  {
    id: "wedding",
    th: "งานแต่งและวันสำคัญ",
    en: "Weddings & private occasions",
    thNote: "ดูแลลำดับพิธีและประสานหน้างาน ให้คุณอยู่กับช่วงเวลาสำคัญ",
    enNote: "Be present in the moments that matter.",
    slugs: ["weddings-private-events", "wedding-day-coordination"],
  },
  {
    id: "stage",
    th: "เวทีและกิจกรรมพิเศษ",
    en: "Stages & special events",
    thNote: "เชื่อมพิธีกร คิวเวที และทีมเบื้องหลัง ให้ทุกช่วงดำเนินอย่างลงตัว",
    enNote: "Connect the stage, the audience and the crew.",
    slugs: ["professional-emcee", "special-events", "sports-events"],
  },
];

export function HomeServices({
  services,
  locale: l,
  page,
}: {
  services: Content[];
  locale: Locale;
  page: Content;
}) {
  const known = new Set(groups.flatMap((group) => group.slugs));
  const other = services.filter((service) => !known.has(service.slug));
  return (
    <section className="section container home-service-directory" id="services">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHAT WE DO</span>
          <h2>{l === "th" ? "งานที่เรารับทำ" : "What we can help with"}</h2>
        </div>
        <p>
          {l === "th"
            ? "เลือกประเภทงานหรือทีมที่คุณต้องการ แล้วดูรายละเอียดบริการที่เหมาะกับคุณ"
            : "Find your event or the team you need, then explore the right service for you."}
        </p>
      </div>
      <p className="home-section-description">
        {homeText(
          page,
          l,
          "servicesNarrative",
          "แต่ละงานมีผู้ร่วมงาน บรรยากาศ และรายละเอียดที่ต่างกัน เราจึงเริ่มจากเป้าหมายของคุณก่อนเลือกวิธีจัดงาน ทั้งงานองค์กรที่ต้องสื่อสารอย่างชัดเจน งานแต่งที่ต้องใส่ใจจังหวะของพิธี และกิจกรรมบนเวทีที่ทุกฝ่ายต้องทำงานสอดคล้องกัน",
          "Every event brings a different audience, atmosphere and set of details. We start with your goals: clear communication for corporate occasions, thoughtful timing for weddings, and close coordination between everyone involved in a stage event.",
        )}
      </p>
      <div className="home-service-groups">
        {groups.map((group, index) => {
          const entries = group.slugs.flatMap((slug) =>
            services.filter((service) => service.slug === slug),
          );
          if (!entries.length) return null;
          return (
            <article className="home-service-group" key={group.id}>
              <div className={`home-service-cover service-cover-${group.id}`}>
                <Image
                  src={
                    (group.id === "wedding"
                      ? eventPhotos(entries[0]).find(
                          (src) => src !== entries[0].image,
                        )
                      : undefined) ||
                    (group.id === "stage"
                      ? entries.find(
                          (service) => service.slug === "special-events",
                        )?.image
                      : undefined) ||
                    entries[0].image
                  }
                  alt=""
                  fill
                  sizes="(max-width: 650px) 100vw, 33vw"
                />
                <span>0{index + 1}</span>
              </div>
              <div className="home-service-group-copy">
                <h3>{group[l]}</h3>
                <p>{l === "th" ? group.thNote : group.enNote}</p>
                <details className="service-details">
                  <summary>
                    {l === "th" ? "สำรวจบริการในหมวดนี้" : "Explore services"}
                    <ArrowUpRight size={17} />
                  </summary>
                  <ul>
                    {entries.map((service) => (
                      <li key={service.id}>
                        <Link href={`/${l}/services/${service.slug}`}>
                          <span>{service[l].title}</span>
                          <ArrowUpRight size={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          );
        })}
      </div>
      {other.length > 0 && (
        <div className="home-service-other">
          <h3>{l === "th" ? "บริการอื่น ๆ" : "More services"}</h3>
          {other.map((service) => (
            <Link
              className="text-link"
              key={service.id}
              href={`/${l}/services/${service.slug}`}
            >
              {service[l].title}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      )}
      <div className="home-service-help">
        <p>
          {l === "th"
            ? "ยังไม่แน่ใจว่าต้องใช้ทีมแบบไหน? เล่าโจทย์ให้เราฟังได้เลย"
            : "Not sure which team you need? Tell us what you have in mind."}
        </p>
        <Link className="text-link" href={`/${l}/contact`}>
          {l === "th" ? "ให้เราช่วยวางแผน" : "Let’s plan together"}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
