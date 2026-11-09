// Bottom Tab Bar Navigator with center floating circular blue "+" button
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DarkTheme, FontFamily, FontSize } from '../theme';
import { TodayScreen, ChallengesScreen, StatsScreen, ExploreScreen } from '../screens';
import { AddModal } from '../components/AddModal';

const Tab = createBottomTabNavigator();

// Placeholder component for the center Add tab
function EmptyComponent() {
  return null;
}

export function TabNavigator() {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleOpenAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAddModalVisible(true);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: DarkTheme.accent,
          tabBarInactiveTintColor: DarkTheme.secondaryText,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Challenges"
          component={ChallengesScreen}
          options={{
            tabBarLabel: 'Challenges',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'trophy' : 'trophy-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Add"
          component={EmptyComponent}
          options={{
            tabBarLabel: () => null,
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.floatingAddContainer}
                activeOpacity={0.85}
                onPress={handleOpenAdd}
              >
                <View style={styles.floatingAddButton}>
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Add Habit/Task Bottom Sheet Modal */}
      <AddModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DarkTheme.tabBar,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  floatingAddContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  floatingAddButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: DarkTheme.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DarkTheme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

