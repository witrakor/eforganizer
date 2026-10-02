"use client";
import { useEffect, useState } from "react";
import { X, FileText } from "lucide-react";
import type { Media } from "@/lib/types";
export default function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<Media[]>([]),
    [search, setSearch] = useState(""),
    [message, setMessage] = useState("กำลังโหลด…");
  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => {
        setFiles(
          d.filter((i: Media) => !i.deletedAt && i.mime.startsWith("image/")),
        );
        setMessage("");
      })
      .catch(() => setMessage("โหลดคลังรูปไม่ได้ กรุณาลองใหม่"));
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="เลือกรูปภาพ"
      >
        <div className="modal-head">
          <h2>เลือกรูปจากคลัง</h2>
          <button className="icon-button" onClick={onClose} aria-label="ปิด">
            <X size={18} />
          </button>
        </div>
        <input
          autoFocus
          placeholder="ค้นหาชื่อรูป…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        {message && <p>{message}</p>}
        <div className="media-grid">
          {files
            .filter((f) =>
              (f.name + f.alt).toLowerCase().includes(search.toLowerCase()),
            )
            .map((f) => (
              <div className="media-card" key={f.id}>
                <button
                  onClick={() => onSelect(f.url)}
                  aria-label={`เลือก ${f.name}`}
                >
                  <img src={f.url} alt={f.alt || f.name} />
                </button>
                <div className="media-card-info">
                  <strong>{f.name}</strong>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
