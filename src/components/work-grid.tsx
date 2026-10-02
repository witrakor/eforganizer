"use client";
import { useSearchParams } from "next/navigation";
import Link from "./site-link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import { contentDate } from "@/lib/date";
export default function WorkGrid({
  items,
  services,
  locale: l,
}: {
  items: Content[];
  services: Content[];
  locale: Locale;
}) {
  const params = useSearchParams();
  const requested = params.get("category") || "all";
  const category = services.some((s) => s.slug === requested)
    ? requested
    : "all";
  function setCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", value);
    window.history.replaceState(window.history.state, "", url);
  }
  const cats = services.filter((s) => items.some((p) => p.category === s.slug));
  return (
    <>
      <div className="filters">
        <button
          aria-pressed={category === "all"}
          className={category === "all" ? "selected" : ""}
          onClick={() => setCategory("all")}
        >
          {l === "th" ? "ทั้งหมด" : "All work"}
        </button>
        {cats.map((c) => (
          <button
            key={c.id}
            aria-pressed={category === c.slug}
            className={category === c.slug ? "selected" : ""}
            onClick={() => setCategory(c.slug)}
          >
            {c[l].title}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {items
          .filter((p) => category === "all" || p.category === category)
          .map((p) => (
            <Link
              className="project-card"
              key={p.id}
              href={`/${l}/work/${p.slug}`}
            >
              <div className="project-photo">
                <Image
                  src={p.image}
                  fill
                  sizes="(max-width: 650px) 100vw, 50vw"
                  alt={p[l].title}
                />
                <span className="round-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <div className="project-caption">
                <div>
                  <span className="eyebrow">{p[l].eyebrow}</span>
                  <time className="content-date" dateTime={p.date}>
                    {contentDate(p.date, l)}
                  </time>
                  <h3>{p[l].title}</h3>
                </div>
                <span>{p[l].subtitle}</span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
