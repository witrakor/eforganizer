"use client";
import { adminContentHref } from "@/lib/admin-content-url";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "./admin-guard";
import { serviceMenuItems } from "@/lib/service-catalog";
import { EventSketch } from "./event-art";
import type { Content, Locale } from "@/lib/types";
export default function ContentLinkedItems({
  items,
  locale,
  serviceDirectory = false,
}: {
  items: Content[];
  locale: Locale;
  serviceDirectory?: boolean;
}) {
  const router = useRouter();
  const { confirmLeave } = useAdminGuard();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function startService(slug: string) {
    if (busy || !confirmLeave()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "service", templateSlug: slug }),
      });
      if (!response.ok) throw Error("เปิดแบบร่างไม่สำเร็จ กรุณาลองใหม่");
      const data = await response.json();
      router.push(data.href);
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }
  const [search, setSearch] = useState("");
  const filtered = items.filter((item) =>
    `${item.th.title} ${item.en.title}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().trim()),
  );
  const menu = serviceMenuItems(
    items.filter((item) => item.status === "published"),
  );
  const publicSlugs = new Set(menu.map((item) => item.slug));
  const matches = (item: { th: { title: string }; en: { title: string } }) =>
    `${item.th.title} ${item.en.title}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().trim());
  const visibleMenu = menu
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => matches(item));
  const drafts = filtered.filter(
    (item) => item.status === "draft" && !publicSlugs.has(item.slug),
  );
  return (
    <div>
      <label className="field-label">
        ค้นหารายการ
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {serviceDirectory ? (
        <>
          <p className="editor-help">
            {menu.length} บริการบนหน้าเว็บ · ชื่อ ไอคอน
            และลำดับตรงกับหน้าบริการทั้งหมด กดการ์ดเพื่อแก้ไข
          </p>
          <div className="editor-service-grid">
            {visibleMenu.map(({ item, index }) => {
              const stored = items.find((record) => record.slug === item.slug);
              const card = (
                <>
                  <span className="editor-service-number">
                    {String(index + 1).padStart(2, "0")}{" "}
                    <span aria-hidden="true">↗</span>
                  </span>
                  <span className="editor-service-art">
                    <EventSketch variant={item.sketch} />
                  </span>
                  <strong>{item[locale].title}</strong>
                  <span className="editor-service-examples">
                    {item[locale].examples}
                  </span>
                  <small>
                    {stored?.status === "published"
                      ? "เผยแพร่ · กดเพื่อแก้ไข"
                      : stored
                        ? "แสดงข้อมูลมาตรฐาน · มีฉบับร่างที่ยังไม่เผยแพร่"
                        : "ข้อมูลมาตรฐาน · กดเพื่อแก้ไข"}
                  </small>
                </>
              );
              return stored ? (
                <Link
                  className="editor-service-card"
                  key={item.slug}
                  href={adminContentHref(stored)}
                >
                  {card}
                </Link>
              ) : (
                <button
                  type="button"
                  className="editor-service-card"
                  key={item.slug}
                  disabled={busy}
                  onClick={() => startService(item.slug)}
                >
                  {card}
                </button>
              );
            })}
          </div>
          {!visibleMenu.length && (
            <p role="status">ไม่พบบริการที่ตรงกับเงื่อนไข</p>
          )}
          {!!drafts.length && (
            <details className="editor-service-drafts" open={!!search}>
              <summary>ฉบับร่างที่ยังไม่แสดงบนเว็บ ({drafts.length})</summary>
              <div className="home-choice-grid">
                {drafts.map((item) => (
                  <Link
                    className="home-choice-card"
                    key={item.id}
                    href={adminContentHref(item)}
                  >
                    <span>
                      <small>ฉบับร่าง</small>
                      <strong>
                        {item[locale].title || item.th.title || "ยังไม่มีชื่อ"}
                      </strong>
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          )}
          <p className="editor-help">
            บริการมาตรฐานจะแสดงบนเว็บอยู่แล้ว
            เมื่อกดแก้ไขจะสร้างฉบับร่างให้บันทึกเผยแพร่
            รูปปกใช้ในหน้ารายละเอียดบริการ ส่วนการ์ดรายการใช้ไอคอนตามประเภทงาน
          </p>
        </>
      ) : (
        <>
          <p className="editor-help">
            {items.filter((item) => item.status === "published").length}{" "}
            รายการเผยแพร่ ·{" "}
            {items.filter((item) => item.status === "draft").length} ฉบับร่าง
          </p>
          <div className="home-choice-grid">
            {filtered.map((item) => (
              <Link
                className="home-choice-card"
                key={item.id}
                href={adminContentHref(item)}
              >
                {item.image ? (
                  <img src={item.image} alt="" loading="lazy" />
                ) : (
                  <span className="home-choice-placeholder">ไม่มีภาพปก</span>
                )}
                <span>
                  <small>
                    {item.status === "published"
                      ? "เผยแพร่"
                      : "ฉบับร่าง · ยังไม่แสดงบนเว็บ"}
                  </small>
                  <strong>
                    {item[locale].title || item.th.title || "ยังไม่มีชื่อ"}
                  </strong>
                </span>
              </Link>
            ))}
          </div>
          {!filtered.length && (
            <p role="status">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          )}
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <Link className="text-link" href="/admin/content">
        จัดการและเพิ่มเนื้อหา →
      </Link>
    </div>
  );
}
