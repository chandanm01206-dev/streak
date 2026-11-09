// Horizontal week date strip with swipeable weeks
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions,
} from 'react-native';
import { DarkTheme, BorderRadius, Spacing, FontFamily, FontSize } from '../theme';
import { getWeekDates, getShortWeekday, formatDate, addDays, getToday } from '../utils/date';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_WIDTH = (SCREEN_WIDTH - 32) / 7;

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = getToday();
  const baseDate = addDays(new Date(), weekOffset * 7);
  const weekDates = getWeekDates(baseDate, 1); // Monday start

  const goToPrevWeek = () => setWeekOffset(w => w - 1);
  const goToNextWeek = () => setWeekOffset(w => w + 1);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToPrevWeek} style={styles.arrow}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <View style={styles.daysRow}>
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;

          return (
            <TouchableOpacity
              key={dateStr}
              onPress={() => onSelectDate(dateStr)}
              style={[
                styles.dayItem,
                isSelected && styles.dayItemSelected,
              ]}
            >
              <Text style={[
                styles.dayAbbr,
                isSelected && styles.dayAbbrSelected,
              ]}>
                {getShortWeekday(date)}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected && styles.dayNumberSelected,
                isToday && !isSelected && styles.dayNumberToday,
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity onPress={goToNextWeek} style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  arrow: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: DarkTheme.secondaryText,
    fontSize: 22,
    fontFamily: FontFamily.bold,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DAY_WIDTH - 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  dayItemSelected: {
    backgroundColor: DarkTheme.pillBackground,
  },
  dayAbbr: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    marginBottom: 4,
  },
  dayAbbrSelected: {
    color: DarkTheme.primaryText,
  },
  dayNumber: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  dayNumberSelected: {
    color: DarkTheme.accent,
  },
  dayNumberToday: {
    color: DarkTheme.accent,
  },
});
