// Repository for HabitLog CRUD operations
import { getDatabase } from './database';
import { HabitLog, HabitLogStatus } from '../types';

/** Convert a DB row to a HabitLog object */
function rowToLog(row: any): HabitLog {
  return {
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    value: row.value,
    status: row.status as HabitLogStatus,
    completedAt: row.completed_at ?? undefined,
    skippedAt: row.skipped_at ?? undefined,
    usedFreeze: Boolean(row.used_freeze),
    notes: row.notes ?? undefined,
  };
}

/** Get log for a specific habit on a specific date */
export async function getLog(habitId: string, date: string): Promise<HabitLog | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?',
    [habitId, date]
  );
  return row ? rowToLog(row) : null;
}

/** Get all logs for a specific date */
export async function getLogsByDate(date: string): Promise<HabitLog[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habit_logs WHERE date = ?',
    [date]
  );
  return rows.map(rowToLog);
}

/** Get all logs for a specific habit */
export async function getLogsByHabit(habitId: string): Promise<HabitLog[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date ASC',
    [habitId]
  );
  return rows.map(rowToLog);
}

/** Get logs for a habit within a date range */
export async function getLogsByHabitAndRange(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND date >= ? AND date <= ? ORDER BY date ASC',
    [habitId, startDate, endDate]
  );
  return rows.map(rowToLog);
}

/** Upsert a habit log (insert or update) */
export async function upsertLog(log: HabitLog): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO habit_logs (id, habit_id, date, value, status, completed_at, skipped_at, used_freeze, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(habit_id, date) DO UPDATE SET
      value = excluded.value,
      status = excluded.status,
      completed_at = excluded.completed_at,
      skipped_at = excluded.skipped_at,
      used_freeze = excluded.used_freeze,
      notes = excluded.notes`,
    [
      log.id, log.habitId, log.date, log.value,
      log.status, log.completedAt ?? null,
      log.skippedAt ?? null, log.usedFreeze ? 1 : 0,
      log.notes ?? null,
    ]
  );
}

/** Get all logs for a date range (for stats) */
export async function getLogsInRange(
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habit_logs WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [startDate, endDate]
  );
  return rows.map(rowToLog);
}
