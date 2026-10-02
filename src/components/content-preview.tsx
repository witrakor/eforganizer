"use client";
import { useEffect, useState } from "react";
import type { Content, Locale } from "@/lib/types";
import { Footer } from "./site";
import ContentBody from "./content-body";
import Header from "./site-header";
export default function ContentPreview({ items }: { items: Content[] }) {
  const [draft, setDraft] = useState<Content | null>(null);
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
    try {
      const saved = sessionStorage.getItem("eliteflow-preview");
      if (saved) {
        const payload = JSON.parse(saved);
        if (payload.content?.id && ["th", "en"].includes(payload.locale)) {
          setDraft(payload.content);
          setLocale(payload.locale);
        }
      }
    } catch {
      /* The ready handshake is also available without storage. */
    }
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
  return (
    <>
      <Header locale={locale} />
      <main>
        <ContentBody
          page={draft}
          locale={locale}
          services={services}
          projects={projects}
          posts={posts}
          preview
        />
      </main>
      {contact && <Footer locale={locale} contact={contact} />}
    </>
  );
}
