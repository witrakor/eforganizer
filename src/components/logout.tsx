"use client";
import { useAdminGuard } from "./admin-guard";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export default function Logout() {
  const router = useRouter();
  const { confirmLeave } = useAdminGuard();
  return (
    <button
      className="icon-button"
      aria-label="ออกจากระบบ"
      title="ออกจากระบบ"
      onClick={async () => {
        if (!confirmLeave()) return;
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      <LogOut size={15} />
    </button>
  );
}
