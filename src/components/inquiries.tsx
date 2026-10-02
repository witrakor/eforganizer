"use client";
import { useState } from "react";
import { bangkokDate } from "@/lib/date";
type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  guests: string;
  budget: string;
  message: string;
  locale: string;
  status: string;
  created_at: string;
};
const labels: Record<string, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  closed: "ปิดงาน",
  archived: "เก็บถาวร",
};
export default function Inquiries({ initial }: { initial: Inquiry[] }) {
  const [items, setItems] = useState(initial),
    [filter, setFilter] = useState("all"),
    [notice, setNotice] = useState("");
  async function update(id: string, status: string) {
    try {
      const r = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw Error();
      setItems((v) => v.map((i) => (i.id === id ? { ...i, status } : i)));
      setNotice("อัปเดตสถานะเรียบร้อย");
    } catch {
      setNotice("อัปเดตไม่สำเร็จ กรุณาลองใหม่");
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>ข้อความติดต่อ</h1>
          <p>รายละเอียดงานจากลูกค้า · ข้อมูลนี้แสดงเฉพาะผู้ดูแล</p>
        </div>
      </div>
      {notice && (
        <p className="save-notice" role="status">
          {notice}
        </p>
      )}
      <div className="filters">
        {Object.entries({ all: "ทั้งหมด", ...labels }).map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "selected" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {items
        .filter((i) => filter === "all" || i.status === filter)
        .map((i) => (
          <details className="inquiry-card" key={i.id}>
            <summary>
              <div>
                <h3>{i.name}</h3>
                <p>
                  {i.event_type} · {bangkokDate(i.created_at)}
                </p>
              </div>
              <span className={`badge ${i.status}`}>{labels[i.status]}</span>
            </summary>
            <div className="inquiry-body">
              <div className="inquiry-data">
                {[
                  ["อีเมล", i.email],
                  ["โทรศัพท์", i.phone],
                  ["วันที่จัดงาน", i.event_date],
                  ["สถานที่", i.location],
                  ["จำนวนคน", i.guests],
                  ["งบประมาณ", i.budget],
                ].map(([label, value]) => (
                  <div key={label}>
                    <small>{label}</small>
                    {value || "—"}
                  </div>
                ))}
              </div>
              <p>{i.message}</p>
              <label className="field-label">
                สถานะ
                <select
                  value={i.status}
                  onChange={(e) => update(i.id, e.target.value)}
                >
                  {Object.entries(labels).map(([k, v]) => (
                    <option value={k} key={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>
        ))}
      {!items.filter((i) => filter === "all" || i.status === filter).length && (
        <div className="admin-panel empty-state">ยังไม่มีข้อความในหมวดนี้</div>
      )}
    </>
  );
}
