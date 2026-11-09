// Theme color definitions for the Streak habit tracker
// Dark-first design system with optional light mode

export const HabitColors = {
  blue: '#2196F3',
  orange: '#F26B3A',
  yellow: '#F5B82E',
  pink: '#E8436B',
  green: '#2BB673',
  purple: '#8E6CEF',
} as const;

export type HabitColorName = keyof typeof HabitColors;

export const DarkTheme = {
  background: '#1E1E1E',
  card: '#2A2A2A',
  cardElevated: '#333333',
  primaryText: '#FFFFFF',
  secondaryText: '#9A9A9A',
  accent: '#2196F3',
  pillBackground: '#3A3A3A',
  divider: '#3A3A3A',
  success: '#2BB673',
  danger: '#E8436B',
  warning: '#F5B82E',
  tabBar: '#252525',
  overlay: 'rgba(0,0,0,0.6)',
  statusBar: 'light' as const,
} as const;

export const LightTheme = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  cardElevated: '#F0F0F0',
  primaryText: '#1E1E1E',
  secondaryText: '#6B6B6B',
  accent: '#2196F3',
  pillBackground: '#E8E8E8',
  divider: '#E0E0E0',
  success: '#2BB673',
  danger: '#E8436B',
  warning: '#F5B82E',
  tabBar: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
  statusBar: 'dark' as const,
} as const;

export type ThemeColors = typeof DarkTheme;
