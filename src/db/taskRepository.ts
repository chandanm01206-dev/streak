// Repository for Task CRUD operations
import { getDatabase } from './database';
import { Task } from '../types';

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    date: row.date ?? undefined,
    time: row.time ?? undefined,
    notes: row.notes ?? undefined,
    completed: Boolean(row.completed),
    completedAt: row.completed_at ?? undefined,
    reminder: row.reminder ?? undefined,
    createdAt: row.created_at,
    order: row.sort_order,
  };
}

/** Get tasks for a specific date */
export async function getTasksByDate(date: string): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM tasks WHERE date = ? ORDER BY completed ASC, sort_order ASC',
    [date]
  );
  return rows.map(rowToTask);
}

/** Get all incomplete tasks (for rollover) */
export async function getIncompleteTasks(): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM tasks WHERE completed = 0 ORDER BY date ASC, sort_order ASC'
  );
  return rows.map(rowToTask);
}

/** Insert a new task */
export async function insertTask(task: Task): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO tasks (id, title, date, time, notes, completed, completed_at, reminder, created_at, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id, task.title, task.date ?? null, task.time ?? null,
      task.notes ?? null, task.completed ? 1 : 0,
      task.completedAt ?? null, task.reminder ?? null,
      task.createdAt, task.order,
    ]
  );
}

/** Update a task */
export async function updateTask(task: Task): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE tasks SET title = ?, date = ?, time = ?, notes = ?,
      completed = ?, completed_at = ?, reminder = ?, sort_order = ?
    WHERE id = ?`,
    [
      task.title, task.date ?? null, task.time ?? null,
      task.notes ?? null, task.completed ? 1 : 0,
      task.completedAt ?? null, task.reminder ?? null,
      task.order, task.id,
    ]
  );
}

/** Delete a task */
export async function deleteTask(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

/** Toggle task completion */
export async function toggleTask(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE tasks SET
      completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END,
      completed_at = CASE WHEN completed = 0 THEN ? ELSE NULL END
    WHERE id = ?`,
    [new Date().toISOString(), id]
  );
}

/** Roll over incomplete past tasks to today */
export async function rollOverTasks(today: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE tasks SET date = ? WHERE completed = 0 AND date < ?`,
    [today, today]
  );
}
