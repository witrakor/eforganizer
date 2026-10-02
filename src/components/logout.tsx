"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export default function Logout() {
  const router = useRouter();
  return (
    <button
      className="icon-button"
      aria-label="ออกจากระบบ"
      title="ออกจากระบบ"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      <LogOut size={15} />
    </button>
  );
}
