import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { TextInput } from 'react-native';
import { AppProvider, useApp } from '../src/store/AppStore';
import { EntryForm } from '../src/components/EntryForm';
import { CompareScreen } from '../src/screens/CompareScreen';
import { StudyScreen } from '../src/screens/FlashcardScreen';

let context: ReturnType<typeof useApp>;
function Probe() {
  context = useApp();
  return null;
}
function press(tree: ReactTestRenderer, label: string) {
  const button = tree.root
    .findAllByProps({ accessibilityLabel: label })
    .find(x => typeof x.props.onPress === 'function');
  if (!button) throw Error(label);
  button.props.onPress();
}

test('fact form requires actual input and saves a new entry', async () => {
  let tree: ReactTestRenderer;
  const close = jest.fn();
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
        <EntryForm kind="facts" onClose={close} />
      </AppProvider>,
    );
  });
  const before = context.state.facts.length;
  await act(async () => press(tree!, 'Add fact'));
  expect(close).not.toHaveBeenCalled();
  const fields = tree!.root.findAllByType(TextInput);
  await act(async () =>
    fields
      .find(x => x.props.accessibilityLabel === 'Short title')!
      .props.onChangeText('My finding'),
  );
  await act(async () =>
    fields
      .find(x => x.props.accessibilityLabel === 'Fact')!
      .props.onChangeText('My researched historical fact'),
  );
  await act(async () => press(tree!, 'Add fact'));
  expect(context.state.facts).toHaveLength(before + 1);
  expect(context.state.facts[0].title).toBe('My finding');
  expect(close).toHaveBeenCalledTimes(1);
  await act(async () => tree!.unmount());
});

test('compare picker limits selection to three and supports removal', async () => {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
        <CompareScreen />
      </AppProvider>,
    );
  });
  await act(async () => press(tree!, 'Choose golden ages'));
  const boxes = () =>
    tree!.root.findAll(
      x =>
        x.props.accessibilityRole === 'checkbox' &&
        typeof x.props.onPress === 'function' &&
        typeof x.type !== 'string',
    );
  for (let i = 0; i < 4; i++) await act(async () => boxes()[i].props.onPress());
  expect(context.state.compare).toHaveLength(3);
  await act(async () => boxes()[0].props.onPress());
  expect(context.state.compare).toHaveLength(2);
  await act(async () => tree!.unmount());
});

test('study reveals an answer and records a learned card', async () => {
  let tree: ReactTestRenderer;
  const props = {
    route: { key: 'study', name: 'Study', params: { id: 'folder-0' } },
    navigation: { goBack: jest.fn() },
  };
  await act(async () => {
    tree = create(
      <AppProvider>
        <Probe />
        <StudyScreen {...(props as unknown as React.ComponentProps<typeof StudyScreen>)} />
      </AppProvider>,
    );
  });
  const first = context.state.cards.find(c => c.folderId === 'folder-0')!;
  expect(first.learned).toBe(false);
  await act(async () => press(tree!, 'Reveal answer'));
  await act(async () => press(tree!, '✓ Learned'));
  expect(context.state.cards.find(c => c.id === first.id)!.learned).toBe(true);
  await act(async () => tree!.unmount());
});
