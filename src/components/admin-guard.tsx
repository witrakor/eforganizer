"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const Guard = createContext({
  setDirty: (_: boolean) => {},
  confirmLeave: (): boolean => true,
});
export const useAdminGuard = () => useContext(Guard);
export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dirty, setDirty] = useState(false);
  const current = useRef(false);
  current.current = dirty;
  const path = usePathname();
  useEffect(() => {
    setDirty(false);
  }, [path]);
  const confirmLeave = useCallback(
    () =>
      !current.current ||
      window.confirm("มีการแก้ไขที่ยังไม่บันทึก ต้องการออกจากหน้านี้หรือไม่?"),
    [],
  );
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (current.current) e.preventDefault();
    };
    const click = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !link ||
        link.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        link.hasAttribute("download")
      )
        return;
      if (
        link.origin === location.origin &&
        link.pathname === location.pathname &&
        link.search === location.search
      )
        return;
      if (!confirmLeave()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // Navigation API also protects browser Back/Forward where supported.
    const navigation = (window as Window & { navigation?: EventTarget })
      .navigation;
    const navigate = (e: Event) => {
      if (
        (e as Event & { navigationType?: string }).navigationType ===
          "traverse" &&
        e.cancelable &&
        !confirmLeave()
      )
        e.preventDefault();
    };
    window.addEventListener("beforeunload", before);
    document.addEventListener("click", click, true);
    navigation?.addEventListener("navigate", navigate);
    return () => {
      window.removeEventListener("beforeunload", before);
      document.removeEventListener("click", click, true);
      navigation?.removeEventListener("navigate", navigate);
    };
  }, [confirmLeave]);
  return (
    <Guard.Provider value={{ setDirty, confirmLeave }}>
      {children}
    </Guard.Provider>
  );
}
