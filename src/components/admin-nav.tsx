"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAdminGuard } from "./admin-guard";
import AdminDialog from "./admin-dialog";
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
  const [open, setOpen] = useState(false);
  const { confirmLeave } = useAdminGuard();
  const navigation = (mobile = false) => (
    <aside className="admin-sidebar" aria-label="เมนูจัดการ">
      {mobile && (
        <button
          className="drawer-close"
          onClick={() => setOpen(false)}
          aria-label="ปิดเมนู"
        >
          <X />
        </button>
      )}
      <Link href="/admin" onClick={() => setOpen(false)}>
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
              aria-current={
                (
                  href === "/admin"
                    ? path === href
                    : path.startsWith(href as string)
                )
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
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
        <button
          onClick={async () => {
            if (!confirmLeave()) return;
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
  return (
    <>
      <div className="admin-mobile-bar">
        <button
          onClick={() => setOpen(true)}
          aria-label="เปิดเมนู"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>
        <strong>
          ELITE FLOW <small>CONTENT STUDIO</small>
        </strong>
        <Link className="admin-mobile-view-site" href="/th" target="_blank" rel="noopener noreferrer">
          ดูเว็บไซต์ <ExternalLink size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="admin-desktop-nav">{navigation()}</div>
      {open && (
        <AdminDialog
          label="เมนูจัดการ"
          className="admin-drawer"
          onClose={() => setOpen(false)}
        >
          {navigation(true)}
        </AdminDialog>
      )}
    </>
  );
}
