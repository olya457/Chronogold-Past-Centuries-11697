import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Bar,
  Button,
  Card,
  Empty,
  Field,
  IconButton,
  Screen,
  Sheet,
  Tabs,
  colors,
  s,
} from '../components/UI';
import library from '../data/library.json';
import { useApp } from '../store/AppStore';
import { Research, RootStack } from '../types';
import { uid } from '../utils/history';
function ResearchCard({ item }: { item: Research }) {
  const { state, update } = useApp();
  const [expanded, setExpanded] = useState(false);
  const completed = state.completed.includes(item.id);
  return (
    <Card>
      <View style={[s.row, { alignItems: 'flex-start' }]}>
        <IconButton
          label={completed ? 'Reopen research' : 'Complete research'}
          icon={completed ? '✓' : '○'}
          active={completed}
          onPress={() =>
            update(st => ({
              ...st,
              completed: completed
                ? st.completed.filter(x => x !== item.id)
                : [...st.completed, item.id],
            }))
          }
        />
        <Pressable
          style={{ flex: 1, gap: 10 }}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={[s.h2, { fontSize: 18 }]}>{item.title}</Text>
          <Text style={[s.chipText, { color: colors.orange }]}>
            {item.difficulty} · {item.date} {expanded ? '⌃' : '⌄'}
          </Text>
        </Pressable>
      </View>
      {expanded && (
        <>
          <Text style={[s.label, { color: colors.orange }]}>INSTRUCTIONS</Text>
          <Text style={s.body}>
            Explore evidence, compare interpretations, and record your findings
            and sources below.
          </Text>
          <Field
            label="Your notes"
            multiline
            value={state.notes[item.id] || ''}
            onChange={value =>
              update(st => ({
                ...st,
                notes: { ...st.notes, [item.id]: value },
              }))
            }
            placeholder="Write your findings, sources and questions…"
          />
        </>
      )}
    </Card>
  );
}
export function LearnScreen() {
  const { state, update } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  const [tab, setTab] = useState('Research');
  const [folderForm, setFolderForm] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [random, setRandom] = useState<string | null>(null);
  const active = library.research.filter(e => !state.completed.includes(e.id));
  const learned = state.cards.filter(c => c.learned).length;
  const save = () => {
    if (!name.trim()) return;
    update(st => ({
      ...st,
      folders:
        folderForm === 'new'
          ? [...st.folders, { id: uid(), title: name.trim() }]
          : st.folders.map(f =>
              f.id === folderForm ? { ...f, title: name.trim() } : f,
            ),
    }));
    setFolderForm(null);
    setName('');
  };
  return (
    <Screen title="Learn" eyebrow="STUDY">
      <Tabs
        options={['Research', 'Flashcards']}
        value={tab}
        onChange={setTab}
      />
      {tab === 'Research' ? (
        <>
          <Card>
            <Text style={s.h2}>
              {state.completed.length}/{library.research.length} Research
              Challenges
            </Text>
            <Text style={s.body}>Explore · investigate · remember</Text>
            <Bar
              value={(state.completed.length / library.research.length) * 100}
            />
            <Button
              title="Random Research"
              disabled={!active.length}
              onPress={() =>
                setRandom(active[Math.floor(Math.random() * active.length)].id)
              }
            />
            <Button
              title="Completed research"
              onPress={() => navigation.navigate('Completed')}
            />
          </Card>
          {random && active.find(e => e.id === random) && (
            <ResearchCard item={active.find(e => e.id === random)!} />
          )}
          <View>
            {active
              .filter(e => e.id !== random)
              .map(e => (
                <ResearchCard key={e.id} item={e} />
              ))}
          </View>
          {!active.length && (
            <Empty
              title="All research completed"
              body="Your notes are available in Completed research."
            />
          )}
        </>
      ) : (
        <>
          <Card>
            <Text style={s.h2}>Overall mastery</Text>
            <Text style={s.body}>
              {learned}/{state.cards.length} learned
            </Text>
            <Bar
              value={
                state.cards.length ? (learned / state.cards.length) * 100 : 0
              }
            />
          </Card>
          <View style={s.between}>
            <Text style={s.section}>Folders</Text>
            <IconButton
              label="New folder"
              icon="+"
              onPress={() => {
                setName('');
                setFolderForm('new');
              }}
            />
          </View>
          {!state.folders.length && (
            <Empty
              title="No folders yet"
              body="Create a folder to organize your flashcards."
            />
          )}
          {state.folders.map(folder => {
            const cards = state.cards.filter(c => c.folderId === folder.id);
            const count = cards.filter(c => c.learned).length;
            return (
              <Card key={folder.id}>
                <View style={s.row}>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate('Folder', { id: folder.id })
                    }
                  >
                    <Text style={s.h2}>{folder.title}</Text>
                    <Text style={s.chipText}>
                      {cards.length} cards ·{' '}
                      {cards.length
                        ? Math.round((count / cards.length) * 100)
                        : 0}
                      % studied
                    </Text>
                  </Pressable>
                  <IconButton
                    label="Rename folder"
                    icon="✎"
                    onPress={() => {
                      setName(folder.title);
                      setFolderForm(folder.id);
                    }}
                  />
                  <IconButton
                    label="Delete folder"
                    icon="×"
                    onPress={() =>
                      Alert.alert(
                        'Delete folder?',
                        'All cards in this folder will be permanently deleted.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () =>
                              update(st => ({
                                ...st,
                                folders: st.folders.filter(
                                  f => f.id !== folder.id,
                                ),
                                cards: st.cards.filter(
                                  c => c.folderId !== folder.id,
                                ),
                              })),
                          },
                        ],
                      )
                    }
                  />
                </View>
                <Bar value={cards.length ? (count / cards.length) * 100 : 0} />
              </Card>
            );
          })}
        </>
      )}
      <Sheet
        title={folderForm === 'new' ? 'New Folder' : 'Rename Folder'}
        visible={folderForm !== null}
        onClose={() => setFolderForm(null)}
      >
        <Field
          label="Folder name"
          value={name}
          onChange={setName}
          placeholder="e.g. Medieval Europe"
        />
        <Button
          title={folderForm === 'new' ? 'Create folder' : 'Save changes'}
          disabled={!name.trim()}
          onPress={save}
        />
      </Sheet>
    </Screen>
  );
}
export function CompletedScreen({
  navigation,
}: NativeStackScreenProps<RootStack, 'Completed'>) {
  const { state } = useApp();
  const completed = library.research.filter(e =>
    state.completed.includes(e.id),
  );
  return (
    <Screen
      title="Completed Research"
      eyebrow="FINISHED"
      back={() => navigation.goBack()}
    >
      {completed.length ? (
        completed.map(e => <ResearchCard key={e.id} item={e} />)
      ) : (
        <Empty
          title="Nothing here yet"
          body="Tick a research task and it will be archived here with your notes."
        />
      )}
    </Screen>
  );
}
