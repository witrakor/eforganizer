import "../admin.css";
import { currentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/site-header";
import Login from "@/components/login";
export const dynamic = "force-dynamic";
export const metadata = {
  title: { absolute: "เข้าสู่ระบบ | Elite Flow" },
  robots: { index: false, follow: false },
};
export default async function Page() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <div className="login-page">
      <div className="login-brand">
        <Link href="/th">
          <Brand />
        </Link>
        <div>
          <h1>
            Good stories.
            <br />
            Thoughtfully managed.
          </h1>
          <p>พื้นที่จัดการเรื่องราวและประสบการณ์ของ Elite Flow</p>
        </div>
        <span>ELITE FLOW · CONTENT STUDIO</span>
      </div>
      <div className="login-form-wrap">
        <Login />
      </div>
    </div>
  );
}
