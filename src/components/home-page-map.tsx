import { homeEditorDefaults } from "@/lib/home-editor-defaults";
import type { Content, Locale } from "@/lib/types";
import {
  homeOrder,
  sectionLabels,
  homeSectionState,
  homeSectionStateLabels,
} from "@/lib/home-content";
const titleFor: Record<string, string> = {
  work: "workTitle",
  journal: "journalTitle",
  process: "processTitle",
  team: "teamTitle",
  testimonials: "testimonialsTitle",
  partners: "partnersTitle",
  faq: "faqTitle",
  contact: "ctaTitle",
};
export default function HomePageMap({
  value,
  locale,
  selected,
  onSelect,
}: {
  value: Content;
  locale: Locale;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const title = (key: string, fallback: string) =>
    String(value[locale][key] || homeEditorDefaults[key]?.[locale] || fallback);
  const rows = [
    {
      id: "hero",
      group: "hero",
      label: "ภาพเปิดหน้า (Hero)",
      detail: title("heroTitle", "หัวเรื่องและสไลด์ภาพขนาดใหญ่"),
      state: "visible" as const,
    },
    {
      id: "services",
      group: "",
      label: "งานที่เรารับจัด",
      detail: "8 ประเภทงาน · จัดการในเมนูบริการ",
      state: "visible" as const,
    },
    {
      id: "experience",
      group: "experience",
      label: "ประสบการณ์",
      detail: title("experienceTitle", "ประสบการณ์ที่ลูกค้าไว้วางใจ"),
      state: "visible" as const,
    },
    {
      id: "clients",
      group: "clients",
      label: "ลูกค้าของเรา",
      detail: title("clientSectionTitle", "รูปและรายชื่อลูกค้า"),
      state: "visible" as const,
    },
    ...homeOrder(value).map((s) => ({
      id: s.id,
      group: s.id,
      label: sectionLabels[s.id],
      detail: title(titleFor[s.id], sectionLabels[s.id]),
      state: homeSectionState(value, s.id, locale),
    })),
  ];
  return (
    <details className="home-page-map">
      <summary>
        ส่วนที่แก้ไข:{" "}
        {selected === "layout"
          ? "จัดลำดับหน้า"
          : selected === "seo"
            ? "ข้อมูลหน้าและ SEO"
            : [
                ...new Set(
                  rows
                    .filter((row) => row.group === selected)
                    .map((row) => row.label),
                ),
              ].join(" / ")}
        <small>เปิดแผนผังเพื่อเปลี่ยนส่วนที่แก้ไข</small>
      </summary>
      <p className="editor-help">
        ส่วนที่แสดงบนหน้าแรกภาษานี้ เรียงจากบนลงล่าง กดเพื่อแก้ไข
      </p>
      <ol>
        {rows
          .filter((row) => row.state === "visible")
          .map((row, index) => (
            <li key={row.id}>
              <button
                type="button"
                disabled={!row.group}
                aria-pressed={selected === row.group}
                onClick={() => onSelect(row.group)}
              >
                <span className="home-map-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{row.label}</strong>
                  <small>{row.detail}</small>
                </span>
                <span>{index < 4 ? "ส่วนบน" : "จัดลำดับได้"}</span>
              </button>
            </li>
          ))}
      </ol>
      {rows.some((row) => row.state !== "visible") && (
        <details className="home-inactive-sections">
          <summary>
            ส่วนที่ยังไม่แสดงบนหน้าแรก (
            {rows.filter((row) => row.state !== "visible").length})
          </summary>
          <p className="editor-help">
            ส่วนเหล่านี้ไม่นับในลำดับหน้าเว็บ กดเพื่อจัดการข้อมูลหรือเปิดใช้งาน
          </p>
          <ul>
            {rows
              .filter((row) => row.state !== "visible")
              .map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    aria-pressed={selected === row.group}
                    onClick={() => onSelect(row.group)}
                  >
                    <strong>{row.label}</strong>
                    <small>{homeSectionStateLabels[row.state]}</small>
                  </button>
                </li>
              ))}
          </ul>
        </details>
      )}
      <div className="editor-top">
        <button
          type="button"
          aria-pressed={selected === "layout"}
          onClick={() => onSelect("layout")}
        >
          จัดลำดับ / ซ่อนส่วนของหน้า
        </button>
        <button
          type="button"
          aria-pressed={selected === "seo"}
          onClick={() => onSelect("seo")}
        >
          ข้อมูลหน้าและ SEO
        </button>
      </div>
    </details>
  );
}
