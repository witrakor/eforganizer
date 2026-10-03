/** Apply reviewed project dates from reports/project-date-plan.json to localhost CMS. */
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const base = 'http://localhost:3100';
const cookie = (await fs.readFile('/tmp/eliteflow-admin-cookie', 'utf8')).trim();
const plan = JSON.parse(await fs.readFile(path.join(root, 'reports/project-date-plan.json'), 'utf8'));
const headers = { Cookie: cookie, Origin: base };
const response = await fetch(`${base}/api/admin/content`, { headers });
if (!response.ok) throw new Error(`GET content HTTP ${response.status}`);
const content = await response.json();
const projects = new Map(content.filter((item) => item.kind === 'project').map((item) => [item.slug, item]));
const missing = plan.filter((item) => !projects.has(item.slug));
if (missing.length) throw new Error(`Missing projects: ${missing.map((item) => item.slug).join(', ')}`);
const beforePath = path.join(root, 'reports/project-date-before.json');
try {
  await fs.access(beforePath);
} catch {
  await fs.writeFile(beforePath, JSON.stringify(plan.map((item) => {
    const project = projects.get(item.slug);
    return { slug: item.slug, id: project.id, date: project.date, eventDate: project.eventDate || null, eventDateEnd: project.eventDateEnd || null };
  }), null, 2));
}
const progressPath = path.join(root, 'reports/project-date-progress.json');
const progress = await fs.readFile(progressPath, 'utf8').then(JSON.parse).catch(() => ({ updated: {}, errors: [] }));
progress.updated ||= {};
progress.errors ||= [];
async function save() {
  const tmp = `${progressPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(progress, null, 2));
  await fs.rename(tmp, progressPath);
}
let applied = 0;
for (const item of plan.filter((item) => item.status === 'update')) {
  const project = projects.get(item.slug);
  if (project.date === item.proposedDate && project.eventDate === item.proposedDate) {
    progress.updated[item.slug] = item.proposedDate;
    continue;
  }
  const updated = { ...project, date: item.proposedDate, eventDate: item.proposedDate };
  delete updated.updatedAt;
  try {
    const response = await fetch(`${base}/api/admin/content/${project.id}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${await response.text()}`);
    progress.updated[item.slug] = item.proposedDate;
    await save();
    applied++;
    console.log(`DATED ${item.slug} ${item.proposedDate}`);
  } catch (error) {
    progress.errors.push({ slug: item.slug, reason: String(error), at: new Date().toISOString() });
    await save();
    console.log(`FAILED ${item.slug} ${error}`);
  }
}
await save();
console.log(JSON.stringify({ applied, planned: plan.filter((item) => item.status === 'update').length, skipped: plan.filter((item) => item.status !== 'update').length, errors: progress.errors.length }));
