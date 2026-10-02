"use client";
import { useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const storageKey = "eliteflow-scroll-v1";
export default function NavigationState() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = useRef("");
  const positions = useRef<Record<string, number>>({});
  const entry = useRef("");
  const initialized = useRef(false);

  useLayoutEffect(() => {
    try {
      positions.current = JSON.parse(
        sessionStorage.getItem(storageKey) || "{}",
      );
    } catch {
      /* Storage may be disabled. */
    }
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const save = () => {
      if (!entry.current) return;
      positions.current[entry.current] = window.scrollY;
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify(
            Object.fromEntries(Object.entries(positions.current).slice(-80)),
          ),
        );
      } catch {
        /* Keep in-memory restoration. */
      }
    };
    const track = () => {
      if (entry.current) positions.current[entry.current] = window.scrollY;
    };
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("pagehide", save);
    document.addEventListener("click", save, true);
    return () => {
      save();
      history.scrollRestoration = previous;
      window.removeEventListener("scroll", track);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("click", save, true);
    };
  }, []);

  useLayoutEffect(() => {
    const url = location.pathname + location.search;
    const first = !initialized.current;
    // Next may commit synchronously inside its popstate listener before later listeners run.
    // Identify a history traversal by the destination entry instead of event ordering.
    const back =
      !first &&
      !!history.state?.efEntry &&
      history.state.efEntry !== entry.current;
    const changedPage = current.current !== pathname;
    if (!history.state?.efEntry || (!back && changedPage && !first)) {
      history.replaceState(
        { ...history.state, efEntry: crypto.randomUUID() },
        "",
      );
    }
    entry.current = history.state.efEntry;
    initialized.current = true;
    current.current = pathname;
    if (!/\/(th|en)(\/|$)/.test(pathname)) return;
    const y =
      back || first
        ? positions.current[entry.current]
        : changedPage
          ? 0
          : undefined;
    if (y === undefined || location.hash) return;
    // Layout effects run after the destination DOM commits. A frame also catches router focus work.
    window.scrollTo({ top: y, behavior: "instant" });
    const frame = requestAnimationFrame(() => {
      if (location.pathname + location.search === url)
        window.scrollTo({ top: y, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search]);
  return null;
}
