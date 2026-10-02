"use client";
import { useEffect, useState } from "react";
import type { Content, Locale } from "@/lib/types";
import {
  Home,
  Detail,
  Footer,
  PageIntro,
  ServiceCards,
  JournalCards,
  Contact,
  CTA,
} from "./site";
import Header from "./site-header";
import WorkGrid from "./work-grid";
export default function ContentPreview({ items }: { items: Content[] }) {
  const [draft, setDraft] = useState<Content | null>(
    items.find((item) => item.kind === "page" && item.slug === "home") || null,
  );
  const [locale, setLocale] = useState<Locale>("th");
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        event.data?.type !== "eliteflow-preview"
      )
        return;
      if (event.data.content?.id && ["th", "en"].includes(event.data.locale)) {
        setDraft(event.data.content);
        setLocale(event.data.locale);
      }
    };
    const noNavigation = (e: MouseEvent) => {
      if ((e.target as Element).closest("a")) e.preventDefault();
    };
    window.addEventListener("message", receive);
    document.addEventListener("click", noNavigation, true);
    parent.postMessage({ type: "eliteflow-preview-ready" }, location.origin);
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("click", noNavigation, true);
    };
  }, []);
  if (!draft) return <p className="container section">กำลังเตรียมตัวอย่าง…</p>;
  const all = items.map((i) => (i.id === draft.id ? draft : i));
  if (!all.some((i) => i.id === draft.id)) all.push(draft);
  const services = all.filter(
    (i) => i.kind === "service" && i.status === "published",
  );
  const projects = all.filter(
    (i) => i.kind === "project" && i.status === "published",
  );
  const posts = all.filter(
    (i) => i.kind === "post" && i.status === "published",
  );
  const contact = all.find((i) => i.kind === "page" && i.slug === "contact");
  let body;
  if (
    draft.kind !== "page" ||
    !["home", "services", "work", "journal", "contact"].includes(draft.slug)
  )
    body = (
      <Detail
        item={draft}
        locale={locale}
        related={
          draft.kind === "service"
            ? projects.filter((p) => p.category === draft.slug)
            : []
        }
      />
    );
  else if (draft.slug === "home")
    body = (
      <Home
        preview
        page={draft}
        locale={locale}
        services={services}
        projects={projects}
        posts={posts}
      />
    );
  else if (draft.slug === "contact")
    body = (
      <div inert>
        <Contact page={draft} services={services} locale={locale} />
      </div>
    );
  else
    body = (
      <>
        <PageIntro item={draft} locale={locale} />
        <section className="container section-tight">
          {draft.slug === "services" ? (
            <ServiceCards services={services} locale={locale} />
          ) : draft.slug === "work" ? (
            <WorkGrid items={projects} services={services} locale={locale} />
          ) : (
            <JournalCards posts={posts} locale={locale} />
          )}
        </section>
        <CTA locale={locale} />
      </>
    );
  return (
    <>
      <Header locale={locale} />
      <main>{body}</main>
      {contact && <Footer locale={locale} contact={contact} />}
    </>
  );
}
