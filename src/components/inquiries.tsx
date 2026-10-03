"use client";
import { useState } from "react";
import { bangkokDate } from "@/lib/date";
type Inquiry = {
  id: string;
  name: string;
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
  line_status: "pending" | "sending" | "sent" | "failed" | null;
};
const labels: Record<string, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  closed: "ปิดงาน",
  archived: "เก็บถาวร",
};
const budgetLabels: Record<string, string> = {
  undecided: "ต้องการคำแนะนำ",
  "under-100k": "ต่ำกว่า 100,000 บาท",
  "100k-300k": "100,000–300,000 บาท",
  "300k-500k": "300,000–500,000 บาท",
  "500k-plus": "500,000 บาทขึ้นไป",
};
export default function Inquiries({
  initial,
  eventTypeLabels,
}: {
  initial: Inquiry[];
  eventTypeLabels: Record<string, string>;
}) {
  const eventType = (value: string) =>
    Object.hasOwn(eventTypeLabels, value)
      ? eventTypeLabels[value]
      : value || "ยังไม่ระบุ";
  const [items, setItems] = useState(initial),
    [filter, setFilter] = useState("all"),
    [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [failed, setFailed] = useState(false);
  const visible = items.filter(
    (i) =>
      (filter === "all" || i.status === filter) &&
      [i.name, i.phone, i.event_type, eventType(i.event_type), i.message]
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  async function update(id: string, status: string) {
    setBusyId(id);
    setFailed(false);
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
      setFailed(true);
      setNotice("อัปเดตไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setBusyId("");
    }
  }
  async function retryLine(id: string) {
    setBusyId(id);
    setFailed(false);
    try {
      const response = await fetch(`/api/admin/inquiries/${id}/line`, {
        method: "POST",
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, line_status: result.line_status } : item,
        ),
      );
      setFailed(result.line_status === "failed");
      setNotice(
        result.line_status === "sent"
          ? "ส่งแจ้งเตือนไป LINE แล้ว"
          : result.line_status === "failed"
            ? "ยังส่งไม่สำเร็จ กรุณาตรวจการเชื่อมต่อ LINE และโควตาข้อความ"
            : "ระบบกำลังส่งแจ้งเตือน กรุณารีเฟรชเพื่อตรวจสถานะอีกครั้ง",
      );
    } catch {
      setFailed(true);
      setNotice("ส่งแจ้งเตือนไม่สำเร็จ กรุณาตรวจการตั้งค่า LINE");
    } finally {
      setBusyId("");
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
        <p
          className={`save-notice ${failed ? "error" : ""}`}
          role={failed ? "alert" : "status"}
        >
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
            {label} (
            {items.filter((i) => key === "all" || i.status === key).length})
          </button>
        ))}
      </div>
      <input
        className="inquiry-search"
        aria-label="ค้นหาข้อความ"
        placeholder="ค้นหาชื่อ โทรศัพท์ ประเภทงาน หรือรายละเอียดงาน…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {visible.map((i) => (
        <details className="inquiry-card" key={i.id} id={i.id}>
          <summary>
            <div>
              <h3>{i.name}</h3>
              <p>
                {eventType(i.event_type)} · {bangkokDate(i.created_at)}
              </p>
            </div>
            <span className={`badge ${i.status}`}>{labels[i.status]}</span>
          </summary>
          <div className="inquiry-body">
            {i.line_status && (
              <p>
                LINE:{" "}
                {
                  {
                    pending: "รอส่งแจ้งเตือน",
                    sending: "กำลังส่งแจ้งเตือน",
                    sent: "ส่งแจ้งเตือนแล้ว",
                    failed: "ส่งไม่สำเร็จ · บรีฟถูกบันทึกไว้แล้ว",
                  }[i.line_status]
                }
                {i.line_status !== "sent" && (
                  <button
                    type="button"
                    className="button button-small"
                    disabled={busyId === i.id}
                    onClick={() => retryLine(i.id)}
                  >
                    {busyId === i.id ? "กำลังตรวจสอบ…" : "ตรวจสอบ / ลองส่งใหม่"}
                  </button>
                )}
              </p>
            )}
            <div className="inquiry-data">
              {[
                ["ประเภทงาน", eventType(i.event_type)],
                ["โทรศัพท์", i.phone],
                ["วันที่จัดงาน", i.event_date],
                ["สถานที่", i.location],
                ["จำนวนคน", i.guests],
                [
                  "งบประมาณ",
                  Object.hasOwn(budgetLabels, i.budget)
                    ? budgetLabels[i.budget]
                    : i.budget,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  {value ? (
                    label === "โทรศัพท์" ? (
                      <a href={`tel:${value.replace(/[^+0-9]/g, "")}`}>
                        {value}
                      </a>
                    ) : (
                      value
                    )
                  ) : (
                    "—"
                  )}
                </div>
              ))}
            </div>
            <p>{i.message}</p>
            <label className="field-label">
              สถานะ
              <select
                disabled={busyId === i.id}
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
      {!visible.length && (
        <div className="admin-panel empty-state">ยังไม่มีข้อความในหมวดนี้</div>
      )}
    </>
  );
}
