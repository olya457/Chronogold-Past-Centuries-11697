import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Bar,
  Button,
  Card,
  Empty,
  Field,
  IconButton,
  Screen,
  Sheet,
  colors,
  s,
} from '../components/UI';
import { Radar, chartColors } from '../components/Radar';
import { useApp } from '../store/AppStore';
import { metrics } from '../types';
import { overall, yearDistance } from '../utils/history';
import { useLayout } from '../hooks/useLayout';
export function CompareScreen() {
  const { state, update } = useApp();
  const layout = useLayout();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = state.compare
    .map(id => state.ages.find(e => e.id === id))
    .filter(e => !!e);
  const toggle = (id: string) =>
    update(st => ({
      ...st,
      compare: st.compare.includes(id)
        ? st.compare.filter(x => x !== id)
        : st.compare.length < 3
        ? [...st.compare, id]
        : st.compare,
    }));
  const maxDuration = Math.max(
    1,
    ...selected.map(e => yearDistance(e.start || 1, e.end || 1)),
  );
  const rated = selected.filter(e => e.scores?.length === 9);
  return (
    <Screen
      title="Compare"
      eyebrow="SIDE BY SIDE"
      actions={
        <IconButton
          label="Choose golden ages"
          icon="+"
          onPress={() => setOpen(true)}
        />
      }
    >
      <View
        style={[
          s.row,
          { alignItems: 'stretch' },
          layout.stacked && { flexDirection: 'column' },
        ]}
      >
        {[0, 1, 2].map(i => {
          const e = selected[i];
          return (
            <Pressable
              key={i}
              onPress={() => (e ? toggle(e.id) : setOpen(true))}
              style={{
                flex: 1,
                minHeight: layout.stacked ? 90 : 132,
                padding: layout.compact ? 9 : 12,
                borderWidth: 1,
                borderColor: e ? chartColors[i] + '66' : colors.line,
                borderRadius: 20,
                backgroundColor: e ? colors.surface : 'transparent',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: chartColors[i], fontSize: 19 }}>
                {e ? '●  ×' : '+'}
              </Text>
              <Text style={[s.body, { fontSize: 12, lineHeight: 17 }]}>
                {e?.title || (i < 2 ? 'Add (required)' : 'Add')}
              </Text>
              {e && (
                <Text style={[s.h2, { color: chartColors[i] }]}>
                  {overall(e.scores) ?? '—'}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      {selected.length < 2 ? (
        <Empty
          title="Pick at least two"
          body="Select 2–3 Golden Ages to see duration, profiles and rankings."
        />
      ) : (
        <>
          <Text style={s.section}>Shape of power</Text>
          <Card>
            {rated.length === selected.length ? (
              <>
                <Radar series={selected.map(e => e.scores!)} />
                {selected.map((e, i) => (
                  <Text
                    key={e.id}
                    style={[s.chipText, { color: chartColors[i] }]}
                  >
                    ● {e.title}
                  </Text>
                ))}
              </>
            ) : (
              <Text style={s.body}>
                Open each Golden Age in Explore and add your category ratings to
                see its radar chart and ranking.
              </Text>
            )}
          </Card>
          <Text style={s.section}>Duration</Text>
          <Card>
            {selected.map((e, i) => (
              <View key={e.id} style={{ gap: 8, marginBottom: 10 }}>
                <View style={s.between}>
                  <Text style={[s.body, { flex: 1 }]}>{e.title}</Text>
                  <Text style={{ color: chartColors[i] }}>
                    {yearDistance(e.start || 1, e.end || 1)} yrs
                  </Text>
                </View>
                <Bar
                  value={
                    (yearDistance(e.start || 1, e.end || 1) / maxDuration) * 100
                  }
                  color={chartColors[i]}
                />
                <Text style={s.chipText}>{e.date}</Text>
              </View>
            ))}
          </Card>
          {rated.length === selected.length && (
            <>
              <Text style={s.section}>Category scores</Text>
              {metrics.map((m, j) => (
                <Card key={m}>
                  <Text style={s.body}>{m}</Text>
                  {selected.map((e, i) => (
                    <View key={e.id} style={s.row}>
                      <Text style={{ color: chartColors[i], width: 25 }}>
                        {e.scores![j]}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Bar color={chartColors[i]} value={e.scores![j]} />
                      </View>
                    </View>
                  ))}
                </Card>
              ))}
              <Text style={s.section}>Final ranking</Text>
              <Card>
                {[...selected]
                  .sort((a, b) => overall(b.scores)! - overall(a.scores)!)
                  .map((e, i) => (
                    <View key={e.id} style={s.between}>
                      <Text style={[s.h2, { color: colors.orange }]}>
                        {i + 1}
                      </Text>
                      <Text style={[s.body, { flex: 1 }]}>{e.title}</Text>
                      <Text style={s.h2}>{overall(e.scores)}</Text>
                    </View>
                  ))}
              </Card>
            </>
          )}
        </>
      )}
      <Sheet
        title="Choose 2–3 Golden Ages"
        visible={open}
        onClose={() => setOpen(false)}
      >
        <Field label="Search" value={query} onChange={setQuery} />
        {state.ages
          .filter(e => e.title.toLowerCase().includes(query.toLowerCase()))
          .map(e => (
            <Pressable
              key={e.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: state.compare.includes(e.id) }}
              onPress={() => toggle(e.id)}
              style={[
                s.card,
                {
                  padding: layout.compact ? 9 : 12,
                  borderColor: state.compare.includes(e.id)
                    ? colors.orange
                    : colors.line,
                },
              ]}
            >
              <View style={s.between}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.body, { color: colors.text }]}>
                    {e.title}
                  </Text>
                  <Text style={s.chipText}>{e.date}</Text>
                </View>
                <Text style={{ color: colors.orange, fontSize: 21 }}>
                  {state.compare.includes(e.id) ? '✓' : '+'}
                </Text>
              </View>
            </Pressable>
          ))}
        <Button
          title={`Done · ${selected.length} selected`}
          onPress={() => setOpen(false)}
        />
      </Sheet>
    </Screen>
  );
}
