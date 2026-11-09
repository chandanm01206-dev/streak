// Night landscape SVG illustration with subtle floating animation
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withTiming, Easing, interpolate,
} from 'react-native-reanimated';
import { getCurrentTimeOfDay } from '../utils/date';

const AnimatedView = Animated.createAnimatedComponent(View);

export function NightScene() {
  const float = useSharedValue(0);
  const birdFloat = useSharedValue(0);
  const timeOfDay = getCurrentTimeOfDay();

  // Background gradient colors based on time of day
  const skyColor = timeOfDay === 'morning' ? '#2C3E50'
    : timeOfDay === 'afternoon' ? '#1a2a3a'
    : '#1E1E2E';

  const hillColor1 = timeOfDay === 'morning' ? '#2d4a3e'
    : timeOfDay === 'afternoon' ? '#1e3d2f'
    : '#1a2a22';

  const hillColor2 = timeOfDay === 'morning' ? '#3d5a4e'
    : timeOfDay === 'afternoon' ? '#2a4a3a'
    : '#243832';

  const treeColor = timeOfDay === 'morning' ? '#3aa88a'
    : timeOfDay === 'afternoon' ? '#2d9478'
    : '#2BB673';

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    birdFloat.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [birdFloat, float]);

  const treeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(float.value, [0, 1], [0, -4]) },
    ],
  }));

  const birdStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(birdFloat.value, [0, 1], [0, 12]) },
      { translateY: interpolate(birdFloat.value, [0, 1], [0, -6]) },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: skyColor }]}>
      <Svg width="100%" height="140" viewBox="0 0 400 140">
        {/* Stars / dots */}
        <Circle cx="50" cy="20" r="1.5" fill="#ffffff40" />
        <Circle cx="120" cy="35" r="1" fill="#ffffff30" />
        <Circle cx="200" cy="15" r="1.5" fill="#ffffff40" />
        <Circle cx="280" cy="28" r="1" fill="#ffffff20" />
        <Circle cx="350" cy="18" r="1.5" fill="#ffffff35" />
        <Circle cx="90" cy="45" r="1" fill="#ffffff25" />
        <Circle cx="320" cy="40" r="1" fill="#ffffff30" />

        {/* Moon (evening) or sun glow */}
        {timeOfDay === 'evening' ? (
          <Circle cx="320" cy="30" r="16" fill="#F5B82E20" />
        ) : timeOfDay === 'morning' ? (
          <Circle cx="340" cy="40" r="20" fill="#F5B82E15" />
        ) : null}
        {timeOfDay === 'evening' && (
          <Circle cx="320" cy="30" r="10" fill="#F5B82E40" />
        )}

        {/* Back hills */}
        <Path
          d="M0 100 Q50 60 100 80 Q150 65 200 75 Q250 55 300 70 Q350 60 400 85 L400 140 L0 140 Z"
          fill={hillColor1}
        />

        {/* Front hills */}
        <Path
          d="M0 110 Q60 85 120 95 Q180 80 240 90 Q300 75 360 88 Q380 92 400 95 L400 140 L0 140 Z"
          fill={hillColor2}
        />
      </Svg>

      {/* Trees (animated) */}
      <AnimatedView style={[styles.treesContainer, treeStyle]}>
        <Svg width="100%" height="60" viewBox="0 0 400 60" style={styles.treesSvg}>
          {/* Tree 1 */}
          <Ellipse cx="80" cy="35" rx="14" ry="20" fill={treeColor} opacity={0.7} />
          <Ellipse cx="80" cy="50" rx="3" ry="10" fill={hillColor2} />

          {/* Tree 2 */}
          <Ellipse cx="160" cy="30" rx="12" ry="18" fill={treeColor} opacity={0.8} />
          <Ellipse cx="160" cy="45" rx="2.5" ry="8" fill={hillColor2} />

          {/* Tree 3 */}
          <Ellipse cx="290" cy="32" rx="16" ry="22" fill={treeColor} opacity={0.6} />
          <Ellipse cx="290" cy="48" rx="3" ry="10" fill={hillColor2} />

          {/* Tree 4 */}
          <Ellipse cx="350" cy="35" rx="10" ry="16" fill={treeColor} opacity={0.75} />
          <Ellipse cx="350" cy="47" rx="2" ry="7" fill={hillColor2} />
        </Svg>
      </AnimatedView>

      {/* Birds (animated) */}
      <AnimatedView style={[styles.birdsContainer, birdStyle]}>
        <Svg width="100%" height="40" viewBox="0 0 400 40" style={styles.birdsSvg}>
          {/* Bird 1 */}
          <Path d="M100 20 Q105 14 110 18 Q115 14 120 20" stroke="#ffffff50" strokeWidth="1.5" fill="none" />
          {/* Bird 2 */}
          <Path d="M130 15 Q134 10 138 13 Q142 10 146 15" stroke="#ffffff40" strokeWidth="1.2" fill="none" />
          {/* Bird 3 */}
          <Path d="M250 22 Q254 17 258 20 Q262 17 266 22" stroke="#ffffff35" strokeWidth="1" fill="none" />
        </Svg>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  treesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  treesSvg: {
    position: 'absolute',
    bottom: 0,
  },
  birdsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  birdsSvg: {
    position: 'absolute',
    top: 0,
  },
});
