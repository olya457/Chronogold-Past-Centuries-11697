import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useReducedMotion } from '../hooks/useReducedMotion';
export function Reveal({
  children,
  style,
  revision = 0,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  revision?: string | number;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, revision]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function usePressMotion() {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => () => scale.stopAnimation(), [scale]);
  const animate = (toValue: number) => {
    if (reduced) return;
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 28,
      bounciness: 5,
      isInteraction: false,
    }).start();
  };
  return {
    style: { transform: [{ scale }] },
    onPressIn: () => animate(0.96),
    onPressOut: () => animate(1),
  };
}
export function ChronoAtmosphere() {
  const reduced = useReducedMotion();
  const navigation = useContext(NavigationContext);
  const [focused, setFocused] = useState(() => navigation?.isFocused() ?? true);
  const turn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!navigation) return;
    setFocused(navigation.isFocused());
    const focus = navigation.addListener('focus', () => setFocused(true));
    const blur = navigation.addListener('blur', () => setFocused(false));
    return () => {
      focus();
      blur();
    };
  }, [navigation]);
  useEffect(() => {
    if (reduced || !focused) {
      turn.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(turn, {
        toValue: 1,
        duration: 42000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [focused, reduced, turn]);
  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <Animated.View
        style={[
          styles.orbit,
          {
            transform: [
              {
                rotate: turn.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg
          width={300}
          height={300}
          viewBox="0 0 300 300"
          fill="none"
          stroke="#d6a35d"
        >
          <Circle cx={150} cy={150} r={126} />
          <Circle cx={150} cy={150} r={112} strokeDasharray="1 11" />
          <Circle cx={150} cy={150} r={82} />
          <Path d="M150 14v42m0 188v42M14 150h42m188 0h42M61 61l28 28m122 122l28 28M61 239l28-28m122-122l28-28M150 68l16 66 66 16-66 16-16 66-16-66-66-16 66-16z" />
        </Svg>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  orbit: { position: 'absolute', right: -125, top: 30, opacity: 0.07 },
});
