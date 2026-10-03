"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { adminContentHref } from "@/lib/admin-content-url";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowUpRight,
  ArrowLeft,
  ImagePlus,
  Eye,
  Trash2,
} from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import { useAdminGuard } from "./admin-guard";
import { contentName, homeGroups, isSystemPage } from "@/lib/admin-content";
import AdminDialog from "./admin-dialog";
import { serviceCover } from "@/lib/service-catalog";
import { homeEditorDefaults } from "@/lib/home-editor-defaults";
import MediaPicker from "./media-picker";
import { changeContentCover, coverImageStyle } from "@/lib/content-images";
import dynamic from "next/dynamic";
import HomeSettings from "./home-settings";
import {
  homeSections,
  homeSectionState,
  homeSectionStateLabels,
  type HomeSection,
} from "@/lib/home-content";
import { contentEditorSections } from "@/lib/content-editor-sections";
import ContentSectionNav from "./content-section-nav";
import ContentLinkedItems from "./content-linked-items";
import { eventPhotos, teamPhotos } from "@/lib/event-photos";
import HomePageMap from "./home-page-map";
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
  heroSubtitle: "หัวข้อรองเปิดหน้า",
  heroDescription: "คำอธิบายเปิดหน้า",
  experienceTitle: "หัวข้อประสบการณ์",
  experienceDescription: "คำบรรยายประสบการณ์",
  clientSectionTitle: "หัวข้อส่วนลูกค้า",
  clientSectionDescription: "คำบรรยายส่วนลูกค้า",
  eyebrow: "ข้อความเหนือหัวข้อ",
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
  siteUrl = "",
  services,
  items,
}: {
  initial: Content;
  siteUrl?: string;
  services: Content[];
  items: Content[];
}) {
  const [value, setValue] = useState(initial),
    [locale, setLocale] = useState<Locale>("th"),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(false),
    [picker, setPicker] = useState<"cover" | "gallery" | "team" | null>(null),
    [preview, setPreview] = useState(false);
  const { setDirty: setGuardDirty } = useAdminGuard();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [authExpired, setAuthExpired] = useState(false);
  const [contentGroup, setContentGroup] = useState("intro");
  const [homeGroup, setHomeGroup] = useState("hero");
  const isHome = value.kind === "page" && value.slug === "home";
  const activeGroup = homeGroups.find((g) => g.id === homeGroup)!;
  const [recovered, setRecovered] = useState<Content | null>(null);
  const latest = useRef(value);
  latest.current = value;
  useEffect(() => {
    setGuardDirty(dirty);
    return () => setGuardDirty(false);
  }, [dirty, setGuardDirty]);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`eliteflow-draft:${initial.id}`);
      if (saved) {
        const draft = JSON.parse(saved) as Content;
        if (
          draft.id === initial.id &&
          JSON.stringify(draft) !== JSON.stringify(initial)
        )
          setRecovered(draft);
      }
    } catch {
      /* Storage can be unavailable in private sessions. */
    }
  }, [initial]);
  useEffect(() => {
    if (!dirty) return;
    try {
      sessionStorage.setItem(
        `eliteflow-draft:${value.id}`,
        JSON.stringify(value),
      );
    } catch {
      /* Navigation guard remains active when storage is full. */
    }
  }, [value, dirty]);
  const frame = useRef<HTMLIFrameElement>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!preview) return;
    previewDialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      try {
        sessionStorage.removeItem("eliteflow-preview");
      } catch {}
    };
  }, [preview]);
  const [previewWidth, setPreviewWidth] = useState("1440px");
  const [sourceMode, setSourceMode] = useState(false);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const [revisions, setRevisions] = useState<
    { version: number; savedAt: string; document: Content }[]
  >([]);
  const sendPreview = useCallback(() => {
    const payload = { type: "eliteflow-preview", content: value, locale };
    // The iframe may hydrate after its load event. Keep an initial snapshot
    // available until its ready handshake can receive live updates.
    if (frame.current) {
      try {
        sessionStorage.setItem("eliteflow-preview", JSON.stringify(payload));
      } catch {}
      frame.current.contentWindow?.postMessage(payload, window.location.origin);
    }
  }, [value, locale]);
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
  async function save() {
    if (busy || deleting) return;
    const submitted = value;
    setBusy(true);
    setError(false);
    setAuthExpired(false);
    try {
      const r = await fetch(`/api/admin/content/${value.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (r.status === 401 || r.status === 403) {
        setAuthExpired(true);
        throw Error(
          "เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง แล้วกลับมากดบันทึก งานที่แก้ไขยังอยู่ในหน้านี้",
        );
      }
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "บันทึกไม่สำเร็จ");
      setValue((v) => ({ ...v, version: d.version }));
      const changedDuringSave = latest.current !== submitted;
      setDirty(changedDuringSave);
      // Update the address after a slug change without discarding newer edits.
      window.history.replaceState(
        window.history.state,
        "",
        adminContentHref(submitted),
      );
      if (!changedDuringSave) {
        try {
          sessionStorage.removeItem(`eliteflow-draft:${value.id}`);
        } catch {}
      }
      setNotice(
        changedDuringSave
          ? "บันทึกแล้ว · ยังมีการแก้ไขใหม่ที่ยังไม่บันทึก"
          : value.status === "published"
            ? "อัปเดตเว็บไซต์เรียบร้อยแล้ว"
            : "บันทึกฉบับร่างแล้ว · ยังไม่แสดงบนเว็บไซต์",
      );
    } catch (e) {
      setNotice((e as Error).message);
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  async function removeContent() {
    if (busy || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch(`/api/admin/content/${initial.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: value.version }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "ลบเนื้อหาไม่สำเร็จ กรุณาลองใหม่");
      setDirty(false);
      setGuardDirty(false);
      try {
        sessionStorage.removeItem(`eliteflow-draft:${initial.id}`);
      } catch {}
      setConfirmDelete(false);
      router.replace("/admin/content");
      router.refresh();
    } catch (error) {
      setDeleteError((error as Error).message);
      setDeleting(false);
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
  const editorSections = contentEditorSections(value);
  const activeContentSection =
    editorSections.find((section) => section.id === contentGroup) ||
    editorSections[0];
  const activeContentGroup = activeContentSection.id;
  const richBody = !isHome && activeContentGroup === "body";
  const hasImage = !isHome && activeContentGroup === "cover";
  const hasGallery = !isHome && activeContentGroup === "gallery";
  const hasItems = !isHome && activeContentGroup === "items";
  const displayCover =
    value.kind === "service" && !value.coverOverride
      ? serviceCover(value.slug) || value.image
      : value.image;
  const publicPath = `/${locale}${route ? `/${route}` : ""}`;
  const publicUrl = `${siteUrl.replace(/\/+$/, "")}${publicPath}`;
  const c = value[locale];
  return (
    <>
      <div className="admin-heading editor-heading">
        <div>
          <Link
            href="/admin/content"
            className="text-link"
            style={{ marginBottom: 8 }}
          >
            <ArrowLeft size={12} />
            เนื้อหาทั้งหมด
          </Link>
          <h1>{contentName(value)}</h1>
          <div className="editor-public-url">
            <span>URL หน้าเว็บ</span>
            {value.status === "published" ? (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                {publicUrl}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ) : (
              <span className="editor-url-draft">
                {publicUrl} · ฉบับร่าง ยังไม่เผยแพร่
              </span>
            )}
          </div>
          <p>
            {dirty
              ? "มีการแก้ไขที่ยังไม่บันทึก"
              : "เนื้อหาสองภาษา · แก้ไขได้โดยคงรูปแบบหน้าเว็บ"}
          </p>
        </div>
        <div className="editor-top">
          {!isSystemPage(initial) && (
            <button
              type="button"
              className="button button-small content-delete-button"
              disabled={busy || deleting}
              onClick={() => {
                setDeleteError("");
                setConfirmDelete(true);
              }}
            >
              <Trash2 size={15} aria-hidden="true" />
              ลบเนื้อหา
            </button>
          )}
          {value.status === "published" && (
            <Link
              className="button button-ghost button-small"
              href={publicPath}
              target="_blank"
            >
              ดูหน้าเว็บ
              <ArrowUpRight size={14} />
            </Link>
          )}
          <button
            className="button button-small"
            onClick={save}
            disabled={busy || deleting}
          >
            <Save size={15} />
            {busy
              ? "กำลังบันทึก…"
              : value.status === "published"
                ? "บันทึกและอัปเดตเว็บ"
                : "บันทึกฉบับร่าง"}
          </button>
        </div>
      </div>
      {confirmDelete && (
        <AdminDialog
          label="ยืนยันการลบเนื้อหา"
          className="content-delete-dialog"
          onClose={() => {
            if (!deleting) setConfirmDelete(false);
          }}
        >
          <h2>ลบเนื้อหานี้?</h2>
          <p>
            <strong>{contentName(value)}</strong>
          </p>
          <p>
            เนื้อหาทั้งภาษาไทยและอังกฤษจะถูกนำออกจากรายการและหน้าเว็บไซต์
            รูปภาพในคลังจะยังอยู่
          </p>
          {dirty && <p>การแก้ไขที่ยังไม่บันทึกในหน้านี้จะถูกยกเลิกด้วย</p>}
          {deleteError && (
            <p className="content-delete-error" role="alert">
              {deleteError}
            </p>
          )}
          <div className="content-delete-actions">
            <button
              type="button"
              className="button button-ghost"
              autoFocus
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="button content-delete-button"
              disabled={deleting}
              onClick={removeContent}
            >
              <Trash2 size={15} aria-hidden="true" />
              {deleting ? "กำลังลบ…" : "ยืนยันลบเนื้อหา"}
            </button>
          </div>
        </AdminDialog>
      )}
      {notice && (
        <div
          className={`save-notice ${error ? "error" : ""}`}
          role={error ? "alert" : "status"}
        >
          {notice}
          {authExpired && (
            <Link className="text-link" href="/admin/login" target="_blank">
              เข้าสู่ระบบในแท็บใหม่ ↗
            </Link>
          )}
        </div>
      )}
      {recovered && (
        <div className="draft-recovery" role="status">
          <strong>พบงานที่ยังไม่ได้บันทึกในแท็บนี้</strong>
          <p>
            {recovered.version !== initial.version
              ? "เว็บไซต์มีเวอร์ชันใหม่แล้ว กรุณาตรวจเทียบก่อนบันทึกงานที่กู้คืน"
              : "คุณสามารถกลับมาแก้ไขต่อจากครั้งล่าสุดได้"}
          </p>
          <button
            onClick={() => {
              setValue({ ...recovered, version: initial.version });
              setDirty(true);
              setRecovered(null);
              setEditorEpoch((n) => n + 1);
            }}
          >
            กู้คืนการแก้ไข
          </button>
          <button
            onClick={() => {
              setRecovered(null);
              try {
                sessionStorage.removeItem(`eliteflow-draft:${initial.id}`);
              } catch {}
            }}
          >
            ทิ้งงานที่ค้างไว้
          </button>
        </div>
      )}
      <div className="editor-layout content-management-editor">
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
          {isHome && (
            <HomePageMap
              value={value}
              locale={locale}
              selected={homeGroup}
              onSelect={(id) => {
                setHomeGroup(id);
                requestAnimationFrame(() =>
                  document
                    .querySelector(".editor-section-heading")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            />
          )}
          {!isHome && (
            <ContentSectionNav
              sections={editorSections}
              selected={activeContentGroup}
              onSelect={(id) => {
                setContentGroup(id);
                requestAnimationFrame(() =>
                  document
                    .querySelector(".editor-section-heading")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            />
          )}
          <div className="editor-fields">
            {!isHome && (
              <div className="editor-section-heading">
                <h2>{activeContentSection.label}</h2>
                <p>{activeContentSection.description}</p>
              </div>
            )}
            {!isHome && activeContentSection.listKind && (
              <ContentLinkedItems
                key={activeContentGroup}
                serviceDirectory={
                  value.kind === "page" && value.slug === "services"
                }
                locale={locale}
                items={items.filter(
                  (item) =>
                    item.kind === activeContentSection.listKind &&
                    (activeContentGroup !== "related" ||
                      item.category === value.slug),
                )}
              />
            )}

            {isHome && (
              <div className="editor-section-heading">
                <h2>{activeGroup.label}</h2>
                {homeSections.includes(homeGroup as HomeSection) &&
                  homeSectionState(value, homeGroup as HomeSection, locale) !==
                    "visible" && (
                    <p role="status" className="home-section-status">
                      ส่วนนี้ยังไม่แสดงบนหน้าแรก:{" "}
                      {
                        homeSectionStateLabels[
                          homeSectionState(
                            value,
                            homeGroup as HomeSection,
                            locale,
                          )
                        ]
                      }
                      {homeSectionState(
                        value,
                        homeGroup as HomeSection,
                        locale,
                      ) === "hidden"
                        ? " · เปิดได้ที่จัดลำดับ / ซ่อนส่วนของหน้า"
                        : " · เพิ่มรายการ กรอกชื่อ และเลือกแสดงบนเว็บก่อนบันทึก"}
                    </p>
                  )}
                <p>
                  แก้ไขภาษา {locale === "th" ? "ไทย" : "อังกฤษ"}{" "}
                  แล้วกดดูตัวอย่างก่อนบันทึก
                </p>
              </div>
            )}
            {((!isHome && activeContentGroup === "intro") ||
              (isHome && homeGroup === "seo")) && (
              <>
                <label className="field-label">
                  {isHome
                    ? "ชื่อหน้า / Title สำหรับข้อมูลหน้าเว็บ"
                    : "หัวข้อหลัก / Title"}
                  <textarea
                    rows={2}
                    value={c.title}
                    onChange={(e) => change("title", e.target.value)}
                    className="editor-title-input"
                    maxLength={200}
                  />
                </label>
                {!isHome && (
                  <>
                    {value.kind !== "service" && (
                      <label className="field-label">
                        ข้อความเหนือหัวข้อ / Eyebrow
                        <input
                          value={c.eyebrow}
                          onChange={(e) => change("eyebrow", e.target.value)}
                          maxLength={120}
                        />
                      </label>
                    )}
                    {(value.kind === "service" || value.kind === "project") && (
                      <label className="field-label">
                        หัวข้อรอง / Subtitle
                        <input
                          value={c.subtitle}
                          onChange={(e) => change("subtitle", e.target.value)}
                          maxLength={300}
                        />
                      </label>
                    )}
                  </>
                )}
                <label className="field-label">
                  คำอธิบายสั้น / Description
                  <textarea
                    rows={3}
                    value={c.description}
                    onChange={(e) => change("description", e.target.value)}
                    maxLength={2000}
                  />
                </label>
              </>
            )}
            {(isHome ? activeGroup.keys : activeContentSection.keys || []).map(
              (k) => (
                <label className="field-label" key={k}>
                  {extraLabels[k]}
                  <textarea
                    rows={
                      k.includes("Description") || k.includes("Detail") ? 3 : 2
                    }
                    style={{ minHeight: 65 }}
                    value={String(
                      c[k] ||
                        (isHome ? homeEditorDefaults[k]?.[locale] : "") ||
                        "",
                    )}
                    onChange={(e) => change(k, e.target.value)}
                  />
                </label>
              ),
            )}
            {isHome && homeGroup === "team" && (
              <div className="field-label">
                ภาพทีมงาน
                <img
                  className="home-team-editor-image"
                  src={value.gallery[1] || "/media/team.webp"}
                  alt="ภาพทีมงานบนหน้าแรก"
                />
                <button
                  className="button button-small button-ghost"
                  onClick={() => setPicker("team")}
                >
                  เปลี่ยนภาพทีมงาน
                </button>
              </div>
            )}
            {!isHome && activeContentGroup === "sources" && (
              <details className="project-facts" open>
                <summary>วันที่จัดงานและที่มาข้อมูล</summary>
                <div className="editor-fields">
                  {(value.kind === "project" || value.kind === "post") && (
                    <label className="editor-date-visibility">
                      <input
                        type="checkbox"
                        checked={Boolean(value.hidePublicDate)}
                        onChange={(e) =>
                          update({
                            hidePublicDate: e.target.checked,
                            ...(value.kind === "project" && e.target.checked
                              ? { eventDate: undefined, eventDateEnd: undefined }
                              : {}),
                          })
                        }
                      />
                      <span>ไม่แสดงวันที่บนหน้าเว็บ</span>
                    </label>
                  )}
                  {value.kind === "project" && value.eventDateStatus && !value.eventDate && (
                    <div className="editor-date-review-status" role="status">
                      <strong>
                        {value.eventDateStatus === "conflict"
                          ? "วันที่จัดงานขัดแย้งกัน"
                          : "ยังไม่มีวันที่จัดงานที่ยืนยันได้"}
                      </strong>
                    </div>
                  )}
                  <label className="field-label">
                    วันที่เริ่มงาน
                    <input
                      type="date"
                      value={value.eventDate || ""}
                      disabled={Boolean(value.hidePublicDate)}
                      onChange={(e) =>
                        update({
                          eventDate: e.target.value || undefined,
                          hidePublicDate: false,
                          eventDateStatus: e.target.value
                            ? undefined
                            : value.eventDateStatus,
                        })
                      }
                    />
                  </label>
                  {value.kind === "project" && (
                    <label className="field-label">
                      บันทึกการตรวจสอบวันที่
                      <textarea
                        value={value.eventDateReviewNote || ""}
                        maxLength={1000}
                        onChange={(e) =>
                          update({ eventDateReviewNote: e.target.value || undefined })
                        }
                      />
                    </label>
                  )}
                  <label className="field-label">
                    วันที่สิ้นสุดงาน (ถ้ามี)
                    <input
                      type="date"
                      value={value.eventDateEnd || ""}
                      min={value.eventDate}
                      onChange={(e) =>
                        update({ eventDateEnd: e.target.value || undefined })
                      }
                    />
                  </label>
                  {(value.sources || []).map((source, index) => (
                    <fieldset className="source-fields" key={index}>
                      <legend>แหล่งข้อมูล {index + 1}</legend>
                      <label className="field-label">
                        ชื่อแหล่งข้อมูล
                        <input
                          value={source.label}
                          maxLength={200}
                          onChange={(e) =>
                            update({
                              sources: value.sources!.map((s, i) =>
                                i === index
                                  ? { ...s, label: e.target.value }
                                  : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="field-label">
                        ลิงก์ต้นฉบับ (https://)
                        <input
                          type="url"
                          value={source.url}
                          onChange={(e) =>
                            update({
                              sources: value.sources!.map((s, i) =>
                                i === index ? { ...s, url: e.target.value } : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="field-label">
                        วันที่เผยแพร่ต้นฉบับ
                        <input
                          type="date"
                          value={source.publishedAt}
                          onChange={(e) =>
                            update({
                              sources: value.sources!.map((s, i) =>
                                i === index
                                  ? { ...s, publishedAt: e.target.value }
                                  : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          update({
                            sources: value.sources!.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        นำแหล่งข้อมูล {index + 1} ออก
                      </button>
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className="button button-small button-ghost"
                    disabled={(value.sources?.length || 0) >= 30}
                    onClick={() =>
                      update({
                        sources: [
                          ...(value.sources || []),
                          { url: "", label: "", publishedAt: value.date },
                        ],
                      })
                    }
                  >
                    เพิ่มแหล่งข้อมูล
                  </button>
                </div>
              </details>
            )}
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
            {isHome &&
              [
                "hero",
                "clients",
                "partners",
                "testimonials",
                "work",
                "journal",
                "layout",
              ].includes(homeGroup) && (
                <HomeSettings
                  key={homeGroup}
                  section={
                    homeGroup === "work" || homeGroup === "journal"
                      ? "selections"
                      : (homeGroup as
                          | "hero"
                          | "clients"
                          | "partners"
                          | "testimonials"
                          | "layout")
                  }
                  selectionKind={homeGroup === "journal" ? "post" : "project"}
                  value={value}
                  items={items}
                  locale={locale}
                  update={update}
                />
              )}
            {hasItems && (
              <label className="field-label">
                {value.kind === "service"
                  ? "ขอบเขตบริการ"
                  : value.kind === "project"
                    ? "สิ่งที่ทีมดูแล"
                    : value.kind === "post"
                      ? "ประเด็นสำคัญ"
                      : "แนวทางทำงาน"}{" "}
                (หนึ่งรายการต่อบรรทัด)
                <textarea
                  rows={4}
                  value={c.items.join("\n")}
                  onChange={(e) => change("items", e.target.value.split("\n"))}
                />
              </label>
            )}
            {hasImage && (
              <section className="content-media-panel">
                <p className="editor-help">
                  เลือกรูปจากคลัง แล้วปรับจุดโฟกัสเพื่อจัดตำแหน่งภาพในกรอบ
                </p>
                {displayCover && (
                  <div className="cover-focal-editor">
                    <div className="editor-cover">
                      <img
                        src={displayCover}
                        alt="ตัวอย่างการครอปภาพหลัก"
                        style={coverImageStyle(value)}
                      />
                    </div>
                    <div className="hero-editor-focus">
                      {(
                        [
                          { key: "x", label: "ซ้าย–ขวา" },
                          { key: "y", label: "บน–ล่าง" },
                        ] as const
                      ).map(({ key, label }) => (
                        <label key={key}>
                          จุดโฟกัส: {label} ({value.imageFocal?.[key] ?? 50}%)
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={value.imageFocal?.[key] ?? 50}
                            onChange={(e) =>
                              update({
                                imageFocal: {
                                  x: value.imageFocal?.x ?? 50,
                                  y: value.imageFocal?.y ?? 50,
                                  [key]: Number(e.target.value),
                                },
                              })
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => update({ imageFocal: { x: 50, y: 50 } })}
                    >
                      คืนจุดโฟกัสตรงกลาง
                    </button>
                    <p className="editor-help">
                      ตัวอย่างกรอบภาพหน้าผลงาน ·
                      ภาพจะครอปเต็มกรอบตามจุดโฟกัสที่เลือก
                      โดยไม่แก้ไขไฟล์ต้นฉบับ
                    </p>
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
                    onClick={() =>
                      update({
                        image: "",
                        imageFocal: undefined,
                        ...(value.kind === "service"
                          ? { coverOverride: false }
                          : {}),
                      })
                    }
                    aria-label={
                      value.kind === "service"
                        ? "ใช้ภาพคอนเซปต์เริ่มต้น"
                        : "ลบภาพหลัก"
                    }
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
              <section className="content-media-panel">
                <p className="editor-help">
                  เลือกไว้ {value.gallery.length} / 30 ภาพ ·
                  ใช้ลูกศรเพื่อจัดลำดับ
                </p>
                {value.slug === "home" && (
                  <p className="editor-help">
                    รูปที่ 2 ใช้ในส่วนทีมงาน ·
                    ภาพเปิดหน้าเลือกได้ในหมวดภาพเปิดหน้า
                  </p>
                )}
                {!value.gallery.length && (
                  <p className="editor-help">
                    ยังไม่ได้เลือกชุดภาพเอง
                    {value.slug === "about" || eventPhotos(value).length > 0
                      ? " · หน้าเว็บกำลังใช้ภาพชุดเริ่มต้นด้านล่าง"
                      : " · เพิ่มรูปจากคลังเพื่อแสดงแกลเลอรี"}
                  </p>
                )}
                {!value.gallery.length && (
                  <div className="home-choice-grid content-default-gallery">
                    {(value.slug === "about"
                      ? teamPhotos
                      : eventPhotos(value)
                    ).map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="ภาพเริ่มต้นที่แสดงบนเว็บ"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
                <div className="gallery-editor">
                  {value.gallery.map((url, i) => (
                    <div className="gallery-item" key={`${url}-${i}`}>
                      <img src={url} alt={`รูปที่ ${i + 1}`} loading="lazy" />
                      <div>
                        <button
                          type="button"
                          aria-label={`เลื่อนรูปที่ ${i + 1} ไปก่อนหน้า`}
                          disabled={i === 0}
                          onClick={() => {
                            const gallery = [...value.gallery];
                            [gallery[i - 1], gallery[i]] = [
                              gallery[i],
                              gallery[i - 1],
                            ];
                            update({ gallery });
                          }}
                        >
                          ←
                        </button>
                        <span>{i + 1}</span>
                        <button
                          type="button"
                          aria-label={`เลื่อนรูปที่ ${i + 1} ไปถัดไป`}
                          disabled={i === value.gallery.length - 1}
                          onClick={() => {
                            const gallery = [...value.gallery];
                            [gallery[i + 1], gallery[i]] = [
                              gallery[i],
                              gallery[i + 1],
                            ];
                            update({ gallery });
                          }}
                        >
                          →
                        </button>
                        <button
                          type="button"
                          aria-label={`นำรูปที่ ${i + 1} ออกจากแกลเลอรี`}
                          onClick={() =>
                            update({
                              gallery: value.gallery.filter((_, n) => n !== i),
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>
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

            {((!isHome && activeContentGroup === "seo") ||
              (isHome && homeGroup === "seo")) && (
              <details open>
                <summary>SEO — หัวข้อและคำอธิบายสำหรับการค้นหา</summary>
                <div className="editor-fields" style={{ marginTop: 15 }}>
                  <label className="field-label">
                    SEO title · {c.seoTitle.length}/200 ตัวอักษร
                    <input
                      value={c.seoTitle}
                      onChange={(e) => change("seoTitle", e.target.value)}
                      maxLength={200}
                    />
                  </label>
                  <label className="field-label">
                    SEO description · {c.seoDescription.length}/500 ตัวอักษร
                    <textarea
                      rows={3}
                      value={c.seoDescription}
                      onChange={(e) => change("seoDescription", e.target.value)}
                      maxLength={500}
                    />
                  </label>
                </div>
              </details>
            )}
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
            {!isFixed && (
              <>
                <div className="editor-publish-row">
                  <label className="field-label">
                    {value.kind === "project" ? "วันที่หลัก" : "วันที่เผยแพร่"}
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
                      onChange={(e) =>
                        update({ sortOrder: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>
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
              </>
            )}
          </section>
          <details className="admin-panel editor-history">
            <summary>ประวัติการแก้ไข</summary>
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
          </details>
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
                ["1440px", "Desktop"],
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
          content={!isHome && picker !== "team" ? value : undefined}
          excludedUrls={
            picker === "gallery" && !isHome
              ? [value.image, ...value.gallery]
              : []
          }
          onClose={closePicker}
          multiple={picker === "gallery"}
          maxSelection={30 - value.gallery.length}
          onSelectMany={(urls) => {
            update({
              gallery: [...new Set([...value.gallery, ...urls])]
                .filter((url) => isHome || url !== value.image)
                .slice(0, 30),
            });
            setPicker(null);
          }}
          onSelect={(url) => {
            if (picker === "cover") {
              try {
                update(
                  isHome
                    ? { image: url, coverOverride: true }
                    : changeContentCover(value, url),
                );
              } catch (error) {
                setNotice((error as Error).message);
                setError(true);
              }
            } else if (picker === "team") {
              const gallery = [...value.gallery];
              if (!gallery[0]) gallery[0] = value.image || url;
              gallery[1] = url;
              update({ gallery });
            } else if (!value.gallery.includes(url))
              update({ gallery: [...value.gallery, url] });
            setPicker(null);
          }}
        />
      )}
    </>
  );
}
