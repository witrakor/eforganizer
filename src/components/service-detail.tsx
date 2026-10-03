import { coverImageStyle } from "@/lib/content-images";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, ImageIcon } from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import { serviceCategory, serviceCover } from "@/lib/service-catalog";
import { eventPhotos } from "@/lib/event-photos";
import { EventSketch } from "./event-art";
import Link from "./site-link";
import PhotoGallery from "./photo-gallery";
import { Markdown } from "./markdown";

export function ServiceDetail({
  item,
  locale,
  related,
  number,
  sketch,
}: {
  item: Content;
  locale: Locale;
  related: Content[];
  number: number;
  sketch: number;
}) {
  const category = serviceCategory(item.slug);
  const copy = item[locale];
  const th = locale === "th";
  const photos = eventPhotos(item);
  const generatedCover = item.coverOverride ? null : serviceCover(item.slug);
  const cover = generatedCover || item.image;
  return (
    <>
      <section className="container service-detail-intro">
        <nav
          className="breadcrumb"
          aria-label={th ? "ตำแหน่งหน้า" : "Breadcrumb"}
        >
          <Link href={`/${locale}`}>{th ? "หน้าแรก" : "Home"}</Link>
          <span>/</span>
          <Link href={`/${locale}/services`}>
            {th ? "งานที่เรารับจัด" : "Events we organize"}
          </Link>
          <span>/</span>
          <span aria-current="page">{copy.title}</span>
        </nav>
        <span className="eyebrow">EVENTS WE CREATE</span>
        <h1>{copy.title}</h1>
        {copy.subtitle && (
          <p className="service-detail-examples">{copy.subtitle}</p>
        )}
      </section>
      <div className="container service-detail-cover">
        <div className="service-detail-icon" aria-hidden="true">
          <span>{String(number).padStart(2, "0")}</span>
          <EventSketch variant={sketch} />
          <span>ELITE FLOW</span>
        </div>
        <div className="service-detail-photo">
          {cover ? (
            <Image
              src={cover}
              style={coverImageStyle(item)}
              fill
              priority
              sizes="(max-width: 700px) 100vw, 80vw"
              alt={`${generatedCover ? (th ? "ภาพคอนเซปต์" : "Concept image") : th ? "ภาพบรรยากาศ" : "Event photograph"}: ${copy.title}`}
            />
          ) : (
            <div className="service-detail-photo-empty" role="status">
              <ImageIcon size={32} aria-hidden="true" />
              <strong>
                {th ? "ยังไม่ได้เลือกภาพหลัก" : "No cover image selected"}
              </strong>
              <span>
                {th
                  ? "เลือกภาพในส่วน “ภาพหลัก” แล้วเปิดดูตัวอย่างอีกครั้ง"
                  : "Choose an image in the Cover image section, then preview again."}
              </span>
            </div>
          )}
          {generatedCover && (
            <span className="service-detail-photo-label">
              {th ? "ภาพคอนเซปต์บริการ" : "Service concept image"}
            </span>
          )}
        </div>
      </div>
      <section className="container service-detail-content">
        <div className="service-detail-lead">
          <span className="eyebrow">
            {th ? "เกี่ยวกับบริการนี้" : "ABOUT THIS SERVICE"}
          </span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          {category ? (
            <p>
              {th
                ? "เราเริ่มจากเป้าหมาย รูปแบบงาน จำนวนผู้ร่วมงาน และงบประมาณ แล้วช่วยวางแผน ประสานผู้เกี่ยวข้อง และจัดทีมดูแลตามขอบเขตที่ตกลงร่วมกัน"
                : "We begin with your goals, event format, audience and budget, then plan the experience, coordinate the people involved and shape an agreed scope of support."}
            </p>
          ) : (
            <Markdown body={copy.body} />
          )}
        </div>
        <div className="service-detail-scope">
          <span className="eyebrow">
            {th ? "สิ่งที่เราช่วยดูแล" : "WHAT WE CAN HELP WITH"}
          </span>
          <div className="service-detail-scope-list">
            {copy.items.map((item) => (
              <div key={item}>
                <Check size={18} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Link
            className="button"
            href={`/${locale}/contact?service=${item.slug}`}
          >
            {th ? "ปรึกษาการจัดงาน" : "Discuss your event"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      {photos.length > 0 && (
        <section className="container section-tight service-detail-gallery">
          <div className="section-heading">
            <div>
              <span className="eyebrow">REAL MOMENTS</span>
              <h2>
                {th
                  ? "ภาพจากประสบการณ์ของทีม"
                  : "Moments from our team's experience"}
              </h2>
            </div>
          </div>
          <PhotoGallery images={photos} title={copy.title} locale={locale} />
        </section>
      )}
      {related.length > 0 && (
        <section className="container section-tight service-detail-related">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SELECTED EXPERIENCE</span>
              <h2>{th ? "ผลงานที่เกี่ยวข้อง" : "Related experience"}</h2>
            </div>
          </div>
          <div className="service-detail-related-grid">
            {related.slice(0, 3).map((project) => (
              <Link href={`/${locale}/work/${project.slug}`} key={project.slug}>
                <div className="service-detail-related-image">
                  <Image
                    src={project.image}
                    style={coverImageStyle(project)}
                    fill
                    sizes="(max-width: 700px) 100vw, 30vw"
                    alt={project[locale].title}
                  />
                </div>
                <span>
                  {project[locale].title}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="container service-detail-back">
        <Link href={`/${locale}/services`}>
          <ArrowLeft size={17} aria-hidden="true" />
          {th ? "ดูงานที่เรารับจัดทั้งหมด" : "Explore all event types"}
        </Link>
      </div>
    </>
  );
}
