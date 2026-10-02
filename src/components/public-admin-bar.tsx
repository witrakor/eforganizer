"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type CreateKind = "post" | "project" | "service" | "page";

export default function PublicAdminBar({
  editHref,
  kind,
  listKind,
}: {
  editHref: string | null;
  kind: string;
  listKind: CreateKind | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listTarget, setListTarget] = useState<HTMLElement | null>(null);
  const generation = useRef(0);
  const working = useRef(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    async function refresh() {
      if (working.current || document.visibilityState === "hidden") return;
      const version = ++generation.current;
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          signal: controller.signal,
        });
        const session = response.ok ? await response.json() : null;
        if (!disposed && version === generation.current) {
          const expiry = Number(session?.expiresAt);
          setExpiresAt(
            session?.authenticated && expiry > Date.now() ? expiry : null,
          );
        }
      } catch {
        if (!disposed && version === generation.current) setExpiresAt(null);
      }
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === "eliteflow-auth-change") void refresh();
    };
    void refresh();
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname]);

  useEffect(() => {
    if (!expiresAt) return;
    const timeout = window.setTimeout(
      () => setExpiresAt(null),
      Math.max(0, expiresAt - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [expiresAt]);

  useEffect(() => {
    setListTarget(
      listKind ? document.getElementById("public-admin-list-actions") : null,
    );
  }, [listKind, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menu.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  async function act(createKind?: CreateKind) {
    if (working.current) return;
    working.current = true;
    generation.current++;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        createKind ? "/api/admin/content" : "/api/auth/logout",
        {
          method: "POST",
          ...(createKind
            ? {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kind: createKind }),
              }
            : {}),
        },
      );
      if (!response.ok) {
        if (response.status === 401 || response.status === 403)
          setExpiresAt(null);
        throw new Error(
          "ทำรายการไม่สำเร็จ กรุณาลองใหม่ หรือเข้าสู่ระบบอีกครั้งที่ /admin",
        );
      }
      if (createKind) {
        const result = await response.json();
        router.push(result.href);
      } else {
        setExpiresAt(null);
        setMenuOpen(false);
        try {
          localStorage.setItem("eliteflow-auth-change", String(Date.now()));
        } catch {}
        router.refresh();
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่",
      );
    } finally {
      working.current = false;
      setBusy(false);
    }
  }

  if (!expiresAt) return null;
  const editLabel =
    kind === "post"
      ? "แก้ไขบทความนี้"
      : kind === "project"
        ? "แก้ไขผลงานนี้"
        : "แก้ไขหน้านี้";
  return (
    <>
      <div className="public-admin-bar" aria-label="เครื่องมือผู้ดูแล">
        <div className="public-admin-inner">
          <span className="public-admin-status">
            ● ผู้ดูแล
            <span className="public-admin-desktop"> · เข้าสู่ระบบแล้ว</span>
          </span>
          <nav aria-label="เมนูผู้ดูแล">
            {editHref && (
              <Link
                className="public-admin-edit"
                href={editHref}
                prefetch={false}
              >
                <span className="public-admin-desktop">{editLabel}</span>
                <span className="public-admin-mobile">แก้ไข</span>
              </Link>
            )}
            <div className="public-admin-menu" ref={menu}>
              <button
                type="button"
                aria-label="เพิ่มเนื้อหา"
                aria-expanded={menuOpen}
                aria-controls="public-admin-menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="public-admin-desktop">+ เพิ่มเนื้อหา</span>
                <span className="public-admin-mobile">+ เพิ่ม</span>
              </button>
              {menuOpen && (
                <div className="public-admin-dropdown" id="public-admin-menu">
                  <button disabled={busy} onClick={() => act("post")}>
                    + เพิ่มบทความ
                  </button>
                  <button disabled={busy} onClick={() => act("project")}>
                    + เพิ่มผลงาน
                  </button>
                  <button disabled={busy} onClick={() => act("service")}>
                    + เพิ่มบริการ
                  </button>
                  <button disabled={busy} onClick={() => act("page")}>
                    + เพิ่มหน้าเว็บ
                  </button>
                </div>
              )}
            </div>
            <Link href="/admin" prefetch={false}>
              หลังบ้าน
            </Link>
            <button disabled={busy} onClick={() => act()}>
              ออกจากระบบ
            </button>
          </nav>
        </div>
        {error && (
          <p className="public-admin-error" role="alert">
            {error}
          </p>
        )}
        {busy && (
          <span className="sr-only" role="status">
            กำลังดำเนินการ
          </span>
        )}
      </div>
      {listKind &&
        listTarget &&
        createPortal(
          <button
            className="public-admin-list-add"
            disabled={busy}
            onClick={() => act(listKind)}
          >
            + {listKind === "post" ? "เพิ่มบทความ" : "เพิ่มผลงาน"}
          </button>,
          listTarget,
        )}
    </>
  );
}
