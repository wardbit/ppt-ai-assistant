// Database schema and initialization for PPT AI Assistant
// Uses better-sqlite3 for synchronous SQLite operations

import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export interface DatabaseConfig {
  path?: string;
  wal?: boolean;
}

const DEFAULT_DB_PATH = 'data.db';

export function getDefaultDbPath(): string {
  const userDataPath = app?.getPath('userData') || process.cwd();
  return path.join(userDataPath, DEFAULT_DB_PATH);
}

export function initializeDatabase(config: DatabaseConfig = {}): Database.Database {
  const dbPath = config.path || getDefaultDbPath();
  
  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  if (config.wal !== false) {
    db.pragma('journal_mode = WAL');
  }

  // Run migrations
  runMigrations(db);

  return db;
}

function runMigrations(db: Database.Database): void {
  // Create migrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    )
  `);

  const migrations: { name: string; sql: string }[] = [
    {
      name: '001_initial_schema',
      sql: `
        -- Settings table
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Providers table
        CREATE TABLE IF NOT EXISTS providers (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          api_key_encrypted TEXT NOT NULL,
          base_url TEXT,
          model TEXT NOT NULL,
          max_tokens INTEGER,
          temperature REAL,
          top_p REAL,
          enabled INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Chat history table
        CREATE TABLE IF NOT EXISTS chat_history (
          id TEXT PRIMARY KEY,
          messages TEXT NOT NULL, -- JSON array of messages
          provider_type TEXT,
          model TEXT,
          tokens_used INTEGER,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Presentations table
        CREATE TABLE IF NOT EXISTS presentations (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slides_json TEXT NOT NULL,
          template TEXT,
          language TEXT NOT NULL DEFAULT 'zh-CN',
          file_path TEXT,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Knowledge bases table
        CREATE TABLE IF NOT EXISTS knowledge_bases (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          config_json TEXT NOT NULL,
          enabled INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Documents table
        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          kb_id TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          size INTEGER NOT NULL,
          chunks INTEGER,
          status TEXT NOT NULL DEFAULT 'processing',
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE
        );

        -- Usage statistics table
        CREATE TABLE IF NOT EXISTS usage_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          provider_type TEXT NOT NULL,
          model TEXT NOT NULL,
          prompt_tokens INTEGER NOT NULL,
          completion_tokens INTEGER NOT NULL,
          total_tokens INTEGER NOT NULL,
          estimated_cost REAL NOT NULL,
          period TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Backups table
        CREATE TABLE IF NOT EXISTS backups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file_path TEXT NOT NULL,
          size INTEGER NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_chat_history_created ON chat_history(created_at);
        CREATE INDEX IF NOT EXISTS idx_presentations_created ON presentations(created_at);
        CREATE INDEX IF NOT EXISTS idx_documents_kb ON documents(kb_id);
        CREATE INDEX IF NOT EXISTS idx_usage_stats_period ON usage_stats(period);
      `
    }
  ];

  const appliedMigrations = db.prepare('SELECT name FROM _migrations').all() as { name: string }[];
  const appliedNames = new Set(appliedMigrations.map(m => m.name));

  for (const migration of migrations) {
    if (!appliedNames.has(migration.name)) {
      db.exec(migration.sql);
      db.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(
        migration.name,
        Date.now()
      );
    }
  }
}

export function closeDatabase(db: Database.Database): void {
  db.close();
}
