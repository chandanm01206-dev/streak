// Add Modal / BottomSheet: allows creating New Habit or New Task with full options
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DarkTheme, Spacing, FontFamily, FontSize, BorderRadius } from '../theme';
import { HabitColors, HabitColorName } from '../theme/colors';
import { GoalType, FrequencyType, TimeOfDay, DayOfWeek } from '../types';
import { useHabitStore } from '../store';
import { getToday } from '../utils/date';

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
}

const TEMPLATES = [
  { name: 'Drink water', icon: 'glass-water', color: HabitColors.blue, goalType: 'count' as GoalType, goalValue: 5, goalUnit: 'glasses', timeOfDay: 'any' as TimeOfDay },
  { name: 'Morning exercise', icon: 'dumbbell', color: HabitColors.orange, goalType: 'timer' as GoalType, goalValue: 1800, goalUnit: 'minutes', timeOfDay: 'morning' as TimeOfDay },
  { name: 'Brush & floss', icon: 'sparkles', color: HabitColors.pink, goalType: 'boolean' as GoalType, goalValue: 1, goalUnit: 'times', timeOfDay: 'morning' as TimeOfDay },
  { name: 'Read', icon: 'book-open', color: HabitColors.purple, goalType: 'count' as GoalType, goalValue: 20, goalUnit: 'pages', timeOfDay: 'evening' as TimeOfDay },
  { name: 'Meditate', icon: 'meditation', color: HabitColors.green, goalType: 'timer' as GoalType, goalValue: 600, goalUnit: 'minutes', timeOfDay: 'morning' as TimeOfDay },
  { name: 'Sleep early', icon: 'moon', color: HabitColors.purple, goalType: 'boolean' as GoalType, goalValue: 1, goalUnit: 'times', timeOfDay: 'evening' as TimeOfDay },
  { name: 'Walk 10k steps', icon: 'walk', color: HabitColors.yellow, goalType: 'count' as GoalType, goalValue: 10000, goalUnit: 'steps', timeOfDay: 'any' as TimeOfDay },
];

const AVAILABLE_ICONS = [
  { id: 'glass-water', name: 'water-outline' },
  { id: 'dumbbell', name: 'barbell-outline' },
  { id: 'sparkles', name: 'sparkles-outline' },
  { id: 'book-open', name: 'book-outline' },
  { id: 'moon', name: 'moon-outline' },
  { id: 'walk', name: 'walk-outline' },
  { id: 'heart', name: 'heart-outline' },
  { id: 'meditation', name: 'flower-outline' },
  { id: 'pencil', name: 'pencil-outline' },
  { id: 'brain', name: 'bulb-outline' },
  { id: 'code', name: 'code-slash-outline' },
  { id: 'nutrition', name: 'nutrition-outline' },
];

const COLOR_OPTIONS: { name: HabitColorName; hex: string }[] = [
  { name: 'blue', hex: HabitColors.blue },
  { name: 'orange', hex: HabitColors.orange },
  { name: 'yellow', hex: HabitColors.yellow },
  { name: 'pink', hex: HabitColors.pink },
  { name: 'green', hex: HabitColors.green },
  { name: 'purple', hex: HabitColors.purple },
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function AddModal({ visible, onClose }: AddModalProps) {
  const { addHabit, addTask } = useHabitStore();

  // Mode: 'choose' | 'habit' | 'task'
  const [mode, setMode] = useState<'choose' | 'habit' | 'task'>('choose');

  // Habit Form State
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('glass-water');
  const [selectedColor, setSelectedColor] = useState<string>(HabitColors.blue);
  const [goalType, setGoalType] = useState<GoalType>('boolean');
  const [goalCount, setGoalCount] = useState('1');
  const [goalUnit, setGoalUnit] = useState('times');
  const [timerMinutes, setTimerMinutes] = useState('30');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([1, 2, 3, 4, 5]);
  const [timesPerWeek, setTimesPerWeek] = useState('3');
  const [intervalDays, setIntervalDays] = useState('2');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('any');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [hasReminder, setHasReminder] = useState(false);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  const resetAll = () => {
    setMode('choose');
    setHabitName('');
    setSelectedIcon('glass-water');
    setSelectedColor(HabitColors.blue);
    setGoalType('boolean');
    setGoalCount('1');
    setGoalUnit('times');
    setTimerMinutes('30');
    setFrequencyType('daily');
    setSelectedDays([1, 2, 3, 4, 5]);
    setTimeOfDay('any');
    setHasReminder(false);
    setTaskTitle('');
    setTaskTime('');
    setTaskNotes('');
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHabitName(tpl.name);
    setSelectedIcon(tpl.icon);
    setSelectedColor(tpl.color);
    setGoalType(tpl.goalType);
    if (tpl.goalType === 'count') {
      setGoalCount(tpl.goalValue.toString());
      setGoalUnit(tpl.goalUnit);
    } else if (tpl.goalType === 'timer') {
      setTimerMinutes(Math.round(tpl.goalValue / 60).toString());
      setGoalUnit('minutes');
    } else {
      setGoalCount('1');
      setGoalUnit('times');
    }
    setTimeOfDay(tpl.timeOfDay);
  };

  const toggleWeekday = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSaveHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the habit.');
      return;
    }

    let val = 1;
    let unit = goalUnit;
    if (goalType === 'count') {
      val = parseFloat(goalCount) || 1;
    } else if (goalType === 'timer') {
      val = (parseInt(timerMinutes, 10) || 30) * 60;
      unit = 'minutes';
    }

    await addHabit({
      name: habitName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      goalType,
      goalValue: val,
      goalUnit: unit,
      frequency: {
        type: frequencyType,
        days: frequencyType === 'specific_days' ? selectedDays : undefined,
        timesPerWeek: frequencyType === 'x_per_week' ? parseInt(timesPerWeek, 10) || 3 : undefined,
        interval: frequencyType === 'every_n_days' ? parseInt(intervalDays, 10) || 2 : undefined,
      },
      timeOfDay,
      reminders: hasReminder ? [{ id: '1', time: reminderTime, enabled: true }] : [],
      startDate: getToday(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for the task.');
      return;
    }

    await addTask(
      taskTitle.trim(),
      getToday(),
      taskTime.trim() || undefined,
      taskNotes.trim() || undefined
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.sheetHeader}>
            {mode !== 'choose' && (
              <TouchableOpacity onPress={() => setMode('choose')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color={DarkTheme.secondaryText} />
              </TouchableOpacity>
            )}
            <Text style={styles.sheetTitle}>
              {mode === 'choose' ? 'Create New' : mode === 'habit' ? 'New Habit' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={DarkTheme.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* MODE: Choose between Habit or Task */}
          {mode === 'choose' && (
            <View style={styles.chooseContent}>
              <TouchableOpacity
                style={styles.chooseCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMode('habit');
                }}
              >
                <View style={[styles.chooseIconCircle, { backgroundColor: DarkTheme.accent + '25' }]}>
                  <Ionicons name="repeat" size={28} color={DarkTheme.accent} />
                </View>
                <View style={styles.chooseTextContainer}>
                  <Text style={styles.chooseCardTitle}>New Habit</Text>
                  <Text style={styles.chooseCardDesc}>
                    Track a daily routine, build a streak, and form long-term discipline
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={DarkTheme.secondaryText} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chooseCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMode('task');
                }}
              >
                <View style={[styles.chooseIconCircle, { backgroundColor: HabitColors.green + '25' }]}>
                  <Ionicons name="checkbox-outline" size={28} color={HabitColors.green} />
                </View>
                <View style={styles.chooseTextContainer}>
                  <Text style={styles.chooseCardTitle}>New Task</Text>
                  <Text style={styles.chooseCardDesc}>
                    A one-off to-do checklist item for today
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={DarkTheme.secondaryText} />
              </TouchableOpacity>
            </View>
          )}

          {/* MODE: Habit Form */}
          {mode === 'habit' && (
            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              {/* Templates Carousel */}
              <Text style={styles.fieldLabel}>Quick Templates</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {TEMPLATES.map(tpl => (
                  <TouchableOpacity
                    key={tpl.name}
                    style={styles.templatePill}
                    onPress={() => applyTemplate(tpl)}
                  >
                    <View style={[styles.tplDot, { backgroundColor: tpl.color }]} />
                    <Text style={styles.templateText}>{tpl.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Habit Name */}
              <Text style={styles.fieldLabel}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Read books, Drink water"
                placeholderTextColor={DarkTheme.secondaryText}
                value={habitName}
                onChangeText={setHabitName}
              />

              {/* Color Picker */}
              <Text style={styles.fieldLabel}>Color</Text>
              <View style={styles.colorRow}>
                {COLOR_OPTIONS.map(c => (
                  <TouchableOpacity
                    key={c.name}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c.hex },
                      selectedColor === c.hex && styles.colorCircleSelected,
                    ]}
                    onPress={() => setSelectedColor(c.hex)}
                  >
                    {selectedColor === c.hex && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Icon Picker */}
              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.iconGrid}>
                {AVAILABLE_ICONS.map(ic => (
                  <TouchableOpacity
                    key={ic.id}
                    style={[
                      styles.iconBox,
                      selectedIcon === ic.id && {
                        borderColor: selectedColor,
                        backgroundColor: selectedColor + '20',
                      },
                    ]}
                    onPress={() => setSelectedIcon(ic.id)}
                  >
                    <Ionicons
                      name={ic.name as any}
                      size={22}
                      color={selectedIcon === ic.id ? selectedColor : DarkTheme.secondaryText}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Goal Type */}
              <Text style={styles.fieldLabel}>Goal Type</Text>
              <View style={styles.segmentRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, goalType === 'boolean' && styles.segmentBtnActive]}
                  onPress={() => setGoalType('boolean')}
                >
                  <Text style={[styles.segmentText, goalType === 'boolean' && styles.segmentTextActive]}>
                    Yes / No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, goalType === 'count' && styles.segmentBtnActive]}
                  onPress={() => setGoalType('count')}
                >
                  <Text style={[styles.segmentText, goalType === 'count' && styles.segmentTextActive]}>
                    Count
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, goalType === 'timer' && styles.segmentBtnActive]}
                  onPress={() => setGoalType('timer')}
                >
                  <Text style={[styles.segmentText, goalType === 'timer' && styles.segmentTextActive]}>
                    Timer
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Goal parameters */}
              {goalType === 'count' && (
                <View style={styles.dualInputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subFieldLabel}>Target Count</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={goalCount}
                      onChangeText={setGoalCount}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subFieldLabel}>Unit</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="glasses, pages, etc."
                      placeholderTextColor={DarkTheme.secondaryText}
                      value={goalUnit}
                      onChangeText={setGoalUnit}
                    />
                  </View>
                </View>
              )}

              {goalType === 'timer' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.subFieldLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="30"
                    placeholderTextColor={DarkTheme.secondaryText}
                    value={timerMinutes}
                    onChangeText={setTimerMinutes}
                  />
                </View>
              )}

              {/* Frequency */}
              <Text style={styles.fieldLabel}>Frequency</Text>
              <View style={styles.segmentRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, frequencyType === 'daily' && styles.segmentBtnActive]}
                  onPress={() => setFrequencyType('daily')}
                >
                  <Text style={[styles.segmentText, frequencyType === 'daily' && styles.segmentTextActive]}>
                    Daily
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, frequencyType === 'specific_days' && styles.segmentBtnActive]}
                  onPress={() => setFrequencyType('specific_days')}
                >
                  <Text style={[styles.segmentText, frequencyType === 'specific_days' && styles.segmentTextActive]}>
                    Specific Days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, frequencyType === 'x_per_week' && styles.segmentBtnActive]}
                  onPress={() => setFrequencyType('x_per_week')}
                >
                  <Text style={[styles.segmentText, frequencyType === 'x_per_week' && styles.segmentTextActive]}>
                    X / Wk
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, frequencyType === 'every_n_days' && styles.segmentBtnActive]}
                  onPress={() => setFrequencyType('every_n_days')}
                >
                  <Text style={[styles.segmentText, frequencyType === 'every_n_days' && styles.segmentTextActive]}>
                    N Days
                  </Text>
                </TouchableOpacity>
              </View>

              {frequencyType === 'every_n_days' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.subFieldLabel}>Repeat every N days</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={intervalDays}
                    onChangeText={setIntervalDays}
                  />
                </View>
              )}

              {frequencyType === 'specific_days' && (
                <View style={styles.weekdayRow}>
                  {WEEKDAY_NAMES.map((name, idx) => {
                    const dayNum = idx as DayOfWeek;
                    const isSelected = selectedDays.includes(dayNum);
                    return (
                      <TouchableOpacity
                        key={name}
                        style={[
                          styles.weekdayPill,
                          isSelected && { backgroundColor: selectedColor },
                        ]}
                        onPress={() => toggleWeekday(dayNum)}
                      >
                        <Text
                          style={[
                            styles.weekdayText,
                            isSelected && { color: '#FFFFFF', fontFamily: FontFamily.bold },
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {frequencyType === 'x_per_week' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.subFieldLabel}>Target times per week</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={timesPerWeek}
                    onChangeText={setTimesPerWeek}
                  />
                </View>
              )}

              {/* Time of Day */}
              <Text style={styles.fieldLabel}>Time of Day</Text>
              <View style={styles.segmentRow}>
                {(['any', 'morning', 'afternoon', 'evening'] as TimeOfDay[]).map(tod => (
                  <TouchableOpacity
                    key={tod}
                    style={[styles.segmentBtn, timeOfDay === tod && styles.segmentBtnActive]}
                    onPress={() => setTimeOfDay(tod)}
                  >
                    <Text style={[styles.segmentText, timeOfDay === tod && styles.segmentTextActive]}>
                      {tod.charAt(0).toUpperCase() + tod.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Reminder */}
              <View style={styles.reminderRow}>
                <View>
                  <Text style={styles.fieldLabel}>Daily Reminder</Text>
                  <Text style={styles.subFieldLabel}>Push notification to keep chain alive</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, hasReminder && { backgroundColor: selectedColor }]}
                  onPress={() => setHasReminder(!hasReminder)}
                >
                  <Text style={[styles.toggleBtnText, hasReminder && { color: '#FFFFFF' }]}>
                    {hasReminder ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {hasReminder && (
                <TextInput
                  style={styles.input}
                  placeholder="08:00 (HH:MM)"
                  placeholderTextColor={DarkTheme.secondaryText}
                  value={reminderTime}
                  onChangeText={setReminderTime}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: selectedColor }]}
                onPress={handleSaveHabit}
              >
                <Text style={styles.saveBtnText}>Create Habit</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {/* MODE: Task Form */}
          {mode === 'task' && (
            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Schedule doctor appointment"
                placeholderTextColor={DarkTheme.secondaryText}
                value={taskTitle}
                onChangeText={setTaskTitle}
                autoFocus
              />

              <Text style={styles.fieldLabel}>Time (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 14:30"
                placeholderTextColor={DarkTheme.secondaryText}
                value={taskTime}
                onChangeText={setTaskTime}
              />

              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any extra details..."
                placeholderTextColor={DarkTheme.secondaryText}
                value={taskNotes}
                onChangeText={setTaskNotes}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: DarkTheme.accent }]}
                onPress={handleSaveTask}
              >
                <Text style={styles.saveBtnText}>Create Task</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: DarkTheme.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: DarkTheme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.divider,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  chooseContent: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  chooseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  chooseIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseTextContainer: {
    flex: 1,
  },
  chooseCardTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginBottom: 4,
  },
  chooseCardDesc: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    lineHeight: 16,
  },
  formScroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  subFieldLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginBottom: Spacing.xs,
  },
  templatesScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  templatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.sm,
    gap: 6,
  },
  tplDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  templateText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.primaryText,
  },
  input: {
    backgroundColor: DarkTheme.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: DarkTheme.primaryText,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: DarkTheme.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DarkTheme.background,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.background,
    borderRadius: BorderRadius.md,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md - 2,
  },
  segmentBtnActive: {
    backgroundColor: DarkTheme.pillBackground,
  },
  segmentText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  segmentTextActive: {
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  inputGroup: {
    marginTop: Spacing.sm,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  weekdayPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DarkTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: DarkTheme.background,
  },
  toggleBtnText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: DarkTheme.secondaryText,
  },
  saveBtn: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
});
