export const metrics = [
  'Economy',
  'Military',
  'Science',
  'Culture',
  'Trade',
  'Architecture',
  'Education',
  'Stability',
  'Innovation',
] as const;
export type Entry = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  civilization?: string;
  start?: number;
  end?: number;
  duration?: string;
  achievements?: string;
  figures?: string;
  flourished?: string;
  declined?: string;
  related?: string;
  origin?: string;
  importance?: string;
  impact?: string;
  scores?: number[];
};
export type Research = {
  id: string;
  title: string;
  difficulty: string;
  date: string;
};
export type Folder = { id: string; title: string };
export type Flashcard = {
  id: string;
  folderId: string;
  question: string;
  answer: string;
  category: string;
  learned: boolean;
};
export type State = {
  onboarded: boolean;
  ages: Entry[];
  inventions: Entry[];
  facts: Entry[];
  folders: Folder[];
  cards: Flashcard[];
  saved: string[];
  compare: string[];
  notes: Record<string, string>;
  completed: string[];
};
export type RootStack = {
  Main:
    | { screen: 'Explore' | 'Compare' | 'Tools' | 'Facts' | 'Learn' }
    | undefined;
  Detail: { kind: 'ages' | 'inventions'; id: string };
  Folder: { id: string };
  Study: { id: string };
  Completed: undefined;
};
