// Milestone celebration modal with animated confetti and badge unlocked feedback
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { DarkTheme, Spacing, FontFamily, FontSize, BorderRadius } from '../theme';
import { HabitColors } from '../theme/colors';

interface CelebrationModalProps {
  visible: boolean;
  milestone: number;
  habitName: string;
  onClose: () => void;
}

export function CelebrationModal({
  visible,
  milestone,
  habitName,
  onClose,
}: CelebrationModalProps) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = 0.5;
      opacity.value = 0;
    }
  }, [visible, opacity, scale]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.dialog, animatedCardStyle]}>
          {/* Confetti icon badges */}
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={48} color={HabitColors.yellow} />
          </View>

          <Text style={styles.congratsTitle}>Milestone Unlocked! 🎉</Text>
          <Text style={styles.streakCount}>{milestone}-Day Streak</Text>
          <Text style={styles.habitSubtitle}>on &ldquo;{habitName}&rdquo;</Text>

          <Text style={styles.message}>
            Consistency is the superpower of greatness. You have proven your dedication and earned +1 Streak Freeze!
          </Text>

          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onClose();
            }}
          >
            <Text style={styles.claimButtonText}>Keep the Fire Burning 🔥</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: DarkTheme.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  dialog: {
    width: '100%',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: HabitColors.yellow + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  congratsTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginBottom: Spacing.xs,
  },
  streakCount: {
    fontSize: FontSize.hero,
    fontFamily: FontFamily.extraBold,
    color: HabitColors.orange,
  },
  habitSubtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.secondaryText,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  claimButton: {
    backgroundColor: DarkTheme.accent,
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
});
