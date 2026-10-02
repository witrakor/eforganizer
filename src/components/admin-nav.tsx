"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Inbox,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Brand } from "./site-header";
export default function AdminNav() {
  const path = usePathname(),
    router = useRouter();
  return (
    <aside className="admin-sidebar">
      <Link href="/admin">
        <Brand />
      </Link>
      <span className="studio-label">CONTENT STUDIO</span>
      <nav className="admin-nav">
        {[
          ["/admin", "ภาพรวม", LayoutDashboard],
          ["/admin/content", "จัดการเนื้อหา", FileText],
          ["/admin/media", "ไฟล์และรูปภาพ", ImageIcon],
          ["/admin/inquiries", "ข้อความติดต่อ", Inbox],
          ["/admin/settings", "ระบบ", Settings],
        ].map(([href, label, Icon]) => {
          const I = Icon as typeof FileText;
          return (
            <Link
              href={href as string}
              className={
                (
                  href === "/admin"
                    ? path === href
                    : path.startsWith(href as string)
                )
                  ? "active"
                  : ""
              }
              key={href as string}
            >
              <I size={17} />
              {label as string}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-bottom">
        <Link href="/th" target="_blank">
          ดูเว็บไซต์ <ExternalLink size={12} />
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
          }}
        >
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
