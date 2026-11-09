// Core type definitions for the Streak habit tracker

/** Goal type determines how a habit is tracked */
export type GoalType = 'boolean' | 'count' | 'timer';

/** Frequency configuration for habits */
export type FrequencyType = 'daily' | 'specific_days' | 'x_per_week' | 'every_n_days';

/** Time of day filter for habits */
export type TimeOfDay = 'any' | 'morning' | 'afternoon' | 'evening';

/** Status of a habit log entry for a given day */
export type HabitLogStatus = 'done' | 'skipped' | 'missed' | 'pending';

/** Theme mode preference */
export type ThemeMode = 'dark' | 'light' | 'system';

/** Day of week (0 = Sunday, 6 = Saturday) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Habit frequency configuration */
export interface FrequencyConfig {
  type: FrequencyType;
  /** For 'specific_days': which days (0-6, Sunday=0) */
  days?: DayOfWeek[];
  /** For 'x_per_week': how many times */
  timesPerWeek?: number;
  /** For 'every_n_days': interval */
  interval?: number;
}

/** Reminder configuration */
export interface Reminder {
  id: string;
  time: string; // HH:MM format
  enabled: boolean;
}

/** Core Habit model */
export interface Habit {
  id: string;
  name: string;
  icon: string;          // icon name from lucide
  color: string;         // hex color
  goalType: GoalType;
  goalValue: number;     // target count or timer seconds; 1 for boolean
  goalUnit: string;      // e.g. 'glasses', 'pages', 'times', 'minutes'
  frequency: FrequencyConfig;
  timeOfDay: TimeOfDay;
  reminders: Reminder[];
  startDate: string;     // ISO date string YYYY-MM-DD
  endDate?: string;      // optional end date
  createdAt: string;     // ISO timestamp
  updatedAt: string;
  archived: boolean;
  order: number;         // for manual sorting
}

/** Daily log entry for a habit */
export interface HabitLog {
  id: string;
  habitId: string;
  date: string;          // YYYY-MM-DD
  value: number;         // current progress (count achieved, seconds elapsed, or 1/0 for boolean)
  status: HabitLogStatus;
  completedAt?: string;  // ISO timestamp when marked done
  skippedAt?: string;
  usedFreeze: boolean;   // whether a streak freeze was consumed
  notes?: string;
}

/** One-time task/to-do */
export interface Task {
  id: string;
  title: string;
  date?: string;         // YYYY-MM-DD
  time?: string;         // HH:MM
  notes?: string;
  completed: boolean;
  completedAt?: string;
  reminder?: string;     // ISO timestamp
  createdAt: string;
  order: number;
}

/** Challenge model */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;      // days
  habitIds: string[];    // linked habit IDs
  startDate?: string;
  joined: boolean;
  progress: number;      // days completed
  illustration?: string; // asset name
  isCustom: boolean;
  createdAt: string;
}

/** Badge / Achievement */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  habitId?: string;      // which habit earned it (null = overall)
  milestone: number;     // streak count that triggered it
}

/** Streak info computed for a habit */
export interface StreakInfo {
  current: number;
  best: number;
  freezesAvailable: number;
  freezesUsed: number;
}

/** App settings */
export interface AppSettings {
  themeMode: ThemeMode;
  firstDayOfWeek: DayOfWeek;
  defaultReminderTime: string;  // HH:MM
  notificationsEnabled: boolean;
  streakFreezeEnabled: boolean;
  taskRolloverEnabled: boolean;
}

/** Habit template for quick-add */
export interface HabitTemplate {
  name: string;
  icon: string;
  color: string;
  goalType: GoalType;
  goalValue: number;
  goalUnit: string;
  timeOfDay: TimeOfDay;
}
