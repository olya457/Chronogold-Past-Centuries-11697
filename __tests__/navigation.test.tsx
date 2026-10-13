import React, { createContext } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { renderBottomBar } from '../src/navigation/BottomBar';

test('tab bar renders through a context consumer without invoking hooks in the callback', async () => {
  const Context = createContext(null);
  const navigate = jest.fn();
  const props = {
    state: {
      index: 0,
      routes: [
        { key: 'explore', name: 'Explore' },
        { key: 'facts', name: 'Facts' },
      ],
    },
    navigation: {
      emit: jest.fn(() => ({ defaultPrevented: false })),
      navigate,
    },
    descriptors: {},
    insets: { top: 0, bottom: 20, left: 0, right: 0 },
  } as unknown as BottomTabBarProps;
  expect(React.isValidElement(renderBottomBar(props))).toBe(true);
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <Context.Consumer>{() => renderBottomBar(props)}</Context.Consumer>,
    );
  });
  const facts = tree!.root
    .findAllByProps({ accessibilityLabel: 'Facts' })
    .find(node => typeof node.props.onPress === 'function')!;
  await act(async () => facts.props.onPress());
  expect(navigate).toHaveBeenCalledWith('Facts');
  await act(async () => tree!.unmount());
});
