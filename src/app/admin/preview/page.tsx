import { currentAdmin } from "@/lib/auth";
import { contents } from "@/lib/content";
import ContentPreview from "@/components/content-preview";
export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Preview() {
  if (!(await currentAdmin()))
    return (
      <main className="container section narrow">
        <h1>เซสชันหมดอายุ</h1>
        <p>
          เข้าสู่ระบบอีกครั้งในแท็บใหม่ แล้วปิดและเปิดตัวอย่างนี้อีกครั้ง
          งานที่ยังไม่บันทึกจะยังอยู่ในตัวแก้ไข
        </p>
        <a
          className="button"
          href="/admin/login"
          target="_blank"
          rel="noopener"
        >
          เข้าสู่ระบบอีกครั้ง
        </a>
      </main>
    );
  return <ContentPreview items={await contents(undefined, true)} />;
}
