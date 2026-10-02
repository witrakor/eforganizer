"use client";
import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import type { Media } from "@/lib/types";
import AdminDialog from "./admin-dialog";
export default function MediaPicker({
  onSelect,
  onClose,
  multiple = false,
  onSelectMany,
  maxSelection = 30,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
  multiple?: boolean;
  onSelectMany?: (urls: string[]) => void;
  maxSelection?: number;
}) {
  const [files, setFiles] = useState<Media[]>([]),
    [search, setSearch] = useState(""),
    [message, setMessage] = useState("กำลังโหลด…"),
    [limit, setLimit] = useState(24),
    [selected, setSelected] = useState<string[]>([]),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/media", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d: Media[]) => {
        setFiles(d.filter((i) => !i.deletedAt && i.mime.startsWith("image/")));
        setMessage("");
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setMessage("โหลดคลังรูปไม่ได้ กรุณาปิดแล้วเปิดใหม่");
      });
    return () => controller.abort();
  }, []);
  const filtered = files.filter((f) =>
    (f.name + f.alt).toLowerCase().includes(search.toLowerCase()),
  );
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploads = Array.from(e.target.files || []);
    if (!uploads.length) return;
    setBusy(true);
    setMessage("");
    let count = 0;
    try {
      for (const file of uploads) {
        const form = new FormData();
        form.set("file", file);
        const r = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const data = await r.json();
        if (!r.ok) throw Error(data.error || "อัปโหลดไม่สำเร็จ");
        count++;
      }
      setMessage(`อัปโหลดแล้ว ${count} รูป · เลือกรูปด้านล่างเพื่อใช้งาน`);
    } catch (error) {
      setMessage(`อัปโหลดแล้ว ${count} รูป · ${(error as Error).message}`);
    } finally {
      try {
        const r = await fetch("/api/admin/media");
        if (!r.ok) throw Error();
        const d: Media[] = await r.json();
        setFiles(d.filter((i) => !i.deletedAt && i.mime.startsWith("image/")));
        setSearch("");
        setLimit(24);
      } catch {
        setMessage("โหลดรายการใหม่ไม่สำเร็จ กรุณาเปิดคลังใหม่อีกครั้ง");
      }
      e.target.value = "";
      setBusy(false);
    }
  }
  return (
    <AdminDialog
      label="เลือกรูปภาพ"
      onClose={() => !busy && onClose()}
      className="media-picker-dialog"
    >
      <div className="modal-head">
        <div>
          <h2>{multiple ? "เพิ่มรูปในแกลเลอรี" : "เลือกรูปจากคลัง"}</h2>
          <p>ค้นหาหรืออัปโหลดรูปใหม่ได้จากที่นี่</p>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          disabled={busy}
          aria-label="ปิด"
        >
          <X size={20} />
        </button>
      </div>
      <div className="admin-search-row">
        <input
          autoFocus
          aria-label="ค้นหารูปภาพ"
          placeholder="ค้นหาชื่อหรือคำอธิบายรูป…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setLimit(24);
          }}
        />
        <label className="upload-button button button-small button-ghost">
          <Upload size={17} />
          {busy ? "กำลังอัปโหลด…" : "อัปโหลดรูป"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            onChange={upload}
          />
        </label>
      </div>
      <p className="editor-help">
        JPG, PNG, WebP, AVIF · ไม่เกิน 12 MB ต่อรูป
        {multiple && ` · เลือกเพิ่มได้ ${maxSelection} รูป`}
      </p>
      {message && <p role="status">{message}</p>}
      <p className="result-count">
        พบ {filtered.length} รูป{multiple && ` · เลือกแล้ว ${selected.length}`}
      </p>
      <div className="media-grid">
        {filtered.slice(0, limit).map((f) => (
          <div
            className={`media-card ${selected.includes(f.url) ? "is-selected" : ""}`}
            key={f.id}
          >
            <button
              disabled={
                busy ||
                (multiple &&
                  !selected.includes(f.url) &&
                  selected.length >= maxSelection)
              }
              aria-pressed={multiple ? selected.includes(f.url) : undefined}
              onClick={() =>
                multiple
                  ? setSelected((v) =>
                      v.includes(f.url)
                        ? v.filter((url) => url !== f.url)
                        : [...v, f.url],
                    )
                  : onSelect(f.url)
              }
              aria-label={`เลือก ${f.name}`}
            >
              <img loading="lazy" src={f.url} alt={f.alt || f.name} />
              {selected.includes(f.url) && (
                <span className="selection-check">✓</span>
              )}
            </button>
            <div className="media-card-info">
              <strong>{f.alt || f.name}</strong>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length && !message && (
        <div className="empty-state">
          ไม่พบรูปภาพ ลองใช้คำค้นอื่น หรืออัปโหลดรูปใหม่
        </div>
      )}
      <div className="picker-actions">
        {filtered.length > limit && (
          <button onClick={() => setLimit((n) => n + 24)}>
            แสดงเพิ่ม 24 รูป
          </button>
        )}
        {multiple && (
          <button
            className="button button-small"
            disabled={!selected.length || busy}
            onClick={() => onSelectMany?.(selected)}
          >
            ใช้รูปที่เลือก ({selected.length})
          </button>
        )}
      </div>
    </AdminDialog>
  );
}
