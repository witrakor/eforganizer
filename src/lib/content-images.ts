import type { Content } from "./types";

export function contentImageUrls(content: Content): string[] {
  const urls = [content.image, ...content.gallery];
  for (const body of [content.th.body, content.en.body]) {
    for (const match of body.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi))
      urls.push(match[1]);
    for (const match of body.matchAll(
      /!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g,
    ))
      urls.push(match[1]);
  }
  return [...new Set(urls.filter(Boolean))];
}

export function changeContentCover(content: Content, image: string) {
  const gallery = [...new Set(content.gallery)].filter((url) => url !== image);
  if (
    content.image &&
    content.image !== image &&
    !gallery.includes(content.image)
  ) {
    const position = content.gallery.indexOf(image);
    gallery.splice(position < 0 ? gallery.length : position, 0, content.image);
  }
  if (gallery.length > 30)
    throw new Error(
      "แกลเลอรีเต็ม 30 ภาพ กรุณานำภาพออกก่อนเปลี่ยนปกเป็นภาพใหม่",
    );
  return {
    image,
    gallery,
    coverOverride: true,
    imageFocal: image === content.image ? content.imageFocal : undefined,
  };
}

export function coverImageStyle(content: Pick<Content, "imageFocal">) {
  return {
    objectFit: "cover" as const,
    objectPosition: `${content.imageFocal?.x ?? 50}% ${content.imageFocal?.y ?? 50}%`,
  };
}
