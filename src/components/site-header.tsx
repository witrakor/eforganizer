"use client";
import Link from "./site-link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Locale } from "@/lib/types";
import { LineIcon, LINE_CONTACT_URL } from "./line-contact";
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        e<span>f</span>
        <i />
      </span>
      <span>
        ELITE FLOW<small>EVENT ORGANIZER</small>
      </span>
    </span>
  );
}
export default function Header({ locale: l }: { locale: Locale }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = l;
  }, [l]);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  const links = [
    ["services", l === "th" ? "บริการของเรา" : "Expertise"],
    ["work", l === "th" ? "ผลงาน" : "Our work"],
    ["about", l === "th" ? "รู้จักเรา" : "About"],
    ["journal", l === "th" ? "บทความ" : "Journal"],
  ];
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href={`/${l}`} aria-label="Elite Flow home">
          <Brand />
        </Link>
        <nav
          id="main-navigation"
          onClick={() => setOpen(false)}
          className={open ? "nav-links open" : "nav-links"}
          aria-label={l === "th" ? "เมนูหลัก" : "Main navigation"}
        >
          {links.map(([slug, label]) => (
            <Link
              key={slug}
              className={path.includes(`/${slug}`) ? "active" : ""}
              href={`/${l}/${slug}`}
            >
              {label}
            </Link>
          ))}
          <Link className="mobile-contact" href={`/${l}/contact`}>
            {l === "th" ? "คุยเรื่องงานของคุณ" : "Let’s talk"}
          </Link>
        </nav>
        <div className="nav-actions">
          <Link
            className="language"
            href={path.replace(/^\/(th|en)/, l === "th" ? "/en" : "/th")}
            aria-label={l === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            {l === "th" ? (
              <>
                <b>TH</b>
                <span>/</span>EN
              </>
            ) : (
              <>
                TH<span>/</span>
                <b>EN</b>
              </>
            )}
          </Link>
          <Link
            className="button button-small header-cta"
            href={`/${l}/contact`}
          >
            {l === "th" ? "คุยเรื่องงานของคุณ" : "Let’s talk"}
            <ArrowUpRight size={16} />
          </Link>
          <a
            className="header-line"
            href={LINE_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l === "th" ? "ติดต่อผ่าน LINE" : "Contact us on LINE"}
          >
            <LineIcon size={27} />
          </a>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="main-navigation"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
