// Vector Bullseye Logo matching the design system
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { DarkTheme } from '../theme';

interface BullseyeLogoProps {
  size?: number;
  blueAccent?: string;
  whiteColor?: string;
  showBackground?: boolean;
  backgroundColor?: string;
}

export function BullseyeLogo({
  size = 120,
  blueAccent = '#2196F3',
  whiteColor = '#FFFFFF',
  showBackground = true,
  backgroundColor = DarkTheme.card,
}: BullseyeLogoProps) {
  // Coordinate space: 200 x 200
  // Center: (90, 110) - shifted slightly bottom-left so arrow has room at top-right
  const cx = 95;
  const cy = 105;
  const outerR = 64;
  const middleR = 42;
  const centerR = 20;
  const strokeWidth = 10;

  // Arrow calculations: 45 degree angle
  // From top-right (165, 35) to center (95, 105)
  // Arrow tail: (165, 35)
  // Arrow tip: (95, 105)
  const tailX = 162;
  const tailY = 38;
  const tipX = 95;
  const tipY = 105;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        showBackground && {
          backgroundColor,
          borderRadius: size * 0.24,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Outer Ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Middle Ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={middleR}
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Center Blue Bullseye */}
        <Circle
          cx={cx}
          cy={cy}
          r={centerR}
          fill={blueAccent}
        />

        {/* Arrow Shaft (White) */}
        <Line
          x1={tipX}
          y1={tipY}
          x2={tailX}
          y2={tailY}
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Arrow Fletching 1 (Left wing of feather) */}
        <Polygon
          points={`${tailX - 2},${tailY + 12} ${tailX - 18},${tailY - 4} ${tailX - 4},${tailY - 6}`}
          fill={blueAccent}
        />

        {/* Arrow Fletching 2 (Right wing of feather) */}
        <Polygon
          points={`${tailX - 12},${tailY + 2} ${tailX + 4},${tailY - 14} ${tailX + 6},${tailY - 2}`}
          fill={blueAccent}
        />

        {/* Tail point / nock */}
        <Polygon
          points={`${tailX - 6},${tailY - 6} ${tailX + 8},${tailY - 8} ${tailX - 8},${tailY + 8}`}
          fill={whiteColor}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

