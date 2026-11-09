// Task checklist item
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize } from '../theme';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(task.id)}
      onLongPress={() => onDelete(task.id)}
    >
      <Ionicons
        name={task.completed ? 'checkbox' : 'square-outline'}
        size={22}
        color={task.completed ? DarkTheme.accent : DarkTheme.secondaryText}
      />
      <Text style={[
        styles.title,
        task.completed && styles.titleDone,
      ]}>
        {task.title}
      </Text>
      {task.time && (
        <Text style={styles.time}>{task.time}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.primaryText,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: DarkTheme.secondaryText,
  },
  time: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
});
