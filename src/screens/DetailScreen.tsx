import React, { useState } from 'react';
import { Alert, ImageBackground, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  Field,
  IconButton,
  Screen,
  Sheet,
  Bar,
  colors,
  s,
} from '../components/UI';
import { Radar } from '../components/Radar';
import { useApp } from '../store/AppStore';
import { metrics, RootStack } from '../types';
import { overall, yearDistance } from '../utils/history';
import { ageArt, InventionCard } from './ExploreScreen';
export function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStack, 'Detail'>) {
  const { state, update, toggleSaved } = useApp();
  const { kind, id } = route.params;
  const entry = state[kind].find(e => e.id === id);
  const [editing, setEditing] = useState(false);
  const [scores, setScores] = useState<string[]>(
    entry?.scores?.map(String) || metrics.map(() => ''),
  );
  if (!entry) return null;
  const saveScores = () => {
    if (scores.some(x => !/^\d+$/.test(x) || Number(x) > 100)) {
      Alert.alert(
        'Scores',
        'Enter a whole number from 0 to 100 for every category.',
      );
      return;
    }
    update(st => ({
      ...st,
      ages: st.ages.map(e =>
        e.id === id ? { ...e, scores: scores.map(Number) } : e,
      ),
    }));
    setEditing(false);
  };
  const compare = () => {
    if (!state.compare.includes(id) && state.compare.length >= 3) {
      Alert.alert('Three selected', 'Remove a Golden Age from Compare first.');
      return;
    }
    update(st => ({
      ...st,
      compare: st.compare.includes(id) ? st.compare : [...st.compare, id],
    }));
    navigation.navigate('Main', { screen: 'Compare' });
  };
  return (
    <Screen back={() => navigation.goBack()} actions={undefined}>
      <View style={s.between}>
        <Text style={s.label}>
          {kind === 'ages' ? 'GOLDEN AGE' : entry.category}
        </Text>
        <IconButton
          label="Save"
          icon={state.saved.includes(id) ? '♥' : '♡'}
          active={state.saved.includes(id)}
          onPress={() => toggleSaved(id)}
        />
      </View>
      {kind === 'ages' ? (
        <ImageBackground
          source={ageArt[state.ages.indexOf(entry) % 5]}
          imageStyle={{ borderRadius: 24 }}
          style={{ minHeight: 160, padding: 18, justifyContent: 'flex-end' }}
        >
          <Text style={s.label}>{entry.civilization}</Text>
          <Text style={s.title}>{entry.title}</Text>
        </ImageBackground>
      ) : (
        <Text style={s.title}>{entry.title}</Text>
      )}
      <Text style={s.body}>{entry.date}</Text>
      <Text style={s.body}>{entry.description}</Text>
      {kind === 'ages' ? (
        <>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Card>
                <Text style={s.h2}>
                  {entry.start !== undefined && entry.end !== undefined
                    ? yearDistance(entry.start, entry.end)
                    : '—'}
                </Text>
                <Text style={s.label}>YEARS</Text>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card>
                <Text style={s.h2}>{overall(entry.scores) ?? '—'}</Text>
                <Text style={s.label}>YOUR SCORE</Text>
              </Card>
            </View>
          </View>
          <Button title="⚖  Add to Compare" onPress={compare} />
          <Text style={s.section}>Power profile</Text>
          <Card>
            {entry.scores ? (
              <>
                <Radar series={[entry.scores]} />
                {metrics.map((m, i) => (
                  <View key={m} style={{ gap: 6 }}>
                    <View style={s.between}>
                      <Text style={s.body}>{m}</Text>
                      <Text style={s.body}>{entry.scores![i]}</Text>
                    </View>
                    <Bar value={entry.scores![i]} />
                  </View>
                ))}
              </>
            ) : (
              <Text style={s.body}>
                Add your own category ratings to build a power profile. Ratings
                are personal assessments.
              </Text>
            )}
            <Button
              title={entry.scores ? 'Edit your ratings' : 'Add your ratings'}
              onPress={() => setEditing(true)}
            />
          </Card>
          {[
            ['Major achievements', entry.achievements],
            ['Key figures', entry.figures],
            ['Why it flourished', entry.flourished],
            ['Why it declined', entry.declined],
            ['Related developments', entry.related],
          ].map(([title, body]) =>
            body ? (
              <View key={title}>
                <Text style={s.section}>{title}</Text>
                <Card>
                  <Text style={s.body}>{body}</Text>
                </Card>
              </View>
            ) : null,
          )}
          <Text style={s.section}>Related inventions</Text>
          {state.inventions
            .filter(e => e.related?.includes(entry.title))
            .map(e => (
              <InventionCard
                key={e.id}
                entry={e}
                onPress={() =>
                  navigation.push('Detail', { kind: 'inventions', id: e.id })
                }
              />
            ))}
          <Sheet
            title="Your category ratings"
            visible={editing}
            onClose={() => setEditing(false)}
          >
            <Text style={s.body}>Personal assessment · 0–100 per category</Text>
            {metrics.map((m, i) => (
              <Field
                key={m}
                label={m}
                numeric
                value={scores[i]}
                onChange={v =>
                  setScores(scores.map((x, j) => (i === j ? v : x)))
                }
              />
            ))}
            <Button title="Save ratings" onPress={saveScores} />
          </Sheet>
        </>
      ) : (
        <>
          {[
            ['Inventor / origin', entry.origin],
            ['Historical importance', entry.importance],
            ['Impact on society', entry.impact],
            ['Related period', entry.related],
          ].map(([title, body]) =>
            body ? (
              <Card key={title}>
                <Text style={[s.label, { color: colors.orange }]}>
                  {title?.toUpperCase()}
                </Text>
                <Text style={s.body}>{body}</Text>
              </Card>
            ) : null,
          )}
          {state.ages
            .filter(a => entry.related?.includes(a.title))
            .map(a => (
              <Button
                key={a.id}
                title={a.title}
                onPress={() =>
                  navigation.push('Detail', { kind: 'ages', id: a.id })
                }
              />
            ))}
        </>
      )}
    </Screen>
  );
}
