# Chronogold · Past Centuries

React Native and TypeScript mobile application with React Navigation. All images are bundled from `src/assets`; all historical library content comes from the supplied text files. The app works offline.

## Run

```sh
npm install
npm start
```

In another terminal:

```sh
npm run ios
npm run android
```

For the initial iOS setup, run `bundle install` and `cd ios && bundle exec pod install`. CocoaPods must use a modern Ruby runtime matching the project's bundle. Pods have already been installed in this checkout.

## Structure

- `src/navigation`: typed native stack and floating bottom navigation
- `src/screens`: loader, onboarding, Explore, Compare, Tools, Facts, Learn, detail and study screens
- `src/components`: reusable controls, sheets, forms and radar charts
- `src/store`: persistent application state with serialized AsyncStorage writes
- `src/data/library.json`: 37 periods, 60 inventions, 67 facts, 90 research prompts and 58 flashcards in 7 folders
- `src/utils`: year calculations and score helpers
- `src/assets`: supplied local artwork

## Behavior

The local WebView loader animates for four seconds. Onboarding is remembered after Begin or Skip. Saved entries, created entries, comparison selections, personal ratings, research notes, completed research, folders and flashcard mastery persist across app restarts. User activity starts empty.

Explore supports search, favorites, details and creation. Compare accepts up to three periods. The source material contains no numerical power ratings; users enter their own 0–100 ratings in each period's detail page before using radar charts and rankings.

Tools calculates durations without a year zero, gaps between entered events and approximate journey times. Journey estimates use an explicit distance or city coordinates with a 1.35 route multiplier and assumed daily speeds. These are planning estimates, not verified historical routes.

Facts supports categories, search, daily rotation, favorites, creation and the native share sheet. Learn supports research notes and completion, folder creation/renaming/deletion, flashcard creation/editing/deletion, answer reveal and learned/review states.

## Checks

```sh
npm run typecheck
npm test -- --runInBand --watchman=false
npm run lint
```

Tests cover BCE/CE boundaries, library consistency, storage restoration, onboarding, loader completion, fact creation, comparison selection limits and study progress.
