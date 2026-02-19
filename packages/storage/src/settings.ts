// Settings repository for database operations
import Database from 'better-sqlite3';
import type { AppSettings, ProviderConfig, KnowledgeBaseConfig } from '@ppt-ai/types';

export class SettingsRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  get<T>(key: string): T | null {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
    if (!row) return null;
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return row.value as unknown as T;
    }
  }

  set<T>(key: string, value: T): void {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    this.db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, strftime('%s', 'now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(key, valueStr);
  }

  delete(key: string): void {
    this.db.prepare('DELETE FROM settings WHERE key = ?').run(key);
  }

  getAll(): AppSettings {
    const defaults: AppSettings = {
      general: {
        defaultProvider: 'openai',
        defaultModel: 'gpt-4',
        language: 'zh-CN',
        startMinimized: false,
        autoStart: false,
        checkUpdates: true
      },
      providers: [],
      knowledgeBases: [],
      appearance: {
        theme: 'system',
        fontSize: 14
      },
      storage: {
        dataPath: '',
        maxHistory: 100,
        cacheEnabled: true,
        cacheSize: 1024,
        autoBackup: true,
        backupCount: 5
      }
    };

    const saved = this.get<AppSettings>('app_settings');
    return { ...defaults, ...saved };
  }

  saveAll(settings: AppSettings): void {
    this.set('app_settings', settings);
  }
}

export class ProviderRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  findAll(): ProviderConfig[] {
    const rows = this.db.prepare(`
      SELECT type, api_key as apiKey, base_url as baseUrl, model, max_tokens as maxTokens, 
             temperature, top_p as topP, enabled
      FROM providers WHERE enabled = 1
    `).all() as ProviderConfig[];
    return rows;
  }

  findByType(type: string): ProviderConfig | null {
    const row = this.db.prepare(`
      SELECT type, api_key as apiKey, base_url as baseUrl, model, max_tokens as maxTokens, 
             temperature, top_p as topP, enabled
      FROM providers WHERE type = ?
    `).get(type) as ProviderConfig | undefined;
    return row || null;
  }

  save(config: ProviderConfig): void {
    this.db.prepare(`
      INSERT INTO providers (id, type, api_key_encrypted, base_url, model, max_tokens, temperature, top_p, enabled, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, strftime('%s', 'now'))
      ON CONFLICT(id) DO UPDATE SET 
        api_key_encrypted = excluded.api_key_encrypted,
        base_url = excluded.base_url,
        model = excluded.model,
        max_tokens = excluded.max_tokens,
        temperature = excluded.temperature,
        top_p = excluded.top_p,
        updated_at = excluded.updated_at
    `).run(
      config.type,
      config.type,
      config.apiKey, // Should be encrypted before saving
      config.baseUrl || null,
      config.model,
      config.maxTokens || null,
      config.temperature || null,
      config.topP || null
    );
  }

  delete(type: string): void {
    this.db.prepare('DELETE FROM providers WHERE type = ?').run(type);
  }
}
