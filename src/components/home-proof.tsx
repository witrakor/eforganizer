import Image from "next/image";
import Link from "./site-link";
import type { Content, Locale } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import { homeText } from "@/lib/home-content";
export function HomeProof({
  page,
  locale: l,
  kind,
}: {
  preview?: boolean;
  page: Content;
  locale: Locale;
  kind: "client" | "partner" | "testimonial";
}) {
  const items = (page.relationships || []).filter(
    (item) => item.kind === kind && item.published && item[l].name,
  );
  if (!items.length) return null;
  const title =
    kind === "client"
      ? homeText(
          page,
          l,
          "clientsTitle",
          "องค์กรที่ไว้วางใจให้เราดูแลงาน",
          "Trusted to bring people together",
        )
      : kind === "partner"
        ? homeText(
            page,
            l,
            "partnersTitle",
            "เครือข่ายที่ร่วมสร้างงานคุณภาพ",
            "A network built on collaboration",
          )
        : homeText(
            page,
            l,
            "testimonialsTitle",
            "จากประสบการณ์ของลูกค้า",
            "In our clients’ words",
          );
  return (
    <section
      id={
        kind === "client"
          ? "clients"
          : kind === "partner"
            ? "partners"
            : "testimonials"
      }
      className={`section proof-section proof-${kind}`}
    >
      <div className="container proof-layout">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {kind === "client"
                ? "OUR CLIENTS"
                : kind === "partner"
                  ? "OUR NETWORK"
                  : "CLIENT STORIES"}
            </span>
            <h2>{title}</h2>
            {kind !== "testimonial" && (
              <>
                <p className="proof-intro">
                  {kind === "client"
                    ? homeText(
                        page,
                        l,
                        "clientsDescription",
                        "ทุกความไว้วางใจ คือจุดเริ่มต้นของงานที่เราตั้งใจดูแล",
                        "Every collaboration starts with trust and thoughtful care.",
                      )
                    : homeText(
                        page,
                        l,
                        "partnersDescription",
                        "ประสานความเชี่ยวชาญที่แตกต่าง เพื่อให้งานทุกส่วนลงตัว",
                        "Bringing complementary expertise together, down to the finest detail.",
                      )}
                </p>
                {kind === "client" && (
                  <p className="proof-intro">
                    {homeText(
                      page,
                      l,
                      "clientsDetail",
                      "ความไว้วางใจเกิดจากการเข้าใจโจทย์และดูแลสิ่งที่ตกลงกันไว้ เรารวบรวมชื่อลูกค้าและทีมผู้จัดงาน พร้อมบทบาทที่เราได้ร่วมดูแล เพื่อให้คุณรู้จักประสบการณ์ของเราผ่านเรื่องราวของแต่ละงาน",
                      "Trust grows from understanding the brief and caring for the agreed details. Here are clients and event teams we have worked with, alongside our role in each occasion, so you can explore the experience behind the names.",
                    )}
                  </p>
                )}
                {kind === "client" && (
                  <Link className="text-link" href={`/${l}/work`}>
                    {l === "th" ? "รู้จักเราผ่านผลงาน" : "Explore our work"}
                    <ArrowUpRight size={17} />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        {kind === "client" ? (
          <div className="client-stories">
            {items.map((item, index) => {
              const content = (
                <>
                  <span className="client-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{item[l].name}</strong>
                    <p>{item[l].detail}</p>
                  </div>
                  {item.href && <ArrowUpRight size={18} aria-hidden="true" />}
                </>
              );
              return item.href ? (
                <Link
                  className="client-evidence-entry"
                  key={item.id}
                  href={item.href}
                >
                  {content}
                </Link>
              ) : (
                <div className="client-evidence-entry" key={item.id}>
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={
              kind === "testimonial" ? "testimonial-grid" : "logo-grid"
            }
          >
            {items.map((item) => {
              const content = (
                <>
                  {item.image && (
                    <div className="proof-logo">
                      <Image
                        src={item.image}
                        fill
                        sizes="160px"
                        alt={item[l].name}
                      />
                    </div>
                  )}
                  {kind === "testimonial" ? (
                    <blockquote>{item[l].detail}</blockquote>
                  ) : null}
                  <strong>{item[l].name}</strong>
                  {kind !== "testimonial" && item[l].detail && (
                    <p>{item[l].detail}</p>
                  )}
                </>
              );
              return item.href ? (
                <Link key={item.id} className="proof-card" href={item.href}>
                  {content}
                </Link>
              ) : (
                <div className="proof-card" key={item.id}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
