// Streak calculation – pure, unit-testable functions
import { Habit, HabitLog, FrequencyConfig, DayOfWeek } from '../types';
import { parseDate, formatDate, addDays, daysBetween } from './date';

/**
 * Determine if a habit is scheduled on a given date based on its frequency config.
 */
export function isScheduledOnDate(
  frequency: FrequencyConfig,
  date: string,
  startDate: string
): boolean {
  const d = parseDate(date);
  const dayOfWeek = d.getDay() as DayOfWeek;

  switch (frequency.type) {
    case 'daily':
      return true;

    case 'specific_days':
      return frequency.days?.includes(dayOfWeek) ?? false;

    case 'x_per_week':
      // For x_per_week, the habit is available every day but only
      // needs X completions per week. For scheduling purposes, treat as daily.
      return true;

    case 'every_n_days': {
      const start = parseDate(startDate);
      const diff = daysBetween(start, d);
      return diff >= 0 && diff % (frequency.interval ?? 1) === 0;
    }

    default:
      return true;
  }
}

/**
 * Calculate streak info for a single habit.
 * Walks backward from today through the habit's logs.
 *
 * @param logs - sorted by date ascending
 * @param habit - the habit (for frequency & start date)
 * @param today - today's date string
 */
export function calculateStreak(
  logs: HabitLog[],
  habit: Habit,
  today: string
): { current: number; best: number; freezesAvailable: number; freezesUsed: number } {
  // Build a map of date -> log for O(1) lookup
  const logMap = new Map<string, HabitLog>();
  for (const log of logs) {
    logMap.set(log.date, log);
  }

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let freezesUsedTotal = 0;

  // Walk backward from today
  let d = parseDate(today);
  let foundFirst = false;

  for (let i = 0; i < 1000; i++) {
    const dateStr = formatDate(d);

    // Don't count dates before the habit started
    if (dateStr < habit.startDate) break;

    // Check if this date is scheduled
    if (!isScheduledOnDate(habit.frequency, dateStr, habit.startDate)) {
      d = addDays(d, -1);
      continue; // skip non-scheduled days
    }

    const log = logMap.get(dateStr);

    if (log && log.status === 'done') {
      tempStreak++;
      foundFirst = true;
    } else if (log && log.status === 'skipped') {
      // Skipped days don't break the streak
      d = addDays(d, -1);
      continue;
    } else if (log && log.usedFreeze) {
      // Freeze was used – streak continues but counts the freeze
      freezesUsedTotal++;
      tempStreak++;
      foundFirst = true;
    } else {
      // Missed or no log
      if (dateStr === today) {
        // Today might not be done yet – don't break
        d = addDays(d, -1);
        continue;
      }
      // Streak is broken
      if (foundFirst) break;
    }

    d = addDays(d, -1);
  }

  currentStreak = tempStreak;

  // Calculate best streak by scanning all logs forward
  tempStreak = 0;
  if (logs.length > 0) {
    const startD = parseDate(habit.startDate);
    const todayD = parseDate(today);
    const curr = new Date(startD);

    while (curr <= todayD) {
      const dateStr = formatDate(curr);

      if (isScheduledOnDate(habit.frequency, dateStr, habit.startDate)) {
        const log = logMap.get(dateStr);

        if (log && (log.status === 'done' || log.usedFreeze)) {
          tempStreak++;
        } else if (log && log.status === 'skipped') {
          // skip doesn't break or add
        } else {
          if (dateStr !== today) {
            // Streak broken
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 0;
          }
        }
      }

      curr.setDate(curr.getDate() + 1);
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // Calculate available freezes: 1 per 7-day streak, max 2
  const freezesEarned = Math.floor(currentStreak / 7);
  const freezesAvailable = Math.min(2, freezesEarned) - freezesUsedTotal;

  return {
    current: currentStreak,
    best: bestStreak,
    freezesAvailable: Math.max(0, freezesAvailable),
    freezesUsed: freezesUsedTotal,
  };
}

/**
 * Get the streak milestone badge tier based on streak count.
 * Returns the milestone if just achieved, null otherwise.
 */
export function getStreakMilestone(streak: number): number | null {
  const milestones = [3, 7, 14, 30, 50, 100, 365];
  if (milestones.includes(streak)) return streak;
  return null;
}

/**
 * Get the flame tier for visual representation.
 * Controls flame icon size/color.
 */
export function getFlameTier(streak: number): 'none' | 'small' | 'medium' | 'large' | 'epic' {
  if (streak <= 0) return 'none';
  if (streak < 7) return 'small';
  if (streak < 30) return 'medium';
  if (streak < 100) return 'large';
  return 'epic';
}

/**
 * Calculate "perfect day" streak – all scheduled habits completed.
 */
export function calculatePerfectDayStreak(
  habits: Habit[],
  allLogs: HabitLog[],
  today: string
): { current: number; best: number } {
  // Group logs by date
  const logsByDate = new Map<string, HabitLog[]>();
  for (const log of allLogs) {
    const arr = logsByDate.get(log.date) || [];
    arr.push(log);
    logsByDate.set(log.date, arr);
  }

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let d = parseDate(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = formatDate(d);

    // Get habits scheduled for this date
    const scheduledHabits = habits.filter(h =>
      !h.archived &&
      dateStr >= h.startDate &&
      (!h.endDate || dateStr <= h.endDate) &&
      isScheduledOnDate(h.frequency, dateStr, h.startDate)
    );

    if (scheduledHabits.length === 0) {
      d = addDays(d, -1);
      continue;
    }

    const dateLogs = logsByDate.get(dateStr) || [];
    const allDone = scheduledHabits.every(h => {
      const log = dateLogs.find(l => l.habitId === h.id);
      return log && (log.status === 'done' || log.status === 'skipped');
    });

    if (allDone) {
      tempStreak++;
    } else {
      if (dateStr === today) {
        // Today might not be done yet
        d = addDays(d, -1);
        continue;
      }
      bestStreak = Math.max(bestStreak, tempStreak);
      if (i === 0 || (i === 1 && formatDate(addDays(parseDate(today), 0)) === today)) {
        currentStreak = tempStreak;
      }
      tempStreak = 0;
    }

    d = addDays(d, -1);
  }

  currentStreak = tempStreak;
  bestStreak = Math.max(bestStreak, tempStreak);

  return { current: currentStreak, best: bestStreak };
}
