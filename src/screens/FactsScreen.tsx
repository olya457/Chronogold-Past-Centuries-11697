import React, { useState } from 'react';
import { Alert, Share, Text, View } from 'react-native';
import { GradientSurface } from '../components/GradientSurface';
import {
  Card,
  Chips,
  Empty,
  Field,
  IconButton,
  Screen,
  colors,
  s,
} from '../components/UI';
import { EntryForm } from '../components/EntryForm';
import { useApp } from '../store/AppStore';
import { Entry } from '../types';
export function FactsScreen() {
  const { state, toggleSaved } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const today = new Date();
  const day = Math.floor(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000,
  );
  const fact = state.facts[day % state.facts.length];
  const actions = (e: Entry) => (
    <View style={s.between}>
      <Text style={[s.chipText, { flex: 1, color: colors.orange }]}>
        {e.civilization}
      </Text>
      <View style={s.row}>
        <IconButton
          label="Save fact"
          icon={state.saved.includes(e.id) ? '♥' : '♡'}
          active={state.saved.includes(e.id)}
          onPress={() => toggleSaved(e.id)}
        />
        <IconButton
          label="Share fact"
          icon="↥"
          onPress={() => {
            Share.share({
              message: `${e.title}\n\n${e.description}\n\n${e.civilization} · ${e.date}\nChronogold`,
            }).catch(() =>
              Alert.alert('Sharing unavailable', 'Please try again.'),
            );
          }}
        />
      </View>
    </View>
  );
  const filtered = state.facts.filter(
    e =>
      (category === 'All' || e.category === category) &&
      (!saved || state.saved.includes(e.id)) &&
      (e.title + ' ' + e.description)
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Screen
      title="Facts"
      eyebrow="DID YOU KNOW"
      actions={
        <>
          <IconButton
            label="Show saved facts"
            icon={saved ? '♥' : '♡'}
            active={saved}
            onPress={() => setSaved(!saved)}
          />
          <IconButton
            label="Add fact"
            icon="+"
            onPress={() => setAdding(true)}
          />
        </>
      }
    >
      {fact && !saved && (
        <GradientSurface
          colors={['#75502c', '#133626', '#101f16']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[s.card, { padding: 22, borderColor: '#ac723b66' }]}
        >
          <Text style={[s.label, { color: '#ffbf7c' }]}>FACT OF THE DAY</Text>
          <Text style={[s.h2, { fontSize: 28 }]}>{fact.title}</Text>
          <Text style={[s.body, { color: colors.text }]}>
            {fact.description}
          </Text>
          <Text style={s.chipText}>{fact.date}</Text>
          {actions(fact)}
        </GradientSurface>
      )}
      <Chips
        options={[
          'All',
          ...Array.from(new Set(state.facts.map(e => e.category || 'Other'))),
        ]}
        value={category}
        onChange={setCategory}
      />
      <Field
        label="Search"
        placeholder="Search facts"
        value={query}
        onChange={setQuery}
      />
      {!filtered.length && (
        <Empty
          title={saved ? 'Nothing saved yet' : 'No facts found'}
          body="Save a fact with the heart, or try another filter."
        />
      )}
      {filtered.map(e => (
        <Card key={e.id}>
          <View style={s.between}>
            <Text style={[s.chipText, { color: colors.green }]}>
              {e.category}
            </Text>
            <Text style={[s.chipText, { flex: 1, textAlign: 'right' }]}>
              {e.date}
            </Text>
          </View>
          <Text style={s.h2}>{e.title}</Text>
          <Text style={s.body}>{e.description}</Text>
          {actions(e)}
        </Card>
      ))}
      {adding && <EntryForm kind="facts" onClose={() => setAdding(false)} />}
    </Screen>
  );
}
