"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <form className="login-form" onSubmit={submit}>
      <span className="eyebrow">WELCOME BACK</span>
      <h2>เข้าสู่ระบบจัดการ</h2>
      <p>จัดการเนื้อหา รูปภาพ และข้อความติดต่อของ Elite Flow</p>
      <label className="field-label">
        อีเมล
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@company.com"
        />
      </label>
      <label className="field-label">
        รหัสผ่าน
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
        />
      </label>
      <button
        type="button"
        className="text-link"
        aria-pressed={showPassword}
        onClick={() => setShowPassword((v) => !v)}
      >
        {showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      </button>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
