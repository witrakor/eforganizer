import type { EditorSection } from "@/lib/content-editor-sections";
export default function ContentSectionNav({
  sections,
  selected,
  onSelect,
}: {
  sections: EditorSection[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <details className="home-page-map content-section-map">
      <summary>
        ส่วนที่แก้ไข: {sections.find((s) => s.id === selected)?.label}
        <small>เปิดแผนผังเพื่อเปลี่ยนส่วนที่แก้ไข</small>
      </summary>
      <p className="editor-help">
        เลือกส่วนที่ต้องการแก้ไข เรียงตามเนื้อหาบนหน้าเว็บ
      </p>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              type="button"
              aria-pressed={selected === section.id}
              onClick={() => onSelect(section.id)}
            >
              <span className="home-map-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </span>
              <span />
            </button>
          </li>
        ))}
      </ol>
    </details>
  );
}
