// SQLite database schema for the Streak habit tracker
// Uses expo-sqlite

export const CREATE_TABLES_SQL = `
-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'circle',
  color TEXT NOT NULL DEFAULT '#2196F3',
  goal_type TEXT NOT NULL DEFAULT 'boolean',
  goal_value REAL NOT NULL DEFAULT 1,
  goal_unit TEXT NOT NULL DEFAULT 'times',
  frequency_type TEXT NOT NULL DEFAULT 'daily',
  frequency_days TEXT,
  frequency_times_per_week INTEGER,
  frequency_interval INTEGER,
  time_of_day TEXT NOT NULL DEFAULT 'any',
  reminders TEXT NOT NULL DEFAULT '[]',
  start_date TEXT NOT NULL,
  end_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Habit logs table (one entry per habit per day)
CREATE TABLE IF NOT EXISTS habit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TEXT,
  skipped_at TEXT,
  used_freeze INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  UNIQUE(habit_id, date)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  notes TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  reminder TEXT,
  created_at TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL,
  habit_ids TEXT NOT NULL DEFAULT '[]',
  start_date TEXT,
  joined INTEGER NOT NULL DEFAULT 0,
  progress INTEGER NOT NULL DEFAULT 0,
  illustration TEXT,
  is_custom INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'award',
  unlocked_at TEXT,
  habit_id TEXT,
  milestone INTEGER NOT NULL DEFAULT 0
);

-- Settings table (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_habits_archived ON habits(archived);
`;
