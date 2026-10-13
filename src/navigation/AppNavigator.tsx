import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStack } from '../types';
import { useApp } from '../store/AppStore';
import { colors } from '../components/UI';
import { ExploreScreen } from '../screens/ExploreScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CompareScreen } from '../screens/CompareScreen';
import { FactsScreen } from '../screens/FactsScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { CompletedScreen, LearnScreen } from '../screens/LearnScreen';
import { FolderScreen, StudyScreen } from '../screens/FlashcardScreen';
import { LoaderScreen, OnboardingScreen } from '../screens/WelcomeScreen';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { renderBottomBar } from './BottomBar';
const Stack = createNativeStackNavigator<RootStack>();
const Tab = createBottomTabNavigator();
function MainTabs() {
  const reduced = useReducedMotion();
  return (
    <Tab.Navigator
      tabBar={renderBottomBar}
      screenOptions={{
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Compare" component={CompareScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="Facts" component={FactsScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
    </Tab.Navigator>
  );
}
export function AppNavigator() {
  const { state, ready } = useApp();
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  if (!loaded) return <LoaderScreen onDone={() => setLoaded(true)} />;
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  if (!state.onboarded) return <OnboardingScreen />;
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.bg,
          card: colors.panel,
          text: colors.text,
          primary: colors.orange,
          border: colors.line,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: reduced ? 'none' : 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Folder" component={FolderScreen} />
        <Stack.Screen name="Study" component={StudyScreen} />
        <Stack.Screen name="Completed" component={CompletedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
