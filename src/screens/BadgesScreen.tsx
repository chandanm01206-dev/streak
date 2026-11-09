// Badges & Achievements Screen - Displays streak milestones and earned trophies
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { HabitColors } from '../theme/colors';
import { useHabitStore } from '../store';

interface MilestoneBadge {
  days: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

const MILESTONES: MilestoneBadge[] = [
  { days: 3, title: 'Seedling Spark', desc: 'Maintain any habit for 3 consecutive scheduled days', icon: 'leaf-outline', color: HabitColors.green },
  { days: 7, title: 'Week Warrior', desc: 'Completed 7 days straight! Earned +1 streak freeze protection', icon: 'flame-outline', color: HabitColors.yellow },
  { days: 14, title: 'Two-Week Titan', desc: '14 consecutive days of self-discipline', icon: 'shield-checkmark-outline', color: HabitColors.orange },
  { days: 30, title: 'Habit Master', desc: '1 full month unbroken. The neurological habit loop is locked!', icon: 'trophy-outline', color: HabitColors.blue },
  { days: 50, title: 'Unstoppable Force', desc: '50-day streak unbroken', icon: 'diamond-outline', color: HabitColors.purple },
  { days: 100, title: 'Century Legend', desc: '100 days of absolute consistency and focus', icon: 'ribbon-outline', color: HabitColors.pink },
  { days: 365, title: 'Year of Greatness', desc: '365 days of transforming your life one day at a time', icon: 'star', color: '#FFD700' },
];

export function BadgesScreen({ navigation }: any) {
  const { streaks } = useHabitStore();

  const maxBestStreak = Math.max(0, ...Array.from(streaks.values()).map(s => s.best));
  const maxCurrentStreak = Math.max(0, ...Array.from(streaks.values()).map(s => s.current));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.primaryText} />
          </TouchableOpacity>
          <Text style={styles.title}>Badges & Milestones</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Current status summary card */}
        <View style={styles.summaryCard}>
          <Ionicons name="flame" size={36} color={HabitColors.orange} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Current Best: {maxCurrentStreak} Days</Text>
            <Text style={styles.summarySubtitle}>All-Time Peak Record: {maxBestStreak} Days</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Streak Milestones</Text>

        {MILESTONES.map(item => {
          const isUnlocked = maxBestStreak >= item.days;
          return (
            <View
              key={item.days}
              style={[
                styles.badgeCard,
                !isUnlocked && styles.badgeCardLocked,
              ]}
            >
              <View
                style={[
                  styles.badgeIconCircle,
                  { backgroundColor: isUnlocked ? item.color + '25' : '#333333' },
                ]}
              >
                <Ionicons
                  name={isUnlocked ? (item.icon as any) : 'lock-closed'}
                  size={26}
                  color={isUnlocked ? item.color : DarkTheme.secondaryText}
                />
              </View>

              <View style={styles.badgeDetails}>
                <View style={styles.badgeHeaderRow}>
                  <Text style={[styles.badgeTitle, !isUnlocked && styles.textLocked]}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.dayPill,
                      { backgroundColor: isUnlocked ? item.color + '30' : '#3A3A3A' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayPillText,
                        { color: isUnlocked ? item.color : DarkTheme.secondaryText },
                      ]}
                    >
                      {item.days}d
                    </Text>
                  </View>
                </View>
                <Text style={styles.badgeDesc}>{item.desc}</Text>
                {isUnlocked ? (
                  <Text style={[styles.badgeStatus, { color: DarkTheme.success }]}>
                    ✓ Unlocked
                  </Text>
                ) : (
                  <Text style={styles.badgeStatusLocked}>
                    {Math.max(0, item.days - maxCurrentStreak)} days remaining
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  summarySubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: DarkTheme.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  badgeCardLocked: {
    opacity: 0.65,
  },
  badgeIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDetails: {
    flex: 1,
  },
  badgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badgeTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  textLocked: {
    color: DarkTheme.secondaryText,
  },
  dayPill: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  dayPillText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  badgeDesc: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    lineHeight: 16,
    marginBottom: 6,
  },
  badgeStatus: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  badgeStatusLocked: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
});

