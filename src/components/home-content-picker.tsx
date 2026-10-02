"use client";
import { useState } from "react";
import type { Content, Locale } from "@/lib/types";

export default function HomeContentPicker({
  items,
  locale,
  onSelect,
  onClose,
}: {
  items: Content[];
  locale: Locale;
  onSelect: (item: Content) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const matches = items.filter(
    (item) =>
      (kind === "all" || item.kind === kind) &&
      `${item.th.title} ${item.en.title}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase().trim()),
  );
  return (
    <section
      className="home-content-picker"
      aria-label="เลือกเนื้อหาจากภาพตัวอย่าง"
    >
      <div className="editor-top">
        <strong>กดเลือกเนื้อหาที่ต้องการ</strong>
        <button type="button" onClick={onClose}>
          ปิดตัวเลือก
        </button>
      </div>
      <label className="field-label">
        ค้นหาชื่อผลงานหรือบทความ
        <input
          autoFocus
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="editor-top">
        {[
          ["all", "ทั้งหมด"],
          ["project", "ผลงาน"],
          ["post", "บทความ"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={kind === id}
            onClick={() => setKind(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="home-choice-grid">
        {matches.map((item) => (
          <button
            type="button"
            className="home-choice-card"
            key={`${item.kind}-${item.id}`}
            onClick={() => onSelect(item)}
          >
            {item.image || item.gallery[0] ? (
              <img src={item.image || item.gallery[0]} alt="" loading="lazy" />
            ) : (
              <span className="home-choice-placeholder">ไม่มีภาพปก</span>
            )}
            <span>
              <small>{item.kind === "project" ? "ผลงาน" : "บทความ"}</small>
              <strong>{item[locale].title || item.th.title}</strong>
            </span>
          </button>
        ))}
      </div>
      {!matches.length && (
        <p role="status">
          ไม่พบรายการที่เลือกได้ ลองเปลี่ยนคำค้นหาหรือหมวดหมู่
        </p>
      )}
    </section>
  );
}
