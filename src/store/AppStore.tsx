import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import library from '../data/library.json';
import { State } from '../types';
const initial: State = {
  onboarded: false,
  ages: library.ages,
  inventions: library.inventions,
  facts: library.facts,
  folders: library.folders,
  cards: library.cards,
  saved: [],
  compare: [],
  notes: {},
  completed: [],
};
const key = '@chronogold/state/v1';
const Context = createContext<{
  state: State;
  ready: boolean;
  update: (fn: (s: State) => State) => void;
  toggleSaved: (id: string) => void;
}>({ state: initial, ready: false, update: () => {}, toggleSaved: () => {} });
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const queue = useRef(Promise.resolve());
  const currentState = useRef(initial);
  const writable = useRef(true);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(raw => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            !Array.isArray(parsed.ages) ||
            !Array.isArray(parsed.cards) ||
            !Array.isArray(parsed.saved)
          )
            throw new Error('Invalid data');
          currentState.current = { ...initial, ...parsed };
          setState(currentState.current);
        }
      })
      .catch(() => {
        writable.current = false;
        Alert.alert(
          'Storage unavailable',
          'Your existing data could not be loaded. Restart the app before making changes.',
        );
      })
      .finally(() => setReady(true));
  }, []);
  const update = (fn: (s: State) => State) => {
    if (!writable.current) return;
    const next = fn(currentState.current);
    currentState.current = next;
    setState(next);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(key, JSON.stringify(next)))
      .catch(() => {
        Alert.alert(
          'Could not save',
          'Your changes are in memory. Please check device storage.',
        );
      });
  };
  const toggleSaved = (id: string) =>
    update(s => ({
      ...s,
      saved: s.saved.includes(id)
        ? s.saved.filter(x => x !== id)
        : [...s.saved, id],
    }));
  return (
    <Context.Provider value={{ state, ready, update, toggleSaved }}>
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
