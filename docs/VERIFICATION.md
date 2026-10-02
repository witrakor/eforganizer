# Verification — Elite Flow

Verified locally on 1 October 2026 (Asia/Bangkok).

## Running system

- Web: `eliteflow-web`, Docker image `eliteflow:local`, localhost:3100 → container:3000
- Database: `eliteflow-db-1`, MySQL 8.4, localhost:3318; isolated project volume
- Media: local persistent Docker volume `eliteflow_uploads`; 15 bundled WebP images from the authorised Facebook page
- R2: `eliteflow-media` bucket created in Cloudflare, Standard, Asia Pacific, private. API credentials not configured. No claim of completed R2 data transfer.

## Verified

| Area | Evidence |
| --- | --- |
| Build | Next.js production build passed, including Docker build without local environment files |
| TypeScript | `npm run typecheck` passed |
| Public routes | 40 published Thai/English URL combinations returned 200, with correct server-rendered `html lang` |
| SEO | Sitemap has 40 entries; canonical/hreflang generated; robots disallows admin/API |
| Desktop UI | Homepage and admin visually inspected in a real browser |
| Mobile UI | Homepage, navigation and language switch inspected at mobile viewport; no horizontal overflow; no broken images |
| Browser errors | No console errors on inspected homepage/admin flows |
| Login | Browser login reaches protected admin dashboard |
| Static content | English preview and save of About page confirmed in browser |
| Media picker | All 15 seeded photos available in the editor picker |
| Inquiry flow | Browser form → success state → admin inbox → matching MySQL record; test record removed |
| Automated integration | 6 tests passed: password hashing, public pages, auth/origin protection, bilingual draft/publish/conflict, inquiries, upload/read/metadata/trash/restore |
| Docker runtime | Health endpoint returns `status: ok, database: connected`; container healthy; starts as non-root |
| Secrets | `.env.local` and `LOCAL-ACCESS.txt` absent from runtime image and excluded from Git |

Test data and test image files were removed after verification.

## Pending external setup

- R2 read/write credential scoped to `eliteflow-media`; then switch `MEDIA_DRIVER=r2` and run media migration.
- Easypanel destination and domain. Deployment files are prepared and tested locally; no external deployment has been performed.
- Inquiry notifications currently appear in the admin inbox. Email delivery is not configured.

## Reproduce

```sh
npm run typecheck
npm run build
# With local preview and MySQL running:
npm test
```

See README.md and EASYPANEL.md for startup, deployment, storage migration and backups.
