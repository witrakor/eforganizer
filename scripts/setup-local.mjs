import fs from "node:fs";
import crypto from "node:crypto";
if (!fs.existsSync(".env.local")) {
  const db = crypto.randomBytes(24).toString("hex"),
    root = crypto.randomBytes(24).toString("hex"),
    admin = crypto.randomBytes(15).toString("base64url");
  fs.writeFileSync(
    ".env.local",
    `DATABASE_URL=mysql://eliteflow:${db}@127.0.0.1:3318/eliteflow\nMYSQL_DATABASE=eliteflow\nMYSQL_USER=eliteflow\nMYSQL_PASSWORD=${db}\nMYSQL_ROOT_PASSWORD=${root}\nADMIN_EMAIL=admin@eliteflow.local\nADMIN_PASSWORD=${admin}\nSITE_URL=http://localhost:3100\nMEDIA_DRIVER=local\nUPLOAD_DIR=./storage/uploads\nR2_ACCOUNT_ID=a7890997d8338239f3cad20c6750b2a9\nR2_BUCKET=eliteflow-media\nR2_ACCESS_KEY_ID=\nR2_SECRET_ACCESS_KEY=\n`,
    { mode: 0o600 },
  );
  fs.writeFileSync(
    "LOCAL-ACCESS.txt",
    `Elite Flow local preview\nWebsite: http://localhost:3100/th\nAdmin: http://localhost:3100/admin\nEmail: admin@eliteflow.local\nPassword: ${admin}\n\nPrivate local credentials. Do not commit or share publicly.\n`,
    { mode: 0o600 },
  );
}
