"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "./site-link";
import type { Relationship } from "@/lib/home-content";
import type { Locale } from "@/lib/types";

export function ClientOrbit({
  items,
  locale,
}: {
  items: Relationship[];
  locale: Locale;
}) {
  const field = useRef<HTMLDivElement>(null);
  const angle = useRef(0.25);
  const interacting = useRef(false);

  useEffect(() => {
    const element = field.current;
    if (!element) return;
    const satellites = Array.from(
      element.querySelectorAll<HTMLElement>(".client-satellite"),
    );
    const staticMode = window.matchMedia(
      "(max-width: 650px), (prefers-reduced-motion: reduce)",
    );
    let width = element.clientWidth;
    let visible = false;
    let frame = 0;
    let lastTime = 0;

    // Project an elliptical orbit through a perspective camera. Portraits stay
    // facing the viewer, while their depth controls scale and stacking order.
    const draw = () => {
      satellites.forEach((satellite, index) => {
        const phase = angle.current + (index / satellites.length) * Math.PI * 2;
        const depth = Math.cos(phase);
        const perspective = 700 / (700 - depth * 240);
        const x =
          Math.sin(phase) *
          Math.max(0, Math.min(195, width / 2 - 95)) *
          perspective;
        const y = depth * 78 + Math.sin(phase * 2) * 18;
        satellite.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${perspective * 0.76})`;
        satellite.style.opacity = `${0.55 + ((depth + 1) / 2) * 0.45}`;
        satellite.style.setProperty(
          "--caption-opacity",
          `${Math.max(0, Math.min(1, (depth - 0.15) * 3))}`,
        );
        satellite.style.zIndex = `${Math.round((depth + 1) * 100)}`;
      });
    };
    const tick = (time: number) => {
      if (lastTime && !interacting.current) {
        angle.current += (Math.min(time - lastTime, 50) / 55000) * Math.PI * 2;
        draw();
      }
      lastTime = time;
      frame = requestAnimationFrame(tick);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      const active = visible && !document.hidden && !staticMode.matches;
      element.dataset.active = String(active);
      if (active) {
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      draw();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    });
    draw();
    element.dataset.ready = "true";
    resize.observe(element);
    visibility.observe(element);
    staticMode.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      staticMode.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, [items]);

  return (
    <div className="client-universe">
      <div
        ref={field}
        className="client-orbit"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") interacting.current = true;
        }}
        onPointerLeave={() => {
          interacting.current = !!field.current?.contains(
            document.activeElement,
          );
        }}
        onFocusCapture={() => {
          interacting.current = true;
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            interacting.current = event.currentTarget.matches(":hover");
          }
        }}
      >
        <div className="client-stardust" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <i
              key={index}
              style={
                {
                  "--star-x": `${8 + ((index * 37) % 85)}%`,
                  "--star-y": `${8 + ((index * 23) % 76)}%`,
                  "--star-size": `${index % 5 === 0 ? 4 : 2}px`,
                  "--star-delay": `${index * -0.7}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="client-orbit-ring" aria-hidden="true" />
        {items.map((item) => {
          const content = (
            <>
              <div className="client-portrait">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item[locale].name}
                    fill
                    sizes="(max-width: 650px) 65vw, 210px"
                  />
                )}
              </div>
              <strong>{item[locale].name}</strong>
              <span>{item[locale].detail}</span>
            </>
          );
          return (
            <div className="client-satellite" key={item.id}>
              {item.href ? (
                <Link
                  className="client-story"
                  href={item.href.replace(/^\/(th|en)(?=\/)/, `/${locale}`)}
                >
                  {content}
                </Link>
              ) : (
                <div className="client-story">{content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
