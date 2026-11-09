// Zustand store for habits, logs, tasks, and app state
import { create } from 'zustand';
import {
  Habit, HabitLog, Task, TimeOfDay, AppSettings,
  StreakInfo,
} from '../types';
import * as db from '../db';
import { seedDatabase } from '../db/seed';
import { generateId } from '../utils/id';
import { getToday } from '../utils/date';
import { calculateStreak } from '../utils/streak';

interface HabitStore {
  // State
  habits: Habit[];
  archivedHabits: Habit[];
  todayLogs: Map<string, HabitLog>;
  tasks: Task[];
  selectedDate: string;
  timeFilter: TimeOfDay | 'all';
  streaks: Map<string, StreakInfo>;
  settings: AppSettings;
  isLoading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  loadHabits: () => Promise<void>;
  loadArchivedHabits: () => Promise<void>;
  loadLogsForDate: (date: string) => Promise<void>;
  loadTasksForDate: (date: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setTimeFilter: (filter: TimeOfDay | 'all') => void;

  // Habit CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'archived' | 'order'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string, archived?: boolean) => Promise<void>;

  // Habit progress
  incrementHabit: (habitId: string) => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  skipHabit: (habitId: string) => Promise<void>;
  setHabitValue: (habitId: string, value: number) => Promise<void>;

  // Task CRUD
  addTask: (title: string, date?: string, time?: string, notes?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Streak
  loadStreaks: () => Promise<void>;

  // Computed getters
  getFilteredHabits: () => Habit[];
  getCompletedHabits: () => Habit[];
  getPendingHabits: () => Habit[];
}

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  firstDayOfWeek: 1, // Monday
  defaultReminderTime: '09:00',
  notificationsEnabled: true,
  streakFreezeEnabled: true,
  taskRolloverEnabled: true,
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  archivedHabits: [],
  todayLogs: new Map(),
  tasks: [],
  selectedDate: getToday(),
  timeFilter: 'all',
  streaks: new Map(),
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  initialized: false,

  initialize: async () => {
    try {
      await db.initDatabase();
      await seedDatabase();
      const state = get();
      await state.loadHabits();
      await state.loadArchivedHabits();
      await state.loadLogsForDate(state.selectedDate);
      await state.loadTasksForDate(state.selectedDate);
      await state.loadStreaks();
      set({ isLoading: false, initialized: true });
    } catch (error) {
      console.error('Failed to initialize:', error);
      set({ isLoading: false });
    }
  },

  loadHabits: async () => {
    const habits = await db.getAllHabits();
    set({ habits });
  },

  loadArchivedHabits: async () => {
    const archivedHabits = await db.getArchivedHabits();
    set({ archivedHabits });
  },

  loadLogsForDate: async (date: string) => {
    const logs = await db.getLogsByDate(date);
    const logMap = new Map<string, HabitLog>();
    for (const log of logs) {
      logMap.set(log.habitId, log);
    }
    set({ todayLogs: logMap });
  },

  loadTasksForDate: async (date: string) => {
    const tasks = await db.getTasksByDate(date);
    set({ tasks });
  },

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    const state = get();
    state.loadLogsForDate(date);
    state.loadTasksForDate(date);
  },

  setTimeFilter: (filter: TimeOfDay | 'all') => {
    set({ timeFilter: filter });
  },

  addHabit: async (habitData) => {
    const now = new Date().toISOString();
    const habits = get().habits;
    const habit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      archived: false,
      order: habits.length,
    };
    await db.insertHabit(habit);
    await get().loadHabits();
  },

  updateHabit: async (habit: Habit) => {
    await db.updateHabit(habit);
    await get().loadHabits();
  },

  deleteHabit: async (id: string) => {
    await db.deleteHabit(id);
    await get().loadHabits();
    await get().loadArchivedHabits();
    await get().loadStreaks();
  },

  archiveHabit: async (id: string, archived: boolean = true) => {
    await db.archiveHabit(id, archived);
    await get().loadHabits();
    await get().loadArchivedHabits();
  },

  incrementHabit: async (habitId: string) => {
    const { habits, todayLogs, selectedDate } = get();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const existingLog = todayLogs.get(habitId);
    const currentValue = existingLog?.value ?? 0;
    const newValue = Math.min(currentValue + 1, habit.goalValue);
    const isDone = newValue >= habit.goalValue;

    const log: HabitLog = {
      id: existingLog?.id ?? generateId(),
      habitId,
      date: selectedDate,
      value: newValue,
      status: isDone ? 'done' : 'pending',
      completedAt: isDone ? new Date().toISOString() : undefined,
      usedFreeze: false,
    };

    await db.upsertLog(log);
    await get().loadLogsForDate(selectedDate);
    if (isDone) await get().loadStreaks();
  },

  completeHabit: async (habitId: string) => {
    const { habits, todayLogs, selectedDate } = get();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const existingLog = todayLogs.get(habitId);
    const log: HabitLog = {
      id: existingLog?.id ?? generateId(),
      habitId,
      date: selectedDate,
      value: habit.goalValue,
      status: 'done',
      completedAt: new Date().toISOString(),
      usedFreeze: false,
    };

    await db.upsertLog(log);
    await get().loadLogsForDate(selectedDate);
    await get().loadStreaks();
  },

  skipHabit: async (habitId: string) => {
    const { todayLogs, selectedDate } = get();
    const existingLog = todayLogs.get(habitId);

    const log: HabitLog = {
      id: existingLog?.id ?? generateId(),
      habitId,
      date: selectedDate,
      value: 0,
      status: 'skipped',
      skippedAt: new Date().toISOString(),
      usedFreeze: false,
    };

    await db.upsertLog(log);
    await get().loadLogsForDate(selectedDate);
  },

  setHabitValue: async (habitId: string, value: number) => {
    const { habits, todayLogs, selectedDate } = get();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const existingLog = todayLogs.get(habitId);
    const isDone = value >= habit.goalValue;

    const log: HabitLog = {
      id: existingLog?.id ?? generateId(),
      habitId,
      date: selectedDate,
      value,
      status: isDone ? 'done' : 'pending',
      completedAt: isDone ? new Date().toISOString() : existingLog?.completedAt,
      usedFreeze: false,
    };

    await db.upsertLog(log);
    await get().loadLogsForDate(selectedDate);
    if (isDone) await get().loadStreaks();
  },

  addTask: async (title, date, time, notes) => {
    const { tasks, selectedDate } = get();
    const task: Task = {
      id: generateId(),
      title,
      date: date ?? selectedDate,
      time,
      notes,
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    await db.insertTask(task);
    await get().loadTasksForDate(selectedDate);
  },

  toggleTask: async (id: string) => {
    await db.toggleTask(id);
    await get().loadTasksForDate(get().selectedDate);
  },

  deleteTask: async (id: string) => {
    await db.deleteTask(id);
    await get().loadTasksForDate(get().selectedDate);
  },

  loadStreaks: async () => {
    const { habits } = get();
    const today = getToday();
    const streakMap = new Map<string, StreakInfo>();

    for (const habit of habits) {
      const logs = await db.getLogsByHabit(habit.id);
      const streak = calculateStreak(logs, habit, today);
      streakMap.set(habit.id, streak);
    }

    set({ streaks: streakMap });
  },

  getFilteredHabits: () => {
    const { habits, timeFilter, selectedDate } = get();
    return habits.filter(h => {
      // Filter by time of day
      if (timeFilter !== 'all' && h.timeOfDay !== 'any' && h.timeOfDay !== timeFilter) {
        return false;
      }
      // Filter by start/end date
      if (selectedDate < h.startDate) return false;
      if (h.endDate && selectedDate > h.endDate) return false;
      return true;
    });
  },

  getCompletedHabits: () => {
    const { todayLogs } = get();
    const filtered = get().getFilteredHabits();
    return filtered.filter(h => {
      const log = todayLogs.get(h.id);
      return log && log.status === 'done';
    });
  },

  getPendingHabits: () => {
    const { todayLogs } = get();
    const filtered = get().getFilteredHabits();
    return filtered.filter(h => {
      const log = todayLogs.get(h.id);
      return !log || log.status === 'pending';
    });
  },
}));
