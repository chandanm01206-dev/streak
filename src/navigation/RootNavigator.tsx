// Root Navigator combining Drawer Side Menu, Stack screens, and Bottom Tabs
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkTheme } from '../theme';
import { TabNavigator } from './TabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';
import { SettingsScreen, HabitsManageScreen, BadgesScreen } from '../screens';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#181818',
          width: 300,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: DarkTheme.background },
      }}
    >
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HabitsManage" component={HabitsManageScreen} />
      <Stack.Screen name="Badges" component={BadgesScreen} />
    </Stack.Navigator>
  );
}

