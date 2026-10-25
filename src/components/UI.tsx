import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GradientSurface } from './GradientSurface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ChronoAtmosphere, Reveal, usePressMotion } from './Motion';
import { colors, gradients } from '../theme';
export { colors } from '../theme';
export const serif = Platform.OS === 'ios' ? 'Georgia' : 'serif';
export const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: { fontFamily: serif, fontSize: 36, color: colors.text },
  h2: { fontFamily: serif, fontSize: 23, color: colors.text },
  body: { fontSize: 14, lineHeight: 23, color: colors.muted },
  label: {
    fontSize: 10,
    letterSpacing: 1.7,
    color: colors.muted,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 18,
    gap: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    color: colors.text,
    padding: 14,
    minHeight: 48,
    fontSize: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 11, color: colors.muted },
  section: {
    fontFamily: serif,
    fontSize: 22,
    color: colors.text,
    marginTop: 16,
    marginBottom: 14,
  },
});
export function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const press = usePressMotion();
  return (
    <Animated.View style={[{ minHeight: 50, flexShrink: 0 }, press.style]}>
      <Pressable
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={{
          opacity: disabled ? 0.4 : 1,
          minHeight: 50,
          paddingVertical: 14,
          paddingHorizontal: 22,
          borderRadius: 28,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearGradient
          pointerEvents="none"
          colors={gradients.button}
          style={StyleSheet.absoluteFill}
        />
        <Text
          style={{
            color: colors.onAccent,
            fontWeight: '700',
            fontSize: 14,
            lineHeight: 22,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function IconButton({
  label,
  icon,
  onPress,
  active = false,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  active?: boolean;
}) {
  const press = usePressMotion();
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: active ? colors.selected : colors.panel,
          borderWidth: 1,
          borderColor: colors.line,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{ fontSize: 22, color: active ? colors.orange : colors.text }}
        >
          {icon}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
export function Screen({
  children,
  title,
  eyebrow,
  actions,
  back,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  back?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  return (
    <GradientSurface colors={gradients.background} style={{ flex: 1 }}>
      <ChronoAtmosphere />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingHorizontal: layout.gutter,
            width: '100%',
            maxWidth: 720,
            alignSelf: 'center',
            paddingTop: insets.top + 14,
            paddingBottom: insets.bottom + 104,
            gap: 14,
          }}
        >
          <Reveal style={{ gap: layout.compact ? 12 : 14 }}>
            {back && (
              <Pressable onPress={back} accessibilityRole="button">
                <Text style={s.body}>‹ Back</Text>
              </Pressable>
            )}
            {title && (
              <View style={s.between}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.label, { color: colors.orange }]}>
                    {eyebrow}
                  </Text>
                  <Text style={[s.title, { fontSize: layout.titleSize }]}>
                    {title}
                  </Text>
                </View>
                <View style={s.row}>{actions}</View>
              </View>
            )}
            {children}
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientSurface>
  );
}
export function Card({ children }: { children: React.ReactNode }) {
  const layout = useLayout();
  return (
    <View style={[s.card, { padding: layout.cardPadding }]}>{children}</View>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  numeric = false,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numeric?: boolean;
}) {
  return (
    <View style={{ gap: 8, marginBottom: 14 }}>
      <Label>{label.toUpperCase()}</Label>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={numeric ? 'numbers-and-punctuation' : 'default'}
        style={[
          s.input,
          multiline && { minHeight: 100, textAlignVertical: 'top' },
        ]}
      />
    </View>
  );
}
export function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {options.map(x => (
        <Pressable
          key={x}
          accessibilityRole="button"
          onPress={() => onChange(x)}
          style={[
            s.chip,
            value === x && {
              backgroundColor: colors.orange,
              borderColor: colors.orange,
            },
          ]}
        >
          <Text
            style={[
              s.chipText,
              value === x && { color: colors.onAccent, fontWeight: '700' },
            ]}
          >
            {x}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Tabs({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 4,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.line,
      }}
    >
      {options.map(x => (
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: value === x }}
          key={x}
          onPress={() => onChange(x)}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
        >
          {value === x ? (
            <GradientSurface
              colors={gradients.button}
              style={{
                borderRadius: 24,
                paddingVertical: 11,
                paddingHorizontal: 4,
                minHeight: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.onAccent,
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                {x}
              </Text>
            </GradientSurface>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 11,
                paddingHorizontal: 4,
                color: colors.muted,
                fontSize: 12,
              }}
            >
              {x}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
export function Sheet({
  title,
  visible,
  onClose,
  children,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const reduced = useReducedMotion();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: '#0009',
        }}
      >
        <View
          style={{
            maxHeight: layout.height - insets.top - 12,
            width: '100%',
            maxWidth: 640,
            alignSelf: 'center',
            backgroundColor: colors.panel,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: layout.gutter,
            paddingBottom: Math.max(insets.bottom, 20),
          }}
        >
          <View
            style={{
              width: 36,
              height: 4,
              backgroundColor: colors.line,
              alignSelf: 'center',
              borderRadius: 3,
              marginBottom: 15,
            }}
          />
          <View style={[s.between, { marginBottom: 18 }]}>
            <Text style={[s.h2, { flex: 1 }]}>{title}</Text>
            <IconButton label="Close" icon="×" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Reveal revision={visible ? 1 : 0}>{children}</Reveal>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Text style={[s.h2, { textAlign: 'center', marginTop: 18 }]}>
        {title}
      </Text>
      <Text style={[s.body, { textAlign: 'center', marginBottom: 18 }]}>
        {body}
      </Text>
    </Card>
  );
}
export function Bar({
  value,
  color = colors.orange,
}: {
  value: number;
  color?: string;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const toValue = Math.max(0, Math.min(100, value));
    const animation = Animated.timing(progress, {
      toValue,
      duration: reduced ? 0 : 650,
      useNativeDriver: false,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, value]);
  return (
    <View
      style={{
        height: 5,
        borderRadius: 4,
        backgroundColor: colors.line,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: 5,
          width: progress.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          backgroundColor: color,
          borderRadius: 4,
        }}
      />
    </View>
  );
}
