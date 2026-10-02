import type { Content } from "./types";
const photos = (...names: string[]) =>
  names.map((name) => `/media/${name}.webp`);
// Curated photographs imported from the Elite Flow Facebook page.
// CMS galleries take precedence; these collections provide defaults for existing pages.
export const weddingPhotos = photos(
  "wedding",
  "wedding-garden",
  "wedding-joy",
  "wedding-couple",
  "wedding-moment",
  "wedding-procession",
  "bride",
  "weddingteam",
);
export const teamPhotos = photos(
  "backstage",
  "workshop",
  "weddingteam",
  "festival-conversation",
  "ceremony-host",
  "corporate",
);
const collections: Record<string, string[]> = {
  "meetings-conferences": photos(
    "conference-host",
    "workshop",
    "corporate",
    "ceremony",
  ),
  "ceremonies-launches": photos(
    "ceremony-host",
    "ceremony-family",
    "festival-conversation",
    "conference-host",
  ),
  "ceremonies-awards": photos(
    "conference-host",
    "festival-host",
    "ceremony-host",
  ),
  "corporate-celebrations": photos("conference", "conference-host", "workshop"),
  "exhibitions-activations": photos(
    "festival-conversation",
    "festival-host",
    "festival-team",
  ),
  "weddings-private-events": weddingPhotos,
  "team-activities-sports": photos(
    "festival",
    "festival-conversation",
    "workshop",
  ),
  "special-events": photos("backstage", "portrait", "pageant"),
  "isan-creative": photos(
    "festival-conversation",
    "festival-host",
    "festival-team",
  ),
};
export function eventPhotos(item: Content) {
  const gallery = item.gallery.length
    ? item.gallery
    : collections[item.slug] || [];
  const extra =
    item.kind === "project" && item.slug === "min-chat-wedding"
      ? weddingPhotos.filter(
          (src) =>
            !["/media/weddingteam.webp", "/media/bride.webp"].includes(src),
        )
      : [];
  return [...new Set([...gallery, ...extra])].filter(
    (src) => src !== item.image,
  );
}
