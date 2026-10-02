import "../admin.css";
import AdminGuard from "@/components/admin-guard";
import Logout from "@/components/logout";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin-nav";
export const dynamic = "force-dynamic";
export const metadata = {
  title: { absolute: "Content Studio | Elite Flow" },
  robots: { index: false, follow: false },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <AdminGuard>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-main">
          <div className="admin-topbar">
            <strong>ELITE FLOW / CONTENT STUDIO</strong>
            <div className="editor-top">
              <span>{admin.email}</span>
              <Logout />
            </div>
          </div>
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
