# ติดตั้ง Elite Flow บน Easypanel

## 1. ฐานข้อมูล

สร้าง project `eliteflow` และ MySQL service (MySQL 8.4)
กำหนด database/user/password เฉพาะแอปนี้ เปิดใช้งาน persistent storage และไม่ต้องเปิดพอร์ต MySQL สู่สาธารณะ
ใช้ internal hostname ที่ Easypanel แสดงใน Connection details

## 2. แอป

สร้าง App service `web`, ชี้ source ไปยัง repository นี้, build ด้วย Dockerfile ที่ root และกำหนด target port `3000`
ภาพ Docker ใช้ Node 22, รันด้วยผู้ใช้ non-root และใช้ Next.js standalone

## 3. Environment

```dotenv
DATABASE_URL=mysql://USER:URL_ENCODED_PASSWORD@MYSQL_INTERNAL_HOST:3306/DATABASE
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=GENERATE_A_UNIQUE_RANDOM_PASSWORD_AT_LEAST_14_CHARACTERS
SITE_URL=https://your-domain
MEDIA_DRIVER=local
UPLOAD_DIR=/app/storage/uploads
R2_ACCOUNT_ID=a7890997d8338239f3cad20c6750b2a9
R2_BUCKET=eliteflow-media
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
TRUST_PROXY=false
```

เปลี่ยน MEDIA_DRIVER เป็น `r2` เมื่อเติม R2 credentials แล้วเท่านั้น
ตั้ง TRUST_PROXY=true เฉพาะเมื่อ reverse proxy เขียนทับ x-forwarded-for และแอปเข้าถึงได้ผ่าน proxy เท่านั้น
ใช้ password ใน DATABASE_URL ที่ URL-encode แล้วหากมีอักขระพิเศษ

## 4. Volume

mount persistent volume ที่ `/app/storage/uploads` (เจ้าของ uid/gid 1001) หากใช้ local storage หรือมีไฟล์เดิมที่ยังไม่ย้าย R2
ข้อมูล MySQL ต้องใช้ volume ของ service ฐานข้อมูลเอง

## 5. Deploy และตรวจ

- startup สร้างตารางและ seed เนื้อหา/ผู้ดูแลแบบไม่ทับข้อมูลเดิม
- health endpoint `/api/health` ต้องตอบ 200 พร้อม `database: connected`
- เพิ่ม domain และ HTTPS ใน Easypanel แล้วตั้ง SITE_URL ให้ตรง
- ตรวจ `/th`, `/en`, `/admin` และลองส่งบรีฟจากหน้าติดต่อ
- ข้อความจะอยู่ในหลังบ้าน ยังไม่ส่งอีเมลแจ้งเตือน
- อย่าส่ง `.env.local`, LOCAL-ACCESS.txt หรือ volume ข้อมูลเข้า Git

## การนำข้อมูลในเครื่องขึ้น production

การ seed ให้ข้อมูลเริ่มต้นเท่านั้น หากมีการแก้เนื้อหาในเครื่องแล้ว ให้ย้ายด้วย MySQL dump/restore พร้อมไฟล์ที่อ้างอิง
สำรองฐานข้อมูลปลายทางก่อน restore และตรวจชื่อ database ให้ตรง

## Docker Compose ทางเลือก

ตั้ง `.env.local` แล้วรัน:

```sh
docker compose --env-file .env.local up -d --build
```

Compose ใช้ MySQL ภายในและเปิดเว็บที่ localhost:3100; ให้ reverse proxy จัดการ HTTPS สำหรับ production

## R2 API credentials

ให้ผู้ดูแลสร้างหรือจัดเตรียม credential ที่จำกัดเฉพาะ bucket `eliteflow-media` แล้วใส่ใน environment ของแอป
ไม่ต้องเปิด public bucket หรือ CORS เพราะ browser ติดต่อแอป และแอปอ่าน/เขียน R2 ที่ฝั่ง server
การย้ายไฟล์ใช้ `npm run storage:migrate` จากเครื่องที่เชื่อม MySQL และ R2 ได้
