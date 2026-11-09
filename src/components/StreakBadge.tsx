// Streak display badge with flame icon
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme';
import { getFlameTier } from '../utils/streak';

interface StreakBadgeProps {
  streak: number;
  color?: string;
  isNew?: boolean;
}

const FLAME_COLORS = {
  none: '#9A9A9A',
  small: '#F5B82E',
  medium: '#F26B3A',
  large: '#E8436B',
  epic: '#8E6CEF',
};

export function StreakBadge({ streak, color, isNew = false }: StreakBadgeProps) {
  if (isNew) {
    return (
      <View style={styles.container}>
        <Text style={[styles.starIcon, { color: color || '#F5B82E' }]}>★</Text>
        <Text style={[styles.text, { color: color || '#F5B82E' }]}>New</Text>
      </View>
    );
  }

  if (streak <= 0) return null;

  const tier = getFlameTier(streak);
  const flameColor = FLAME_COLORS[tier];

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={14} color={flameColor} />
      <Text style={[styles.text, { color: flameColor }]}>
        {streak} day{streak !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  starIcon: {
    fontSize: 12,
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
  },
});
