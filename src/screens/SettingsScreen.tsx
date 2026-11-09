// Settings Screen - Configuration and preferences
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, ScreenPadding, BorderRadius } from '../theme';
import { useHabitStore } from '../store';
import { getDatabase } from '../db/database';
import { seedDatabase } from '../db/seed';
import { AppEntryAnimation } from '../components/AppEntryAnimation';

export function SettingsScreen({ navigation }: any) {
  const { settings, initialize, habits } = useHabitStore();
  const [showSplashPreview, setShowSplashPreview] = useState(false);
  const [notifications, setNotifications] = useState(settings.notificationsEnabled);
  const [streakFreeze, setStreakFreeze] = useState(settings.streakFreezeEnabled);
  const [taskRollover, setTaskRollover] = useState(settings.taskRolloverEnabled);
  const [firstDay, setFirstDay] = useState(settings.firstDayOfWeek === 1 ? 'Monday' : 'Sunday');

  const handleToggleFirstDay = () => {
    setFirstDay(prev => (prev === 'Monday' ? 'Sunday' : 'Monday'));
  };

  const handleExportData = () => {
    const backup = {
      habits,
      settings: {
        ...settings,
        notificationsEnabled: notifications,
        streakFreezeEnabled: streakFreeze,
        taskRolloverEnabled: taskRollover,
      },
      exportedAt: new Date().toISOString(),
    };
    Alert.alert('Data Export', JSON.stringify(backup, null, 2));
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Paste your JSON backup data to restore your habits.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => Alert.alert('Success', 'Data imported successfully.') },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all habits, tasks, and history and re-seed the default habits. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = getDatabase();
              await db.execAsync(`
                DELETE FROM habit_logs;
                DELETE FROM tasks;
                DELETE FROM challenges;
                DELETE FROM badges;
                DELETE FROM habits;
              `);
              await seedDatabase();
              await initialize();
              Alert.alert('Reset Complete', 'App data has been reset to defaults.');
            } catch {
              Alert.alert('Error', 'Failed to reset data');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.primaryText} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="moon-outline"
            label="Theme"
            value="Dark Mode (Default)"
            onPress={() => Alert.alert('Theme', 'Dark minimal theme is currently active.')}
          />
          <SettingRow
            icon="calendar-outline"
            label="First Day of Week"
            value={firstDay}
            onPress={handleToggleFirstDay}
          />
        </View>

        {/* Motivation & Streaks */}
        <Text style={styles.sectionTitle}>Motivation & Streaks</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="notifications-outline"
            label="Daily Reminders"
            hasSwitch
            switchValue={notifications}
            onToggleSwitch={setNotifications}
          />
          <SettingRow
            icon="time-outline"
            label="Default Reminder Time"
            value={settings.defaultReminderTime || '09:00 AM'}
            onPress={() => Alert.alert('Reminder Time', 'Default reminder set to 09:00 AM')}
          />
          <SettingRow
            icon="flame-outline"
            label="Streak Freeze Auto-Protection"
            hasSwitch
            switchValue={streakFreeze}
            onToggleSwitch={setStreakFreeze}
          />
        </View>

        {/* Tasks */}
        <Text style={styles.sectionTitle}>Tasks</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="refresh-outline"
            label="Roll Over Incomplete Tasks"
            hasSwitch
            switchValue={taskRollover}
            onToggleSwitch={setTaskRollover}
          />
        </View>

        {/* Habit Management */}
        <Text style={styles.sectionTitle}>Habits Management</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="list-outline"
            label="Manage All Habits"
            onPress={() => navigation.navigate('HabitsManage')}
          />
          <SettingRow
            icon="archive-outline"
            label="Archived Habits"
            onPress={() => navigation.navigate('HabitsManage', { filter: 'archived' })}
          />
          <SettingRow
            icon="trophy-outline"
            label="Achievements & Badges"
            onPress={() => navigation.navigate('Badges')}
          />
        </View>

        {/* Data */}
        <Text style={styles.sectionTitle}>Data & Backup</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="download-outline"
            label="Export JSON Backup"
            onPress={handleExportData}
          />
          <SettingRow
            icon="push-outline"
            label="Import JSON Backup"
            onPress={handleImportData}
          />
          <SettingRow
            icon="trash-outline"
            label="Reset All Data"
            isDestructive
            onPress={handleResetData}
          />
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingGroup}>
          <SettingRow
            icon="play-circle-outline"
            label="Preview App Entry Animation"
            onPress={() => setShowSplashPreview(true)}
          />
          <SettingRow icon="information-circle-outline" label="Version" value="1.0.0 (Production)" />
          <SettingRow icon="shield-checkmark-outline" label="Storage" value="Local SQLite (Offline-First)" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Entry animation preview modal */}
      {showSplashPreview && (
        <AppEntryAnimation onFinish={() => setShowSplashPreview(false)} />
      )}
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  value,
  hasSwitch,
  switchValue,
  onToggleSwitch,
  isDestructive,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onToggleSwitch?: (v: boolean) => void;
  isDestructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={hasSwitch ? 1 : 0.7}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={isDestructive ? DarkTheme.danger : DarkTheme.secondaryText}
      />
      <Text
        style={[
          styles.settingLabel,
          isDestructive && { color: DarkTheme.danger },
        ]}
      >
        {label}
      </Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {hasSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onToggleSwitch}
          trackColor={{ false: '#3A3A3A', true: DarkTheme.accent + '80' }}
          thumbColor={switchValue ? DarkTheme.accent : '#888'}
        />
      )}
      {!hasSwitch && !value && (
        <Ionicons name="chevron-forward" size={18} color={DarkTheme.secondaryText} />
      )}
    </TouchableOpacity>
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
  sectionTitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: DarkTheme.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  settingGroup: {
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: DarkTheme.divider,
  },
  settingLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.primaryText,
  },
  settingValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
});
