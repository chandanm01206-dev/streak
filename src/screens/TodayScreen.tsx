// Today Screen - main home screen showing habits and tasks for the selected date
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding } from '../theme';
import { useHabitStore } from '../store';
import { DateStrip, TabFilter, HabitCard, TaskItem, NightScene } from '../components';

export function TodayScreen({ navigation }: any) {
  const {
    todayLogs, tasks, selectedDate, timeFilter, streaks,
    setSelectedDate, setTimeFilter, incrementHabit, completeHabit,
    skipHabit, deleteHabit, toggleTask, deleteTask, addTask,
    getCompletedHabits, getPendingHabits,
  } = useHabitStore();

  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const completedHabits = getCompletedHabits();
  const pendingHabits = getPendingHabits();

  // Get the max current streak for motivational message
  const maxStreak = Math.max(0, ...Array.from(streaks.values()).map(s => s.current));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const store = useHabitStore.getState();
    await store.loadHabits();
    await store.loadLogsForDate(store.selectedDate);
    await store.loadTasksForDate(store.selectedDate);
    await store.loadStreaks();
    setRefreshing(false);
  }, []);

  const handleDeleteHabit = useCallback((id: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteHabit(id), style: 'destructive' },
      ]
    );
  }, [deleteHabit]);

  const handleDeleteTask = useCallback((id: string) => {
    Alert.alert(
      'Delete Task',
      'Delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteTask(id), style: 'destructive' },
      ]
    );
  }, [deleteTask]);

  const handleAddTask = useCallback(async () => {
    if (newTaskTitle.trim()) {
      await addTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setAddingTask(false);
    }
  }, [newTaskTitle, addTask]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.openDrawer?.()}
            style={styles.headerButton}
          >
            <Ionicons name="menu" size={24} color={DarkTheme.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate?.('Settings')}
            style={styles.headerButton}
          >
            <Ionicons name="settings-outline" size={24} color={DarkTheme.primaryText} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={DarkTheme.accent}
            />
          }
        >
          {/* Date Strip */}
          <DateStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Illustration */}
          <NightScene />

          {/* Motivational message */}
          {maxStreak >= 3 && (
            <View style={styles.motivationContainer}>
              <Text style={styles.motivationText}>
                You&apos;re on a {maxStreak}-day roll 🔥
              </Text>
            </View>
          )}

          {/* Time of day filter */}
          <TabFilter
            selected={timeFilter}
            onSelect={setTimeFilter}
          />

          {/* Pending Habits */}
          <View style={styles.section}>
            {pendingHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                log={todayLogs.get(habit.id)}
                streak={streaks.get(habit.id)}
                onIncrement={incrementHabit}
                onComplete={completeHabit}
                onSkip={skipHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </View>

          {/* Completed Habits */}
          {completedHabits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Completed ({completedHabits.length})
              </Text>
              {completedHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  log={todayLogs.get(habit.id)}
                  streak={streaks.get(habit.id)}
                  onIncrement={incrementHabit}
                  onComplete={completeHabit}
                  onSkip={skipHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </View>
          )}

          {/* Tasks Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Tasks</Text>

            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={handleDeleteTask}
              />
            ))}

            {/* Add task */}
            {addingTask ? (
              <View style={styles.addTaskRow}>
                <TextInput
                  style={styles.addTaskInput}
                  placeholder="Task title..."
                  placeholderTextColor={DarkTheme.secondaryText}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  onSubmitEditing={handleAddTask}
                  autoFocus
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={handleAddTask}>
                  <Ionicons name="checkmark-circle" size={28} color={DarkTheme.accent} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setAddingTask(false); setNewTaskTitle(''); }}>
                  <Ionicons name="close-circle" size={28} color={DarkTheme.secondaryText} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={() => setAddingTask(true)}
              >
                <Ionicons name="add" size={20} color={DarkTheme.accent} />
                <Text style={styles.addTaskText}>Add task</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom spacer for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
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
    paddingVertical: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  scrollView: {
    flex: 1,
  },
  motivationContainer: {
    paddingHorizontal: ScreenPadding,
    paddingVertical: Spacing.sm,
  },
  motivationText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.accent,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: ScreenPadding,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.secondaryText,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  addTaskInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.primaryText,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.divider,
    paddingVertical: Spacing.sm,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  addTaskText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.accent,
  },
});
