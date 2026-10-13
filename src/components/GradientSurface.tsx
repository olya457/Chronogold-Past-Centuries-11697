import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = React.ComponentProps<typeof LinearGradient>;

export function GradientSurface({ children, style, ...gradient }: Props) {
  return (
    <View style={[styles.surface, style]}>
      <LinearGradient
        {...gradient}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ surface: { overflow: 'hidden' } });
