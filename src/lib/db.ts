import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
const g = globalThis as unknown as { eliteflowPool?: Pool };
export function pool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  return (g.eliteflowPool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "Z",
    dateStrings: true,
  }));
}
export async function query<T = RowDataPacket[]>(
  sql: string,
  args: any[] = [],
) {
  const [r] = await pool().execute(sql, args);
  return r as T;
}
export async function initialize() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS content_revisions (content_id VARCHAR(36) NOT NULL, version INT NOT NULL, document JSON NOT NULL, saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(content_id,version)) CHARACTER SET utf8mb4`,
    `CREATE TABLE IF NOT EXISTS content (id VARCHAR(36) PRIMARY KEY, kind VARCHAR(20) NOT NULL, slug VARCHAR(160) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'draft', document JSON NOT NULL, version INT NOT NULL DEFAULT 1, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY unique_slug(kind,slug)) CHARACTER SET utf8mb4`,
    `CREATE TABLE IF NOT EXISTS admins (id VARCHAR(36) PRIMARY KEY, email VARCHAR(254) NOT NULL UNIQUE, password_hash VARCHAR(256) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4`,
    `CREATE TABLE IF NOT EXISTS sessions (token_hash CHAR(64) PRIMARY KEY, admin_id VARCHAR(36) NOT NULL, expires_at DATETIME NOT NULL, FOREIGN KEY(admin_id) REFERENCES admins(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS media (id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, url TEXT NOT NULL, mime VARCHAR(100) NOT NULL, size INT NOT NULL, alt TEXT NOT NULL, source TEXT NOT NULL, driver VARCHAR(20) NOT NULL, storage_key VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deleted_at DATETIME NULL) CHARACTER SET utf8mb4`,
    `CREATE TABLE IF NOT EXISTS inquiries (id VARCHAR(36) PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(254) NOT NULL, phone VARCHAR(40) NOT NULL, event_type VARCHAR(100) NOT NULL, event_date VARCHAR(30) NOT NULL, location VARCHAR(200) NOT NULL, guests VARCHAR(40) NOT NULL, budget VARCHAR(100) NOT NULL, message TEXT NOT NULL, locale VARCHAR(2) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4`,
    `CREATE TABLE IF NOT EXISTS rate_limits (bucket CHAR(64) PRIMARY KEY, hits INT NOT NULL, reset_at BIGINT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS inquiry_line_notifications (inquiry_id VARCHAR(36) PRIMARY KEY, group_id VARCHAR(40) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending', attempts INT NOT NULL DEFAULT 0, last_error VARCHAR(200) NULL, sent_at DATETIME NULL, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE) CHARACTER SET utf8mb4`,
  ];
  for (const s of statements) await query(s);
}
