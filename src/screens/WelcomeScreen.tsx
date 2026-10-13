import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, colors, s, serif } from '../components/UI';
import { useApp } from '../store/AppStore';
import { ChronoAtmosphere, Reveal } from '../components/Motion';
import { useLayout } from '../hooks/useLayout';
const loaderHtml = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}main{padding:15px 24px;text-align:center}section{height:3px;width:160px;background:#6f5838;border-radius:4px;overflow:hidden;margin:0 auto 15px}i{display:block;background:linear-gradient(90deg,#ff8531,#ffc385);height:100%;width:0;animation:load 4s linear forwards}p{color:#aaa88d;font:10px -apple-system,sans-serif;letter-spacing:2px}@keyframes load{to{width:100%}}</style></head><body><main><section><i></i></section><p>UNEARTHING HISTORY</p></main><script>setTimeout(function(){window.ReactNativeWebView.postMessage('finished')},4000)</script></body></html>`;
export function LoaderScreen({ onDone }: { onDone: () => void }) {
  const { height, width } = useWindowDimensions();
  const finished = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const complete = () => {
    if (!finished.current) {
      finished.current = true;
      onDone();
    }
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <ImageBackground
      source={require('../assets/chronogold-background.png')}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChronoAtmosphere />
      <Reveal style={{ alignItems: 'center' }}>
        <Image
          source={require('../assets/chronogold-emblem.png')}
          resizeMode="contain"
          style={{ width: Math.min(width - 24, 430), height: height * 0.44 }}
        />
        <Text
          style={{
            color: colors.orange,
            letterSpacing: 6,
            fontSize: 10,
            marginTop: 20,
          }}
        >
          EST. MMXXVI
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            fontFamily: serif,
            color: '#ffaa68',
            fontSize: Math.min(width * 0.14, 64),
            marginTop: 8,
          }}
        >
          Chronogold
        </Text>
        <Text
          style={{
            fontFamily: serif,
            fontStyle: 'italic',
            color: '#c9bea7',
            fontSize: 23,
            marginTop: 14,
          }}
        >
          Past Centuries
        </Text>
      </Reveal>
      <View style={{ height: 85, width: 240, marginTop: height * 0.06 }}>
        <WebView
          source={{ html: loaderHtml }}
          originWhitelist={['about:blank']}
          scrollEnabled={false}
          style={{ backgroundColor: 'transparent' }}
          onMessage={e => {
            if (e.nativeEvent.data === 'finished') complete();
          }}
          onLoadEnd={() => {
            if (!timer.current) timer.current = setTimeout(complete, 4100);
          }}
          onError={() => {
            if (!timer.current) timer.current = setTimeout(complete, 4000);
          }}
        />
      </View>
    </ImageBackground>
  );
}
const slides = [
  {
    image: require('../assets/chronogold-onboarding-explore.png'),
    label: '◎ EXPLORE',
    title: 'Walk through the\ngolden ages',
    body: 'Browse the great eras of Rome, Tang China, the Abbasid Caliphate and more — and discover the inventions that powered them.',
    tags: ['Golden Ages', 'Inventions'],
  },
  {
    image: require('../assets/chronogold-onboarding-compare.png'),
    label: '⚖ COMPARE',
    title: 'Weigh eras side by\nside',
    body: 'Compare up to three civilizations on economy, science and culture, then measure time spans, distances and journeys with historical tools.',
    tags: ['Radar charts', 'Calculators'],
  },
  {
    image: require('../assets/chronogold-onboarding-learn.png'),
    label: '♧ LEARN',
    title: 'Remember what you\ndiscover',
    body: 'Collect surprising facts, take on research challenges with your own notes, and master the past with flashcards and study mode.',
    tags: ['Facts', 'Flashcards', 'Research'],
  },
];
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { update } = useApp();
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  const slide = slides[index];
  const done = () => update(st => ({ ...st, onboarded: true }));
  return (
    <ImageBackground
      source={require('../assets/chronogold-background.png')}
      style={{ flex: 1 }}
    >
      <ChronoAtmosphere />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 15,
          paddingBottom: 24,
          paddingHorizontal: layout.compact ? 20 : 32,
          width: '100%',
          maxWidth: 600,
          alignSelf: 'center',
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={done}
          style={{ alignSelf: 'flex-end', padding: 8 }}
        >
          <Text style={s.body}>Skip</Text>
        </Pressable>
        <Reveal revision={index}>
          <Image
            source={slide.image}
            resizeMode="contain"
            style={{
              width: '100%',
              height: layout.artHeight,
              marginVertical: 16,
            }}
          />
          <Text style={[s.label, { color: colors.orange, letterSpacing: 3 }]}>
            {slide.label}
          </Text>
          <Text
            style={[
              s.title,
              {
                fontSize: layout.compact ? 30 : 36,
                marginTop: 10,
                lineHeight: layout.compact ? 35 : 40,
              },
            ]}
          >
            {slide.title}
          </Text>
          <Text
            style={[s.body, { marginTop: 20, fontSize: 15, lineHeight: 24 }]}
          >
            {slide.body}
          </Text>
          <View style={[s.row, { flexWrap: 'wrap', marginTop: 18 }]}>
            {slide.tags.map(t => (
              <Text
                key={t}
                style={[
                  s.chip,
                  {
                    fontSize: 11,
                    color: '#ffbd80',
                    borderColor: '#75502c',
                    paddingVertical: 6,
                  },
                ]}
              >
                {t}
              </Text>
            ))}
          </View>
        </Reveal>
      </ScrollView>
      <View
        style={[
          s.between,
          {
            flexShrink: 0,
            paddingTop: 14,
            paddingBottom: Math.max(insets.bottom, 16) + 12,
            paddingHorizontal: layout.compact ? 20 : 32,
            width: '100%',
            maxWidth: 600,
            alignSelf: 'center',
            alignItems: 'center',
            ...(layout.stacked
              ? { flexDirection: 'column' as const, gap: 16 }
              : {}),
          },
        ]}
      >
        <View style={s.row}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                height: 6,
                width: i === index ? 27 : 6,
                borderRadius: 4,
                backgroundColor: i === index ? colors.orange : '#455248',
              }}
            />
          ))}
        </View>
        <Button
          title={index === 2 ? 'Begin  →' : 'Continue  →'}
          onPress={() => (index === 2 ? done() : setIndex(index + 1))}
        />
      </View>
    </ImageBackground>
  );
}
