// Repository for Habit CRUD operations
import { getDatabase } from './database';
import { Habit, FrequencyConfig, Reminder } from '../types';

/** Convert a DB row to a Habit object */
function rowToHabit(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    goalType: row.goal_type,
    goalValue: row.goal_value,
    goalUnit: row.goal_unit,
    frequency: {
      type: row.frequency_type,
      days: row.frequency_days ? JSON.parse(row.frequency_days) : undefined,
      timesPerWeek: row.frequency_times_per_week ?? undefined,
      interval: row.frequency_interval ?? undefined,
    } as FrequencyConfig,
    timeOfDay: row.time_of_day,
    reminders: JSON.parse(row.reminders || '[]') as Reminder[],
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archived: Boolean(row.archived),
    order: row.sort_order,
  };
}

/** Get all non-archived habits, sorted by order */
export async function getAllHabits(): Promise<Habit[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habits WHERE archived = 0 ORDER BY sort_order ASC, created_at ASC'
  );
  return rows.map(rowToHabit);
}

/** Get a single habit by ID */
export async function getHabitById(id: string): Promise<Habit | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM habits WHERE id = ?', [id]);
  return row ? rowToHabit(row) : null;
}

/** Insert a new habit */
export async function insertHabit(habit: Habit): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO habits (id, name, icon, color, goal_type, goal_value, goal_unit,
      frequency_type, frequency_days, frequency_times_per_week, frequency_interval,
      time_of_day, reminders, start_date, end_date, created_at, updated_at, archived, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      habit.id, habit.name, habit.icon, habit.color,
      habit.goalType, habit.goalValue, habit.goalUnit,
      habit.frequency.type,
      habit.frequency.days ? JSON.stringify(habit.frequency.days) : null,
      habit.frequency.timesPerWeek ?? null,
      habit.frequency.interval ?? null,
      habit.timeOfDay,
      JSON.stringify(habit.reminders),
      habit.startDate, habit.endDate ?? null,
      habit.createdAt, habit.updatedAt,
      habit.archived ? 1 : 0,
      habit.order,
    ]
  );
}

/** Update an existing habit */
export async function updateHabit(habit: Habit): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE habits SET name = ?, icon = ?, color = ?, goal_type = ?, goal_value = ?,
      goal_unit = ?, frequency_type = ?, frequency_days = ?, frequency_times_per_week = ?,
      frequency_interval = ?, time_of_day = ?, reminders = ?, start_date = ?, end_date = ?,
      updated_at = ?, archived = ?, sort_order = ?
    WHERE id = ?`,
    [
      habit.name, habit.icon, habit.color,
      habit.goalType, habit.goalValue, habit.goalUnit,
      habit.frequency.type,
      habit.frequency.days ? JSON.stringify(habit.frequency.days) : null,
      habit.frequency.timesPerWeek ?? null,
      habit.frequency.interval ?? null,
      habit.timeOfDay,
      JSON.stringify(habit.reminders),
      habit.startDate, habit.endDate ?? null,
      new Date().toISOString(),
      habit.archived ? 1 : 0,
      habit.order,
      habit.id,
    ]
  );
}

/** Delete a habit and its logs */
export async function deleteHabit(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ?', [id]);
  await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

/** Archive/unarchive a habit */
export async function archiveHabit(id: string, archived: boolean): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE habits SET archived = ?, updated_at = ? WHERE id = ?',
    [archived ? 1 : 0, new Date().toISOString(), id]
  );
}

/** Get archived habits */
export async function getArchivedHabits(): Promise<Habit[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM habits WHERE archived = 1 ORDER BY sort_order ASC'
  );
  return rows.map(rowToHabit);
}
