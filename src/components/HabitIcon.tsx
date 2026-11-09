// Renders a colored circle with an icon for a habit
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HabitIconProps {
  icon: string;
  color: string;
  size?: number;
}

// Map our icon names to Ionicons names
const ICON_MAP: Record<string, string> = {
  'glass-water': 'water-outline',
  'dumbbell': 'barbell-outline',
  'sparkles': 'sparkles-outline',
  'book-open': 'book-outline',
  'heart': 'heart-outline',
  'moon': 'moon-outline',
  'walk': 'walk-outline',
  'musical-note': 'musical-note-outline',
  'leaf': 'leaf-outline',
  'brain': 'bulb-outline',
  'pencil': 'pencil-outline',
  'camera': 'camera-outline',
  'bicycle': 'bicycle-outline',
  'bed': 'bed-outline',
  'nutrition': 'nutrition-outline',
  'meditation': 'flower-outline',
  'code': 'code-slash-outline',
  'language': 'language-outline',
  'music': 'musical-notes-outline',
  'paint': 'color-palette-outline',
  'circle': 'ellipse-outline',
};

export function HabitIcon({ icon, color, size = 24 }: HabitIconProps) {
  const iconName = ICON_MAP[icon] || 'ellipse-outline';
  const containerSize = size + 16;

  return (
    <View style={[
      styles.container,
      {
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: color + '20', // 12% opacity
      },
    ]}>
      <Ionicons
        name={iconName as any}
        size={size}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
