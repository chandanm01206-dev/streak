// Explore Screen - habit ideas and tips
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { HabitColors } from '../theme/colors';
import { useHabitStore } from '../store';
import { getToday } from '../utils/date';

const CATEGORIES = [
  {
    name: 'Health',
    icon: 'heart-outline',
    color: HabitColors.pink,
    habits: [
      { name: 'Drink water', icon: 'glass-water', goalType: 'count' as const, goalValue: 8, goalUnit: 'glasses' },
      { name: 'Take vitamins', icon: 'nutrition', goalType: 'boolean' as const, goalValue: 1, goalUnit: 'times' },
      { name: 'Sleep early', icon: 'moon', goalType: 'boolean' as const, goalValue: 1, goalUnit: 'times' },
    ],
  },
  {
    name: 'Fitness',
    icon: 'barbell-outline',
    color: HabitColors.orange,
    habits: [
      { name: 'Morning exercise', icon: 'dumbbell', goalType: 'timer' as const, goalValue: 1800, goalUnit: 'minutes' },
      { name: 'Walk 10k steps', icon: 'walk', goalType: 'count' as const, goalValue: 10000, goalUnit: 'steps' },
      { name: 'Stretch', icon: 'body-outline', goalType: 'timer' as const, goalValue: 600, goalUnit: 'minutes' },
    ],
  },
  {
    name: 'Mind',
    icon: 'bulb-outline',
    color: HabitColors.green,
    habits: [
      { name: 'Meditate', icon: 'meditation', goalType: 'timer' as const, goalValue: 600, goalUnit: 'minutes' },
      { name: 'Journal', icon: 'pencil', goalType: 'boolean' as const, goalValue: 1, goalUnit: 'times' },
      { name: 'Gratitude list', icon: 'heart', goalType: 'count' as const, goalValue: 3, goalUnit: 'items' },
    ],
  },
  {
    name: 'Productivity',
    icon: 'rocket-outline',
    color: HabitColors.blue,
    habits: [
      { name: 'Plan your day', icon: 'pencil', goalType: 'boolean' as const, goalValue: 1, goalUnit: 'times' },
      { name: 'No social media', icon: 'phone-portrait-outline', goalType: 'boolean' as const, goalValue: 1, goalUnit: 'times' },
      { name: 'Deep work session', icon: 'code', goalType: 'timer' as const, goalValue: 5400, goalUnit: 'minutes' },
    ],
  },
  {
    name: 'Learning',
    icon: 'school-outline',
    color: HabitColors.purple,
    habits: [
      { name: 'Read', icon: 'book-open', goalType: 'count' as const, goalValue: 20, goalUnit: 'pages' },
      { name: 'Learn a language', icon: 'language', goalType: 'timer' as const, goalValue: 900, goalUnit: 'minutes' },
      { name: 'Practice instrument', icon: 'musical-note', goalType: 'timer' as const, goalValue: 1800, goalUnit: 'minutes' },
    ],
  },
];

const TIPS = [
  {
    title: 'Start Small',
    text: 'Begin with just 2 minutes. A small habit is better than no habit.',
    icon: 'leaf-outline',
  },
  {
    title: 'Stack Your Habits',
    text: 'Link a new habit to an existing one: "After I pour my coffee, I will meditate for 1 minute."',
    icon: 'layers-outline',
  },
  {
    title: 'Never Miss Twice',
    text: 'Missing once is an accident. Missing twice is the start of a new (bad) habit.',
    icon: 'shield-checkmark-outline',
  },
];

export function ExploreScreen() {
  const addHabit = useHabitStore(s => s.addHabit);

  const handleQuickAdd = async (habit: any, categoryColor: string) => {
    await addHabit({
      name: habit.name,
      icon: habit.icon,
      color: categoryColor,
      goalType: habit.goalType,
      goalValue: habit.goalValue,
      goalUnit: habit.goalUnit,
      frequency: { type: 'daily' },
      timeOfDay: 'any',
      reminders: [],
      startDate: getToday(),
    });
    Alert.alert('Added!', `"${habit.name}" has been added to your habits.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover new habits to build</Text>

        {/* Habit Categories */}
        {CATEGORIES.map(category => (
          <View key={category.name} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name={category.icon as any} size={20} color={category.color} />
              <Text style={[styles.categoryTitle, { color: category.color }]}>
                {category.name}
              </Text>
            </View>

            {category.habits.map(habit => (
              <TouchableOpacity
                key={habit.name}
                style={styles.habitSuggestion}
                onPress={() => handleQuickAdd(habit, category.color)}
              >
                <Text style={styles.habitSuggestionName}>{habit.name}</Text>
                <Ionicons name="add-circle-outline" size={22} color={DarkTheme.accent} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Tips Section */}
        <Text style={styles.tipsTitle}>💡 Tips for Building Habits</Text>
        {TIPS.map(tip => (
          <View key={tip.title} style={styles.tipCard}>
            <Ionicons name={tip.icon as any} size={24} color={DarkTheme.accent} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          </View>
        ))}

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
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  habitSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  habitSuggestionName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.primaryText,
  },
  tipsTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    lineHeight: 18,
  },
});
