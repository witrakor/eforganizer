"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import type { HeroSlide } from "@/lib/home-content";
import type { Locale } from "@/lib/types";
import Link from "./site-link";

type HeroPhoto = HeroSlide;

export default function HeroSlideshow({
  slides,
  locale,
}: {
  slides: HeroPhoto[];
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [compact, setCompact] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const th = locale === "th";
  const multiple = slides.length > 1;
  const playing =
    multiple && !paused && !hovered && visible && !reducedMotion && !compact;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 700px)");
    const update = () => {
      setReducedMotion(preference.matches);
      setCompact(mobile.matches);
    };
    update();
    preference.addEventListener("change", update);
    mobile.addEventListener("change", update);
    let onScreen = false;
    const visibility = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        visibility();
      },
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % slides.length),
      7000,
    );
    return () => window.clearTimeout(timer);
  }, [playing, active, slides.length]);

  function select(index: number) {
    setPaused(true);
    setActive((index + slides.length) % slides.length);
  }
  return (
    <div
      className="hero-showcase"
      ref={root}
      role="region"
      aria-roledescription={th ? "สไลด์ภาพผลงาน" : "carousel"}
      aria-label={th ? "ภาพบรรยากาศงานอีเวนต์" : "Event photography"}
      tabIndex={compact && multiple ? 0 : undefined}
      onKeyDown={(event) => {
        if (!compact || !multiple || event.target !== event.currentTarget)
          return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(active + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current =
          event.touches.length === 1
            ? { x: touch.clientX, y: touch.clientY }
            : null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || !multiple) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          select(active + (dx < 0 ? 1 : -1));
        }
      }}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest(".hero-showcase-pause"))
          setPaused(true);
      }}
    >
      <div className="hero-showcase-stage">
        {slides.map((slide, index) => (
          <div
            key={`${slide.contentKind ?? "project"}-${slide.contentId ?? slide.projectId}-${slide.image}-${index}`}
            className="hero-showcase-slide"
            data-active={index === active}
            aria-hidden={index !== active}
            style={
              {
                "--photo-position": `${slide.x}% ${slide.y}%`,
                "--photo-mobile-position": `${slide.mobileX}% ${slide.mobileY}%`,
              } as CSSProperties
            }
          >
            <Image
              src={slide.image}
              fill
              preload={index === 0}
              quality={95}
              sizes="(max-width: 700px) 100vw, (max-width: 1280px) 94vw, 1180px"
              alt={slide.title}
            />
          </div>
        ))}
        <span className="hero-showcase-tag">REAL EVENTS. REAL EXPERIENCE.</span>
        <span className="hero-showcase-mark" aria-hidden="true">
          ef.
        </span>
      </div>
      <div className="hero-showcase-bar">
        <div
          className="hero-showcase-caption"
          aria-live={paused ? "polite" : "off"}
          aria-atomic="true"
        >
          <span className="hero-showcase-index">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <div className="hero-showcase-story">
            <Link
              className="hero-showcase-story-link"
              href={slides[active].href}
            >
              <strong>{slides[active].title}</strong>
            </Link>
            {slides[active].role && (
              <span>
                <span>{slides[active].role}</span>
              </span>
            )}
            <ArrowUpRight size={18} aria-hidden="true" />
          </div>
        </div>
        {multiple && (
          <div className="hero-showcase-controls">
            <button
              type="button"
              onClick={() => select(active - 1)}
              aria-label={th ? "ภาพก่อนหน้า" : "Previous image"}
            >
              <ArrowLeft size={19} />
            </button>
            <div className="hero-showcase-dots">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={(th ? "แสดงภาพ " : "Show image ") + (index + 1)}
                  aria-pressed={index === active}
                  onClick={() => select(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => select(active + 1)}
              aria-label={th ? "ภาพถัดไป" : "Next image"}
            >
              <ArrowRight size={19} />
            </button>
            {!reducedMotion && (
              <button
                type="button"
                className="hero-showcase-pause"
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused
                    ? th
                      ? "เล่นภาพอัตโนมัติ"
                      : "Play slideshow"
                    : th
                      ? "หยุดภาพอัตโนมัติ"
                      : "Pause slideshow"
                }
              >
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
