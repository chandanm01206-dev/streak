// Seed data: 4 sample habits for initial app experience
import { Habit } from '../types';
import { generateId } from '../utils/id';
import { getToday } from '../utils/date';
import { insertHabit, getAllHabits } from './habitRepository';

const SEED_HABITS: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Drink water',
    icon: 'glass-water',
    color: '#2196F3',
    goalType: 'count',
    goalValue: 5,
    goalUnit: 'glasses',
    frequency: { type: 'daily' },
    timeOfDay: 'any',
    reminders: [],
    startDate: getToday(),
    archived: false,
    order: 0,
  },
  {
    name: 'Do morning exercise',
    icon: 'dumbbell',
    color: '#F26B3A',
    goalType: 'timer',
    goalValue: 1800, // 30 minutes in seconds
    goalUnit: 'minutes',
    frequency: { type: 'daily' },
    timeOfDay: 'morning',
    reminders: [],
    startDate: getToday(),
    archived: false,
    order: 1,
  },
  {
    name: 'Brush & floss',
    icon: 'sparkles',
    color: '#E8436B',
    goalType: 'boolean',
    goalValue: 1,
    goalUnit: 'times',
    frequency: { type: 'daily' },
    timeOfDay: 'morning',
    reminders: [],
    startDate: getToday(),
    archived: false,
    order: 2,
  },
  {
    name: 'Read',
    icon: 'book-open',
    color: '#8E6CEF',
    goalType: 'count',
    goalValue: 20,
    goalUnit: 'pages',
    frequency: { type: 'daily' },
    timeOfDay: 'evening',
    reminders: [],
    startDate: getToday(),
    archived: false,
    order: 3,
  },
];

/**
 * Insert seed habits only if the database is empty.
 */
export async function seedDatabase(): Promise<void> {
  const existing = await getAllHabits();
  if (existing.length > 0) return; // Already has data

  const now = new Date().toISOString();
  for (const seed of SEED_HABITS) {
    const habit: Habit = {
      ...seed,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await insertHabit(habit);
  }

  console.log('🌱 Seed data inserted: 4 sample habits');
}
