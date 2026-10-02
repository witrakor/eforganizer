"use client";
import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Copy,
  ArchiveRestore,
  Trash2,
} from "lucide-react";
import type { Media } from "@/lib/types";
export default function MediaManager({
  initial,
  driver,
}: {
  initial: Media[];
  driver: string;
}) {
  const [files, setFiles] = useState(initial),
    [selected, setSelected] = useState<Media | null>(null),
    [search, setSearch] = useState(""),
    [trash, setTrash] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  async function refresh() {
    const r = await fetch("/api/admin/media");
    if (r.ok) setFiles(await r.json());
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploads = Array.from(e.target.files || []);
    if (!uploads.length) return;
    setBusy(true);
    setNotice("");
    let count = 0;
    try {
      for (const f of uploads) {
        const form = new FormData();
        form.set("file", f);
        const r = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        count++;
      }
      setNotice(`อัปโหลดสำเร็จ ${count} ไฟล์`);
    } catch (e) {
      setNotice(
        `${count ? `อัปโหลดแล้ว ${count} ไฟล์ · ` : ""}${(e as Error).message}`,
      );
    } finally {
      setBusy(false);
      e.target.value = "";
      await refresh();
    }
  }
  async function modify(data: object) {
    if (!selected) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/media/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setNotice("อัปเดตไฟล์เรียบร้อยแล้ว");
      setSelected(null);
      await refresh();
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>ไฟล์และรูปภาพ</h1>
          <p>อัปโหลด จัดการคำอธิบาย และเลือกรูปไปใช้ในเนื้อหา</p>
        </div>
        <span className="badge">
          {driver === "r2" ? "Cloudflare R2" : "Local storage"}
        </span>
      </div>
      <div className="upload-zone">
        <Upload size={25} />
        <div>{busy ? "กำลังอัปโหลด…" : "เพิ่มภาพหรือไฟล์เอกสาร"}</div>
        <p>
          JPG, PNG, WebP, AVIF, PDF · ไม่เกิน 12 MB ต่อไฟล์ · รูปจะปรับเป็น WebP
          อัตโนมัติ
        </p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          onChange={upload}
          disabled={busy}
          aria-label="อัปโหลดไฟล์"
        />
      </div>
      {notice && (
        <div className="save-notice" role="status">
          {notice}
        </div>
      )}
      <div className="admin-toolbar">
        <div className="filters">
          <button
            className={!trash ? "selected" : ""}
            onClick={() => setTrash(false)}
          >
            ไฟล์ทั้งหมด ({files.filter((f) => !f.deletedAt).length})
          </button>
          <button
            className={trash ? "selected" : ""}
            onClick={() => setTrash(true)}
          >
            ถังขยะ ({files.filter((f) => f.deletedAt).length})
          </button>
        </div>
        <input
          placeholder="ค้นหาชื่อหรือคำอธิบาย…"
          aria-label="ค้นหาไฟล์"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="media-grid">
        {files
          .filter(
            (f) =>
              Boolean(f.deletedAt) === trash &&
              (f.name + f.alt).toLowerCase().includes(search.toLowerCase()),
          )
          .map((f) => (
            <div className="media-card" key={f.id}>
              <button
                onClick={() => setSelected(f)}
                aria-label={`แก้ไข ${f.name}`}
              >
                {f.mime.startsWith("image/") && !f.deletedAt ? (
                  <img src={f.url} alt={f.alt || f.name} />
                ) : (
                  <FileText size={35} />
                )}
              </button>
              <div className="media-card-info">
                <strong>{f.name}</strong>
                <span>
                  {Math.ceil(f.size / 1024)} KB · {f.driver}
                </span>
              </div>
            </div>
          ))}
      </div>
      {selected && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="รายละเอียดไฟล์"
          >
            <div className="modal-head">
              <h2>{selected.name}</h2>
              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>
            {notice && (
              <p className="save-notice" role="status">
                {notice}
              </p>
            )}
            <div className="media-detail">
              {selected.mime.startsWith("image/") && !selected.deletedAt ? (
                <img src={selected.url} alt={selected.alt || selected.name} />
              ) : (
                <div className="empty-state">
                  <FileText size={50} />
                  <p>
                    {selected.deletedAt ? "ไฟล์อยู่ในถังขยะ" : "PDF document"}
                  </p>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  modify({ alt: f.get("alt"), source: f.get("source") });
                }}
              >
                <label className="field-label">
                  คำอธิบายภาพ / Alt text
                  <input
                    name="alt"
                    defaultValue={selected.alt}
                    maxLength={1000}
                  />
                </label>
                <label className="field-label">
                  ที่มา / เครดิต
                  <textarea
                    name="source"
                    defaultValue={selected.source}
                    rows={3}
                    maxLength={2000}
                  />
                </label>
                <label className="field-label">
                  URL
                  <input readOnly value={selected.url} />
                </label>
                <div className="editor-top">
                  <button className="button button-small" disabled={busy}>
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    title="คัดลอก URL"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(selected.url);
                        setNotice("คัดลอก URL แล้ว");
                      } catch {
                        setNotice("กรุณาคัดลอก URL จากช่องด้านบน");
                      }
                    }}
                  >
                    <Copy size={15} />
                  </button>
                </div>
                <button
                  className="button button-small button-ghost"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    modify({ action: selected.deletedAt ? "restore" : "trash" })
                  }
                >
                  {selected.deletedAt ? (
                    <ArchiveRestore size={15} />
                  ) : (
                    <Trash2 size={15} />
                  )}{" "}
                  {selected.deletedAt ? "กู้คืนไฟล์" : "ย้ายไปถังขยะ"}
                </button>
                <span className="editor-help">
                  ไฟล์ในถังขยะกู้คืนได้ · รูปที่ถูกใช้ในเนื้อหาจะยังลบไม่ได้
                </span>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
