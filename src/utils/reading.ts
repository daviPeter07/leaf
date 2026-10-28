import { addDays, format, isToday, isYesterday, parseISO, startOfWeek, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { Book, ReadingSession } from '@/types/reading';

export type ReadingDay = {
  key: string;
  pages: number;
  minutes: number;
  sessions: ReadingSession[];
};

export function createId(value: string) {
  return `${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
}

export function getBookProgress(book: Book) {
  return book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
}

export function getBookTotals(bookId: string, sessions: ReadingSession[]) {
  const bookSessions = sessions.filter((session) => session.bookId === bookId);

  return {
    sessions: bookSessions,
    pages: bookSessions.reduce((total, session) => total + session.pagesRead, 0),
    minutes: bookSessions.reduce((total, session) => total + session.minutesRead, 0),
  };
}

// Day keys use the device's local date, so a late-night reading counts for the day it happened.
export function getDayKey(date: string | Date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDayLabel(key: string) {
  const date = parseISO(key);

  if (isToday(date)) {
    return 'Hoje';
  }

  if (isYesterday(date)) {
    return 'Ontem';
  }

  return capitalize(format(date, "EEEE, d 'de' MMM", { locale: ptBR }));
}

export function formatLongDate(date: Date) {
  return capitalize(format(date, "EEEE, d 'de' MMMM", { locale: ptBR }));
}

export function formatSessionTime(date: string) {
  const parsed = parseISO(date);
  const day = isToday(parsed) ? 'Hoje' : isYesterday(parsed) ? 'Ontem' : format(parsed, "d 'de' MMM", { locale: ptBR });

  return `${day} às ${format(parsed, 'HH:mm')}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}min`;
  }

  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

// Reading pace in the Strava style: minutes and seconds per page.
export function formatPace(minutes: number, pages: number) {
  if (pages <= 0 || minutes <= 0) {
    return '–';
  }

  const totalSeconds = Math.round((minutes * 60) / pages);
  const paceMinutes = Math.floor(totalSeconds / 60);
  const paceSeconds = totalSeconds % 60;

  return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
}

export function getReadingDays(sessions: ReadingSession[]): ReadingDay[] {
  const days = new Map<string, ReadingDay>();

  for (const session of sessions) {
    const key = getDayKey(session.date);
    const day = days.get(key) ?? { key, pages: 0, minutes: 0, sessions: [] };

    day.pages += session.pagesRead;
    day.minutes += session.minutesRead;
    day.sessions.push(session);
    days.set(key, day);
  }

  return [...days.values()].sort((a, b) => b.key.localeCompare(a.key));
}

export function getWeekSummary(sessions: ReadingSession[]) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const key = getDayKey(date);
    const daySessions = sessions.filter((session) => getDayKey(session.date) === key);

    return {
      key,
      label: format(date, 'EEEEE', { locale: ptBR }).toUpperCase(),
      isToday: isToday(date),
      pages: daySessions.reduce((total, session) => total + session.pagesRead, 0),
      minutes: daySessions.reduce((total, session) => total + session.minutesRead, 0),
    };
  });

  return {
    days,
    pages: days.reduce((total, day) => total + day.pages, 0),
    minutes: days.reduce((total, day) => total + day.minutes, 0),
    daysRead: days.filter((day) => day.pages > 0).length,
  };
}

// Consecutive reading days ending today, or yesterday if today has no reading yet.
export function getStreak(sessions: ReadingSession[]) {
  const keys = new Set(sessions.map((session) => getDayKey(session.date)));
  let cursor = keys.has(getDayKey(new Date())) ? new Date() : subDays(new Date(), 1);
  let streak = 0;

  while (keys.has(getDayKey(cursor))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}
