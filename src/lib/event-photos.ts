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
const migratedWeddingPhotos = [
  "/api/media/847b5eb8-9bd1-4607-b39e-233b4968f865",
  "/api/media/94cdc9da-3c39-48fb-beca-373832ed682d",
  "/api/media/9a3d658a-61fa-4155-a907-ed6c93da86f4",
  "/api/media/cf2c47f7-04dd-458f-90b0-f1e2397c9c4b",
  "/api/media/793a1196-0f18-4296-93fe-0085bf139119",
  "/api/media/dcaa7527-0e31-4a1a-a0ff-4495a7ad93d9",
];
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
      ? migratedWeddingPhotos
      : [];
  return [...new Set([...gallery, ...extra])].filter(
    (src) => src !== item.image,
  );
}
