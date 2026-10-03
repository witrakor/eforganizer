/** Publish reviewed local photo showcases to the localhost CMS. Resumable via reports/publish-progress.json. */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const base = 'http://localhost:3100';
const origin = base;
const root = process.cwd();
const manifestPath = path.resolve(root, process.argv[2] || 'reports/publish-manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const progressPath = path.resolve(root, process.argv[3] || 'reports/publish-progress.json');
const progress = await fs.readFile(progressPath, 'utf8').then(JSON.parse).catch(() => ({ uploads: {}, articles: {}, errors: [] }));
progress.uploads ||= {};
progress.articles ||= {};
progress.errors ||= [];
const verification = JSON.parse(await fs.readFile(path.join(root, 'reports/r2-connection-verification.json'), 'utf8'));
progress.uploads[verification.source] ||= verification.media.url;
const cookie = (await fs.readFile('/tmp/eliteflow-admin-cookie', 'utf8')).trim();
const headers = { Cookie: cookie, Origin: origin };
const save = async () => {
  const tmp = progressPath + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(progress, null, 2));
  await fs.rename(tmp, progressPath);
};
await save();
async function api(url, opts = {}) {
  const r = await fetch(base + url, { ...opts, headers: { ...headers, ...opts.headers } });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${url} HTTP ${r.status}: ${JSON.stringify(body)}`);
  return body;
}
let content = await api('/api/admin/content');
let media = await api('/api/admin/media');
if (!Array.isArray(content) || !Array.isArray(media)) throw new Error('Admin API unavailable');
const drafts = {39: 'royal-enfield-khon-kaen-grand-opening', 46: 'mice-safety-2025', 47: 'school-tour-khon-kaen-thiyod'};
let done = 0;
for (const item of manifest) {
  const resolvedSlug = item.draft ? (drafts[item.no] || item.slug) : item.slug;
  const current = content.find(c => c.kind === 'project' && c.slug === resolvedSlug);
  if (current?.status === 'published') {
    progress.articles[item.no] = { id: current.id, slug: current.slug, status: 'published', images: 1 + current.gallery.length, reused: true };
    await save();
    console.log(`SKIP ${item.no} already published ${current.slug}`);
    continue;
  }
  const urls = [];
  let failed = [];
  for (const source of item.paths) {
    if (progress.uploads[source]) { urls.push(progress.uploads[source]); continue; }
    try {
      let bytes = await fs.readFile(source);
      let filename = path.basename(source);
      let mime = filename.toLowerCase().endsWith('.png') ? 'image/png' : filename.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
      if (bytes.length > 12 * 1024 * 1024) {
        bytes = await sharp(bytes, { limitInputPixels: 80_000_000 }).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toBuffer();
        filename = filename.replace(/\.[^.]+$/, '.webp');
        mime = 'image/webp';
      }
      const form = new FormData();
      form.set('file', new File([bytes], filename, { type: mime }));
      const result = await api('/api/admin/media', { method: 'POST', body: form });
      progress.uploads[source] = result.url;
      urls.push(result.url);
      await save();
    } catch (e) {
      const reason = String(e.message || e);
      failed.push({ source, reason });
      progress.errors.push({ article: item.no, source, reason, at: new Date().toISOString() });
      await save();
      console.log(`IMAGE FAILED ${item.no} ${path.basename(source)} ${reason.slice(0, 140)}`);
    }
  }
  const selected = [...new Set(urls)];
  if (!selected.length) { console.log(`HOLD ${item.no} no uploaded images`); continue; }
  try {
    let doc = content.find(c => c.kind === 'project' && c.slug === resolvedSlug);
    if (!doc) {
      const created = await api('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'project' }) });
      doc = content.find(c => c.id === created.id);
      if (!doc) doc = { id: created.id, kind: 'project', slug: 'new-' + created.id.slice(0, 8), status: 'draft', image: '', gallery: [], category: '', featured: false, sortOrder: 100, date: new Date().toISOString().slice(0, 10), th: { title: '', subtitle: '', description: '', body: '', eyebrow: '', seoTitle: '', seoDescription: '', items: [] }, en: { title: '', subtitle: '', description: '', body: '', eyebrow: '', seoTitle: '', seoDescription: '', items: [] }, version: 1 };
      progress.articles[item.no] = { id: doc.id, slug: item.slug, status: 'draft' };
      await save();
    }
    const targetSlug = resolvedSlug;
    const updated = {
      ...doc,
      slug: targetSlug,
      status: 'published',
      image: selected[0],
      gallery: selected.slice(1, 31),
      category: doc.category || item.category,
      sortOrder: item.no,
      date: item.eventDate || (doc.slug.startsWith('new-') ? new Date().toISOString().slice(0, 10) : doc.date),
      eventDate: item.eventDate || doc.eventDate,
      th: { ...doc.th, title: item.titleTh, body: item.titleTh, seoTitle: item.titleTh },
      en: { ...doc.en, title: item.titleEn, body: item.titleEn, seoTitle: item.titleEn },
    };
    delete updated.updatedAt;
    const saved = await api(`/api/admin/content/${doc.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    doc = { ...updated, version: saved.version };
    content.push(doc);
    progress.articles[item.no] = { id: doc.id, slug: targetSlug, status: 'published', images: selected.length, failedImages: failed.length };
    await save();
    done++;
    console.log(`PUBLISHED ${item.no} ${targetSlug} images=${selected.length} failed=${failed.length}`);
  } catch (e) {
    const reason = String(e.message || e);
    progress.errors.push({ article: item.no, reason, at: new Date().toISOString() });
    await save();
    console.log(`ARTICLE FAILED ${item.no} ${reason.slice(0, 300)}`);
  }
}
media = await api('/api/admin/media');
content = await api('/api/admin/content');
const mapped = Object.values(progress.uploads).filter(Boolean);
const mappedRecords = new Map(media.map(x => [x.url, x]));
const nonR2 = mapped.filter(url => mappedRecords.get(url)?.driver !== 'r2');
const published = manifest.filter(x => content.some(c => c.kind === 'project' && c.slug === (x.draft ? (drafts[x.no] || x.slug) : x.slug) && c.status === 'published'));
console.log(JSON.stringify({ completedThisRun: done, manifestArticles: manifest.length, published: published.length, uploaded: mapped.length, nonR2: nonR2.length, errors: progress.errors.length }));
