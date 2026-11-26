import { UserState } from '../types';

const STORAGE_KEY = 'pharmdrill_state_v1';
const THEME_KEY = 'pharmdrill_theme_v1';

export function createInitialState(): UserState {
  return {
    turn: 0,
    sessionAnswered: 0,
    sessionCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    cards: {},
  };
}

export function loadUserState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return {
      turn: typeof parsed.turn === 'number' ? parsed.turn : 0,
      sessionAnswered: 0, // reset per browser session
      sessionCorrect: 0,
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
      cards: parsed.cards && typeof parsed.cards === 'object' ? parsed.cards : {},
    };
  } catch {
    return createInitialState();
  }
}

export function saveUserState(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

export function clearUserState(): UserState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return createInitialState();
}

export type ThemeMode = 'light' | 'dark';

export function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore
  }
}
