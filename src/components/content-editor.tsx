"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Save, ArrowUpRight, ArrowLeft, ImagePlus, Eye } from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import MediaPicker from "./media-picker";
import dynamic from "next/dynamic";
import HomeSettings from "./home-settings";
const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
  loading: () => <p>กำลังเตรียมตัวแก้ไข…</p>,
});
const fixed = [
  "home",
  "about",
  "services",
  "work",
  "journal",
  "contact",
  "privacy",
];
const extraLabels: Record<string, string> = {
  storyTitle: "หัวข้อส่วนผลงานและความไว้วางใจ",
  storyLead: "ข้อความแนะนำประสบการณ์และบทบาทของทีม",
  storyDescription: "ข้อความก่อนลิงก์ไปหน้าผลงาน",
  workDescription: "คำบรรยายก่อนภาพผลงาน",
  servicesNarrative: "คำบรรยายแนวทางบริการ",
  clientsDetail: "คำบรรยายเพิ่มเติมส่วนลูกค้า",
  processDetail: "คำบรรยายเพิ่มเติมวิธีทำงาน",
  teamDetail: "คำบรรยายเพิ่มเติมทีมงาน",
  journalDescription: "คำบรรยายก่อนบทความ",
  ctaDescription: "คำบรรยายชวนติดต่อ",
  heroTitle: "หัวข้อเปิดหน้าแรก (ขึ้นบรรทัดใหม่เพื่อเน้นสีทอง)",
  heroCaption: "คำบรรยายภาพหลักหน้าแรก",
  heroSecondaryCaption: "คำบรรยายภาพรองหน้าแรก",
  heroLead: "ประเภทงานใต้หัวข้อหลัก",
  heroNote: "ข้อความใกล้ปุ่มติดต่อ",
  clientsDescription: "คำอธิบายส่วนลูกค้า",
  partnersDescription: "คำอธิบายส่วนพันธมิตร",
  clientsTitle: "หัวข้อส่วนลูกค้า",
  partnersTitle: "หัวข้อส่วนพันธมิตร",
  testimonialsTitle: "หัวข้อส่วนรีวิว",
  faqTitle: "หัวข้อคำถามที่พบบ่อย",
  faq1Question: "คำถามที่ 1",
  faq1Answer: "คำตอบที่ 1",
  faq2Question: "คำถามที่ 2",
  faq2Answer: "คำตอบที่ 2",
  faq3Question: "คำถามที่ 3",
  faq3Answer: "คำตอบที่ 3",
  client: "ลูกค้า / องค์กร (ระบุตามบทบาทจริง)",
  venue: "สถานที่ / จังหวัด",
  role: "บทบาทและขอบเขตของทีม",
  outcome: "ผลลัพธ์ที่ยืนยันได้",
  servicesTitle: "หัวข้อส่วนบริการ",
  workTitle: "หัวข้อส่วนผลงาน",
  processTitle: "หัวข้อขั้นตอนทำงาน",
  ctaTitle: "หัวข้อชวนติดต่อ",
  phone: "เบอร์โทรศัพท์",
  email: "อีเมล",
  address: "ที่อยู่",
  facebook: "ลิงก์ Facebook",
  servicesDescription: "คำอธิบายส่วนบริการ",
  processDescription: "คำอธิบายขั้นตอน",
  teamTitle: "หัวข้อส่วนทีมงาน",
  teamDescription: "คำอธิบายทีมงาน",
  journalTitle: "หัวข้อส่วนบทความ",
  step1Title: "ขั้นตอน 1 — หัวข้อ",
  step1Description: "ขั้นตอน 1 — คำอธิบาย",
  step2Title: "ขั้นตอน 2 — หัวข้อ",
  step2Description: "ขั้นตอน 2 — คำอธิบาย",
  step3Title: "ขั้นตอน 3 — หัวข้อ",
  step3Description: "ขั้นตอน 3 — คำอธิบาย",
  step4Title: "ขั้นตอน 4 — หัวข้อ",
  step4Description: "ขั้นตอน 4 — คำอธิบาย",
};
export default function ContentEditor({
  initial,
  services,
  items,
}: {
  initial: Content;
  services: Content[];
  items: Content[];
}) {
  const [value, setValue] = useState(initial),
    [locale, setLocale] = useState<Locale>("th"),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(false),
    [picker, setPicker] = useState<"cover" | "gallery" | null>(null),
    [preview, setPreview] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!preview) return;
    previewDialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [preview]);
  const [previewWidth, setPreviewWidth] = useState("100%");
  const [sourceMode, setSourceMode] = useState(false);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const [revisions, setRevisions] = useState<
    { version: number; savedAt: string; document: Content }[]
  >([]);
  const sendPreview = useCallback(
    () =>
      frame.current?.contentWindow?.postMessage(
        { type: "eliteflow-preview", content: value, locale },
        window.location.origin,
      ),
    [value, locale],
  );
  useEffect(() => {
    sendPreview();
  }, [sendPreview, preview]);
  useEffect(() => {
    const ready = (e: MessageEvent) => {
      if (
        e.origin === location.origin &&
        e.source === frame.current?.contentWindow &&
        e.data?.type === "eliteflow-preview-ready"
      )
        sendPreview();
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [sendPreview]);
  async function loadRevisions() {
    const r = await fetch(`/api/admin/content/${value.id}/revisions`);
    if (r.ok) setRevisions(await r.json());
    else {
      setError(true);
      setNotice("โหลดประวัติไม่สำเร็จ กรุณาลองใหม่");
    }
  }
  const closePicker = useCallback(() => setPicker(null), []);
  const update = (patch: Partial<Content>) => {
    setValue((v) => ({ ...v, ...patch }));
    setDirty(true);
    setNotice("");
  };
  const change = (key: string, v: string | string[]) =>
    update({ [locale]: { ...value[locale], [key]: v } });
  useEffect(() => {
    function before(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [dirty]);
  async function save() {
    setBusy(true);
    setError(false);
    try {
      const r = await fetch(`/api/admin/content/${value.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "บันทึกไม่สำเร็จ");
      setValue((v) => ({ ...v, version: d.version }));
      setDirty(false);
      setNotice("บันทึกเรียบร้อยแล้ว · เนื้อหาที่เผยแพร่จะแสดงบนเว็บไซต์ทันที");
    } catch (e) {
      setNotice((e as Error).message);
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const route =
    value.kind === "post"
      ? `journal/${value.slug}`
      : value.kind === "project"
        ? `work/${value.slug}`
        : value.kind === "service"
          ? `services/${value.slug}`
          : value.slug === "home"
            ? ""
            : fixed.includes(value.slug)
              ? value.slug
              : `pages/${value.slug}`;
  const isFixed = value.kind === "page" && fixed.includes(initial.slug);
  const richBody = !isFixed || ["about", "privacy"].includes(value.slug);
  const hasImage = !isFixed || ["home", "about"].includes(value.slug);
  const hasGallery = !isFixed || value.slug === "home";
  const hasItems = !isFixed || value.slug === "about";
  const c = value[locale];
  return (
    <>
      <div className="admin-heading">
        <div>
          <Link
            href="/admin/content"
            className="text-link"
            style={{ fontSize: 10, marginBottom: 12 }}
            onClick={(e) => {
              if (
                dirty &&
                !confirm(
                  "มีการแก้ไขที่ยังไม่บันทึก ต้องการออกจากหน้านี้หรือไม่?",
                )
              )
                e.preventDefault();
            }}
          >
            <ArrowLeft size={12} />
            เนื้อหาทั้งหมด
          </Link>
          <h1>{value.th.title || "เนื้อหาใหม่"}</h1>
          <p>
            {dirty
              ? "มีการแก้ไขที่ยังไม่บันทึก"
              : "เนื้อหาสองภาษา · แก้ไขได้โดยคงรูปแบบหน้าเว็บ"}
          </p>
        </div>
        <div className="editor-top">
          {value.status === "published" && (
            <Link
              className="button button-ghost button-small"
              href={`/${locale}/${route}`}
              target="_blank"
            >
              ดูหน้าเว็บ
              <ArrowUpRight size={14} />
            </Link>
          )}
          <button
            className="button button-small"
            onClick={save}
            disabled={busy}
          >
            <Save size={15} />
            {busy ? "กำลังบันทึก…" : "บันทึก"}
          </button>
        </div>
      </div>
      {notice && (
        <div
          className={`save-notice ${error ? "error" : ""}`}
          role={error ? "alert" : "status"}
        >
          {notice}
        </div>
      )}
      <div className="editor-layout">
        <section className="admin-panel">
          <div className="editor-tabs">
            <button
              className={locale === "th" ? "selected" : ""}
              onClick={() => setLocale("th")}
            >
              ภาษาไทย · TH
            </button>
            <button
              className={locale === "en" ? "selected" : ""}
              onClick={() => setLocale("en")}
            >
              English · EN
            </button>
            <button
              className={preview ? "selected" : ""}
              onClick={() => setPreview(!preview)}
            >
              <Eye size={13} /> ดูตัวอย่าง
            </button>
          </div>
          <div className="editor-fields">
            <label className="field-label">
              หัวข้อหลัก / Title
              <textarea
                rows={2}
                value={c.title}
                onChange={(e) => change("title", e.target.value)}
                style={{ minHeight: 70 }}
                maxLength={200}
              />
            </label>
            <label className="field-label">
              ข้อความเหนือหัวข้อ / Eyebrow
              <input
                value={c.eyebrow}
                onChange={(e) => change("eyebrow", e.target.value)}
                maxLength={120}
              />
            </label>
            <label className="field-label">
              หัวข้อรอง / Subtitle
              <input
                value={c.subtitle}
                onChange={(e) => change("subtitle", e.target.value)}
                maxLength={300}
              />
            </label>
            <label className="field-label">
              คำอธิบายสั้น / Description
              <textarea
                rows={3}
                value={c.description}
                onChange={(e) => change("description", e.target.value)}
                maxLength={2000}
              />
            </label>
            {Object.keys(extraLabels)
              .filter(
                (k) =>
                  k in c ||
                  (value.slug === "home" &&
                    ![
                      "phone",
                      "email",
                      "address",
                      "facebook",
                      "client",
                      "venue",
                      "role",
                      "outcome",
                    ].includes(k)) ||
                  (value.kind === "project" &&
                    ["client", "venue", "role", "outcome"].includes(k)),
              )
              .map((k) => (
                <label className="field-label" key={k}>
                  {extraLabels[k]}
                  <textarea
                    rows={2}
                    style={{ minHeight: 65 }}
                    value={String(c[k] || "")}
                    onChange={(e) => change(k, e.target.value)}
                  />
                </label>
              ))}
            {richBody && (
              <div className="field-label">
                <div className="editor-body-heading">
                  <span>เนื้อหา</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSourceMode(!sourceMode);
                      setEditorEpoch((n) => n + 1);
                    }}
                  >
                    {sourceMode ? "กลับสู่ตัวแก้ไขภาพ" : "แก้ไข Markdown"}
                  </button>
                </div>
                {sourceMode ? (
                  <textarea
                    rows={16}
                    value={c.body}
                    onChange={(e) => change("body", e.target.value)}
                    maxLength={60000}
                  />
                ) : (
                  <RichTextEditor
                    key={`${locale}-${editorEpoch}`}
                    value={c.body}
                    onChange={(body) => change("body", body)}
                  />
                )}
              </div>
            )}
            {value.slug === "home" && value.kind === "page" && (
              <HomeSettings
                value={value}
                items={items}
                locale={locale}
                update={update}
              />
            )}
            {hasItems && (
              <label className="field-label">
                รายการบริการ / จุดเด่น (หนึ่งรายการต่อบรรทัด)
                <textarea
                  rows={4}
                  value={c.items.join("\n")}
                  onChange={(e) => change("items", e.target.value.split("\n"))}
                />
              </label>
            )}
            <details>
              <summary>SEO — หัวข้อและคำอธิบายสำหรับการค้นหา</summary>
              <div className="editor-fields" style={{ marginTop: 15 }}>
                <label className="field-label">
                  SEO title
                  <input
                    value={c.seoTitle}
                    onChange={(e) => change("seoTitle", e.target.value)}
                    maxLength={200}
                  />
                </label>
                <label className="field-label">
                  SEO description
                  <textarea
                    rows={3}
                    value={c.seoDescription}
                    onChange={(e) => change("seoDescription", e.target.value)}
                    maxLength={500}
                  />
                </label>
              </div>
            </details>
          </div>
        </section>
        <aside className="editor-side">
          <section className="admin-panel">
            <h2>การเผยแพร่</h2>
            <label className="field-label">
              สถานะ
              <select
                value={value.status}
                disabled={isFixed}
                onChange={(e) =>
                  update({ status: e.target.value as Content["status"] })
                }
              >
                <option value="draft">ฉบับร่าง</option>
                <option value="published">เผยแพร่</option>
              </select>
            </label>
            <label className="field-label">
              URL slug
              <input
                value={value.slug}
                disabled={isFixed}
                onChange={(e) => update({ slug: e.target.value })}
              />
              <span className="editor-help">
                ภาษาอังกฤษตัวเล็ก ใช้ - แทนช่องว่าง
              </span>
            </label>
            <label className="field-label">
              วันที่
              <input
                type="date"
                value={value.date}
                onChange={(e) => update({ date: e.target.value })}
              />
            </label>
            <label className="field-label">
              ลำดับ
              <input
                type="number"
                min={0}
                max={9999}
                value={value.sortOrder}
                onChange={(e) => update({ sortOrder: Number(e.target.value) })}
              />
            </label>
            {value.kind === "project" ? (
              <label className="field-label">
                หมวดบริการ
                <select
                  value={value.category}
                  onChange={(e) => update({ category: e.target.value })}
                >
                  <option value="">ไม่ระบุ</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.th.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="field-label">
                หมวดหมู่
                <input
                  value={value.category}
                  onChange={(e) => update({ category: e.target.value })}
                />
              </label>
            )}
            <label className="check-label">
              <input
                type="checkbox"
                checked={value.featured}
                onChange={(e) => update({ featured: e.target.checked })}
              />
              แนะนำรายการนี้บนหน้าแรก
            </label>
          </section>
          <section className="admin-panel">
            <h2>ประวัติการแก้ไข</h2>
            <button type="button" onClick={loadRevisions}>
              โหลดประวัติ
            </button>
            <p className="editor-help">
              เลือกเวอร์ชันเพื่อเปิดในตัวแก้ไข แล้วตรวจและบันทึกอีกครั้ง
            </p>
            {revisions.map((r) => (
              <button
                type="button"
                className="revision-row"
                key={r.version}
                onClick={() => {
                  if (
                    dirty &&
                    !confirm("แทนที่การแก้ไขที่ยังไม่บันทึกด้วยเวอร์ชันนี้?")
                  )
                    return;
                  setValue({ ...r.document, version: value.version });
                  setDirty(true);
                  setNotice("");
                  setEditorEpoch((n) => n + 1);
                }}
              >
                เวอร์ชัน {r.version} · {r.savedAt}
              </button>
            ))}
          </section>
          {hasImage && (
            <section className="admin-panel">
              <h2>ภาพหลัก</h2>
              {value.image && (
                <div className="editor-cover">
                  <img src={value.image} alt="ภาพหลัก" />
                </div>
              )}
              <button
                className="button button-small button-ghost"
                onClick={() => setPicker("cover")}
              >
                <ImagePlus size={15} />
                เลือกรูปภาพ
              </button>
              {value.image && (
                <button
                  className="icon-button"
                  style={{ marginLeft: 8 }}
                  onClick={() => update({ image: "" })}
                  aria-label="ลบภาพหลัก"
                >
                  ×
                </button>
              )}
              <p className="editor-help">
                ระบบปรับภาพตามขนาดหน้าจอ เก็บไฟล์ต้นทางในคลัง
              </p>
            </section>
          )}
          {hasGallery && (
            <section className="admin-panel">
              <h2>{value.slug === "home" ? "ภาพประกอบหน้าแรก" : "แกลเลอรี"}</h2>
              {value.slug === "home" && (
                <p className="editor-help">
                  รูปที่ 1: ภาพรอง Hero · รูปที่ 2: ภาพทีมงาน · รูปที่ 3:
                  ภาพเบื้องหลังใน Hero
                </p>
              )}
              <div className="gallery-editor">
                {value.gallery.map((url, i) => (
                  <button
                    key={url}
                    onClick={() =>
                      update({
                        gallery: value.gallery.filter((_, n) => n !== i),
                      })
                    }
                    title="นำรูปออก"
                  >
                    <img src={url} alt={`Gallery ${i + 1}`} />
                    <span>×</span>
                  </button>
                ))}
              </div>
              <button
                className="button button-small button-ghost"
                style={{ marginTop: 15 }}
                onClick={() => setPicker("gallery")}
              >
                เพิ่มรูป
              </button>
            </section>
          )}
        </aside>
      </div>
      {preview && (
        <dialog
          ref={previewDialog}
          onCancel={() => setPreview(false)}
          className="preview-workspace"
          role="dialog"
          aria-modal="true"
          aria-label="ตัวอย่างหน้าเว็บ"
        >
          <div className="preview-controls">
            <strong>ตัวอย่างก่อนบันทึก · {locale.toUpperCase()}</strong>
            <div>
              {[
                ["100%", "Desktop"],
                ["834px", "Tablet"],
                ["390px", "Mobile"],
              ].map(([width, label]) => (
                <button
                  type="button"
                  key={label}
                  aria-pressed={previewWidth === width}
                  onClick={() => setPreviewWidth(width)}
                >
                  {label}
                </button>
              ))}
              <button type="button" autoFocus onClick={() => setPreview(false)}>
                ปิดตัวอย่าง
              </button>
            </div>
          </div>
          <div className="preview-canvas">
            <iframe
              ref={frame}
              title="ตัวอย่างหน้าเว็บ"
              src="/admin/preview"
              onLoad={sendPreview}
              style={{ width: previewWidth }}
            />
          </div>
        </dialog>
      )}
      {picker && (
        <MediaPicker
          onClose={closePicker}
          onSelect={(url) => {
            if (picker === "cover") update({ image: url });
            else if (!value.gallery.includes(url))
              update({ gallery: [...value.gallery, url] });
            setPicker(null);
          }}
        />
      )}
    </>
  );
}
