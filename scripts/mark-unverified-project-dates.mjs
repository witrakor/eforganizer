/** Mark imported projects whose event date cannot be confirmed from source photos. */
import fs from 'node:fs/promises';
import path from 'node:path';
const base='http://localhost:3100';
const root=process.cwd();
const cookie=(await fs.readFile('/tmp/eliteflow-admin-cookie','utf8')).trim();
const plan=JSON.parse(await fs.readFile(path.join(root,'reports/project-date-plan.json'),'utf8'));
const response=await fetch(`${base}/api/admin/content`,{headers:{Cookie:cookie}});
if(!response.ok)throw Error(`GET HTTP ${response.status}`);
const content=await response.json();
let done=0;
for(const item of plan.filter(x=>x.status==='conflict'||x.status==='no_exact_date')){
 const doc=content.find(x=>x.kind==='project'&&x.slug===item.slug);
 if(!doc)throw Error(`Missing ${item.slug}`);
 const status=item.status==='conflict'?'conflict':'unknown';
 if(doc.eventDateStatus===status&&doc.eventDateReviewNote===item.source)continue;
 if(doc.eventDate)throw Error(`Unexpected eventDate on ${item.slug}`);
 const updated={...doc,eventDateStatus:status,eventDateReviewNote:item.source};delete updated.updatedAt;
 const r=await fetch(`${base}/api/admin/content/${doc.id}`,{method:'PUT',headers:{Cookie:cookie,Origin:base,'Content-Type':'application/json'},body:JSON.stringify(updated)});
 if(!r.ok)throw Error(`${item.slug} HTTP ${r.status}: ${await r.text()}`);
 done++;console.log(`MARKED ${item.slug} ${status}`);
}
console.log(JSON.stringify({marked:done,planned:plan.filter(x=>x.status!=='update').length}));
