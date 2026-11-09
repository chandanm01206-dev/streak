// Habits Manage Screen - View all habits, reorder, archive, unarchive, or delete
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { useHabitStore } from '../store';
import { HabitIcon } from '../components/HabitIcon';
import { Habit } from '../types';

export function HabitsManageScreen({ route, navigation }: any) {
  const isArchivedFilter = route?.params?.filter === 'archived';
  const { habits, archivedHabits, deleteHabit, archiveHabit } = useHabitStore();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>(
    isArchivedFilter ? 'archived' : 'active'
  );

  const handleArchiveToggle = async (habit: Habit) => {
    const newArchivedState = !habit.archived;
    await archiveHabit(habit.id, newArchivedState);
    Alert.alert(
      newArchivedState ? 'Archived' : 'Restored',
      `"${habit.name}" has been ${newArchivedState ? 'archived' : 'restored'}.`
    );
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${name}"? All streak history will be permanently erased.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(id);
          },
        },
      ]
    );
  };

  const displayList = activeTab === 'active' ? habits : archivedHabits;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.primaryText} />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Habits</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tab Toggle: Active / Archived */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({habits.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'archived' && styles.tabItemActive]}
            onPress={() => setActiveTab('archived')}
          >
            <Text style={[styles.tabText, activeTab === 'archived' && styles.tabTextActive]}>
              Archived ({archivedHabits.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Habits List */}
        <FlatList
          data={displayList}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={activeTab === 'active' ? 'list-outline' : 'archive-outline'}
                size={48}
                color={DarkTheme.secondaryText}
              />
              <Text style={styles.emptyText}>
                {activeTab === 'active' ? 'No active habits yet' : 'No archived habits'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.habitRow}>
              <HabitIcon icon={item.icon} color={item.color} size={20} />
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitMeta}>
                  {item.goalType === 'timer'
                    ? `${Math.round(item.goalValue / 60)} min timer`
                    : `${item.goalValue} ${item.goalUnit}`} • {item.frequency.type}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleArchiveToggle(item)}
                >
                  <Ionicons
                    name={activeTab === 'active' ? 'archive-outline' : 'refresh-outline'}
                    size={20}
                    color={DarkTheme.secondaryText}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Ionicons name="trash-outline" size={20} color={DarkTheme.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ScreenPadding,
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: ScreenPadding,
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.pill,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
  },
  tabItemActive: {
    backgroundColor: DarkTheme.pillBackground,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  tabTextActive: {
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  listContent: {
    paddingHorizontal: ScreenPadding,
    paddingBottom: 40,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  habitInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  habitName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.primaryText,
  },
  habitMeta: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionBtn: {
    padding: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
});
