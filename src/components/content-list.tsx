"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowUpRight, Search, X } from "lucide-react";
import type { Content } from "@/lib/types";
import { contentName, filterContent, kindLabels } from "@/lib/admin-content";
import AdminDialog from "./admin-dialog";
export default function ContentList({ items }: { items: Content[] }) {
  const [kind, setKind] = useState("all"),
    [status, setStatus] = useState("all"),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState("recent"),
    [page, setPage] = useState(1),
    [ready, setReady] = useState(false);
  const [createKind, setCreateKind] = useState("post"),
    [creating, setCreating] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem("eliteflow-content-filters") || "";
    } catch {}
    const q = new URLSearchParams(location.search || saved);
    setKind(q.get("kind") || "all");
    setStatus(q.get("status") || "all");
    setSearch(q.get("q") || "");
    setSort(q.get("sort") || "recent");
    setPage(Math.max(1, Number(q.get("page")) || 1));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams();
    if (kind !== "all") q.set("kind", kind);
    if (status !== "all") q.set("status", status);
    if (search) q.set("q", search);
    if (sort !== "recent") q.set("sort", sort);
    if (page > 1) q.set("page", String(page));
    try {
      sessionStorage.setItem("eliteflow-content-filters", q.toString());
    } catch {}
    history.replaceState(
      history.state,
      "",
      `${location.pathname}${q.size ? `?${q}` : ""}`,
    );
  }, [kind, status, search, sort, page, ready]);
  const filtered = filterContent(items, kind, status, search, sort);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  async function create() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: createKind }),
      });
      if (!r.ok) throw new Error("สร้างเนื้อหาไม่สำเร็จ กรุณาลองใหม่");
      const d = await r.json();
      router.push(`/admin/content/${d.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">CONTENT LIBRARY</span>
          <h1>จัดการเนื้อหา</h1>
          <p>ค้นหา แก้ไข และเผยแพร่เรื่องราวของเว็บไซต์</p>
        </div>
        <button
          className="button button-small"
          onClick={() => setCreating(true)}
        >
          <Plus size={18} /> เพิ่มเนื้อหา
        </button>
      </div>
      <div className="admin-panel content-controls">
        <div className="filters" aria-label="ประเภทเนื้อหา">
          {Object.entries(kindLabels).map(([k, label]) => (
            <button
              key={k}
              aria-pressed={kind === k}
              className={kind === k ? "selected" : ""}
              onClick={() => {
                setKind(k);
                setPage(1);
              }}
            >
              {label}{" "}
              <span>
                {items.filter((i) => k === "all" || i.kind === k).length}
              </span>
            </button>
          ))}
        </div>
        <div className="admin-search-row">
          <label className="search-field">
            <Search size={18} />
            <input
              placeholder="ค้นหาชื่อหน้า หัวข้อ หรือ URL…"
              aria-label="ค้นหาเนื้อหา"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            aria-label="สถานะเนื้อหา"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="draft">ฉบับร่าง</option>
            <option value="published">เผยแพร่แล้ว</option>
          </select>
          <select
            aria-label="เรียงเนื้อหา"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="recent">แก้ไขล่าสุด</option>
            <option value="name">ชื่อเนื้อหา</option>
            <option value="order">ลำดับที่ตั้งไว้</option>
          </select>
        </div>
      </div>
      <p className="result-count" role="status">
        พบ {filtered.length} รายการ · ภาษาแสดงความพร้อมของหัวข้อและคำอธิบาย
      </p>
      <div className="admin-panel table-wrap content-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>เนื้อหา</th>
              <th>ประเภท</th>
              <th>ภาษา</th>
              <th>สถานะ</th>
              <th>
                <span className="sr-only">จัดการ</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.id}>
                <td>
                  <Link href={`/admin/content/${i.id}`}>
                    <strong>{contentName(i)}</strong>
                    <small>/{i.slug}</small>
                  </Link>
                </td>
                <td data-label="ประเภท">{kindLabels[i.kind]}</td>
                <td data-label="ภาษา">
                  {(["th", "en"] as const).map((l) => (
                    <span
                      className="language-status"
                      key={l}
                      title={
                        i[l].title && i[l].description
                          ? "มีหัวข้อและคำอธิบายแล้ว"
                          : "ยังขาดหัวข้อหรือคำอธิบาย"
                      }
                    >
                      {l.toUpperCase()}{" "}
                      {i[l].title && i[l].description ? "✓" : "—"}{" "}
                    </span>
                  ))}
                </td>
                <td data-label="สถานะ">
                  <span className={`badge ${i.status}`}>
                    {i.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                  </span>
                </td>
                <td>
                  <Link
                    className="text-link"
                    href={`/admin/content/${i.id}`}
                    aria-label={`แก้ไข ${contentName(i)}`}
                  >
                    แก้ไข <ArrowUpRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="empty-state">
            <h2>ไม่พบเนื้อหาที่ค้นหา</h2>
            <p>ลองเปลี่ยนคำค้น หรือแสดงทุกประเภทและทุกสถานะ</p>
            <button
              className="button button-small button-ghost"
              onClick={() => {
                setSearch("");
                setKind("all");
                setStatus("all");
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}
      </div>
      <div className="admin-pagination">
        <span>
          หน้า {currentPage} จาก {pages}
        </span>
        <button
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          ก่อนหน้า
        </button>
        <button
          disabled={currentPage >= pages}
          onClick={() => setPage(currentPage + 1)}
        >
          ถัดไป
        </button>
      </div>
      {creating && (
        <AdminDialog
          label="เพิ่มเนื้อหา"
          onClose={() => !busy && setCreating(false)}
        >
          <div className="modal-head">
            <h2>เพิ่มเนื้อหาใหม่</h2>
            <button
              className="icon-button"
              aria-label="ปิด"
              disabled={busy}
              onClick={() => setCreating(false)}
            >
              <X />
            </button>
          </div>
          <p>เริ่มจากฉบับร่าง แล้วตรวจตัวอย่างก่อนเผยแพร่</p>
          <label className="field-label">
            ประเภท
            <select
              value={createKind}
              onChange={(e) => setCreateKind(e.target.value)}
              disabled={busy}
            >
              {["post", "project", "service", "page"].map((k) => (
                <option key={k} value={k}>
                  {kindLabels[k]}
                </option>
              ))}
            </select>
          </label>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <button className="button" disabled={busy} onClick={create}>
            {busy ? "กำลังสร้าง…" : "สร้างฉบับร่าง"}
          </button>
        </AdminDialog>
      )}
    </>
  );
}
