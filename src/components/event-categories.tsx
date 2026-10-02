import { ArrowUpRight } from "lucide-react";
import { EventSketch } from "./event-art";
import Link from "./site-link";
import type { Locale } from "@/lib/types";
import { serviceCategories, type ServiceMenuItem } from "@/lib/service-catalog";

export function EventCategories({
  locale,
  showHeading = true,
  items = serviceCategories,
}: {
  locale: Locale;
  showHeading?: boolean;
  items?: ServiceMenuItem[];
}) {
  return (
    <section
      className="event-categories"
      aria-label={
        showHeading
          ? undefined
          : locale === "th"
            ? "งานที่เรารับจัด"
            : "Events we organize"
      }
      aria-labelledby={showHeading ? "event-categories-title" : undefined}
    >
      <div className="container">
        {showHeading && (
          <div className="event-categories-heading">
            <div>
              <span className="eyebrow">EVENTS WE CREATE</span>
              <h2 id="event-categories-title">
                {locale === "th" ? "งานที่เรารับจัด" : "Events we organize"}
              </h2>
            </div>
            <p>
              {locale === "th"
                ? "งานสำหรับองค์กร แบรนด์ และทุกโอกาสสำคัญ ตั้งแต่วางแนวคิดจนถึงดูแลวันงาน"
                : "Events for organizations, brands and special occasions, from the first idea to the day itself."}
            </p>
          </div>
        )}
        <div className="event-categories-grid">
          {items.map((category, index) => (
            <Link
              className="event-category"
              href={`/${locale}/services/${category.slug}`}
              key={category.slug}
            >
              <span className="event-category-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
              <span className="event-category-art">
                <EventSketch variant={category.sketch} />
              </span>
              <span className="event-category-copy">
                <strong className="event-category-full">
                  {category[locale].title}
                </strong>
                <span className="event-category-full">
                  {locale === "th"
                    ? category.th.examples
                    : category.en.examples}
                </span>
              </span>
            </Link>
          ))}
        </div>
        {showHeading && (
          <div className="event-categories-footer">
            <p>
              {locale === "th"
                ? "มีผู้จัดงานแล้ว? เรายังมีทีมพิธีกร ทีมรันคิว และทีมประสานงานช่วยดูแลเฉพาะส่วนได้"
                : "Already have an organizer? Our emcee and coordination teams can support specific parts of your event."}
            </p>
            <Link href={`/${locale}/services`}>
              {locale === "th" ? "ดูบริการทั้งหมด" : "Explore all services"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
