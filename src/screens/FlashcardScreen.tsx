import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { useApp } from '../store/AppStore';
import { Flashcard, RootStack } from '../types';
import { uid } from '../utils/history';
import { Reveal } from '../components/Motion';
import { useLayout } from '../hooks/useLayout';
export function FolderScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStack, 'Folder'>) {
  const { state, update } = useApp();
  const folder = state.folders.find(f => f.id === route.params.id);
  const cards = state.cards.filter(c => c.folderId === route.params.id);
  const [editing, setEditing] = useState<Partial<Flashcard> | null>(null);
  const [flipped, setFlipped] = useState<string[]>([]);
  const learned = cards.filter(c => c.learned).length;
  const save = () => {
    if (!editing?.question?.trim() || !editing?.answer?.trim()) return;
    const card: Flashcard = {
      id: editing.id || uid(),
      folderId: route.params.id,
      question: editing.question.trim(),
      answer: editing.answer.trim(),
      category: editing.category?.trim() || '',
      learned: editing.learned || false,
    };
    update(st => ({
      ...st,
      cards: editing.id
        ? st.cards.map(c => (c.id === editing.id ? card : c))
        : [...st.cards, card],
    }));
    setEditing(null);
  };
  return (
    <Screen
      title={folder?.title || 'Folder'}
      eyebrow={`${cards.length} CARDS`}
      back={() => navigation.goBack()}
      actions={
        <IconButton
          label="New flashcard"
          icon="+"
          onPress={() => setEditing({})}
        />
      }
    >
      <Card>
        <Text style={s.body}>
          Study progress ·{' '}
          {cards.length ? Math.round((learned / cards.length) * 100) : 0}%
        </Text>
        <Bar value={cards.length ? (learned / cards.length) * 100 : 0} />
        <Button
          title="Study"
          disabled={!cards.length}
          onPress={() => navigation.navigate('Study', { id: route.params.id })}
        />
      </Card>
      {!cards.length && (
        <Empty
          title="Your first flashcard"
          body="Tap + to add a question and answer."
        />
      )}
      {cards.map(c => (
        <Card key={c.id}>
          <Pressable
            accessibilityLabel="Flip flashcard"
            onPress={() =>
              setFlipped(
                flipped.includes(c.id)
                  ? flipped.filter(id => id !== c.id)
                  : [...flipped, c.id],
              )
            }
          >
            <Text style={[s.label, { color: colors.orange }]}>
              {flipped.includes(c.id) ? 'ANSWER' : 'QUESTION'}
            </Text>
            <Reveal revision={flipped.includes(c.id) ? 1 : 0}>
              <Text style={[s.h2, { fontSize: 20, marginTop: 8 }]}>
                {flipped.includes(c.id) ? c.answer : c.question}
              </Text>
            </Reveal>
          </Pressable>
          <Text style={s.chipText}>{c.category}</Text>
          <View style={[s.row, { justifyContent: 'flex-end' }]}>
            <IconButton
              label="Edit flashcard"
              icon="✎"
              onPress={() => setEditing(c)}
            />
            <IconButton
              label={c.learned ? 'Mark needs review' : 'Mark learned'}
              icon="✓"
              active={c.learned}
              onPress={() =>
                update(st => ({
                  ...st,
                  cards: st.cards.map(x =>
                    x.id === c.id ? { ...x, learned: !x.learned } : x,
                  ),
                }))
              }
            />
            <IconButton
              label="Delete flashcard"
              icon="×"
              onPress={() =>
                Alert.alert(
                  'Delete Flashcard?',
                  'This card will be permanently deleted.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () =>
                        update(st => ({
                          ...st,
                          cards: st.cards.filter(x => x.id !== c.id),
                        })),
                    },
                  ],
                )
              }
            />
          </View>
        </Card>
      ))}
      <Sheet
        title={editing?.id ? 'Edit Flashcard' : 'New Flashcard'}
        visible={editing !== null}
        onClose={() => setEditing(null)}
      >
        <Field
          label="Front · question"
          multiline
          value={editing?.question || ''}
          onChange={v => setEditing({ ...editing, question: v })}
        />
        <Field
          label="Back · answer"
          multiline
          value={editing?.answer || ''}
          onChange={v => setEditing({ ...editing, answer: v })}
        />
        <Field
          label="Category / historical period (optional)"
          value={editing?.category || ''}
          onChange={v => setEditing({ ...editing, category: v })}
        />
        <Button
          title={editing?.id ? 'Save changes' : 'Add flashcard'}
          disabled={!editing?.question?.trim() || !editing?.answer?.trim()}
          onPress={save}
        />
      </Sheet>
    </Screen>
  );
}
export function StudyScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStack, 'Study'>) {
  const { state, update } = useApp();
  const [deck, setDeck] = useState(() =>
    state.cards.filter(c => c.folderId === route.params.id).map(c => c.id),
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const layout = useLayout();
  const [correct, setCorrect] = useState(0);
  const card = state.cards.find(c => c.id === deck[index]);
  const folder = state.folders.find(f => f.id === route.params.id);
  const grade = (learned: boolean) => {
    if (!card) return;
    update(st => ({
      ...st,
      cards: st.cards.map(c => (c.id === card.id ? { ...c, learned } : c)),
    }));
    if (learned) setCorrect(correct + 1);
    setRevealed(false);
    setIndex(index + 1);
  };
  return (
    <Screen
      back={() => navigation.goBack()}
      title={folder?.title || 'Study'}
      eyebrow="STUDY MODE"
    >
      {card ? (
        <>
          <Text style={s.body}>
            Card {index + 1} of {deck.length} · {correct} learned this session
          </Text>
          <Bar value={(index / deck.length) * 100} />
          <View
            style={[
              s.card,
              {
                minHeight: layout.studyHeight,
                justifyContent: 'center',
                padding: layout.compact ? 18 : 28,
              },
            ]}
          >
            <Text style={s.chipText}>{card.category}</Text>
            <Text style={[s.label, { color: colors.orange, marginTop: 35 }]}>
              {revealed ? 'ANSWER' : 'QUESTION'}
            </Text>
            <Reveal revision={`${card.id}-${revealed}`}>
              <Text
                style={[
                  s.h2,
                  {
                    fontSize: layout.compact ? 23 : 27,
                    lineHeight: layout.compact ? 31 : 37,
                  },
                ]}
              >
                {revealed ? card.answer : card.question}
              </Text>
            </Reveal>
          </View>
          {revealed ? (
            <>
              <Text style={[s.body, { textAlign: 'center' }]}>
                How did you do?
              </Text>
              <View
                style={[
                  s.row,
                  layout.stacked && {
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Button title="Needs Review" onPress={() => grade(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="✓ Learned" onPress={() => grade(true)} />
                </View>
              </View>
            </>
          ) : (
            <Button title="Reveal answer" onPress={() => setRevealed(true)} />
          )}
        </>
      ) : (
        <>
          <Empty
            title="Session complete"
            body={`${correct} of ${deck.length} cards learned. Your progress has been saved.`}
          />
          <Button
            title="Review remaining cards"
            disabled={
              !state.cards.some(
                c => c.folderId === route.params.id && !c.learned,
              )
            }
            onPress={() => {
              setDeck(
                state.cards
                  .filter(c => c.folderId === route.params.id && !c.learned)
                  .map(c => c.id),
              );
              setIndex(0);
              setCorrect(0);
              setRevealed(false);
            }}
          />
          <Button title="Back to folder" onPress={() => navigation.goBack()} />
        </>
      )}
    </Screen>
  );
}
