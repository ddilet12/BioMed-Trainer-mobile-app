import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { AppLanguage, supportedLanguages } from '@/i18n';
import { AVAILABLE_LESSONS } from '@/constants/app';

export type Language = AppLanguage;

type StudyState = {
  completedLessons: string[];
  language: Language;
  languageSelected: boolean;
  streak: number;
  /** Local calendar day (YYYY-MM-DD) of the last completed lesson. */
  lastStudyDate: string | null;
  hasOnboarded: boolean;
};

type StudyContextValue = StudyState & {
  hydrated: boolean;
  /** Completed lessons among those available in the app. */
  completedCount: number;
  totalLessons: number;
  /** 0–100, based on available lessons only. */
  progressPercent: number;
  completeLesson: (lessonId: string) => void;
  setLanguage: (language: Language) => void;
  finishOnboarding: () => void;
};

const STORAGE_KEY = 'biomed-trainer-study-state';
const initialState: StudyState = {
  completedLessons: [],
  language: 'ru',
  languageSelected: false,
  streak: 0,
  lastStudyDate: null,
  hasOnboarded: false,
};

function dayKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function previousDayKey(date: Date) {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return dayKey(prev);
}

/** A streak only counts while the last lesson was today or yesterday. */
function currentStreak(streak: number, lastStudyDate: string | null, now = new Date()) {
  if (!lastStudyDate) return 0;
  return lastStudyDate === dayKey(now) || lastStudyDate === previousDayKey(now) ? streak : 0;
}

function nextStreak(state: StudyState, now = new Date()) {
  const today = dayKey(now);
  if (state.lastStudyDate === today) return state.streak;
  return state.lastStudyDate === previousDayKey(now) ? state.streak + 1 : 1;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StudyState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<StudyState>;
          const hasUserLanguage = parsed.languageSelected === true && supportedLanguages.includes(parsed.language as AppLanguage);
          const nextLanguage = hasUserLanguage ? parsed.language as AppLanguage : 'ru';
          const lastStudyDate = typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null;
          const streak = currentStreak(typeof parsed.streak === 'number' ? parsed.streak : 0, lastStudyDate);
          setState({ ...initialState, ...parsed, streak, lastStudyDate, language: nextLanguage, languageSelected: hasUserLanguage });
          void i18n.changeLanguage(nextLanguage);
        } else {
          void i18n.changeLanguage('ru');
        }
      })
      .catch(() => {
        void i18n.changeLanguage('ru');
      })
      .finally(() => setHydrated(true));
  }, []);

  const persist = (next: StudyState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  };

  const value = useMemo<StudyContextValue>(() => {
    const completedCount = AVAILABLE_LESSONS.filter((id) => state.completedLessons.includes(id)).length;
    const totalLessons = AVAILABLE_LESSONS.length;
    return {
      ...state,
      hydrated,
      completedCount,
      totalLessons,
      progressPercent: totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0,
      completeLesson: (lessonId) => {
        const completedLessons = state.completedLessons.includes(lessonId) ? state.completedLessons : [...state.completedLessons, lessonId];
        persist({ ...state, completedLessons, streak: nextStreak(state), lastStudyDate: dayKey(new Date()) });
      },
      setLanguage: (language) => {
        void i18n.changeLanguage(language);
        persist({ ...state, language, languageSelected: true });
      },
      finishOnboarding: () => persist({ ...state, hasOnboarded: true }),
    };
  }, [hydrated, state]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside StudyProvider');
  return context;
}