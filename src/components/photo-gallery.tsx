"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { Locale } from "@/lib/types";

export default function PhotoGallery({
  images,
  title,
  locale,
  compact = false,
}: {
  images: string[];
  title: string;
  locale: Locale;
  compact?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(0);
  const th = locale === "th";
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [images]);
  const scroll = (direction: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  if (!images.length) return null;
  const move = (direction: number) =>
    setActive((index) => (index + direction + images.length) % images.length);
  const close = () => dialog.current?.close();
  return (
    <div className={`photo-gallery${compact ? " photo-gallery-compact" : ""}`}>
      <div className="gallery-rail-toolbar">
        <span>
          {images.length}{" "}
          {th ? "ภาพ · เลื่อนชมภาพเต็ม" : "photos · Explore the full frame"}
        </span>
        <div className="gallery-rail-controls">
          <button
            type="button"
            disabled={edges.start}
            onClick={() => scroll(-1)}
            aria-label={th ? "เลื่อนภาพไปทางซ้าย" : "Scroll photos left"}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            disabled={edges.end}
            onClick={() => scroll(1)}
            aria-label={th ? "เลื่อนภาพไปทางขวา" : "Scroll photos right"}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="gallery-rail"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            scroll(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {images.map((src, index) => (
          <button
            type="button"
            className="gallery-rail-slide"
            key={`${src}-${index}`}
            aria-label={`${th ? "เปิดภาพ" : "Open photo"} ${index + 1}: ${title}`}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(index);
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <Image
              src={src}
              fill
              sizes="(max-width: 700px) 90vw, 800px"
              onLoad={(event) => {
                const img = event.currentTarget;
                img.parentElement?.style.setProperty(
                  "--photo-ratio",
                  String(img.naturalWidth / img.naturalHeight),
                );
              }}
              alt={`${title} — ${index + 1}`}
            />
            <span className="photo-expand">
              <Expand size={17} />
            </span>
            <span className="photo-number">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label={title}
        onClose={() => {
          document.body.style.overflow = "";
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="photo-dialog-top">
          <span>{title}</span>
          <button
            autoFocus
            onClick={close}
            aria-label={th ? "ปิดภาพ" : "Close gallery"}
          >
            <X />
          </button>
        </div>
        <div className="photo-dialog-image">
          <Image
            src={images[active]}
            fill
            sizes="95vw"
            alt={`${title} — ${active + 1}`}
          />
        </div>
        <div className="photo-dialog-controls">
          <button
            onClick={() => move(-1)}
            aria-label={th ? "ภาพก่อนหน้า" : "Previous photo"}
          >
            <ArrowLeft />
          </button>
          <span aria-live="polite">
            {active + 1} / {images.length}
          </span>
          <button
            onClick={() => move(1)}
            aria-label={th ? "ภาพถัดไป" : "Next photo"}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </div>
  );
}
