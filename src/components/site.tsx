import type { ReactNode } from "react";
import { contentDate } from "@/lib/date";
import { EventCategories } from "./event-categories";
import { HomeProof } from "./home-proof";
import {
  homeOrder,
  homeProjectImage,
  homeText,
  selectedContent,
  type HomeSection,
} from "@/lib/home-content";
import Image from "next/image";
import { EventHero, EventSketch, sketchVariant } from "./event-art";
import Link from "./site-link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  MapPin,
  Phone,
  Mail,
  MoveUpRight,
} from "lucide-react";
import { Markdown } from "./markdown";
export { Markdown } from "./markdown";
import type { Content, Locale } from "@/lib/types";
import { Brand } from "./site-header";
import ContactForm from "./contact-form";
import WorkGrid from "./work-grid";
import PhotoGallery from "./photo-gallery";
import { eventPhotos, weddingPhotos } from "@/lib/event-photos";
export const text = (l: Locale, th: string, en: string) =>
  l === "th" ? th : en;
export function Footer({
  locale: l,
  contact,
}: {
  locale: Locale;
  contact: Content;
}) {
  const c = contact[l];
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link href={`/${l}`}>
            <Brand />
          </Link>
          <p>
            {text(
              l,
              "ทุกงานสำคัญ ดูแลด้วยความเข้าใจ",
              "Thoughtfully planned. Seamlessly delivered.",
            )}
          </p>
          <span className="location-dot">KHON KAEN, THAILAND</span>
        </div>
        <div>
          <span className="eyebrow">EXPLORE</span>
          <Link href={`/${l}/services`}>
            {text(l, "บริการของเรา", "Our expertise")}
          </Link>
          <Link href={`/${l}/work`}>
            {text(l, "ผลงานและประสบการณ์", "Our work")}
          </Link>
          <Link href={`/${l}/about`}>
            {text(l, "รู้จัก Elite Flow", "About Elite Flow")}
          </Link>
        </div>
        <div>
          <span className="eyebrow">GET IN TOUCH</span>
          <a href={`tel:${String(c.phone).replace(/\s/g, "")}`}>{c.phone}</a>
          <a href={`mailto:${c.email}`}>{c.email}</a>
          <a href={String(c.facebook)} target="_blank" rel="noreferrer">
            Facebook <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div
        className="mobile-contact-rail"
        aria-label={text(l, "ติดต่อทีมจัดงาน", "Contact our event team")}
      >
        <a href={`tel:${String(c.phone).replace(/\s/g, "")}`}>
          <Phone size={17} />
          {text(l, "โทรคุยกับทีม", "Call our team")}
        </a>
        <Link href={`/${l}/contact`}>
          {text(l, "ส่งบรีฟงานของคุณ", "Share your brief")}
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Elite Flow. All rights reserved.
        </span>
        <Link href={`/${l}/privacy`}>
          {text(l, "ความเป็นส่วนตัว", "Privacy")}
        </Link>
        <span>EXCELLENCE IN EVERY MOMENT</span>
      </div>
    </footer>
  );
}
export function CTA({
  locale: l,
  title,
  description,
}: {
  locale: Locale;
  title?: string;
  description?: string;
}) {
  return (
    <section className="cta-section cta-photo">
      <Image src="/media/celebration.webp" fill sizes="100vw" alt="" />
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">LET’S CREATE SOMETHING GREAT</span>
          <h2>
            {title ||
              text(
                l,
                "งานต่อไปของคุณ\nเริ่มต้นที่บทสนทนานี้",
                "Your next great event\nstarts with a conversation.",
              )}
          </h2>
          {description && <p className="home-cta-description">{description}</p>}
        </div>
        <Link
          href={`/${l}/contact`}
          className="button cta-contact"
          aria-label={text(l, "ปรึกษาการจัดงาน", "Discuss your event")}
        >
          <ArrowUpRight size={22} />
          <span>{text(l, "ปรึกษาการจัดงาน", "Let’s talk")}</span>
        </Link>
      </div>
    </section>
  );
}
export function ServiceCards({
  services,
  locale: l,
  startIndex = 0,
}: {
  services: Content[];
  locale: Locale;
  startIndex?: number;
}) {
  return (
    <div className="service-grid">
      {services.map((s, i) => {
        return (
          <Link
            className="service-card"
            href={`/${l}/services/${s.slug}`}
            key={s.id}
          >
            <div className="service-picture-frame">
              <div className="service-photo">
                <Image
                  src={s.image}
                  fill
                  sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  alt={s[l].title}
                />
              </div>
              <span className="service-sketch">
                <EventSketch variant={sketchVariant(s.slug)} />
              </span>
            </div>
            <div className="service-card-copy">
              <div className="service-top">
                <span>{text(l, "ความเชี่ยวชาญของเรา", "OUR EXPERTISE")}</span>
                <span>{String(startIndex + i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{s[l].title}</h3>
              <p>{s[l].description}</p>
              <div className="service-bottom">
                <span>{text(l, "สำรวจบริการ", "Explore service")}</span>
                <ArrowUpRight size={19} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export function PageIntro({
  item,
  locale: l,
}: {
  item: Content;
  locale: Locale;
}) {
  return (
    <section className="page-intro container">
      <div className="breadcrumb">
        <Link href={`/${l}`}>{text(l, "หน้าแรก", "Home")}</Link>
        <span>/</span>
        <span>{item[l].eyebrow || item[l].title}</span>
      </div>
      <span className="eyebrow">
        <i />
        {item[l].eyebrow}
      </span>
      <div className="intro-row">
        <h1>{item[l].title}</h1>
        <p>{item[l].description}</p>
      </div>
    </section>
  );
}
export function JournalCards({
  posts,
  locale: l,
}: {
  posts: Content[];
  locale: Locale;
}) {
  return (
    <div className="journal-grid">
      {posts.map((p) => (
        <Link
          key={p.id}
          href={`/${l}/journal/${p.slug}`}
          className="journal-card"
        >
          <div className="journal-image">
            <Image
              src={p.image}
              fill
              sizes="(max-width: 650px) 100vw, 33vw"
              alt={p[l].title}
            />
          </div>
          <div className="journal-meta">
            <span>{p[l].eyebrow}</span>
            <time dateTime={p.date}>{contentDate(p.date, l)}</time>
          </div>
          <h3>{p[l].title}</h3>
          <p>{p[l].description}</p>
          <span className="text-link">
            {text(l, "อ่านบทความ", "Read story")}
            <ArrowUpRight size={15} />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function Home({
  page,
  services,
  projects,
  posts,
  locale: l,
  preview = false,
}: {
  page: Content;
  services: Content[];
  projects: Content[];
  posts: Content[];
  locale: Locale;
  preview?: boolean;
}) {
  const c = page[l];
  const t = (key: string, th: string, en: string) =>
    homeText(page, l, key, th, en);
  const work = selectedContent(page, "project", projects, 4);
  const clientTrust = (page.relationships || []).filter(
    (item) => item.kind === "client" && item.published && item[l].name,
  );
  const sections: Record<HomeSection, ReactNode> = {
    partners: (
      <HomeProof page={page} locale={l} kind="partner" preview={preview} />
    ),
    testimonials: <HomeProof page={page} locale={l} kind="testimonial" />,
    work: (
      <section className="section work-section" id="work">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SELECTED EXPERIENCE</span>
              <h2>
                {t(
                  "workTitle",
                  "ภาพจริง จากประสบการณ์ของทีม",
                  "Real events. Real team experience.",
                )}
              </h2>
            </div>
            <Link className="text-link" href={`/${l}/work`}>
              {text(l, "ดูผลงานทั้งหมด", "View all work")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <p className="home-section-description">
            {t(
              "workDescription",
              "เบื้องหลังภาพแต่ละงาน มีทั้งการเตรียมพร้อม การประสานผู้คน และการดูแลจังหวะสำคัญ เราคัดประสบการณ์ของทีมจากงานหลากหลายรูปแบบมาให้คุณเห็นบรรยากาศจริง พร้อมบทบาทที่เราได้ร่วมดูแล เพื่อช่วยให้คุณมองเห็นภาพงานของตัวเองได้ชัดขึ้น",
              "Every event photograph has a story behind it: preparation, people and carefully coordinated moments. Explore a selection of our team’s experience, with real settings and clear descriptions of our role, to find ideas for your own event.",
            )}
          </p>
          <div className="home-project-grid">
            {work.map((p, i) => (
              <Link
                className={`home-project project-${i}`}
                href={`/${l}/work/${p.slug}`}
                key={p.id}
              >
                <div className="home-project-photo">
                  <Image
                    src={homeProjectImage(p)}
                    fill
                    sizes="(max-width:700px) 100vw, (max-width:1280px) 46vw, 580px"
                    alt={p[l].title}
                  />
                  <span className="project-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="home-project-label">
                  <div>
                    <span className="eyebrow">{p[l].eyebrow}</span>
                    <h3>{p[l].title}</h3>
                    <p>{p[l].role || p[l].subtitle}</p>
                  </div>
                  <span className="round-arrow">
                    <ArrowUpRight size={23} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="work-note">
            {text(
              l,
              "ประสบการณ์ของทีมในแต่ละบทบาท อ่านขอบเขตและเครดิตในรายละเอียดผลงาน",
              "Our team’s experience across different roles. Explore each story for scope and credits.",
            )}
          </p>
        </div>
      </section>
    ),
    process: (
      <section className="section process-pattern">
        <div className="container process-section">
          <div className="process-intro">
            <span className="eyebrow">THE WAY WE WORK</span>
            <h2>{c.processTitle}</h2>
            <p>{c.processDescription}</p>
            <p>
              {t(
                "processDetail",
                "เริ่มจากทำความเข้าใจสิ่งที่คุณอยากให้งานสื่อสาร แล้วค่อยวางลำดับงานและหน้าที่ของแต่ละฝ่ายให้เชื่อมกัน เมื่อถึงวันจริง ทุกคนจึงมีแผนเดียวกันเป็นจุดอ้างอิง และคุณรู้ว่าเรื่องไหนควรคุยกับใคร",
                "We begin with what you want your event to communicate, then connect the schedule with each team’s responsibilities. On the day, everyone has a shared plan to work from, and you know who to speak with about each detail.",
              )}
            </p>
            <Link className="text-link" href={`/${l}/contact`}>
              {text(l, "เริ่มคุยเรื่องงานของคุณ", "Start a conversation")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="process-list">
            {[1, 2, 3, 4].map((i) => (
              <div className="process-step" key={i}>
                <span>0{i}</span>
                <div>
                  <h3>{c[`step${i}Title`]}</h3>
                  <p>{c[`step${i}Description`]}</p>
                </div>
                <MoveUpRight size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    team: (
      <section className="section home-team">
        <div className="team-band container">
          <div className="team-band-photo">
            <Image
              src={page.gallery[1] || "/media/team.webp"}
              fill
              sizes="(max-width:700px) 100vw, 50vw"
              alt={text(l, "ทีม Elite Flow", "Elite Flow team")}
            />
          </div>
          <div className="team-band-copy">
            <span className="eyebrow">THE PEOPLE BEHIND THE FLOW</span>
            <h2>{c.teamTitle}</h2>
            <p>{c.teamDescription}</p>
            <p>
              {t(
                "teamDetail",
                "งานที่ไหลลื่นเริ่มจากคนที่สื่อสารกันเข้าใจ เราให้ความสำคัญกับการรับฟังเจ้าภาพ ประสานผู้ร่วมงาน และเตรียมรายละเอียดกับทีมที่เกี่ยวข้อง เพื่อให้สิ่งที่วางแผนไว้ส่งต่อถึงหน้างานอย่างชัดเจน",
                "An event flows well when the people behind it understand one another. We listen to the host, coordinate with participants and work through the details with the teams involved, so the plan carries clearly into the event itself.",
              )}
            </p>
            <Link className="text-link" href={`/${l}/about`}>
              {text(l, "รู้จักทีมและวิธีทำงาน", "Meet the team")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    ),
    journal: (
      <section className="section container home-journal">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE JOURNAL</span>
            <h2>
              {t(
                "journalTitle",
                "ไอเดียดี ๆ ก่อนเริ่มงาน",
                "Ideas for your next event",
              )}
            </h2>
          </div>
          <Link href={`/${l}/journal`} className="text-link">
            {text(l, "อ่านทั้งหมด", "All stories")}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="home-section-description">
          {t(
            "journalDescription",
            "หลายรายละเอียดของงานเริ่มคิดได้ตั้งแต่ก่อนเลือกสถานที่หรือกำหนดลำดับพิธี เรารวมเรื่องเล่าจากการทำงานและข้อสังเกตเล็ก ๆ ที่ช่วยให้คุณเตรียมตัว ตั้งคำถาม และคุยกับทีมจัดงานได้ตรงประเด็นขึ้น",
            "Some of the most useful decisions happen before a venue or schedule is confirmed. These stories and practical observations from event work help you prepare, ask better questions and have a clearer conversation with your event team.",
          )}
        </p>
        <JournalCards
          posts={selectedContent(page, "post", posts, 3)}
          locale={l}
        />
      </section>
    ),
    faq: (
      <section className="section container faq-section">
        <div>
          <span className="eyebrow">BEFORE WE BEGIN</span>
          <h2>{t("faqTitle", "ก่อนเริ่มวางแผนงาน", "Before we begin")}</h2>
          <p>
            {text(
              l,
              "ยังไม่มีรายละเอียดครบก็เริ่มคุยกันได้ ลองดูคำถามที่พบบ่อย เพื่อเตรียมข้อมูลเบื้องต้นและเข้าใจว่าเราจะวางแผนงานร่วมกันอย่างไร",
              "You don’t need every detail to start a conversation. These common questions help you prepare the basics and understand how we can plan your event together.",
            )}
          </p>
        </div>
        <div>
          {[1, 2, 3].map((i) => {
            const questions =
              l === "th"
                ? [
                    "ยังไม่มีรูปแบบหรืองบประมาณชัดเจน คุยได้ไหม?",
                    "ควรเตรียมข้อมูลอะไรให้ทีม?",
                    "ทีมรับผิดชอบส่วนไหนของงานบ้าง?",
                  ]
                : [
                    "Can we talk before our brief or budget is final?",
                    "What should we prepare?",
                    "Which parts of the event will you handle?",
                  ];
            const answers =
              l === "th"
                ? [
                    "ได้ครับ เริ่มจากเป้าหมาย ประเภทงาน และช่วงเวลาที่คิดไว้ แล้วค่อยกำหนดขอบเขตร่วมกัน",
                    "ประเภทงาน วันที่หรือช่วงเวลา สถานที่ จำนวนผู้ร่วมงาน และงบประมาณคร่าว ๆ หากยังไม่แน่ใจสามารถแจ้งทีมได้",
                    "เราจะตกลงขอบเขต ผู้รับผิดชอบ และรายละเอียดร่วมกันก่อนเริ่มงาน โดยพิจารณาจากรูปแบบและความต้องการของคุณ",
                  ]
                : [
                    "Yes. Start with your goals, event type and preferred dates. We can shape the scope together.",
                    "Share the event type, preferred dates, venue, guest count and an approximate budget. It is fine if some details are still undecided.",
                    "We agree on scope, responsibilities and details before work begins, based on your event and requirements.",
                  ];
            return (
              <details key={i}>
                <summary>
                  {t(`faq${i}Question`, questions[i - 1], questions[i - 1])}
                </summary>
                <p>{t(`faq${i}Answer`, answers[i - 1], answers[i - 1])}</p>
              </details>
            );
          })}
        </div>
      </section>
    ),
    contact: (
      <CTA
        locale={l}
        title={String(c.ctaTitle || "")}
        description={t(
          "ctaDescription",
          "เล่าให้เราฟังถึงงานที่คุณกำลังนึกถึง ไม่ว่าจะเป็นโอกาสสำคัญขององค์กรหรือวันพิเศษของครอบครัว เริ่มจากรูปแบบงาน ช่วงเวลา และสิ่งที่คุณให้ความสำคัญ แล้วเราค่อยวางรายละเอียดไปด้วยกัน",
          "Tell us about the event you have in mind, whether it is an important occasion for your organisation or a family celebration. Start with the event type, timing and what matters most to you. We can shape the details together.",
        )}
      />
    ),
  };
  return (
    <div className="home-page">
      <EventHero page={page} projects={projects} posts={posts} locale={l} />
      <EventCategories locale={l} />
      <section
        className="home-partner-band"
        aria-labelledby="home-partner-title"
        aria-describedby="home-partner-description"
      >
        <div className="container home-partner-inner">
          <strong
            className="home-experience-count"
            aria-label={text(
              l,
              "กว่า 100 งานที่ทีมมีประสบการณ์ร่วมดูแล",
              "Over 100 events our team has helped deliver",
            )}
          >
            100+
          </strong>
          <div className="home-partner-copy">
            <h2 id="home-partner-title">
              {text(
                l,
                "ประสบการณ์ที่ลูกค้าไว้วางใจ",
                "Experience our clients trust",
              )}
            </h2>
            <p id="home-partner-description">
              {text(
                l,
                "จากงานองค์กร ถึงวันสำคัญของครอบครัว",
                "From corporate events to family celebrations.",
              )}
            </p>
          </div>

        </div>
      </section>
      <section
        className="home-trust-section"
        aria-labelledby="home-trust-title"
      >
        <div className="container home-trust-layout">
          <div className="home-trust-intro">
            <span className="eyebrow">OUR CLIENTS</span>
            <h2 id="home-trust-title">
              {text(l, "ลูกค้าของเรา", "Our clients")}
            </h2>
            <p className="home-trust-lead">
              {text(
                l,
                "ขอบคุณลูกค้า เจ้าภาพ และทีมผู้จัดงาน ที่มอบความไว้วางใจให้เราร่วมดูแลช่วงเวลาสำคัญ ตั้งแต่งานแต่งงานและวันพิเศษของครอบครัว ไปจนถึงงานองค์กรและกิจกรรมสาธารณะ",
                "Thank you to the clients, hosts and event teams who have trusted us with their important occasions, from weddings and family celebrations to corporate events and public programmes.",
              )}
            </p>
            <Link className="text-link" href={`/${l}/work`}>
              {text(l, "ดูผลงานและบทบาทของทีม", "Explore our work")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="home-trust-evidence">
            <div className="home-trust-heading">
              <span className="eyebrow">TRUSTED THROUGH EVERY EVENT</span>
              <span>
                {text(
                  l,
                  "เจ้าภาพและทีมงานที่ร่วมงาน",
                  "Selected clients and hosts",
                )}
              </span>
            </div>
            <div className="home-trust-grid">
              {clientTrust.map((item, index) => {
                const href = item.href.replace(/^\/(th|en)(?=\/)/, `/${l}`);
                return (
                  <Link className="home-trust-client" href={href} key={item.id}>
                    {item.image && (
                      <span className="home-trust-portrait">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(max-width: 700px) 40vw, 15vw"
                          style={{
                            objectPosition: [
                              "50% 30%",
                              "51% 44%",
                              "60% 35%",
                              "55% 45%",
                              "50% 42%",
                              "49% 32%",
                              "50% 48%",
                              "50% 65%",
                            ][index % 8],
                            transform: `scale(${[1, 1.7, 1.5, 1.5, 1.5, 1.2, 1, 1.45][index % 8]})`,
                          }}
                        />
                      </span>
                    )}
                    <strong>{item[l].name}</strong>
                    <small>{item[l].detail}</small>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {homeOrder(page)
        .filter((s) => s.enabled)
        .map((s) => (
          <div key={s.id} data-home-section={s.id}>
            {sections[s.id]}
          </div>
        ))}
    </div>
  );
}
export function Detail({
  item,
  locale: l,
  related = [],
}: {
  item: Content;
  locale: Locale;
  related?: Content[];
}) {
  const c = item[l];
  return (
    <>
      <PageIntro item={item} locale={l} />
      {(item.kind === "project" || item.kind === "post") && (
        <div className="container publication-meta">
          <span>
            {text(l, "เผยแพร่", "Published")}{" "}
            <time dateTime={item.date}>{contentDate(item.date, l)}</time>
          </span>
          {item.eventDate && (
            <span>
              {text(l, "วันที่จัดงาน", "Event date")}:{" "}
              <time dateTime={item.eventDate}>
                {contentDate(item.eventDate, l)}
              </time>
              {item.eventDateEnd && item.eventDateEnd !== item.eventDate
                ? ` – ${contentDate(item.eventDateEnd, l)}`
                : ""}
            </span>
          )}
        </div>
      )}
      <section
        className={`container detail-overview${item.image ? "" : " detail-overview-no-image"}`}
      >
        {item.image && (
          <div className="detail-overview-photo">
            <Image
              src={item.image}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 1200px) 65vw, 760px"
              preload
              alt={c.title}
            />
          </div>
        )}
        <div className="detail-overview-summary">
          {item.kind === "project" && (
            <dl className="case-facts">
              {[
                ["client", "ลูกค้า / องค์กร", "Client / organization"],
                ["venue", "สถานที่", "Location"],
                ["role", "บทบาทของทีม", "Our role"],
                ["outcome", "ผลลัพธ์", "Outcome"],
              ]
                .filter(([key]) => c[key])
                .map(([key, th, en]) => (
                  <div key={key}>
                    <dt>{text(l, th, en)}</dt>
                    <dd>{c[key]}</dd>
                  </div>
                ))}
            </dl>
          )}
          <aside className="detail-aside">
            <span className="eyebrow">LET’S TALK</span>
            <h3>
              {text(l, "มีงานแบบนี้ในใจ?", "Planning something like this?")}
            </h3>
            <p>
              {text(
                l,
                "ส่งโจทย์ให้ทีมช่วยวางแผนและประเมินขอบเขตที่เหมาะกับคุณ",
                "Share your brief. We will help shape a scope that fits your event.",
              )}
            </p>
            <Link
              className="button"
              href={`/${l}/contact${item.kind === "service" ? `?service=${item.slug}` : item.category ? `?service=${item.category}` : ""}`}
            >
              {text(l, "ปรึกษาการจัดงาน", "Discuss your event")}
              <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
      </section>
      <section className="container section detail-story">
        <div>
          <Markdown body={c.body} />
          {!!item.sources?.length && (
            <details className="content-sources">
              <summary>
                {text(
                  l,
                  "ที่มาและวันที่โพสต์ต้นฉบับ",
                  "Sources and original post dates",
                )}
              </summary>
              <ul>
                {item.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.label}
                    </a>{" "}
                    ·{" "}
                    <time dateTime={source.publishedAt}>
                      {contentDate(source.publishedAt, l)}
                    </time>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {c.items.length > 0 && (
            <div className="scope-box">
              <span className="eyebrow">
                {text(l, "รูปแบบงานที่เราดูแล", "WHAT WE CAN HELP WITH")}
              </span>
              {c.items.map((i) => (
                <p key={i}>
                  <Check size={17} />
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
      {eventPhotos(item).length > 0 && (
        <section
          className="container section-tight detail-gallery"
          id="gallery"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">IN THE MOMENT</span>
              <h2>{text(l, "ภาพที่เล่าเรื่องราว", "A closer look.")}</h2>
            </div>
            <p>
              {text(
                l,
                "คลิกภาพเพื่อชมขนาดเต็ม",
                "Open a photograph to explore the details.",
              )}
            </p>
          </div>
          <PhotoGallery images={eventPhotos(item)} title={c.title} locale={l} />
          <p className="work-note">
            {text(
              l,
              "ภาพจากเพจ Elite Flow Team • ประสบการณ์ร่วมงานของทีม",
              "From the Elite Flow Team page • Our team’s event experience",
            )}
          </p>
        </section>
      )}
      {related.length > 0 && (
        <section className="container section">
          <div className="section-heading">
            <h2>{text(l, "ผลงานที่เกี่ยวข้อง", "Related experience")}</h2>
          </div>
          {related.length === 1 ? (
            <Link
              className="related-feature"
              href={`/${l}/work/${related[0].slug}`}
            >
              <div className="related-feature-image">
                <Image
                  src={related[0].image}
                  alt={related[0][l].title}
                  fill
                  sizes="(max-width: 700px) 100vw, 60vw"
                />
              </div>
              <div className="related-feature-copy">
                <span className="eyebrow">{related[0][l].eyebrow}</span>
                <h3>{related[0][l].title}</h3>
                <p>{related[0][l].description}</p>
                <span className="text-link">
                  {text(
                    l,
                    "ชมเรื่องราวและบทบาทของทีม",
                    "Explore the story & our role",
                  )}
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ) : (
            <WorkGrid items={related} services={[]} locale={l} />
          )}
        </section>
      )}
      <CTA locale={l} />
    </>
  );
}
export function Contact({
  page,
  services,
  locale: l,
}: {
  page: Content;
  services: Content[];
  locale: Locale;
}) {
  const c = page[l];
  return (
    <>
      <PageIntro item={page} locale={l} />
      <section className="container contact-layout">
        <div className="contact-details">
          <span className="eyebrow">GOOD THINGS START WITH HELLO</span>
          <h2>{text(l, "คุยกับทีมโดยตรง", "Talk to our team.")}</h2>
          <a href={`tel:${String(c.phone).replace(/\s/g, "")}`}>
            <Phone size={20} />
            <div>
              <small>{text(l, "โทรหาเรา", "CALL US")}</small>
              <strong>{c.phone}</strong>
            </div>
          </a>
          <a href={`mailto:${c.email}`}>
            <Mail size={20} />
            <div>
              <small>EMAIL</small>
              <strong>{c.email}</strong>
            </div>
          </a>
          <div className="contact-address">
            <MapPin size={20} />
            <div>
              <small>{text(l, "ทีมของเราอยู่ที่", "BASED IN")}</small>
              <strong>{c.address}</strong>
            </div>
          </div>
          <a
            className="text-link"
            href={String(c.facebook)}
            target="_blank"
            rel="noreferrer"
          >
            Facebook / Elite Flow Team <ArrowUpRight size={16} />
          </a>
          <div className="contact-photo">
            <Image
              src="/media/backstage.webp"
              fill
              sizes="400px"
              alt={text(
                l,
                "ทีมงานกำลังเตรียมรายละเอียด",
                "Preparing the details",
              )}
            />
          </div>
        </div>
        <ContactForm
          locale={l}
          services={services.map((s) => ({ slug: s.slug, title: s[l].title }))}
        />
      </section>
    </>
  );
}

export function WeddingFeature({ locale: l }: { locale: Locale }) {
  return (
    <section className="wedding-feature section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WEDDINGS / MOMENTS THAT MATTER</span>
            <h2>
              {text(
                l,
                "วันของคุณ\nให้ภาพเล่าความรู้สึก",
                "Your day.\nA feeling to remember.",
              )}
            </h2>
          </div>
          <div className="wedding-feature-intro">
            <p>
              {text(
                l,
                "จากช่วงเวลาของคู่บ่าวสาว ถึงรายละเอียดเบื้องหลัง เราใส่ใจทั้งความรู้สึกและจังหวะของวันสำคัญ",
                "From the moments you share to the details behind the scenes, we care for the feeling and the flow of your day.",
              )}
            </p>
            <Link
              className="text-link"
              href={`/${l}/services/weddings-private-events`}
            >
              {text(l, "สำรวจบริการงานแต่ง", "Explore weddings")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <PhotoGallery
          images={weddingPhotos.slice(0, 5)}
          title={text(l, "ช่วงเวลางานแต่ง", "Wedding moments")}
          locale={l}
          compact
        />
        <div className="wedding-feature-footer">
          <p>
            {text(
              l,
              "ภาพประสบการณ์ร่วมงานของทีม · ภาพคู่บ่าวสาว: Biestudio",
              "Our team’s collaborative experience · Couple photography: Biestudio",
            )}
          </p>
          <Link className="text-link" href={`/${l}/work/min-chat-wedding`}>
            {text(l, "เรื่องราวและเครดิตงาน", "The story & credits")}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
