import React from 'react';
import { colors, gradients } from '../theme';
import { Pressable, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientSurface } from '../components/GradientSurface';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { useLayout } from '../hooks/useLayout';
import { Reveal } from '../components/Motion';
function TabIcon({ index, active }: { index: number; active: boolean }) {
  const color = active ? colors.onAccent : colors.muted;
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {index === 0 ? (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Ellipse cx={12} cy={12} rx={4} ry={9} />
          <Path d="M3 12h18" />
        </>
      ) : index === 1 ? (
        <>
          <Path d="M12 3v17M7 21h10M4 7h16M6 7l-4 9h8L6 7zm12 0l-4 9h8l-4-9z" />
        </>
      ) : index === 2 ? (
        <>
          <Rect x={5} y={2} width={14} height={20} rx={2} />
          <Path d="M8 6h8M8 10h1m3 0h1m3 0h.1M8 14h1m3 0h1m3 0h.1M8 18h1m3 0h1m3 0h.1" />
        </>
      ) : index === 3 ? (
        <>
          <Path d="M8 15c0-2-3-3-3-7a7 7 0 0114 0c0 4-3 5-3 7M9 18h6M10 21h4" />
        </>
      ) : (
        <>
          <Path d="M2 9l10-5 10 5-10 5L2 9zm4 3v5c3 3 9 3 12 0v-5M22 9v7" />
        </>
      )}
    </Svg>
  );
}
function BottomBar({ state, navigation }: BottomTabBarProps) {
  const inset = useSafeAreaInsets();
  const layout = useLayout();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: Math.max(inset.bottom, 12),
        left: layout.gutter,
        right: layout.gutter,
        alignItems: 'center',
      }}
    >
      <GradientSurface
        colors={gradients.navigation}
        style={{
          width: '100%',
          maxWidth: 500,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 40,
          flexDirection: 'row',
          padding: 7,
        }}
      >
        {state.routes.map((route, i) => (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={route.name}
            accessibilityState={{ selected: state.index === i }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 46,
            }}
          >
            <Reveal revision={state.index === i ? 1 : 0}>
              {state.index === i ? (
                <GradientSurface
                  colors={gradients.button}
                  style={{
                    height: 46,
                    width: 46,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TabIcon index={i} active />
                </GradientSurface>
              ) : (
                <TabIcon index={i} active={false} />
              )}
            </Reveal>
          </Pressable>
        ))}
      </GradientSurface>
    </View>
  );
}
export function renderBottomBar(props: BottomTabBarProps) {
  return <BottomBar {...props} />;
}
