// Horizontal time-of-day filter tabs
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DarkTheme, BorderRadius, Spacing, FontFamily, FontSize } from '../theme';
import { TimeOfDay } from '../types';

type FilterOption = TimeOfDay | 'all';

interface TabFilterProps {
  selected: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

const TABS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All Day' },
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
];

export function TabFilter({ selected, onSelect }: TabFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map(tab => {
        const isActive = tab.key === selected;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: DarkTheme.pillBackground,
  },
  tabText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  tabTextActive: {
    color: DarkTheme.primaryText,
    fontFamily: FontFamily.semiBold,
  },
});
