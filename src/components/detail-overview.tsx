"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";

export default function DetailOverview({
  image,
  title,
  children,
}: {
  image: string;
  title: string;
  children: ReactNode;
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
    </section>
  );
}
