import Image from "next/image";
import HeroSlideshow from "./hero-slideshow";
import Link from "./site-link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import { heroSlides } from "@/lib/home-content";

const copy = (l: Locale, th: string, en: string) => (l === "th" ? th : en);

export function sketchVariant(slug: string) {
  return (
    (
      {
        "meetings-conferences": 0,
        "ceremonies-launches": 3,
        "corporate-celebrations": 4,
        "exhibitions-activations": 2,
        "weddings-private-events": 1,
        "special-events": 5,
        "professional-emcee": 8,
        "wedding-day-coordination": 9,
        "sports-events": 10,
      } as Record<string, number>
    )[slug] ?? 0
  );
}

/** Decorative vector sketches: photographs remain the evidence of real work. */
export function EventSketch({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {variant === 8 ? (
        <>
          <path d="M28 91h104M80 78v13M56 91h48M80 23c-12 0-20 9-20 21v12c0 12 8 21 20 21s20-9 20-21V44c0-12-8-21-20-21zM60 52h40M66 34h28M66 61h28M50 52c0 18 12 31 30 31s30-13 30-31M80 14v-6M36 32l-8-6M124 32l8-6M38 67l-11 5M122 67l11 5" />
        </>
      ) : variant === 9 ? (
        <>
          <path d="M43 19h74v78H43zM64 13h32v13H64zM56 45l5 5 9-10M76 46h27M56 65l5 5 9-10M76 66h27M56 85l5 5 9-10M76 86h27M28 97h104M24 29l5 5 5-5m92 0 5 5 5-5" />
        </>
      ) : variant === 10 ? (
        <>
          <path d="M17 92h126M24 100h112M27 84c18-10 36-10 54-1s36 9 54-1M73 19l7-7 7 7-7 7zM80 26v19M62 46l18-7 19 10M78 45 61 66l-18 4M78 45l12 24 21 9M61 66l-3 17m32-14-5 15M26 33h20m68 0h20M35 26v14m90-14v14" />
        </>
      ) : variant === 11 ? (
        <>
          <path d="M20 91h120M29 88V29h102v59M29 44h102M43 55h74v29H43zM50 84V62h60v22M80 62v22M22 22l7-8 7 8m88 0 7-8 7 8M70 35h20M47 96v6m66-6v6" />
        </>
      ) : variant === 7 ? (
        <>
          <path d="M19 91h122M32 91V25h96v66M32 39h96M42 29h76M48 51l6 7 7-7m38 0 6 7 7-7" />
          <circle cx="64" cy="67" r="5" />
          <circle cx="96" cy="67" r="5" />
          <path d="m64 72-9 9-11 1m20-10 10 8 13-1m-24 0-3 12m16-9 6 9m14-19-8 9-10 2m18-11 9 8 12-1m-24 2-3 10m17-9 6 9M18 16l5 5 5-5m104 0 5 5 5-5" />
        </>
      ) : variant === 6 ? (
        <>
          <path d="M23 88h114M36 88V37h88v51M45 47h70v31H45zM51 72l29-22 29 22M80 50v28M38 28h84M55 22h50M80 13v9M27 52l-9 8 9 8M133 52l9 8-9 8" />
          <path d="M51 88v8m58-8v8M20 23l4 5 6-2-3 6 4 5-7-1-4 5-1-7-6-2 6-3zM135 20v11m-5-5h10" />
        </>
      ) : variant === 3 ? (
        <>
          <path d="M23 94h114M40 91V53h33v38M35 53h43M52 48V34q0-10 11-10h7M70 20v8M93 88V30h29v58M89 88h37M90 29h35M23 15l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1zM104 11v10m-5-5h10M99 42h17m-17 9h17m-17 9h17M46 63h21" />
        </>
      ) : variant === 4 ? (
        <>
          <ellipse cx="80" cy="57" rx="46" ry="14" />
          <path d="M34 57v27q46 21 92 0V57M43 88v9m74-9v9M67 50V35m-8 0h16l-3 10h-10zM94 51V32m-8 0h16l-3 10h-10zM79 10v11m-5-5h10M21 33l5 6m-8 1 8-1M134 33l-5 6m8 1-8-1M16 65h10v29H16zM134 65h10v29h-10zM56 93v9m47-9v9" />
        </>
      ) : variant === 5 ? (
        <>
          <path d="M37 84h86v12H37zM57 83V72h46v11M63 69l-8-35 17 12 8-25 9 25 17-12-9 35zM65 60h30M25 19l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1zM128 30v14m-7-7h14M117 13l5 5m-9 1 5 5M28 55l-8 10m12 1-6 8" />
        </>
      ) : variant === 0 ? (
        <>
          <path d="M18 85V22h124v63M13 89h134M24 22l9 9 9-9 9 9 9-9 9 9 9-9 9 9 9-9 9 9 9-9 9 9 9-9" />
          <path d="M47 36h65v38H47zM68 81h24M80 74v7M25 38l-8 25h22zM134 38l-9 25h21z" />
          <path d="M55 49h48M64 57h30M36 93v9m-6 0v-6h12v6m38-9v9m-6 0v-6h12v6m38-9v9m-6 0v-6h12v6" />
        </>
      ) : variant === 1 ? (
        <>
          <path d="M35 91V49a45 45 0 0 1 90 0v42M44 91V49a36 36 0 0 1 72 0v42M24 94h112" />
          <path d="M32 48c-19-1-15-21-3-13-12-19 11-22 13-8 7-16 24-3 11 8M117 74c-18-2-14-20-3-13-9-18 12-19 13-7 10-13 22 1 9 8" />
          <circle cx="70" cy="66" r="13" />
          <circle cx="89" cy="66" r="13" />
          <path d="m76 44 4-6 5 6-5 6zM15 17v10m-5-5h10m115-8v10m-5-5h10" />
        </>
      ) : (
        <>
          <path d="M25 88h110M33 87V38h94v49M29 38l12-20h78l12 20zM43 48h32v25H43zM87 51h29m-29 8h23m-23 8h16M83 87V76h37v11" />
          <path d="M41 18v20m19-20v20m20-20v20m20-20v20m19-20v20M19 16l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1zM142 51v12m-6-6h12" />
        </>
      )}
    </svg>
  );
}

export function EventHero({
  locale: l,
  page,
  projects,
  posts,
}: {
  locale: Locale;
  page: Content;
  projects: Content[];
  posts: Content[];
}) {
  const c = page[l];
  const slides = heroSlides(page, [...projects, ...posts], l);
  const title = String(
    c.heroTitle ||
      copy(
        l,
        "ออแกไนซ์ รับจัดงาน\nทุกโอกาสสำคัญ",
        "Your event organizer.\nFor every occasion.",
      ),
  );
  const [first, ...rest] = title.split("\n");
  const wedding = projects.find(
    (p) => p.category === "weddings-private-events",
  );
  return (
    <section className="signature-hero">
      <div className="container">
        <div className="signature-intro">
          <div>
            <span className="eyebrow">
              {c.eyebrow || "ELITE FLOW · EVENT ORGANIZER"}
            </span>
            <h1>
              {first}
              {rest.length > 0 && (
                <>
                  <br />
                  <em>{rest.join(" ")}</em>
                </>
              )}
            </h1>
          </div>
          <div className="signature-description">
            <p className="signature-lead">
              {copy(
                l,
                "วางแผนอย่างเข้าใจ ดูแลอย่างใส่ใจ",
                "Thoughtfully planned. Personally cared for.",
              )}
            </p>
            <p>
              {copy(
                l,
                "รับจัดงานองค์กร งานแต่ง และกิจกรรมพิเศษ ตั้งแต่การวางแผน ประสานงาน ไปจนถึงดูแลหน้างาน ด้วยขอบเขตที่ชัดเจนร่วมกัน",
                "Corporate events, weddings and special occasions. From planning and coordination to on-site care, with a scope shaped around your event.",
              )}
            </p>
            <div className="signature-actions">
              <Link className="button" href={`/${l}/contact`}>
                {copy(l, "ปรึกษาการจัดงาน", "Plan your event")}
                <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="#work">
                {copy(l, "ชมผลงาน", "Our work")}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
        {slides.length > 0 ? (
          <HeroSlideshow
            key={JSON.stringify(slides)}
            slides={slides}
            locale={l}
          />
        ) : (
          <div className="signature-photo">
            <Image
              src={
                page.gallery[0] ||
                wedding?.image ||
                page.image ||
                "/media/wedding-garden.webp"
              }
              fill
              preload
              sizes="(max-width: 700px) 100vw, (max-width: 1280px) 94vw, 1200px"
              alt={copy(
                l,
                "บรรยากาศวันสำคัญของคู่บ่าวสาว",
                "A couple’s special day",
              )}
            />
            <div className="signature-photo-caption">
              <span>THE ART OF A WELL-PLANNED MOMENT</span>
              <span>
                {copy(
                  l,
                  "ให้คุณอยู่กับช่วงเวลาสำคัญ",
                  "Be present in the moments that matter",
                )}
              </span>
            </div>
            <span className="signature-photo-mark" aria-hidden="true">
              ef.
            </span>
          </div>
        )}
        <div className="signature-footnote">
          <span>KHON KAEN & BEYOND</span>
          <span>
            {copy(
              l,
              "งานองค์กร · งานแต่ง · เวทีและกิจกรรมพิเศษ",
              "CORPORATE · WEDDINGS · SPECIAL EVENTS",
            )}
          </span>
          <a
            href="#work"
            aria-label={copy(l, "เลื่อนดูผลงาน", "Explore our work")}
          >
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
