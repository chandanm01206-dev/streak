// Challenges Screen - shows pre-built and custom challenges
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { HabitColors } from '../theme/colors';

const CHALLENGES = [
  {
    id: '1',
    title: '7-Day Hydration',
    description: 'Drink at least 5 glasses of water every day for a week.',
    duration: 7,
    color: HabitColors.blue,
    icon: 'water-outline',
  },
  {
    id: '2',
    title: '21-Day Reading',
    description: 'Read at least 20 pages every day for 21 days.',
    duration: 21,
    color: HabitColors.purple,
    icon: 'book-outline',
  },
  {
    id: '3',
    title: '30-Day Morning Workout',
    description: 'Exercise every morning for 30 days straight.',
    duration: 30,
    color: HabitColors.orange,
    icon: 'barbell-outline',
  },
  {
    id: '4',
    title: '14-Day Mindfulness',
    description: 'Meditate for at least 10 minutes every day.',
    duration: 14,
    color: HabitColors.green,
    icon: 'flower-outline',
  },
];

export function ChallengesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>
          Push yourself with structured challenges
        </Text>

        {CHALLENGES.map(challenge => (
          <View key={challenge.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: challenge.color + '20' }]}>
                <Ionicons name={challenge.icon as any} size={24} color={challenge.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{challenge.title}</Text>
                <Text style={styles.cardDuration}>{challenge.duration} days</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{challenge.description}</Text>
            <TouchableOpacity style={[styles.joinButton, { backgroundColor: challenge.color }]}>
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Create custom challenge */}
        <TouchableOpacity style={styles.createCard}>
          <Ionicons name="add-circle-outline" size={32} color={DarkTheme.accent} />
          <Text style={styles.createText}>Create Custom Challenge</Text>
        </TouchableOpacity>

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
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  cardDuration: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  joinButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
  createCard: {
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: DarkTheme.divider,
    borderStyle: 'dashed',
  },
  createText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.accent,
  },
});
