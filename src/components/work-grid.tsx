"use client";
import { coverImageStyle } from "@/lib/content-images";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const urlCategory = services.some((s) => s.slug === requested)
    ? requested
    : "all";
  const [category, setSelectedCategory] = useState(urlCategory);
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);
  function setCategory(value: string) {
    setSelectedCategory(value);
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
          type="button"
          aria-pressed={category === "all"}
          className={category === "all" ? "selected" : ""}
          onClick={() => setCategory("all")}
        >
          {l === "th" ? "ทั้งหมด" : "All work"}
        </button>
        {cats.map((c) => (
          <button
            type="button"
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
                  style={coverImageStyle(p)}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1023px) 50vw, (min-width: 1600px) 424px, 350px"
                  alt={p[l].title}
                />
                <span className="round-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <div className="project-caption">
                <div className="project-caption-meta">
                  <span className="eyebrow">{p[l].eyebrow}</span>
                  {!p.hidePublicDate && (
                    <time className="content-date" dateTime={p.eventDate || p.date}>
                      {contentDate(p.eventDate || p.date, l)}
                    </time>
                  )}
                </div>
                <h3>{p[l].title}</h3>
                {p[l].subtitle && (
                  <p className="project-caption-subtitle">{p[l].subtitle}</p>
                )}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
