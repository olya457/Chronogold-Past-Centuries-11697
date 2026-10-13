import React, { useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  Card,
  Chips,
  Empty,
  Field,
  IconButton,
  Screen,
  Tabs,
  colors,
  s,
} from '../components/UI';
import { EntryForm } from '../components/EntryForm';
import { useApp } from '../store/AppStore';
import { Entry, RootStack } from '../types';
import { overall, yearDistance } from '../utils/history';
export const ageArt = [
  require('../assets/chronogold-era-jade.png'),
  require('../assets/chronogold-era-copper.png'),
  require('../assets/chronogold-era-amber.png'),
  require('../assets/chronogold-era-emerald.png'),
  require('../assets/chronogold-era-bronze.png'),
];
export function AgeCard({
  entry,
  index,
  onPress,
}: {
  entry: Entry;
  index: number;
  onPress: () => void;
}) {
  const { state, toggleSaved } = useApp();
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <View style={[s.card, { padding: 0, overflow: 'hidden' }]}>
        <ImageBackground
          source={ageArt[index % 5]}
          style={{ height: 104, padding: 12 }}
        >
          <View style={s.between}>
            <Text
              style={[
                s.chipText,
                {
                  color: colors.text,
                  backgroundColor: '#163b2b90',
                  padding: 5,
                  borderRadius: 12,
                },
              ]}
            >
              {entry.date}
            </Text>
            <IconButton
              label="Save golden age"
              icon={state.saved.includes(entry.id) ? '♥' : '♡'}
              active={state.saved.includes(entry.id)}
              onPress={() => toggleSaved(entry.id)}
            />
          </View>
        </ImageBackground>
        <View style={{ padding: 16, paddingTop: 0, gap: 8 }}>
          <View style={s.between}>
            <Text style={[s.h2, { flex: 1 }]}>{entry.title}</Text>
            {overall(entry.scores) !== null && (
              <Text style={[s.h2, { color: colors.orange }]}>
                {overall(entry.scores)}
              </Text>
            )}
          </View>
          <Text style={s.chipText}>{entry.civilization}</Text>
          {entry.start !== undefined && entry.end !== undefined && (
            <Text style={s.chipText}>
              ◷ {yearDistance(entry.start, entry.end)} years
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
export function InventionCard({
  entry,
  onPress,
}: {
  entry: Entry;
  onPress: () => void;
}) {
  const { state, toggleSaved } = useApp();
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={s.row}>
          <Text style={{ fontSize: 27, color: colors.orange }}>♧</Text>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={s.h2}>{entry.title}</Text>
            <Text style={s.chipText}>{entry.date}</Text>
          </View>
          <IconButton
            label="Bookmark invention"
            icon={state.saved.includes(entry.id) ? '▣' : '♧'}
            active={state.saved.includes(entry.id)}
            onPress={() => toggleSaved(entry.id)}
          />
        </View>
        <Text numberOfLines={2} style={s.body}>
          {entry.description}
        </Text>
        <Text style={[s.chipText, { color: colors.green }]}>
          {entry.category}
        </Text>
      </Card>
    </Pressable>
  );
}
export function ExploreScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStack>>();
  const { state } = useApp();
  const [tab, setTab] = useState('Golden Ages');
  const [filter, setFilter] = useState('All Saved');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<'ages' | 'inventions' | null>(null);
  const match = (e: Entry) =>
    (e.title + ' ' + e.civilization + ' ' + e.description)
      .toLowerCase()
      .includes(query.toLowerCase()) &&
    (tab !== 'Saved' || state.saved.includes(e.id));
  const ages =
    tab === 'Inventions' || (tab === 'Saved' && filter === 'Inventions')
      ? []
      : state.ages.filter(match);
  const inventions =
    tab === 'Golden Ages' || (tab === 'Saved' && filter === 'Golden Ages')
      ? []
      : state.inventions.filter(match);
  return (
    <Screen
      title="Explore"
      eyebrow="CHRONOGOLD"
      actions={
        <IconButton
          label="Add entry"
          icon="+"
          onPress={() => setForm(tab === 'Inventions' ? 'inventions' : 'ages')}
        />
      }
    >
      <Tabs
        options={['Golden Ages', 'Inventions', 'Saved']}
        value={tab}
        onChange={setTab}
      />
      {tab === 'Saved' && (
        <Chips
          options={['All Saved', 'Golden Ages', 'Inventions']}
          value={filter}
          onChange={setFilter}
        />
      )}
      <Field
        label="Search"
        placeholder="Search"
        value={query}
        onChange={setQuery}
      />
      {!ages.length && !inventions.length && (
        <Empty
          title={tab === 'Saved' ? 'Nothing saved yet' : 'No matching entries'}
          body={
            tab === 'Saved'
              ? 'Tap the heart or bookmark on any card to keep it here.'
              : 'Try another search or add your own entry.'
          }
        />
      )}
      <View>
        {ages.map(e => (
          <AgeCard
            key={e.id}
            entry={e}
            index={state.ages.indexOf(e)}
            onPress={() => nav.navigate('Detail', { kind: 'ages', id: e.id })}
          />
        ))}
        {inventions.map(e => (
          <InventionCard
            key={e.id}
            entry={e}
            onPress={() =>
              nav.navigate('Detail', { kind: 'inventions', id: e.id })
            }
          />
        ))}
      </View>
      {form && <EntryForm kind={form} onClose={() => setForm(null)} />}
    </Screen>
  );
}
