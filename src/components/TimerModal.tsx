// Built-in Countdown Timer / Stopwatch Modal for timer-type habits
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DarkTheme, Spacing, FontFamily, FontSize, BorderRadius } from '../theme';
import { Habit } from '../types';

interface TimerModalProps {
  visible: boolean;
  habit: Habit | null;
  initialSeconds?: number;
  onClose: () => void;
  onComplete: (habitId: string) => void;
  onUpdateProgress: (habitId: string, elapsedSeconds: number) => void;
}

export function TimerModal({
  visible,
  habit,
  initialSeconds = 0,
  onClose,
  onComplete,
  onUpdateProgress,
}: TimerModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const targetSeconds = habit?.goalValue || 1800; // default 30 min
  const remainingSeconds = Math.max(0, targetSeconds - elapsed);

  // Sync initial seconds when modal opens
  useEffect(() => {
    if (visible) {
      setElapsed(initialSeconds);
      setIsRunning(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [visible, initialSeconds]);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= targetSeconds) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (habit) onComplete(habit.id);
            return targetSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, targetSeconds, habit, onComplete]);

  if (!habit) return null;

  const handleTogglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    setElapsed(0);
    onUpdateProgress(habit.id, 0);
  };

  const handleSaveAndClose = () => {
    if (habit) {
      onUpdateProgress(habit.id, elapsed);
    }
    onClose();
  };

  const handleFinishEarly = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (habit) {
      onComplete(habit.id);
    }
    onClose();
  };

  // Format time mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((elapsed / targetSeconds) * 100));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleSaveAndClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSaveAndClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={DarkTheme.secondaryText} />
            </TouchableOpacity>
            <Text style={styles.title}>{habit.name}</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Timer Display Circle */}
          <View style={styles.timerCircleContainer}>
            <View
              style={[
                styles.timerOuterRing,
                { borderColor: habit.color + '30' },
              ]}
            >
              <View
                style={[
                  styles.timerInnerCircle,
                  { backgroundColor: habit.color + '15' },
                ]}
              >
                <Text style={styles.countdownText}>{formatTime(remainingSeconds)}</Text>
                <Text style={styles.progressSubtext}>
                  {formatTime(elapsed)} of {formatTime(targetSeconds)} ({progressPercent}%)
                </Text>
              </View>
            </View>
          </View>

          {/* Action Controls */}
          <View style={styles.controlsRow}>
            {/* Reset Button */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={24} color={DarkTheme.secondaryText} />
            </TouchableOpacity>

            {/* Play / Pause Primary Button */}
            <TouchableOpacity
              style={[styles.primaryPlayBtn, { backgroundColor: habit.color }]}
              onPress={handleTogglePlay}
            >
              <Ionicons
                name={isRunning ? 'pause' : 'play'}
                size={34}
                color="#FFFFFF"
                style={!isRunning ? { marginLeft: 4 } : undefined}
              />
            </TouchableOpacity>

            {/* Complete Early Button */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleFinishEarly}
            >
              <Ionicons name="checkmark-done" size={24} color={DarkTheme.success} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonLabelsRow}>
            <Text style={styles.buttonLabel}>Reset</Text>
            <Text style={styles.buttonLabel}>{isRunning ? 'Pause' : 'Start'}</Text>
            <Text style={styles.buttonLabel}>Complete</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: DarkTheme.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: DarkTheme.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 48,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  timerCircleContainer: {
    marginVertical: Spacing.xl,
  },
  timerOuterRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInnerCircle: {
    width: 196,
    height: 196,
    borderRadius: 98,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  countdownText: {
    fontSize: 48,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    letterSpacing: 2,
  },
  progressSubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginTop: Spacing.lg,
  },
  primaryPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: DarkTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 240,
    marginTop: Spacing.sm,
  },
  buttonLabel: {
    width: 70,
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.secondaryText,
  },
});

