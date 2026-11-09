// Custom Side Menu (Drawer) for the Streak app
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, Spacing, FontFamily, FontSize, BorderRadius } from '../theme';
import { HabitColors } from '../theme/colors';
import { useHabitStore } from '../store';
import { BullseyeLogo } from '../components/BullseyeLogo';

export function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const { habits, streaks } = useHabitStore();

  const totalActive = habits.length;
  const maxStreak = Math.max(0, ...Array.from(streaks.values()).map(s => s.current));

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <BullseyeLogo size={48} showBackground={true} backgroundColor="#282828" />
          <View>
            <Text style={styles.appTitle}>STREAK</Text>
            <Text style={styles.appSubtitle}>Hit your target, every day</Text>
          </View>
        </View>

        {/* Small stats banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalActive}</Text>
            <Text style={styles.statLbl}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: HabitColors.orange }]}>{maxStreak}d</Text>
            <Text style={styles.statLbl}>Best Streak</Text>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuSectionHeader}>Navigation</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('MainTabs', { screen: 'Today' });
          }}
        >
          <Ionicons name="today-outline" size={22} color={DarkTheme.accent} />
          <Text style={styles.menuLabel}>Today&apos;s Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('MainTabs', { screen: 'Challenges' });
          }}
        >
          <Ionicons name="trophy-outline" size={22} color={HabitColors.yellow} />
          <Text style={styles.menuLabel}>Challenges</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('MainTabs', { screen: 'Stats' });
          }}
        >
          <Ionicons name="stats-chart-outline" size={22} color={HabitColors.green} />
          <Text style={styles.menuLabel}>Analytics & Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('MainTabs', { screen: 'Explore' });
          }}
        >
          <Ionicons name="compass-outline" size={22} color={HabitColors.purple} />
          <Text style={styles.menuLabel}>Explore Habits</Text>
        </TouchableOpacity>

        <Text style={styles.menuSectionHeader}>Habit Management</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('HabitsManage');
          }}
        >
          <Ionicons name="list-outline" size={22} color={DarkTheme.primaryText} />
          <Text style={styles.menuLabel}>All Habits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('HabitsManage', { filter: 'archived' });
          }}
        >
          <Ionicons name="archive-outline" size={22} color={DarkTheme.secondaryText} />
          <Text style={styles.menuLabel}>Archived Habits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Badges');
          }}
        >
          <Ionicons name="ribbon-outline" size={22} color={HabitColors.pink} />
          <Text style={styles.menuLabel}>Achievements & Badges</Text>
        </TouchableOpacity>

        <Text style={styles.menuSectionHeader}>Preferences</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Settings');
          }}
        >
          <Ionicons name="settings-outline" size={22} color={DarkTheme.secondaryText} />
          <Text style={styles.menuLabel}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Offline SQLite • v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.divider,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  flameIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DarkTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
  },
  statLbl: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
  statDivider: {
    width: 1,
    backgroundColor: DarkTheme.divider,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  menuSectionHeader: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: DarkTheme.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  menuLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: DarkTheme.primaryText,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.divider,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
  },
});
