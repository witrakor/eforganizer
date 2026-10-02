import { adminContentHref } from "@/lib/admin-content-url";
import { contentName } from "@/lib/admin-content";
import Link from "next/link";
import { bangkokDate } from "@/lib/date";
import {
  FileText,
  ImageIcon,
  Inbox,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import { contents, mediaList } from "@/lib/content";
import { query } from "@/lib/db";
export default async function Page() {
  const [c, m, q] = await Promise.all([
    contents(undefined, true),
    mediaList(),
    query<any[]>(
      "SELECT id,name,event_type,status,created_at FROM inquiries ORDER BY created_at DESC LIMIT 5",
    ),
  ]);
  const n = await query<{ n: number }[]>(
    'SELECT COUNT(*) AS n FROM inquiries WHERE status="new"',
  );
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">YOUR WEBSITE, IN FLOW</span>
          <h1>ภาพรวมเว็บไซต์</h1>
          <p>อัปเดตเรื่องราว ดูแลรูปภาพ และติดตามงานใหม่ได้จากที่นี่</p>
        </div>
        <Link href="/th" target="_blank" className="button button-small">
          เปิดเว็บไซต์
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="stats-grid">
        {[
          [
            FileText,
            c.filter((i) => i.status === "published").length,
            "เนื้อหาที่เผยแพร่",
            "/admin/content?status=published",
          ],
          [
            Briefcase,
            c.filter((i) => i.kind === "project").length,
            "ผลงานในระบบ",
            "/admin/content?kind=project",
          ],
          [ImageIcon, m.length, "ไฟล์และรูปภาพ", "/admin/media"],
          [Inbox, n[0].n, "ข้อความใหม่", "/admin/inquiries"],
        ].map(([Icon, num, label, href]) => {
          const I = Icon as typeof FileText;
          return (
            <Link
              className="stat-card"
              href={href as string}
              key={label as string}
            >
              <I size={21} />
              <strong>{num as number}</strong>
              <span>{label as string}</span>
            </Link>
          );
        })}
      </div>
      <section className="admin-panel">
        <div className="admin-heading">
          <div>
            <h2>งานที่กำลังดูแล</h2>
            <p>
              ฉบับร่าง {c.filter((i) => i.status === "draft").length} รายการ ·
              กลับมาแก้ไขต่อได้ทุกเมื่อ
            </p>
          </div>
          <Link className="text-link" href="/admin/content?status=draft">
            ดูฉบับร่างทั้งหมด ↗
          </Link>
        </div>
        <div className="dashboard-recent">
          {[...c]
            .sort((a, b) =>
              String(b.updatedAt || b.date).localeCompare(
                String(a.updatedAt || a.date),
              ),
            )
            .slice(0, 5)
            .map((i) => (
              <Link href={adminContentHref(i)} key={i.id}>
                <div>
                  <strong>{contentName(i)}</strong>
                  <small>
                    แก้ไขล่าสุด {bangkokDate(i.updatedAt || i.date)}
                  </small>
                </div>
                <span className={`badge ${i.status}`}>
                  {i.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </div>
      </section>
      <section className="admin-panel">
        <h2>เริ่มจัดการเนื้อหา</h2>
        <p>
          แก้ไขข้อความไทยและอังกฤษ เปลี่ยนรูปภาพ หรือเพิ่มบทความใหม่
          โดยโครงหน้าเว็บยังคงรูปแบบเดิม
        </p>
        <div className="editor-top">
          <Link className="button button-small" href="/admin/content">
            จัดการเนื้อหา
            <ArrowUpRight size={16} />
          </Link>
          <Link
            className="button button-small button-ghost"
            href="/admin/media"
          >
            เปิดคลังรูปภาพ
          </Link>
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-heading">
          <h2>ข้อความติดต่อล่าสุด</h2>
          <Link className="text-link" href="/admin/inquiries">
            ดูทั้งหมด
            <ArrowUpRight size={14} />
          </Link>
        </div>
        {q.length ? (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ประเภทงาน</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {q.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.event_type}</td>
                    <td>
                      <span className={`badge ${i.status}`}>{i.status}</span>
                    </td>
                    <td>{bangkokDate(i.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            ยังไม่มีข้อความใหม่ · รายละเอียดจากฟอร์มติดต่อจะปรากฏที่นี่
          </div>
        )}
      </section>
    </>
  );
}
