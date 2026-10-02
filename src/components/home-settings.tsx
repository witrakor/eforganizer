"use client";
import { useState } from "react";
import type { Content, Locale } from "@/lib/types";
import {
  homeOrder,
  defaultHeroSelections,
  selectedContent,
  homeProjectImage,
  type HeroSelection,
  sectionLabels,
  type Relationship,
} from "@/lib/home-content";
import MediaPicker from "./media-picker";
export default function HomeSettings({
  value,
  items,
  locale,
  update,
}: {
  value: Content;
  items: Content[];
  locale: Locale;
  update: (patch: Partial<Content>) => void;
}) {
  const [logo, setLogo] = useState<string | null>(null);
  const slides = value.heroSlides ?? defaultHeroSelections(items);
  const sources = items.filter(
    (i) =>
      (i.kind === "project" || i.kind === "post") &&
      i.status === "published" &&
      Boolean(i.image || i.gallery.some(Boolean)),
  );
  const projects = sources.filter((i) => i.kind === "project");
  const workImages = new Set(
    selectedContent(value, "project", projects, 4).map(homeProjectImage),
  );
  const heroPhotosFor = (source: Content) =>
    [
      ...new Set([source.image, ...source.gallery].filter((src) => !!src)),
    ].filter((src) => !workImages.has(src));
  const heroSources = sources.filter(
    (source) => heroPhotosFor(source).length > 0,
  );
  const patchSlide = (index: number, patch: Partial<HeroSelection>) =>
    update({
      heroSlides: slides.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  const sections = homeOrder(value);
  const relationships = value.relationships || [];
  const patch = (id: string, data: Partial<Relationship>) =>
    update({
      relationships: relationships.map((r) =>
        r.id === id ? { ...r, ...data } : r,
      ),
    });
  const move = <T,>(list: T[], from: number, offset: number) => {
    const next = [...list];
    [next[from], next[from + offset]] = [next[from + offset], next[from]];
    return next;
  };
  return (
    <div className="home-settings">
      <details open>
        <summary>ภาพเปิดหน้า · ผลงานที่คัดเลือก</summary>
        <p className="editor-help">
          เลือกได้สูงสุด 6 ภาพจากผลงานหรือบทความที่เผยแพร่ ภาพแรกจะแสดงก่อนเสมอ
          จากนั้นเปลี่ยนทุก 7 วินาที
          ชื่อภาพที่มุมซ้ายล่างกดไปยังเนื้อหาต้นทางได้
          ภาพที่ใช้เป็นหน้าปกผลงานด้านล่างจะไม่แสดงใน Hero เพื่อไม่ให้ซ้ำกัน
        </p>
        {slides.map((slide, index) => {
          const contentId = slide.contentId ?? slide.projectId;
          const contentKind = slide.contentKind ?? "project";
          const source = sources.find(
            (item) => item.id === contentId && item.kind === contentKind,
          );
          const photos = source ? heroPhotosFor(source) : [];
          return (
            <fieldset key={`${contentId}-${index}`}>
              <legend>
                {index + 1}.{" "}
                {source?.[locale].title ||
                  "เนื้อหานี้ไม่ได้เผยแพร่ — จะไม่แสดงบนเว็บ"}
              </legend>
              <label className="field-label">
                เนื้อหาต้นทาง
                <select
                  value={source?.id || ""}
                  onChange={(e) => {
                    const nextSource = sources.find(
                      (item) => item.id === e.target.value,
                    );
                    if (!nextSource) return;
                    const nextImage = heroPhotosFor(nextSource)[0];
                    patchSlide(index, {
                      contentId: nextSource.id,
                      contentKind: nextSource.kind as "project" | "post",
                      projectId: undefined,
                      image: nextImage || "",
                    });
                  }}
                >
                  {!source && (
                    <option value="" disabled>
                      เลือกผลงานหรือบทความ…
                    </option>
                  )}
                  <optgroup label="ผลงาน">
                    {projects
                      .filter((project) => heroPhotosFor(project).length > 0)
                      .map((project) => (
                        <option value={project.id} key={project.id}>
                          {project[locale].title}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="บทความ">
                    {heroSources
                      .filter((item) => item.kind === "post")
                      .map((post) => (
                        <option value={post.id} key={post.id}>
                          {post[locale].title}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </label>
              <div className="hero-editor-previews">
                <figure>
                  <img
                    src={slide.image}
                    alt="ตัวอย่างบนเดสก์ท็อป"
                    style={{ objectPosition: `${slide.x}% ${slide.y}%` }}
                  />
                  <figcaption>เดสก์ท็อป</figcaption>
                </figure>
                <figure>
                  <img
                    src={slide.image}
                    alt="ตัวอย่างบนมือถือ"
                    style={{
                      objectPosition: `${slide.mobileX}% ${slide.mobileY}%`,
                    }}
                  />
                  <figcaption>มือถือ</figcaption>
                </figure>
              </div>
              <label className="field-label">
                {source?.kind === "post" ? "ภาพจากบทความนี้" : "ภาพจากผลงานนี้"}
                <select
                  value={slide.image}
                  onChange={(e) => patchSlide(index, { image: e.target.value })}
                >
                  {!photos.includes(slide.image) && (
                    <option value={slide.image}>
                      ภาพนี้ใช้ไม่ได้หรือซ้ำกับหน้าปกผลงาน — กรุณาเลือกใหม่
                    </option>
                  )}
                  {photos.map((src, i) => (
                    <option value={src} key={src}>
                      {i === 0 ? "ภาพปก" : `ภาพในเนื้อหา ${i}`}
                    </option>
                  ))}
                </select>
              </label>
              <div className="hero-editor-focus">
                {(
                  [
                    { key: "x", label: "เดสก์ท็อป: ซ้าย–ขวา" },
                    { key: "y", label: "เดสก์ท็อป: บน–ล่าง" },
                    { key: "mobileX", label: "มือถือ: ซ้าย–ขวา" },
                    { key: "mobileY", label: "มือถือ: บน–ล่าง" },
                  ] as const
                ).map(({ key, label }) => (
                  <label key={key}>
                    {label} ({slide[key]}%)
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slide[key]}
                      onChange={(e) =>
                        patchSlide(index, { [key]: Number(e.target.value) })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="editor-top">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={`เลื่อนภาพ ${index + 1} ขึ้น`}
                  onClick={() =>
                    update({ heroSlides: move(slides, index, -1) })
                  }
                >
                  ↑ เลื่อนขึ้น
                </button>
                <button
                  type="button"
                  disabled={index === slides.length - 1}
                  aria-label={`เลื่อนภาพ ${index + 1} ลง`}
                  onClick={() => update({ heroSlides: move(slides, index, 1) })}
                >
                  ↓ เลื่อนลง
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update({ heroSlides: slides.filter((_, i) => i !== index) })
                  }
                >
                  นำภาพออก
                </button>
              </div>
            </fieldset>
          );
        })}
        <label className="field-label">
          เพิ่มภาพจากผลงานหรือบทความ
          <select
            value=""
            disabled={slides.length >= 6}
            onChange={(e) => {
              const source = heroSources.find(
                (item) => item.id === e.target.value,
              );
              if (source)
                update({
                  heroSlides: [
                    ...slides,
                    {
                      contentId: source.id,
                      contentKind: source.kind as "project" | "post",
                      image: heroPhotosFor(source)[0] || "",
                      x: 50,
                      y: 50,
                      mobileX: 50,
                      mobileY: 50,
                    },
                  ],
                });
            }}
          >
            <option value="">เลือกผลงานหรือบทความ…</option>
            <optgroup label="ผลงาน">
              {heroSources
                .filter((source) => source.kind === "project")
                .map((project) => (
                  <option value={project.id} key={project.id}>
                    {project[locale].title}
                  </option>
                ))}
            </optgroup>
            <optgroup label="บทความ">
              {heroSources
                .filter((item) => item.kind === "post")
                .map((post) => (
                  <option value={post.id} key={post.id}>
                    {post[locale].title}
                  </option>
                ))}
            </optgroup>
          </select>
        </label>
        <p className="editor-help">
          นำภาพออกทั้งหมดเพื่อใช้ภาพนิ่งเดิม · ปรับจุดโฟกัสแล้วดู Preview
          ก่อนบันทึก
        </p>
        <button
          type="button"
          onClick={() => update({ heroSlides: defaultHeroSelections(items) })}
        >
          ใช้ชุดภาพแนะนำ
        </button>
      </details>
      <details open>
        <summary>จัดส่วนต่าง ๆ ของหน้าแรก</summary>
        <p className="editor-help">
          เรียงจากบนลงล่าง ใช้ปุ่มลูกศรหรือจับลาก ·
          ส่วนพันธมิตรจะแสดงบนเว็บเมื่อมีรายการที่เปิดใช้งาน หากยังไม่มีข้อมูล
          กด Preview เพื่อดูตัวอย่างการจัดวางได้
        </p>
        {sections.map((section, index) => (
          <div
            className="section-sort-row"
            key={section.id}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", String(index))
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const raw = e.dataTransfer.getData("text/plain");
              if (!/^\d+$/.test(raw)) return;
              const from = Number(raw);
              if (from >= sections.length) return;
              const list = [...sections];
              list.splice(index, 0, list.splice(from, 1)[0]);
              update({ sections: list });
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={section.enabled}
                onChange={(e) =>
                  update({
                    sections: sections.map((s) =>
                      s.id === section.id
                        ? { ...s, enabled: e.target.checked }
                        : s,
                    ),
                  })
                }
              />
              {sectionLabels[section.id]}
            </label>
            <div>
              <button
                type="button"
                disabled={!index}
                aria-label={`เลื่อน ${sectionLabels[section.id]} ขึ้น`}
                onClick={() => update({ sections: move(sections, index, -1) })}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === sections.length - 1}
                aria-label={`เลื่อน ${sectionLabels[section.id]} ลง`}
                onClick={() => update({ sections: move(sections, index, 1) })}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </details>
      <details>
        <summary>เลือกผลงานและบทความหน้าแรก</summary>
        <p className="editor-help">
          ถ้าไม่เลือก ระบบใช้รายการเด่นตามลำดับเดิม · หน้าแรกแสดงผลงานสูงสุด 4
          และบทความ 3 รายการ
        </p>
        {(["project", "post"] as const).map((kind) => {
          const ids = value.selections?.[kind] || [];
          return (
            <fieldset key={kind}>
              <legend>{{ project: "ผลงาน", post: "บทความ" }[kind]}</legend>
              {ids.map((id, index) => (
                <div className="section-sort-row" key={id}>
                  <span>
                    {items.find((i) => i.id === id)?.th.title ||
                      "รายการไม่พร้อมเผยแพร่"}
                  </span>
                  <div>
                    <button
                      type="button"
                      disabled={!index}
                      aria-label="เลื่อนรายการขึ้น"
                      onClick={() =>
                        update({
                          selections: {
                            ...value.selections,
                            [kind]: move(ids, index, -1),
                          },
                        })
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === ids.length - 1}
                      aria-label="เลื่อนรายการลง"
                      onClick={() =>
                        update({
                          selections: {
                            ...value.selections,
                            [kind]: move(ids, index, 1),
                          },
                        })
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label="นำรายการออกจากหน้าแรก"
                      onClick={() =>
                        update({
                          selections: {
                            ...value.selections,
                            [kind]: ids.filter((x) => x !== id),
                          },
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <select
                aria-label={`เพิ่ม${kind}หน้าแรก`}
                value=""
                onChange={(e) =>
                  update({
                    selections: {
                      ...value.selections,
                      [kind]: [...ids, e.target.value],
                    },
                  })
                }
              >
                <option value="">เลือกเพิ่ม…</option>
                {items
                  .filter(
                    (i) =>
                      i.kind === kind &&
                      !ids.includes(i.id) &&
                      i.status === "published",
                  )
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.th.title}
                    </option>
                  ))}
              </select>
            </fieldset>
          );
        })}
      </details>
      <details>
        <summary>พันธมิตรและรีวิว</summary>
        <p className="editor-help">
          เพิ่มเฉพาะความสัมพันธ์และคำรับรองจริง ·
          รายการใหม่จะยังไม่แสดงจนกว่าจะเลือก “แสดงบนเว็บ”
        </p>
        {relationships
          .filter((r) => r.kind !== "client")
          .map((r) => (
            <fieldset key={r.id}>
              <legend>
                {
                  {
                    client: "ลูกค้า",
                    partner: "พันธมิตร",
                    testimonial: "รีวิว",
                  }[r.kind]
                }
              </legend>
              <label className="field-label">
                ชื่อ ({locale.toUpperCase()})
                <input
                  value={r[locale].name}
                  onChange={(e) =>
                    patch(r.id, {
                      [locale]: { ...r[locale], name: e.target.value },
                    })
                  }
                />
              </label>
              <label className="field-label">
                {r.kind === "testimonial"
                  ? "คำรับรองจากลูกค้า"
                  : "บทบาท / ความสัมพันธ์"}
                <textarea
                  value={r[locale].detail}
                  onChange={(e) =>
                    patch(r.id, {
                      [locale]: { ...r[locale], detail: e.target.value },
                    })
                  }
                />
              </label>
              <label className="field-label">
                ลิงก์ผลงานหรือเว็บไซต์
                <input
                  value={r.href}
                  onChange={(e) => patch(r.id, { href: e.target.value })}
                />
              </label>
              {r.image && (
                <img
                  className="relationship-thumb"
                  src={r.image}
                  alt={r[locale].name}
                />
              )}
              <div className="editor-top">
                <button type="button" onClick={() => setLogo(r.id)}>
                  เลือกโลโก้ / รูป
                </button>
                {r.image && (
                  <button
                    type="button"
                    onClick={() => patch(r.id, { image: "" })}
                  >
                    นำรูปออก
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    update({
                      relationships: relationships.filter((x) => x.id !== r.id),
                    })
                  }
                >
                  ลบรายการ
                </button>
              </div>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={r.published}
                  onChange={(e) => patch(r.id, { published: e.target.checked })}
                />
                แสดงบนเว็บ
              </label>
            </fieldset>
          ))}
        <div className="editor-top">
          {(["partner", "testimonial"] as const).map((kind) => (
            <button
              type="button"
              key={kind}
              onClick={() =>
                update({
                  relationships: [
                    ...relationships,
                    {
                      id: crypto.randomUUID(),
                      kind,
                      image: "",
                      href: "",
                      published: false,
                      th: { name: "", detail: "" },
                      en: { name: "", detail: "" },
                    },
                  ],
                })
              }
            >
              ＋{" "}
              {
                { client: "ลูกค้า", partner: "พันธมิตร", testimonial: "รีวิว" }[
                  kind
                ]
              }
            </button>
          ))}
        </div>
      </details>
      {logo && (
        <MediaPicker
          onClose={() => setLogo(null)}
          onSelect={(url) => {
            patch(logo, { image: url });
            setLogo(null);
          }}
        />
      )}
    </div>
  );
}
