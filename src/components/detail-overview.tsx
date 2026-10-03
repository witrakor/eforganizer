"use client";

import { coverImageStyle } from "@/lib/content-images";
import type { Content } from "@/lib/types";
import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";

export default function DetailOverview({
  image,
  imageFocal,
  title,
  children,
  body,
}: {
  image: string;
  imageFocal?: Content["imageFocal"];
  title: string;
  children: ReactNode;
  body: ReactNode;
}) {
  const [photo, setPhoto] = useState({ src: image, ratio: 1.5 });
  const ratio = photo.src === image ? photo.ratio : 1.5;
  return (
    <section
      className={`container detail-overview${image ? "" : " detail-overview-no-image"}`}
      style={{ "--cover-ratio": ratio } as CSSProperties}
    >
      {image && (
        <div className="detail-overview-photo">
          <Image
            src={image}
            style={coverImageStyle({ imageFocal })}
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1280px) 65vw, 800px"
            preload
            alt={title}
            onLoad={(event) => {
              const img = event.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setPhoto({
                  src: image,
                  ratio: img.naturalWidth / img.naturalHeight,
                });
              }
            }}
          />
        </div>
      )}
      <div className="detail-overview-summary">{children}</div>
      {body}
    </section>
  );
}
