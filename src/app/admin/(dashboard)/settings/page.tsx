import { query } from "@/lib/db";
import { content } from "@/lib/content";
import Link from "next/link";
import { storageDriver } from "@/lib/storage";
export default async function Page() {
  await query("SELECT 1");
  const c = await content("page", "contact", true);
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>สถานะระบบ</h1>
          <p>ข้อมูลการเชื่อมต่อและการตั้งค่าเว็บไซต์</p>
        </div>
      </div>
      <div className="admin-panel">
        <h2>การเชื่อมต่อ</h2>
        <div className="system-list">
          <div>
            <span>ฐานข้อมูล</span>
            <span className="badge published">MySQL · Connected</span>
          </div>
          <div>
            <span>ที่เก็บไฟล์ใหม่</span>
            <strong>
              {storageDriver() === "r2"
                ? "Cloudflare R2"
                : "Local persistent storage"}
            </strong>
          </div>
          <div>
            <span>R2 Bucket</span>
            <strong>{process.env.R2_BUCKET || "ยังไม่ได้ตั้งค่า"}</strong>
          </div>
          <div>
            <span>R2 Credentials</span>
            <span>
              {process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
                ? "ตั้งค่าแล้ว"
                : "ยังไม่ได้ตั้งค่า — ใช้ local storage อยู่"}
            </span>
          </div>
          <div>
            <span>เว็บไซต์</span>
            <strong>{process.env.SITE_URL}</strong>
          </div>
        </div>
      </div>
      <div className="admin-panel">
        <h2>ข้อมูลติดต่อบนเว็บไซต์</h2>
        <p>
          แก้ไขโทรศัพท์ อีเมล ที่อยู่ และ Facebook ในเนื้อหาหน้าติดต่อ
          ทั้งสองภาษา
        </p>
        <Link className="button button-small" href={`/admin/content/${c?.id}`}>
          แก้ไขข้อมูลติดต่อ ↗
        </Link>
      </div>
      <div className="admin-panel">
        <h2>การดูแลระบบ</h2>
        <p>
          การสำรอง MySQL และไฟล์ รวมถึงการตั้งค่า Easypanel อยู่ในเอกสาร README
          ของโปรเจกต์ รหัสผ่านผู้ดูแลจัดเก็บแบบแฮช และเซสชันหมดอายุใน 12 ชั่วโมง
        </p>
      </div>
    </>
  );
}
