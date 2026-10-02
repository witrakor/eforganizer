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
  homeSectionState,
  homeSectionStateLabels,
  type Relationship,
} from "@/lib/home-content";
import HomeContentPicker from "./home-content-picker";
import MediaPicker from "./media-picker";
export default function HomeSettings({
  value,
  items,
  locale,
  update,
  section,
  selectionKind,
}: {
  section?:
    "hero" | "layout" | "selections" | "clients" | "partners" | "testimonials";
  selectionKind?: "project" | "post";
  value: Content;
  items: Content[];
  locale: Locale;
  update: (patch: Partial<Content>) => void;
}) {
  const [picker, setPicker] = useState<
    number | "add" | "project" | "post" | null
  >(null);
  const [expanded, setExpanded] = useState<number | null>(null);
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
      {(!section || section === "hero") && (
        <details open>
          <summary>ภาพเปิดหน้า · ผลงานที่คัดเลือก</summary>
          <p className="editor-help">
            เลือกได้ 0–6 ภาพจากผลงานหรือบทความที่เผยแพร่ ภาพแรกจะแสดงก่อน
            บนเดสก์ท็อปเปลี่ยนทุก 7 วินาที มือถือปัดเปลี่ยนภาพได้
            ชื่อภาพที่มุมซ้ายล่างกดไปยังเนื้อหาต้นทางได้
            ภาพที่ใช้เป็นหน้าปกผลงานด้านล่างจะไม่แสดงใน Hero เพื่อไม่ให้ซ้ำกัน
          </p>
          <div className="editor-top">
            <strong role="status">เลือกไว้ {slides.length} / 6 ภาพ</strong>
            <button
              type="button"
              disabled={slides.length >= 6}
              onClick={() => setPicker("add")}
            >
              ＋ เพิ่มภาพ Hero
            </button>
          </div>
          {slides.length === 0 && (
            <p className="editor-help">
              ยังไม่มีภาพ Hero — หน้าแรกจะแสดงเฉพาะข้อความเปิดหน้า
              กดเพิ่มภาพเพื่อเริ่มเลือก
            </p>
          )}
          {slides.map((slide, index) => {
            const contentId = slide.contentId ?? slide.projectId;
            const contentKind = slide.contentKind ?? "project";
            const source = sources.find(
              (item) => item.id === contentId && item.kind === contentKind,
            );
            const photos = source ? heroPhotosFor(source) : [];
            return (
              <div className="hero-edit-card" key={`${contentId}-${index}`}>
                <div className="hero-edit-card-heading">
                  <img src={slide.image} alt="" />
                  <div>
                    <strong>ภาพที่ {index + 1}</strong>
                    <p>{source?.[locale].title || "เนื้อหาไม่พร้อมเผยแพร่"}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`นำภาพที่ ${index + 1} ออก`}
                    onClick={() => {
                      setPicker(null);
                      update({
                        heroSlides: slides.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    นำภาพออก
                  </button>
                </div>
                <details
                  className="home-item-details"
                  open={expanded === index}
                >
                  <summary
                    onClick={(event) => {
                      event.preventDefault();
                      setExpanded(expanded === index ? null : index);
                    }}
                  >
                    เลือกรูป / ปรับตำแหน่ง / จัดลำดับ
                  </summary>
                  <fieldset>
                    <legend>
                      {index + 1}.{" "}
                      {source?.[locale].title ||
                        "เนื้อหานี้ไม่ได้เผยแพร่ — จะไม่แสดงบนเว็บ"}
                    </legend>
                    <button type="button" onClick={() => setPicker(index)}>
                      เปลี่ยนผลงาน / บทความต้นทาง
                    </button>
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
                    <p>กดเลือกภาพจากเนื้อหานี้</p>
                    {!photos.includes(slide.image) && (
                      <p role="status">
                        ภาพนี้ไม่พร้อมใช้หรือซ้ำกับหน้าปกผลงาน กรุณาเลือกภาพใหม่
                      </p>
                    )}
                    <div className="home-choice-grid home-photo-grid">
                      {photos.map((src, i) => (
                        <button
                          type="button"
                          className="home-choice-card"
                          key={src}
                          aria-pressed={slide.image === src}
                          onClick={() => patchSlide(index, { image: src })}
                        >
                          <img
                            src={src}
                            alt={`ภาพที่ ${i + 1}`}
                            loading="lazy"
                          />
                          <span>
                            {slide.image === src
                              ? "✓ เลือกแล้ว"
                              : `เลือกภาพที่ ${i + 1}`}
                          </span>
                        </button>
                      ))}
                    </div>
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
                              patchSlide(index, {
                                [key]: Number(e.target.value),
                              })
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
                        onClick={() =>
                          update({ heroSlides: move(slides, index, 1) })
                        }
                      >
                        ↓ เลื่อนลง
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          update({
                            heroSlides: slides.filter((_, i) => i !== index),
                          })
                        }
                      >
                        นำภาพออก
                      </button>
                    </div>
                  </fieldset>
                </details>
              </div>
            );
          })}
          <p className="editor-help">
            นำภาพออกได้ทุกภาพ · รูปต้นฉบับยังอยู่ในคลัง ·
            กดบันทึกเพื่อใช้จำนวนและลำดับนี้บนหน้าแรก
          </p>
          {(picker === "add" || typeof picker === "number") && (
            <HomeContentPicker
              key={picker}
              items={heroSources}
              locale={locale}
              onClose={() => setPicker(null)}
              onSelect={(source) => {
                const selection: HeroSelection = {
                  contentId: source.id,
                  contentKind: source.kind as "project" | "post",
                  image: heroPhotosFor(source)[0],
                  x: 50,
                  y: 50,
                  mobileX: 50,
                  mobileY: 50,
                };
                if (picker === "add" && slides.length < 6)
                  update({ heroSlides: [...slides, selection] });
                else if (typeof picker === "number")
                  patchSlide(picker, { ...selection, projectId: undefined });
                setExpanded(
                  picker === "add"
                    ? slides.length
                    : typeof picker === "number"
                      ? picker
                      : null,
                );
                setPicker(null);
              }}
            />
          )}
          <button
            type="button"
            onClick={() => update({ heroSlides: defaultHeroSelections(items) })}
          >
            ใช้ชุดภาพแนะนำ
          </button>
        </details>
      )}
      {(!section || section === "layout") && (
        <details open>
          <summary>จัดส่วนต่าง ๆ ของหน้าแรก</summary>
          <p className="editor-help">
            ส่วนเหล่านี้อยู่ถัดจากภาพเปิดหน้า → งานที่เรารับจัด → ประสบการณ์ →
            ลูกค้าของเรา เรียงจากบนลงล่าง ใช้ปุ่มลูกศรหรือจับลาก
            สถานะด้านล่างอ้างอิงภาษาที่กำลังแก้ไข
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
                {homeSectionState(value, section.id, locale) === "visible"
                  ? `${sections.slice(0, index).filter((s) => homeSectionState(value, s.id, locale) === "visible").length + 5}. `
                  : ""}
                {sectionLabels[section.id]}
                <small className="home-layout-status">
                  {
                    homeSectionStateLabels[
                      homeSectionState(value, section.id, locale)
                    ]
                  }
                </small>
              </label>
              <div>
                <button
                  type="button"
                  disabled={!index}
                  aria-label={`เลื่อน ${sectionLabels[section.id]} ขึ้น`}
                  onClick={() =>
                    update({ sections: move(sections, index, -1) })
                  }
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
      )}
      {(!section || section === "selections") && (
        <details open>
          <summary>
            เลือก{selectionKind === "post" ? "บทความ" : "ผลงาน"}หน้าแรก
          </summary>
          <p className="editor-help">
            ถ้าไม่เลือก ระบบใช้รายการเด่นตามลำดับเดิม · หน้าแรกแสดงผลงานสูงสุด 4
            และบทความ 3 รายการ
          </p>
          {(["project", "post"] as const)
            .filter((kind) => !selectionKind || kind === selectionKind)
            .map((kind) => {
              const ids = value.selections?.[kind] || [];
              return (
                <fieldset key={kind}>
                  <legend>{{ project: "ผลงาน", post: "บทความ" }[kind]}</legend>
                  {ids.map((id, index) => (
                    <div className="section-sort-row" key={id}>
                      <span className="home-selected-content">
                        {items.find((i) => i.id === id)?.image && (
                          <img
                            src={items.find((i) => i.id === id)!.image}
                            alt=""
                            loading="lazy"
                          />
                        )}
                        {items.find((i) => i.id === id)?.[locale].title ||
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
                  <button type="button" onClick={() => setPicker(kind)}>
                    ＋ เลือก{kind === "project" ? "ผลงาน" : "บทความ"}
                    จากภาพตัวอย่าง
                  </button>
                  {picker === kind && (
                    <HomeContentPicker
                      items={items.filter(
                        (i) =>
                          i.kind === kind &&
                          !ids.includes(i.id) &&
                          i.status === "published",
                      )}
                      locale={locale}
                      onClose={() => setPicker(null)}
                      onSelect={(item) => {
                        update({
                          selections: {
                            ...value.selections,
                            [kind]: [...ids, item.id],
                          },
                        });
                        setPicker(null);
                      }}
                    />
                  )}
                </fieldset>
              );
            })}
        </details>
      )}
      {(!section ||
        section === "clients" ||
        section === "partners" ||
        section === "testimonials") && (
        <details open>
          <summary>
            {section === "clients"
              ? "ลูกค้าของเรา"
              : section === "partners"
                ? "เครือข่ายพันธมิตร"
                : "เสียงจากลูกค้า"}
          </summary>
          <p className="editor-help">
            เพิ่มเฉพาะความสัมพันธ์และคำรับรองจริง ·
            รายการใหม่จะยังไม่แสดงจนกว่าจะเลือก “แสดงบนเว็บ”
          </p>
          {relationships
            .filter(
              (r) =>
                !section ||
                (section === "clients"
                  ? r.kind === "client"
                  : section === "partners"
                    ? r.kind === "partner"
                    : r.kind === "testimonial"),
            )
            .map((r) => (
              <details
                className="home-item-details"
                key={r.id}
                open={!r.th.name && !r.en.name}
              >
                <summary>
                  {r[locale].name || r.th.name || r.en.name || "รายการใหม่"} ·{" "}
                  {r.published ? "แสดงบนเว็บ" : "ยังไม่แสดง"}
                </summary>
                <fieldset>
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
                          relationships: relationships.filter(
                            (x) => x.id !== r.id,
                          ),
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
                      onChange={(e) =>
                        patch(r.id, { published: e.target.checked })
                      }
                    />
                    แสดงบนเว็บ
                  </label>
                </fieldset>
              </details>
            ))}
          <div className="editor-top">
            {(
              (section === "clients"
                ? ["client"]
                : section === "partners"
                  ? ["partner"]
                  : ["testimonial"]) as Relationship["kind"][]
            ).map((kind) => (
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
                  {
                    client: "ลูกค้า",
                    partner: "พันธมิตร",
                    testimonial: "รีวิว",
                  }[kind]
                }
              </button>
            ))}
          </div>
        </details>
      )}
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
