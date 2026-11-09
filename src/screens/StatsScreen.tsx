// Stats Screen - showing habit completion statistics
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { useHabitStore } from '../store';

export function StatsScreen() {
  const { habits, streaks, todayLogs } = useHabitStore();

  const totalHabits = habits.length;
  const totalCompleted = Array.from(todayLogs.values()).filter(l => l.status === 'done').length;
  const completionRate = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  // Best streak across all habits
  const bestStreak = Math.max(0, ...Array.from(streaks.values()).map(s => s.best));
  const currentBest = Math.max(0, ...Array.from(streaks.values()).map(s => s.current));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Statistics</Text>

        {/* Overview Cards */}
        <View style={styles.overviewRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCompleted}</Text>
            <Text style={styles.statLabel}>Completed Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentBest}</Text>
            <Text style={styles.statLabel}>Current Best Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bestStreak}</Text>
            <Text style={styles.statLabel}>All-Time Best</Text>
          </View>
        </View>

        {/* Per-habit streaks */}
        <Text style={styles.sectionTitle}>Habit Streaks</Text>
        {habits.map(habit => {
          const streak = streaks.get(habit.id);
          return (
            <View key={habit.id} style={styles.habitStreakRow}>
              <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
              <Text style={styles.habitName}>{habit.name}</Text>
              <View style={styles.streakInfo}>
                <Text style={[styles.streakNumber, { color: habit.color }]}>
                  {streak?.current ?? 0}
                </Text>
                <Text style={styles.streakLabel}>current</Text>
              </View>
              <View style={styles.streakInfo}>
                <Text style={[styles.streakNumber, { color: DarkTheme.secondaryText }]}>
                  {streak?.best ?? 0}
                </Text>
                <Text style={styles.streakLabel}>best</Text>
              </View>
            </View>
          );
        })}

        {/* Heatmap placeholder */}
        <Text style={styles.sectionTitle}>Activity Heatmap</Text>
        <View style={styles.heatmapPlaceholder}>
          <Text style={styles.placeholderText}>
            📊 Heatmap visualization shows here after a week of data
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DarkTheme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: ScreenPadding,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.hero,
    fontFamily: FontFamily.extraBold,
    color: DarkTheme.accent,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  habitStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  habitName: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.primaryText,
  },
  streakInfo: {
    alignItems: 'center',
    minWidth: 50,
  },
  streakNumber: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  streakLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  heatmapPlaceholder: {
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  placeholderText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    textAlign: 'center',
  },
});
