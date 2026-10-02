"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowUpRight } from "lucide-react";
import type { Content } from "@/lib/types";
const labels: Record<string, string> = {
  all: "ทั้งหมด",
  page: "หน้าเว็บ",
  service: "บริการ",
  project: "ผลงาน",
  post: "บทความ",
};
export default function ContentList({ items }: { items: Content[] }) {
  const [kind, setKind] = useState("all"),
    [search, setSearch] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  async function create(k: string) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: k }),
      });
      if (!r.ok) throw new Error("สร้างเนื้อหาไม่สำเร็จ");
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
          <h1>จัดการเนื้อหา</h1>
          <p>แก้ไขหน้าเดิม เพิ่มผลงานและบทความได้ทั้งสองภาษา</p>
        </div>
        <select
          aria-label="เพิ่มเนื้อหา"
          value=""
          disabled={busy}
          onChange={(e) => create(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">＋ เพิ่มเนื้อหา</option>
          <option value="post">บทความ</option>
          <option value="project">ผลงาน</option>
          <option value="page">หน้าทั่วไป</option>
          <option value="service">บริการ</option>
        </select>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="admin-toolbar">
        <div className="filters">
          {Object.entries(labels).map(([k, label]) => (
            <button
              key={k}
              className={kind === k ? "selected" : ""}
              onClick={() => setKind(k)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          placeholder="ค้นหาเนื้อหา…"
          aria-label="ค้นหาเนื้อหา"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>หัวข้อ / URL</th>
              <th>ประเภท</th>
              <th>ภาษา</th>
              <th>สถานะ</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items
              .filter(
                (i) =>
                  (kind === "all" || i.kind === kind) &&
                  (i.th.title + i.en.title + i.slug)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
              )
              .map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link href={`/admin/content/${i.id}`}>
                      <strong>
                        {i.th.title || i.en.title || "ยังไม่มีชื่อ"}
                      </strong>
                      <small>/{i.slug}</small>
                    </Link>
                  </td>
                  <td>{labels[i.kind]}</td>
                  <td>
                    {i.th.title ? "TH ✓" : "TH —"} ·{" "}
                    {i.en.title ? "EN ✓" : "EN —"}
                  </td>
                  <td>
                    <span className={`badge ${i.status}`}>
                      {i.status === "published" ? "เผยแพร่" : "ฉบับร่าง"}
                    </span>
                  </td>
                  <td>
                    <Link className="text-link" href={`/admin/content/${i.id}`}>
                      แก้ไข
                      <ArrowUpRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
