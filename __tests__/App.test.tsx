import React from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/store/AppStore';
import { LoaderScreen, OnboardingScreen } from '../src/screens/WelcomeScreen';
import { yearDistance, validYear, overall } from '../src/utils/history';
import library from '../src/data/library.json';

let context: ReturnType<typeof useApp>;
function Probe() {
  context = useApp();
  return <Text>{context.ready ? 'ready' : 'loading'}</Text>;
}

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

test('dates cross BCE and CE without introducing a year zero', () => {
  expect(yearDistance(-27, 180)).toBe(206);
  expect(yearDistance(-1, 1)).toBe(1);
  expect(yearDistance(-480, -404)).toBe(76);
  expect(yearDistance(618, 907)).toBe(289);
  expect(validYear('0')).toBe(false);
  expect(validYear('12.5')).toBe(false);
  expect(validYear('-480')).toBe(true);
  expect(overall()).toBe(null);
});

test('library entries are complete and flashcards belong to real folders', () => {
  expect(library.ages).toHaveLength(37);
  for (const entry of [
    ...library.ages,
    ...library.inventions,
    ...library.facts,
  ]) {
    expect(entry.title.length).toBeGreaterThan(0);
    expect(entry.description.length).toBeGreaterThan(0);
  }
  for (const card of library.cards)
    expect(library.folders.some(f => f.id === card.folderId)).toBe(true);
  expect(new Set(library.cards.map(c => c.id)).size).toBe(library.cards.length);
});

test('starts with no user activity and restores saved notes and progress', async () => {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(context.state.saved).toEqual([]);
  expect(context.state.completed).toEqual([]);
  expect(context.state.cards.every(c => !c.learned)).toBe(true);
  await act(async () => {
    context.toggleSaved('age-1');
    context.update(st => ({
      ...st,
      notes: { 'research-1': 'My sources' },
      completed: ['research-1'],
    }));
  });
  const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
  const persisted = calls[calls.length - 1][1];
  await act(async () => tree!.unmount());
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(persisted);
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(context.state.saved).toEqual(['age-1']);
  expect(context.state.notes['research-1']).toBe('My sources');
  expect(context.state.completed).toEqual(['research-1']);
  await act(async () => tree!.unmount());
});

test('onboarding completes and persists only when Begin or Skip is selected', async () => {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
        <OnboardingScreen />
      </AppProvider>,
    );
  });
  const press = (label: string) =>
    tree!.root
      .findAllByProps({ accessibilityLabel: label })
      .find(x => typeof x.props.onPress === 'function')!;
  await act(async () => press('Continue  →').props.onPress());
  expect(context.state.onboarded).toBe(false);
  await act(async () => press('Continue  →').props.onPress());
  await act(async () => press('Begin  →').props.onPress());
  expect(context.state.onboarded).toBe(true);
  await act(async () => tree!.unmount());
});

test('loader waits for the local WebView animation and completes once', async () => {
  jest.useFakeTimers();
  const done = jest.fn();
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(<LoaderScreen onDone={done} />);
  });
  const web = tree!.root.findByType('WebView' as never);
  expect(web.props.source.html).toContain('4000');
  expect(done).not.toHaveBeenCalled();
  await act(async () => web.props.onLoadEnd());
  await act(async () => jest.advanceTimersByTime(3999));
  expect(done).not.toHaveBeenCalled();
  await act(async () =>
    web.props.onMessage({ nativeEvent: { data: 'finished' } }),
  );
  await act(async () => jest.advanceTimersByTime(101));
  expect(done).toHaveBeenCalledTimes(1);
  await act(async () => tree!.unmount());
  jest.useRealTimers();
});
