/** Keep legacy projects' configured primary dates visible when no date review flagged them. */
import fs from 'node:fs/promises';
const base = 'http://localhost:3100';
const cookie = (await fs.readFile('/tmp/eliteflow-admin-cookie', 'utf8')).trim();
const response = await fetch(`${base}/api/admin/content`, { headers: { Cookie: cookie } });
if (!response.ok) throw Error(`GET HTTP ${response.status}`);
const documents = await response.json();
let updatedCount = 0;
for (const item of documents.filter((doc) => doc.kind === 'project' && !doc.eventDate && !doc.eventDateStatus && doc.hidePublicDate)) {
  const document = { ...item, hidePublicDate: false };
  delete document.updatedAt;
  const saved = await fetch(`${base}/api/admin/content/${item.id}`, {
    method: 'PUT',
    headers: { Cookie: cookie, Origin: base, 'Content-Type': 'application/json' },
    body: JSON.stringify(document),
  });
  if (!saved.ok) throw Error(`${item.slug}: HTTP ${saved.status}: ${await saved.text()}`);
  updatedCount++;
}
console.log(JSON.stringify({ updatedCount }));
