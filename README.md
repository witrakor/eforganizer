# Elite Flow — Event Organizer

เว็บไซต์สองภาษา (ไทย / อังกฤษ) พร้อม Content Studio สำหรับทีม Elite Flow

## สิ่งที่มี

- Next.js App Router + TypeScript, responsive UI, IBM Plex Sans Thai + Manrope ที่ให้บริการจากเว็บเอง
- หน้าแรก บริการ 6 หมวด หน้าบริการเฉพาะ ผลงานพร้อมตัวกรอง เกี่ยวกับเรา บทความ หน้ารายละเอียด และติดต่อ
- MySQL 8.4: เนื้อหา ผู้ดูแล เซสชัน ไฟล์ และข้อความติดต่อ
- CMS: แก้ไทย/อังกฤษ, Markdown + preview, SEO, draft/publish, รูปหลัก/แกลเลอรี และตรวจ conflict เมื่อแก้จากหลายหน้าต่าง
- Media: JPG/PNG/WebP/AVIF/PDF, ลดขนาดภาพเป็น WebP, แก้ alt/เครดิต, ถังขยะและกู้คืน, ป้องกันลบรูปที่ถูกใช้งาน
- บรีฟงานบันทึกลง MySQL; ผู้ดูแลเปลี่ยนสถานะได้ ยังไม่มีการส่งอีเมลแจ้งเตือน
- R2 S3 adapter และ local persistent storage; R2 bucket ไม่ต้อง public เพราะเว็บอ่านผ่าน `/api/media/:id`
- Docker standalone สำหรับ Easypanel, health check, seed แบบไม่เขียนทับข้อมูลเดิม

## เปิดบนเครื่องนี้

- Website: http://localhost:3100/th
- English: http://localhost:3100/en
- Admin: http://localhost:3100/admin
- บัญชีผู้ดูแล: ดู `LOCAL-ACCESS.txt` (ไฟล์ส่วนตัว ไม่อยู่ใน Git)

```sh
npm ci
node scripts/setup-local.mjs
docker compose --env-file .env.local -f compose.db.yml -p eliteflow up -d
npm run db:init
npm run dev
```

เว็บ preview ที่เปิดทิ้งไว้รันด้วย Docker container `eliteflow-web` และ restart อัตโนมัติเมื่อ Docker กลับมาทำงาน
หากต้องเริ่มใหม่: `docker start eliteflow-db-1 eliteflow-web`
การเปลี่ยนโค้ดต้อง rebuild image และ recreate web container; ไม่กระทบ MySQL/ไฟล์ใน volume
ใช้ `docker compose -f compose.preview.yml up -d` เมื่อต้องสร้าง preview container ใหม่จาก image ที่ build แล้ว (ใช้ `.env.docker.local` ส่วนตัว)

MySQL ของโปรเจกต์นี้เปิดเฉพาะ `127.0.0.1:3318` แยกจากฐานข้อมูลโปรเจกต์อื่น
`setup-local.mjs` สร้างค่าใหม่เมื่อยังไม่มี `.env.local` เท่านั้น ห้ามนำบัญชีตัวอย่างไปใช้บน production

## ตรวจสอบ

```sh
npm run typecheck
npm run build
# Start the site before API integration tests:
npm test
```

Integration tests สร้างและลบเฉพาะข้อมูลที่ใช้ทดสอบ: ตรวจรหัสผ่าน, หน้าไทย/อังกฤษ, auth/CSRF, draft/publish/conflict, inquiry และ upload/trash/restore
อย่ารัน integration tests บน production

## วิธีใช้ Content Studio

1. เข้า `/admin` ด้วยบัญชีในไฟล์ส่วนตัว
2. **จัดการเนื้อหา**: เลือกหน้า บริการ ผลงาน หรือบทความ
3. แก้แท็บ **ภาษาไทย** และ **English**, เลือกภาพจากคลัง แล้วกด **บันทึก**
4. เนื้อหาใหม่เริ่มเป็นฉบับร่าง เลือก **เผยแพร่** เมื่อมีหัวข้อครบสองภาษา
5. หน้าทั่วไปใหม่มี URL `/th/pages/{slug}` และ `/en/pages/{slug}` ใช้ปุ่มดูหน้าเว็บเพื่อเปิดหรือคัดลอกลิงก์
6. **ไฟล์และรูปภาพ**: อัปโหลดก่อน แล้วกลับไปเลือกรูปในเนื้อหา รูปในคลังใช้สำหรับเว็บไซต์สาธารณะ ไม่ควรอัปโหลดเอกสารส่วนตัว
7. **ข้อความติดต่อ**: ตรวจบรีฟใหม่ แล้วเปลี่ยนสถานะเป็นติดต่อแล้ว/ปิดงาน/เก็บถาวร
8. หน้า `ติดต่อ` ใช้แก้โทรศัพท์ ที่อยู่ และลิงก์ Facebook ที่แสดงใน footer ด้วย

หน้าโครงหลัก เช่น home, services, contact ล็อก slug และสถานะเผยแพร่ไว้เพื่อป้องกันเมนูหลักเสีย ส่วนเนื้อหาแก้ไขได้
Markdown ไม่อนุญาต raw HTML และ URL ที่ไม่ปลอดภัย

## Cloudflare R2

สร้าง bucket `eliteflow-media` แล้วในบัญชีที่ผู้ใช้เปิดอยู่ (Asia Pacific, Standard, private)
การเชื่อมต่ออัตโนมัติยังต้องเติม credentials ที่มี Object Read & Write สำหรับ bucket นี้:

```dotenv
MEDIA_DRIVER=r2
R2_ACCOUNT_ID=a7890997d8338239f3cad20c6750b2a9
R2_BUCKET=eliteflow-media
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

ไม่ใส่ secrets ในตัวแปร `NEXT_PUBLIC_*` หรือ Git เมื่อกำหนดครบและ restart แล้ว ไฟล์ใหม่จะเก็บใน R2
สำหรับย้ายภาพเริ่มต้นและไฟล์ที่อัปโหลดในเครื่อง:

```sh
npm run storage:migrate
```

สคริปต์อัปโหลด ตรวจขนาดไฟล์ แล้วปรับ URL ใน MySQL ภายใน transaction โดยเก็บต้นฉบับไว้ จึงรันต่อได้เมื่อมีปัญหา
ขณะยังไม่มี credentials ระบบใช้ local storage จริง (ไม่มีการจำลองว่าเชื่อม R2 สำเร็จ)

## Easypanel

ดูขั้นตอนที่ `docs/EASYPANEL.md` และใช้ `Dockerfile` ที่ให้มา
ยังไม่มีการ deploy ไปยัง Easypanel ภายนอก เพราะไม่มี URL / project / server ที่ระบุในเซสชันนี้

## สำรองและกู้คืน

- สำรอง MySQL ด้วย mysqldump จาก Easypanel หรือ container โดยให้เครื่องมืออ่าน credential จาก environment/secret
- สำรอง volume `/app/storage/uploads` หากใช้ local storage
- เมื่อใช้ R2 ให้สำรองรายการ object ตามนโยบายของผู้ดูแล; ถังขยะของแอปเป็น soft delete และเก็บไฟล์จริงไว้
- กู้คืน MySQL พร้อมไฟล์จากช่วงเวลาเดียวกันเพื่อให้ media references ตรงกัน
- การ deploy และ seed ไม่ลบหรือเขียนทับเนื้อหาที่มีอยู่

## บัญชีผู้ดูแล

รหัสผ่านเก็บด้วย scrypt + random salt; session token เก็บเฉพาะ SHA-256 hash ใน MySQL, cookie HttpOnly/SameSite, อายุ 12 ชั่วโมง
หากต้อง reset: แก้ ADMIN_EMAIL / ADMIN_PASSWORD ใน `.env.local` แล้วรัน `npm run admin:reset-password` ซึ่งจะเพิกถอนเซสชันเดิม

## ภาพและเครดิต

ใช้ภาพจากเพจที่ผู้ใช้อนุญาต: https://www.facebook.com/profile.php?id=61586237753501
`public/media/sources.json` บันทึกชื่อภาพต้นทาง ภาพถูกแปลงเป็น WebP และจัด crop ผ่าน CSS ตามพื้นที่แสดงผล
รายละเอียดผลงานระบุบทบาทของทีมและเครดิตที่พบในเพจ เพื่อไม่อ้างว่าเป็นผู้จัดหลักในงานที่เคยร่วมทีมอื่น
บทความเริ่มต้นเป็นข้อความที่เขียนสำหรับเว็บนี้ ไม่ใช่รีวิวลูกค้า
