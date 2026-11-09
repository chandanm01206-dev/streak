// App Entry Splash Animation featuring the Bullseye logo mark
import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { DarkTheme, FontFamily, FontSize } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppEntryAnimationProps {
  onFinish: () => void;
}

export function AppEntryAnimation({ onFinish }: AppEntryAnimationProps) {
  // Animation shared values
  const containerOpacity = useSharedValue(1);

  // Logo icon elements
  const cardScale = useSharedValue(0.7);
  const cardOpacity = useSharedValue(0);

  const outerRingScale = useSharedValue(0);
  const outerRingOpacity = useSharedValue(0);

  const middleRingScale = useSharedValue(0);
  const middleRingOpacity = useSharedValue(0);

  const centerDotScale = useSharedValue(0);

  const arrowProgress = useSharedValue(0); // 0 = far away, 1 = hit center
  const impactPulse = useSharedValue(1);
  const shockwaveScale = useSharedValue(0.2);
  const shockwaveOpacity = useSharedValue(0);

  // Text elements
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Safe fallback for non-haptic devices
    }
  };

  const handleFinish = useCallback(() => {
    containerOpacity.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) }, () => {
      runOnJS(onFinish)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFinish]);

  useEffect(() => {
    // Stage 1: Card container rises
    cardOpacity.value = withTiming(1, { duration: 400 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 100 });

    // Stage 2: Concentric rings emerge
    outerRingOpacity.value = withDelay(150, withTiming(1, { duration: 350 }));
    outerRingScale.value = withDelay(150, withSpring(1, { damping: 12 }));

    middleRingOpacity.value = withDelay(280, withTiming(1, { duration: 350 }));
    middleRingScale.value = withDelay(280, withSpring(1, { damping: 12 }));

    centerDotScale.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 120 }));

    // Stage 3: Arrow swooshes from top-right and hits bullseye
    arrowProgress.value = withDelay(
      650,
      withTiming(1, { duration: 380, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, () => {
        runOnJS(triggerHaptic)();
      })
    );

    // Stage 4: Impact reaction & shockwave
    impactPulse.value = withDelay(
      1030,
      withSequence(
        withTiming(1.08, { duration: 80 }),
        withTiming(0.96, { duration: 90 }),
        withTiming(1, { duration: 120 })
      )
    );

    shockwaveOpacity.value = withDelay(
      1030,
      withSequence(
        withTiming(0.7, { duration: 50 }),
        withTiming(0, { duration: 450 })
      )
    );
    shockwaveScale.value = withDelay(
      1030,
      withTiming(2.2, { duration: 500, easing: Easing.out(Easing.quad) })
    );

    // Stage 5: Title & Tagline fade in
    titleOpacity.value = withDelay(1250, withTiming(1, { duration: 400 }));
    titleTranslateY.value = withDelay(1250, withSpring(0, { damping: 14 }));

    subtitleOpacity.value = withDelay(1500, withTiming(1, { duration: 450 }));

    // Stage 6: Auto transition to main app after animation completes
    const timer = setTimeout(() => {
      handleFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    arrowProgress,
    cardOpacity,
    cardScale,
    centerDotScale,
    handleFinish,
    impactPulse,
    middleRingOpacity,
    middleRingScale,
    outerRingOpacity,
    outerRingScale,
    shockwaveOpacity,
    shockwaveScale,
    subtitleOpacity,
    titleOpacity,
    titleTranslateY,
  ]);

  // Animated Styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value * impactPulse.value }],
  }));

  const outerRingStyle = useAnimatedStyle(() => ({
    opacity: outerRingOpacity.value,
    transform: [{ scale: outerRingScale.value }],
  }));

  const middleRingStyle = useAnimatedStyle(() => ({
    opacity: middleRingOpacity.value,
    transform: [{ scale: middleRingScale.value }],
  }));

  const centerDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerDotScale.value }],
  }));

  const arrowStyle = useAnimatedStyle(() => {
    const translateX = interpolate(arrowProgress.value, [0, 1], [100, 0]);
    const translateY = interpolate(arrowProgress.value, [0, 1], [-100, 0]);
    const opacity = interpolate(arrowProgress.value, [0, 0.15, 1], [0, 1, 1]);
    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });

  const shockwaveStyle = useAnimatedStyle(() => ({
    opacity: shockwaveOpacity.value,
    transform: [{ scale: shockwaveScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={handleFinish}>
      <Animated.View style={[styles.container, containerStyle]}>
        {/* Ambient background glow circle */}
        <View style={styles.ambientGlow} />

        {/* Center Logo Card with Target and Arrow */}
        <Animated.View style={[styles.iconCard, cardAnimStyle]}>
          {/* Shockwave expanding ring on impact */}
          <Animated.View style={[styles.shockwaveCircle, shockwaveStyle]} />

          {/* Target concentric rings container */}
          <View style={styles.targetCenterArea}>
            {/* Outer Ring */}
            <Animated.View style={[styles.ringOuter, outerRingStyle]} />

            {/* Middle Ring */}
            <Animated.View style={[styles.ringMiddle, middleRingStyle]} />

            {/* Center Blue Bullseye */}
            <Animated.View style={[styles.bullseyeCenter, centerDotStyle]} />
          </View>

          {/* Arrow Layer (animates from top-right into the bullseye) */}
          <Animated.View style={[styles.arrowContainer, arrowStyle]} pointerEvents="none">
            <Svg width={180} height={180} viewBox="0 0 200 200">
              {/* Arrow Shaft (White) */}
              <Line
                x1={95}
                y1={105}
                x2={162}
                y2={38}
                stroke="#FFFFFF"
                strokeWidth={10}
                strokeLinecap="round"
              />

              {/* Arrow Fletching Left (Blue) */}
              <Polygon
                points="160,50 144,34 158,32"
                fill={DarkTheme.accent}
              />

              {/* Arrow Fletching Right (Blue) */}
              <Polygon
                points="150,40 166,24 168,36"
                fill={DarkTheme.accent}
              />

              {/* Arrow Tail Cap */}
              <Polygon
                points="156,32 170,30 154,46"
                fill="#FFFFFF"
              />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Brand Text Reveal */}
        <Animated.View style={[styles.textContainer, titleStyle]}>
          <Text style={styles.brandTitle}>STREAK</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, subtitleStyle]}>
          <View style={styles.blueDot} />
          <Text style={styles.brandTagline}>Hit your target, every day.</Text>
          <View style={styles.blueDot} />
        </Animated.View>

        {/* Skip hint */}
        <View style={styles.skipHintContainer}>
          <Text style={styles.skipHintText}>Tap anywhere to skip</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: DarkTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ambientGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: (SCREEN_WIDTH * 0.9) / 2,
    backgroundColor: DarkTheme.accent + '12',
  },
  iconCard: {
    width: 170,
    height: 170,
    borderRadius: 44,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  targetCenterArea: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 9,
    borderColor: '#FFFFFF',
  },
  ringMiddle: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 9,
    borderColor: '#FFFFFF',
  },
  bullseyeCenter: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DarkTheme.accent,
  },
  arrowContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shockwaveCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: DarkTheme.accent,
  },
  textContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: FontSize.hero,
    fontFamily: FontFamily.bold,
    color: DarkTheme.primaryText,
    letterSpacing: 6,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  blueDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: DarkTheme.accent,
  },
  brandTagline: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText,
    letterSpacing: 0.5,
  },
  skipHintContainer: {
    position: 'absolute',
    bottom: 50,
  },
  skipHintText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: DarkTheme.secondaryText + '80',
    letterSpacing: 1,
  },
});
