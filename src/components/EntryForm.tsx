import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Field, Sheet, s } from './UI';
import { useApp } from '../store/AppStore';
import { Entry } from '../types';
import { uid, validYear, yearLabel } from '../utils/history';
export function EntryForm({
  kind,
  onClose,
}: {
  kind: 'ages' | 'inventions' | 'facts';
  onClose: () => void;
}) {
  const { update } = useApp();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const fields: [string, string, boolean?][] =
    kind === 'ages'
      ? [
          ['title', 'Name'],
          ['civilization', 'Country / civilization'],
          ['start', 'Start year (negative = BCE)'],
          ['end', 'End year'],
          ['description', 'Summary', true],
          ['achievements', 'Major achievements (one per line)', true],
          ['figures', 'Key figures'],
          ['flourished', 'Why it flourished', true],
          ['declined', 'Why it declined', true],
        ]
      : kind === 'inventions'
      ? [
          ['title', 'Name'],
          ['date', 'Approximate date'],
          ['civilization', 'Civilization or country'],
          ['category', 'Category'],
          ['origin', 'Inventor / origin'],
          ['description', 'Short description', true],
          ['importance', 'Historical importance', true],
          ['impact', 'Impact on society', true],
          ['related', 'Related period'],
        ]
      : [
          ['title', 'Short title'],
          ['description', 'Fact', true],
          ['date', 'Historical period'],
          ['civilization', 'Country / civilization'],
          ['category', 'Category'],
        ];
  const save = () => {
    if (!values.title?.trim() || !values.description?.trim()) {
      setError('Enter a title and description.');
      return;
    }
    if (
      kind === 'ages' &&
      (!validYear(values.start || '') ||
        !validYear(values.end || '') ||
        Number(values.start) >= Number(values.end))
    ) {
      setError(
        'Enter valid start and end years in chronological order. There is no year zero.',
      );
      return;
    }
    const entry: Entry = {
      id: uid(),
      title: values.title.trim(),
      ...Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, v.trim()]),
      ),
    };
    if (kind === 'ages') {
      entry.start = Number(values.start);
      entry.end = Number(values.end);
      entry.date = `${yearLabel(entry.start)} – ${yearLabel(entry.end)}`;
    }
    update(st => ({ ...st, [kind]: [entry, ...st[kind]] }));
    onClose();
  };
  return (
    <Sheet
      title={`New ${
        kind === 'ages' ? 'Golden Age' : kind === 'facts' ? 'Fact' : 'Invention'
      }`}
      visible
      onClose={onClose}
    >
      {fields.map(([key, label, multi]) => (
        <Field
          key={key}
          label={label}
          multiline={multi}
          value={values[key] || ''}
          onChange={v => setValues({ ...values, [key]: v })}
        />
      ))}
      {!!error && <Text style={s.body}>{error}</Text>}
      <Button
        title={`Add ${
          kind === 'ages'
            ? 'Golden Age'
            : kind === 'facts'
            ? 'fact'
            : 'invention'
        }`}
        onPress={save}
      />
    </Sheet>
  );
}
