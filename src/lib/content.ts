import { query } from "./db";
import type { Content, Media } from "./types";
type Row = {
  id: string;
  document: Content | string;
  version: number;
  updated_at: string;
};
const parse = (r: Row): Content => ({
  ...(typeof r.document === "string" ? JSON.parse(r.document) : r.document),
  version: r.version,
  updatedAt: r.updated_at,
});
export async function contents(kind?: string, admin = false) {
  const rows = await query<Row[]>(
    `SELECT * FROM content WHERE status <> 'deleted' ${kind ? "AND kind = ?" : ""} ${admin ? "" : "AND status = 'published'"}`,
    kind ? [kind] : [],
  );
  return rows.map(parse).sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.kind === "project" || a.kind === "post") {
      if (a.kind === "project") {
        const aUndated = a.hidePublicDate ? 1 : 0;
        const bUndated = b.hidePublicDate ? 1 : 0;
        if (aUndated !== bUndated) return aUndated - bUndated;
        if (aUndated) return a.sortOrder - b.sortOrder;
      }
      const aDate = a.kind === "project" ? a.eventDate || a.date : a.date;
      const bDate = b.kind === "project" ? b.eventDate || b.date : b.date;
      return bDate.localeCompare(aDate) || a.sortOrder - b.sortOrder;
    }
    return a.sortOrder - b.sortOrder || b.date.localeCompare(a.date);
  });
}
export async function content(kind: string, slug: string, admin = false) {
  const r = await query<Row[]>(
    `SELECT * FROM content WHERE kind=? AND slug=? AND status <> 'deleted' ${admin ? "" : "AND status='published'"}`,
    [kind, slug],
  );
  return r[0] ? parse(r[0]) : null;
}
export async function contentById(id: string) {
  const r = await query<Row[]>(
    "SELECT * FROM content WHERE id=? AND status <> 'deleted'",
    [id],
  );
  return r[0] ? parse(r[0]) : null;
}
export async function mediaList(all = false) {
  return query<Media[]>(
    `SELECT id,name,url,mime,size,alt,source,driver,storage_key AS storageKey,created_at AS createdAt,deleted_at AS deletedAt FROM media ${all ? "" : "WHERE deleted_at IS NULL"} ORDER BY created_at DESC`,
  );
}
