// Database initialization and access layer
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Open (or create) the database and run migrations.
 * Call once at app startup.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('streak.db');

  // Enable WAL mode for better performance
  await db.execAsync('PRAGMA journal_mode = WAL;');
  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');
  // Create tables
  await db.execAsync(CREATE_TABLES_SQL);

  return db;
}

/**
 * Get the database instance. Throws if not initialized.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}
