// Main habit card component for the Today screen
import React, { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, BorderRadius, Spacing, FontFamily, FontSize, CardGap } from '../theme';
import { Habit, HabitLog, StreakInfo } from '../types';
import { HabitIcon } from './HabitIcon';
import { StreakBadge } from './StreakBadge';
import * as Haptics from 'expo-haptics';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  streak?: StreakInfo;
  onIncrement: (id: string) => void;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: (id: string) => void;
}

export function HabitCard({
  habit, log, streak, onIncrement, onComplete, onSkip, onDelete, onPress,
}: HabitCardProps) {
  const currentValue = log?.value ?? 0;
  const isDone = log?.status === 'done';
  const isSkipped = log?.status === 'skipped';
  const progress = habit.goalType === 'boolean'
    ? (isDone ? 1 : 0)
    : currentValue;

  const handlePress = useCallback(() => {
    if (isDone || isSkipped) return;

    if (habit.goalType === 'boolean') {
      onComplete(habit.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (habit.goalType === 'count') {
      onIncrement(habit.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [habit, isDone, isSkipped, onComplete, onIncrement]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      habit.name,
      undefined,
      [
        { text: 'Complete', onPress: () => onComplete(habit.id) },
        { text: 'Skip', onPress: () => onSkip(habit.id), style: 'default' },
        { text: 'Delete', onPress: () => onDelete(habit.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [habit, onComplete, onSkip, onDelete]);

  const renderProgress = () => {
    if (habit.goalType === 'timer') {
      const minutes = Math.floor(habit.goalValue / 60);
      const currentMinutes = Math.floor(currentValue / 60);
      return (
        <TouchableOpacity style={[styles.timerButton, { borderColor: habit.color + '40' }]}>
          <Ionicons name="timer-outline" size={18} color={habit.color} />
          <Text style={[styles.timerText, { color: habit.color }]}>
            {isDone ? `${minutes}m` : `${currentMinutes}/${minutes}m`}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text style={[styles.progressText, { color: habit.color }]}>
        {Math.floor(progress)}/{habit.goalValue} {habit.goalUnit}
      </Text>
    );
  };

  const streakCount = streak?.current ?? 0;
  const isNew = streakCount === 0;

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[
        styles.card,
        isDone && styles.cardDone,
        isSkipped && styles.cardSkipped,
      ]}
    >
      <HabitIcon icon={habit.icon} color={habit.color} size={22} />

      <View style={styles.content}>
        <Text style={[
          styles.habitName,
          isDone && styles.habitNameDone,
        ]}>
          {habit.name}
        </Text>
        <StreakBadge
          streak={streakCount}
          color={habit.color}
          isNew={isNew}
        />
      </View>

      <View style={styles.progressContainer}>
        {isDone ? (
          <View style={[styles.checkCircle, { backgroundColor: habit.color }]}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </View>
        ) : (
          renderProgress()
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: CardGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDone: {
    opacity: 0.6,
  },
  cardSkipped: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 2,
  },
  habitName: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.primaryText,
  },
  habitNameDone: {
    textDecorationLine: 'line-through',
    color: DarkTheme.secondaryText,
  },
  progressContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  progressText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  timerText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
